# Lazy-loading feature modules

# 惰性加载特性模块

By default, NgModules are eagerly loaded. This means that as soon as the application loads, so do all the NgModules, whether they are immediately necessary or not.
For large applications with lots of routes, consider lazy loading —a design pattern that loads NgModules as needed.
Lazy loading helps keep initial bundle sizes smaller, which in turn helps decrease load times.

默认情况下，NgModule 都是急性加载的。意思是它会在应用加载时尽快加载，所有模块都是如此，无论是否立即要用。对于带有很多路由的大型应用，考虑使用惰性加载 —— 一种按需加载 NgModule 的模式。惰性加载可以减小初始包的尺寸，从而减少加载时间。

<div class="alert is-helpful">

For the final sample application with two lazy-loaded modules that this page describes, see the <live-example></live-example>.

如果需要本页描述的具有两个惰性加载模块的范例应用，参阅<live-example></live-example>。

</div>

<a id="lazy-loading"></a>

## Lazy loading basics

## 惰性加载入门

This section introduces the basic procedure for configuring a lazy-loaded route.
For a step-by-step example, see the [step-by-step setup](#step-by-step) section on this page.

本节会介绍配置惰性加载路由的基本过程。
想要一个分步的范例，参阅本页的[分步设置](#step-by-step)部分。

To lazy load Angular modules, use `loadChildren` (instead of `component`) in your `AppRoutingModule` `routes` configuration as follows.

要惰性加载 Angular 模块，请在 `AppRoutingModule` `routes` 中使用 `loadChildren` 代替 `component` 进行配置，代码如下。

<code-example header="AppRoutingModule (excerpt)">

const routes: Routes = [
  {
    path: 'items',
    loadChildren: () =&gt; import('./items/items.module').then(m =&gt; m.ItemsModule)
  }
];

</code-example>

In the lazy-loaded module's routing module, add a route for the component.

在惰性加载模块的路由模块中，添加一个指向该组件的路由。

<code-example header="Routing module for lazy loaded module (excerpt)">

const routes: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

</code-example>

Also be sure to remove the `ItemsModule` from the `AppModule`.
For step-by-step instructions on lazy loading modules, continue with the following sections of this page.

还要确保从 `AppModule` 中移除了 `ItemsModule`。想要一个关于惰性加载模块的分步操作指南，请继续查看本页的后续章节。

<a id="step-by-step"></a>

## Step-by-step setup

## 分步设置

Setting up a lazy-loaded feature module requires two main steps:

建立惰性加载的特性模块需要两个主要步骤：

1. Create the feature module with the Angular CLI, using the `--route` flag.

   使用 `--route` 标志，用 Angular CLI 创建特性模块。

1. Configure the routes.

   配置相关路由。

### Set up an application

### 建立应用

If you don't already have an application, follow the following steps to create one with the Angular CLI.
If you already have an application, skip to [Configure the routes](#config-routes).

如果你还没有应用，可以遵循下面的步骤使用 Angular CLI 创建一个。如果已经有了，可以直接跳到 [配置路由](#config-routes)部分。

<!-- vale Angular.Google_WordListWarnings = NO -->

Enter the following command where `customer-app` is the name of your app:

输入下列命令，其中的 `customer-app` 表示你的应用名称。

<!-- vale Angular.Google_WordListWarnings = YES -->

<code-example format="shell" language="shell">

ng new customer-app --routing

</code-example>

This creates an application called `customer-app` and the `--routing` flag generates a file called `app-routing.module.ts`. This is one of the files you need for setting up lazy loading for your feature module.
Navigate into the project by issuing the command `cd customer-app`.

这会创建一个名叫 `customer-app` 的应用，而 `--routing` 标识生成了一个名叫 `app-routing.module.ts` 的文件.它是你建立惰性加载的特性模块时所必须的。输入命令 `cd customer-app` 进入该项目。

<div class="alert is-helpful">

The `--routing` option requires Angular CLI version 8.1 or higher.
See [Keeping Up to Date](guide/updating).

`--routing` 选项需要 Angular/CLI 8.1 或更高版本。请参阅[保持最新](guide/updating)。

</div>

### Create a feature module with routing

### 创建一个带路由的特性模块

Next, you need a feature module with a component to route to.
To make one, enter the following command in the command line tool, where `customers` is the name of the feature module.
The path for loading the `customers` feature modules is also `customers` because it is specified with the `--route` option:

接下来，你将需要一个包含路由的目标组件的特性模块。要创建它，在命令行工具中输入如下命令，其中 `customers` 是特性模块的名称。加载 `customers` 特性模块的路径也是 `customers`，因为它是通过 `--route` 选项指定的：

<code-example format="shell" language="shell">

ng generate module customers --route customers --module app.module

</code-example>

This creates a `customers` directory having the new lazy-loadable feature module `CustomersModule` defined in the `customers.module.ts` file and the routing module `CustomersRoutingModule` defined in the `customers-routing.module.ts` file.
The command automatically declares the `CustomersComponent` and imports `CustomersRoutingModule` inside the new feature module.

这将创建一个 `customers` 目录，在其 `customers.module.ts` 文件中定义了新的可惰性加载模块 `CustomersModule`。该命令会自动在新特性模块中声明 `CustomersComponent`。

Because the new module is meant to be lazy-loaded, the command does **not** add a reference to it in the application's root module file, `app.module.ts`.
Instead, it adds the declared route, `customers` to the `routes` array declared in the module provided as the `--module` option.

因为这个新模块想要惰性加载，所以该命令**不会**在应用的根模块 `app.module.ts` 中添加对新特性模块的引用。相反，它将声明的路由 `customers` 添加到以 `--module` 选项指定的模块中声明的 `routes` 数组中。

<code-example header="src/app/app-routing.module.ts" path="lazy-loading-ngmodules/src/app/app-routing.module.ts" region="routes-customers"></code-example>

Notice that the lazy-loading syntax uses `loadChildren` followed by a function that uses the browser's built-in `import('...')` syntax for dynamic imports.
The import path is the relative path to the module.

注意，惰性加载语法使用 `loadChildren`，其后是一个使用浏览器内置的 `import('...')` 语法进行动态导入的函数。其导入路径是到当前模块的相对路径。

<div class="callout is-helpful">

<header>String-based lazy loading</header>

<header>基于字符串的惰性加载</header>

In Angular version 8, the string syntax for the `loadChildren` route specification [was deprecated](guide/deprecations#loadchildren-string-syntax) in favor of the `import()` syntax.
You can opt into using string-based lazy loading \(`loadChildren: './path/to/module#Module'`\) by including the lazy-loaded routes in your `tsconfig` file, which includes the lazy-loaded files in the compilation.

在 Angular 版本 8 中，`loadChildren` 路由规范的字符串语法[已弃用](guide/deprecations#loadchildren-string-syntax)，建议改用 `import()` 语法。你可以通过在 `tsconfig` 文件中包含惰性加载的路由来选择使用基于字符串的惰性加载（`loadChildren: './path/to/module#Module'`），这样它就会在编译时包含惰性加载的文件。

By default the Angular CLI generates projects with stricter file inclusions intended to be used with the `import()` syntax.

默认情况下，会用 Angular CLI 生成项目，这些项目将更严格地包含旨在与 `import()` 语法一起使用的文件。

</div>

### Add another feature module

### 添加另一个特性模块

Use the same command to create a second lazy-loaded feature module with routing, along with its stub component.

使用同样的命令创建第二个带路由的惰性加载特性模块及其桩组件。

<code-example format="shell" language="shell">

ng generate module orders --route orders --module app.module

</code-example>

This creates a new directory called `orders` containing the `OrdersModule` and `OrdersRoutingModule`, along with the new `OrdersComponent` source files.
The `orders` route, specified with the `--route` option, is added to the `routes` array inside the `app-routing.module.ts` file, using the lazy-loading syntax.

这将创建一个名为 `orders` 的新目录，其中包含 `OrdersModule` 和 `OrdersRoutingModule` 以及新的 `OrdersComponent` 源文件。使用 `--route` 选项指定的 `orders` 路由，用惰性加载语法添加到了 `app-routing.module.ts` 文件内的 `routes` 数组中。

<code-example header="src/app/app-routing.module.ts" path="lazy-loading-ngmodules/src/app/app-routing.module.ts" region="routes-customers-orders"></code-example>

### Set up the UI

### 建立 UI

Though you can type the URL into the address bar, a navigation UI is straightforward for the user and more common.
Replace the default placeholder markup in `app.component.html` with a custom nav, so you can navigate to your modules in the browser:

虽然你也可以在地址栏中输入 URL，不过导航 UI 会更好用，也更常见。把 `app.component.html` 中的占位脚本替换成一个自定义的导航，以便你在浏览器中能在模块之间导航。

<code-example header="app.component.html" path="lazy-loading-ngmodules/src/app/app.component.html" region="app-component-template" header="src/app/app.component.html"></code-example>

To see your application in the browser so far, enter the following command in the command line tool window:

要想在浏览器中看到你的应用，就在命令行工具窗口中输入下列命令：

<code-example format="shell" language="shell">

ng serve

</code-example>

<!-- vale Angular.Google_WordListWarnings = NO -->

Then go to `localhost:4200` where you should see "customer-app" and three buttons.

然后，跳转到 `localhost:4200`，这时你应该看到 "customer-app" 和三个按钮。

<!-- vale Angular.Google_WordListWarnings = YES -->

<div class="lightbox">

<img alt="three buttons in the browser" src="generated/images/guide/lazy-loading-ngmodules/three-buttons.png" width="300">

</div>

These buttons work, because the Angular CLI automatically added the routes to the feature modules to the `routes` array in `app-routing.module.ts`.

这些按钮生效了，因为 Angular CLI 会自动将特性模块的路由添加到 `app-routing.module.ts` 中的 `routes` 数组中。

<a id="config-routes"></a>

### Imports and route configuration

### 导入与路由配置

The Angular CLI automatically added each feature module to the routes map at the application level.
Finish this off by adding the default route.
In the `app-routing.module.ts` file, update the `routes` array with the following:

Angular CLI 会将每个特性模块自动添加到应用级的路由映射表中。通过添加默认路由来最终完成这些步骤。在 `app-routing.module.ts` 文件中，使用如下命令更新 `routes` 数组：

<code-example header="src/app/app-routing.module.ts" path="lazy-loading-ngmodules/src/app/app-routing.module.ts" id="app-routing.module.ts" region="const-routes"></code-example>

The first two paths are the routes to the `CustomersModule` and the `OrdersModule`.
The final entry defines a default route.
The empty path matches everything that doesn't match an earlier path.

前两个路径是到 `CustomersModule` 和 `OrdersModule` 的路由。最后一个条目则定义了默认路由。空路径匹配所有不匹配先前路径的内容。

### Inside the feature module

### 特性模块内部

Next, take a look at the `customers.module.ts` file.
If you're using the Angular CLI and following the steps outlined in this page, you don't have to do anything here.

接下来，仔细看看 `customers.module.ts` 文件。如果你使用的是 Angular CLI，并按照此页面中的步骤进行操作，则无需在此处执行任何操作。

<code-example header="src/app/customers/customers.module.ts" path="lazy-loading-ngmodules/src/app/customers/customers.module.ts" id="customers.module.ts" region="customers-module"></code-example>

The `customers.module.ts` file imports the `customers-routing.module.ts` and `customers.component.ts` files.
`CustomersRoutingModule` is listed in the `@NgModule` `imports` array giving `CustomersModule` access to its own routing module.
`CustomersComponent` is in the `declarations` array, which means `CustomersComponent` belongs to the `CustomersModule`.

`customers.module.ts` 文件导入了 `customers-routing.module.ts` 和 `customers.component.ts` 文件。`@NgModule` 的 `imports` 数组中列出了 `CustomersRoutingModule`，让 `CustomersModule` 可以访问它自己的路由模块。`CustomersComponent` 位于 `declarations` 数组中，这意味着 `CustomersComponent` 属于 `CustomersModule`。

The `app-routing.module.ts` then imports the feature module, `customers.module.ts` using JavaScript's dynamic import.

然后，`app-routing.module.ts` 会使用 JavaScript 的动态导入功能来导入特性模块 `customers.module.ts`。

The feature-specific route definition file `customers-routing.module.ts` imports its own feature component defined in the `customers.component.ts` file, along with the other JavaScript import statements.
It then maps the empty path to the `CustomersComponent`.

专属于特性模块的路由定义文件 `customers-routing.module.ts` 将导入在 `customers.component.ts` 文件中定义的自有特性组件，以及其它 JavaScript 导入语句。然后将空路径映射到 `CustomersComponent`。

<code-example header="src/app/customers/customers-routing.module.ts" path="lazy-loading-ngmodules/src/app/customers/customers-routing.module.ts" id="customers-routing.module.ts" region="customers-routing-module"></code-example>

The `path` here is set to an empty string because the path in `AppRoutingModule` is already set to `customers`, so this route in the `CustomersRoutingModule`, is already within the `customers` context.
Every route in this routing module is a child route.

这里的 `path` 设置为空字符串，因为 `AppRoutingModule` 中的路径已经设置为 `customers`，因此，`CustomersRoutingModule` 中的此路由已经位于 `customers` 这个上下文中。此路由模块中的每个路由都是其子路由。

The other feature module's routing module is configured similarly.

另一个特性模块中路由模块的配置也类似。

<code-example header="src/app/orders/orders-routing.module.ts (excerpt)" path="lazy-loading-ngmodules/src/app/orders/orders-routing.module.ts" id="orders-routing.module.ts" region="orders-routing-module-detail"></code-example>

### Verify lazy loading

### 确认它工作正常

You can verify that a module is indeed being lazy loaded with the Chrome developer tools.
In Chrome, open the developer tools by pressing `Cmd+Option+i` on a Mac or `Ctrl+Shift+j` on a PC and go to the Network Tab.

你可以使用 Chrome 开发者工具来验证一下这些模块真的是惰性加载的。在 Chrome 中，按 `Cmd+Option+i`（Mac）或 `Ctrl+Shift+j`（PC），并选中 `Network` 页标签。

<div class="lightbox">

<img alt="lazy loaded modules diagram" src="generated/images/guide/lazy-loading-ngmodules/network-tab.png" width="600">

</div>

Click on the Orders or Customers button.
If you see a chunk appear, everything is wired up properly and the feature module is being lazy loaded.
A chunk should appear for Orders and for Customers but only appears once for each.

点击 Orders 或 Customers 按钮。如果你看到某个 chunk 文件出现了，就表示一切就绪，特性模块被惰性加载成功了。Orders 和 Customers 都应该出现一次 chunk，并且它们各自只应该出现一次。

<div class="lightbox">

<img alt="lazy loaded modules diagram" src="generated/images/guide/lazy-loading-ngmodules/chunk-arrow.png" width="600">

</div>

To see it again, or to test after making changes, click the circle with a line through it in the upper left of the Network Tab:

要想再次查看它或测试修改后的行为，只要点击 Network 页左上放的 ` 清除 ` 图标即可。

<div class="lightbox">

<img alt="lazy loaded modules diagram" src="generated/images/guide/lazy-loading-ngmodules/clear.gif" width="200">

</div>

Then reload with `Cmd+r` or `Ctrl+r`, depending on your platform.

然后，使用 `Cmd+r`（Mac）或 `Ctrl+r`（PC）重新加载页面。

## `forRoot()` and `forChild()`

## `forRoot()` 与 `forChild()`

You might have noticed that the Angular CLI adds `RouterModule.forRoot(routes)` to the `AppRoutingModule` `imports` array.
This lets Angular know that the `AppRoutingModule` is a routing module and `forRoot()` specifies that this is the root routing module.
It configures all the routes you pass to it, gives you access to the router directives, and registers the `Router` service.
Use `forRoot()` only once in the application, inside the `AppRoutingModule`.

你可能已经注意到了，Angular CLI 会把 `RouterModule.forRoot(routes)` 添加到 `AppRoutingModule` 的 `imports` 数组中。这会让 Angular 知道 `AppRoutingModule` 是一个路由模块，而 `forRoot()` 表示这是一个根路由模块。它会配置你传入的所有路由、让你能访问路由器指令并注册 `Router`。`forRoot()` 在应用中只应该使用一次，也就是这个 `AppRoutingModule` 中。

The Angular CLI also adds `RouterModule.forChild(routes)` to feature routing modules.
This way, Angular knows that the route list is only responsible for providing extra routes and is intended for feature modules.
You can use `forChild()` in multiple modules.

Angular CLI 还会把 `RouterModule.forChild(routes)` 添加到各个特性模块中。这种方式下 Angular 就会知道这个路由列表只负责提供额外的路由并且其设计意图是作为特性模块使用。你可以在多个模块中使用 `forChild()`。

The `forRoot()` method takes care of the *global* injector configuration for the Router.
The `forChild()` method has no injector configuration.
It uses directives such as `RouterOutlet` and `RouterLink`.
For more information, see the [`forRoot()` pattern](guide/singleton-services#forRoot) section of the [Singleton Services](guide/singleton-services) guide.

`forRoot()` 方法为路由器管理*全局性的*注入器配置。`forChild()` 方法中没有注入器配置，只有像 `RouterOutlet` 和 `RouterLink` 这样的指令。欲知详情，参阅[单例服务](guide/singleton-services)章的 [`forRoot()` 模式](guide/singleton-services#forRoot)小节。

<a id="preloading"></a>

## Preloading

## 预加载

Preloading improves UX by loading parts of your application in the background.
You can preload modules or component data.

预加载通过在后台加载部分应用来改进用户体验。你可以预加载模块或组件数据。

### Preloading modules

### 预加载模块

Preloading modules improves UX by loading parts of your application in the background. By doing this, users don't have to wait for the elements to download when they activate a route.

预加载模块通过在后台加载部分应用来改善用户体验。这样一来，用户在激活路由时就无需等待下载这些元素。

To enable preloading of all lazy loaded modules, import the `PreloadAllModules` token from the Angular `router`.

要启用所有惰性加载模块的预加载，请从 Angular 的 `router` 导入 `PreloadAllModules` 令牌。

<code-example header="AppRoutingModule (excerpt)">

import { PreloadAllModules } from '&commat;angular/router';

</code-example>

Still in the `AppRoutingModule`, specify your preloading strategy in `forRoot()`.

还是在 `AppRoutingModule` 中，通过 `forRoot()` 指定你的预加载策略。

<code-example header="AppRoutingModule (excerpt)">

RouterModule.forRoot(
  appRoutes,
  {
    preloadingStrategy: PreloadAllModules
  }
)

</code-example>

### Preloading component data

### 预加载组件数据

To preload component data, use a `resolver`.
Resolvers improve UX by blocking the page load until all necessary data is available to fully display the page.

要预加载组件数据，可以用 `resolver` 守卫。解析器通过阻止页面加载来改进用户体验，直到显示页面时的全部必要数据都可用。

#### Resolvers

#### 解析器

Create a resolver service.
With the Angular CLI, the command to create a service is as follows:

创建一个解析器服务。通过 Angular CLI，创建服务的命令如下：

<code-example format="shell" language="shell">

ng generate service &lt;service-name&gt;

</code-example>

In the newly created service, implement the `Resolve` interface provided by the `&commat;angular/router` package:

在新创建的服务中，实现由 `@angular/router` 包提供的 `Resolve` 接口：

<code-example header="Resolver service (excerpt)">

import { Resolve } from '&commat;angular/router';

&hellip;

/* An interface that represents your data model */
export interface Crisis {
  id: number;
  name: string;
}

export class CrisisDetailResolverService implements Resolve&lt;Crisis&gt; {
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable&lt;Crisis&gt; {
    // your logic goes here
  }
}

</code-example>

Import this resolver into your module's routing module.

把这个解析器导入此模块的路由模块。

<code-example header="Feature module's routing module (excerpt)">

import { CrisisDetailResolverService } from './crisis-detail-resolver.service';

</code-example>

Add a `resolve` object to the component's `route` configuration.

在组件的 `route` 配置中添加一个 `resolve` 对象。

<code-example header="Feature module's routing module (excerpt)">

{
  path: '/your-path',
  component: YourComponent,
  resolve: {
    crisis: CrisisDetailResolverService
  }
}

</code-example>

In the component's constructor, inject an instance of the `ActivatedRoute` class that represents the current route.

在此组件的构造函数中，注入一个 `ActivatedRoute` 实例，它可以表示当前路由。

<code-example header="Component's constructor (excerpt)">

import { ActivatedRoute } from '&commat;angular/router';

&commat;Component({ &hellip; })
class YourComponent {
  constructor(private route: ActivatedRoute) {}
}

</code-example>

Use the injected instance of the `ActivatedRoute` class to access `data` associated with a given route.

使用注入进来的 `ActivatedRoute` 类实例来访问与指定路由关联的 `data` 值。

<code-example header="Component's ngOnInit lifecycle hook (excerpt)">

import { ActivatedRoute } from '&commat;angular/router';

&commat;Component({ &hellip; })
class YourComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
      .subscribe(data =&gt; {
        const crisis: Crisis = data.crisis;
        // &hellip;
      });
  }
}

</code-example>

For more information with a working example, see the [routing tutorial section on preloading](guide/router-tutorial-toh#preloading-background-loading-of-feature-areas).

关于工作范例的更多信息，请参阅[路由教程的预加载部分](guide/router-tutorial-toh#preloading-background-loading-of-feature-areas)。

## Troubleshooting lazy-loading modules

## 对惰性加载模块进行故障排除

A common error when lazy-loading modules is importing common modules in multiple places within an application.
Test for this condition by first generating the module using the Angular CLI and including the `--route route-name` parameter, where `route-name` is the name of your module.
Next, create the module without the `--route` parameter.
If `ng generate module` with the `--route` parameter returns an error, but runs correctly without it, you might have imported the same module in multiple places.

惰性加载模块时常见的错误之一，就是在应用程序中的多个位置导入通用模块。可以先用 Angular CLI 生成模块并包括 `--route route-name` 参数，来测试这种情况，其中 `route-name` 是模块的名称。接下来，创建不带 `--route` 参数的模块。如果你调用 `ng generate module` 时带上了 `--route` 参数，就会返回一个错误，否则它便可以正确运行，这样一来你就可能会在多个位置导入相同的模块。

Remember, many common Angular modules should be imported at the base of your application.

请记住，许多常见的 Angular 模块都应该导入应用的基础模块中。

For more information on Angular Modules, see [NgModules](guide/ngmodules).

有关 Angular 模块的更多信息，请参见 [NgModules](guide/ngmodules)。

## More on NgModules and routing

## 更多关于 NgModule 和路由的知识

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Routing and Navigation](guide/router)

  [路由与导航](guide/router)

* [Providers](guide/providers)

  [服务提供者](guide/providers)

* [Types of Feature Modules](guide/module-types)

  [特性模块的分类](guide/module-types)

* [Route-level code-splitting in Angular](https://web.dev/route-level-code-splitting-in-angular)

  [Angular 中的路由级代码拆分](https://web.dev/route-level-code-splitting-in-angular/)

* [Route preloading strategies in Angular](https://web.dev/route-preloading-in-angular)

  [Angular 中的路由预加载策略](https://web.dev/route-preloading-in-angular/)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
