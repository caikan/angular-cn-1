# The hero editor

# 英雄编辑器

The application now has a basic title.
Next, create a new component to display hero information and place that component in the application shell.

应用程序现在有了基本的标题。接下来你要创建一个新的组件来显示英雄信息并且把这个组件放到应用程序的外壳里去。

<div class="alert is-helpful">

For the sample application that this page describes, see the <live-example></live-example>.

要查看本页所讲的范例程序，参阅<live-example></live-example>。

</div>

## Create the heroes component

## 创建英雄列表组件

Use `ng generate` to create a new component named `heroes`.

使用 `ng generate` 创建一个名为 `heroes` 的新组件。

<code-example format="shell" language="shell">

ng generate component heroes

</code-example>

`ng generate` creates a new directory , `src/app/heroes/`, and generates the three files of the  `HeroesComponent` along with a test file.

`ng generate` 创建了一个新的文件夹 `src/app/heroes/`，并生成了 `HeroesComponent` 的四个文件。

The `HeroesComponent` class file is as follows:

`HeroesComponent` 的类文件如下：

<code-example header="app/heroes/heroes.component.ts (initial version)" path="toh-pt1/src/app/heroes/heroes.component.ts" region="v1"></code-example>

You always import the `Component` symbol from the Angular core library and annotate the component class with `@Component`.

你要从 Angular 核心库中导入 `Component` 符号，并为组件类加上 `@Component` 装饰器。

`@Component` is a decorator function that specifies the Angular metadata for the component.

`@Component` 是个装饰器函数，用于为该组件指定 Angular 所需的元数据。

`ng generate` created three metadata properties:

`ng generate` 创建了三个元数据属性：

| Properties | Details |
| :--------- | :------ |
| 属性 | 详情 |
| `selector` | The component's CSS element selector. |
| `selector` | 组件的 CSS 元素选择器 |
| `templateUrl` | The location of the component's template file. |
| `templateUrl` | 组件模板文件的位置。 |
| `styleUrls` | The location of the component's private CSS styles. |
| `styleUrls` | 组件私有 CSS 样式表文件的位置。 |

<a id="selector"></a>

The [CSS element selector](https://developer.mozilla.org/docs/Web/CSS/Type_selectors), `'app-heroes'`, matches the name of the HTML element that identifies this component within a parent component's template.

[CSS 元素选择器](https://developer.mozilla.org/docs/Web/CSS/Type_selectors) `app-heroes` 用来在父组件的模板中匹配 HTML 元素的名称，以识别出该组件。

Always `export` the component class so you can `import` it elsewhere &hellip; like in the `AppModule`.

始终要 `export` 这个组件类，以便在其它地方（比如 `AppModule`）导入它。

### Add a `hero` property

### 添加 `hero` 属性

Add a `hero` property to the `HeroesComponent` for a hero named, `Windstorm`.

往 `HeroesComponent` 中添加一个 `hero` 属性，用来表示一个名叫 “Windstorm” 的英雄。

<code-example header="heroes.component.ts (hero property)" path="toh-pt1/src/app/heroes/heroes.component.ts" region="add-hero"></code-example>

### Show the hero

### 显示英雄

Open the `heroes.component.html` template file.
Delete the default text that `ng generate` created and replace it with a data binding to the new `hero` property.

打开模板文件 `heroes.component.html`。删除 `ng generate` 自动生成的默认内容，改为到 `hero` 属性的数据绑定。

<code-example header="heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="show-hero-1"></code-example>

## Show the `HeroesComponent` view

## 显示 `HeroesComponent` 视图

To display the `HeroesComponent`, you must add it to the template of the shell `AppComponent`.

要显示 `HeroesComponent` 你必须把它加到壳组件 `AppComponent` 的模板中。

Remember that `app-heroes` is the [element selector](#selector) for the `HeroesComponent`.
Add an `<app-heroes>` element to the `AppComponent` template file, just below the title.

别忘了，`app-heroes` 就是 `HeroesComponent` 的 [元素选择器](#selector)。
把 `<app-heroes>` 元素添加到 `AppComponent` 的模板文件中，就放在标题下方。

<code-example header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html"></code-example>

If  `ng serve` is still running,
the browser should refresh and display both the application title and the hero's name.

如果 `ng serve` 命令仍在运行，浏览器就会自动刷新，并且同时显示出应用的标题和英雄的名字。

## Create a `Hero` interface

## 创建 `Hero` 类

A real hero is more than a name.

真实的英雄当然不止一个名字。

Create a `Hero` interface in its own file in the `src/app` directory .
Give it `id` and `name` properties.

在 `src/app` 文件夹中为 `Hero` 类创建一个文件，并添加 `id` 和 `name` 属性。

<code-example path="toh-pt1/src/app/hero.ts"  header="src/app/hero.ts"></code-example>

Return to the `HeroesComponent` class and import the `Hero` interface.

回到 `HeroesComponent` 类，并且导入这个 `Hero` 类。

Refactor the component's `hero` property to be of type `Hero`.
Initialize it with an `id` of `1` and the name `Windstorm`.

把组件的 `hero` 属性的类型重构为 `Hero`。然后以 `1` 为 `id`、以 “Windstorm” 为名字初始化它。

The revised `HeroesComponent` class file should look like this:

修改后的 `HeroesComponent` 类应该是这样的：

<code-example header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts"></code-example>

The page no longer displays properly because you changed the hero from a string to an object.

页面显示变得不正常了，因为你刚刚把 `hero` 从字符串改成了对象。

## Show the hero object

## 显示 `hero` 对象

Update the binding in the template to announce the hero's name and show both `id` and `name` in a details display like this:

修改模板中的绑定，以显示英雄的名字，并在详情中显示 `id` 和 `name`，就像这样：

<code-example header="heroes.component.html (HeroesComponent template)" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="show-hero-2"></code-example>

The browser refreshes and displays the hero's information.

浏览器自动刷新，并显示这位英雄的信息。

## Format with the `UppercasePipe`

## 使用 `UppercasePipe` 进行格式化

Edit the `hero.name` binding like this:

把 `hero.name` 的绑定改成这样。

<code-example header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html" region="pipe"></code-example>

The browser refreshes and now the hero's name is displayed in capital letters.

浏览器刷新了。现在，英雄的名字显示成了大写字母。

The word `uppercase` in the interpolation binding after the pipe <code>\|</code> character, activates the built-in `UppercasePipe`.

绑定表达式中的 `uppercase` 位于管道操作符 `|` 后面，用来调用内置管道 `UppercasePipe`。

[Pipes](guide/pipes) are a good way to format strings, currency amounts, dates, and other display data.
Angular ships with several built-in pipes and you can create your own.

[管道](guide/pipes) 是格式化字符串、金额、日期和其它显示数据的好办法。Angular 发布了一些内置管道，而且你还可以创建自己的管道。

## Edit the hero

## 编辑英雄名字

Users should be able to edit the hero's name in an `<input>` text box.

用户应该能在一个 `<input>` 输入框中编辑英雄的名字。

The text box should both *display* the hero's `name` property and *update* that property as the user types.
That means data flows from the component class *out to the screen* and from the screen *back to the class*.

当用户输入时，这个输入框应该能同时*显示*和*修改*英雄的 `name` 属性。也就是说，数据流从组件类**流出到屏幕**，并且从屏幕**流回到组件类**。

To automate that data flow, set up a two-way data binding between the `<input>` form element and the `hero.name` property.

要想让这种数据流动自动化，就要在表单元素 `<input>` 和组件的 `hero.name` 属性之间建立双向数据绑定。

### Two-way binding

### 双向绑定

Refactor the details area in the `HeroesComponent` template so it looks like this:

把模板中的英雄详情区重构成这样：

<code-example header="src/app/heroes/heroes.component.html (HeroesComponent's template)" path="toh-pt1/src/app/heroes/heroes.component.1.html" region="name-input"></code-example>

`[(ngModel)]` is Angular's two-way data binding syntax.

`[(ngModel)]` 是 Angular 的双向数据绑定语法。

Here it binds the `hero.name` property to the HTML text box so that data can flow *in both directions*.
Data can flow from the `hero.name` property to the text box and from the text box back to the `hero.name`.

这里把 `hero.name` 属性绑定到了 HTML 的 textbox 元素上，以便数据流可以**双向流动**。数据可以从 `hero.name` 属性流动到 textbox，也可以从 textbox 流回到 `hero.name`。

### The missing `FormsModule`

### 缺少 `FormsModule`

Notice that the application stopped working when you added `[(ngModel)]`.

注意，当你加上 `[(ngModel)]` 之后这个应用无法工作了。

To see the error, open the browser development tools and look in the console
for a message like

打开浏览器的开发工具，就会在控制台中看到如下信息：

<code-example format="output" hideCopy language="shell">

Template parse errors:
Can't bind to 'ngModel' since it isn't a known property of 'input'.

</code-example>

Although `ngModel` is a valid Angular directive, it isn't available by default.

虽然 `ngModel` 是一个有效的 Angular 指令，不过它在默认情况下是不可用的。

It belongs to the optional `FormsModule` and you must *opt in* to using it.

它属于一个可选模块 `FormsModule`，你必须自行添加此模块才能使用该指令。

## `AppModule`

Angular needs to know how the pieces of your application fit together and what other files and libraries the application requires.
This information is called *metadata*.

Angular 需要知道如何把应用程序的各个部分组合到一起，以及该应用需要哪些其它文件和库。这些信息被称为*元数据（metadata）*。

Some of the metadata is in the `@Component` decorators that you added to your component classes.
Other critical metadata is in [`@NgModule`](guide/ngmodules) decorators.

有些元数据位于 `@Component` 装饰器中，你会把它加到组件类上。另一些关键性的元数据位于 [`@NgModule`](guide/ngmodules) 装饰器中。

The most important `@NgModule` decorator annotates the top-level **AppModule** class.

最重要的 `@NgModule` 装饰器位于顶层类 **AppModule** 上。

`ng new` created an `AppModule` class in `src/app/app.module.ts` when it created the project.
This is where you *opt in* to the `FormsModule`.

`ng new` 在创建项目的时候就在 `src/app/app.module.ts` 中创建了一个 `AppModule` 类。这里也就是你要添加 `FormsModule` 的地方。

### Import `FormsModule`

### 导入 `FormsModule`

Open `app.module.ts` and import the `FormsModule` symbol from the `@angular/forms` library.

打开 `app.module.ts` 并从 `@angular/forms` 库中导入 `FormsModule` 符号。

<code-example path="toh-pt1/src/app/app.module.ts" header="app.module.ts (FormsModule symbol import)"
 region="formsmodule-js-import"></code-example>

Add `FormsModule` to the  `imports` array in `@NgModule`.
The `imports` array contains the list of external modules that the application needs.

然后把 `FormsModule` 添加到 `@NgModule` 的 `imports` 数组中，这里是该应用所需外部模块的列表。

<code-example header="app.module.ts (@NgModule imports)" path="toh-pt1/src/app/app.module.ts" region="ng-imports"></code-example>

When the browser refreshes, the application should work again.
You can edit the hero's name and see the changes reflected immediately in the `<h2>` above the text box.

刷新浏览器，应用又能正常工作了。你可以编辑英雄的名字，并且会看到这个改动立刻体现在这个输入框上方的 `<h2>` 中。

### Declare `HeroesComponent`

### 声明 `HeroesComponent`

Every component must be declared in *exactly one* [NgModule](guide/ngmodules).

每个组件都必须声明在（*且只能声明在*）一个 [NgModule](guide/ngmodules) 中。

*You* didn't declare the `HeroesComponent`.
Why did the application work?

*你*没有声明过 `HeroesComponent`，可为什么本应用却正常呢？

It worked because the `ng generate` declared `HeroesComponent` in `AppModule` when it created that component.

这是因为 Angular CLI 在生成 `HeroesComponent` 组件的时候就自动把它加到了 `AppModule` 中。

Open `src/app/app.module.ts` and find `HeroesComponent` imported near the top.

打开 `src/app/app.module.ts` 你就会发现 `HeroesComponent` 已经在顶部导入过了。

<code-example path="toh-pt1/src/app/app.module.ts" header="src/app/app.module.ts" region="heroes-import" ></code-example>

The `HeroesComponent` is declared in the `@NgModule.declarations` array.

`HeroesComponent` 也已经声明在了 `@NgModule.declarations` 数组中。

<code-example header="src/app/app.module.ts" path="toh-pt1/src/app/app.module.ts" region="declarations"></code-example>

<div class="alert is-helpful">

`AppModule`  declares both application components, `AppComponent` and `HeroesComponent`.

`AppModule` 声明了应用中的所有组件，`AppComponent` 和 `HeroesComponent`。

</div>

## Final code review

## 查看最终代码

Here are the code files discussed on this page.

下面是本页所提到的源代码。

<code-tabs>
    <code-pane header="src/app/heroes/heroes.component.ts" path="toh-pt1/src/app/heroes/heroes.component.ts"></code-pane>
    <code-pane header="src/app/heroes/heroes.component.html" path="toh-pt1/src/app/heroes/heroes.component.html"></code-pane>
    <code-pane header="src/app/app.module.ts" path="toh-pt1/src/app/app.module.ts"></code-pane>
    <code-pane header="src/app/app.component.ts" path="toh-pt1/src/app/app.component.ts"></code-pane>
    <code-pane header="src/app/app.component.html" path="toh-pt1/src/app/app.component.html"></code-pane>
    <code-pane header="src/app/hero.ts" path="toh-pt1/src/app/hero.ts"></code-pane>
</code-tabs>

## Summary

## 小结

* You used `ng generate` to create a second `HeroesComponent`.

  你使用 `ng generate` 创建了第二个组件 `HeroesComponent`。

* You displayed the `HeroesComponent` by adding it to the `AppComponent` shell.

  你把 `HeroesComponent` 添加到了壳组件 `AppComponent` 中，以便显示它。

* You applied the `UppercasePipe` to format the name.

  你使用 `UppercasePipe` 来格式化英雄的名字。

* You used two-way data binding with the `ngModel` directive.

  你用 `ngModel` 指令实现了双向数据绑定。

* You learned about the `AppModule`.

  你知道了 `AppModule`。

* You imported the `FormsModule` in the `AppModule` so that Angular would recognize and apply the `ngModel` directive.

  你把 `FormsModule` 导入了 `AppModule`，以便 Angular 能识别并应用 `ngModel` 指令。

* You learned the importance of declaring components in the `AppModule`.

  你知道了把组件声明到 `AppModule` 是很重要的。

@reviewed 2022-02-28