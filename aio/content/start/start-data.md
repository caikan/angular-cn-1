# Managing data

# 管理数据

This guide builds on the second step of the [Getting started with a basic Angular application](start) tutorial, [Adding navigation](start/start-routing "Adding navigation").
At this stage of development, the store application has a product catalog with two views: a product list and product details.
Users can click on a product name from the list to see details in a new view, with a distinct URL, or route.

本章基于[以一个基本 Angular 应用快速上手](start)的第二步 —— [添加导航](start/start-routing "Adding navigation")。在此开发阶段，本商店应用具有一个包含两个视图的商品名录：商品列表和商品详情。用户点击清单中的某个商品名称，就会在新视图中看到具有专门的 URL 或路由的详情页。

This step of the tutorial guides you through creating a shopping cart in the following phases:

本页将指导你分三个步骤创建购物车：

* Update the product details view to include a **Buy** button, which adds the current product to a list of products that a cart service manages

  修改商品详情视图，让它包含一个 “Buy” 按钮，它会把当前商品添加到由 "购物车服务" 管理的商品列表中。

* Add a cart component, which displays the items in the cart

  添加一个购物车组件，它会显示购物车中的商品。

* Add a shipping component, which retrieves shipping prices for the items in the cart by using Angular's `HttpClient` to retrieve shipping data from a `.json` file

  添加一个配送组件，它会使用 Angular 的 `HttpClient` 从 `.json` 文件中检索配送数据来取得购物车中这些商品的运费。

<a id="create-cart-service"></a>

## Create the shopping cart service

## 创建购物车服务

In Angular, a service is an instance of a class that you can make available to any part of your application using Angular's [dependency injection system](guide/glossary#dependency-injection-di "Dependency injection definition").

在 Angular 中, 服务是类的一个实例, 借助 Angular 的[依赖注入体系](guide/glossary#dependency-injection-di "Dependency injection definition")，你可以在应用中的任意部分使用它。

Currently, users can view product information, and the application can simulate sharing and  notifications about product changes.

现在, 用户可以浏览产品信息，而应用可以模拟分享产品，以及发出产品变更通知。

The next step is to build a way for users to add products to a cart.
This section walks you through adding a **Buy** button and setting up a cart service to store information about products in the cart.

下一步是为用户提供一种把产品添加到购物车中的方法。本章节将带领你添加一个 **Buy** 按钮并且建立一个购物车服务以保存购物车中的产品信息。

<a id="generate-cart-service"></a>

### Define a cart service

### 定义购物车服务

This section walks you through creating the `CartService` that tracks products added to shopping cart.

本节将引导你创建用于跟踪添加到购物车的产品的 `CartService`。

1. In the terminal generate a new `cart` service by running the following command:

   在终端中通过运行以下命令生成一个新的 `cart` 服务：

   <code-example format="shell" language="shell">

   ng generate service cart

   </code-example>

1. Import the `Product` interface from `./products.ts` into the `cart.service.ts` file, and in the `CartService` class, define an `items` property to store the array of the current products in the cart.

   将 `Product` 接口从 `./products.ts` 导入到 `cart.service.ts` 文件中，在 `CartService` 类中，定义一个 `items` 属性来存储购物车中当前产品的数组。

   <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="props"></code-example>

1. Define methods to add items to the cart, return cart items, and clear the cart items.

   定义把商品添加到购物车、返回购物车商品以及清除购物车商品的方法。

   <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="methods"></code-example>

   * The `addToCart()` method appends a product to an array of `items`

     `addToCart()` 方法会将产品附加到 `items` 数组中。

   * The `getItems()` method collects the items users add to the cart and returns each item with its associated quantity

     `getItems()` 方法会收集用户加到购物车中的商品，并返回每个商品及其数量。

   * The `clearCart()` method returns an empty array of items, which empties the cart

     `clearCart()` 方法返回一个空数组。

<a id="product-details-use-cart-service"></a>

### Use the cart service

### 使用购物车服务

This section walks you through using the `CartService` to add a product to the cart.

本节会教你使用 `CartService` 来把一个商品添加到购物车中。

1. In `product-details.component.ts`, import the cart service.

   在 `product-details.component.ts` 中导入购物车服务。

   <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="cart-service"></code-example>

1. Inject the cart service by adding it to the `constructor()`.

   通过把购物车服务注入到这里的 `constructor()` 中来注入它。

   <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="inject-cart-service"></code-example>

1. Define the `addToCart()` method, which adds the current product to the cart.

   定义 `addToCart()` 方法，该方法会当前商品添加到购物车中。

   <code-example header="src/app/product-details/product-details.component.ts" path="getting-started/src/app/product-details/product-details.component.ts" region="add-to-cart"></code-example>

   The `addToCart()` method does the following:

   `addToCart()` 方法做了如下事情:

   * Takes the current `product` as an argument

     以当前'product'作为参数

   * Uses the `CartService` `addToCart()` method to add the product to the cart

     使用 `CartService` `addToCart()` 方法去添加产品到购物车中

   * Displays a message that you've added a product to the cart

     显示一条你已经添加了一个产品到购物车到消息

1. In `product-details.component.html`, add a button with the label **Buy**, and bind the `click()` event to the `addToCart()` method.
   This code updates the product details template with a **Buy** button that adds the current product to the cart.

   在 `product-details.component.html` 中，添加一个带有 **Buy** 标签的按钮，并且把其 `click()` 事件绑定到 `addToCart()` 方法上。这段代码会为产品详情模板添加一个 **Buy** 按钮，并把当前产品添加到购物车中。

   <code-example header="src/app/product-details/product-details.component.html" path="getting-started/src/app/product-details/product-details.component.html"></code-example>

1. Verify that the new **Buy** button appears as expected by refreshing the application and clicking on a product's name to display its details.

   刷新应用，以验证新的 **Buy** 按钮如预期般出现了，并且单击某个产品的名称，以展示其详情。

   <div class="lightbox">

   <img alt="Display details for selected product with a Buy button" src="generated/images/guide/start/product-details-buy.png">

   </div>

1. Click the **Buy** button to add the product to the stored list of items in the cart and display a confirmation message.

   点击“Buy”按钮来把该商品添加到购物车中存储的商品列表中，并显示一条确认消息。

   <div class="lightbox">

   <img alt="Display details for selected product with a Buy button" src="generated/images/guide/start/buy-alert.png">

   </div>

## Create the cart view

## 创建购物车视图

For customers to see their cart, you can create the cart view in two steps:

为了让顾客看到他们的购物车，你可以用两步创建购物车视图：

1. Create a cart component and configure routing to the new component.

   创建一个购物车组件并配置指向这个新组件的路由。

1. Display the cart items.

   显示购物车商品。

### Set up the cart component

### 设置该组件

 To create the cart view, follow the same steps you did to create the `ProductDetailsComponent` and configure routing for the new component.

要创建购物车视图，可遵循与创建 `ProductDetailsComponent` 相同的步骤，并且为这个新组件配置路由。

1. Generate a new component named `cart` in the terminal by running the following command:

   通过运行以下命令在终端中生成一个名为 `cart` 的新组件：

   <code-example format="shell" language="shell">

   ng generate component cart

   </code-example>

   This command will generate the `cart.component.ts` file and its associated template and styles files.

   此命令将生成 `cart.component.ts` 文件及其关联的模板和样式文件。

   <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.1.ts"></code-example>

   StackBlitz also generates an `ngOnInit()` by default in components.
   You can ignore the `CartComponent` `ngOnInit()` for this tutorial.

   StackBlitz 还在组件中默认生成一个 `ngOnInit()`。对于本教程，你可以忽略 `CartComponent` 的 `ngOnInit()`。

1. Notice that the newly created `CartComponent` is added to the module's `declarations` in `app.module.ts`.

   请注意，新创建的 `CartComponent` 已添加到 `app.module.ts` 中模块的 `declarations` 中。

   <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="declare-cart"></code-example>

1. Still in `app.module.ts`, add a route for the component `CartComponent`, with a `path` of `cart`.

   打开 `app.module.ts`，为组件 `CartComponent` 添加一个路由，其路由为 `cart`。

   <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="cart-route"></code-example>

1. Update the **Checkout** button so that it routes to the `/cart` URL.
   In `top-bar.component.html`, add a `routerLink` directive pointing to `/cart`.

   修改 "Checkout" 按钮，以便让它路由到 `/cart`。在 `top-bar.component.html` 中添加一个指向 `/cart` 的 `routerLink` 指令。

   <code-example header="src/app/top-bar/top-bar.component.html" path="getting-started/src/app/top-bar/top-bar.component.html" region="cart-route"></code-example>

1. Verify the new `CartComponent` works as expected by clicking the **Checkout** button.
   You can see the "cart works!" default text, and the URL has the pattern `https://getting-started.stackblitz.io/cart`, where `getting-started.stackblitz.io` may be different for your StackBlitz project.

   要查看新的购物车组件，请点击“Checkout”按钮。你会看到默认文本“cart works!”，该 URL 的格式为 `https://getting-started.stackblitz.io/cart`，其中的 getting-started.stackblitz.io 部分可能与你的 StackBlitz 项目不同。

   <div class="lightbox">

   <img alt="Display cart view before customizing" src="generated/images/guide/start/cart-works.png">

   </div>

### Display the cart items

### 显示购物车商品

This section shows you how to use the cart service to display the products in the cart.

本节将告诉你如何修改购物车组件以使用购物车服务来显示购物车中的商品。

1. In `cart.component.ts`, import the `CartService` from the `cart.service.ts` file.

   在 `cart.component.ts` 中，从 `cart.service.ts` 文件中导入 `CartService`。

   <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="imports"></code-example>

1. Inject the `CartService` so that the `CartComponent` can use it by adding it to the `constructor()`.

   注入 `CartService`，以便购物车组件可以使用它。

   <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="inject-cart"></code-example>

1. Define the `items` property to store the products in the cart.

   定义 `items` 属性，以便把商品存放在购物车中。

   <code-example header="src/app/cart/cart.component.ts" path="getting-started/src/app/cart/cart.component.2.ts" region="items"></code-example>

   This code sets the items using the `CartService` `getItems()` method.
   You defined this method [when you created `cart.service.ts`](#generate-cart-service).

   这段代码使用 `CartService` 的 `getItems()` 方法来设置条目。你以前在[创建 `cart.service.ts`](#generate-cart-service) 时定义过此方法。

1. Update the cart template with a header, and use a `<div>` with an `*ngFor` to display each of the cart items with its name and price.

   修改模板，加上标题，用带有 `*ngFor` 的 `<div>` 来显示每个购物车商品的名字和价格。

   The resulting `CartComponent` template is as follows.

   生成的 `CartComponent` 模板如下：

   <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html" region="prices"></code-example>

1. Verify that your cart works as expected:

   验证你的购物车如预期般工作：

   1. Click **My Store**.

      点击 **My Store**。

   1. Click on a product name to display its details.

      单击商品名称以显示其详细信息。

   1. Click **Buy** to add the product to the cart.

      点击**Buy** 将商品添加到购物车。

   1. Click **Checkout** to see the cart.

      点击**Checkout**查看购物车。

   <div class="lightbox">

   <img alt="Cart view with products added" src="generated/images/guide/start/cart-page-full.png">

   </div>

For more information about services, see [Introduction to Services and Dependency Injection](guide/architecture-services "Concepts > Intro to Services and DI").

要了解关于服务的更多信息，请参阅[“服务和依赖注入简介”](guide/architecture-services "概念>服务简介和 DI")。

## Retrieve shipping prices

## 检索运费价格

Servers often return data in the form of a stream.
Streams are useful because they make it easy to transform the returned data and make modifications to the way you request that data.
Angular `HttpClient` is a built-in way to fetch data from external APIs and provide them to your application as a stream.

服务器通常采用流的形式返回数据。流是很有用的，因为它们可以很容易地转换返回的数据，也可以修改你请求数据的方式。Angular 的 HTTP 客户端（`HttpClient`）是一种内置的方式，可以从外部 API 中获取数据，并以流的形式提供给你的应用。

This section shows you how to use `HttpClient` to retrieve shipping prices from an external file.

本节会为你展示如何使用 `HttpClient` 从外部文件中检索运费。

The application that StackBlitz generates for this guide comes with predefined shipping data in `assets/shipping.json`.
Use this data to add shipping prices for items in the cart.

在本指南的 StackBlitz 应用中，通过 `assets/shipping.json` 文件提供了一些预定义的配送数据。你可以利用这些数据为购物车中的商品添加运费。

<code-example header="src/assets/shipping.json" path="getting-started/src/assets/shipping.json"></code-example>

### Configure `AppModule` to use `HttpClient`

### 配置 `AppModule` 以使用 `HttpClient`

To use Angular's `HttpClient`, you must configure your application to use `HttpClientModule`.

要使用 Angular 的 HTTP 客户端之前，你必须先配置你的应用来使用 `HttpClientModule`。

Angular's `HttpClientModule` registers the providers your application needs to use the `HttpClient` service throughout your application.

Angular 的 `HttpClientModule` 中注册了在整个应用中使用 `HttpClient` 服务的单个实例所需的服务提供者。

1. In `app.module.ts`, import `HttpClientModule` from the `@angular/common/http` package at the top of the file with the other imports.
   As there are a number of other imports, this code snippet omits them for brevity.
   Be sure to leave the existing imports in place.

   在 `app.module.ts` 的顶部从 `@angular/common/http` 包中导入 `HttpClientModule` 以及其它导入项。由于有很多其它导入项，因此这里的代码片段省略它们，以保持简洁。请确保现有的导入都还在原地。

   <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module-import"></code-example>

1. To register Angular's `HttpClient` providers globally, add `HttpClientModule` to the `AppModule` `@NgModule()` `imports` array.

   把 `HttpClientModule` 添加到 `AppModule` `@NgModule()` 的 `imports` 数组中，以便全局注册 Angular 的 `HttpClient`。

   <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="http-client-module"></code-example>

### Configure `CartService` to use `HttpClient`

### 配置 `CartService` 以使用 `HttpClient`

The next step is to inject the `HttpClient` service into your service so your application can fetch data and interact with external APIs and resources.

下一步是注入 `HttpClient` 服务到你的服务中, 这样你的应用可以获取数据并且与外部 API 和资源互动。

1. In `cart.service.ts`, import `HttpClient` from the `@angular/common/http` package.

   从 `@angular/common/http` 包中导入 `HttpClient`。

   <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="import-http"></code-example>

1. Inject `HttpClient` into the `CartService` `constructor()`.

   把 `HttpClient` 注入到 `CartService` 的构造函数中。

   <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="inject-http"></code-example>

### Configure `CartService` to get shipping prices

### 配置 `CartService` 以得到商品价格

To get shipping data, from `shipping.json`, You can use the `HttpClient` `get()` method.

要从 `shipping.json` 中得到商品数据, 你可以使用 `HttpClient` `get()` 方法。

1. In `cart.service.ts`, below the `clearCart()` method, define a new `getShippingPrices()` method that uses the `HttpClient` `get()` method.

   在 `cart.service.ts` 中 `clearCart()` 方法下面，定义一个新的 `getShippingPrices()` 方法，该方法会调用 `HttpClient#get()` 方法。

   <code-example header="src/app/cart.service.ts" path="getting-started/src/app/cart.service.ts" region="get-shipping"></code-example>

For more information about Angular's `HttpClient`, see the [Client-Server Interaction](guide/http "Server interaction through HTTP") guide.

要了解关于 Angular `HttpClient` 的更多信息，请参阅[客户端-服务器集成](guide/http "HttpClient 指南")指南。

## Create a shipping component

## 创建配送组件

Now that you've configured your application to retrieve shipping data, you can create a place to render that data.

现在你的应用已经可以检索配送数据了，你还要创建一个配送组件和相关的模板。

1. Generate a cart component named `shipping` in the terminal by running the following command:

   在终端窗口中运行如下命令，以生成名为 `shipping` 的组件：

   <code-example format="shell" language="shell">

   ng generate component shipping

   </code-example>

   This command will generate the `shipping.component.ts` file and it associated template and styles files.

   该命令会生成 `shipping.component.ts` 文件及其关联的模板和样式文件。

   <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.1.ts"></code-example>

1. In `app.module.ts`, add a route for shipping.
   Specify a `path` of `shipping` and a component of `ShippingComponent`.

   在 `app.module.ts` 中，添加一个配送路由。其 `path` 为 `shipping`，其 component 为 `ShippingComponent`。

   <code-example header="src/app/app.module.ts" path="getting-started/src/app/app.module.ts" region="shipping-route"></code-example>

   There's no link to the new shipping component yet, but you can see its template in the preview pane by entering the URL its route specifies.
   The URL has the pattern: `https://angular-ynqttp--4200.local.webcontainer.io/shipping` where the `angular-ynqttp--4200.local.webcontainer.io` part may be different for your StackBlitz project.

   新的配送组件尚未链接到任何其它组件，但你可以通过输入其路由指定的 URL 在预览窗格中看到它的模板。该 URL 具有以下模式：`https://angular-ynqttp--4200.local.webcontainer.io/shipping` ，其 `angular-ynqttp--4200.local.webcontainer.io` 部分可能与你的 StackBlitz 项目有所不同。

### Configuring the `ShippingComponent` to use `CartService`

### 配置 `ShippingComponent` 以使用 `CartService`

This section guides you through modifying the `ShippingComponent` to retrieve shipping data via HTTP from the `shipping.json` file.

这个章节将指导你修改 `ShippingComponent` 以通过 HTTP 从 `shipping.json` 文件中提取商品数据。

1. In `shipping.component.ts`, import `CartService`.

   在 `shipping.component.ts` 中导入 `CartService`。

   <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="imports"></code-example>

1. Inject the cart service in the `ShippingComponent` `constructor()`.

   把购物车服务注入到 `ShippingComponent` 的 `constructor()` 构造函数中。

   <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="inject-cart-service"></code-example>

1. Define a `shippingCosts` property that sets the `shippingCosts` property using the `getShippingPrices()` method from the `CartService`.
   Initialize the `shippingCosts` property inside `ngOnInit()` method.

   定义一个 `shippingCosts` 属性，并从 `CartService` 中利用购物车服务的 `getShippingPrices()` 方法设置它。在 `ngOnInit()` 方法内部初始化 `shippingCosts` 属性。

   <code-example header="src/app/shipping/shipping.component.ts" path="getting-started/src/app/shipping/shipping.component.ts" region="props"></code-example>

1. Update the `ShippingComponent` template to display the shipping types and prices using the `async` pipe.

   利用 `async` 管道修改配送组件的模板，以显示配送类型和价格。

   <code-example header="src/app/shipping/shipping.component.html" path="getting-started/src/app/shipping/shipping.component.html"></code-example>

   The `async` pipe returns the latest value from a stream of data and continues to do so for the life of a given component.
   When Angular destroys that component, the `async` pipe automatically stops.
   For detailed information about the `async` pipe, see the [AsyncPipe API documentation](api/common/AsyncPipe).

   `async` 管道从数据流中返回最新值，并在所属组件的生命期内持续返回。当 Angular 销毁该组件时，`async` 管道会自动停止。关于 `async` 管道的详细信息，请参阅 [AsyncPipe API 文档](api/common/AsyncPipe)。

1. Add a link from the `CartComponent` view to the `ShippingComponent` view.

   在购物车视图中添加一个到配送视图的链接。

   <code-example header="src/app/cart/cart.component.html" path="getting-started/src/app/cart/cart.component.2.html"></code-example>

1. Click the **Checkout** button to see the updated cart.
   Remember that changing the application causes the preview to refresh, which empties the cart.

   点击 **Checkout** 按钮，查看更新后的购物车。注意，修改本应用会导致预览窗格刷新，这会清空购物车。

   <div class="lightbox">

   <img alt="Cart with link to shipping prices" src="generated/images/guide/start/cart-empty-with-shipping-prices.png">

   </div>

   Click on the link to navigate to the shipping prices.

   点击此链接可以导航到运费页。

   <div class="lightbox">

   <img alt="Display shipping prices" src="generated/images/guide/start/shipping-prices.png">

   </div>

## What's next

## 下一步呢？

You now have a store application with a product catalog, a shopping cart, and you can look up shipping prices.

现在你有了一个带有商品名录和购物车的商店应用了，而且你还可以查询运费。

To continue exploring Angular:

要继续探索 Angular，你可以：

* Continue to [Forms for User Input](start/start-forms "Forms for User Input") to finish the application by adding the shopping cart view and a checkout form

  继续阅读[表单与用户输入](start/start-forms "Forms for User Input")部分，添加购物车视图和结账视图，以完成本应用。

* Skip ahead to [Deployment](start/start-deployment "Deployment") to move to local development, or deploy your application to Firebase or your own server

  跳到[部署](start/start-deployment "Deployment")部分来转为本地开发，或者把你的应用部署到 Firebase 或你自己的服务器上。

@reviewed 2022-02-28
