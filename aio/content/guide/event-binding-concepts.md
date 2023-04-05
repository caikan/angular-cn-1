# How event binding works

# 事件绑定的工作原理

In an event binding, Angular configures an event handler for the target event.
You can use event binding with your own custom events.

在事件绑定中，Angular 会为目标事件配置事件处理函数。你还可以将事件绑定用于自定义事件。

When the component or directive raises the event, the handler executes the template statement.
The template statement performs an action in response to the event.

当组件或指令引发事件时，处理程序就会执行模板语句。模板语句会执行一个动作来响应这个事件。

## Handling events

## 处理事件

A common way to handle events is to pass the event object, `$event`, to the method handling the event.
The `$event` object often contains information the method needs, such as a user's name or an image URL.

处理事件的常见方法之一是把事件对象 `$event` 传给处理该事件的方法。`$event` 对象通常包含该方法所需的信息，比如用户名或图片 URL。

The target event determines the shape of the `$event` object.
If the target event is a native DOM element event, then `$event` is a [DOM event object](https://developer.mozilla.org/docs/Web/Events), with properties such as `target` and `target.value`.

目标事件决定了 `$event` 对象的形态。如果目标事件是来自原生 DOM 元素的，那么 `$event` 是一个[DOM 事件对象](https://developer.mozilla.org/docs/Web/Events)，它具有 `target` 和 `target.value` 等属性。

In the following example the code sets the `<input>` `value` property by binding to the `name` property.

在下面的例子中，代码通过绑定到 `name` 来设置 `<input>` 的 `value` 属性。

<code-example header="src/app/app.component.html" path="event-binding/src/app/app.component.html" region="event-binding-3"></code-example>

With this example, the following actions occur:

在这个例子中，会发生下列操作：

1. The code binds to the `input` event of the `<input>` element, which allows the code to listen for changes.

   该代码绑定到 `<input>` 元素的 `input` 事件，该事件允许代码监听这些更改。

1. When the user makes changes, the component raises the `input` event.

   当用户做出更改时，该组件会引发 `input` 事件。

1. The binding executes the statement within a context that includes the DOM event object, `$event`.

   这个绑定会在一个上下文中执行该语句，此上下文中包含 DOM 事件对象 `$event`。

1. Angular retrieves the changed text by calling `getValue($event.target)` and updates the `name` property.

   Angular 会通过调用 `getValue($event.target)` 来获取更改后的文本，并用它更新 `name` 属性。

If the event belongs to a directive or component, `$event` has the shape that the directive or component produces.

如果该事件属于某个指令或组件，那么 `$event` 就具有指令或组件中生成的形态。

<div class="alert is-helpful">

The type of `$event.target` is only `EventTarget` in the template.
In the `getValue()` method, the target is cast to an `HTMLInputElement` to allow type-safe access to its `value` property.

在模板中，`$event.target` 的类型只是 `EventTarget`。在 `getValue()` 方法中，把此目标转为 `HTMLInputElement` 类型，以允许对其 `value` 属性进行类型安全的访问。

<code-example path="event-binding/src/app/app.component.ts" region="getValue"></code-example>

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
