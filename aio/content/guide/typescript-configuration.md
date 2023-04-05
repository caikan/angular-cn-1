# TypeScript configuration

# TypeScript 配置

TypeScript is a primary language for Angular application development.
It is a superset of JavaScript with design-time support for type safety and tooling.

TypeScript 是 Angular 应用开发中使用的主语言。它是 JavaScript 的“方言”之一，为类型安全和工具化而做了设计期支持。

Browsers can't execute TypeScript directly.
Typescript must be "transpiled" into JavaScript using the *tsc* compiler, which requires some configuration.

浏览器不能直接执行 TypeScript。它得先用 *tsc* 编译器转译(transpile)成 JavaScript，而且编译器需要进行一些配置。

This page covers some aspects of TypeScript configuration and the TypeScript environment
that are important to Angular developers, including details about the following files:

本页面会涵盖 TypeScript 配置与环境的某些方面，这些对 Angular 开发者是很重要的。具体来说包括下列文件：

| Files                                                    | Details                            |
| :------------------------------------------------------- | :--------------------------------- |
| 文件                                                     | 详情                               |
| [tsconfig.json](guide/typescript-configuration#tsconfig) | TypeScript compiler configuration. |
| [tsconfig.json](guide/typescript-configuration#tsconfig) | TypeScript 编译器配置。            |
| [typings](guide/typescript-configuration#typings)        | TypesScript declaration files.     |
| [typings](guide/typescript-configuration#typings)        | TypesScript 类型声明文件。         |

<a id="tsconfig"></a>

## Configuration files

## 配置文件

A given Angular workspace contains several TypeScript configuration files.
At the root `tsconfig.json` file specifies the base TypeScript and Angular compiler options that all projects in the workspace inherit.

一个 Angular 工作区中包含多个 TypeScript 配置文件。在根一级，有两个主要的 TypeScript 配置文件：`tsconfig.json` 文件和 `tsconfig.base.json` 文件。

<div class="alert is-helpful">

See the [Angular compiler options](guide/angular-compiler-options) guide for information about what Angular specific options are available.

请参阅 [Angular 编译器选项](guide/angular-compiler-options)一章，以了解可以使用哪些 Angular 特有的选项。

</div>

The TypeScript and Angular have a wide range of options which can be used to configure type-checking features and generated output.
For more information, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section of the TypeScript documentation.

TypeScript 和 Angular 提供了很多选项，可以用来配置类型检查功能和要生成的输出。更多信息，请参阅 TypeScript 文档中的[使用 extends 进行配置继承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)部分。

<div class="alert is-helpful">

For more information TypeScript configuration files, see the official [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).
For details about configuration inheritance, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section.

要了解 TypeScript 配置文件的详情，请参阅官方提供的 [TypeScript 手册](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)。要了解配置继承的详情，参阅[使用 extends 进行配置继承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends)部分。

</div>

The initial `tsconfig.json` for an Angular workspace typically looks like the following example.

Angular 工作区的初始 `tsconfig.json` 通常是这样的。

<code-example header="tsconfig.json" path="getting-started/tsconfig.0.json"></code-example>

<a id="noImplicitAny"></a>

### `noImplicitAny` and `suppressImplicitAnyIndexErrors`

### `noImplicitAny` 与 `suppressImplicitAnyIndexErrors`

TypeScript developers disagree about whether the `noImplicitAny` flag should be `true` or `false`.
There is no correct answer and you can change the flag later.
But your choice now can make a difference in larger projects, so it merits discussion.

TypeScript 开发者们在 `noImplicitAny` 标志应该是 `true` 还是 `false` 上存在分歧。这没有标准答案，你以后还可以修改这个标志。但是你的选择会在大项目中产生显著差异，所以它值得讨论一番。

When the `noImplicitAny` flag is `false` (the default), and if the compiler cannot infer the variable type based on how it's used, the compiler silently defaults the type to `any`.
That's what is meant by *implicit `any`*.

当 `noImplicitAny` 标志是 `false`(默认值)时，如果编译器无法根据变量的用途推断出变量的类型，它就会悄悄的把变量类型默认为 `any`。这就是*隐式 `any`*的含义。

When the `noImplicitAny` flag is `true` and the TypeScript compiler cannot infer the type, it still generates the JavaScript files, but it also **reports an error**.
Many seasoned developers prefer this stricter setting because type checking catches more unintentional errors at compile time.

当 `noImplicitAny` 标志是 `true` 并且 TypeScript 编译器无法推断出类型时，它仍然会生成 JavaScript 文件。但是它也会**报告一个错误**。很多饱经沧桑的程序员更喜欢这种严格的设置，因为类型检查能在编译期间捕获更多意外错误。

You can set a variable's type to `any` even when the `noImplicitAny` flag is `true`.

即使 `noImplicitAny` 标志被设置成了 `true`，你也可以把变量的类型设置为 `any`。

When the `noImplicitAny` flag is `true`, you may get *implicit index errors* as well.
Most developers feel that *this particular error* is more annoying than helpful.
You can suppress them with the following additional flag:

如果把 `noImplicitAny` 标志设置为了 `true`，你可能会得到*隐式索引错*。大多数程序员可能觉得*这种错误*是个烦恼而不是助力。你可以使用另一个标志来禁止它们。

<code-example>

"suppressImplicitAnyIndexErrors": true

</code-example>

<div class="alert is-helpful">

For more information about how the TypeScript configuration affects compilation, see [Angular Compiler Options](guide/angular-compiler-options) and [Template Type Checking](guide/template-typecheck).

要了解 TypeScript 配置如何影响编译的更多信息，请参阅 [Angular 编译器选项](guide/angular-compiler-options)和[模板类型检查](guide/template-typecheck) 两章。

</div>

<a id="typings"></a>

## TypeScript typings

## TypeScript 类型定义(typings)

Many JavaScript libraries, such as jQuery, the Jasmine testing library, and Angular, extend the JavaScript environment with features and syntax that the TypeScript compiler doesn't recognize natively.
When the compiler doesn't recognize something, it reports an error.

很多 JavaScript 库，比如 jQuery、Jasmine 测试库和 Angular，会通过新的特性和语法来扩展 JavaScript 环境。而 TypeScript 编译器并不能原生的识别它们。当编译器不能识别时，它就会抛出一个错误。

Use [TypeScript type definition files](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html) —`d.ts files`— to tell the compiler about the libraries you load.

可以使用[TypeScript 类型定义文件](https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html) —— `.d.ts` 文件 —— 来告诉编译器你要加载的库的类型定义。

TypeScript-aware editors leverage these same definition files to display type information about library features.

TypeScript 敏感的编辑器借助这些定义文件来显示这些库中各个特性的类型定义。

Many libraries include definition files in their npm packages where both the TypeScript compiler and editors
can find them.
Angular is one such library.
The `node_modules/@angular/core/` folder of any Angular application contains several `d.ts` files that describe parts of Angular.

很多库在自己的 npm 包中都包含了它们的类型定义文件，TypeScript 编译器和编辑器都能找到它们。Angular 库也是这样的。任何 Angular 应用程序的 `node_modules/@angular/core/` 目录下，都包含几个 `d.ts` 文件，它们描述了 Angular 的各个部分。

<div class="alert is-helpful">

You don't need to do anything to get *typings* files for library packages that include `d.ts` files.
Angular packages include them already.

你不需要为那些包含了 `d.ts` 文件的库获取*类型定义*文件 —— Angular 的所有包都是如此。

</div>

### `lib`

TypeScript includes a default set of declaration files.
These files contain the ambient declarations for various common JavaScript constructs present in JavaScript runtimes and the DOM.

TypeScript 包含一组默认的声明文件。这些文件包含 JavaScript 运行时和 DOM 中存在的各种通用 JavaScript 结构的环境声明。

For more information, see [lib](https://www.typescriptlang.org/tsconfig#lib) in the TypeScript guide.

有关更多信息，请参阅 TypeScript 指南中的[lib](https://www.typescriptlang.org/tsconfig#lib) 。

### Installable typings files

### 安装类型定义文件

Many libraries —jQuery, Jasmine, and Lodash among them— do *not* include `d.ts` files in their npm packages.
Fortunately, either their authors or community contributors have created separate `d.ts` files for these libraries and published them in well-known locations.

遗憾的是，很多库 —— jQuery、Jasmine 和 Lodash 等库 —— 都*没有*在它们自己的 npm 包中包含 `d.ts` 文件。幸运的是，它们的作者或社区中的贡献者已经为这些库创建了独立的 `d.ts` 文件，并且把它们发布到了一个众所周知的位置。

You can install these typings with `npm` using the [`@types/*` scoped package](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html).

你可以通过 `npm` 来使用 [`@types/*` 范围化包](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)来安装这些类型。

Which ambient declaration files in `@types/*` are automatically included is determined by the [`types` TypeScript compiler option](https://www.typescriptlang.org/tsconfig#types).
The Angular CLI generates a `tsconfig.app.json` file which is used to build an application, in which the `types` compiler option is set to `[]` to disable automatic inclusion of declarations from `@types/*`.
Similarly, the `tsconfig.spec.json` file is used for testing and sets `"types": ["jasmine"]` to allow using Jasmine's ambient declarations in tests.

`@types/*` 中自动包含哪些环境声明文件由 [TypeScript 编译器选项 `types`](https://www.typescriptlang.org/tsconfig#types)决定。Angular CLI 会生成一个 `tsconfig.app.json` 文件，用于构建应用程序，其中 `types` 编译器选项设置为 `[]` 以禁止自动包含来自 `@types/*` 的声明。同时，`tsconfig.spec.json` 文件用于测试并设置 `"types": ["jasmine"]` 以允许在测试中使用 Jasmine 的环境声明。

After installing `@types/*` declarations, you have to update the `tsconfig.app.json` and `tsconfig.spec.json` files to add the newly installed declarations to the list of `types`.
If the declarations are only meant for testing, then only the `tsconfig.spec.json` file should be updated.

在安装了 `@types/*` 声明之后，你还要修改 `tsconfig.app.json` 和 `tsconfig.spec.json` 文件，以便把新安装的声明文件添加到它们的 `types` 列表中。如果这些声明文件只是供测试用的，那么只要修改 `tsconfig.spec.json` 文件就可以了。

For instance, to install typings for `chai` you run `npm install @types/chai --save-dev` and then update `tsconfig.spec.json` to add `"chai"` to the list of `types`.

比如，要安装 `chai` 的类型信息，你可以执行 `npm install @types/chai --save-dev`，然后修改 `tsconfig.spec.json` 来把 `"chai"` 添加到 `types` 列表中。

<a id="target"></a>

### `target`

By default, the target is `ES2022`. To control ECMA syntax use the [Browserslist](https://github.com/browserslist/browserslist) configuration file.
For more information, see the [configuring browser compatibility](/guide/build#configuring-browser-compatibility) guide.

默认情况下，编译目标是 `es2022`。要控制 ECMA 语法，请使用 [Browserslist](https://github.com/browserslist/browserslist) 配置文件。欲知详情，参见[配置浏览器兼容性](/guide/build#configuring-browser-compatibility)一章。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-24
