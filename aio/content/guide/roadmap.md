# Angular Roadmap

# Angular 路线图

<p class="roadmap-last-updated">Last updated: 2022-11-05</p>

<p class="roadmap-last-updated">最后更新： 2022-11-05</p>

Angular receives a large number of feature requests, both from inside Google and from the broader open-source community.
At the same time, our list of projects contains plenty of maintenance tasks, code refactorings, and potential performance improvements.
We bring together representatives from developer relations, product management, and engineering to prioritize this list.
As new projects come into the queue, we regularly position them based on relative priority to other projects.
As work gets done, projects move up in the queue.

Angular 从 Google 内部和更广泛的开源社区都收到了大量的特性请求。与此同时，我们的项目列表包含大量维护任务、代码重构、潜在的性能提升等等。我们汇集了来自来自开发者关系部门、产品管理部门和工程部门的代表，以确定此列表的优先顺序。当新项目进入队列时，我们会根据其它项目的相对优先级定期对它们进行排位。当工作完成后，项目就会在队列中向上移动。

The following projects are not associated with a particular Angular version.
We will release them on completion, and they will be part of a specific version based on our release schedule, following semantic versioning.
For example, features are released in the next minor after they are complete, or the next major if they include breaking changes.

下面这些项目并没有关联到特定的 Angular 版本。我们会在完成时发布它们，它们会根据我们的发布计划，并遵循语义化版本规范，变成特定版本的一部分。比如，当完成各种特性后会在下一个次要版本中发布，如果包含重大变更，则会到下一个主版本中发布。

## In progress

## 进行中

### Explore hydration and server-side rendering usability improvements

### 探索水化（hydration）和服务器端渲染可用性的改进

As the first step of this project we will implement non-destructive hydration. This technique will allow us to reuse the server-side rendered DOM and rather than rerendering it only attach event listeners and create data structures required by the Angular runtime. As the next step, we are going to further explore the dynamically evolving space of partial hydration and resumability. Each of the approaches has their trade-offs and we'd like to make an informed decision what's the most optimal long-term solution for Angular.

作为该项目的第一步，我们将实现无损水化。这项技术将允许我们复用服务器端渲染好的 DOM，而不是重新渲染它，仅会附加事件侦听器并创建 Angular 运行时所需的数据结构。下一步，我们将进一步探索部分水化和可恢复的动态演化空间。每种方法都有它们的权衡，我们希望做出明智的决定，什么是 Angular 的最佳长期解决方案。

### Improve runtime performance and make Zone.js optional

### 提高运行时性能并使 Zone.js 可选

As part of this effort we are revisiting Angular's reactivity model to make Zone.js optional and improve runtime performance. By default Angular runs change detection globally, traversing the entire component tree. We're exploring options to run change detection only in affected components. This way, we simplify the framework, improve debugging, and reduce application bundle size. Additionally, this lets us take advantage of built-in async/await syntax, which currently Zone.js does not support.

作为这项工作的一部分，我们正在重新评估 Angular 的响应式模型，以使 Zone.js 可选并提高运行时性能。默认情况下，Angular 会全局运行变更检测，遍历整个组件树。我们正在探索仅在受影响的组件中运行变更检测的选项。通过这种方式，我们简化了框架、改进了调试并减少了应用程序包的大小。此外，这让我们可以利用当前 Zone.js 不支持的内置 async/await 语法。

### Improve documentation and schematics for standalone components

### 改进独立组件的文档和原理图

We are working on developing an `ng new` collection for applications bootstrapped with a standalone component. Additionally, we are filling the documentation gaps of the simplified standalone component APIs.

我们正在努力为使用独立组件引导的应用程序开发一个 `ng new` 集合。此外，我们正在填补简化的独立组件 API 的文档空白。

### Introduce dependency injection debugging APIs

### 介绍依赖注入调试 API

To improve the debugging utilities of Angular and Angular DevTools, we'll work on APIs that provide access the dependency injection runtime. As part of the project we'll expose debugging methods that allow us to explore the injector hierarchy and the dependencies across their associated providers.

为了改进 Angular 和 Angular DevTools 的调试工具，我们将使用提供依赖注入运行时访问的 API。作为项目的一部分，我们将公开调试方法，这些方法允许我们探索注入器层次结构以及跨关联提供者的依赖项。

### Streamline standalone imports with Language Service

### 使用 Language Service 简化独立导入

As part of this initiative we are going to implement automatic import of template dependencies for standalone components. Additionally, to enable smaller application bundles the language service will propose automatic removal of unused imports.

作为该计划的一部分，我们将实现独立组件的模板依赖项的自动导入。此外，为了启用更小的应用程序包，语言服务将建议自动删除未使用的导入。

### Investigate modern bundles

### 调查现代包

To improve development experience by speeding up build times, we plan to explore options to improve JavaScript bundles created by Angular CLI.
As part of the project experiment with [esbuild](https://esbuild.github.io) and other open source solutions, compare them with the state-of-the-art tooling in Angular CLI, and report the findings. In Angular v15 we have experimental esbuild support in `ng build` and `ng build --watch`. We'll continue iterating on the solution until we're confident to release it as stable.

为了通过加快构建时间来改善开发体验，我们计划探索一些选项来改进 Angular CLI 创建的 JavaScript 包。作为使用[esbuild](https://esbuild.github.io)和其他开源解决方案的项目试验的一部分，将它们与 Angular CLI 中的最先进工具进行比较，并报告结果。在 Angular v15 中，我们在 `ng build` 和 `ng build --watch` 中提供了实验性 esbuild 支持。我们将继续迭代解决方案，直到我们有信心将其发布为稳定。

### New CDK primitives

### 新的 CDK 原语

We are working on new CDK primitives to facilitate creating custom components based on the WAI-ARIA design patterns for [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox). Angular v14 introduced stable [menu and dialog primitives](https://material.angular.io/cdk/categories) as part of this project and in v15 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox).

我们正在开发新的 CDK 原语，以促进基于[Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox)的 WAI-ARIA 设计模式创建自定义组件。作为本项目的一部分和 v15 [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox) ，Angular v14 引入了稳定的[菜单和对话框原语](https://material.angular.io/cdk/categories)。

### Angular component accessibility

### Angular 组件无障碍性

We are evaluating components in Angular Material against accessibility standards such as WCAG and working to fix any issues that arise from this process.

我们正在根据 WCAG 等无障碍性标准评估 Angular Material 中的组件，并努力解决此过程中出现的任何问题。

### Documentation refactoring

### 文档重构

Ensure all existing documentation fits into a consistent set of content types. Update excessive use of tutorial-style documentation into independent topics. We want to ensure the content outside the main tutorials is self-sufficient without being tightly coupled to a series of guides. In Q2 2022, we refactored the [template content](https://github.com/angular/angular/pull/45897). The next steps are to introduce better structure for components and dependency injection.

确保所有现有的文档都适合一组一致的内容类型。将过度使用教程风格的文档更新为独立的主题。我们希望确保主教程之外的内容是自给自足的，而不与一系列指南紧密耦合。在 2022 年第二季度，我们重构了[模板内容](https://github.com/angular/angular/pull/45897)。下一步是为组件和依赖注入引入更好的结构。

### Investigate micro frontend architecture for scalable development processes

### 研究可扩展开发流程的微前端架构

For the past couple of quarters we understood and defined the problem space. We are going to follow up with a series of blog posts on best practices when developing applications at scale.

在过去的几个季度中，我们了解并定义了问题空间。我们将继续发布一系列关于大规模开发应用程序时最佳实践的博客文章。

### Update getting started tutorial

### 更新入门教程

We're working on updating the Angular getting started experience with standalone components. As part of this initiative, we'd like to create a new textual and video tutorials.

我们正在努力更新使用独立组件的 Angular 入门体验。作为此计划的一部分，我们想创建一个新的文本和视频教程。

### Improvements in the image directive

### image 指令的改进

We released the Angular [image directive](https://developer.chrome.com/blog/angular-image-directive/) as stable in v15. We introduced a new fill mode feature that enables images to fit within their parent container rather than having explicit dimensions. Currently, this feature is in [developer preview](https://angular.io/guide/releases#developer-preview). Next we'll be working on collecting feedback from developers before we promote fill mode as stable.

我们在 v15 中发布了稳定的 Angular[镜像指令](https://developer.chrome.com/blog/angular-image-directive/)。我们介绍了一个新的填充模式特性，该特性使图像能够适合它们的父容器，而不是具有显式尺寸。目前，此特性处于[开发者预览版](https://angular.io/guide/releases#developer-preview)。接下来，我们将努力在将填充模式提升为稳定之前收集开发人员的反馈。

## Future

## 未来

### Token-based theming APIs

### 基于令牌的主题 API

To provide better customization of our Angular material components and enable Material 3 capabilities, we'll be collaborating with Google's Material Design team on defining token-based theming APIs.

为了更好地自定义我们的 Angular 材质组件并启用 Material 3 特性，我们将与 Google 的 Material Design 团队合作定义基于令牌的主题 API。

### Modernize Angular's unit testing experience

### 使 Angular 的单元测试体验现代化

In v12 we revisited the Angular end-to-end testing experience by replacing Protractor with modern alternatives such as Cypress, Nightwatch, and Webdriver.io. Next we'd like to tackle `ng test` to modernize Angular's unit testing experience.

在 v12 中，我们重新访问了 Angular 端到端测试体验，将 Protractor 替换为现代替代方案，例如 Cypress、Nightwatch 和 Webdriver.io。接下来，我们想解决 `ng test` 以使 Angular 的单元测试体验现代化。

### Revamp performance dashboards to detect regressions

### 改进性能仪表板以支持回归检测

We have a set of benchmarks that we run against every code change to ensure Angular aligns with our performance standards.
To ensure the runtime of the framework does not regress after a code change, we need to refine some of the existing infrastructure the dashboards step on.

我们有一套针对每一次代码更改都要运行的基准测试，以确保 Angular 符合我们的性能标准。为确保框架的运行时在代码更改后不会退化，我们需要改进仪表板所使用的一些现有基础设施。

### Improved build performance with ngc as a tsc plugin distribution

### 将 ngc 作为 tsc 的插件，以提高构建性能

Distributing the Angular compiler as a plugin of the TypeScript compiler will substantially improve build performance for developers and reduce maintenance costs.

将 Angular 编译器作为 TypeScript 编译器的插件分发将大大提高开发人员的构建性能并降低维护成本。

### Ergonomic component level code-splitting APIs

### 更符合工效学的组件级代码分割 API

A common problem with web applications is their slow initial load time.
A way to improve it is to apply more granular code-splitting on a component level.
To encourage this practice, we will be working on more ergonomic code-splitting APIs.

Web 应用程序的一个常见问题是它们的初始加载时间很慢。改进它的一种方法是在组件级别应用更精细的代码拆分。为了鼓励这种实践，我们将致力于开发更符合人体工程学的代码拆分 API。

### Ensure smooth adoption for future RxJS changes (version 8 and beyond)

### 确保未来 RxJS 更改（版本 8 及更高版本）的顺利采用

We want to ensure Angular developers are taking advantage of the latest capabilities of RxJS and have a smooth transition to the next major releases of the framework.
For this purpose, we will explore and document the scope of the changes in v7 and beyond RxJS, and plan an update strategy.

我们希望确保 Angular 开发人员正在利用 RxJS 的最新特性，并平滑过渡到框架的下一个主要版本。为此，我们将探索并记录 v7 及更高版本的 RxJS 中更改的范围，并计划更新策略。

### Support two-dimensional drag-and-drop

### 支持二维拖放

As part of this project we'd like to implement mixed orientation support for the Angular CDK drag and drop. This is one of the most highly [requested features](https://github.com/angular/components/issues/13372) in the repository.

作为本项目的一部分，我们想实现对 Angular CDK 拖放的混合方向支持。这是存储库中[要求最高的特性](https://github.com/angular/components/issues/13372)之一。

<details class="completed-details" open="true">
  <summary>
    <h2>Completed</h2>
    <span class="actions">
      <span class="action-expand">Show all</span>
      <span class="action-collapse">Hide all</span>
      <i class="material-icons expand">expand_more</i>
    </span>
  </summary>
  <div class="details-content">

### Improve image performance

*Completed Q4 2022*

The [Aurora](https://web.dev/introducing-aurora/) and the Angular teams are working on the implementation of an image directive that aims to improve [Core Web Vitals](https://web.dev/vitals). We shipped a stable version of the image directive in v15.

### Modern CSS

*Completed Q4 2022*

The Web ecosystem evolves constantly and we want to reflect the latest modern standards in Angular. In this project we aim to provide guidelines on using modern CSS features in Angular to ensure developers follow best practices for layout, styling, etc. We shared official guidelines for layout and as part of the initiative stopped publishing flex layout. Learn [more on our blog](https://blog.angular.io/modern-css-in-angular-layouts-4a259dca9127).

### Support adding directives to host elements

*Completed Q4 2022*

A [long-standing feature request](https://github.com/angular/angular/issues/8785) is to add the ability to add directives to host elements. The feature lets developers augment their own components with additional behaviors without using inheritance. In v15 we shipped our directive composition API, which enables enhancing host elements with directives.

### Better stack traces

*Completed Q4 2022*

The Angular and the Chrome DevTools are working together to enable more readable stack traces for error messages. In v15 we [released improved](https://twitter.com/angular/status/1578807563017392128) relevant and linked stack traces. As a lower priority initiative, we'll be exploring how to make the stack traces friendlier by providing more accurate call frame names for templates.

### Enhanced Angular Material components by integrating MDC Web

*Completed Q4 2022*

[MDC Web](https://material.io/develop/web) is a library created by the Google Material Design team that provides reusable primitives for building Material Design components.
The Angular team is incorporating these primitives into Angular Material.
Using MDC Web aligns Angular Material more closely with the Material Design specification, expand accessibility, improve component quality, and improve the velocity of our team.

### Implement APIs for optional NgModules

*Completed Q4 2022*

In the process of making Angular simpler, we are working on [introducing APIs](https://angular.io/guide/standalone-components) that allow developers to initialize applications, instantiate components, and use the router without NgModules. Angular v14 introduces developer preview of the APIs for standalone components, directives, and pipes. In the next few quarters we'll collect feedback from developers and finalize the project making the APIs stable. As the next step we will work on improving use cases such as `TestBed`, Angular elements, etc.

### Allow binding to protected fields in templates

*Completed Q2 2022*

To improve the encapsulation of Angular components we enabled binding to protected members of the component instance. This way you'll no longer have to expose a field or a method as public to use it inside your templates.

### Publish guides on advanced concepts

*Completed Q2 2022*

Develop and publish an in-depth guide on change detection.
Develop content for performance profiling of Angular applications.
Cover how change detection interacts with Zone.js and explain when it gets triggered, how to profile its duration, as well as common practices for performance optimization.

### Rollout strict typings for `@angular/forms`

*Completed Q2 2022*

In Q4 2021 we designed a solution for introducing strict typings for forms and in Q1 2022 we concluded the corresponding [request for comments](https://github.com/angular/angular/discussions/44513).
Currently, we are implementing a rollout strategy with an automated migration step that will enable the improvements for existing projects.
We are first testing the solution with more than 2,500 projects at Google to ensure a smooth migration path for the external community.

### Remove legacy [View Engine](guide/glossary#ve)

*Completed Q1 2022*

After the transition of all our internal tooling to Ivy is completed, we will remove the legacy View Engine for reduced Angular conceptual overhead, smaller package size, lower maintenance cost, and lower codebase complexity.

### Simplified Angular mental model with optional NgModules

*Completed Q1 2022*

To simplify the Angular mental model and learning journey, we will be working on making NgModules optional.
This work lets developers develop standalone components and implement an alternative API for declaring the compilation scope of the component.
We kicked this project off with high-level design discussions that we captured in an [RFC](https://github.com/angular/angular/discussions/43784).

### Design strict typing for `@angular/forms`

*Completed Q1 2022*

We will work on finding a way to implement stricter type checking for reactive forms with minimal backward incompatible implications.
This way, we let developers catch more issues during development time, enable better text editor and IDE support, and improve the type checking for reactive forms.

### Improve integration of Angular DevTools with framework

*Completed Q1 2022*

To improve the integration of Angular DevTools with the framework, we are working on moving the codebase to the [angular/angular](https://github.com/angular/angular) monorepository.
This includes transitioning Angular DevTools to Bazel and integrating it into the existing processes and CI pipeline.

### Launch advanced compiler diagnostics

*Completed Q1 2022*

Extend the diagnostics of the Angular compiler outside type checking.
Introduce other correctness and conformance checks to further guarantee correctness and best practices.

### Update our e2e testing strategy

*Completed Q3 2021*

To ensure we provide a future-proof e2e testing strategy, we want to evaluate the state of Protractor, community innovations, e2e best practices, and explore novel opportunities.
As first steps of the effort, we shared an [RFC](https://github.com/angular/protractor/issues/5502) and worked with partners to ensure smooth integration between the Angular CLI and state-of-the-art tooling for e2e testing.
As the next step, we need to finalize the recommendations and compile a list of resources for the transition.

### Angular libraries use Ivy

*Completed Q3 2021*

Earlier in 2020, we shared an [RFC](https://github.com/angular/angular/issues/38366) for Ivy library distribution.
After invaluable feedback from the community, we developed a design of the project.
We are now investing in the development of Ivy library distribution, including an update of the library package format to use Ivy compilation, unblock the deprecation of the View Engine library format, and ngcc.

### Improve test times and debugging with automatic test environment tear down

*Completed Q3 2021*

To improve test time and create better isolation across tests, we want to change [`TestBed`](api/core/testing/TestBed) to automatically clean up and tear down the test environment after each test run.

### Deprecate and remove IE11 support

*Completed Q3 2021*

Internet Explorer 11 \(IE11\) has been preventing Angular from taking advantage of some of the modern features of the Web platform.
As part of this project we are going to deprecate and remove IE11 support to open the path for modern features that evergreen browsers provide.
We ran an [RFC](https://github.com/angular/angular/issues/41840) to collect feedback from the community and decide on next steps to move forward.

### Leverage ES2017+ as the default output language

*Completed Q3 2021*

Supporting modern browsers lets us take advantage of the more compact, expressive, and performant new syntax of JavaScript.
As part of this project we will investigate what the blockers are to moving forward with this effort, and take the steps to enable it.

### Accelerated debugging and performance profiling with Angular DevTools

*Completed Q2 2021*

We are working on development tooling for Angular that provides utilities for debugging and performance profiling.
This project aims to help developers understand the component structure and the change detection in an Angular application.

### Streamline releases with consolidated Angular versioning & branching

*Completed Q2 2021*

We want to consolidate release management tooling between the multiple GitHub repositories for Angular \([angular/angular](https://github.com/angular/angular), [angular/angular-cli](https://github.com/angular/angular-cli), and [angular/components](https://github.com/angular/components)\).
This effort lets us reuse infrastructure, unify and simplify processes, and improve the reliability of our release process.

### Higher developer consistency with commit message standardization

*Completed Q2 2021*

We want to unify commit message requirements and conformance across Angular repositories \([angular/angular](https://github.com/angular/angular), [angular/components](https://github.com/angular/components), and [angular/angular-cli](https://github.com/angular/angular-cli)\) to bring consistency to our development process and reuse infrastructure tooling.

### Transition the Angular language service to Ivy

*Completed Q2 2021*

The goal of this project is to improve the experience and remove legacy dependency by transitioning the language service to Ivy.
Today the language service still uses the View Engine compiler and type checking, even for Ivy applications.
We want to use the Ivy template parser and improved type checking for the Angular Language service to match application behavior.
This migration is also a step towards unblocking the removal of View Engine, which will simplify Angular, reduce the npm package size, and improve the maintainability of the framework.

### Increased security with native Trusted Types in Angular

*Completed Q2 2021*

In collaboration with the Google security team, we are adding support for the new [Trusted Types](https://web.dev/trusted-types) API.
This web platform API helps developers build more secure web applications.

### Optimized build speed and bundle sizes with Angular CLI webpack 5

*Completed Q2 2021*

As part of the v11 release, we introduced an opt-in preview of webpack 5 in the Angular CLI.
To ensure stability, we will continue iterating on the implementation to enable build speed and bundle size improvements.

### Faster apps by inlining critical styles in Universal applications

*Completed Q1 2021*

Loading external stylesheets is a blocking operation, which means that the browser cannot start rendering your application until it loads all the referenced CSS.
Having render-blocking resources in the header of a page can significantly impact its load performance, for example, its [first contentful paint](https://web.dev/first-contentful-paint).
To make apps faster, we have been collaborating with the Google Chrome team on inlining critical CSS and loading the rest of the styles asynchronously.

### Improve debugging with better Angular error messages

*Completed Q1 2021*

Error messages often bring limited actionable information to help developers resolve them.
We have been working on making error messages more discoverable by adding associated codes, developing guides, and other materials to ensure a smoother debugging experience.

### Improved developer onboarding with refreshed introductory documentation

*Completed Q1 2021*

We will redefine the user learning journeys and refresh the introductory documentation.
We will clearly state the benefits of Angular, how to explore its capabilities and provide guidance so developers can become proficient with the framework in as little time as possible.

### Expand component harnesses best practices

*Completed Q1 2021*

Angular CDK introduced the concept of [component test harnesses](https://material.angular.io/cdk/test-harnesses) to Angular in version 9.
Test harnesses let component authors create supported APIs for testing component interactions.
We are continuing to improve this harness infrastructure and clarifying the best practices around using harnesses.
We are also working to drive more harness adoption inside of Google.

### Author a guide for content projection

*Completed Q2 2021*

Content projection is a core Angular concept that does not have the presence it deserves in the documentation.
As part of this project we want to identify the core use cases and concepts for content projection and document them.

### Migrate to ESLint

*Completed Q4 2020*

With the deprecation of TSLint we will be moving to ESLint.
As part of the process, we will work on ensuring backward compatibility with our current recommended TSLint configuration, implement a migration strategy for existing Angular applications and introduce new tooling to the Angular CLI toolchain.

### Operation Bye Bye Backlog (also known as Operation Byelog)

*Completed Q4 2020*

We are actively investing up to 50% of our engineering capacity on triaging issues and PRs until we have a clear understanding of broader community needs.
After that, we will commit up to 20% of our engineering capacity to keep up with new submissions promptly.

  </div>
</details>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
