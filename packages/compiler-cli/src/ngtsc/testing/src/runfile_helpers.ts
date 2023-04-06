/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <reference types="node" />

import {runfiles} from '@bazel/runfiles';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Gets all built Angular NPM package artifacts by querying the Bazel runfiles.
 * In case there is a runfiles manifest (e.g. on Windows), the packages are resolved
 * through the manifest because the runfiles are not symlinked and cannot be searched
 * within the real filesystem.
 *
 * 通过查询 Bazel 运行文件来获取所有构建的 Angular NPM 包工件。如果有 runfiles 清单（例如在 Windows
 * 上），则包将通过清单解析，因为 runfiles 没有符号链接，并且无法在真实文件系统中搜索。
 *
 */
export function getAngularPackagesFromRunfiles() {
  // Path to the Bazel runfiles manifest if present. This file is present if runfiles are
  // not symlinked into the runfiles directory.
  const runfilesManifestPath = process.env.RUNFILES_MANIFEST_FILE;

  if (!runfilesManifestPath) {
    const packageRunfilesDir = path.join(process.env.RUNFILES!, 'angular/packages');

    return fs.readdirSync(packageRunfilesDir)
        .map(name => ({name, pkgPath: path.join(packageRunfilesDir, name, 'npm_package/')}))
        .filter(({pkgPath}) => fs.existsSync(pkgPath));
  }

  return fs.readFileSync(runfilesManifestPath, 'utf8')
      .split('\n')
      .map(mapping => mapping.split(' '))
      .filter(([runfilePath]) => runfilePath.match(/^angular\/packages\/[\w-]+\/npm_package$/))
      .map(([runfilePath, realPath]) => ({
             name: path.relative('angular/packages', runfilePath).split(path.sep)[0],
             pkgPath: realPath,
           }));
}

/**
 * Resolves a file or directory from the Bazel runfiles.
 *
 * 从 Bazel 运行文件解析 NPM 包。
 *
 */
export function resolveFromRunfiles(manifestPath: string) {
  return runfiles.resolve(manifestPath);
}
