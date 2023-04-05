# Dependency injection in action

# 依赖注入实战

This guide explores many of the features of dependency injection (DI) in Angular.

本章涉及到 Angular 依赖注入（DI）的很多特性。

<div class="alert is-helpful">

See the <live-example></live-example> for a working example containing the code snippets in this guide.

包含本指南中代码片段的可工作范例，参阅<live-example></live-example>。

</div>

<a id="multiple-service-instances"></a>

## Multiple service instances (sandboxing)

## 多个服务实例(沙箱式隔离)

Sometimes you want multiple instances of a service at *the same level* of the component hierarchy.

在组件树的*同一个级别*上，有时需要一个服务的多个实例。

A good example is a service that holds state for its companion component instance.
You need a separate instance of the service for each component.
Each service has its own work-state, isolated from the service-and-state of a different component.
This is called *sandboxing* because each service and component instance has its own sandbox to play in.

一个用来保存其伴生组件的实例状态的服务就是个好例子。每个组件都需要该服务的单独实例。每个服务有自己的工作状态，与其它组件的服务和状态隔离。这叫做*沙箱化*，因为每个服务和组件实例都在自己的沙箱里运行。

<a id="hero-bios-component"></a>

In this example, `HeroBiosComponent` presents three instances of `HeroBioComponent`.

在这个例子中，`HeroBiosComponent` 渲染了 `HeroBioComponent` 的三个实例。

<code-example header="ap/hero-bios.component.ts" path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="simple"></code-example>

Each `HeroBioComponent` can edit a single hero's biography.
`HeroBioComponent` relies on `HeroCacheService` to fetch, cache, and perform other persistence operations on that hero.

每个 `HeroBioComponent` 都能编辑一个英雄的生平。`HeroBioComponent` 依赖 `HeroCacheService` 服务来对该英雄进行读取、缓存和执行其它持久化操作。

<code-example header="src/app/hero-cache.service.ts" path="dependency-injection-in-action/src/app/hero-cache.service.ts" region="service"></code-example>

Three instances of `HeroBioComponent` can't share the same instance of `HeroCacheService`, as they'd be competing with each other to determine which hero to cache.

这三个 `HeroBioComponent` 实例不能共享同一个 `HeroCacheService` 实例。否则它们会相互冲突，争相把自己的英雄放在缓存里面。

Instead, each `HeroBioComponent` gets its *own* `HeroCacheService` instance by listing `HeroCacheService` in its metadata `providers` array.

它们应该通过在自己的元数据(metadata)`providers` 数组里面列出 `HeroCacheService`, 这样每个 `HeroBioComponent` 就能*拥有*自己独立的 `HeroCacheService` 实例了。

<code-example header="src/app/hero-bio.component.ts" path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="component"></code-example>

The parent `HeroBiosComponent` binds a value to `heroId`.
`ngOnInit` passes that ID to the service, which fetches and caches the hero.
The getter for the `hero` property pulls the cached hero from the service.
The template displays this data-bound property.

父组件 `HeroBiosComponent` 把一个值绑定到 `heroId`。`ngOnInit` 把该 `id` 传递到服务，然后服务获取和缓存英雄。`hero` 属性的 getter 从服务里面获取缓存的英雄，并在模板里显示它绑定到属性值。

Find this example in <live-example name="dependency-injection-in-action">live code</live-example> and confirm that the three `HeroBioComponent` instances have their own cached hero data.

到<live-example name="dependency-injection-in-action">现场演练</live-example>中找到这个例子，确认三个 `HeroBioComponent` 实例拥有自己独立的英雄数据缓存。

<div class="lightbox">

<img alt="Bios" src="generated/images/guide/dependency-injection-in-action/hero-bios.png">

</div>

<a id="qualify-dependency-lookup"></a>

## Qualify dependency lookup with parameter decorators

## 使用参数装饰器来限定依赖查找方式

When a class requires a dependency, that dependency is added to the constructor as a parameter.
When Angular needs to instantiate the class, it calls upon the DI framework to supply the dependency.
By default, the DI framework searches for a provider in the injector hierarchy, starting at the component's local injector, and if necessary bubbling up through the injector tree until it reaches the root injector.

当类需要某个依赖项时，该依赖项就会作为参数添加到类的构造函数中。当 Angular 需要实例化该类时，就会调用 DI 框架来提供该依赖。默认情况下，DI 框架会在注入器树中查找一个提供者，从该组件的局部注入器开始，如果需要，则沿着注入器树向上冒泡，直到根注入器。

* The first injector configured with a provider supplies the dependency (a service instance or value) to the constructor

  第一个配置过该提供者的注入器就会把依赖（服务实例或值）提供给这个构造函数

* If no provider is found in the root injector, the DI framework throws an error

  如果在根注入器中也没有找到提供者，则 DI 框架将会抛出一个错误

There are a number of options for modifying the default search behavior, using *parameter decorators* on the service-valued parameters of a class constructor.

通过在类的构造函数中对服务参数使用*参数装饰器*，可以提供一些选项来修改默认的搜索行为。

<a id="optional"></a>

### Make a dependency `@Optional` and limit search with `@Host`

### 用 `@Optional` 来让依赖是可选的，以及使用 `@Host` 来限定搜索方式

Dependencies can be registered at any level in the component hierarchy.
When a component requests a dependency, Angular starts with that component's injector and walks up the injector tree until it finds the first suitable provider.
Angular throws an error if it can't find the dependency during that walk.

依赖可以注册在组件树的任何层级上。当组件请求某个依赖时，Angular 会从该组件的注入器找起，沿着注入器树向上，直到找到了第一个满足要求的提供者。如果没找到依赖，Angular 就会抛出一个错误。

In some cases, you need to limit the search or accommodate a missing dependency.
You can modify Angular's search behavior with the `@Host` and `@Optional` qualifying decorators on a service-valued parameter of the component's constructor.

某些情况下，你需要限制搜索，或容忍依赖项的缺失。你可以使用组件构造函数参数上的 `@Host` 和 `@Optional` 这两个限定装饰器来修改 Angular 的搜索行为。

* The `@Optional` property decorator tells Angular to return null when it can't find the dependency

  `@Optional` 属性装饰器告诉 Angular 当找不到依赖时就返回 null

* The `@Host` property decorator stops the upward search at the *host component*.
  The host component is typically the component requesting the dependency.
  However, when this component is projected into a *parent* component, that parent component becomes the host.
  The following example covers this second case.

  `@Host` 属性装饰器会禁止在*宿主组件*以上的搜索。宿主组件通常就是请求该依赖的那个组件。不过，当该组件投影进某个*父*组件时，那个父组件就会变成宿主。下面的例子中介绍了第二种情况。

These decorators can be used individually or together, as shown in the example.
This `HeroBiosAndContactsComponent` is a revision of `HeroBiosComponent` which you looked at [above](guide/dependency-injection-in-action#hero-bios-component).

如下例所示，这些装饰器可以独立使用，也可以同时使用。这个 `HeroBiosAndContactsComponent` 是你[以前](guide/dependency-injection-in-action#hero-bios-component)见过的那个 `HeroBiosComponent` 的修改版。

<code-example header="src/app/hero-bios.component.ts (HeroBiosAndContactsComponent)" path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="hero-bios-and-contacts"></code-example>

Focus on the template:

注意看模板：

<code-example header="dependency-injection-in-action/src/app/hero-bios.component.ts" path="dependency-injection-in-action/src/app/hero-bios.component.ts" region="template"></code-example>

Now there's a new `<hero-contact>` element between the `<hero-bio>` tags.
Angular *projects*, or *transcludes*, the corresponding `HeroContactComponent` into the `HeroBioComponent` view, placing it in the `<ng-content>` slot of the `HeroBioComponent` template.

在 `<hero-bio>` 标签中是一个新的 `<hero-contact>` 元素。Angular 就会把相应的 `HeroContactComponent`*投影*(*transclude*)进 `HeroBioComponent` 的视图里，将它放在 `HeroBioComponent` 模板的 `<ng-content>` 标签槽里。

<code-example header="src/app/hero-bio.component.ts (template)" path="dependency-injection-in-action/src/app/hero-bio.component.ts" region="template"></code-example>

The result is shown below, with the hero's telephone number from `HeroContactComponent` projected above the hero description.

从 `HeroContactComponent` 获得的英雄电话号码，被投影到上面的英雄描述里，结果如下：

<div class="lightbox">

<img alt="bio and contact" src="generated/images/guide/dependency-injection-in-action/hero-bio-and-content.png">

</div>

Here's `HeroContactComponent`, which demonstrates the qualifying decorators.

这里的 `HeroContactComponent` 演示了限定型装饰器。

<code-example header="src/app/hero-contact.component.ts" path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="component"></code-example>

Focus on the constructor parameters.

注意构造函数的参数。

<code-example header="src/app/hero-contact.component.ts" path="dependency-injection-in-action/src/app/hero-contact.component.ts" region="ctor-params"></code-example>

The `@Host()` function decorating the  `heroCache` constructor property ensures that you get a reference to the cache service from the parent `HeroBioComponent`.
Angular throws an error if the parent lacks that service, even if a component higher in the component tree includes it.

`@Host()` 函数是构造函数属性 `heroCache` 的装饰器，确保从其父组件 `HeroBioComponent` 得到一个缓存服务。如果该父组件中没有该服务，Angular 就会抛出错误，即使组件树里的再上级有某个组件拥有这个服务，还是会抛出错误。

A second `@Host()` function decorates the `loggerService` constructor property.
The only `LoggerService` instance in the application is provided at the `AppComponent` level.
The host `HeroBioComponent` doesn't have its own `LoggerService` provider.

另一个 `@Host()` 函数是构造函数属性 `loggerService` 的装饰器。在本应用程序中只有一个在 `AppComponent` 级提供的 `LoggerService` 实例。该宿主 `HeroBioComponent` 没有自己的 `LoggerService` 提供者。

Angular throws an error if you haven't also decorated the property with `@Optional()`.
When the property is marked as optional, Angular sets `loggerService` to null and the rest of the component adapts.

如果没有同时使用 `@Optional()` 装饰器的话，Angular 就会抛出错误。当该属性带有 `@Optional()` 标记时，Angular 就会把 `loggerService` 设置为 null，并继续执行组件而不会抛出错误。

Here's `HeroBiosAndContactsComponent` in action.

下面是 `HeroBiosAndContactsComponent` 的执行结果：

<div class="lightbox">

<img alt="Bios with contact into" src="generated/images/guide/dependency-injection-in-action/hero-bios-and-contacts.png">

</div>

If you comment out the `@Host()` decorator, Angular walks up the injector ancestor tree until it finds the logger at the `AppComponent` level.
The logger logic kicks in and the hero display updates with the "!!!" marker to indicate that the logger was found.

如果注释掉 `@Host()` 装饰器，Angular 就会沿着注入器树往上走，直到在 `AppComponent` 中找到该日志服务。日志服务的逻辑加了进来，所显示的英雄信息增加了 "!!!" 标记，这表明确实找到了日志服务。

<div class="lightbox">

<img alt="Without @Host" src="generated/images/guide/dependency-injection-in-action/hero-bio-contact-no-host.png">

</div>

If you restore the `@Host()` decorator and comment out `@Optional`, the application throws an exception when it cannot find the required logger at the host component level.

如果你恢复 `@Host()` 装饰器并注释掉 `@Optional`，应用程序在宿主组件级别找不到所需的记录器时会抛出异常。

<code-example format="output" hideCopy language="shell">

EXCEPTION: No provider for LoggerService! (HeroContactComponent -&gt; LoggerService)

</code-example>

### Supply a custom provider with `@Inject`

### 使用 `@Inject` 指定自定义提供者

Using a custom provider allows you to provide a concrete implementation for implicit dependencies, such as built-in browser APIs.
The following example uses an `InjectionToken` to provide the [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage) browser API as a dependency in the `BrowserStorageService`.

自定义提供者让你可以为隐式依赖提供一个具体的实现，比如内置浏览器 API。下面的例子使用 `InjectionToken` 来提供 [localStorage](https://developer.mozilla.org/docs/Web/API/Window/localStorage)，将其作为 `BrowserStorageService` 的依赖项。

<code-example header="src/app/storage.service.ts" path="dependency-injection-in-action/src/app/storage.service.ts"></code-example>

The `factory` function returns the `localStorage` property that is attached to the browser window object.
The `Inject` decorator is a constructor parameter used to specify a custom provider of a dependency.
This custom provider can now be overridden during testing with a mock API of `localStorage` instead of interacting with real browser APIs.

`factory` 函数返回 window 对象上的 `localStorage` 属性。`Inject` 装饰器修饰一个构造函数参数，用于为某个依赖提供自定义提供者。现在，就可以在测试期间使用 `localStorage` 的 Mock API 来覆盖这个提供者了，而不必与真实的浏览器 API 进行交互。

<a id="skip"></a>

### Modify the provider search with `@Self` and `@SkipSelf`

### 使用 `@Self` 和 `@SkipSelf` 来修改提供者的搜索方式

Providers can also be scoped by injector through constructor parameter decorators.
The following example overrides the `BROWSER_STORAGE` token in the `Component` class `providers` with the `sessionStorage` browser API.
The same `BrowserStorageService` is injected twice in the constructor, decorated with `@Self` and `@SkipSelf` to define which injector handles the provider dependency.

注入器也可以通过构造函数的参数装饰器来指定范围。下面的例子就在 `Component` 类的 `providers` 中使用浏览器的 `sessionStorage` API 覆盖了 `BROWSER_STORAGE` 令牌。同一个 `BrowserStorageService` 在构造函数中使用 `@Self` 和 `@SkipSelf` 装饰器注入了两次，来分别指定由哪个注入器来提供依赖。

<code-example header="src/app/storage.component.ts" path="dependency-injection-in-action/src/app/storage.component.ts"></code-example>

Using the `@Self` decorator, the injector only looks at the component's injector for its providers.
The `@SkipSelf` decorator allows you to skip the local injector and look up in the hierarchy to find a provider that satisfies this dependency.
The `sessionStorageService` instance interacts with the `BrowserStorageService` using the `sessionStorage` browser API, while the `localStorageService` skips the local injector and uses the root `BrowserStorageService` that uses the `localStorage` browser API.

使用 `@Self` 装饰器时，注入器只在该组件的注入器中查找提供者。`@SkipSelf` 装饰器可以让你跳过局部注入器，并在注入器树中向上查找，以发现哪个提供者满足该依赖。`sessionStorageService` 实例使用浏览器的 `sessionStorage` 来跟 `BrowserStorageService` 打交道，而 `localStorageService` 跳过了局部注入器，使用根注入器提供的 `BrowserStorageService`，它使用浏览器的 `localStorage` API。

<a id="component-element"></a>

## Inject the component's DOM element

## 注入组件的 DOM 元素

Although developers strive to avoid it, many visual effects and third-party tools, such as jQuery, require DOM access.
As a result, you might need to access a component's DOM element.

即便开发者极力避免，仍然会有很多视觉效果和第三方工具 (比如 jQuery) 需要访问 DOM。这会让你不得不访问组件所在的 DOM 元素。

To illustrate, here's a minimal version of `HighlightDirective` from the [Attribute Directives](guide/attribute-directives) page.

为了说明这一点，请看[属性型指令](guide/attribute-directives)中那个 `HighlightDirective` 的简化版。

<code-example header="src/app/highlight.directive.ts" path="dependency-injection-in-action/src/app/highlight.directive.ts"></code-example>

The directive sets the background to a highlight color when the user mouses over the DOM element to which the directive is applied.

当用户把鼠标移到 DOM 元素上时，指令将指令所在的元素的背景设置为一个高亮颜色。

Angular sets the constructor's `el` parameter to the injected `ElementRef`.
(An `ElementRef` is a wrapper around a DOM element, whose `nativeElement` property exposes the DOM element for the directive to manipulate.)

Angular 把构造函数参数 `el` 设置为注入的 `ElementRef`，该 `ElementRef` 代表了宿主的 DOM 元素，它的 `nativeElement` 属性把该 DOM 元素暴露给了指令。

The sample code applies the directive's `appHighlight` attribute to two `<div>` tags, first without a value (yielding the default color) and then with an assigned color value.

下面的代码把指令的 `appHighlight` 属性(Attribute)填加到两个 `<div>` 标签里，一个没有赋值，一个赋值了颜色。

<code-example header="src/app/app.component.html (highlight)" path="dependency-injection-in-action/src/app/app.component.html" region="highlight"></code-example>

The following image shows the effect of mousing over the `<hero-bios-and-contacts>` tag.

下图显示了鼠标移到 `<hero-bios-and-contacts>` 标签上的效果：

<div class="lightbox">

<img alt="Highlighted bios" src="generated/images/guide/dependency-injection-in-action/highlight.png">

</div>

<a id="defining-providers"></a>

### Defining providers

### 定义提供者

A dependency can't always be created by the default method of instantiating a class.
You learned about some other methods in [Dependency Providers](guide/dependency-injection-providers).
The following `HeroOfTheMonthComponent` example demonstrates many of the alternatives and why you need them.
It's visually simple: a few properties and the logs produced by a logger.

用于实例化类的默认方法不一定总适合用来创建依赖。你可以到[依赖提供者](guide/dependency-injection-providers)部分查看其它方法。`HeroOfTheMonthComponent` 例子示范了一些替代方案，展示了为什么需要它们。它看起来很简单：一些属性和一些由 logger 生成的日志。

<div class="lightbox">

<img alt="Hero of the month" src="generated/images/guide/dependency-injection-in-action/hero-of-month.png">

</div>

The code behind it customizes how and where the DI framework provides dependencies.
The use cases illustrate different ways to use the *provide* object literal to associate a definition object with a DI token.

它背后的代码定制了 DI 框架提供依赖项的方法和位置。这个例子阐明了通过*提供*对象字面量来把对象的定义和 DI 令牌关联起来的另一种方式。

<code-example header="hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="hero-of-the-month"></code-example>

The `providers` array shows how you might use the different provider-definition keys:
`useValue`, `useClass`, `useExisting`, or `useFactory`.

`providers` 数组展示了你可以如何使用其它的键来定义提供者：`useValue`、`useClass`、`useExisting` 或 `useFactory`。

<a id="usevalue"></a>

#### Value providers: `useValue`

#### 值提供者：`useValue`

The `useValue` key lets you associate a fixed value with a DI token.
Use this technique to provide *runtime configuration constants* such as website base addresses and feature flags.
You can also use a value provider in a unit test to provide mock data in place of a production data service.

`useValue` 键让你可以为 DI 令牌关联一个固定的值。使用该技巧来进行*运行期常量设置*，比如网站的基础地址和功能标志等。你也可以在单元测试中使用*值提供者*，来用一个 Mock 数据来代替一个生产环境下的数据服务。

The `HeroOfTheMonthComponent` example has two value providers.

`HeroOfTheMonthComponent` 例子中有两个*值-提供者*。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-value"></code-example>

* The first provides an existing instance of the `Hero` class to use for the `Hero` token, rather than requiring the injector to create a new instance with `new` or use its own cached instance.
  Here, the token is the class itself.

  第一处提供了用于 `Hero` 令牌的 `Hero` 类的现有实例，而不是要求注入器使用 `new` 来创建一个新实例或使用它自己的缓存实例。这里令牌就是这个类本身。

* The second specifies a literal string resource to use for the `TITLE` token.
  The `TITLE` provider token is *not* a class, but is instead a special kind of provider lookup key called an [injection token](guide/dependency-injection-in-action#injection-token), represented by an `InjectionToken` instance.

  第二处为 `TITLE` 令牌指定了一个字符串字面量资源。`TITLE` 提供者的令牌*不是一个类*，而是一个特别的提供者查询键，名叫[InjectionToken](guide/dependency-injection-in-action#injection-token)，表示一个 `InjectionToken` 实例。

You can use an injection token for any kind of provider but it's particularly helpful when the dependency is a simple value like a string, a number, or a function.

你可以把 `InjectionToken` 用作任何类型的提供者的令牌，但是当依赖是简单类型（比如字符串、数字、函数）时，它会特别有用。

The value of a *value provider* must be defined before you specify it here.
The title string literal is immediately available.
The `someHero` variable in this example was set earlier in the file as shown below.
You can't use a variable whose value will be defined later.

一个*值-提供者*的值必须在指定之前定义。比如标题字符串就是立即可用的。该例中的 `someHero` 变量是以前在如下的文件中定义的。你不能使用那些要等以后才能定义其值的变量。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="some-hero"></code-example>

Other types of providers can create their values *lazily*; that is, when they're needed for injection.

其它类型的提供者都会*惰性创建*它们的值，也就是说只在需要注入它们的时候才创建。

<a id="useclass"></a>

#### Class providers: `useClass`

#### 类提供者：`useClass`

The `useClass` provider key lets you create and return a new instance of the specified class.

`useClass` 提供的键让你可以创建并返回指定类的新实例。

You can use this type of provider to substitute an *alternative implementation* for a common or default class.
The alternative implementation could, for example, implement a different strategy, extend the default class, or emulate the behavior of the real class in a test case.

你可以使用这类提供者来为公共类或默认类换上一个*替代实现*。比如，这个替代实现可以实现一种不同的策略来扩展默认类，或在测试环境中模拟真实类的行为。

The following code shows two examples in `HeroOfTheMonthComponent`.

请看下面 `HeroOfTheMonthComponent` 里的两个例子：

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-class"></code-example>

The first provider is the *de-sugared*, expanded form of the most typical case in which the class to be created (`HeroService`) is also the provider's dependency injection token.
The short form is generally preferred; this long form makes the details explicit.

第一个提供者是*展开了语法糖的*，是一个典型情况的展开。一般来说，被新建的类(`HeroService`)同时也是该提供者的注入令牌。通常都选用缩写形式，完整形式可以让细节更明确。

The second provider substitutes `DateLoggerService` for `LoggerService`.
`LoggerService` is already registered at the `AppComponent` level.
When this child component requests `LoggerService`, it receives a `DateLoggerService` instance instead.

第二个提供者使用 `DateLoggerService` 来满足 `LoggerService`。该 `LoggerService` 在 `AppComponent` 级别已经被注册。当*这个组件*要求 `LoggerService` 的时候，它得到的却是 `DateLoggerService` 服务的实例。

<div class="alert is-helpful">

This component and its tree of child components receive `DateLoggerService` instance.
Components outside the tree continue to receive the original `LoggerService` instance.

这个组件及其子组件会得到 `DateLoggerService` 实例。这个组件树之外的组件得到的仍是 `LoggerService` 实例。

</div>

`DateLoggerService` inherits from `LoggerService`; it appends the current date/time to each message:

`DateLoggerService` 从 `LoggerService` 继承；它把当前的日期/时间附加到每条信息上。

<code-example header="src/app/date-logger.service.ts" path="dependency-injection-in-action/src/app/date-logger.service.ts" region="date-logger-service"></code-example>

<a id="useexisting"></a>

#### Alias providers: `useExisting`

#### 别名提供者：`useExisting`

The `useExisting` provider key lets you map one token to another.
In effect, the first token is an *alias* for the service associated with the second token, creating two ways to access the same service object.

`useExisting` 提供了一个键，让你可以把一个令牌映射成另一个令牌。实际上，第一个令牌就是第二个令牌所关联的服务的*别名*，这样就创建了访问同一个服务对象的两种途径。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing"></code-example>

You can use this technique to narrow an API through an aliasing interface.
The following example shows an alias introduced for that purpose.

你可以使用别名接口来窄化 API。下面的例子中使用别名就是为了这个目的。

Imagine that `LoggerService` had a large API, much larger than the actual three methods and a property.
You might want to shrink that API surface to just the members you actually need.
In this example, the `MinimalLogger` [class-interface](#class-interface) reduces the API to two members:

想象 `LoggerService` 有个很大的 API 接口，远超过现有的三个方法和一个属性。你可能希望把 API 接口收窄到只有两个你确实需要的成员。在这个例子中，`MinimalLogger`[*类-接口*](#class-interface)，就这个 API 成功缩小到了只有两个成员：

<code-example header="src/app/minimal-logger.service.ts" path="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

The following example puts `MinimalLogger` to use in a simplified version of `HeroOfTheMonthComponent`.

下面的例子在一个简化版的 `HeroOfTheMonthComponent` 中使用 `MinimalLogger`。

<code-example header="src/app/hero-of-the-month.component.ts (minimal version)" path="dependency-injection-in-action/src/app/hero-of-the-month.component.1.ts"></code-example>

The `HeroOfTheMonthComponent` constructor's `logger` parameter is typed as `MinimalLogger`, so only the `logs` and `logInfo` members are visible in a TypeScript-aware editor.

`HeroOfTheMonthComponent` 构造函数的 `logger` 参数是一个 `MinimalLogger` 类型，在支持 TypeScript 感知的编辑器里，只能看到它的两个成员 `logs` 和 `logInfo`：

<div class="lightbox">

<img alt="MinimalLogger restricted API" src="generated/images/guide/dependency-injection-in-action/minimal-logger-intellisense.png">

</div>

Behind the scenes, Angular sets the `logger` parameter to the full service registered under the `LoggingService` token, which happens to be the `DateLoggerService` instance that was [provided above](guide/dependency-injection-in-action#useclass).

实际上，Angular 把 `logger` 参数设置为注入器里 `LoggerService` 令牌下注册的完整服务，该令牌恰好是[以前提供的那个](guide/dependency-injection-in-action#useclass) `DateLoggerService` 实例。

<div class="alert is-helpful">

This is illustrated in the following image, which displays the logging date.

在下面的图片中，显示了日志日期，可以确认这一点：

<div class="lightbox">

<img alt="DateLoggerService entry" src="generated/images/guide/dependency-injection-in-action/date-logger-entry.png">

</div>

</div>

<a id="usefactory"></a>

#### Factory providers: `useFactory`

#### 工厂提供者：`useFactory`

The `useFactory` provider key lets you create a dependency object by calling a factory function, as in the following example.

`useFactory` 提供了一个键，让你可以通过调用一个工厂函数来创建依赖实例，如下面的例子所示。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-factory"></code-example>

The injector provides the dependency value by invoking a factory function, that you provide as the value of the `useFactory` key.
Notice that this form of provider has a third key, `deps`, which specifies dependencies for the `useFactory` function.

注入器通过调用你用 `useFactory` 键指定的工厂函数来提供该依赖的值。
注意，提供者的这种形态还有第三个键 `deps`，它指定了供 `useFactory` 函数使用的那些依赖。

Use this technique to create a dependency object with a factory function whose inputs are a combination of *injected services* and *local state*.

使用这项技术，可以用包含了一些***依赖服务和本地状态***输入的工厂函数来***建立一个依赖对象***。

The dependency object (returned by the factory function) is typically a class instance, but can be other things as well.
In this example, the dependency object is a string of the names of the runners-up to the "Hero of the Month" contest.

这个依赖对象（由工厂函数返回的）通常是一个类实例，不过也可以是任何其它东西。在这个例子中，依赖对象是一个表示 "月度英雄" 参赛者名称的字符串。

In the example, the local state is the number `2`, the number of runners-up that the component should show.
The state value is passed as an argument to `runnersUpFactory()`.
The `runnersUpFactory()` returns the *provider factory function*, which can use both the passed-in state value and the injected services `Hero` and `HeroService`.

在这个例子中，局部状态是数字 `2`，也就是组件应该显示的参赛者数量。该状态的值传给了 `runnersUpFactory()` 作为参数。`runnersUpFactory()` 返回了*提供者的工厂函数*，它可以使用传入的状态值和注入的服务 `Hero` 和 `HeroService`。

<code-example header="runners-up.ts (excerpt)" path="dependency-injection-in-action/src/app/runners-up.ts" region="factory-synopsis"></code-example>

The provider factory function (returned by `runnersUpFactory()`) returns the actual dependency object, the string of names.

由 `runnersUpFactory()` 返回的提供者的工厂函数返回了实际的依赖对象，也就是表示名字的字符串。

* The function takes a winning `Hero` and a `HeroService` as arguments.
  Angular supplies these arguments from injected values identified by the two *tokens* in the `deps` array.

  该函数以获胜的 `Hero` 和 `HeroService` 作为参数。Angular 从 `deps` 数组中的两个*令牌*标识的注入值提供这些参数。

* The function returns the string of names, which Angular than injects into the `runnersUp` parameter of `HeroOfTheMonthComponent`

  该函数返回名字的字符串，Angular 可以把它们注入到 `HeroOfTheMonthComponent` 的 `runnersUp` 参数中。

<div class="alert is-helpful">

The function retrieves candidate heroes from the `HeroService`, takes `2` of them to be the runners-up, and returns their concatenated names.
Look at the <live-example name="dependency-injection-in-action"></live-example> for the full source code.

该函数从 `HeroService` 中接受候选的英雄，从中取 `2` 个参加竞赛，并把他们的名字串接起来返回。
参阅 <live-example name="dependency-injection-in-action"></live-example> 查看完整源码。

</div>

<a id="tokens"></a>

## Provider token alternatives: class interface and 'InjectionToken'

## 提供替代令牌：类接口与 'InjectionToken'

Angular dependency injection is easiest when the provider token is a class that is also the type of the returned dependency object, or service.

当使用类作为令牌，同时也把它作为返回依赖对象或服务的类型时，Angular 依赖注入使用起来最容易。

However, a token doesn't have to be a class and even when it is a class, it doesn't have to be the same type as the returned object.
That's the subject of the next section.

但令牌不一定都是类，就算它是一个类，它也不一定都返回类型相同的对象。这是下一节的主题。

<a id="class-interface"></a>

### Class interface

### 类-接口

The previous *Hero of the Month* example used the `MinimalLogger` class as the token for a provider of `LoggerService`.

前面的*月度英雄*的例子使用了 `MinimalLogger` 类作为 `LoggerService` 提供者的令牌。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="use-existing"></code-example>

`MinimalLogger` is an abstract class.

该 `MinimalLogger` 是一个抽象类。

<code-example header="dependency-injection-in-action/src/app/minimal-logger.service.ts" path="dependency-injection-in-action/src/app/minimal-logger.service.ts"></code-example>

An abstract class is usually a base class that you can extend.
In this app, however there is no class that inherits from `MinimalLogger`.
The `LoggerService` and the `DateLoggerService` could have inherited from `MinimalLogger`, or they could have implemented it instead, in the manner of an interface.
But they did neither.
`MinimalLogger` is used only as a dependency injection token.

你通常从一个可扩展的抽象类继承。但这个应用中*并没有*类会继承 `MinimalLogger`。`LoggerService` 和 `DateLoggerService`*本可以*从 `MinimalLogger` 中继承。
它们也可以实现 `MinimalLogger`，而不用单独定义接口。
但它们没有。
`MinimalLogger` 在这里仅仅被用作一个 "依赖注入令牌"。

When you use a class this way, it's called a *class interface*.

当你通过这种方式使用类时，它称作*类接口*。

As mentioned in [Configuring dependency providers](guide/dependency-injection-providers),
an interface is not a valid DI token because it is a TypeScript artifact that doesn't exist at run time.
Use this abstract class interface to get the strong typing of an interface,
and also use it as a provider token in the way you would a normal class.

就像[配置依赖提供者](guide/dependency-injection-providers)中提到的那样，接口不是有效的 DI 令牌，因为它是 TypeScript 自己用的，在运行期间不存在。使用这种抽象类接口不但可以获得像接口一样的强类型，而且可以像普通类一样把它用作提供者令牌。

A class interface should define *only* the members that its consumers are allowed to call.
Such a narrowing interface helps decouple the concrete class from its consumers.

类接口应该*只*定义允许它的消费者调用的成员。窄的接口有助于解耦该类的具体实现和它的消费者。

<div class="alert is-helpful">

Using a class as an interface gives you the characteristics of an interface in a real JavaScript object.
To minimize memory cost, however, the class should have *no implementation*.
The `MinimalLogger` transpiles to this unoptimized, pre-minified JavaScript for a constructor function.

用类作为接口可以让你获得真实 JavaScript 对象中的接口的特性。但是，为了最小化内存开销，该类应该是*没有实现*的。对于构造函数，`MinimalLogger` 会转译成未优化过的、预先最小化过的 JavaScript。

<code-example header="dependency-injection-in-action/src/app/minimal-logger.service.ts" path="dependency-injection-in-action/src/app/minimal-logger.service.ts" region="minimal-logger-transpiled"></code-example>

**NOTE**: <br />
It doesn't have any members.
It never grows no matter how many members you add to the class, as long as those members are typed but not implemented.

**注意**：<br />
它没有任何成员。无论你添加到类中的成员有多少，它都不会增长大小，因为这些成员只是类型而没有实现。

Look again at the TypeScript `MinimalLogger` class to confirm that it has no implementation.

你可以再看看 TypeScript 的 `MinimalLogger` 类，确定一下它是没有实现的。

</div>

<a id="injection-token"></a>

### 'InjectionToken' objects

### 'InjectionToken' 对象

Dependency objects can be simple values like dates, numbers, and strings, or shapeless objects like arrays and functions.

依赖对象可以是一个简单的值，比如日期，数字和字符串，或者一个无形的对象，比如数组和函数。

Such objects don't have application interfaces and therefore aren't well represented by a class.
They're better represented by a token that is both unique and symbolic, a JavaScript object that has a friendly name but won't conflict with another token that happens to have the same name.

这样的对象没有应用程序接口，所以不能用一个类来表示。更适合表示它们的是：唯一的和符号性的令牌，一个 JavaScript 对象，拥有一个友好的名字，但不会与其它的同名令牌发生冲突。

`InjectionToken` has these characteristics.
You encountered them twice in the *Hero of the Month* example, in the *title* value provider and in the *runnersUp* factory provider.

`InjectionToken` 具有这些特征。在*Hero of the Month*例子中遇见它们两次，一个是 *title* 的值，一个是 *runnersUp* 工厂提供者。

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="provide-injection-token"></code-example>

You created the `TITLE` token like this:

这样创建 `TITLE` 令牌：

<code-example header="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" path="dependency-injection-in-action/src/app/hero-of-the-month.component.ts" region="injection-token"></code-example>

The type parameter, while optional, conveys the dependency's type to developers and tooling.
The token description is another developer aid.

类型参数，虽然是可选的，但可以向开发者和开发工具传达类型信息。而且这个令牌的描述信息也可以为开发者提供帮助。

<a id="di-inheritance"></a>

## Inject into a derived class

## 注入到派生类

Take care when writing a component that inherits from another component.
If the base component has injected dependencies, you must re-provide and re-inject them in the derived class and then pass them down to the base class through the constructor.

当编写一个继承自另一个组件的组件时，要格外小心。如果基础组件有依赖注入，必须要在派生类中重新提供和重新注入它们，并将它们通过构造函数传给基类。

In this contrived example, `SortedHeroesComponent` inherits from `HeroesBaseComponent` to display a *sorted* list of heroes.

在这个刻意生成的例子里，`SortedHeroesComponent` 继承自 `HeroesBaseComponent`，显示一个*被排序*的英雄列表。

<div class="lightbox">

<img alt="Sorted Heroes" src="generated/images/guide/dependency-injection-in-action/sorted-heroes.png">

</div>

The `HeroesBaseComponent` can stand on its own.
It demands its own instance of `HeroService` to get heroes and displays them in the order they arrive from the database.

`HeroesBaseComponent` 能自己独立运行。它在自己的实例里要求 `HeroService`，用来得到英雄，并将他们按照数据库返回的顺序显示出来。

<code-example header="src/app/sorted-heroes.component.ts (HeroesBaseComponent)" path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="heroes-base"></code-example>

<div class="alert is-helpful">

### Keep constructors simple

### 让构造函数保持简单

Constructors should do little more than initialize variables.
This rule makes the component safe to construct under test without fear that it will do something dramatic like talk to the server.
That's why you call the `HeroService` from within the `ngOnInit` rather than the constructor.

构造函数应该只用来初始化变量。这条规则让组件在测试环境中可以放心地构造组件，以免在构造它们时，无意中做出一些非常戏剧化的动作(比如与服务器进行会话)。这就是为什么你要在 `ngOnInit` 里面调用 `HeroService`，而不是在构造函数中。

</div>

Users want to see the heroes in alphabetical order.
Rather than modify the original component, subclass it and create a `SortedHeroesComponent` that sorts the heroes before presenting them.
The `SortedHeroesComponent` lets the base class fetch the heroes.

用户希望看到英雄按字母顺序排序。与其修改原始的组件，不如派生它，新建 `SortedHeroesComponent`，以便展示英雄之前进行排序。`SortedHeroesComponent` 让基类来获取英雄。

Unfortunately, Angular cannot inject the `HeroService` directly into the base class.
You must provide the `HeroService` again for *this* component, then pass it down to the base class inside the constructor.

可惜，Angular 不能直接在基类里直接注入 `HeroService`。必须在*这个*组件里再次提供 `HeroService`，然后通过构造函数传给基类。

<code-example header="src/app/sorted-heroes.component.ts (SortedHeroesComponent)" path="dependency-injection-in-action/src/app/sorted-heroes.component.ts" region="sorted-heroes"></code-example>

Now take notice of the `afterGetHeroes()` method.
Your first instinct might have been to create an `ngOnInit` method in `SortedHeroesComponent` and do the sorting there.
But Angular calls the *derived* class's `ngOnInit` *before* calling the base class's `ngOnInit` so you'd be sorting the heroes array *before they arrived*.
That produces a nasty error.

现在，请注意 `afterGetHeroes()` 方法。
你的第一反应是在 `SortedHeroesComponent` 组件里面建一个 `ngOnInit` 方法来做排序。但是 Angular 会先调用*派生*类的 `ngOnInit`，后调用基类的 `ngOnInit`，
所以可能在*英雄到达之前*就开始排序。这就产生了一个讨厌的错误。

Overriding the base class's `afterGetHeroes()` method solves the problem.

覆盖基类的 `afterGetHeroes()` 方法可以解决这个问题。

These complications argue for *avoiding component inheritance*.

分析上面的这些复杂性是为了强调*避免使用组件继承*这一点。

<a id="forwardref"></a>

## Break circularities with a forward class reference (*forwardRef*)

## 使用一个前向引用(*forwardRef*)来打破循环

The order of class declaration matters in TypeScript.
You can't refer directly to a class until it's been defined.

在 TypeScript 里面，类声明的顺序是很重要的。如果一个类尚未定义，就不能引用它。

This isn't usually a problem, especially if you adhere to the recommended *one class per file* rule.
But sometimes circular references are unavoidable.
You're in a bind when class 'A' refers to class 'B' and 'B' refers to 'A'.
One of them has to be defined first.

这通常不是一个问题，特别是当你遵循*一个文件一个类*规则的时候。但是有时候循环引用可能不能避免。当一个类*A 引用类 B*，同时'B'引用'A'的时候，你就陷入困境了：它们中间的某一个必须要先定义。

The Angular `forwardRef()` function creates an *indirect* reference that Angular can resolve later.

Angular 的 `forwardRef()` 函数建立一个*间接地*引用，Angular 可以随后解析。

The *Parent Finder* sample is full of circular class references that are impossible to break.

这个关于*父查找器*的例子中全都是没办法打破的循环类引用。

You face this dilemma when a class makes *a reference to itself* as does `AlexComponent` in its `providers` array.
The `providers` array is a property of the `@Component()` decorator function which must appear *above* the class definition.

当一个类*需要引用自身*的时候，你面临同样的困境，就像在 `AlexComponent` 的 `providers` 数组中遇到的困境一样。该 `providers` 数组是一个 `@Component()` 装饰器函数的一个属性，它必须在类定义*之前*出现。

Break the circularity with `forwardRef`.

使用 `forwardRef` 来打破这种循环：

<code-example header="parent-finder.component.ts (AlexComponent providers)" path="dependency-injection-in-action/src/app/parent-finder.component.ts" region="alex-providers"></code-example>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
