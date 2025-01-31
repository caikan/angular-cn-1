# Animation transitions and triggers

# 动画转场和触发器

This guide goes into depth on special transition states such as the `*` wildcard and `void`. It shows how these special states are used for elements entering and leaving a view.
This section also explores multiple animation triggers, animation callbacks, and sequence-based animation using keyframes.

本章将深入讲解特殊的转场状态，如 `*` 通配符和 `void`，并说明这些特殊状态如何作用于进入或离开视图的元素。本节还探讨了多重触发器、动画回调，以及使用关键帧技术的序列动画。

## Predefined states and wildcard matching

## 预定义状态与通配符匹配

In Angular, transition states can be defined explicitly through the [`state()`](api/animations/state) function, or using the predefined `*` wildcard and `void` states.

在 Angular 中，转场状态可以通过 [`state()`](api/animations/state) 函数进行显式定义，或使用预定义的 `*` 通配符状态和 `void` 状态。

### Wildcard state

### 通配符状态

An asterisk `*` or *wildcard* matches any animation state.
This is useful for defining transitions that apply regardless of the HTML element's start or end state.

星号 `*` 或者叫*通配符*可以匹配任何一个动画状态。它可用来定义那些不用在乎 HTML 元素的起始状态或结束状态的转场动画。

For example, a transition of `open => *` applies when the element's state changes from open to anything else.

比如，一个 `open => *` 转场可应用在当元素的状态从 `open` 变成任何其它状态时。

<div class="lightbox">

<img alt="wildcard state expressions" src="generated/images/guide/animations/wildcard-state-500.png">

</div>

The following is another code sample using the wildcard state together with the previous example using the `open` and `closed` states.
Instead of defining each state-to-state transition pair, any transition to `closed` takes 1 second, and any transition to `open` takes 0.5 seconds.

下面是通配符状态的另一个代码范例，以及我们以前使用 `open` 和 `closed` 状态的实例。但这次，对于每个状态到状态的转换对，我们这次规定从任何状态转场到 `closed` 状态时要花 1 秒钟，而从任何状态转场到 `open` 状态时要花 0.5 秒。

This allows the addition of new states without having to include separate transitions for each one.

这让我们可以添加新状态，而不必把它手动包含到每个单独的转场中。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard1"></code-example>

Use a double arrow syntax to specify state-to-state transitions in both directions.

使用双向箭头语法可以指定任意方向的状态转场。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-wildcard2"></code-example>

### Use wildcard state with multiple transition states

### 使用带多个转场状态的通配符状态

In the two-state button example, the wildcard isn't that useful because there are only two possible states, `open` and `closed`.
In general, use wildcard states when an element has multiple potential states that it can change to.
If the button can change from `open` to either `closed` or something like `inProgress`, using a wildcard state could reduce the amount of coding needed.

在这个双态按钮的例子中，通配符不是很有用，因为只有两种可能的状态：`open` 和 `closed`。一般而言，当一个元素可能变更为多个潜在状态时，通配符状态会更好用。如果我们的按钮可以从 `open` 变成 `closed` 或类似 `inProgress` 的状态，则可以使用通配符状态来减少所需的编码量。

<div class="lightbox">

<img alt="wildcard state with 3 states" src="generated/images/guide/animations/wildcard-3-states.png">

</div>

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="trigger-transition"></code-example>

The `* => *` transition applies when any change between two states takes place.

当在*任意*两个状态之间切换时，`* => *` 转场都会生效。

Transitions are matched in the order in which they are defined.
Thus, you can apply other transitions on top of the `* => *` transition.
For example, define style changes or animations that would apply just to `open => closed`, then use `* => *` as a fallback for state pairings that aren't otherwise called out.

转场会按照其定义的顺序进行匹配。因此，你可以在 `* => *` 转场的前面定义其它转场。比如，定义只针对 `open => closed` 的状态变更或动画，而使用 `* => *` 作为匹配不上其它状态对时的后备。

To do this, list the more specific transitions *before* `* => *`.

要这么做，只要把那些更特殊的转场放在 `* => *` *前面*就行了。

### Use wildcards with styles

### 使用带样式的通配符状态

Use the wildcard `*` with a style to tell the animation to use whatever the current style value is, and animate with that.
Wildcard is a fallback value that's used if the state being animated isn't declared within the trigger.

使用带样式的 `*` 通配符来告诉动画使用当前的状态值，并用它进行动画处理。通配符是一个后备值，如果未在触发器中声明动画状态，就会使用这个值。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="transition4"></code-example>

### Void state

### `void` 状态

Use the `void` state to configure transitions for an element that is entering or leaving a page.
See [Animating entering and leaving a view](#enter-leave-view).

可以使用 `void` 状态来为进入或离开页面的元素配置转场。参阅[进入和离开视图的动画](#enter-leave-view)。

### Combine wildcard and void states

### 组合使用通配符和 `void` 状态

Combine wildcard and void states in a transition to trigger animations that enter and leave the page:

可以在转场中组合使用通配符和 `void` 状态，以触发那些进入和离开页面的动画：

* A transition of `* => void` applies when the element leaves a view, regardless of what state it was in before it left

  当元素离开视图时，就会触发 `* => void` 转场，而不管它离开前处于什么状态

* A transition of `void => *` applies when the element enters a view, regardless of what state it assumes when entering

  当元素进入视图时，就会触发 `void => *` 转场，而不管它进入时处于什么状态

* The wildcard state `*` matches to *any* state, including `void`

  通配符状态 `*` 会匹配*任何*状态 —— 包括 `void`

## Animate entering and leaving a view

## 播放进入和离开视图时的动画

This section shows how to animate elements entering or leaving a page.

本节介绍如何为进入和离开页面的元素设置动画。

Add a new behavior:

添加一些新的行为：

* When you add a hero to the list of heroes, it appears to fly onto the page from the left

  当你把一个英雄添加到英雄列表中时，它看起来是从左侧飞进页面的

* When you remove a hero from the list, it appears to fly out to the right

  当你从列表中移除一个英雄时，它看起来是从右侧飞出去的

<code-example header="src/app/hero-list-enter-leave.component.ts" path="animations/src/app/hero-list-enter-leave.component.ts" region="animationdef"></code-example>

In the preceding code, you applied the `void` state when the HTML element isn't attached to a view.

在上述代码中，当 HTML 元素没有附着在视图中时，我们就会应用 `void` 状态。

<a id="enter-leave-view"></a>

## Aliases :enter and :leave

## :enter 和 :leave 别名

`:enter` and `:leave` are aliases for the `void => *` and `* => void` transitions.
These aliases are used by several animation functions.

`:enter` 和 `:leave` 分别是 `void => *` 和 `* => void` 的别名。这些别名供多个动画函数使用。

<code-example hideCopy language="typescript">

transition ( ':enter', [ &hellip; ] );  // alias for void =&gt; &ast;
transition ( ':leave', [ &hellip; ] );  // alias for * =&gt; void

</code-example>

It's harder to target an element that is entering a view because it isn't in the DOM yet.
Use the aliases `:enter` and `:leave` to target HTML elements that are inserted or removed from a view.

定位进入视图的元素更难，因为它不在 DOM 中。因此，使用别名 `:enter` 和 `:leave` 来定位要从视图中插入或删除的 HTML 元素。

### Use `*ngIf` and `*ngFor` with :enter and :leave

### 和 `:enter` 与 `:leave` 一起使用 `*ngIf` 和 `*ngFor`

The `:enter` transition runs when any `*ngIf` or `*ngFor` views are placed on the page, and `:leave` runs when those views are removed from the page.

当任何 `*ngIf` 或 `*ngFor` 中的视图放进页面中时，会运行 `:enter` 转场；当移除这些视图时，就会运行 `:leave` 转场。

<div class="alert is-important">

**NOTE**: <br />
Entering/leaving behaviors can sometime be confusing.
As a rule of thumb consider that any element being added to the DOM by Angular passes via the `:enter` transition. Only elements being directly removed from the DOM by Angular pass via the `:leave` transition. For example, an element's view is removed from the DOM because its parent is being removed from the DOM.

**注意**：<br />
进入/离开行为有时会令人困惑。作为经验法则，考虑到 Angular 添加到 DOM 的任何元素都会通过 `:enter` 转换传递，但只有通过 Angular 直接从 DOM 删除的元素会通过 `:leave` 转换传递。例如，元素的视图因为其父级正在从 DOM 中删除而被删除时。

</div>

This example has a special trigger for the enter and leave animation called `myInsertRemoveTrigger`.
The HTML template contains the following code.

本例子中有一个名叫 `myInsertRemoveTrigger` 的触发器，来表示进入和离开动画。其 HTML 模板包含下列代码。

<code-example header="src/app/insert-remove.component.html" path="animations/src/app/insert-remove.component.html" region="insert-remove"></code-example>

In the component file, the `:enter` transition sets an initial opacity of 0. It then animates it to change that opacity to 1 as the element is inserted into the view.

在组件文件中，`:enter` 转场会将初始透明度设置为 0，然后设置动画，当该元素已经插入视图中之后，把这个透明度设置为 1。

<code-example header="src/app/insert-remove.component.ts" path="animations/src/app/insert-remove.component.ts" region="enter-leave-trigger"></code-example>

Note that this example doesn't need to use [`state()`](api/animations/state).

请注意，此示例不需要使用[`state()`](api/animations/state)。

## Transition :increment and :decrement

## 转场中的 `:increment` 和 `:decrement`

The `transition()` function takes other selector values, `:increment` and `:decrement`.
Use these to kick off a transition when a numeric value has increased or decreased in value.

`transition()` 函数还能接受额外的选择器值：`:increment` 和 `:decrement`。当数值增加或减小时，使用这些来启动转场。

<div class="alert is-helpful">

**NOTE**: <br />
The following example uses `query()` and `stagger()` methods.
For more information on these methods, see the [complex sequences](guide/complex-animation-sequences#complex-sequence) page.

**注意**：<br />
下面的例子使用 `query()` 和 `stagger()` 方法。欲知详情，参见[复杂序列](guide/complex-animation-sequences#complex-sequence)页。

</div>

<code-example header="src/app/hero-list-page.component.ts" path="animations/src/app/hero-list-page.component.ts" region="increment"></code-example>

## Boolean values in transitions

## 转场中的逻辑值

If a trigger contains a Boolean value as a binding value, then this value can be matched using a `transition()` expression that compares `true` and `false`, or `1` and `0`.

如果某个触发器以逻辑型的值作为绑定值，那么就可以使用能与 `true` 和 `false` 或 `1` 和 `0` 相比较的 `transition()` 表达式来匹配这个值。

<code-example header="src/app/open-close.component.html" path="animations/src/app/open-close.component.2.html" region="trigger-boolean"></code-example>

In the code snippet above, the HTML template binds a `<div>` element to a trigger named `openClose` with a status expression of `isOpen`, and with possible values of `true` and `false`.
This pattern is an alternative to the practice of creating two named states like `open` and `close`.

在上述代码片段中，HTML 模板将 `<div>` 元素绑定到名为 `openClose` 的触发器，其状态表达式是 `isOpen`，可能的值为 `true` 和 `false`。这种模式可以代替创建两个命名状态 `open` 和 `close` 的方式。

Inside the `@Component` metadata under the `animations:` property, when the state evaluates to `true`, the associated HTML element's height is a wildcard style or default.
In this case, the animation uses whatever height the element already had before the animation started.
When the element is `closed`, the element gets animated to a height of 0, which makes it invisible.

`@Component` 元数据下的 `animations:` 属性中，当该状态求值为 `true` 时，相关 HTML 元素的高度值为通配符样式 `*` 或某个默认值。在这种情况下，它会使用此元素开始动画前的现有高度。当该元素是 "closed" 时，它的高度会从指定的高度运动到 0，这会让它不可见。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.2.ts" region="trigger-boolean"></code-example>

## Multiple animation triggers

## 多重动画触发器

You can define more than one animation trigger for a component.
Attach animation triggers to different elements, and the parent-child relationships among the elements affect how and when the animations run.

你可以为组件定义多个动画触发器并将这些动画触发器附着到不同的元素上，这些元素之间的父子关系会影响动画的运行方式和时机。

### Parent-child animations

### 父-子动画

Each time an animation is triggered in Angular, the parent animation always gets priority and child animations are blocked.
For a child animation to run, the parent animation must query each of the elements containing child animations. It then lets the animations run using the [`animateChild()`](api/animations/animateChild) function.

每次在 Angular 中触发动画时，父动画始终会优先，而子动画会被阻塞。为了运行子动画，父动画必须查询出包含子动画的每个元素，然后使用 [`animateChild()`](api/animations/animateChild) 函数来运行它们。

#### Disable an animation on an HTML element

#### 在某个 HTML 元素上禁用动画

A special animation control binding called `@.disabled` can be placed on an HTML element to turn off animations on that element, as well as any nested elements.
When true, the `@.disabled` binding prevents all animations from rendering.

可以把一个名叫 `@.disabled` 的动画控制绑定放在 HTML 元素上，以禁用该元素及其子元素上的动画。当 `@.disabled` 绑定为 `true` 时，就会禁止渲染所有动画。

The following code sample shows how to use this feature.

下面的代码范例展示了如何使用此特性。

<code-tabs>
    <code-pane header="src/app/open-close.component.html" path="animations/src/app/open-close.component.4.html" region="toggle-animation"></code-pane>
    <code-pane header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.4.ts" region="toggle-animation" language="typescript"></code-pane>
</code-tabs>

When the `@.disabled` binding is true, the `@childAnimation` trigger doesn't kick off.

当 `@.disabled` 绑定为 `true` 时，`@childAnimation` 触发器就不会启动。

When an element within an HTML template has animations turned off using the `@.disabled` host binding, animations are turned off on all inner elements as well.
You can't selectively turn off multiple animations on a single element.<!-- vale off -->

当 HTML 模板中的某个元素使用 `@.disabled` 禁止了动画时，也会同时禁止其所有内部元素的动画。你无法有选择的单独禁用单个元素上的多个动画。

A selective child animations can still be run on a disabled parent in one of the following ways:

选择性的子动画仍然可以用如下方式之一在已禁用的父元素上运行：

* A parent animation can use the [`query()`](api/animations/query) function to collect inner elements located in disabled areas of the HTML template.
    Those elements can still animate.

  父动画可以使用 [`query()`](api/animations/query) 函数来收集 HTML 模板中位于禁止动画区域内部的元素。这些元素仍然可以播放动画。

  <!-- vale on -->

* A child animation can be queried by a parent and then later animated with the `animateChild()` function

  子动画可以被父动画查询，并且稍后使用 `animateChild()` 来播放它。

#### Disable all animations

#### 禁用所有动画

To turn off all animations for an Angular application, place the `@.disabled` host binding on the topmost Angular component.

要禁用 Angular 应用中的所有动画，只要把 `@.disabled` 绑定放在顶层的 Angular 组件上即可。

<code-example header="src/app/app.component.ts" path="animations/src/app/app.component.ts" region="toggle-app-animations"></code-example>

<div class="alert is-helpful">

**NOTE**: <br />
Disabling animations application-wide is useful during end-to-end (E2E) testing.

**注意**：<br />
禁用应用级的动画在端到端（E2E）测试中是很有用的。

</div>

## Animation callbacks

## 动画回调

The animation `trigger()` function emits *callbacks* when it starts and when it finishes.
The following example features a component that contains an `openClose` trigger.

当动画启动和终止时，`trigger()` 函数会发出一些*回调*。在下面的例子中，我们有一个包含 `openClose` 触发器的组件。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="events1"></code-example>

In the HTML template, the animation event is passed back via `$event`, as `@triggerName.start` and `@triggerName.done`, where `triggerName` is the name of the trigger being used.
In this example, the trigger `openClose` appears as follows.

在 HTML 模板中，动画事件可以通过 `$event` 传递回来，比如 `@triggerName.start` 和 `@triggerName.done`，这里的 `triggerName` 表示所使用的触发器名字。在我们的例子中，`openClose` 触发器将会是这样的。

<code-example header="src/app/open-close.component.html" path="animations/src/app/open-close.component.3.html" region="callbacks"></code-example>

A potential use for animation callbacks could be to cover for a slow API call, such as a database lookup.
For example, an **InProgress** button can be set up to have its own looping animation while the backend system operation finishes.

动画回调的潜在用途之一，是用来覆盖比较慢的 API 调用，比如查阅数据库。比如，可以建立一个 **InProgress** 按钮，让它拥有自己的循环动画，直到后端系统操作完成。

Another animation can be called when the current animation finishes.
For example, the button goes from the `inProgress` state to the `closed` state when the API call is completed.

在当前动画结束时，可以调用另一个动画。比如，当 API 调用完成时，按钮会从 `inProgress` 状态变成 `closed` 状态。

An animation can influence an end user to *perceive* the operation as faster, even when it is not.

动画可以影响最终用户，让他*觉得*操作更快 —— 虽然并没有。

Callbacks can serve as a debugging tool, for example in conjunction with `console.warn()` to view the application's progress in a browser's Developer JavaScript Console.
The following code snippet creates console log output for the original example, a button with the two states of `open` and `closed`.

回调可以作为调试工具，比如与 `console.warn()` 结合使用，以便在浏览器的开发者控制台中查看应用的进度。下列代码片段为我们原始的双态按钮（`open` 与 `closed`）范例创建了控制台输出。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.ts" region="events"></code-example>

<a id="keyframes"></a>

## Keyframes

## 关键帧动画

To create an animation with multiple steps run in sequence, use *keyframes*.

要创建一个具有多个顺序执行步骤的动画，请使用*关键帧动画*。

Angular's `keyframe()` function allows several style changes within a single timing segment.
For example, the button, instead of fading, could change color several times over a single 2-second time span.

Angular 的 `keyframe()` 函数类似于 CSS 中的关键帧。关键帧允许在单个时间段内进行多种样式更改。比如，我们的按钮可以在单个的 2 秒时间段内多次改变颜色，而不是渐隐掉。

<div class="lightbox">

<img alt="keyframes" src="generated/images/guide/animations/keyframes-500.png">

</div>

The code for this color change might look like this.

这些更改颜色的代码如下所示。

<code-example header="src/app/status-slider.component.ts" path="animations/src/app/status-slider.component.ts" region="keyframes"></code-example>

### Offset

### 偏移

Keyframes include an `offset` that defines the point in the animation where each style change occurs.
Offsets are relative measures from zero to one, marking the beginning and end of the animation. They should be applied to each of the keyframe steps if used at least once.

关键帧包括一个用来定义动画中每个样式何时开始更改的*偏移（offset）*属性。偏移是个 0 到 1 之间的相对值，分别标记动画的开始和结束时间，并且只要使用了它，就要同样应用于这个关键帧的每个步骤。

Defining offsets for keyframes is optional.
If you omit them, evenly spaced offsets are automatically assigned.
For example, three keyframes without predefined offsets receive offsets of 0, 0.5, and 1.
Specifying an offset of 0.8 for the middle transition in the preceding example might look like this.

定义关键帧的偏移量是可选的。如果省略它们，就会自动分配均匀间隔的偏移。比如，三个没有预定义偏移的关键帧会分别使用 0、0.5、1 作为偏移。在上面的例子中，还可以为中间的转场指定偏移量 0.8。代码如下。

<div class="lightbox">

<img alt="keyframes with offset" src="generated/images/guide/animations/keyframes-offset-500.png">

</div>

The code with offsets specified would be as follows.

带有指定偏移量的代码如下。

<code-example header="src/app/status-slider.component.ts" path="animations/src/app/status-slider.component.ts" region="keyframesWithOffsets"></code-example>

You can combine keyframes with `duration`, `delay`, and `easing` within a single animation.

你可以在单个动画中组合使用 `duration`、`delay` 和 `easing` 来定义关键帧。

### Keyframes with a pulsation

### 带脉动效果的关键帧

Use keyframes to create a pulse effect in your animations by defining styles at specific offset throughout the animation.

通过在整个动画中定义特定偏移处的样式，可以使用关键帧在动画中创建脉动效果。

Here's an example of using keyframes to create a pulse effect:

下面是使用关键帧创建脉动效果的例子：

* The original `open` and `closed` states, with the original changes in height, color, and opacity, occurring over a timeframe of 1 second

  原始的 `open` 和 `closed` 状态（包括其原始的高度、颜色和透明度）会在一秒钟内逐渐发生变化。

* A keyframes sequence inserted in the middle that causes the button to appear to pulsate irregularly over the course of that same 1 second timeframe

  插在中间的关键帧序列会导致该按钮在一秒钟内出现不规则的脉动。

<div class="lightbox">

<img alt="keyframes with irregular pulsation" src="generated/images/guide/animations/keyframes-pulsation.png">

</div>

The code snippet for this animation might look like this.

此动画的代码片段是这样的。

<code-example header="src/app/open-close.component.ts" path="animations/src/app/open-close.component.1.ts" region="trigger"></code-example>

### Animatable properties and units

### 可动的属性与单位

Angular animations support builds on top of web animations, so you can animate any property that the browser considers animatable.
This includes positions, sizes, transforms, colors, borders, and more.
The W3C maintains a list of animatable properties on its [CSS Transitions](https://www.w3.org/TR/css-transitions-1) page.

Angular 的动画支持是基于 Web 动画的，所以你可以动浏览器认为可动（animatable）的任意属性。包括位置、大小、变形、颜色、边框等。W3C 在 [CSS 转场](https://www.w3.org/TR/css-transitions-1)页也维护了一个可动属性的列表。

For properties with a numeric value, define a unit by providing the value as a string, in quotes, with the appropriate suffix:

对于带有数值的位置属性，可以把值作为字符串（别忘了带引号）并使用适当的后缀来定义其单位：

* 50 pixels:
  `'50px'`

  50 像素：`'50px'`

* Relative font size:
  `'3em'`

  相对字体大小：`'3em'`

* Percentage:
  `'100%'`

  百分比：`'100%'`

You can also provide the value as a number. In such cases Angular assumes a default unit of pixels, or `px`.
Expressing 50 pixels as `50` is the same as saying `'50px'`.

你还可以用数字形式提供这个值。这种情况下，Angular 假设默认的单位是像素（`px`）。把 50 像素表示为 `50` 和 `'50px'` 是一样的。

<div class="alert is-helpful">

**NOTE**: <br />
The string `"50"` would instead not be considered valid\).

**注意**：<br />
字符串形式的 `"50"` 是无效的。

</div>

### Automatic property calculation with wildcards

### 使用通配符自动计算属性

Sometimes, the value of a dimensional style property isn't known until runtime.
For example, elements often have widths and heights that depend on their content or the screen size.
These properties are often challenging to animate using CSS.

有时你在运行之前并不知道某个样式的属性值。比如，元素的宽度和高度通常取决于其内容和屏幕大小。在使用 CSS 动画时，这些属性通常会具有挑战性（译注：因为 CSS 动画不支持自动确定宽高）。

In these cases, you can use a special wildcard `*` property value under `style()`. The value of that particular style property is computed at runtime and then plugged into the animation.

这些情况下，你可以在 `style()` 中指定通配符 `*` 属性。该属性的值是在运行期间计算的，然后把它插入到动画中。

The following example has a trigger called `shrinkOut`, used when an HTML element leaves the page.
The animation takes whatever height the element has before it leaves, and animates from that height to zero.

下面的例子中有一个名叫 `shrinkOut` 的触发器，它会在 HTML 元素离开页面时使用。该动画会使用它离开之前的任意高度，并从该高度动画到 0。

<code-example header="src/app/hero-list-auto.component.ts" path="animations/src/app/hero-list-auto.component.ts" region="auto-calc"></code-example>

### Keyframes summary

### 关键帧动画总结

The `keyframes()` function in Angular allows you to specify multiple interim styles within a single transition. An optional `offset` can be used to define the point in the animation where each style change should occur.

Angular 中的 `keyframes()` 函数允许你在单个转场中指定多个临时样式，并使用可选的 `offset` 来定义动画中每次样式变化的发生时机。

## More on Angular animations

## 关于 Angular 动画的更多知识

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Introduction to Angular animations](guide/animations)

  [Angular 动画简介](guide/animations)

* [Complex animation sequences](guide/complex-animation-sequences)

  [复杂动画序列](guide/complex-animation-sequences)

* [Reusable animations](guide/reusable-animations)

  [可复用动画](guide/reusable-animations)

* [Route transition animations](guide/route-animations)

  [路由转场动画](guide/route-animations)

@reviewed 2022-10-11