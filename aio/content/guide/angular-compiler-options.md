# Angular compiler options

# Angular 编译器选项

When you use [ahead-of-time compilation (AOT)](guide/aot-compiler), you can control how your application is compiled by specifying *template* compiler options in the [TypeScript configuration file](guide/typescript-configuration).

使用 [预先（AoT）编译](guide/aot-compiler) 时，可以通过在 [TypeScript 配置文件中](guide/typescript-configuration)指定*模板*编译器选项来控制如何编译应用程序。

The template options object, `angularCompilerOptions`, is a sibling to the `compilerOptions` object that supplies standard options to the TypeScript compiler.

模板选项对象 `angularCompilerOptions` 和为 TypeScript 编译器提供标准选项的 `compilerOptions` 对象是兄弟。

<code-example header="tsconfig.json" path="angular-compiler-options/tsconfig.json" region="angular-compiler-options"></code-example>

<a id="tsconfig-extends"></a>

## Configuration inheritance with extends

## 用 `extends` 语法配置继承方式

Like the TypeScript compiler, the Angular AOT compiler also supports `extends` in the `angularCompilerOptions` section of the TypeScript configuration file.
The `extends` property is at the top level, parallel to `compilerOptions` and `angularCompilerOptions`.

像 TypeScript 编译器一样，Angular 的 AOT 编译器也支持对 TypeScript 配置文件中的 `angularCompilerOptions` 进行 `extends`。`extends` 属性位于顶层，和 `compilerOptions` 和 `angularCompilerOptions` 平级。

A TypeScript configuration can inherit settings from another file using the `extends` property.
The configuration options from the base file are loaded first, then overridden by those in the inheriting configuration file.

使用 `extends` 属性，TypeScript 配置可以从另一个文件中继承设置。首先从基础文件中加载配置项，然后被继承自它的配置文件中的配置项覆写。

For example:

比如：

<code-example header="tsconfig.app.json" path="angular-compiler-options/tsconfig.app.json" region="angular-compiler-options-app"></code-example>

For more information, see the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

欲知详情，参阅 [TypeScript 手册](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。

## Template options

## 模板选项

The following options are available for configuring the AOT template compiler.

以下选项可用于配置 AoT 模板编译器。

### `allowEmptyCodegenFiles`

When `true`, create all possible files even if they are empty.
Default is `false`.
Used by the Bazel build rules to simplify how Bazel rules track file dependencies.
Do not use this option outside of the Bazel rules.

如果为 `true`，则创建所有可能的文件 —— 即使它们为空。默认值为 `false`。Bazel 的构建规则使用它来简化 Bazel 规则跟踪文件依赖性的方式。不要在 Bazel 规则之外使用此选项。

### `annotationsAs`

Modifies how Angular-specific annotations are emitted to improve tree-shaking.
Non-Angular annotations are not affected.
One of `static fields` or `decorators`. The default value is `static fields`. 

修改 Angular 专有注解的生成方式，以改善摇树优化。非 Angular 注解不受影响。可选值为 `static fields` 或 `decorators`。默认值为 `static fields`。

* By default, the compiler replaces decorators with a static field in the class, which allows advanced tree-shakers like [Closure compiler](https://github.com/google/closure-compiler) to remove unused classes

  默认情况下，编译器会用类中的静态字段替换装饰器，这允许像 [Closure 编译器](https://github.com/google/closure-compiler)这样的高级摇树器删除未使用的类。

* The `decorators` value leaves the decorators in place, which makes compilation faster.
  TypeScript emits calls to the `__decorate` helper.
  Use `--emitDecoratorMetadata` for runtime reflection.

  `decorators` 值会将装饰器保留在原处，这将使编译速度更快。TypeScript 会生成对辅助器 `__decorate` 的调用。使用 `--emitDecoratorMetadata` 以支持运行时反射。

  <div class="alert is-helpful">

  **NOTE**: <br />
  That the resulting code cannot tree-shake properly.

  **注意**：<br />
  这样生成的代码将无法被正确地摇树优化。

  </div>

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

When `true`, use [Tsickle](https://github.com/angular/tsickle) to annotate the emitted JavaScript with [JSDoc](https://jsdoc.app) comments needed by the [Closure Compiler](https://github.com/google/closure-compiler).
Default is `false`.

如果为 `true`，则使用 [Tsickle](https://github.com/angular/tsickle) 来用 [JSDoc](https://jsdoc.app) 对生成的 JavaScript 代码进行注解，这些注释是供 [Closure 编译器](https://github.com/google/closure-compiler) 使用的。默认值为 `false`。

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Specifies the compilation mode to use.
The following modes are available:

指定要使用的编译模式。可以使用以下模式：

| Modes       | Details                                                                                             |
| :---------- | :-------------------------------------------------------------------------------------------------- |
| 模式        | 详情                                                                                                |
| `'full'`    | Generates fully AOT-compiled code according to the version of Angular that is currently being used. |
| `'full'`    | 根据当前使用的 Angular 版本生成完全 AOT 编译的代码。                                                |
| `'partial'` | Generates code in a stable, but intermediate form suitable for a published library.                 |
| `'partial'` | 生成稳定的中间代码，适用于已发布的库。                                                              |

The default value is `'full'`.

默认值为 `'full'`。

### `disableExpressionLowering`

When `true`, the default, transforms code that is or could be used in an annotation, to allow it to be imported from template factory modules.
See [metadata rewriting](guide/aot-compiler#metadata-rewriting) for more information.

如果为 `true`（默认值），则转换在注解中使用或允许使用的代码，以允许从模板的工厂模块导入代码。欲知详情，参阅[元数据重写](guide/aot-compiler#metadata-rewriting)。

When `false`, disables this rewriting, requiring the rewriting to be done manually.

如果为 `false`，则禁用此重写，你必须手动进行重写。

### `disableTypeScriptVersionCheck`

When `true`, the compiler does not look at the TypeScript version and does not report an error when an unsupported version of TypeScript is used.
Not recommended, as unsupported versions of TypeScript might have undefined behavior.
Default is `false`.

如果为 `true`，则在使用不受支持的 TypeScript 版本时，编译器不会检查 TypeScript 版本，并且不会报错。不建议使用，因为不受支持的 TypeScript 版本可能具有未定义的行为。默认值为 `false`。

### `enableI18nLegacyMessageIdFormat`

Instructs the Angular template compiler to create legacy ids for messages that are tagged in templates by the `i18n` attribute.
See [Mark text for translations][AioGuideI18nCommonPrepareMarkTextInComponentTemplate] for more information about marking messages for localization.

指示 Angular 模板编译器为模板中用 `i18n` 属性标出的消息创建旧版 ID。关于为本地化而对消息进行标记的更多信息，参阅[标记要翻译的文本][AioGuideI18nCommonPrepareMarkTextInComponentTemplate]

Set this option to `false` unless your project relies upon translations that were created earlier using legacy IDs.
Default is `true`.

除非你的项目依赖先前已用旧版 ID 创建的翻译，否则请将此选项设置为 `false`。默认值为 `true`。

The pre-Ivy message extraction tooling created a variety of legacy formats for extracted message IDs.
These message formats have some issues, such as whitespace handling and reliance upon information inside the original HTML of a template.

Ivy 之前版本的消息提取工具为所提取的消息 id 创建了多种旧格式。这些消息格式存在一些问题，比如对空白字符的处理和对模板原始 HTML 内部信息的依赖。

The new message format is more resilient to whitespace changes, is the same across all translation file formats, and can be created directly from calls to `$localize`.
This allows `$localize` messages in application code to use the same ID as identical `i18n` messages in component templates.

新的消息格式对空白字符的改动更宽容，在所有翻译文件格式中都相同，并且可以直接通过调用 `$localize` 来创建。这允许应用程序代码中的 `$localize` 消息使用与组件模板中 `i18n` 消息完全相同的 id。

### `enableResourceInlining`

When `true`, replaces the `templateUrl` and `styleUrls` properties in all `@Component` decorators with inline content in the `template` and `styles` properties.

当为 `true` 时，将所有 `@Component` 装饰器中的 `templateUrl` 和 `styleUrls` 属性替换为 `template` 和 `styles` 属性中的内联内容。

When enabled, the `.js` output of `ngc` does not include any lazy-loaded template or style URLs.

启用后，`ngc` 的 `.js` 输出不会包含任何惰性加载的模板或样式 URL。

For library projects created with the Angular CLI, the development configuration default is `true`.

对于使用 Angular CLI 创建的库项目，dev 配置下默认为 `true`。

<a id="enablelegacytemplate"></a>

### `enableLegacyTemplate`

When `true`, enables the deprecated `<template>` element in place of `<ng-template>`.
Default is `false`.
Might be required by some third-party Angular libraries.

如果为 `true`，则把 `<ng-template>` 替换为以弃用的 `<template>` 元素。默认值为 `false`。某些第三方 Angular 库可能需要它。

### `flatModuleId`

The module ID to use for importing a flat module (when `flatModuleOutFile` is `true`).
References created by the template compiler use this module name when importing symbols from the flat module.
Ignored if `flatModuleOutFile` is `false`.

用于导入扁平模块的模块 ID（当 `flatModuleOutFile` 为 `true` 时）。从扁平模块中导入符号时，模板编译器创建的引用将使用该模块的名称。如果 `flatModuleOutFile` 为 `false` 则忽略。

### `flatModuleOutFile`

When `true`, generates a flat module index of the given filename and the corresponding flat module metadata.
Use to create flat modules that are packaged similarly to `@angular/core` and `@angular/common`.
When this option is used, the `package.json` for the library should refer to the created flat module index instead of the library index file.

为 `true` 时，将生成指定文件名和相应扁平模块元数据的扁平模块索引。用于创建像 `@angular/core` 和 `@angular/common` 这样打包的扁平模块。使用此选项时，库的 `package.json` 应引用所创建的扁平模块索引而不是库的索引文件。

Produces only one `.metadata.json` file, which contains all the metadata necessary for symbols exported from the library index.
In the created `.ngfactory.js` files, the flat module index is used to import symbols. Symbols that include both the public API from the library index as well as shrouded internal symbols.

它只会生成一个 `.metadata.json` 文件，该文件包含从库索引中导出的符号所需的全部元数据。在创建的 `.ngfactory.js` 文件中，扁平模块索引用于导入符号，这些符号既包括库索引中的公共 API，也包括缩进的内部符号。

By default the `.ts` file supplied in the `files` field is assumed to be the library index.
If more than one `.ts` file is specified, `libraryIndex` is used to select the file to use.
If more than one `.ts` file is supplied without a `libraryIndex`, an error is produced.

默认情况下，`files` 字段中提供的 `.ts` 文件会被当做库索引。如果指定了多个 `.ts` 文件，则使用 `libraryIndex` 选择要使用的文件。如果提供了多个不带 `libraryIndex` `.ts` 文件，则会产生错误。

A flat module index `.d.ts` and `.js` is created with the given `flatModuleOutFile` name in the same location as the library index `.d.ts` file.

使用指定的 `flatModuleOutFile` 名在与库索引 `.d.ts` 文件相同的位置创建扁平模块索引 `.d.ts` 和 `.js`。

For example, if a library uses the `public_api.ts` file as the library index of the module, the `tsconfig.json` `files` field would be `["public_api.ts"]`.
The `flatModuleOutFile` option could then be set, for example, to `"index.js"`, which produces `index.d.ts` and `index.metadata.json` files.
The `module` field of the library's `package.json` would be `"index.js"` and the `typings` field would be `"index.d.ts"`.

比如，如果一个库使用 `public_api.ts` 文件作为模块的库索引，则 `tsconfig.json` 的 `files` 字段就是 `["public_api.ts"]`。然后，比如把 `flatModuleOutFile` 选项设置为 `"index.js"`，这将生成 `index.d.ts` 和 `index.metadata.json` 文件。该库的 `package.json` 的 `module` 字段中就会是 `"index.js"`，而 `typings` 字段将是 `"index.d.ts"`。

### `fullTemplateTypeCheck`

When `true`, the recommended value, enables the [binding expression validation](guide/aot-compiler#binding-expression-validation) phase of the template compiler. This phase uses TypeScript to verify binding expressions.
For more information, see [Template type checking](guide/template-typecheck).

为 `true`（推荐）时，会启用模板编译器的[绑定表达式验证](guide/aot-compiler#binding-expression-validation)阶段。该阶段会使用 TypeScript 来验证绑定表达式。欲知详情，参阅[模板类型检查](guide/template-typecheck)。

Default is `false`, but when you use the Angular CLI command `ng new --strict`, it is set to `true` in the new project's configuration.

默认值为 `false`，但是当你使用 Angular CLI 命令 `ng new --strict` 时，默认生成的项目配置中会将其设置为 `true`。

<div class="alert is-important">

The `fullTemplateTypeCheck` option has been deprecated in Angular 13 in favor of the `strictTemplates` family of compiler options.

`fullTemplateTypeCheck` 选项已经在 Angular 13 中弃用，改为使用 `strictTemplates` 家族的编译器选项。

</div>

### `generateCodeForLibraries`

When `true`, creates factory files (`.ngfactory.js` and `.ngstyle.js`) for `.d.ts` files with a corresponding `.metadata.json` file. The default value is `true`.

如果为 `true`，就会为 `.d.ts` 和相应的 `.metadata.json` 创建工厂文件（`.ngfactory.js` 和 `.ngstyle.js`）。默认值为 `true`。

When `false`, factory files are created only for `.ts` files.
Do this when using factory summaries.

如果为 `false`，则仅为 `.ts` 文件生成工厂文件。当要使用工厂摘要（summary）时，请这么设置。

### `preserveWhitespaces`

When `false`, the default, removes blank text nodes from compiled templates, which results in smaller emitted template factory modules.
Set to `true` to preserve blank text nodes.

如果为 `false`（默认值），则从编译的模板中删除空白文本节点，这将生成较小的模板工厂模块。设置为 `true` 以保留空白文本节点。

### `skipMetadataEmit`

When `true`, does not produce `.metadata.json` files.
Default is `false`.

为 `true` 时，不生成 `.metadata.json` 文件。默认值为 `false`。

The `.metadata.json` files contain information needed by the template compiler from a `.ts` file that is not included in the `.d.ts` file produced by the TypeScript compiler.
This information includes, for example, the content of annotations, such as a component's template, which TypeScript emits to the `.js` file but not to the `.d.ts` file.

`.metadata.json` 文件包含模板编译器从 `.ts` 文件中获得的信息，该信息未包含在 TypeScript 编译器生成的 `.d.ts` 文件中。该信息包括注解的内容（比如组件的模板）等，TypeScript 会将该注解的内容发送到 `.js` 文件中，但不会发送到 `.d.ts` 文件。

You can set to `true` when using factory summaries, because the factory summaries include a copy of the information that is in the `.metadata.json` file.

你可以在使用工厂摘要（summary）中将其设置为 `true`，因为工厂摘要中包括 `.metadata.json` 文件中信息的副本。

Set to `true` if you are using TypeScript's `--outFile` option, because the metadata files are not valid for this style of TypeScript output.
The Angular community does not recommend using `--outFile` with Angular.
Use a bundler, such as [webpack](https://webpack.js.org), instead.

如果要使用 TypeScript 的 `--outFile` 选项，则设置为 `true`，因为元数据文件对于这种 TypeScript 输出风格无效。但是，Angular 社区不建议将 `--outFile` 和 Angular 一起使用。请使用打包程序，比如 [webpack](https://webpack.js.org)。

### `skipTemplateCodegen`

When `true`, does not emit `.ngfactory.js` and `.ngstyle.js` files.
This turns off most of the template compiler and disables the reporting of template diagnostics.

为 `true` 时，不生成 `.ngfactory.js` 和 `.ngstyle.js` 文件。这将关闭大多数模板编译器，并禁用模板诊断报告。

Can be used to instruct the template compiler to produce `.metadata.json` files for distribution with an `npm` package. This avoids the production of `.ngfactory.js` and `.ngstyle.js` files that cannot be distributed to `npm`.

可用于指示模板编译器生成 `.metadata.json` 文件，以使用 `npm` 软件包进行分发，同时避免产生无法分发至 `npm` 的 `.ngfactory.js` 和 `.ngstyle.js` 文件。

For library projects created with the Angular CLI, the development configuration default is `true`.

对于使用 Angular CLI 创建的库项目，dev 配置默认为 `true`。

### `strictMetadataEmit`

When `true`, reports an error to the `.metadata.json` file if `"skipMetadataEmit"` is `false`.
Default is `false`.
Use only when `"skipMetadataEmit"` is `false` and `"skipTemplateCodegen"` is `true`.

为 `true` 时，如果 `"skipMetadataEmit"` 为 `false` 则向 `.metadata.json` 文件中报告错误。默认值为 `false`。只在 `"skipMetadataEmit"` 为 `false` 且 `"skipTemplateCodegen"` 为 `true` 时使用。

This option is intended to verify the `.metadata.json` files emitted for bundling with an `npm` package.
The validation is strict and can emit errors for metadata that would never produce an error when used by the template compiler.
You can choose to suppress the error emitted by this option for an exported symbol by including `@dynamic` in the comment documenting the symbol.

该选项是为了验证为生成 `npm` 包而产生的 `.metadata.json` 文件。这种验证是严格的，并且会报告元数据中的错误，以免当模板编译器使用它时再出错。你可以通过在某个导出符号的注释文档中使用 `@dynamic` 注解来暂时防止（suppress）该选项报告错误。

It is valid for `.metadata.json` files to contain errors.
The template compiler reports these errors if the metadata is used to determine the contents of an annotation.
The metadata collector cannot predict the symbols that are designed for use in an annotation. It preemptively includes error nodes in the metadata for the exported symbols.
The template compiler can then use the error nodes to report an error if these symbols are used.

`.metadata.json` 文件即使包含错误也是有效的。如果这些元数据用来确定注解的内容，则模板编译器会报告这些错误。元数据收集器无法预测哪些符号是为了在注解中使用而设计的。它会先在元数据中为导出的符号中包含错误节点。然后，如果使用了这些符号，则模板编译器可以使用这些错误节点来报告错误。

If the client of a library intends to use a symbol in an annotation, the template compiler does not normally report this. It gets reported after the client actually uses the symbol.
This option allows detection of these errors during the build phase of the library and is used, for example, in producing Angular libraries themselves.

如果库的客户代码打算在注解中使用某个符号，则模板编译器通常不会直接报错。而是在客户方实际用到该符号之后才报错。此选项允许你在库的构建阶段就检测到这些错误，比如用于生成 Angular 库本身时。

For library projects created with the Angular CLI, the development configuration default is `true`.

对于使用 Angular CLI 创建的库项目，dev 配置中默认为 `true`。

### `strictInjectionParameters`

When `true`, reports an error for a supplied parameter whose injection type cannot be determined.
When `false`, constructor parameters of classes marked with `@Injectable` whose type cannot be resolved produce a warning.
The recommended value is `true`, but the default value is `false`.

如果为 `true`，则报告所提供的参数的错误，无法确定该参数的注入类型。如果为 `false`，则标记为 `@Injectable` 但其类型无法解析的类的构造函数参数会产生警告。
推荐的值为 `true`，但默认值为 `false`。

When you use the Angular CLI command `ng new --strict`, it is set to `true` in the created project's configuration.

当你使用 CLI 命令 `ng new --strict` 时，默认生成的项目配置中将其设置为 `true`。

### `strictTemplates`

When `true`, enables [strict template type checking](guide/template-typecheck#strict-mode).

如果为 `true`，则启用[严格的模板类型检查](guide/template-typecheck#strict-mode)。

The strictness flags that this option enables allow you to turn on and off specific types of strict template type checking.
See [troubleshooting template errors](guide/template-typecheck#troubleshooting-template-errors).

这些严格性标志允许你启用和禁用特定类型的严格模板类型检查。参阅[排除模板错误](guide/template-typecheck#troubleshooting-template-errors)。

When you use the Angular CLI command `ng new --strict`, it is set to `true` in the new project's configuration.

当你使用 Angular CLI 命令 `ng new --strict` 时，默认生成的项目配置中将其设置为 `true`。

### `trace`

When `true`, prints extra information while compiling templates.
Default is `false`.

如果为 `true`，则在编译模板时输出额外的信息。默认值为 `false`。

<a id="cli-options"></a>

## Command line options

## 命令行选项

Most of the time you interact with the Angular Compiler indirectly using Angular CLI. When debugging certain issues, you might find it useful to invoke the Angular Compiler directly.
You can use the `ngc` command provided by the `@angular/compiler-cli` npm package to call the compiler from the command line.

大多数时候你都会使用 Angular CLI 间接与 Angular 编译器交互。当调试某些问题时，你可能会发现直接调用 Angular 编译器很有用。你可以使用 `@angular/compiler-cli` npm 包提供的 `ngc` 命令从命令行调用编译器。

The `ngc` command is just a wrapper around TypeScript's `tsc` compiler command and is primarily configured via the `tsconfig.json` configuration options documented in [the previous sections](#angular-compiler-options).

`ngc` 命令只是 TypeScript 的 `tsc` 编译器命令的包装器，主要通过[前面部分](#angular-compiler-options)讲过的 `tsconfig.json` 配置选项进行配置。

Besides the configuration file, you can also use [`tsc` command line options](https://www.typescriptlang.org/docs/handbook/compiler-options.html) to configure `ngc`.

除这个配置文件之外，你还可以使用一些 [`tsc` 命令行选项](https://www.typescriptlang.org/docs/handbook/compiler-options.html)来配置 `ngc`。

<!-- links -->

[AioGuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n-common-prepare#mark-text-in-component-template "Mark text in component template - Prepare component for translation | Angular"

<!-- end links -->

@reviewed 2022-02-28
