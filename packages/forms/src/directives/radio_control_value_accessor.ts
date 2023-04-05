/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, ElementRef, forwardRef, inject, Injectable, Injector, Input, NgModule, OnDestroy, OnInit, Provider, Renderer2, ɵRuntimeError as RuntimeError} from '@angular/core';

import {RuntimeErrorCode} from '../errors';

import {BuiltInControlValueAccessor, ControlValueAccessor, NG_VALUE_ACCESSOR} from './control_value_accessor';
import {NgControl} from './ng_control';
import {CALL_SET_DISABLED_STATE, setDisabledStateDefault, SetDisabledStateOption} from './shared';

const RADIO_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioControlValueAccessor),
  multi: true
};

function throwNameError() {
  throw new RuntimeError(RuntimeErrorCode.NAME_AND_FORM_CONTROL_NAME_MUST_MATCH, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}

/**
 * Internal-only NgModule that works as a host for the `RadioControlRegistry` tree-shakable
 * provider. Note: the `InternalFormsSharedModule` can not be used here directly, since it's
 * declared *after* the `RadioControlRegistry` class and the `providedIn` doesn't support
 * `forwardRef` logic.
 *
 * 仅供内部的 NgModule ，作为 `RadioControlRegistry` 树形抖动提供程序的宿主。注意：
 * `InternalFormsSharedModule` 不能在这里直接使用，因为它是在 `RadioControlRegistry`
 * 类*之后*声明的，并且 `providedIn` 不支持 `forwardRef` 逻辑。
 *
 */
@NgModule()
export class RadioControlRegistryModule {
}

/**
 * @description
 *
 * Class used by Angular to track radio buttons. For internal use only.
 *
 * Angular 用来跟踪单选按钮的类。仅供内部使用。
 *
 */
@Injectable({providedIn: RadioControlRegistryModule})
export class RadioControlRegistry {
  private _accessors: any[] = [];

  /**
   * @description
   *
   * Adds a control to the internal registry. For internal use only.
   *
   * 将控件添加到内部注册表。仅供内部使用。
   *
   */
  add(control: NgControl, accessor: RadioControlValueAccessor) {
    this._accessors.push([control, accessor]);
  }

  /**
   * @description
   *
   * Removes a control from the internal registry. For internal use only.
   *
   * 从内部注册表中删除控件。仅供内部使用。
   *
   */
  remove(accessor: RadioControlValueAccessor) {
    for (let i = this._accessors.length - 1; i >= 0; --i) {
      if (this._accessors[i][1] === accessor) {
        this._accessors.splice(i, 1);
        return;
      }
    }
  }

  /**
   * @description
   *
   * Selects a radio button. For internal use only.
   *
   * 选择一个单选按钮。仅供内部使用。
   *
   */
  select(accessor: RadioControlValueAccessor) {
    this._accessors.forEach((c) => {
      if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
        c[1].fireUncheck(accessor.value);
      }
    });
  }

  private _isSameGroup(
      controlPair: [NgControl, RadioControlValueAccessor],
      accessor: RadioControlValueAccessor): boolean {
    if (!controlPair[0].control) return false;
    return controlPair[0]._parent === accessor._control._parent &&
        controlPair[1].name === accessor.name;
  }
}

/**
 * @description
 * The `ControlValueAccessor` for writing radio control values and listening to radio control
 * changes. The value accessor is used by the `FormControlDirective`, `FormControlName`, and
 * `NgModel` directives.
 *
 * `ControlValueAccessor` 用于写入单选控件的值和监听单选控件值的更改。这个值访问器由
 * `FormControlDirective`、`FormControlName` 和 `NgModel` 指令使用。
 *
 * @usageNotes
 *
 * ### Using radio buttons with reactive form directives
 *
 * ### 将单选按钮与响应式表单指令一起使用
 *
 * The follow example shows how to use radio buttons in a reactive form. When using radio buttons in
 * a reactive form, radio buttons in the same group should have the same `formControlName`.
 * Providing a `name` attribute is optional.
 *
 * 下面的示例演示了如何在响应式表单中使用单选按钮。当使用响应式表单的单选按钮时，同一组中的单选按钮应具有相同的
 * `formControlName` 。所提供的 `name` 属性是可选的。
 *
 * {@example forms/ts/reactiveRadioButtons/reactive_radio_button_example.ts region='Reactive'}
 *
 * @ngModule ReactiveFormsModule
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector:
      'input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]',
  host: {'(change)': 'onChange()', '(blur)': 'onTouched()'},
  providers: [RADIO_VALUE_ACCESSOR]
})
export class RadioControlValueAccessor extends BuiltInControlValueAccessor implements
    ControlValueAccessor, OnDestroy, OnInit {
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _state!: boolean;
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _control!: NgControl;
  /** @internal */
  // TODO(issue/24571): remove '!'.
  _fn!: Function;

  private setDisabledStateFired = false;

  /**
   * The registered callback function called when a change event occurs on the input element.
   *
   * 在此 input 元素上发生 change 事件时调用的已注册回调函数。
   *
   * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
   * to override the `onChange` function (which expects 1 argument) in the parent
   * `BaseControlValueAccessor` class.
   *
   * 注意：我们在此将 `onChange`（也用作宿主侦听器）声明为不带参数的函数，以覆盖父
   * `BaseControlValueAccessor` 类中的 `onChange` 函数（需要 1 个参数）。
   *
   * @nodoc
   */
  override onChange = () => {};

  /**
   * @description
   * Tracks the name of the radio input element.
   *
   * 跟踪单选 input 元素的名称。
   *
   */
  // TODO(issue/24571): remove '!'.
  @Input() name!: string;

  /**
   * @description
   * Tracks the name of the `FormControl` bound to the directive. The name corresponds
   * to a key in the parent `FormGroup` or `FormArray`.
   *
   * 跟踪绑定到指令的 `FormControl` 的名称。该名称对应于父 `FormGroup` 或 `FormArray` 。
   *
   */
  // TODO(issue/24571): remove '!'.
  @Input() formControlName!: string;

  /**
   * @description
   * Tracks the value of the radio input element
   *
   * 跟踪单选 input 元素的值
   *
   */
  @Input() value: any;

  private callSetDisabledState =
      inject(CALL_SET_DISABLED_STATE, {optional: true}) ?? setDisabledStateDefault;

  constructor(
      renderer: Renderer2, elementRef: ElementRef, private _registry: RadioControlRegistry,
      private _injector: Injector) {
    super(renderer, elementRef);
  }

  /** @nodoc */
  ngOnInit(): void {
    this._control = this._injector.get(NgControl);
    this._checkName();
    this._registry.add(this._control, this);
  }

  /** @nodoc */
  ngOnDestroy(): void {
    this._registry.remove(this);
  }

  /**
   * Sets the "checked" property value on the radio input element.
   *
   * 在单选 input 元素上设置 “checked” 属性的值。
   *
   * @nodoc
   */
  writeValue(value: any): void {
    this._state = value === this.value;
    this.setProperty('checked', this._state);
  }

  /**
   * Registers a function called when the control value changes.
   *
   * 注册控件值更改时要调用的函数。
   *
   * @nodoc
   */
  override registerOnChange(fn: (_: any) => {}): void {
    this._fn = fn;
    this.onChange = () => {
      fn(this.value);
      this._registry.select(this);
    };
  }

  /** @nodoc */
  override setDisabledState(isDisabled: boolean): void {
    /**
     * `setDisabledState` is supposed to be called whenever the disabled state of a control changes,
     * including upon control creation. However, a longstanding bug caused the method to not fire
     * when an *enabled* control was attached. This bug was fixed in v15 in #47576.
     *
     * This had a side effect: previously, it was possible to instantiate a reactive form control
     * with `[attr.disabled]=true`, even though the the corresponding control was enabled in the
     * model. This resulted in a mismatch between the model and the DOM. Now, because
     * `setDisabledState` is always called, the value in the DOM will be immediately overwritten
     * with the "correct" enabled value.
     *
     * However, the fix also created an exceptional case: radio buttons. Because Reactive Forms
     * models the entire group of radio buttons as a single `FormControl`, there is no way to
     * control the disabled state for individual radios, so they can no longer be configured as
     * disabled. Thus, we keep the old behavior for radio buttons, so that `[attr.disabled]`
     * continues to work. Specifically, we drop the first call to `setDisabledState` if `disabled`
     * is `false`, and we are not in legacy mode.
     */
    if (this.setDisabledStateFired || isDisabled ||
        this.callSetDisabledState === 'whenDisabledForLegacyCode') {
      this.setProperty('disabled', isDisabled);
    }
    this.setDisabledStateFired = true;
  }

  /**
   * Sets the "value" on the radio input element and unchecks it.
   *
   * 在单选 input 元素上设置 “value”，并取消选中它。
   *
   * @param value
   */
  fireUncheck(value: any): void {
    this.writeValue(value);
  }

  private _checkName(): void {
    if (this.name && this.formControlName && this.name !== this.formControlName &&
        (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throwNameError();
    }
    if (!this.name && this.formControlName) this.name = this.formControlName;
  }
}
