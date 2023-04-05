# Accessibility in Angular

# Angular 中的无障碍功能

The web is used by a wide variety of people, including those who have visual or motor impairments.
A variety of assistive technologies are available that make it much easier for these groups to interact with web-based software applications.
Also, designing an application to be more accessible generally improves the user experience for all users.

Web 会被各种各样的人使用，包括有视觉或运动障碍的人。有多种辅助技术能使这些人更轻松地和基于 Web 的软件应用进行交互。另外，将应用设计得更易于访问通常也能改善所有用户的体验。

For an in-depth introduction to issues and techniques for designing accessible applications, see the [Accessibility](https://developers.google.com/web/fundamentals/accessibility/#what_is_accessibility) section of the Google's [Web Fundamentals](https://developers.google.com/web/fundamentals).

关于如何设计无障碍应用的问题和技术的深入介绍，参阅 Google [网络基础知识](https://developers.google.com/web/fundamentals)的[无障碍功能](https://developers.google.com/web/fundamentals/accessibility/#what_is_accessibility)部分。

This page discusses best practices for designing Angular applications that work well for all users, including those who rely on assistive technologies.

本页讨论了设计 Angular 应用的最佳实践，这些实践对所有用户（包括依赖辅助技术的用户）都适用。

<div class="alert is-helpful">

For the sample application that this page describes, see the <live-example></live-example>.

本页中所讲的范例程序，参阅<live-example></live-example>。

</div>

## Accessibility attributes

## 无障碍属性（Attribute）

Building accessible web experience often involves setting [Accessible Rich Internet Applications \(ARIA\) attributes](https://developers.google.com/web/fundamentals/accessibility/semantics-aria) to provide semantic meaning where it might otherwise be missing.
Use [attribute binding](guide/attribute-binding) template syntax to control the values of accessibility-related attributes.

建立无障碍的 Web 体验通常会涉及设置 [ARIA（Accessible Rich Internet Applications）属性（Attribute）](https://developers.google.com/web/fundamentals/accessibility/semantics-aria) 以提供可能会丢失的语义。使用 [Attribute 绑定](guide/attribute-binding)模板语法来控制与无障碍性相关的属性（Attribute）值。

When binding to ARIA attributes in Angular, you must use the `attr.` prefix. The ARIA specification depends specifically on HTML attributes rather than properties of DOM elements.

在 Angular 中绑定 ARIA 属性（Attribute）时，必须使用 `attr.` 前缀。ARIA 规范针对的是 HTML 属性（Attribute），而不是 DOM 元素的属性（Property）。

<code-example format="html" language="html">

&lt;!-- Use attr. when binding to an ARIA attribute --&gt;
&lt;button [attr.aria-label]="myActionLabel"&gt;&hellip;&lt;/button&gt;

</code-example>

<div class="alert is-helpful">

**NOTE** <br />
This syntax is only necessary for attribute *bindings*.
Static ARIA attributes require no extra syntax.

**注意**<br />
此语法仅对于属性（Attribute）*绑定*是必需的。静态 ARIA 属性（Attribute）不需要额外的语法。

<code-example format="html" language="html">

&lt;!-- Static ARIA attributes require no extra syntax --&gt;
&lt;button aria-label="Save document"&gt;&hellip;&lt;/button&gt;

</code-example>

</div>

<div class="alert is-helpful">

By convention, HTML attributes use lowercase names (`tabindex`), while properties use camelCase names (`tabIndex`).

按照约定，HTML 属性（Attribute）使用小写名称（`tabindex`），而 Property 使用 camelCase 名称（`tabIndex`）。

See the [Binding syntax](guide/binding-syntax#html-attribute-vs-dom-property) guide for more background on the difference between attributes and properties.

关于 Attribute 和 Property 之间差异的更多背景信息，参阅[模板语法](guide/binding-syntax#html-attribute-vs-dom-property)一章。

</div>

## Angular UI components

## Angular UI 组件

The [Angular Material](https://material.angular.io) library, which is maintained by the Angular team, is a suite of reusable UI components that aims to be fully accessible.
The [Component Development Kit (CDK)](https://material.angular.io/cdk/categories) includes the `a11y` package that provides tools to support various areas of accessibility.
For example:

由 Angular 团队维护的 [Angular Material](https://material.angular.cn) 库是旨在提供完全无障碍的一组可复用 UI 组件。[组件开发工具包（CDK）](https://material.angular.cn/cdk/categories)中包括 `a11y` 软件包，该软件包提供了支持无障碍领域的各种工具。比如：

* `LiveAnnouncer` is used to announce messages for screen-reader users using an `aria-live` region.
  See the W3C documentation for more information on [aria-live regions](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-live).

  `LiveAnnouncer` 用于使用 `aria-live` 区域向屏幕阅读器用户朗读消息。关于 [aria-live 领域的](https://www.w3.org/WAI/PF/aria-1.1/states_and_properties#aria-live)更多信息，参阅 W3C 文档。

* The `cdkTrapFocus` directive traps Tab-key focus within an element.
  Use it to create accessible experience for components such as modal dialogs, where focus must be constrained.

  `cdkTrapFocus` 指令能将 Tab 键焦点捕获在元素内。使用它可为必须限制焦点的模态对话框之类的组件创建无障碍体验。

For full details of these and other tools, see the [Angular CDK accessibility overview](https://material.angular.io/cdk/a11y/overview).

关于这些工具和其它工具的完整详细信息，参阅 [Angular CDK 无障碍功能概述](https://material.angular.io/cdk/a11y/overview)。

### Augmenting native elements

### 增强原生元素

Native HTML elements capture several standard interaction patterns that are important to accessibility.
When authoring Angular components, you should re-use these native elements directly when possible, rather than re-implementing well-supported behaviors.

原生 HTML 元素捕获了一些对无障碍性很重要的标准交互模式。在制作 Angular 组件时，应尽可能直接复用这些原生元素，而不是重新实现已获良好支持的行为。

For example, instead of creating a custom element for a new variety of button, create a component that uses an attribute selector with a native `<button>` element.
This most commonly applies to `<button>` and `<a>`, but can be used with many other types of element.

比如，你可以创建一个组件，它使用属性（Attribute）选择器指向原生 `<button>` 元素，而不是为各种新按钮创建自定义元素。通常这适用于 `<button>` 和 `<a>`，但也可以用于许多其它类型的元素。

You can see examples of this pattern in Angular Material:
[`MatButton`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/button/button.ts#L67-L69), [`MatTabNav`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/tabs/tab-nav-bar/tab-nav-bar.ts#L139), and [`MatTable`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/table/table.ts#L22).

你可以在 Angular Material 中看到此模式的范例：[`MatButton`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/button/button.ts#L67-L69)，[`MatTabNav`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/tabs/tab-nav-bar/tab-nav-bar.ts#L139)，[`MatTable`](https://github.com/angular/components/blob/50d3f29b6dc717b512dbd0234ce76f4ab7e9762a/src/material/table/table.ts#L22)。

### Using containers for native elements

### 将容器用于原生元素

Sometimes using the appropriate native element requires a container element.
For example, the native `<input>` element cannot have children, so any custom text entry components need to wrap an `<input>` with extra elements.
By just including `<input>` in your custom component's template, it's impossible for your component's users  to set arbitrary properties and attributes to the `<input>` element.
Instead, create a container component that uses content projection to include the native control in the component's API.

有时要使用的原生元素需要一个容器元素。比如，原生 `<input>` 元素不能有子元素，因此任何自定义的文本输入组件都需要用额外的元素来包装 `<input>`。如果只在自定义组件的模板中包含 `<input>`，该组件的将用户无法为 `input` 元素设置任意 Property 和 Attribute。相反，你应该创建一个使用内容投影的容器组件，以将原生控件包含在组件的 API 中。

You can see [`MatFormField`](https://material.angular.io/components/form-field/overview) as an example of this pattern.

你可以把 [`MatFormField`](https://material.angular.cn/components/form-field/overview) 作为该模式的例子。

## Case study: Building a custom progress bar

## 案例研究：构建自定义进度条

The following example shows how to make a progress bar accessible by using host binding to control accessibility-related attributes.

以下范例显示如何通过使用宿主（host）绑定来控制与无障碍性相关的属性（Attribute），来把进度条无障碍化。

* The component defines an accessibility-enabled element with both the standard HTML attribute `role`, and ARIA attributes.
  The ARIA attribute `aria-valuenow` is bound to the user's input.

  该组件使用标准的 HTML 属性（Attribute）`role` 和 ARIA 属性（Attribute）来定义要启用无障碍支持的元素。ARIA 属性（Attribute）`aria-valuenow` 绑定到用户的输入。

  <code-example header="src/app/progress-bar.component.ts" path="accessibility/src/app/progress-bar.component.ts" region="progressbar-component"></code-example>

* In the template, the `aria-label` attribute ensures that the control is accessible to screen readers.

  在模板中，`aria-label` 属性（Attribute）可以确保屏幕阅读器能访问该控件。

  <code-example header="src/app/app.component.html" path="accessibility/src/app/app.component.html" region="template"></code-example>

## Routing

## 路由

### Focus management after navigation

### 导航后的焦点管理

Tracking and controlling [focus](https://developers.google.com/web/fundamentals/accessibility/focus) in a UI is an important consideration in designing for accessibility.
When using Angular routing, you should decide where page focus goes upon navigation.

在设计无障碍性时，在 UI 中跟踪和控制[焦点](https://developers.google.com/web/fundamentals/accessibility/focus)是很重要的考虑因素。使用 Angular 路由时，你需要确定页面焦点在导航上的位置。

To avoid relying solely on visual cues, you need to make sure your routing code updates focus after page navigation.
Use the `NavigationEnd` event from the `Router` service to know when to update focus.

为了避免仅仅依靠视觉提示，你需要确保路由代码会在页面导航之后更新焦点。使用 `Router` 服务中的 `NavigationEnd` 事件可以知道何时该更新焦点。

The following example shows how to find and focus the main content header in the DOM after navigation.

以下范例显示了导航后如何在 DOM 中查找并把焦点移动到主体内容的头部。

<code-example format="typescript" language="typescript">

router.events.pipe(filter(e =&gt; e instanceof NavigationEnd)).subscribe(() =&gt; {
  const mainHeader = document.querySelector('&num;main-content-header')
  if (mainHeader) {
    mainHeader.focus();
  }
});

</code-example>

In a real application, the element that receives focus depends on your specific application structure and layout.
The focused element should put users in a position to immediately move into the main content that has just been routed into view.
You should avoid situations where focus returns to the `body` element after a route change.

在实际的应用程序中，哪些元素会获得焦点取决于该应用特有的结构和布局。获得焦点的元素应使用户能够立即移动到刚刚进入视野的主要内容。你应该避免当路由变化后焦点重新回到 `body` 元素的情况。

### Active links identification

### 活动链接标识

CSS classes applied to active `RouterLink` elements, such as `RouterLinkActive`, provide a visual cue to identify the active link.
Unfortunately, a visual cue doesn't help blind or visually impaired users.
Applying the `aria-current` attribute to the element can help identify the active link.
For more information, see [Mozilla Developer Network \(MDN\) aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)).

用在活跃 `RouterLink` 元素上的 CSS 类（比如 `RouterLinkActive`）提供了有关哪个链接正处于活跃状态的视觉提醒。不幸的是，此类提醒不适用于盲人或视障用户。将 `aria-current` 属性添加到此元素，可以帮你标出活跃链接。有关更多信息，参阅[MDN aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)。

The `RouterLinkActive` directive provides the `ariaCurrentWhenActive` input which sets the `aria-current` to a specified value when the link becomes active.

`RouterLinkActive` 指令提供了 `ariaCurrentWhenActive` 输入属性，该输入属性会在链接变为活跃状态时将 `aria-current` 设置为指定的值。

The following example shows how to apply the `active-page` class to active links as well as setting their `aria-current` attribute to `"page"` when they are active:

以下示例展示了如何将 `active-page` 类应用于活跃链接，以及如何在它们处于活跃状态时将它们的 `aria-current` 属性设置为 `"page"` ：

```html
    <nav>
      <a routerLink="home"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        Home
      </a>
      <a routerLink="about"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        About
      </a>
      <a routerLink="shop"
         routerLinkActive="active-page"
         ariaCurrentWhenActive="page">
        Shop
      </a>
    </nav>
```

<!-- vale Angular.Angular_Spelling = NO -->

## More information

## 更多信息

* [Accessibility - Google Web Fundamentals](https://developers.google.com/web/fundamentals/accessibility)

  [无障碍功能 - Google 网络基础知识](https://developers.google.com/web/fundamentals/accessibility)

* [ARIA specification and authoring practices](https://www.w3.org/TR/wai-aria)

  [ARIA 规范和写作惯例](https://www.w3.org/TR/wai-aria)

* [Material Design - Accessibility](https://material.io/design/usability/accessibility.html)

  [Material Design - 无障碍功能](https://material.io/design/usability/accessibility.html)

* [Smashing Magazine](https://www.smashingmagazine.com/search/?q=accessibility)

  [Smashing 杂志](https://www.smashingmagazine.com/search/?q=accessibility)

* [Inclusive Components](https://inclusive-components.design)

  [包容性组件](https://inclusive-components.design)

* [Accessibility Resources and Code Examples](https://dequeuniversity.com/resources)

  [无障碍功能的资源和代码范例](https://dequeuniversity.com/resources)

* [W3C - Web Accessibility Initiative](https://www.w3.org/WAI/people-use-web)

  [W3C - 网络无障碍倡议](https://www.w3.org/WAI/people-use-web)

* [Rob Dodson A11ycasts](https://www.youtube.com/watch?v=HtTyRajRuyY)

  [Rob Dodson 的 A11y 播客](https://www.youtube.com/watch?v=HtTyRajRuyY)

* [Angular ESLint](https://github.com/angular-eslint/angular-eslint#functionality) provides linting rules that can help you make sure your code meets accessibility standards.

  [Angular ESLint](https://github.com/angular-eslint/angular-eslint#functionality)提供了整理(linting)规则，可以帮助你确保你的代码符合无障碍性标准。

<!-- vale Angular.Angular_Spelling = YES -->

Books

图书

<!-- vale Angular.Google_Quotes = NO -->

* "A Web for Everyone: Designing Accessible User Experiences," Sarah Horton and Whitney Quesenbery

  “适合所有人的网络：设计无障碍的用户体验”，莎拉·霍顿和惠特尼·奎森伯里

* "Inclusive Design Patterns," Heydon Pickering

  “包容性设计模式”，Heydon Pickering

<!-- vale Angular.Google_Quotes = YES -->

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
