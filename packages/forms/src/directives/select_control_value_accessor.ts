/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, forwardRef, Host, Input, OnDestroy, Optional, Provider, Renderer2, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../errors';

import {BuiltInControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR} from './control_value_accessor';

const SELECT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlValueAccessor),
  multi: true
};

function _buildValueString(id: string|null, value: any): string {
  if (id == null) return `${value}`;
  if (value && typeof value === 'object') value = 'Object';
  return `${id}: ${value}`.slice(0, 50);
}

function _extractId(valueString: string): string {
  return valueString.split(':')[0];
}

/**
 * @description
 * The `ControlValueAccessor` for writing select control values and listening to select control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * 该 `ControlValueAccessor` 用于写入 select 控件的值，并监听 select 控件的变化。该值访问器会被
 * `FormControlDirective`、`FormControlName` 和 `NgModel` 指令使用。
 *
 * @usageNotes
 *
 * ### Using select controls in a reactive form
 *
 * ### 在响应式表单中使用 select 控件
 *
 * The following examples show how to use a select control in a reactive form.
 *
 * 下面的例子演示了如何在响应式表单中使用 select 控件。
 *
 * {@example forms/ts/reactiveSelectControl/reactive_select_control_example.ts region='Component'}
 *
 * ### Using select controls in a template-driven form
 *
 * ### 在模板驱动表单中使用 select 控件
 *
 * To use a select in a template-driven form, simply add an `ngModel` and a `name`
 * attribute to the main `<select>` tag.
 *
 * 要在模板驱动表单中使用 `select`，只要把 `ngModel` 和 `name` 属性加到 `<select>` 标签上即可。
 *
 * {@example forms/ts/selectControl/select_control_example.ts region='Component'}
 *
 * ### Customizing option selection
 *
 * ### 自定义 `option` 的选择结果
 *
 * Angular uses object identity to select option. It's possible for the identities of items
 * to change while the data does not. This can happen, for example, if the items are produced
 * from an RPC to the server, and that RPC is re-run. Even if the data hasn't changed, the
 * second response will produce objects with different identities.
 *
 * Angular
 * 使用对象标识作为选项。条目标识可能在其实质性数据没有变化的情况发生变化。比如，如果这些条目是通过
 * RPC 的方式从服务端取到的，当重新执行 RPC
 * 时，就算数据没有变化，第二个响应也会生成一些具有不同对象标识的对象。
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * `compareWith` takes a **function** which has two arguments: `option1` and `option2`.
 * If `compareWith` is given, Angular selects option by the return value of the function.
 *
 * 要想自定义默认的选项比较算法，`<select>` 支持一个名叫 `compareWith` 的输入。
 * `compareWith` 接受一个**函数**，它具有两个参数：`option1` 和 `option2`。
 * 如果指定了 `compareWith`，则 Angular 会根据该函数的返回值来选取一个选项。
 *
 * ```ts
 * const selectedCountriesControl = new FormControl();
 * ```
 *
 * ```
 * <select [compareWith]="compareFn"  [formControl]="selectedCountriesControl">
 *     <option *ngFor="let country of countries" [ngValue]="country">
 *         {{country.name}}
 *     </option>
 * </select>
 *
 * compareFn(c1: Country, c2: Country): boolean {
 *     return c1 && c2 ? c1.id === c2.id : c1 === c2;
 * }
 * ```
 *
 * **Note:** We listen to the 'change' event because 'input' events aren't fired
 * for selects in IE, see:
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event#browser_compatibility
 *
 * **注意：**我们要监听 `change` 事件，因为 `input` 事件不会在 IE 的 `select`
 * 元素上触发： https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event#browser_compatibility
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]',
  host: {'(change)': 'onChange($event.target.value)', '(blur)': 'onTouched()'},
  providers: [SELECT_VALUE_ACCESSOR]
})
export class SelectControlValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor {
  /** @nodoc */
  value: any;

  /** @internal */
  _optionMap: Map<string, any> = new Map<string, any>();

  /** @internal */
  _idCounter: number = 0;

  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   *
   * 跟踪选项的比较算法，以在检查变更时跟踪其标识。
   *
   */
  @Input()
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw new RuntimeError(
          RuntimeErrorCode.COMPAREWITH_NOT_A_FN,
          `compareWith must be a function, but received ${JSON.stringify(fn)}`);
    }
    this._compareWith = fn;
  }

  private _compareWith: (o1: any, o2: any) => boolean = Object.is;

  /**
   * Sets the "value" property on the select element.
   *
   * 在输入元素上设置 “value” 属性。如果在选项元素上提供了 ID，则还将设置 “selectedIndex” 属性。
   *
   * @nodoc
   */
  writeValue(value: any): void {
    this.value = value;
    const id: string|null = this._getOptionId(value);
    const valueString = _buildValueString(id, value);
    this.setProperty('value', valueString);
  }

  /**
   * Registers a function called when the control value changes.
   *
   * 注册控件值更改时要调用的函数。
   *
   * @nodoc
   */
  override registerOnChange(fn: (value: any) => any): void {
    this.onChange = (valueString: string) => {
      this.value = this._getOptionValue(valueString);
      fn(this.value);
    };
  }

  /** @internal */
  _registerOption(): string {
    return (this._idCounter++).toString();
  }

  /** @internal */
  _getOptionId(value: any): string|null {
    for (const id of Array.from(this._optionMap.keys())) {
      if (this._compareWith(this._optionMap.get(id), value)) return id;
    }
    return null;
  }

  /** @internal */
  _getOptionValue(valueString: string): any {
    const id: string = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
  }
}

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * 把选项 `<option>` 标记为动态的，这样 Angular 就会在选项变化时得到通知。
 *
 * @see `SelectControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({selector: 'option'})
export class NgSelectOption implements OnDestroy {
  /**
   * @description
   * ID of the option element
   *
   * 选项元素的 ID
   *
   */
  // TODO(issue/24571): remove '!'.
  id!: string;

  constructor(
      private _element: ElementRef, private _renderer: Renderer2,
      @Optional() @Host() private _select: SelectControlValueAccessor) {
    if (this._select) this.id = this._select._registerOption();
  }

  /**
   * @description
   * Tracks the value bound to the option element. Unlike the value binding,
   * ngValue supports binding to objects.
   *
   * 跟踪绑定到选项元素的值。与值绑定不同，ngValue 支持绑定到对象。
   *
   */
  @Input('ngValue')
  set ngValue(value: any) {
    if (this._select == null) return;
    this._select._optionMap.set(this.id, value);
    this._setElementValue(_buildValueString(this.id, value));
    this._select.writeValue(this._select.value);
  }

  /**
   * @description
   * Tracks simple string values bound to the option element.
   * For objects, use the `ngValue` input binding.
   *
   * 跟踪绑定到 option 元素的简单字符串值。对于对象，请使用 `ngValue` 输入绑定。
   *
   */
  @Input('value')
  set value(value: any) {
    this._setElementValue(value);
    if (this._select) this._select.writeValue(this._select.value);
  }

  /** @internal */
  _setElementValue(value: string): void {
    this._renderer.setProperty(this._element.nativeElement, 'value', value);
  }

  /** @nodoc */
  ngOnDestroy(): void {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
}
