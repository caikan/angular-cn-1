# Angular Routing

# Angular 路由

In a single-page app, you change what the user sees by showing or hiding portions of the display that correspond to particular components, rather than going out to the server to get a new page.
As users perform application tasks, they need to move between the different [views](guide/glossary#view "Definition of view") that you have defined.

在单页应用中，你可以通过显示或隐藏与特定组件相对应的部分来更改用户看到的内容，而不用去服务器获取新页面。用户执行应用程序任务时，他们需要在定义好的不同[视图](guide/glossary#view "视图的定义")之间移动。

To handle the navigation from one [view](guide/glossary#view) to the next, you use the Angular **`Router`**.
The **`Router`** enables navigation by interpreting a browser URL as an instruction to change the view.

要处理从一个[视图](guide/glossary#view)到下一个视图的导航，请使用 Angular **`Router`**。**`Router`** 会通过将浏览器 URL 解释为更改视图的操作指令来启用导航。

To explore a sample app featuring the router's primary features, see the <live-example name="router"></live-example>.

要浏览具有主要路由器功能的示例应用，请参阅<live-example name="router"></live-example>。

## Prerequisites

## 前提条件

Before creating a route, you should be familiar with the following:

在创建路由之前，你应该熟悉以下内容：

* [Basics of components](guide/architecture-components)

  [组件基础](guide/architecture-components)

* [Basics of templates](guide/glossary#template)

  [模板基础](guide/glossary#template)

* An Angular app —you can generate a basic Angular application using the [Angular CLI](cli).

  一个 Angular 应用程序 - 你可以使用 [Angular CLI](cli) 生成基本的 Angular 应用程序。

## Learn about Angular routing

## 了解 Angular 路由

<div class="card-container">
  <a href="guide/router" class="docs-card" title="Common routing tasks">
    <section>Common routing tasks</section>
    <section>通用路由任务</section>
    <p>Learn how to implement many of the common tasks associated with Angular routing.</p>
    <p>了解如何实现与 Angular 路由相关的许多常见任务。</p>
    <p class="card-footer">Common routing tasks</p>
    <p class="card-footer">通用路由任务</p>
  </a>
  <a href="guide/router-tutorial" class="docs-card" title="Routing SPA tutorial">
    <section>Single-page applications (SPAs) routing tutorial</section>
    <section>单页应用程序 (SPA) 路由教程</section>
    <p>A tutorial that covers patterns associated with Angular routing.</p>
    <p>一个涵盖与 Angular 路由相关的模式的教程。</p>
    <p class="card-footer">Routing SPA tutorial</p>
    <p class="card-footer">路由 SPA 教程</p>
  </a>
  <a href="guide/router-tutorial-toh" class="docs-card" title="Routing Tour of Heroes">
    <section>Tour of Heroes expanded routing tutorial</section>
    <section>英雄之旅扩展路由教程</section>
    <p>Add more routing features to the Tour of Heroes tutorial.</p>
    <p>为 Tour of Heroes 教程添加更多路由特性。</p>
    <p class="card-footer">Routing Tour of Heroes</p>
    <p class="card-footer">英雄路由之旅</p>
  </a>
  <a href="guide/routing-with-urlmatcher" class="docs-card" title="Creating custom route matches tutorial">
    <section>Creating custom route matches tutorial</section>
    <section>创建自定义路由匹配教程</section>
    <p>A tutorial that covers how to use custom matching strategy patterns with Angular routing.</p>
    <p>一个教程，介绍如何将自定义匹配策略模式与 Angular 路由一起使用。</p>
    <p class="card-footer">Custom route matches tutorial</p>
    <p class="card-footer">自定义路由匹配教程</p>
  </a>
  <a href="guide/router-reference" class="docs-card" title="Router reference">
    <section>Router reference</section>
    <section>路由器参考</section>
    <p>Describes some core router API concepts.</p>
    <p>描述一些核心路由器 API 概念。</p>
    <p class="card-footer">Router reference</p>
    <p class="card-footer">路由器参考</p>
  </a>
</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
