# Generating code using schematics

# 原理图（Schematic）

A schematic is a template-based code generator that supports complex logic.
It is a set of instructions for transforming a software project by generating or modifying code.
Schematics are packaged into [collections](guide/glossary#collection) and installed with npm.

原理图是一个基于模板的支持复杂逻辑的代码生成器。它是一组通过生成代码或修改代码来转换软件项目的指令。原理图会打包成[集合（collection）](guide/glossary#collection)并用 npm 安装。

The schematic collection can be a powerful tool for creating, modifying, and maintaining any software project, but is particularly useful for customizing Angular projects to suit the particular needs of your own organization.
You might use schematics, for example, to generate commonly-used UI patterns or specific components, using predefined templates or layouts.
Use schematics to enforce architectural rules and conventions, making your projects consistent and interoperative.

原理图的集合可以作为一个强大的工具，以创建、修改和维护任何软件项目，特别是当要自定义 Angular 项目以满足你自己组织的特定需求时。比如，你可以借助原理图来用预定义的模板或布局生成常用的 UI 模式或特定的组件。也可以用原理图来强制执行架构规则和约定，让你的项目保持一致性和互操作性。

## Schematics for the Angular CLI

## Angular CLI 中的原理图

Schematics are part of the Angular ecosystem.
The [Angular CLI](guide/glossary#cli)  uses schematics to apply transforms to a web-app project.
You can modify these schematics, and define new ones to do things like update your code to fix breaking changes in a dependency, for example, or to add a new configuration option or framework to an existing project.

原理图是 Angular 生态系统的一部分。[Angular CLI](guide/glossary#cli) 使用原理图对 Web 应用项目进行转换。你可以修改这些原理图，并定义新的原理图，比如更新代码以修复依赖中的重大变更，或者把新的配置项或框架添加到现有的项目中。

Schematics that are included in the `@schematics/angular` collection are run by default by the commands `ng generate` and `ng add`.
The package contains named schematics that configure the options that are available to the CLI for `ng generate` sub-commands, such as `ng generate component` and `ng generate service`.
The sub-commands for `ng generate` are shorthand for the corresponding schematic.
To specify and generate a particular schematic, or a collection of schematics, using the long form:

`@schematics/angular` 集合中的原理图是 `ng generate` 和 `ng add` 命令的默认原理图。此包里包含一些有名字的原理图，可用于配置 `ng generate` 子命令的选项，比如 `ng generate component` 和 `ng generate service`。`ng generate` 的子命令是相应原理图的简写。可以用长格式来指定并生成特定的原理图或原理图集合：

<code-example format="shell" language="shell">

ng generate my-schematic-collection:my-schematic-name

</code-example>

or

或者

<code-example format="shell" language="shell">

ng generate my-schematic-name --collection collection-name

</code-example>

### Configuring CLI schematics

### 配置 CLI 的原理图

A JSON schema associated with a schematic tells the Angular CLI what options are available to commands and sub-commands, and determines the defaults.
These defaults can be overridden by providing a different value for an option on the command line.
See [Workspace Configuration](guide/workspace-config) for information about how to change the generation option defaults for your workspace.

与原理图相关联的 JSON 模式会告诉 Angular CLI 命令和子命令都有哪些选项以及默认值。这些默认值可以通过在命令行中为该选项提供不同的值来进行覆盖。要了解如何更改代码生成选项的默认值，请参阅“ [工作区配置](guide/workspace-config) ”。

The JSON schemas for the default schematics used by the CLI to generate projects and parts of projects are collected in the package [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular).
The schema describes the options available to the CLI for each of the `ng generate` sub-commands, as shown in the `--help` output.

CLI 中那些用来生成项目及其部件的默认原理图，其 JSON 模式收集在 [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular) 包中。该模式描述了 CLI 中每个可用的 `ng generate` 子命令选项，如 `--help` 输出中所示。

## Developing schematics for libraries

## 编写库的原理图

As a library developer, you can create your own collections of custom schematics to integrate your library with the Angular CLI.

作为一名库开发人员，你可以创建自己的自定义原理图集合，以便把你的库与 Angular CLI 集成在一起。

* An *add schematic* lets developers install your library in an Angular workspace using `ng add`

  *添加（Add）原理图*允许开发人员使用 `ng add` 在 Angular 工作区中安装你的库

* *Generation schematics* can tell the `ng generate` sub-commands how to modify projects, add configurations and scripts, and scaffold artifacts that are defined in your library

  *生成（Generation）原理图*可以告诉 `ng generate` 子命令如何修改项目、添加配置和脚本，以及为库中定义的工件提供脚手架

* An *update schematic* can tell the `ng update` command how to update your library's dependencies and adjust for breaking changes when you release a new version

  *更新（Update）原理图*可以告诉 `ng update` 命令，如何更新库的依赖，并在发布新版本时调整其中的重大变更

For more details of what these look like and how to create them, see:

要了解它们的更多细节以及如何创建它们，请参阅：

* [Authoring Schematics](guide/schematics-authoring)

  [创作原理图](guide/schematics-authoring)

* [Schematics for Libraries](guide/schematics-for-libraries)

  [库的原理图](guide/schematics-for-libraries)

### Add schematics

### 添加（Add）原理图

An *add schematic* is typically supplied with a library, so that the library can be added to an existing project with `ng add`.
The `add` command uses your package manager to download new dependencies, and invokes an installation script that is implemented as a schematic.

库中通常都会提供一个添加原理图，以便通过 `ng add` 把这个库添加到现有项目中。`add` 命令会运行包管理器来下载新的依赖，并调用一个原理图形式的安装脚本。

For example, the [`@angular/material`](https://material.angular.io/guide/schematics) schematic tells the `add` command to install and set up Angular Material and theming, and register new starter components that can be created with `ng generate`.
Look at this one as an example and model for your own add schematic.

比如，[`@angular/material`](https://material.angular.cn/guide/schematics) 原理图会要求 `add` 命令安装并设置 Angular Material 及其主题，并注册可通过 `ng generate` 创建的新启动器组件。可以把它作为自己的 "添加原理图" 的范例。

Partner and third party libraries also support the Angular CLI with add schematics.
For example, `@ng-bootstrap/schematics` adds [ng-bootstrap](https://ng-bootstrap.github.io)  to an app, and  `@clr/angular` installs and sets up [Clarity from VMWare](https://clarity.design/documentation/get-started).

合作伙伴和第三方库也可以通过添加原理图来支持 Angular CLI。比如，`@ng-bootstrap/schematics` 会把 [ng-bootstrap](https://ng-bootstrap.github.io) 添加到应用中，`@clr/angular` 会安装并设置 [VMWare 的 Clarity](https://clarity.design/documentation/get-started)。

An *add schematic* can also update a project with configuration changes, add additional dependencies (such as polyfills), or scaffold package-specific initialization code.
For example, the `@angular/pwa` schematic turns your application into a PWA by adding an application manifest and service worker.

"添加原理图" 还可以通过更改配置、添加额外依赖（比如腻子脚本），或者添加程序包特有的初始化代码来修改项目。比如，`@angular/pwa` 原理图会通过添加一个应用清单（manifest）和 Service Worker。

### Generation schematics

### 生成（Generation）原理图

Generation schematics are instructions for the `ng generate` command.
The documented sub-commands use the default Angular generation schematics, but you can specify a different schematic (in place of a sub-command) to generate an artifact defined in your library.

生成器原理图是 `ng generate` 的操作指令。那些已经有文档的子命令会使用默认的 Angular 生成器原理图，但你可以在子命令中指定另一个原理图来生成你的库中定义的那些工件。

Angular Material, for example, supplies generation schematics for the UI components that it defines.
The following command uses one of these schematics to render an Angular Material `<mat-table>` that is pre-configured with a datasource for sorting and pagination.

比如，Angular Material 为它定义的一些 UI 组件提供了生成器原理图。下面的命令会使用其中一个原理图来渲染一个 Angular Material 的 `<mat-table>` 组件，它预先配置了一个用于排序和分页的数据源。

<code-example format="shell" language="shell">

ng generate &commat;angular/material:table &lt;component-name&gt;

</code-example>

### Update schematics

### 更新原理图

 The `ng update` command can be used to update your workspace's library dependencies.
 If you supply no options or use the help option, the command examines your workspace and suggests libraries to update.

`ng update` 命令可以用来更新工作区的库依赖。如果你没有提供任何选项或使用了 help 选项，该命令会检查你的工作区并建议要更新哪些库。

<code-example format="shell" language="shell">

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    &hyphen;-------------------------------------------------------------------------------
    &commat;angular/cdk                       7.2.2 -&gt; 7.3.1           ng update &commat;angular/cdk
    &commat;angular/cli                       7.2.3 -&gt; 7.3.0           ng update &commat;angular/cli
    &commat;angular/core                      7.2.2 -&gt; 7.2.3           ng update &commat;angular/core
    &commat;angular/material                  7.2.2 -&gt; 7.3.1           ng update &commat;angular/material
    rxjs                                      6.3.3 -&gt; 6.4.0           ng update rxjs

    There might be additional packages that are outdated.
    Run "ng update --all" to try to update all at the same time.

</code-example>

If you pass the command a set of libraries to update (or the `--all` flag), it updates those libraries, their peer dependencies, and the peer dependencies that depend on them.

如果你给这个命令指定一组要更新的库（或 `--all` 标志），它就会更新这些库、这些库的对等依赖，以及对等依赖的对等依赖。

<div class="alert is-helpful">

If there are inconsistencies (for example, if peer dependencies cannot be matched by a simple [semver](https://semver.io) range), the command generates an error and does not change anything in the workspace.

如果存在不一致（比如，如果在某个简单的 [semver](https://semver.io) 范围内无法匹配对等依赖），那么该命令会生成一个错误，并且不会更改工作区中的任何内容。

We recommend that you do not force an update of all dependencies by default.
Try updating specific dependencies first.

我们建议你不要强制更新所有的依赖项，而应该首先尝试更新特定的依赖项。

For more about how the `ng update` command works, see [Update Command](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md).

关于 `ng update` 命令工作原理的更多信息，请参阅“[更新命令”](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md)。

</div>

If you create a new version of your library that introduces potential breaking changes, you can provide an *update schematic* to enable the `ng update` command to automatically resolve any such changes in the project being updated.

如果你创建的新版本的库引入了潜在的重大更改，你可以提供一个*更新原理图*，让 `ng update` 命令能够自动解决所更新项目中的任何重大修改。

For example, suppose you want to update the Angular Material library.

比如，假设你要更新 Angular Material 库。

<code-example format="shell" language="shell">
ng update &commat;angular/material
</code-example>

This command updates both `@angular/material` and its dependency `@angular/cdk` in your workspace's `package.json`.
If either package contains an update schematic that covers migration from the existing version to a new version, the command runs that schematic on your workspace.

该命令会在你的工作区的 `package.json` 中更新 `@angular/material` 及其依赖项 `@angular/cdk`。如果任何一个包中包含了涵盖从现有版本到新版本的迁移规则的更新原理图，那么该命令就会在你的工作区中运行这个原理图。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
