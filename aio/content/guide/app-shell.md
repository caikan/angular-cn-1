# App shell

# 应用外壳

Application shell is a way to render a portion of your application using a route at build time.
It can improve the user experience by quickly launching a static rendered page (a skeleton common to all pages) while the browser downloads the full client version and switches to it automatically after the code loads.

应用外壳是一种在构建期间借助路由渲染部分应用的方法。它可以通过快速启动一个静态渲染页面（所有页面的公共骨架）来改善用户体验。与此同时，浏览器会下载完整的客户端版本，并在代码加载后自动切换到完整版。

This gives users a meaningful first paint of your application that appears quickly because the browser can render the HTML and CSS without the need to initialize any JavaScript.

这能让用户快速看到应用中第一个有意义的画面，因为浏览器可以渲染出 HTML 和 CSS，而无需初始化任何 JavaScript。

Learn more in [The App Shell Model](https://developers.google.com/web/fundamentals/architecture/app-shell).

欲知详情，参阅[应用外壳模型](https://developers.google.com/web/fundamentals/architecture/app-shell)。

## Step 1: Prepare the application

## 第 1 步：准备本应用

Do this with the following Angular CLI command:

可以用下列 Angular CLI 命令来执行本操作：

<code-example format="shell" language="shell">

ng new my-app --routing

</code-example>

For an existing application, you have to manually add the `RouterModule` and defining a `<router-outlet>` within your application.

对于既有应用，你必须手动添加 `RouterModule` 并在应用中定义 `<router-outlet>`。

## Step 2: Create the application shell

## 第 2 步：创建应用外壳

Use the Angular CLI to automatically create the application shell.

使用 Angular CLI 自动创建一个应用外壳。

<code-example format="shell" language="shell">

ng generate app-shell

</code-example>

For more information about this command, see [App shell command](cli/generate#app-shell-command).

要了解关于本命令的更多信息，参见 [app-shell 命令](cli/generate#app-shell-command)。

After running this command you can see that the `angular.json` configuration file has been updated to add two new targets, with a few other changes.

执行完这个命令，你会发现 `angular.json` 配置文件中已经增加了两个新目标，并做了一些其它更改。

<code-example language="json">

"server": {
  "builder": "&commat;angular-devkit/build-angular:server",
  "defaultConfiguration": "production",
  "options": {
    "outputPath": "dist/my-app/server",
    "main": "src/main.server.ts",
    "tsConfig": "tsconfig.server.json"
  },
  "configurations": {
    "development": {
      "outputHashing": "none",
    },
    "production": {
      "outputHashing": "media",
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.prod.ts"
        }
      ],
      "sourceMap": false,
      "optimization": true
    }
  }
},
"app-shell": {
  "builder": "&commat;angular-devkit/build-angular:app-shell",
  "defaultConfiguration": "production",
  "options": {
    "route": "shell"
  },
  "configurations": {
    "development": {
      "browserTarget": "my-app:build:development",
      "serverTarget": "my-app:server:development",
    },
    "production": {
      "browserTarget": "my-app:build:production",
      "serverTarget": "my-app:server:production"
    }
  }
}

</code-example>

## Step 3: Verify the application is built with the shell content

## 第 3 步：验证该应用是使用应用外壳的内容构建的

Use the Angular CLI to build the `app-shell` target.

使用 Angular CLI 构建目标 `app-shell`。

<code-example format="shell" language="shell">

ng run my-app:app-shell:development

</code-example>

Or to use the production configuration.

或使用产品环境配置。

<code-example format="shell" language="shell">

ng run my-app:app-shell:production

</code-example>

To verify the build output, open <code class="no-auto-link">dist/my-app/browser/index.html</code>.
Look for default text `app-shell works!` to show that the application shell route was rendered as part of the output.

要验证构建输出，请打开 <code class="no-auto-link">dist/my-app/browser/index.html</code>。寻找默认的文本 `app-shell works!` 就可以验证这个应用外壳路由确实是作为输出的一部分渲染出来的。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
