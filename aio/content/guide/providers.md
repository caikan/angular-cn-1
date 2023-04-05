# Providing dependencies in modules

# 在模块中提供依赖

A provider is an instruction to the [Dependency Injection](guide/dependency-injection) system on how to obtain a value for a dependency.
Most of the time, these dependencies are services that you create and provide.

提供者就是一本说明书，用来指导[依赖注入](guide/dependency-injection)系统该如何获取某个依赖的值。大多数情况下，这些依赖就是你要创建和提供的那些服务。

For the final sample application using the provider that this page describes, see the <live-example></live-example>.

要想查看本页提到的这个带有特性模块的范例应用，参阅 <live-example></live-example>。

## Providing a service

## 提供服务

If you already have an application that was created with the [Angular CLI](cli), you can create a service using the [`ng generate`](cli/generate) CLI command in the root project directory.
Replace *User* with the name of your service.

如果你是用 [Angular CLI](cli) 创建的应用，那么可以使用下列 CLI 的 [`ng generate`](cli/generate) 命令在项目根目录下创建一个服务。把其中的 `User` 替换成你的服务名。

<code-example format="shell" language="shell">

ng generate service User

</code-example>

This command creates the following `UserService` skeleton:

该命令会创建下列 `UserService` 骨架：

<code-example header="src/app/user.service.ts" path="providers/src/app/user.service.0.ts"></code-example>

You can now inject `UserService` anywhere in your application.

现在，你就可以在应用中到处注入 `UserService` 了。

The service itself is a class that the CLI generated and that's decorated with `@Injectable()`.
By default, this decorator has a `providedIn` property, which creates a provider for the service.
In this case, `providedIn: 'root'` specifies that Angular should provide the service in the root injector.

该服务本身是 CLI 创建的一个类，并且加上了 `@Injectable()` 装饰器。默认情况下，该装饰器是用 `providedIn` 属性进行配置的，它会为该服务创建一个提供者。在这个例子中，`providedIn: 'root'` 指定 Angular 应该在根注入器中提供该服务。

## Provider scope

## 提供者的作用域

When you add a service provider to the root application injector, it's available throughout the application.
Additionally, these providers are also available to all the classes in the application as long they have the lookup token.

当你把服务提供者添加到应用的根注入器中时，它就在整个应用程序中可用了。另外，这些服务提供者也同样对整个应用中的类是可用的 —— 只要它们有供查找用的服务令牌。

You should always provide your service in the root injector unless there is a case where you want the service to be available only if the consumer imports a particular `@NgModule`.

你应该始终在根注入器中提供这些服务 —— 除非你希望该服务只有在消费方要导入特定的 `@NgModule` 时才生效。

## `providedIn` and NgModules

## `providedIn` 与 NgModule

It's also possible to specify that a service should be provided in a particular `@NgModule`.
For example, if you don't want `UserService` to be available to applications unless they import a `UserModule` you've created, you can specify that the service should be provided in the module:

也可以规定某个服务只有在特定的 `@NgModule` 中提供。比如，如果你希望只有当消费方导入了你创建的 `UserModule` 时才让 `UserService` 在应用中生效，那就可以指定该服务要在该模块中提供：

<code-example header="src/app/user.service.ts" path="providers/src/app/user.service.1.ts"></code-example>

The example above shows the preferred way to provide a service in a module.
This method is preferred because it enables tree-shaking of the service if nothing injects it.
If it's not possible to specify in the service which module should provide it, you can also declare a provider for the service within the module:

上面的例子展示的就是在模块中提供服务的首选方式。之所以推荐该方式，是因为当没有人注入它时，该服务就可以被摇树优化掉。如果没办法指定哪个模块该提供这个服务，你也可以在那个模块中为该服务声明一个提供者：

<code-example header="src/app/user.module.ts" path="providers/src/app/user.module.ts"></code-example>

## Limiting provider scope by lazy loading modules

## 使用惰性加载模块限制提供者的作用域

In the basic CLI-generated app, modules are eagerly loaded which means that they are all loaded when the application launches.
Angular uses an injector system to make things available between modules.
In an eagerly loaded app, the root application injector makes all of the providers in all of the modules available throughout the application.

在 CLI 生成的基本应用中，模块是急性加载的，这意味着它们都是由本应用启动的，Angular 会使用一个依赖注入体系来让一切服务都在模块间有效。对于急性加载式应用，应用中的根注入器会让所有服务提供者都对整个应用有效。

This behavior necessarily changes when you use lazy loading.
Lazy loading is when you load modules only when you need them; for example, when routing.
They aren't loaded right away like with eagerly loaded modules.
This means that any services listed in their provider arrays aren't available because the root injector doesn't know about these modules.

当使用惰性加载时，这种行为需要进行改变。惰性加载就是只有当需要时才加载模块，比如路由中。它们没办法像急性加载模块那样进行加载。这意味着，在它们的 `providers` 数组中列出的服务都是不可用的，因为根注入器并不知道这些模块。

<!--todo: KW--Make diagram here -->

<!--todo: KW--per Misko: not clear if the lazy modules are siblings or grand-children. They are both depending on router structure. -->

When the Angular router lazy-loads a module, it creates a new injector.
This injector is a child of the root application injector.
Imagine a tree of injectors; there is a single root injector and then a child injector for each lazy loaded module.
This child injector gets populated with all the module-specific providers, if any. 
Look up resolution for every provider follows the [rules of dependency injection hierarchy](guide/hierarchical-dependency-injection#resolution-rules). 

当 Angular 的路由器惰性加载一个模块时，它会创建一个新的注入器。这个注入器是应用的根注入器的一个子注入器。想象一棵注入器树，它有唯一的根注入器，而每一个惰性加载模块都有一个自己的子注入器。这个子注入器会操纵所有特定于此模块的提供者，如果有的话。可以遵循这份[多级依赖注入规则](guide/hierarchical-dependency-injection#resolution-rules)来了解每个提供者的解析过程。

Any component created within a lazy loaded module's context, such as by router navigation, gets its own local instance of child provided services, not the instance in the root application injector.
Components in external modules continue to receive the instances created for the application root injector.

任何在惰性加载模块的上下文中创建的组件（比如路由导航），都会获取由子注入器提供的服务的局部实例，而不是应用的根注入器中的实例。而外部模块中的组件，仍然会收到来自于应用的根注入器创建的实例。

Though you can provide services by lazy loading modules, not all services can be lazy loaded.
For instance, some modules only work in the root module, such as the Router.
The Router works with the global location object in the browser.

虽然你可以使用惰性加载模块来提供实例，但不是所有的服务都能惰性加载。比如，像路由之类的模块只能在根模块中使用。路由器需要使用浏览器中的全局对象 `location` 进行工作。

As of Angular version 9, you can provide a new instance of a service with each lazy loaded module.
The following code adds this functionality to `UserService`.

从 Angular 9 开始，你可以在每个惰性加载模块中提供服务的新实例。下列代码把此功能添加到 `UserService` 中。

<code-example header="src/app/user.service.ts" path="providers/src/app/user.service.2.ts"></code-example>

With `providedIn: 'any'`, all eagerly loaded modules share a singleton instance; however, lazy loaded modules each get their own unique instance, as shown in the following diagram.

通过使用 `providedIn: 'any'`，所有急性加载的模块都会共享同一个服务单例，不过，惰性加载模块各自有它们自己独有的单例。如下所示。

<div class="lightbox">

<img alt="any-provider-scope" class="left" src="generated/images/guide/providers/any-provider.svg">

</div>

## Limiting provider scope with components

## 使用组件限定服务提供者的作用域

Another way to limit provider scope is by adding the service you want to limit to the component's `providers` array.
Component providers and NgModule providers are independent of each other.
This method is helpful when you want to eagerly load a module that needs a service all to itself.
Providing a service in the component limits the service only to that component and its descendants.
Other components in the same module can't access it.

另一种限定提供者作用域的方式是把要限定的服务添加到组件的 `providers` 数组中。组件中的提供者和 NgModule 中的提供者是彼此独立的。当你要急性加载一个自带了全部所需服务的模块时，这种方式是有帮助的。在组件中提供服务，会限定该服务只能在该组件及其子组件中有效，而同一模块中的其它组件不能访问它。

<code-example header="src/app/app.component.ts" path="providers/src/app/app.component.ts" region="component-providers"></code-example>

## Providing services in modules vs. components

## 在模块中提供服务还是在组件中？

Generally, provide services the whole application needs in the root module and scope services by providing them in lazy loaded modules.

通常，要在根模块中提供整个应用都需要的服务，在惰性加载模块中提供限定范围的服务。

The router works at the root level so if you put providers in a component, even `AppComponent`, lazy loaded modules, which rely on the router, can't see them.

路由器工作在根级，所以如果你把服务提供者放进组件（即使是 `AppComponent`）中，那些依赖于路由器的惰性加载模块，将无法看到它们。

<!-- KW--Make a diagram here -->

Register a provider with a component when you must limit a service instance to a component and its component tree, that is, its child components.
For example, a user editing component, `UserEditorComponent`, that needs a private copy of a caching `UserService` should register the `UserService` with the `UserEditorComponent`.
Then each new instance of the `UserEditorComponent` gets its own cached service instance.

当你必须把一个服务实例的作用域限定到组件及其组件树中时，可以使用组件注册一个服务提供者。比如，用户编辑组件 `UserEditorComponent`，它需要一个缓存 `UserService` 实例，那就应该把 `UserService` 注册进 `UserEditorComponent` 中。然后，每个 `UserEditorComponent` 的实例都会获取它自己的缓存服务实例。

<a id="singleton-services"></a>
<a id="component-child-injectors"></a>

## Injector hierarchy and service instances

## 多级注入器和服务实例

Services are singletons within the scope of an injector, which means there is at most one instance of a service in a given injector.

服务都是某个注入器范围内的单例，这意味着在给定的注入器中最多有一个服务实例。

Angular DI has a [hierarchical injection system](guide/hierarchical-dependency-injection), which means that nested injectors can create their own service instances.
Whenever Angular creates a new instance of a component that has `providers` specified in `@Component()`, it also creates a new child injector for that instance.
Similarly, when a new NgModule is lazy-loaded at run time, Angular can create an injector for it with its own providers.

Angular DI 具有[多级注入体系](guide/hierarchical-dependency-injection)，这意味着嵌套的注入器可以创建自己的服务实例。`@Component()` 指定的 `providers` 的组件的新实例时，它也会为该实例创建一个新的子注入器。同样，当在运行时惰性加载新的 NgModule 时，Angular 可以使用其自己的提供者为其创建注入器。

Child modules and component injectors are independent of each other, and create their own separate instances of the provided services.
When Angular destroys an NgModule or component instance, it also destroys that injector and that injector's service instances.

子模块注入器和组件注入器彼此独立，并为已提供的服务创建它们自己的单独实例。当 Angular 销毁 NgModule 或组件实例时，它也会销毁该注入器和该注入器的服务实例。

For more information, see [Hierarchical injectors](guide/hierarchical-dependency-injection).

欲知详情，请参见[分层注入器](guide/hierarchical-dependency-injection)。

## More on NgModules

## 关于 NgModule 的更多知识

You may also be interested in:

你还可能对下列内容感兴趣：

* [Singleton Services](guide/singleton-services), which elaborates on the concepts covered on this page

  [单例服务](guide/singleton-services)详细解释了本页包含的那些概念

* [Lazy Loading Modules](guide/lazy-loading-ngmodules)

  [惰性加载模块](guide/lazy-loading-ngmodules)

* [Dependency providers](guide/dependency-injection-providers)

  [依赖提供者](guide/dependency-injection-providers)

* [NgModule FAQ](guide/ngmodule-faq)

  [NgModule 常见问题](guide/ngmodule-faq)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
