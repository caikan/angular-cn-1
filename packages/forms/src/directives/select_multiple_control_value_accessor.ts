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

const SELECT_MULTIPLE_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
  multi: true
};

function _buildValueString(id: string, value: any): string {
  if (id == null) return `${value}`;
  if (typeof value === 'string') value = `'${value}'`;
  if (value && typeof value === 'object') value = 'Object';
  return `${id}: ${value}`.slice(0, 50);
}

function _extractId(valueString: string): string {
  return valueString.split(':')[0];
}

/**
 * Mock interface for HTML Options
 *
 * HTML 选项的模拟接口
 *
 */
interface HTMLOption {
  value: string;
  selected: boolean;
}

/**
 * Mock interface for HTMLCollection
 *
 * HTMLCollection 的模拟接口
 *
 */
abstract class HTMLCollection {
  // TODO(issue/24571): remove '!'.
  length!: number;
  abstract item(_: number): HTMLOption;
}

/**
 * @description
 * The `ControlValueAccessor` for writing multi-select control values and listening to multi-select
 * control changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * 本 `ControlValueAccessor` 用于写入多选控件值和监听多选控件更改。这个值访问器由
 * `FormControlDirective`、`FormControlName` 和 `NgModel` 指令使用。
 *
 * @see `SelectControlValueAccessor`
 *
 * @usageNotes
 *
 * ### Using a multi-select control
 *
 * ### 使用多选控件
 *
 * The follow example shows you how to use a multi-select control with a reactive form.
 *
 * 下面的示例向你演示了如何将多选控件与响应式表单一起使用。
 *
 * ```ts
 * const countryControl = new FormControl();
 * ```
 *
 * ```
 * <select multiple name="countries" [formControl]="countryControl">
 *   <option *ngFor="let country of countries" [ngValue]="country">
 *     {{ country.name }}
 *   </option>
 * </select>
 * ```
 *
 * ### Customizing option selection
 *
 * ### 自定义选项选取方式
 *
 * To customize the default option comparison algorithm, `<select>` supports `compareWith` input.
 * See the `SelectControlValueAccessor` for usage.
 *
 * 要自定义默认的选项比较算法，可以用 `<select>` 支持的输入属性 `compareWith`。有关用法，请参见
 * `SelectControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]',
  host: {'(change)': 'onChange($event.target)', '(blur)': 'onTouched()'},
  providers: [SELECT_MULTIPLE_VALUE_ACCESSOR]
})
export class SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor {
  /**
   * The current value.
   *
   * 当前值。
   *
   * @nodoc
   */
  value: any;

  /** @internal */
  _optionMap: Map<string, ɵNgSelectMultipleOption> = new Map<string, ɵNgSelectMultipleOption>();

  /** @internal */
  _idCounter: number = 0;

  /**
   * @description
   * Tracks the option comparison algorithm for tracking identities when
   * checking for changes.
   *
   * 跟踪选项的比较算法，以在检查更改时跟踪其标识。
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
   * Sets the "value" property on one or of more of the select's options.
   *
   * 在此 select 的一个或多个选项上设置 “value” 属性。
   *
   * @nodoc
   */
  writeValue(value: any): void {
    this.value = value;
    let optionSelectedStateSetter: (opt: ɵNgSelectMultipleOption, o: any) => void;
    if (Array.isArray(value)) {
      // convert values to ids
      const ids = value.map((v) => this._getOptionId(v));
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(ids.indexOf(o.toString()) > -1);
      };
    } else {
      optionSelectedStateSetter = (opt, o) => {
        opt._setSelected(false);
      };
    }
    this._optionMap.forEach(optionSelectedStateSetter);
  }

  /**
   * Registers a function called when the control value changes
   * and writes an array of the selected options.
   *
   * 注册一个当控件的值更改并写入所选选项的数组时要调用的函数。
   *
   * @nodoc
   */
  override registerOnChange(fn: (value: any) => any): void {
    this.onChange = (element: HTMLSelectElement) => {
      const selected: Array<any> = [];
      const selectedOptions = element.selectedOptions;
      if (selectedOptions !== undefined) {
        const options = selectedOptions;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          const val = this._getOptionValue(opt.value);
          selected.push(val);
        }
      }
      // Degrade to use `options` when `selectedOptions` property is not available.
      // Note: the `selectedOptions` is available in all supported browsers, but the Domino lib
      // doesn't have it currently, see https://github.com/fgnass/domino/issues/177.
      else {
        const options = element.options;
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (opt.selected) {
            const val = this._getOptionValue(opt.value);
            selected.push(val);
          }
        }
      }
      this.value = selected;
      fn(selected);
    };
  }

  /** @internal */
  _registerOption(value: ɵNgSelectMultipleOption): string {
    const id: string = (this._idCounter++).toString();
    this._optionMap.set(id, value);
    return id;
  }

  /** @internal */
  _getOptionId(value: any): string|null {
    for (const id of Array.from(this._optionMap.keys())) {
      if (this._compareWith(this._optionMap.get(id)!._value, value)) return id;
    }
    return null;
  }

  /** @internal */
  _getOptionValue(valueString: string): any {
    const id: string = _extractId(valueString);
    return this._optionMap.has(id) ? this._optionMap.get(id)!._value : valueString;
  }
}

/**
 * @description
 * Marks `<option>` as dynamic, so Angular can be notified when options change.
 *
 * 将 `<option>` 标记为动态，以便在选项更改时通知 Angular。
 *
 * @see `SelectMultipleControlValueAccessor`
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({selector: 'option'})
export class ɵNgSelectMultipleOption implements OnDestroy {
  // TODO(issue/24571): remove '!'.
  id!: string;
  /** @internal */
  _value: any;

  constructor(
      private _element: ElementRef, private _renderer: Renderer2,
      @Optional() @Host() private _select: SelectMultipleControlValueAccessor) {
    if (this._select) {
      this.id = this._select._registerOption(this);
    }
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
    this._value = value;
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
    if (this._select) {
      this._value = value;
      this._setElementValue(_buildValueString(this.id, value));
      this._select.writeValue(this._select.value);
    } else {
      this._setElementValue(value);
    }
  }

  /** @internal */
  _setElementValue(value: string): void {
    this._renderer.setProperty(this._element.nativeElement, 'value', value);
  }

  /** @internal */
  _setSelected(selected: boolean) {
    this._renderer.setProperty(this._element.nativeElement, 'selected', selected);
  }

  /** @nodoc */
  ngOnDestroy(): void {
    if (this._select) {
      this._select._optionMap.delete(this.id);
      this._select.writeValue(this._select.value);
    }
  }
}

export {ɵNgSelectMultipleOption as NgSelectMultipleOption};
