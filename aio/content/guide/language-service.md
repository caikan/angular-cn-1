# Angular Language Service

# Angular 语言服务

The Angular Language Service provides code editors with a way to get completions, errors, hints, and navigation inside Angular templates.
It works with external templates in separate HTML files, and also with in-line templates.

Angular 语言服务为代码编辑器提供了一种在 Angular 模板中获取自动补全、错误、提示和导航的方法。它支持位于独立 HTML 文件中的外部模板以及内联模板。

## Configuring compiler options for the Angular Language Service

## 配置 Angular 语言服务的编译器选项

To enable the latest Language Service features, set the `strictTemplates` option in `tsconfig.json` by setting `strictTemplates` to `true,` as shown in the following example:

要启用最新的语言服务功能，请在 `tsconfig.json` 中将 `strictTemplates` 选项设置为 `true`，如以下示例所示：

<code-example language="json">

"angularCompilerOptions": {
  "strictTemplates": true
}

</code-example>

For more information, see the [Angular compiler options](guide/angular-compiler-options) guide.

有关更多信息，请参见 [Angular 编译器选项](guide/angular-compiler-options)指南。

## Features

## 特性

Your editor autodetects that you are opening an Angular file.
It then uses the Angular Language Service to read your `tsconfig.json` file, find all the templates you have in your application, and then provide language services for any templates that you open.

编辑器会自动检测到你正在打开 Angular 文件。然后，它就会使用 Angular Language Service 读取 `tsconfig.json` 文件，查找应用程序中具有的所有模板，然后为你打开的任何模板提供语言服务。

Language services include:

语言服务包括：

* Completions lists

  自动补全清单

* AOT Diagnostic messages

  AOT 诊断消息

* Quick info

  快捷信息

* Go to definition

  转到定义

### Autocompletion

### 自动补全

Autocompletion can speed up your development time by providing you with contextual possibilities and hints as you type.
This example shows autocomplete in an interpolation.
As you type it out, you can press tab to complete.

自动补全可以在输入时为你提供当前情境下的候选内容和提示，从而提高开发速度。下面这个例子展示了插值中的自动补全功能。当你进行输入的时候，就可以按 tab 键来自动补全。

<div class="lightbox">

<img alt="autocompletion" src="generated/images/guide/language-service/language-completion.gif">

</div>

There are also completions within elements.
Any elements you have as a component selector will show up in the completion list.

还有对元素的自动补全。你定义的任何组件的选择器都会显示在自动补全列表中。

### Error checking

### 错误检查

The Angular Language Service can forewarn you of mistakes in your code.
In this example, Angular doesn't know what `orders` is or where it comes from.

Angular 语言服务能对代码中存在的错误进行预警。在这个例子中，Angular 不知道什么是 `orders` 或者它来自哪里。

<div class="lightbox">

<img alt="error checking" src="generated/images/guide/language-service/language-error.gif">

</div>

### Quick info and navigation

### 快捷信息与导航

The quick-info feature lets you hover to see where components, directives, and modules come from.
You can then click "Go to definition" or press F12 to go directly to the definition.

快捷信息功能使你可以悬停以查看组件、指令、模块等的来源。然后，你可以单击“转到定义”或按 F12 键直接转到定义。

<div class="lightbox">

<img alt="navigation" src="generated/images/guide/language-service/language-navigation.gif">

</div>

## Angular Language Service in your editor

## 编辑器中的 Angular 语言服务

Angular Language Service is currently available as an extension for [Visual Studio Code](https://code.visualstudio.com), [WebStorm](https://www.jetbrains.com/webstorm), [Sublime Text](https://www.sublimetext.com) and [Eclipse IDE](https://www.eclipse.org/eclipseide).

Angular 语言服务目前在[Visual Studio Code](https://code.visualstudio.com)和[WebStorm](https://www.jetbrains.com/webstorm)、[Sublime Text](https://www.sublimetext.com/) 和 [Eclipse IDE](https://www.eclipse.org/eclipseide/) 中都有可用的扩展。

### Visual Studio Code

In [Visual Studio Code](https://code.visualstudio.com), install the extension from the [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
Open the marketplace from the editor using the Extensions icon on the left menu pane, or use VS Quick Open (⌘+P on Mac, CTRL+P on Windows) and type "? ext".
In the marketplace, search for Angular Language Service extension, and click the **Install** button.

在 [Visual Studio Code 中](https://code.visualstudio.com)，从 “[扩展程序：市场](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) 中安装扩展程序。可以用左侧菜单窗格中的扩展程序图标从编辑器中打开市场，或使用 VS 快速打开（在 Mac 上为 ⌘+ P，在 Windows 上为 CTRL + P）并输入“? ext”。在市场中，搜索 Angular Language Service 扩展，并点击 **Install** 按钮。

The Visual Studio Code integration with the Angular language service is maintained and distributed by the Angular team.

Visual Studio Code 与 Angular 语言服务的集成工作是由 Angular 团队发布的。

### Visual Studio

In [Visual Studio](https://visualstudio.microsoft.com), install the extension from the [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService).
Open the marketplace from the editor selecting Extensions on the top menu pane, and then selecting Manage Extensions.
In the marketplace, search for Angular Language Service extension, and click the **Install** button.

在 [Visual Studio 中](https://visualstudio.microsoft.com)，从[“扩展程序：市场”](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService)中安装扩展程序。可以从编辑器中打开市场，在顶部菜单窗格中选择“扩展”，然后选择“管理扩展”。在市场上，搜索 Angular Language Service extension，然后单击**“安装”**按钮。

The Visual Studio integration with the Angular language service is maintained and distributed by Microsoft with help from the Angular team.
Check out the project [here](https://github.com/microsoft/vs-ng-language-service).

Microsoft 在 Angular 团队的帮助下维护和发布了 Visual Studio 与 Angular 语言服务的集成。[在这里](https://github.com/microsoft/vs-ng-language-service)查看项目。

### WebStorm

In [WebStorm](https://www.jetbrains.com/webstorm), enable the plugin [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs).

在 [WebStorm](https://www.jetbrains.com/webstorm) 中，启用 [Angular 与 AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs) 插件。

Since WebStorm 2019.1, the `@angular/language-service` is not required anymore and should be removed from your `package.json`.

从 WebStorm 2019.1 开始，`@angular/language-service` 已经不再需要了，应该从你的 `package.json` 中移除。

### Sublime Text

In [Sublime Text](https://www.sublimetext.com), the Language Service supports only in-line templates when installed as a plug-in.
You need a custom Sublime plug-in (or modifications to the current plug-in) for completions in HTML files.

在 [Sublime Text](https://www.sublimetext.com) 中，当安装为插件时，语言服务仅支持内联模板。你需要自定义 Sublime 插件（或修改当前插件），来实现 HTML 文件中的自动补齐。

To use the Language Service for in-line templates, you must first add an extension to allow TypeScript, then install the Angular Language Service plug-in.
Starting with TypeScript 2.3, TypeScript has a plug-in model that the language service can use.

要想在内联模板中使用语言服务，你必须首先添加一个扩展，以支持 TypeScript，然后安装 Angular 语言服务插件。从 TypeScript 2.3 开始，TypeScript 提供了一个插件模型，供语言服务使用。

1. Install the latest version of TypeScript in a local `node_modules` directory:

   把最新版本的 TypeScript 安装到本地的 `node_modules` 目录下：

   <code-example format="shell" language="shell">

   npm install --save-dev typescript

   </code-example>

1. Install the Angular Language Service package in the same location:

   把 Angular 语言服务的包安装到同一位置：

   <code-example format="shell" language="shell">

   npm install --save-dev &commat;angular/language-service

   </code-example>

1. Once the package is installed,  add the following to the `"compilerOptions"` section of your project's `tsconfig.json`.

   安装好这个包后，将以下内容添加到项目的 `tsconfig.json` 的 `"compilerOptions"` 部分。

   <code-example header="tsconfig.json" language="json">

   "plugins": [
       {"name": "&commat;angular/language-service"}
   ]

   </code-example>

1. In your editor's user preferences (`Cmd+,` or `Ctrl+,`), add the following:

   在编辑器的用户首选项（`Cmd+,` 或 `Ctrl+,`）中，添加以下内容：

   <code-example header="Sublime Text user preferences" language="json">

   "typescript-tsdk": "&lt;path to your folder&gt;/node_modules/typescript/lib"

   </code-example>

This lets the Angular Language Service provide diagnostics and completions in `.ts` files.

这样就能让 Angular 语言服务提供 `.ts` 文件中的诊断与自动补全信息。

### Eclipse IDE

Either directly install the "Eclipse IDE for Web and JavaScript developers" package which comes with the Angular Language Server included, or from other Eclipse IDE packages, use Help > Eclipse Marketplace to find and install [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml).

你或者直接安装包含了 Angular Language Server 的 “Eclipse IDE for Web and JavaScript developers” 软件包，或者直接从其他 Eclipse IDE 软件包中安装，使用“Help” > “Eclipse Marketplace” 来查找并安装 [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml)。

## How the Language Service works

## 语言服务的工作原理

When you use an editor with a language service, the editor starts a separate language-service process and communicates with it through an [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), using the [Language Server Protocol](https://microsoft.github.io/language-server-protocol).
When you type into the editor, the editor sends information to the language-service process to track the state of your project.

当你将编辑器与语言服务一起使用时，该编辑器将启动一个单独的语言服务进程，并使用[语言服务协议](https://microsoft.github.io/language-server-protocol)通过 [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) 与之通信。当你输入编辑器时，编辑器会将信息发送到语言服务流程，以跟踪你的项目状态。

When you trigger a completion list within a template, the editor first parses the template into an HTML [abstract syntax tree (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).
The Angular compiler interprets that tree to determine the context: which module the template is part of, the current scope, the component selector, and where your cursor is in the template AST.
It can then determine the symbols that could potentially be at that position.

当你触发模板中的完成列表时，编辑器首先将模板解析为 HTML [抽象语法树（AST）](https://en.wikipedia.org/wiki/Abstract_syntax_tree)。Angular 编译器解释这棵树以确定上下文：模板属于哪个模块，当前作用域，组件选择器以及光标在模板 AST 中的位置。然后，它就可以确定可能位于该位置的符号。

It's a little more involved if you are in an interpolation.
If you have an interpolation of `{{data.---}}` inside a `div` and need the completion list after `data.---`, the compiler can't use the HTML AST to find the answer.
The HTML AST can only tell the compiler that there is some text with the characters "`{{data.---}}`".
That's when the template parser produces an expression AST, which resides within the template AST.
The Angular Language Services then looks at `data.---` within its context, asks the TypeScript Language Service what the members of `data` are, and returns the list of possibilities.

如果你要进行插值，则需要更多的精力。如果你在 `div` 有 `{{data.---}}` 的插值，并且在 `data.---` 之后需要自动补全列表，则编译器无法使用 HTML AST 查找答案。HTML AST 只能告诉编译器某些文本带有字符 “`{{data.---}}`”。那时模板解析器会生成一个表达式 AST，该表达式位于模板 AST 中。然后，Angular 语言服务会在其上下文中查找 `data.---`，询问 TypeScript 语言服务 `data` 的成员是什么，并返回可能性列表。

## More information

## 更多信息

* For more in-depth information on the implementation, see the [Angular Language Service API](https://github.com/angular/angular/blob/main/packages/language-service/src/types.ts)

  关于该实现的更多详细信息，请参阅 [Angular 语言服务 API](https://github.com/angular/angular/blob/main/packages/language-service/src/types.ts)。

* For more on the design considerations and intentions, see [design documentation here](https://github.com/angular/vscode-ng-language-service/wiki/Design)

  关于此设计注意事项和意图的更多信息，请参阅[此处的设计文档](https://github.com/angular/vscode-ng-language-service/wiki/Design)

* See also [Chuck Jazdzewski's presentation](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s) on the Angular Language Service from [ng-conf](https://www.ng-conf.org) 2017

  另请参阅 [ng-conf](https://www.ng-conf.org) 2017 上 Chuck Jazdzewski 关于 Angular 语言服务的 [演讲](https://www.youtube.com/watch?v=ez3R0Gi4z5A&t=368s)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
