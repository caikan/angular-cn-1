# Workspace and project file structure

# 工作区和项目文件结构

You develop applications in the context of an Angular [workspace](guide/glossary#workspace).
A workspace contains the files for one or more [projects](guide/glossary#project).
A project is the set of files that comprise a standalone application or a shareable library.

你会以 Angular [工作区](guide/glossary#workspace)作为上下文来开发应用。工作区包含一个或多个[项目](guide/glossary#project)的文件集。一个项目就是一组包含独立应用或可共享库的文件。

The Angular CLI `ng new` command creates a workspace.

Angular CLI 的 `ng new` 命令可以创建一个工作区。

<code-example format="shell" language="shell">

ng new &lt;my-project&gt;

</code-example>

When you run this command, the CLI installs the necessary Angular npm packages and other dependencies in a new workspace, with a root-level application named *my-project*.
The workspace root folder contains various support and configuration files, and a README file with generated descriptive text that you can customize.

当你运行这个命令时，CLI 会在一个新的工作区中安装必需的 Angular npm 包和其它依赖项，其根应用名叫 *my-project*。 该工作区的根文件夹中包含一些工作区配置文件，和一个带有自动生成的描述性文本的自述文件，你可以自定义它。

By default, `ng new` creates an initial skeleton application at the root level of the workspace, along with its end-to-end tests.
The skeleton is for a simple Welcome application that is ready to run and easy to modify.
The root-level application has the same name as the workspace, and the source files reside in the `src/` subfolder of the workspace.

`ng new` 还会默认创建一个位于工作区根级的骨架应用，及其端到端测试项目。这个骨架是一个简单的 Welcome 应用，它可以运行，也很容易修改。这个*根应用*与工作区同名，其源文件位于工作区的 `src/` 子文件夹中。

This default behavior is suitable for a typical "multi-repo" development style where each application resides in its own workspace.
Beginners and intermediate users are encouraged to use `ng new` to create a separate workspace for each application.

这种默认行为适用于典型的“多重（multi）仓库”开发风格，每个应用都位于它自己的工作区中。建议初学者和中级用户使用 `ng new` 为每个应用创建一个单独的工作区。

Angular also supports workspaces with [multiple projects](#multiple-projects).
This type of development environment is suitable for advanced users who are developing [shareable libraries](guide/glossary#library),
and for enterprises that use a "monorepo" development style, with a single repository and global configuration for all Angular projects.

Angular 还支持包含[多个项目](#multiple-projects)的工作区。这种开发环境适用于正在开发[可共享库](guide/glossary#library)的高级用户，以及那些使用“单一（mono）仓库”开发风格的企业，它只需要一个仓库，而且所有 Angular 项目都使用全局配置。

To set up a monorepo workspace, you should skip the creating the root application.
See [Setting up for a multi-project workspace](#multiple-projects) below.

要设置单一仓库的工作区，你应该跳过创建根应用的过程。参阅下面的[设置多项目工作区](#multiple-projects)部分。

## Workspace configuration files

## 工作区配置文件

All projects within a workspace share a [CLI configuration context](guide/workspace-config).
The top level of the workspace contains workspace-wide configuration files, configuration files for the root-level application, and subfolders for the root-level application source and test files.

每个工作区中的所有项目共享同一个 [CLI 配置环境](guide/workspace-config)。该工作区的顶层包含着全工作区级的配置文件、根应用的配置文件以及一些包含根应用的源文件和测试文件的子文件夹。

| Workspace configuration files | Purpose                                                                                                                                                                                                                                                                                                                                                                               |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 工作区配置文件                | 用途                                                                                                                                                                                                                                                                                                                                                                                  |
| `.editorconfig`               | Configuration for code editors. See [EditorConfig](https://editorconfig.org).                                                                                                                                                                                                                                                                                                         |
| `.editorconfig`               | 代码编辑器的配置。参阅 [EditorConfig](https://editorconfig.org)。                                                                                                                                                                                                                                                                                                                     |
| `.gitignore`                  | Specifies intentionally untracked files that [Git](https://git-scm.com) should ignore.                                                                                                                                                                                                                                                                                                |
| `.gitignore`                  | 指定 [Git](https://git-scm.com/) 应忽略的不必追踪的文件。                                                                                                                                                                                                                                                                                                                             |
| `README.md`                   | Introductory documentation for the root application.                                                                                                                                                                                                                                                                                                                                  |
| `README.md`                   | 根应用的简介文档。                                                                                                                                                                                                                                                                                                                                                                    |
| `angular.json`                | CLI configuration defaults for all projects in the workspace, including configuration options for build, serve, and test tools that the CLI uses, such as [Karma](https://karma-runner.github.io), and [Protractor](https://www.protractortest.org). For details, see [Angular Workspace Configuration](guide/workspace-config).                                                      |
| `angular.json`                | 为工作区中的所有项目指定 CLI 的默认配置，包括 CLI 要用到的构建、启动开发服务器和测试工具的配置项，比如 [Karma](https://karma-runner.github.io) 和 [Protractor](http://www.protractortest.org)。欲知详情，参阅 [Angular 工作区配置](guide/workspace-config) 部分。                                                                                                                     |
| `package.json`                | Configures [npm package dependencies](guide/npm-packages) that are available to all projects in the workspace. See [npm documentation](https://docs.npmjs.com/files/package.json) for the specific format and contents of this file.                                                                                                                                                  |
| `package.json`                | 配置工作区中所有项目可用的 [npm 包依赖](guide/npm-packages)。关于此文件的具体格式和内容，参阅 [npm 的文档](https://docs.npmjs.com/files/package.json)。                                                                                                                                                                                                                               |
| `package-lock.json`           | Provides version information for all packages installed into `node_modules` by the npm client. See [npm documentation](https://docs.npmjs.com/files/package-lock.json) for details. If you use the yarn client, this file will be [yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock) instead.                                                                                    |
| `package-lock.json`           | 提供 npm 客户端安装到 `node_modules` 的所有软件包的版本信息。欲知详情，参阅 [npm 的文档](https://docs.npmjs.com/files/package-lock.json)。如果你使用的是 yarn 客户端，那么该文件[就是 yarn.lock](https://yarnpkg.com/lang/en/docs/yarn-lock)。                                                                                                                                        |
| `src/`                        | Source files for the root-level application project.                                                                                                                                                                                                                                                                                                                                  |
| `src/`                        | 根项目的源文件。                                                                                                                                                                                                                                                                                                                                                                      |
| `node_modules/`               | Provides [npm packages](guide/npm-packages) to the entire workspace. Workspace-wide `node_modules` dependencies are visible to all projects.                                                                                                                                                                                                                                          |
| `node_modules/`               | 为整个工作区提供 [npm 包](guide/npm-packages)。这些工作区级的 `node_modules` 依赖对其中的所有项目可见。                                                                                                                                                                                                                                                                               |
| `tsconfig.json`               | The base [TypeScript](https://www.typescriptlang.org) configuration for projects in the workspace. All other configuration files inherit from this base file. For more information, see the [Configuration inheritance with extends](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) section of the TypeScript documentation. |
| `tsconfig.json`               | 工作区中所有项目的基本 [TypeScript](https://www.typescriptlang.org) 配置。所有其它配置文件都继承自这个基本配置。欲知详情，参阅 TypeScript 文档中的 [通过 extends 进行配置继承](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#configuration-inheritance-with-extends) 部分。                                                                                         |

## Application project files

## 应用项目文件

By default, the CLI command `ng new my-app` creates a workspace folder named "my-app" and generates a new application skeleton in a `src/` folder at the top level of the workspace.
A newly generated application contains source files for a root module, with a root component and template.

CLI 命令 `ng new my-app` 会默认创建名为 “my-app” 的工作区文件夹，并在 `src/` 文件夹下为工作区顶层的根应用生成一个新的应用骨架。新生成的应用包含一个根模块的源文件，包括一个根组件及其模板。

When the workspace file structure is in place, you can use the `ng generate` command on the command line to add functionality and data to the application.
This initial root-level application is the *default app* for CLI commands \(unless you change the default after creating [additional apps](#multiple-projects)\).

当工作区文件结构到位时，可以在命令行中使用 `ng generate` 命令往该应用中添加功能和数据。这个初始的根应用是 CLI 命令的*默认应用*（除非你在创建[其它应用](#multiple-projects)之后更改了默认值）。

<div class="alert is-helpful">

Besides using the CLI on the command line, you can also manipulate files directly in the application's source folder and configuration files.

</div>

For a single-application workspace, the `src` subfolder of the workspace contains the source files \(application logic, data, and assets\) for the root application.
For a multi-project workspace, additional projects in the `projects` folder contain a `project-name/src/` subfolder with the same structure.

对于单应用的工作区，工作区的 `src/` 子文件夹包含根应用的源文件（应用逻辑、数据和静态资源）。对于多项目的工作区，`projects/` 文件夹中的其它项目各自包含一个具有相同结构的 `project-name/src/` 子目录。

### Application source files

### 应用源文件

Files at the top level of `src/` support testing and running your application.
Subfolders contain the application source and application-specific configuration.

顶层文件 `src/` 为测试并运行你的应用提供支持。其子文件夹中包含应用源代码和应用的专属配置。

| Application support files | Purpose                                                                                                                                                                                                                                                                                                                                                    |
| :------------------------ |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 应用支持文件              | 用途                                                                                                                                                                                                                                                                                                                                                         |
| `app/`                    | Contains the component files in which your application logic and data are defined. See details [below](#app-src).                                                                                                                                                                                                                                          |
| `app/`                    | 包含定义应用逻辑和数据的组件文件。详见[下文](#app-src)。                                                                                                                                                                                                                                                                                                                         |
| `assets/`                 | Contains image and other asset files to be copied as-is when you build your application.                                                                                                                                                                                                                                                                   |
| `assets/`                 | 包含要在构建应用时应该按原样复制的图像和其它静态资源文件。                                                                                                                                                                                                                                                                                                                              |
| `favicon.ico`             | An icon to use for this application in the bookmark bar.                                                                                                                                                                                                                                                                                                   |
| `favicon.ico`             | 用作该应用在标签栏中的图标。                                                                                                                                                                                                                                                                                                                                             |
| `index.html`              | The main HTML page that is served when someone visits your site. The CLI automatically adds all JavaScript and CSS files when building your app, so you typically don't need to add any `<script>` or`<link>` tags here manually.                                                                                                                          |
| `index.html`              | 当有人访问你的站点时，提供服务的主要 HTML 页面。CLI 会在构建你的应用时自动添加所有的 JavaScript 和 CSS 文件，所以你通常不用手动添加任何 `<script>` 或 `<link>` 标签。                                                                                                                                                                                                                                                |
| `main.ts`                 | The main entry point for your application. Compiles the application with the [JIT compiler](guide/glossary#jit) and bootstraps the application's root module \(AppModule\) to run in the browser. You can also use the [AOT compiler](guide/aot-compiler) without changing any code by appending the `--aot` flag to the CLI `build` and `serve` commands. |
| `main.ts`                 | 应用的主要入口点。用 [JIT 编译器](guide/glossary#jit)编译应用，然后引导应用的根模块（AppModule）在浏览器中运行。你也可以在不改变任何代码的情况下改用 [AOT 编译器](guide/aot-compiler)，只要在 CLI 的 `build` 和 `serve` 命令中加上 `--aot` 标志就可以了。                                                                                                                                                                               |
| `styles.sass`             | Lists CSS files that supply styles for a project. The extension reflects the style preprocessor you have configured for the project.                                                                                                                                                                                                                       |
| `styles.sass`             | 列出为项目提供样式的 CSS 文件。该扩展还反映了你为该项目配置的样式预处理器。                                                                                                                                                                                                                                                                                                                   |

<div class="alert is-helpful">

New Angular projects use strict mode by default.
If this is not desired you can opt out when creating the project.
For more information, see [Strict mode](guide/strict-mode).

</div>

<a id="app-src"></a>

Inside the `src` folder, the `app` folder contains your project's logic and data.
Angular components, templates, and styles go here.

在 `src/` 文件夹里面，`app/` 文件夹中包含此项目的逻辑和数据。Angular 组件、模板和样式也都在这里。

| `src/app/` files            | Purpose                                                                                                                                                                                                                                                    |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/` 文件             | 用途                                                                                                                                                                                                                                                       |
| `app/app.component.ts`      | Defines the logic for the application's root component, named `AppComponent`. The view associated with this root component becomes the root of the [view hierarchy](guide/glossary#view-hierarchy) as you add components and services to your application. |
| `app/app.component.ts`      | 为应用的根组件定义逻辑，名为 `AppComponent`。当你向应用中添加组件和服务时，与这个根组件相关联的视图就会成为[视图树](guide/glossary#view-hierarchy)的根。                                                                                                   |
| `app/app.component.html`    | Defines the HTML template associated with the root `AppComponent`.                                                                                                                                                                                         |
| `app/app.component.html`    | 定义与根组件 `AppComponent` 关联的 HTML 模板。                                                                                                                                                                                                             |
| `app/app.component.css`     | Defines the base CSS stylesheet for the root `AppComponent`.                                                                                                                                                                                               |
| `app/app.component.css`     | 为根组件 `AppComponent` 定义了基本的 CSS 样式表。                                                                                                                                                                                                          |
| `app/app.component.spec.ts` | Defines a unit test for the root `AppComponent`.                                                                                                                                                                                                           |
| `app/app.component.spec.ts` | 为根组件 `AppComponent` 定义了一个单元测试。                                                                                                                                                                                                               |
| `app/app.module.ts`         | Defines the root module, named `AppModule`, that tells Angular how to assemble the application. Initially declares only the `AppComponent`. As you add more components to the app, they must be declared here.                                             |
| `app/app.module.ts`         | 定义了名为 `AppModule` 的根模块，它会告诉 Angular 如何组装应用。这里最初只声明一个 `AppComponent`。当你向应用中添加更多组件时，它们也必须在这里声明。                                                                                                      |

### Application configuration files

### 应用配置文件

The application-specific configuration files for the root application reside at the workspace root level.
For a multi-project workspace, project-specific configuration files are in the project root, under `projects/project-name/`.

根应用的配置文件位于工作区的根目录下。对于多项目工作区，项目专属的配置文件位于项目根目录 `projects/project-name/`。

Project-specific [TypeScript](https://www.typescriptlang.org) configuration files inherit from the workspace-wide `tsconfig.json`.

项目专属的 [TypeScript](https://www.typescriptlang.org) 配置文件继承自工作区范围内的 `tsconfig.json`。

| Application-specific configuration files | Purpose                                                                                                                                                                                                                                                                     |
| :--------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 应用专属的配置文件                       | 用途                                                                                                                                                                                                                                                                        |
| `tsconfig.app.json`                      | Application-specific [TypeScript](https://www.typescriptlang.org) configuration, including TypeScript and Angular template compiler options. See [TypeScript Configuration](guide/typescript-configuration) and [Angular Compiler Options](guide/angular-compiler-options). |
| `tsconfig.app.json`                      | 应用专属的 [TypeScript](https://www.typescriptlang.org) 配置，包括 TypeScript 和 Angular 模板编译器的选项。参阅 [TypeScript 配置](guide/typescript-configuration)。                                                                                                         |
| `tsconfig.spec.json`                     | [TypeScript](https://www.typescriptlang.org) configuration for the application tests. See [TypeScript Configuration](guide/typescript-configuration).                                                                                                                       |
| `tsconfig.spec.json`                     | 应用测试的 [TypeScript](https://www.typescriptlang.org) 配置。参阅 [TypeScript 配置](guide/typescript-configuration)。                                                                                                                                                      |

<a id="multiple-projects"></a>

## Multiple projects

## 多重项目

A multi-project workspace is suitable for an enterprise that uses a single repository and global configuration for all Angular projects \(the "monorepo" model\).
A multi-project workspace also supports library development.

多项目工作区适用于对所有 Angular 项目使用单一存储库（单仓库模型）和全局配置的企业。多项目工作区也能为库开发提供支持。

### Setting up for a multi-project workspace

### 建立多项目工作区

If you intend to have multiple projects in a workspace, you can skip the initial application generation when you create the workspace, and give the workspace a unique name.
The following command creates a workspace with all of the workspace-wide configuration files, but no root-level application.

如果你打算在工作区中包含多个项目，可以在创建工作区时不要自动创建初始应用，并为工作区指定一个唯一的名字。下列命令用于创建一个包含全工作区级配置文件的工作区，但没有根应用。

<code-example format="shell" language="shell">

ng new my-workspace --no-create-application

</code-example>

You can then generate applications and libraries with names that are unique within the workspace.

然后，你可以使用工作区内唯一的名字来生成应用和库。

<code-example format="shell" language="shell">

cd my-workspace
ng generate application my-first-app

</code-example>

### Multiple project file structure

### 多重项目的文件结构

The first explicitly generated application goes into the `projects` folder along with all other projects in the workspace.
Newly generated libraries are also added under `projects`.
When you create projects this way, the file structure of the workspace is entirely consistent with the structure of the [workspace configuration file](guide/workspace-config), `angular.json`.

工作区中第一个显式生成的应用会像工作区中的其它项目一样放在 `projects` 文件夹中。新生成的库也会添加到 `projects` 下。当你以这种方式创建项目时，工作区的文件结构与[工作区配置文件](guide/workspace-config) `angular.json` 中的结构完全一致。

<div class="filetree">
    <div class="file">
        my-workspace
    </div>
    <div class="children">
        <div class="file">
          &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (workspace-wide config files)
        </div>
        <div class="file">
          projects &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (generated applications and libraries)
        </div>
        <div class="children">
            <div class="file">
              my-first-app &nbsp; --(an explicitly generated application)
            </div>
            <div class="children">
                <div class="file">
                  &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --(application-specific config)
                </div>
                <div class="file">
                  src &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --(source and support files for application)
                </div>
            </div>
            <div class="file">
              my-lib &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --(a generated library)
            </div>
            <div class="children">
                <div class="file">
                  &hellip; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --(library-specific config)
                </div>
                <div class="file">
                  src &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; --source and support files for library)
                </div>
            </div>
        </div>
    </div>
</div>

## Library project files

## 库项目文件

When you generate a library using the CLI \(with a command such as `ng generate library my-lib`\), the generated files go into the `projects/` folder of the workspace.
For more information about creating your own libraries, see  [Creating Libraries](guide/creating-libraries).

当你使用 CLI 命令（比如 `ng generate library my-lib`）生成一个库时，所生成的文件会放在工作区的 `projects/` 文件夹中。关于如何创建自己的库的更多信息，参阅[创建库](guide/creating-libraries)一章。

Libraries unlike applications have their own `package.json` configuration file.

库和应用不同，它们有自己的 `package.json` 配置文件。

Under the `projects/` folder, the `my-lib` folder contains your library code.

在 `projects/` 目录下，`my-lib` 文件夹中包含你的库代码。

| Library source files     | Purpose                                                                                                                                                                                                  |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 库的源文件               | 用途                                                                                                                                                                                                     |
| `src/lib`                | 包含库项目的逻辑和数据。像应用项目一样，库项目也可以包含组件、服务、模块、指令和管道。                                                                                                                   |
| `src/lib`                | Contains your library project's logic and data. Like an application project, a library project can contain components, services, modules, directives, and pipes.                                         |
| `src/public-api.ts`      | 指定从库中导出的所有文件。                                                                                                                                                                               |
| `src/public-api.ts`      | Specifies all files that are exported from your library.                                                                                                                                                 |
| `ng-package.json`        | 构建库时，[ng-packagr](https://github.com/ng-packagr/ng-packagr) 用到的配置文件。                                                                                                                        |
| `ng-package.json`        | Configuration file used by [ng-packagr](https://github.com/ng-packagr/ng-packagr) for building your library.                                                                                             |
| `package.json`           | 配置这个库所需的 [npm 包依赖](guide/npm-packages)。                                                                                                                                                      |
| `package.json`           | Configures [npm package dependencies](guide/npm-packages) that are required for this library.                                                                                                            |
| `tsconfig.lib.json`      | 库专属的 [TypeScript](https://www.typescriptlang.org) 配置，包括 TypeScript 和 Angular 模板编译器选项。参阅 [TypeScript 配置](guide/typescript-configuration)。                                          |
| `tsconfig.lib.json`      | Library-specific [TypeScript](https://www.typescriptlang.org) configuration, including TypeScript and Angular template compiler options. See [TypeScript Configuration](guide/typescript-configuration). |
| `tsconfig.lib.prod.json` | 库专属的 [TypeScript](https://www.typescriptlang.org) 配置，用于构建生产模式的库。                                                                                                                       |
| `tsconfig.lib.prod.json` | Library-specific [TypeScript](https://www.typescriptlang.org) configuration that is used when building the library in production mode.                                                                   |
| `tsconfig.spec.json`     | 测试库时用到的 [TypeScript](https://www.typescriptlang.org) 配置。参阅 [TypeScript 配置](guide/typescript-configuration)。                                                                               |
| `tsconfig.spec.json`     | [TypeScript](https://www.typescriptlang.org) configuration for the library tests. See [TypeScript Configuration](guide/typescript-configuration).                                                        |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-10-24
