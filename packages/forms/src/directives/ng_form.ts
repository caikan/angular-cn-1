/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AfterViewInit, Directive, EventEmitter, forwardRef, Inject, Input, Optional, Provider, Self} from '@angular/core';

import {AbstractControl, FormHooks} from '../model/abstract_model';
import {FormControl} from '../model/form_control';
import {FormGroup} from '../model/form_group';
import {composeAsyncValidators, composeValidators, NG_ASYNC_VALIDATORS, NG_VALIDATORS} from '../validators';

import {ControlContainer} from './control_container';
import {Form} from './form_interface';
import {NgControl} from './ng_control';
import {NgModel} from './ng_model';
import {NgModelGroup} from './ng_model_group';
import {CALL_SET_DISABLED_STATE, SetDisabledStateOption, setUpControl, setUpFormContainer, syncPendingControls} from './shared';
import {AsyncValidator, AsyncValidatorFn, Validator, ValidatorFn} from './validators';

const formDirectiveProvider: Provider = {
  provide: ControlContainer,
  useExisting: forwardRef(() => NgForm)
};

const resolvedPromise = (() => Promise.resolve())();

/**
 * @description
 * Creates a top-level `FormGroup` instance and binds it to a form
 * to track aggregate form value and validation status.
 *
 * 创建一个顶级的 `FormGroup` 实例，并把它绑定到一个表单，以跟踪表单的聚合值及其验证状态。
 *
 * As soon as you import the `FormsModule`, this directive becomes active by default on
 * all `<form>` tags.  You don't need to add a special selector.
 *
 * 只要你导入了 `FormsModule`，该指令就会默认在所有 `<form>`
 * 标签上生效。你不需要再添加任何特殊的选择器。
 *
 * You optionally export the directive into a local template variable using `ngForm` as the key
 * (ex: `#myForm="ngForm"`). This is optional, but useful.  Many properties from the underlying
 * `FormGroup` instance are duplicated on the directive itself, so a reference to it
 * gives you access to the aggregate value and validity status of the form, as well as
 * user interaction properties like `dirty` and `touched`.
 *
 * 你可以以 `ngForm` 作为 key 把该指令导出到一个局部模板变量（如
 * `#myForm="ngForm"`）。这是可选的，但很有用。 来自本指令背后的 `FormGroup`
 * 实例的很多属性，都被复制到了指令自身，所以拿到一个对该指令的引用就可以让你访问此表单的聚合值和验证状态，
 * 还有那些用户交互类的属性，比如 `dirty` 和 `touched`。
 *
 * To register child controls with the form, use `NgModel` with a `name`
 * attribute. You may use `NgModelGroup` to create sub-groups within the form.
 *
 * 要使用该表单注册的子控件，请使用带有 `name` 属性的 `NgModel`。你可以使用 `NgModelGroup`
 * 在表单中创建子组。
 *
 * If necessary, listen to the directive's `ngSubmit` event to be notified when the user has
 * triggered a form submission. The `ngSubmit` event emits the original form
 * submission event.
 *
 * 如果需要，还可以监听该指令的 `ngSubmit` 事件，以便当用户触发了一次表单提交时得到通知。发出
 * `ngSubmit` 事件时，会携带原始的 DOM 表单提交事件。
 *
 * In template driven forms, all `<form>` tags are automatically tagged as `NgForm`.
 * To import the `FormsModule` but skip its usage in some forms,
 * for example, to use native HTML5 validation, add the `ngNoForm` and the `<form>`
 * tags won't create an `NgForm` directive. In reactive forms, using `ngNoForm` is
 * unnecessary because the `<form>` tags are inert. In that case, you would
 * refrain from using the `formGroup` directive.
 *
 * 在模板驱动表单中，所有 `<form>` 标签都会自动应用上 `NgForm` 指令。
 * 如果你只想导入 `FormsModule` 而不想把它应用于某些表单中，比如，要想使用 HTML5 验证，你可以添加
 * `ngNoForm` 属性，这样标签就不会在 `<form>` 上创建 `NgForm` 指令了。 在响应式表单中，则不需要用
 * `ngNoForm`，因为 `NgForm` 指令不会自动应用到 `<form>` 标签上，你只要别主动添加 `formGroup`
 * 指令就可以了。
 *
 * @usageNotes
 *
 * ### Listening for form submission
 *
 * ### 监听表单提交
 *
 * The following example shows how to capture the form values from the "ngSubmit" event.
 *
 * 下面的示例显示如何从 “ngSubmit” 事件中捕获表单值。
 *
 * {@example forms/ts/simpleForm/simple_form_example.ts region='Component'}
 *
 * ### Setting the update options
 *
 * The following example shows you how to change the "updateOn" option from its default using
 * ngFormOptions.
 *
 * ```html
 * <form [ngFormOptions]="{updateOn: 'blur'}">
 *    <input name="one" ngModel>  <!-- this ngModel will update on blur -->
 * </form>
 * ```
 *
 * ### Native DOM validation UI
 *
 * In order to prevent the native DOM form validation UI from interfering with Angular's form
 * validation, Angular automatically adds the `novalidate` attribute on any `<form>` whenever
 * `FormModule` or `ReactiveFormModule` are imported into the application.
 * If you want to explicitly enable native DOM validation UI with Angular forms, you can add the
 * `ngNativeValidate` attribute to the `<form>` element:
 *
 * ```html
 * <form ngNativeValidate>
 *   ...
 * </form>
 * ```
 *
 * @ngModule FormsModule
 * @publicApi
 */
@Directive({
  selector: 'form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]',
  providers: [formDirectiveProvider],
  host: {'(submit)': 'onSubmit($event)', '(reset)': 'onReset()'},
  outputs: ['ngSubmit'],
  exportAs: 'ngForm'
})
export class NgForm extends ControlContainer implements Form, AfterViewInit {
  /**
   * @description
   * Returns whether the form submission has been triggered.
   *
   * 返回是否已触发表单提交。
   *
   */
  public readonly submitted: boolean = false;

  private _directives = new Set<NgModel>();

  /**
   * @description
   * The `FormGroup` instance created for this form.
   *
   * 为此表单创建的 `FormGroup`
   *
   */
  form: FormGroup;

  /**
   * @description
   * Event emitter for the "ngSubmit" event
   *
   * “ngSubmit” 的事件发射器
   *
   */
  ngSubmit = new EventEmitter();

  /**
   * @description
   *
   * Tracks options for the `NgForm` instance.
   *
   * `NgForm` 实例的选项。接受下列属性：
   *
   * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
   * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
   * Possible values: `'change'` \| `'blur'` \| `'submit'`
   *
   * **updateOn**：为所有子级的 `NgModel` 设置 `updateOn` 的默认值（除非子 `NgModel` 通过
   * `ngModelOptions` 显式指定了这个值）。 可能的值有：`'change'` \| `'blur'` \| `'submit'`.
   *
   */
  // TODO(issue/24571): remove '!'.
  @Input('ngFormOptions') options!: {updateOn?: FormHooks};

  constructor(
      @Optional() @Self() @Inject(NG_VALIDATORS) validators: (Validator|ValidatorFn)[],
      @Optional() @Self() @Inject(NG_ASYNC_VALIDATORS) asyncValidators:
          (AsyncValidator|AsyncValidatorFn)[],
      @Optional() @Inject(CALL_SET_DISABLED_STATE) private callSetDisabledState?:
          SetDisabledStateOption) {
    super();
    this.form =
        new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
  }

  /** @nodoc */
  ngAfterViewInit() {
    this._setUpdateStrategy();
  }

  /**
   * @description
   * The directive instance.
   *
   * 指令实例。
   *
   */
  override get formDirective(): Form {
    return this;
  }

  /**
   * @description
   * The internal `FormGroup` instance.
   *
   * 内部 `FormGroup` 实例。
   *
   */
  override get control(): FormGroup {
    return this.form;
  }

  /**
   * @description
   * Returns an array representing the path to this group. Because this directive
   * always lives at the top level of a form, it is always an empty array.
   *
   * 返回表示该组路径的数组。由于此指令始终位于调用表单的顶层，因此它始终是一个空数组。
   *
   */
  override get path(): string[] {
    return [];
  }

  /**
   * @description
   * Returns a map of the controls in this group.
   *
   * 返回此组中控件的映射表。
   *
   */
  get controls(): {[key: string]: AbstractControl} {
    return this.form.controls;
  }

  /**
   * @description
   * Method that sets up the control directive in this group, re-calculates its value
   * and validity, and adds the instance to the internal list of directives.
   *
   * 在该组中设置控件指令，重新计算其值和有效性并将该实例添加到内部指令列表的方法。
   *
   * @param dir The `NgModel` directive instance.
   *
   * `NgModel` 指令实例。
   */
  addControl(dir: NgModel): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      (dir as {control: FormControl}).control =
          <FormControl>container.registerControl(dir.name, dir.control);
      setUpControl(dir.control, dir, this.callSetDisabledState);
      dir.control.updateValueAndValidity({emitEvent: false});
      this._directives.add(dir);
    });
  }

  /**
   * @description
   * Retrieves the `FormControl` instance from the provided `NgModel` directive.
   *
   * 从提供的 `NgModel` 指令中检索 `FormControl`
   *
   * @param dir The `NgModel` directive instance.
   *
   * `NgModel` 指令实例。
   *
   */
  getControl(dir: NgModel): FormControl {
    return <FormControl>this.form.get(dir.path);
  }

  /**
   * @description
   * Removes the `NgModel` instance from the internal list of directives
   *
   * 从指令的内部列表中删除 `NgModel`
   *
   * @param dir The `NgModel` directive instance.
   *
   * `NgModel` 指令实例。
   *
   */
  removeControl(dir: NgModel): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
      this._directives.delete(dir);
    });
  }

  /**
   * @description
   * Adds a new `NgModelGroup` directive instance to the form.
   *
   * 向表单添加一个新的 `NgModelGroup` 指令实例。
   *
   * @param dir The `NgModelGroup` directive instance.
   *
   * `NgModelGroup` 指令实例。
   *
   */
  addFormGroup(dir: NgModelGroup): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      const group = new FormGroup({});
      setUpFormContainer(group, dir);
      container.registerControl(dir.name, group);
      group.updateValueAndValidity({emitEvent: false});
    });
  }

  /**
   * @description
   * Removes the `NgModelGroup` directive instance from the form.
   *
   * 从表单中删除 `NgModelGroup`
   *
   * @param dir The `NgModelGroup` directive instance.
   *
   * `NgModelGroup` 指令实例。
   *
   */
  removeFormGroup(dir: NgModelGroup): void {
    resolvedPromise.then(() => {
      const container = this._findContainer(dir.path);
      if (container) {
        container.removeControl(dir.name);
      }
    });
  }

  /**
   * @description
   * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
   *
   * 为所提供的 `NgModelGroup` 指令实例检索其 `FormGroup`
   *
   * @param dir The `NgModelGroup` directive instance.
   *
   * `NgModelGroup` 指令实例。
   *
   */
  getFormGroup(dir: NgModelGroup): FormGroup {
    return <FormGroup>this.form.get(dir.path);
  }

  /**
   * Sets the new value for the provided `NgControl` directive.
   *
   * 为所提供的 `NgControl` 指令设置新值。
   *
   * @param dir The `NgControl` directive instance.
   *
   * `NgControl` 指令实例。
   *
   * @param value The new value for the directive's control.
   *
   * 指令控件的新值。
   *
   */
  updateModel(dir: NgControl, value: any): void {
    resolvedPromise.then(() => {
      const ctrl = <FormControl>this.form.get(dir.path!);
      ctrl.setValue(value);
    });
  }

  /**
   * @description
   * Sets the value for this `FormGroup`.
   *
   * 设置此 `FormGroup` 的值。
   *
   * @param value The new value
   *
   * 新值
   *
   */
  setValue(value: {[key: string]: any}): void {
    this.control.setValue(value);
  }

  /**
   * @description
   * Method called when the "submit" event is triggered on the form.
   * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
   *
   * 在表单上触发 “submit” 事件时调用的方法。触发 `ngSubmit` 发出 “submit” 事件。
   *
   * @param $event The "submit" event object
   *
   * "submit" 事件对象
   *
   */
  onSubmit($event: Event): boolean {
    (this as {submitted: boolean}).submitted = true;
    syncPendingControls(this.form, this._directives);
    this.ngSubmit.emit($event);
    // Forms with `method="dialog"` have some special behavior
    // that won't reload the page and that shouldn't be prevented.
    return ($event?.target as HTMLFormElement | null)?.method === 'dialog';
  }

  /**
   * @description
   * Method called when the "reset" event is triggered on the form.
   *
   * 在表单上触发 “reset” 事件时要调用的方法。
   *
   */
  onReset(): void {
    this.resetForm();
  }

  /**
   * @description
   * Resets the form to an initial value and resets its submitted status.
   *
   * 将表单重置为初始值并重置其提交状态。
   *
   * @param value The new value for the form.
   *
   * 表单的新值。
   *
   */
  resetForm(value: any = undefined): void {
    this.form.reset(value);
    (this as {submitted: boolean}).submitted = false;
  }

  private _setUpdateStrategy() {
    if (this.options && this.options.updateOn != null) {
      this.form._updateOn = this.options.updateOn;
    }
  }

  private _findContainer(path: string[]): FormGroup {
    path.pop();
    return path.length ? <FormGroup>this.form.get(path) : this.form;
  }
}
