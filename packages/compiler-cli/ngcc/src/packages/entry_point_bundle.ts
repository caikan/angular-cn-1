/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import ts from 'typescript';

import {AbsoluteFsPath, FileSystem, ReadonlyFileSystem} from '../../../src/ngtsc/file_system';
import {DtsProcessing} from '../execution/tasks/api';
import {PathMappings} from '../path_mappings';

import {adjustElementAccessExports} from './adjust_cjs_umd_exports';
import {BundleProgram, makeBundleProgram} from './bundle_program';
import {EntryPoint, EntryPointFormat} from './entry_point';
import {NgccDtsCompilerHost, NgccSourcesCompilerHost} from './ngcc_compiler_host';
import {EntryPointFileCache, SharedFileCache} from './source_file_cache';

/**
 * A bundle of files and paths (and TS programs) that correspond to a particular
 * format of a package entry-point.
 *
 * 与包入口点的特定格式对应的文件和路径（和 TS 程序）包。
 *
 */
export interface EntryPointBundle {
  entryPoint: EntryPoint;
  format: EntryPointFormat;
  isCore: boolean;
  isFlatCore: boolean;
  rootDirs: AbsoluteFsPath[];
  src: BundleProgram;
  dts: BundleProgram|null;
  dtsProcessing: DtsProcessing;
  enableI18nLegacyMessageIdFormat: boolean;
}

/**
 * When processing UMD or CommonJS bundles the source text is preprocessed to transform export
 * declarations using element access expressions into property access expressions, as otherwise ngcc
 * would not recognize these export declarations. See `adjustElementAccessExports` for more
 * information.
 *
 * 在处理 UMD 或 CommonJS
 * 包时，源文本会被预处理，以将使用元素访问表达式的导出声明转换为属性访问表达式，否则 ngcc
 * 将无法识别这些导出声明。有关更多信息，请参阅 `adjustElementAccessExports` 。
 *
 */
function createSourceTextProcessor(format: EntryPointFormat): (sourceText: string) => string {
  if (format === 'umd' || format === 'commonjs') {
    return adjustElementAccessExports;
  } else {
    return sourceText => sourceText;
  }
}

/**
 * Get an object that describes a formatted bundle for an entry-point.
 *
 * 获取一个描述入口点的格式化包的对象。
 *
 * @param fs The current file-system being used.
 *
 * 当前正在使用的文件系统。
 *
 * @param entryPoint The entry-point that contains the bundle.
 *
 * 包含包的入口点。
 *
 * @param sharedFileCache The cache to use for source files that are shared across all entry-points.
 *
 * 用于在所有入口点共享的源文件的缓存。
 *
 * @param moduleResolutionCache The module resolution cache to use.
 *
 * 要使用的模块解析缓存。
 *
 * @param formatPath The path to the source files for this bundle.
 *
 * 此包的源文件的路径。
 *
 * @param isCore This entry point is the Angular core package.
 *
 * 此入口点是 Angular 核心包。
 *
 * @param format The underlying format of the bundle.
 *
 * 包的基础格式。
 *
 * @param dtsProcessing Whether to transform the typings along with this bundle.
 *
 * 是否将类型与此包一起转换。
 *
 * @param pathMappings An optional set of mappings to use when compiling files.
 *
 * 编译文件时要使用的可选映射集。
 *
 * @param mirrorDtsFromSrc If true then the `dts` program will contain additional files that
 * were guessed by mapping the `src` files to `dts` files.
 *
 * 如果为 true，则 `dts` 程序将包含通过将 `src` 文件映射到 `dts` 文件来猜测的其他文件。
 *
 * @param enableI18nLegacyMessageIdFormat Whether to render legacy message ids for i18n messages in
 * component templates.
 *
 * 是否为组件模板中的 i18n 消息呈现旧版消息 ID。
 *
 */
export function makeEntryPointBundle(
    fs: FileSystem, entryPoint: EntryPoint, sharedFileCache: SharedFileCache,
    moduleResolutionCache: ts.ModuleResolutionCache, formatPath: string, isCore: boolean,
    format: EntryPointFormat, dtsProcessing: DtsProcessing, pathMappings?: PathMappings,
    mirrorDtsFromSrc: boolean = false,
    enableI18nLegacyMessageIdFormat: boolean = true): EntryPointBundle {
  // Create the TS program and necessary helpers.
  const rootDir = entryPoint.packagePath;
  const options: ts
      .CompilerOptions = {allowJs: true, maxNodeModuleJsDepth: Infinity, rootDir, ...pathMappings};
  const processSourceText = createSourceTextProcessor(format);
  const entryPointCache = new EntryPointFileCache(fs, sharedFileCache, processSourceText);
  const dtsHost = new NgccDtsCompilerHost(fs, options, entryPointCache, moduleResolutionCache);
  const srcHost = new NgccSourcesCompilerHost(
      fs, options, entryPointCache, moduleResolutionCache, entryPoint.packagePath);

  // Create the bundle programs, as necessary.
  const absFormatPath = fs.resolve(entryPoint.path, formatPath);
  const typingsPath = fs.resolve(entryPoint.path, entryPoint.typings);
  const src = makeBundleProgram(
      fs, isCore, entryPoint.packagePath, absFormatPath, 'r3_symbols.js', options, srcHost);
  const additionalDtsFiles = dtsProcessing !== DtsProcessing.No && mirrorDtsFromSrc ?
      computePotentialDtsFilesFromJsFiles(fs, src.program, absFormatPath, typingsPath) :
      [];
  const dts = dtsProcessing !== DtsProcessing.No ?
      makeBundleProgram(
          fs, isCore, entryPoint.packagePath, typingsPath, 'r3_symbols.d.ts',
          {...options, allowJs: false}, dtsHost, additionalDtsFiles) :
      null;
  const isFlatCore = isCore && src.r3SymbolsFile === null;

  return {
    entryPoint,
    format,
    rootDirs: [rootDir],
    isCore,
    isFlatCore,
    src,
    dts,
    dtsProcessing,
    enableI18nLegacyMessageIdFormat
  };
}

function computePotentialDtsFilesFromJsFiles(
    fs: ReadonlyFileSystem, srcProgram: ts.Program, formatPath: AbsoluteFsPath,
    typingsPath: AbsoluteFsPath) {
  const formatRoot = fs.dirname(formatPath);
  const typingsRoot = fs.dirname(typingsPath);
  const additionalFiles: AbsoluteFsPath[] = [];
  for (const sf of srcProgram.getSourceFiles()) {
    if (!sf.fileName.endsWith('.js')) {
      continue;
    }

    // Given a source file at e.g. `esm2015/src/some/nested/index.js`, try to resolve the
    // declaration file under the typings root in `src/some/nested/index.d.ts`.
    const mirroredDtsPath =
        fs.resolve(typingsRoot, fs.relative(formatRoot, sf.fileName.replace(/\.js$/, '.d.ts')));
    if (fs.exists(mirroredDtsPath)) {
      additionalFiles.push(mirroredDtsPath);
    }
  }
  return additionalFiles;
}
