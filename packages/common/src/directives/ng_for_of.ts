/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, DoCheck, EmbeddedViewRef, Input, IterableChangeRecord, IterableChanges, IterableDiffer, IterableDiffers, NgIterable, TemplateRef, TrackByFunction, ViewContainerRef, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../errors';


/**
 * @publicApi
 */
export class NgForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  constructor(public $implicit: T, public ngForOf: U, public index: number, public count: number) {}

  get first(): boolean {
    return this.index === 0;
  }

  get last(): boolean {
    return this.index === this.count - 1;
  }

  get even(): boolean {
    return this.index % 2 === 0;
  }

  get odd(): boolean {
    return !this.even;
  }
}

/**
 * A [structural directive](guide/structural-directives) that renders
 * a template for each item in a collection.
 * The directive is placed on an element, which becomes the parent
 * of the cloned templates.
 *
 * 一种[结构型指令](guide/structural-directives)，为集合中的每个条目渲染一个模板。如果指令放置在一个元素上，该元素就会成为克隆后的模板的父级。
 *
 * The `ngForOf` directive is generally used in the
 * [shorthand form](guide/structural-directives#asterisk) `*ngFor`.
 * In this form, the template to be rendered for each iteration is the content
 * of an anchor element containing the directive.
 *
 * `ngForOf` 指令通常在 `*ngFor`
 * 的[简写形式](guide/structural-directives#asterisk)内部使用。在这种形式下，每次迭代要渲染的模板是包含指令的锚点元素的内容。
 *
 * The following example shows the shorthand syntax with some options,
 * contained in an `<li>` element.
 *
 * `<li>` 元素中包含一些选项的简写语法。
 *
 * ```
 * <li *ngFor="let item of items; index as i; trackBy: trackByFn">...</li>
 * ```
 *
 * The shorthand form expands into a long form that uses the `ngForOf` selector
 * on an `<ng-template>` element.
 * The content of the `<ng-template>` element is the `<li>` element that held the
 * short-form directive.
 *
 * 简写形式会扩展为使用 `<ng-template>` 元素 `ngForOf` 选择器的长形式。`<ng-template>`
 * 元素的内容是包裹此简写格式指令的 `<li>` 元素。
 *
 * Here is the expanded version of the short-form example.
 *
 * 这是简写形式示例的扩展版本。
 *
 * ```
 * <ng-template ngFor let-item [ngForOf]="items" let-i="index" [ngForTrackBy]="trackByFn">
 *   <li>...</li>
 * </ng-template>
 * ```
 *
 * Angular automatically expands the shorthand syntax as it compiles the template.
 * The context for each embedded view is logically merged to the current component
 * context according to its lexical position.
 *
 * Angular
 * 在编译模板时会自动扩展简写语法。每个嵌入式视图的上下文都会根据其词法位置在逻辑上合并到当前组件上下文。
 *
 * When using the shorthand syntax, Angular allows only [one structural directive
 * on an element](guide/structural-directives#one-per-element).
 * If you want to iterate conditionally, for example,
 * put the `*ngIf` on a container element that wraps the `*ngFor` element.
 * For further discussion, see
 * [Structural Directives](guide/structural-directives#one-per-element).
 *
 * 使用简写语法时，Angular
 * 在[一个元素上只允许有一个结构型指令](guide/structural-directives#one-per-element)。比如，如果要根据条件进行迭代，请将
 * `*ngIf` 放在 `*ngFor`
 * 元素的容器元素上。欲知详情，请参见[《结构型指令》](guide/structural-directives#one-per-element)
 * 。
 *
 * @usageNotes
 *
 * ### Local variables
 *
 * ### 局部变量
 *
 * `NgForOf` provides exported values that can be aliased to local variables.
 * For example:
 *
 * `NgForOf` 可以为所提供的导出值指定一个局部变量别名。比如：
 *
 * ```
 * <li *ngFor="let user of users; index as i; first as isFirst">
 *    {{i}}/{{users.length}}. {{user}} <span *ngIf="isFirst">default</span>
 * </li>
 * ```
 *
 * The following exported values can be aliased to local variables:
 *
 * `NgForOf` 导出了一系列值，可以指定别名后作为局部变量使用：
 *
 * - `$implicit: T`: The value of the individual items in the iterable (`ngForOf`).
 *
 *   `$implicit: T`：迭代目标（绑定到 `ngForOf`）中每个条目的值。
 *
 * - `ngForOf: NgIterable<T>`: The value of the iterable expression. Useful when the expression is
 *     more complex then a property access, for example when using the async pipe (`userStreams |
 *     async`).
 *
 *   `ngForOf:
 *     NgIterable<T>`：迭代表达式的值。当表达式不局限于访问某个属性时，这会非常有用，比如在使用
 *   `async` 管道时（`userStreams | async`）。
 *
 * - `index: number`: The index of the current item in the iterable.
 *
 *   `index: number`：可迭代对象中当前条目的索引。
 *
 * - `count: number`: The length of the iterable.
 *
 *   `count: number`：可迭代对象的长度。
 *
 * - `first: boolean`: True when the item is the first item in the iterable.
 *
 *   `first: boolean`：如果当前条目是可迭代对象中的第一个条目则为 `true`。
 *
 * - `last: boolean`: True when the item is the last item in the iterable.
 *
 *   `last: boolean`：如果当前条目是可迭代对象中的最后一个条目则为 `true`。
 *
 * - `even: boolean`: True when the item has an even index in the iterable.
 *
 *   `even: boolean`：如果当前条目在可迭代对象中的索引号为偶数则为 `true`。
 *
 * - `odd: boolean`: True when the item has an odd index in the iterable.
 *
 *   `odd: boolean`：如果当前条目在可迭代对象中的索引号为奇数则为 `true`。
 *
 * ### Change propagation
 *
 * ### 变更的传导机制
 *
 * When the contents of the iterator changes, `NgForOf` makes the corresponding changes to the DOM:
 *
 * 当迭代器的内容变化时，`NgForOf` 会对 DOM 做出相应的修改：
 *
 * * When an item is added, a new instance of the template is added to the DOM.
 *
 *   当新增条目时，就会往 DOM 中添加一个模板实例。
 *
 * * When an item is removed, its template instance is removed from the DOM.
 *
 *   当移除条目时，其对应的模板实例也会被从 DOM 中移除。
 *
 * * When items are reordered, their respective templates are reordered in the DOM.
 *
 *   当条目集被重新排序时，他们对应的模板实例也会在 DOM 中重新排序。
 *
 * Angular uses object identity to track insertions and deletions within the iterator and reproduce
 * those changes in the DOM. This has important implications for animations and any stateful
 * controls that are present, such as `<input>` elements that accept user input. Inserted rows can
 * be animated in, deleted rows can be animated out, and unchanged rows retain any unsaved state
 * such as user input.
 * For more on animations, see [Transitions and Triggers](guide/transition-and-triggers).
 *
 * Angular 使用对象标识符（对象引用）来跟踪迭代器中的添加和删除操作，并把它们同步到 DOM 中。
 * 这对于动画和有状态的控件（如用来接收用户输入的 `<input>`
 * 元素）具有重要意义。添加的行可以带着动画效果进来，删除的行也可以带着动画效果离开。
 * 而未变化的行则会保留那些尚未保存的状态，比如用户的输入。
 *
 * The identities of elements in the iterator can change while the data does not.
 * This can happen, for example, if the iterator is produced from an RPC to the server, and that
 * RPC is re-run. Even if the data hasn't changed, the second response produces objects with
 * different identities, and Angular must tear down the entire DOM and rebuild it (as if all old
 * elements were deleted and all new elements inserted).
 *
 * 即使数据没有变化，迭代器中的元素标识符也可能会发生变化。比如，如果迭代器处理的目标是通过 RPC
 * 从服务器取来的，而 RPC
 * 又重新执行了一次。那么即使数据没有变化，第二次的响应体还是会生成一些具有不同标识符的对象。Angular
 * 将会清除整个 DOM，
 * 并重建它（就仿佛把所有老的元素都删除，并插入所有新元素）。这是很昂贵的操作，应该尽力避免。
 *
 * To avoid this expensive operation, you can customize the default tracking algorithm.
 * by supplying the `trackBy` option to `NgForOf`.
 * `trackBy` takes a function that has two arguments: `index` and `item`.
 * If `trackBy` is given, Angular tracks changes by the return value of the function.
 *
 * 要想自定义默认的跟踪算法，`NgForOf` 支持 `trackBy` 选项。
 * `trackBy` 接受一个带两个参数（`index` 和 `item`）的函数。
 * 如果给出了 `trackBy`，Angular 就会使用该函数的返回值来跟踪变化。
 *
 * @see [Structural Directives](guide/structural-directives)
 *
 * [结构型指令](guide/structural-directives)
 * @ngModule CommonModule
 * @publicApi
 */
@Directive({
  selector: '[ngFor][ngForOf]',
  standalone: true,
})
export class NgForOf<T, U extends NgIterable<T> = NgIterable<T>> implements DoCheck {
  /**
   * The value of the iterable expression, which can be used as a
   * [template input variable](guide/structural-directives#shorthand).
   *
   * 可迭代表达式的值，可以将其用作[模板输入变量](guide/structural-directives#shorthand)。
   *
   */
  @Input()
  set ngForOf(ngForOf: U&NgIterable<T>|undefined|null) {
    this._ngForOf = ngForOf;
    this._ngForOfDirty = true;
  }
  /**
   * Specifies a custom `TrackByFunction` to compute the identity of items in an iterable.
   *
   * 指定自定义 `TrackByFunction` 来计算 iterable 中条目的标识。
   *
   * If a custom `TrackByFunction` is not provided, `NgForOf` will use the item's [object
   * identity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)
   * as the key.
   *
   * 如果未提供自定义 `TrackByFunction` ，`NgForOf`
   * 将使用条目的[对象标识](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)作为键。
   *
   * `NgForOf` uses the computed key to associate items in an iterable with DOM elements
   * it produces for these items.
   *
   * `NgForOf` 使用计算的键将 iterable 中的条目与它为这些条目生成的 DOM 元素关联起来。
   *
   * A custom `TrackByFunction` is useful to provide good user experience in cases when items in an
   * iterable rendered using `NgForOf` have a natural identifier (for example, custom ID or a
   * primary key), and this iterable could be updated with new object instances that still
   * represent the same underlying entity (for example, when data is re-fetched from the server,
   * and the iterable is recreated and re-rendered, but most of the data is still the same).
   *
   * 在使用 `NgForOf` 渲染的迭代中的条目具有自然标识符（例如自定义 ID 或主键）的情况下，自定义
   * `TrackByFunction`
   * 可用于提供良好的用户体验，并且可以用仍然表示同一个基础实体（例如，当从服务器重新获取数据，并且重新创建和重新渲染迭代器，但大多数数据仍然是相同的）。
   *
   * @see `TrackByFunction`
   */
  @Input()
  set ngForTrackBy(fn: TrackByFunction<T>) {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && fn != null && typeof fn !== 'function') {
      console.warn(
          `trackBy must be a function, but received ${JSON.stringify(fn)}. ` +
          `See https://angular.io/api/common/NgForOf#change-propagation for more information.`);
    }
    this._trackByFn = fn;
  }

  get ngForTrackBy(): TrackByFunction<T> {
    return this._trackByFn;
  }

  private _ngForOf: U|undefined|null = null;
  private _ngForOfDirty: boolean = true;
  private _differ: IterableDiffer<T>|null = null;
  // TODO(issue/24571): remove '!'
  // waiting for microsoft/typescript#43662 to allow the return type `TrackByFunction|undefined` for
  // the getter
  private _trackByFn!: TrackByFunction<T>;

  constructor(
      private _viewContainer: ViewContainerRef,
      private _template: TemplateRef<NgForOfContext<T, U>>, private _differs: IterableDiffers) {}

  /**
   * A reference to the template that is stamped out for each item in the iterable.
   *
   * 此模板引用用来为 iterable 中的生成每个条目。
   *
   * @see [template reference variable](guide/template-reference-variables)
   *
   * [模板引用变量](guide/template-reference-variables)
   *
   */
  @Input()
  set ngForTemplate(value: TemplateRef<NgForOfContext<T, U>>) {
    // TODO(TS2.1): make TemplateRef<Partial<NgForRowOf<T>>> once we move to TS v2.1
    // The current type is too restrictive; a template that just uses index, for example,
    // should be acceptable.
    if (value) {
      this._template = value;
    }
  }

  /**
   * Applies the changes when needed.
   *
   * 要按需应用的更改。
   *
   * @nodoc
   */
  ngDoCheck(): void {
    if (this._ngForOfDirty) {
      this._ngForOfDirty = false;
      // React on ngForOf changes only once all inputs have been initialized
      const value = this._ngForOf;
      if (!this._differ && value) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
          try {
            // CAUTION: this logic is duplicated for production mode below, as the try-catch
            // is only present in development builds.
            this._differ = this._differs.find(value).create(this.ngForTrackBy);
          } catch {
            let errorMessage = `Cannot find a differ supporting object '${value}' of type '` +
                `${getTypeName(value)}'. NgFor only supports binding to Iterables, such as Arrays.`;
            if (typeof value === 'object') {
              errorMessage += ' Did you mean to use the keyvalue pipe?';
            }
            throw new RuntimeError(RuntimeErrorCode.NG_FOR_MISSING_DIFFER, errorMessage);
          }
        } else {
          // CAUTION: this logic is duplicated for development mode above, as the try-catch
          // is only present in development builds.
          this._differ = this._differs.find(value).create(this.ngForTrackBy);
        }
      }
    }
    if (this._differ) {
      const changes = this._differ.diff(this._ngForOf);
      if (changes) this._applyChanges(changes);
    }
  }

  private _applyChanges(changes: IterableChanges<T>) {
    const viewContainer = this._viewContainer;
    changes.forEachOperation(
        (item: IterableChangeRecord<T>, adjustedPreviousIndex: number|null,
         currentIndex: number|null) => {
          if (item.previousIndex == null) {
            // NgForOf is never "null" or "undefined" here because the differ detected
            // that a new item needs to be inserted from the iterable. This implies that
            // there is an iterable value for "_ngForOf".
            viewContainer.createEmbeddedView(
                this._template, new NgForOfContext<T, U>(item.item, this._ngForOf!, -1, -1),
                currentIndex === null ? undefined : currentIndex);
          } else if (currentIndex == null) {
            viewContainer.remove(
                adjustedPreviousIndex === null ? undefined : adjustedPreviousIndex);
          } else if (adjustedPreviousIndex !== null) {
            const view = viewContainer.get(adjustedPreviousIndex)!;
            viewContainer.move(view, currentIndex);
            applyViewChange(view as EmbeddedViewRef<NgForOfContext<T, U>>, item);
          }
        });

    for (let i = 0, ilen = viewContainer.length; i < ilen; i++) {
      const viewRef = <EmbeddedViewRef<NgForOfContext<T, U>>>viewContainer.get(i);
      const context = viewRef.context;
      context.index = i;
      context.count = ilen;
      context.ngForOf = this._ngForOf!;
    }

    changes.forEachIdentityChange((record: any) => {
      const viewRef = <EmbeddedViewRef<NgForOfContext<T, U>>>viewContainer.get(record.currentIndex);
      applyViewChange(viewRef, record);
    });
  }

  /**
   * Asserts the correct type of the context for the template that `NgForOf` will render.
   *
   * 为 `NgForOf` 将要渲染的模板确保正确的上下文类型。
   *
   * The presence of this method is a signal to the Ivy template type-check compiler that the
   * `NgForOf` structural directive renders its template with a specific context type.
   *
   * 此方法的存在向 Ivy 模板类型检查编译器发出信号，即 `NgForOf`
   * 结构型指令使用特定的上下文类型渲染其模板。
   *
   */
  static ngTemplateContextGuard<T, U extends NgIterable<T>>(dir: NgForOf<T, U>, ctx: any):
      ctx is NgForOfContext<T, U> {
    return true;
  }
}

// Also export the `NgForOf` class as `NgFor` to improve the DX for
// cases when the directive is used as standalone, so the class name
// matches the CSS selector (*ngFor).
export {NgForOf as NgFor};

function applyViewChange<T>(
    view: EmbeddedViewRef<NgForOfContext<T>>, record: IterableChangeRecord<T>) {
  view.context.$implicit = record.item;
}

function getTypeName(type: any): string {
  return type['name'] || typeof type;
}
