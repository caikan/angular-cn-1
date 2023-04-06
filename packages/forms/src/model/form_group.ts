/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {AsyncValidatorFn, ValidatorFn} from '../directives/validators';

import {AbstractControl, AbstractControlOptions, assertAllValuesPresent, assertControlPresent, pickAsyncValidators, pickValidators, ɵRawValue, ɵTypedOrUntyped, ɵValue} from './abstract_model';

/**
 * FormGroupValue extracts the type of `.value` from a FormGroup's inner object type. The untyped
 * case falls back to {[key: string]&#x3A; any}.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * For internal use only.
 *
 */
export type ɵFormGroupValue<T extends {[K in keyof T]?: AbstractControl<any>}> =
    ɵTypedOrUntyped<T, Partial<{[K in keyof T]: ɵValue<T[K]>}>, {[key: string]: any}>;

/**
 * FormGroupRawValue extracts the type of `.getRawValue()` from a FormGroup's inner object type. The
 * untyped case falls back to {[key: string]&#x3A; any}.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 *
 * For internal use only.
 *
 */
export type ɵFormGroupRawValue<T extends {[K in keyof T]?: AbstractControl<any>}> =
    ɵTypedOrUntyped<T, {[K in keyof T]: ɵRawValue<T[K]>}, {[key: string]: any}>;

/**
 * OptionalKeys returns the union of all optional keys in the object.
 *
 * Angular uses this type internally to support Typed Forms; do not use it directly.
 */
export type ɵOptionalKeys<T> = {
  [K in keyof T] -?: undefined extends T[K] ? K : never
}[keyof T];

/**
 * Tracks the value and validity state of a group of `FormControl` instances.
 *
 * 跟踪一组 `FormControl` 实例的值和有效状态。
 *
 * A `FormGroup` aggregates the values of each child `FormControl` into one object,
 * with each control name as the key.  It calculates its status by reducing the status values
 * of its children. For example, if one of the controls in a group is invalid, the entire
 * group becomes invalid.
 *
 * 当实例化 `FormGroup` 时，在第一个参数中传入一组子控件。每个子控件会用控件名把自己注册进去。
 *
 * `FormGroup` is one of the four fundamental building blocks used to define forms in Angular,
 * along with `FormControl`, `FormArray`, and `FormRecord`.
 *
 * `FormGroup` 是用于在 Angular 中定义表单的四个基本构建块之一，与 `FormControl`、`FormArray` 和 `FormRecord` 。
 *
 * When instantiating a `FormGroup`, pass in a collection of child controls as the first
 * argument. The key for each child registers the name for the control.
 *
 * 实例化 `FormGroup` 时，请传入子控件的集合作为第一个参数。每个子项的键都会注册控件的名称。
 *
 * `FormGroup` is intended for use cases where the keys are known ahead of time.
 * If you need to dynamically add and remove controls, use {@link FormRecord} instead.
 *
 * `FormGroup` accepts an optional type parameter `TControl`, which is an object type with inner
 * control types as values.
 *
 * `FormGroup` 接受一个可选的类型参数 `TControl` ，它是一种以内部控件类型作为值的对象类型。
 *
 * @usageNotes
 *
 * ### Create a form group with 2 controls
 *
 * ### 创建一个带有两个控件的表单组
 *
 * ```
 * const form = new FormGroup({
 *   first: new FormControl('Nancy', Validators.minLength(2)),
 *   last: new FormControl('Drew'),
 * });
 *
 * console.log(form.value);   // {first: 'Nancy', last; 'Drew'}
 * console.log(form.status);  // 'VALID'
 * ```
 *
 * ### The type argument, and optional controls
 *
 * ### 类型参数和可选控件
 *
 * `FormGroup` accepts one generic argument, which is an object containing its inner controls.
 * This type will usually be inferred automatically, but you can always specify it explicitly if you
 * wish.
 *
 * `FormGroup` 接受一个通用参数，该参数是一个包含其内部控件的对象。这种类型通常会被自动推断，但如果你愿意，你始终可以显式指定它。
 *
 * If you have controls that are optional (i.e. they can be removed, you can use the `?` in the
 * type):
 *
 * 如果你有可选的控件（即它们可以被删除，你可以在类型中使用 `?`）：
 *
 * ```
 * const form = new FormGroup<{
 *   first: FormControl<string|null>,
 *   middle?: FormControl<string|null>, // Middle name is optional.
 *   last: FormControl<string|null>,
 * }>({
 *   first: new FormControl('Nancy'),
 *   last: new FormControl('Drew'),
 * });
 * ```
 *
 * ### Create a form group with a group-level validator
 *
 * ### 创建一个具有组级验证器的表单组
 *
 * You include group-level validators as the second arg, or group-level async
 * validators as the third arg. These come in handy when you want to perform validation
 * that considers the value of more than one child control.
 *
 * 你可以用第二个参数传入一些组级验证器或用第三个参数传入一些组级异步验证器。 当你要根据一个以上子控件的值来决定有效性时，这很好用。
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('', Validators.minLength(2)),
 *   passwordConfirm: new FormControl('', Validators.minLength(2)),
 * }, passwordMatchValidator);
 *
 * function passwordMatchValidator(g: FormGroup) {
 *    return g.get('password').value === g.get('passwordConfirm').value
 *       ? null : {'mismatch': true};
 * }
 * ```
 *
 * Like `FormControl` instances, you choose to pass in
 * validators and async validators as part of an options object.
 *
 * 像 `FormControl` 实例一样，你也可以在配置对象中传入验证器和异步验证器。
 *
 * ```
 * const form = new FormGroup({
 *   password: new FormControl('')
 *   passwordConfirm: new FormControl('')
 * }, { validators: passwordMatchValidator, asyncValidators: otherValidator });
 * ```
 *
 * ### Set the updateOn property for all controls in a form group
 *
 * ### 为表单组中的所有空间设置 `updateOn` 属性
 *
 * The options object is used to set a default value for each child
 * control's `updateOn` property. If you set `updateOn` to `'blur'` at the
 * group level, all child controls default to 'blur', unless the child
 * has explicitly specified a different `updateOn` value.
 *
 * 该选项对象可用来为每个子控件的 `updateOn` 属性设置默认值。 如果在组级把 `updateOn` 设置为 `'blur'`，则所有子控件的默认值也是 `'blur'`，除非这个子控件显式的指定了另一个 `updateOn` 值。
 *
 * ```ts
 * const c = new FormGroup({
 *   one: new FormControl()
 * }, { updateOn: 'blur' });
 * ```
 *
 * ### Using a FormGroup with optional controls
 *
 * ### 使用带有可选控件的 FormGroup
 *
 * It is possible to have optional controls in a FormGroup. An optional control can be removed later
 * using `removeControl`, and can be omitted when calling `reset`. Optional controls must be
 * declared optional in the group's type.
 *
 * FormGroup 中可以有可选控件。可选控件可以在以后使用 `removeControl` 删除，并且在调用 `reset` 时可以省略。可选控件必须在组的类型中声明为 optional。
 *
 * ```ts
 * const c = new FormGroup<{one?: FormControl<string>}>({
 *   one: new FormControl('')
 * });
 * ```
 *
 * Notice that `c.value.one` has type `string|null|undefined`. This is because calling `c.reset({})`
 * without providing the optional key `one` will cause it to become `null`.
 *
 * 请注意，`c.value.one` 的类型为 `string|null|undefined` 。这是因为在不提供可选键 `one` 的情况下调用 `c.reset({})` 将导致它变为 `null` 。
 *
 * @publicApi
 */
export class FormGroup<TControl extends {[K in keyof TControl]: AbstractControl<any>} = any> extends
    AbstractControl<
        ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any>,
        ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any>> {
  /**
   * Creates a new `FormGroup` instance.
   *
   * 创建一个新的 `FormGroup` 实例。
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * 子控件的集合。每个子控件的键就是其注册名称。
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or an `AbstractControlOptions` object that contains validation functions
   * and a validation trigger.
   *
   * 一个同步验证器函数或其数组，或者一个包含验证函数和验证触发器的 `AbstractControlOptions` 对象。
   *
   * @param asyncValidator A single async validator or array of async validator functions
   *
   * 单个的异步验证器函数或其数组。
   *
   */
  constructor(
      controls: TControl, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null) {
    super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
    this.controls = controls;
    this._initObservables();
    this._setUpdateStrategy(validatorOrOpts);
    this._setUpControls();
    this.updateValueAndValidity({
      onlySelf: true,
      // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
      // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
      // so we set `emitEvent` to `true` to allow that during the control creation process.
      emitEvent: !!this.asyncValidator
    });
  }

  public controls: ɵTypedOrUntyped<TControl, TControl, {[key: string]: AbstractControl<any>}>;

  /**
   * Registers a control with the group's list of controls. In a strongly-typed group, the control
   * must be in the group's type (possibly as an optional key).
   *
   * 使用组的控件列表注册控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * This method does not update the value or validity of the control.
   * Use {@link FormGroup#addControl addControl} instead.
   *
   * @param name The control name to register in the collection
   *
   * 注册到集合中的控件名
   *
   * @param control Provides the control for the given name
   *
   * 提供这个名字对应的控件
   *
   */
  registerControl<K extends string&keyof TControl>(name: K, control: TControl[K]): TControl[K];
  registerControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl<any>): AbstractControl<any>;

  registerControl<K extends string&keyof TControl>(name: K, control: TControl[K]): TControl[K] {
    if (this.controls[name]) return (this.controls as any)[name];
    this.controls[name] = control;
    control.setParent(this as FormGroup);
    control._registerOnCollectionChange(this._onCollectionChange);
    return control;
  }

  /**
   * Add a control to this group. In a strongly-typed group, the control must be in the group's type
   * (possibly as an optional key).
   *
   * 向此组添加控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * If a control with a given name already exists, it would *not* be replaced with a new one.
   * If you want to replace an existing control, use the {@link FormGroup#setControl setControl}
   * method instead. This method also updates the value and validity of the control.
   *
   * @param name The control name to add to the collection
   *
   * 要注册到集合中的控件名
   *
   * @param control Provides the control for the given name
   *
   * 提供这个名字对应的控件
   *
   * @param options Specifies whether this FormGroup instance should emit events after a new
   *     control is added.
   *
   * 指定此 FormGroup 实例是否应在添加新控件后发出事件。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   added. When false, no events are emitted.
   *
   *   `emitEvent` ：当 true 或未提供（默认）时，`statusChanges` 和 `valueChanges` 可观察对象在添加控件时会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  addControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl, options?: {emitEvent?: boolean}): void;
  addControl<K extends string&keyof TControl>(name: K, control: Required<TControl>[K], options?: {
    emitEvent?: boolean
  }): void;

  addControl<K extends string&keyof TControl>(name: K, control: Required<TControl>[K], options: {
    emitEvent?: boolean
  } = {}): void {
    this.registerControl(name, control);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  removeControl(this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string, options?: {
    emitEvent?: boolean;
  }): void;
  removeControl<S extends string>(name: ɵOptionalKeys<TControl>&S, options?: {
    emitEvent?: boolean;
  }): void;

  /**
   * Remove a control from this group. In a strongly-typed group, required controls cannot be
   * removed.
   *
   * 从此组中删除控件。在强类型组中，无法删除所需的控件。
   *
   * This method also updates the value and validity of the control.
   *
   * 该方法还会更新本空间的值和有效性。
   *
   * @param name The control name to remove from the collection
   *
   * 要从集合中移除的控件名
   *
   * @param options Specifies whether this FormGroup instance should emit events after a
   *     control is removed.
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   removed. When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，`statusChanges` 和 `valueChanges` 可观察对象会在删除控件时发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  removeControl(name: string, options: {emitEvent?: boolean;} = {}): void {
    if ((this.controls as any)[name])
      (this.controls as any)[name]._registerOnCollectionChange(() => {});
    delete ((this.controls as any)[name]);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  /**
   * Replace an existing control. In a strongly-typed group, the control must be in the group's type
   * (possibly as an optional key).
   *
   * 替换现有的控件。在强类型组中，控件必须是组的类型（可能作为可选键）。
   *
   * If a control with a given name does not exist in this `FormGroup`, it will be added.
   *
   * 如果此 `FormGroup` 中不存在具有给定名称的控件，则将添加它。
   *
   * @param name The control name to replace in the collection
   *
   * 要从集合中替换掉的控件名
   *
   * @param control Provides the control for the given name
   *
   * 提供这个名字对应的控件
   *
   * @param options Specifies whether this FormGroup instance should emit events after an
   *     existing control is replaced.
   *
   * 指定此 FormGroup 实例是否应在替换现有控件后发出事件。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control is
   *   replaced with a new one. When false, no events are emitted.
   *
   *   `emitEvent` ：当为 true 或不提供（默认）时，当控件被替换为新控件时，`statusChanges` 和 `valueChanges` 可观察对象都会发出具有最新状态和值的事件。当 false 时，不会发出事件。
   *
   */
  setControl<K extends string&keyof TControl>(name: K, control: TControl[K], options?: {
    emitEvent?: boolean
  }): void;
  setControl(
      this: FormGroup<{[key: string]: AbstractControl<any>}>, name: string,
      control: AbstractControl, options?: {emitEvent?: boolean}): void;

  setControl<K extends string&keyof TControl>(name: K, control: TControl[K], options: {
    emitEvent?: boolean
  } = {}): void {
    if (this.controls[name]) this.controls[name]._registerOnCollectionChange(() => {});
    delete (this.controls[name]);
    if (control) this.registerControl(name, control);
    this.updateValueAndValidity({emitEvent: options.emitEvent});
    this._onCollectionChange();
  }

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * 检查组内是否有一个具有指定名字的已启用的控件。
   *
   * Reports false for disabled controls. If you'd like to check for existence in the group
   * only, use {@link AbstractControl#get get} instead.
   *
   * @param controlName The control name to check for existence in the collection
   *
   * 要在集合中检查是否存在的控件名
   *
   * @returns false for disabled controls, true otherwise.
   */
  contains<K extends string>(controlName: K): boolean;
  contains(this: FormGroup<{[key: string]: AbstractControl<any>}>, controlName: string): boolean;

  contains<K extends string&keyof TControl>(controlName: K): boolean {
    return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
  }

  /**
   * Sets the value of the `FormGroup`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * 设置此 `FormGroup` 的值。它接受一个与组结构对应的对象，以控件名作为 key。
   *
   * @usageNotes
   *
   * ### Set the complete value for the form group
   *
   * ### 设置表单组的完整值
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl(),
   *   last: new FormControl()
   * });
   *
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.setValue({first: 'Nancy', last: 'Drew'});
   * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
   * ```
   *
   * @throws When strict checks fail, such as setting the value of a control
   * that doesn't exist or if you exclude a value of a control that does exist.
   * @param value The new value for the control that matches the structure of the group.
   *
   * 控件的新值，其结构必须和该组的结构相匹配。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events after the value changes.
   * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   * updateValueAndValidity} method.
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf`:：如果为 `true`，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 `false`。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control value is updated.
   *   When false, no events are emitted.
   *
   *   `emitEvent`：如果为 `true` 或未提供（默认），则当控件值变化时， `statusChanges` 和 `valueChanges` 这两个 Observable 都会以最近的状态和值发出事件。 如果为 `false`，则不会发出事件。
   *
   */
  override setValue(value: ɵFormGroupRawValue<TControl>, options: {
    onlySelf?: boolean,
    emitEvent?: boolean
  } = {}): void {
    assertAllValuesPresent(this, true, value);
    (Object.keys(value) as Array<keyof TControl>).forEach(name => {
      assertControlPresent(this, true, name as any);
      (this.controls as any)[name].setValue(
          (value as any)[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this.updateValueAndValidity(options);
  }

  /**
   * Patches the value of the `FormGroup`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * 修补此 `FormGroup` 的值。它接受一个以控件名为 key 的对象，并尽量把它们的值匹配到组中正确的控件上。
   *
   * It accepts both super-sets and sub-sets of the group without throwing an error.
   *
   * 它能接受组的超集和子集，而不会抛出错误。
   *
   * @usageNotes
   *
   * ### Patch the value for a form group
   *
   * ### 修补表单组的值
   *
   * ```
   * const form = new FormGroup({
   *    first: new FormControl(),
   *    last: new FormControl()
   * });
   * console.log(form.value);   // {first: null, last: null}
   *
   * form.patchValue({first: 'Nancy'});
   * console.log(form.value);   // {first: 'Nancy', last: null}
   * ```
   *
   * @param value The object that matches the structure of the group.
   *
   * 与该组的结构匹配的对象。
   *
   * @param options Configuration options that determine how the control propagates changes and
   * emits events after the value is patched.
   *
   * 在修补了该值之后，此配置项会决定控件如何传播变更以及发出事件。
   *
   * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
   *   true.
   *
   *   `onlySelf` ：当为 true 时，每次更改都只影响此控件，而不影响其父级。默认为 true。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges` observables emit events with the latest status and value when the control value
   *   is updated. When false, no events are emitted. The configuration options are passed to
   *   the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
   *
   */
  override patchValue(value: ɵFormGroupValue<TControl>, options: {
    onlySelf?: boolean,
    emitEvent?: boolean
  } = {}): void {
    // Even though the `value` argument type doesn't allow `null` and `undefined` values, the
    // `patchValue` can be called recursively and inner data structures might have these values, so
    // we just ignore such cases when a field containing FormGroup instance receives `null` or
    // `undefined` as a value.
    if (value == null /* both `null` and `undefined` */) return;
    (Object.keys(value) as Array<keyof TControl>).forEach(name => {
      // The compiler cannot see through the uninstantiated conditional type of `this.controls`, so
      // `as any` is required.
      const control = (this.controls as any)[name];
      if (control) {
        control.patchValue(
            /* Guaranteed to be present, due to the outer forEach. */ value
                [name as keyof ɵFormGroupValue<TControl>]!,
            {onlySelf: true, emitEvent: options.emitEvent});
      }
    });
    this.updateValueAndValidity(options);
  }

  /**
   * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to their default values, or null if no defaults were provided.
   *
   * 重置 `FormGroup` ，将所有后代标记为 `pristine` 和 `untouched` ，并将所有后代的值设置为默认值，如果没有提供默认值，则为 null 。
   *
   * You reset to a specific form state by passing in a map of states
   * that matches the structure of your form, with control names as keys. The state
   * is a standalone value or a form state object with both a value and a disabled
   * status.
   *
   * 你可以通过传入一个与表单结构相匹配的以控件名为 key 的 Map，来把表单重置为特定的状态。 其状态可以是一个单独的值，也可以是一个同时具有值和禁用状态的表单状态对象。
   *
   * @param value Resets the control with an initial value,
   * or an object that defines the initial value and disabled state.
   *
   * 使用初始值或一个包含初始值和禁用状态的对象来重置该控件。
   *
   * @param options Configuration options that determine how the control propagates changes
   * and emits events when the group is reset.
   *
   * 当该组被重置时，此配置项会决定该控件如何传播变更以及发出事件。
   *
   * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
   *   false.
   *
   *   `onlySelf`:：如果为 `true`，则每个变更仅仅影响当前控件，而不会影响父控件。默认为 `false`。
   *
   * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
   *   `valueChanges`
   *   observables emit events with the latest status and value when the control is reset.
   *   When false, no events are emitted.
   *   The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
   *   updateValueAndValidity} method.
   *
   * @usageNotes
   *
   * ### Reset the form group values
   *
   * ### 重置该表单组的值
   *
   * ```ts
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * console.log(form.value);  // {first: 'first name', last: 'last name'}
   *
   * form.reset({ first: 'name', last: 'last name' });
   *
   * console.log(form.value);  // {first: 'name', last: 'last name'}
   * ```
   *
   * ### Reset the form group values and disabled status
   *
   * ### 重置该表单组的值以及禁用状态
   *
   * ```
   * const form = new FormGroup({
   *   first: new FormControl('first name'),
   *   last: new FormControl('last name')
   * });
   *
   * form.reset({
   *   first: {value: 'name', disabled: true},
   *   last: 'last'
   * });
   *
   * console.log(form.value);  // {last: 'last'}
   * console.log(form.get('first').status);  // 'DISABLED'
   * ```
   *
   */
  override reset(
      value: ɵTypedOrUntyped<TControl, ɵFormGroupValue<TControl>, any> = {} as unknown as
          ɵFormGroupValue<TControl>,
      options: {onlySelf?: boolean, emitEvent?: boolean} = {}): void {
    this._forEachChild((control, name) => {
      control.reset((value as any)[name], {onlySelf: true, emitEvent: options.emitEvent});
    });
    this._updatePristine(options);
    this._updateTouched(options);
    this.updateValueAndValidity(options);
  }

  /**
   * The aggregate value of the `FormGroup`, including any disabled controls.
   *
   * 这个 `FormGroup` 的聚合值，包括所有已禁用的控件。
   *
   * Retrieves all values regardless of disabled status.
   *
   * 无论禁用状态如何，都检索所有值。
   *
   */
  override getRawValue(): ɵTypedOrUntyped<TControl, ɵFormGroupRawValue<TControl>, any> {
    return this._reduceChildren({}, (acc, control, name) => {
      (acc as any)[name] = (control as any).getRawValue();
      return acc;
    }) as any;
  }

  /** @internal */
  override _syncPendingControls(): boolean {
    let subtreeUpdated = this._reduceChildren(false, (updated: boolean, child) => {
      return child._syncPendingControls() ? true : updated;
    });
    if (subtreeUpdated) this.updateValueAndValidity({onlySelf: true});
    return subtreeUpdated;
  }

  /** @internal */
  override _forEachChild(cb: (v: any, k: any) => void): void {
    Object.keys(this.controls).forEach(key => {
      // The list of controls can change (for ex. controls might be removed) while the loop
      // is running (as a result of invoking Forms API in `valueChanges` subscription), so we
      // have to null check before invoking the callback.
      const control = (this.controls as any)[key];
      control && cb(control, key);
    });
  }

  /** @internal */
  _setUpControls(): void {
    this._forEachChild((control) => {
      control.setParent(this);
      control._registerOnCollectionChange(this._onCollectionChange);
    });
  }

  /** @internal */
  override _updateValue(): void {
    (this as {value: any}).value = this._reduceValue();
  }

  /** @internal */
  override _anyControls(condition: (c: AbstractControl) => boolean): boolean {
    for (const [controlName, control] of Object.entries(this.controls)) {
      if (this.contains(controlName as any) && condition(control as any)) {
        return true;
      }
    }
    return false;
  }

  /** @internal */
  _reduceValue(): Partial<TControl> {
    let acc: Partial<TControl> = {};
    return this._reduceChildren(acc, (acc, control, name) => {
      if (control.enabled || this.disabled) {
        acc[name] = control.value;
      }
      return acc;
    });
  }

  /** @internal */
  _reduceChildren<T, K extends keyof TControl>(
      initValue: T, fn: (acc: T, control: TControl[K], name: K) => T): T {
    let res = initValue;
    this._forEachChild((control: TControl[K], name: K) => {
      res = fn(res, control, name);
    });
    return res;
  }

  /** @internal */
  override _allControlsDisabled(): boolean {
    for (const controlName of (Object.keys(this.controls) as Array<keyof TControl>)) {
      if ((this.controls as any)[controlName].enabled) {
        return false;
      }
    }
    return Object.keys(this.controls).length > 0 || this.disabled;
  }

  /** @internal */
  override _find(name: string|number): AbstractControl|null {
    return this.controls.hasOwnProperty(name as string) ?
        (this.controls as any)[name as keyof TControl] :
        null;
  }
}

interface UntypedFormGroupCtor {
  new(controls: {[key: string]: AbstractControl},
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): UntypedFormGroup;

  /**
   * The presence of an explicit `prototype` property provides backwards-compatibility for apps that
   * manually inspect the prototype chain.
   */
  prototype: FormGroup<any>;
}

/**
 * UntypedFormGroup is a non-strongly-typed version of `FormGroup`.
 */
export type UntypedFormGroup = FormGroup<any>;

export const UntypedFormGroup: UntypedFormGroupCtor = FormGroup;

/**
 * @description
 * Asserts that the given control is an instance of `FormGroup`
 *
 * @publicApi
 */
export const isFormGroup = (control: unknown): control is FormGroup => control instanceof FormGroup;

/**
 * Tracks the value and validity state of a collection of `FormControl` instances, each of which has
 * the same value type.
 *
 * 跟踪 `FormControl` 实例集合的值和有效性状态，每个实例都具有相同的值类型。
 *
 * `FormRecord` is very similar to {@link FormGroup}, except it can be used with a dynamic keys,
 * with controls added and removed as needed.
 *
 * `FormRecord` accepts one generic argument, which describes the type of the controls it contains.
 *
 * `FormRecord` 接受一个通用参数，该参数描述了它包含的控件的类型。
 *
 * @usageNotes
 *
 * ```
 * let numbers = new FormRecord({bill: new FormControl('415-123-456')});
 * numbers.addControl('bob', new FormControl('415-234-567'));
 * numbers.removeControl('bill');
 * ```
 * @publicApi
 */
export class FormRecord<TControl extends AbstractControl = AbstractControl> extends
    FormGroup<{[key: string]: TControl}> {}

export interface FormRecord<TControl> {
  /**
   * Registers a control with the records's list of controls.
   *
   * 使用记录的控件列表注册一个控件。
   *
   * See `FormGroup#registerControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#registerControl` 。
   *
   */
  registerControl(name: string, control: TControl): TControl;

  /**
   * Add a control to this group.
   *
   * 往组中添加一个控件。
   *
   * See `FormGroup#addControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#addControl` 。
   *
   */
  addControl(name: string, control: TControl, options?: {emitEvent?: boolean}): void;

  /**
   * Remove a control from this group.
   *
   * 从该组中移除一个控件。
   *
   * See `FormGroup#removeControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#removeControl` 。
   *
   */
  removeControl(name: string, options?: {emitEvent?: boolean}): void;

  /**
   * Replace an existing control.
   *
   * 替换现有控件。
   *
   * See `FormGroup#setControl` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#setControl` 。
   *
   */
  setControl(name: string, control: TControl, options?: {emitEvent?: boolean}): void;

  /**
   * Check whether there is an enabled control with the given name in the group.
   *
   * 检查组内是否有一个具有指定名字的已启用的控件。
   *
   * See `FormGroup#contains` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#contains` 。
   *
   */
  contains(controlName: string): boolean;

  /**
   * Sets the value of the `FormRecord`. It accepts an object that matches
   * the structure of the group, with control names as keys.
   *
   * 设置 `FormRecord` 的值。它接受一个与组结构匹配的对象，以控件名称作为键。
   *
   * See `FormGroup#setValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#setValue` 。
   *
   */
  setValue(value: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * Patches the value of the `FormRecord`. It accepts an object with control
   * names as keys, and does its best to match the values to the correct controls
   * in the group.
   *
   * 修补 `FormRecord` 的值。它接受以控件名称作为键的对象，并尽力将值与组中的正确控件进行匹配。
   *
   * See `FormGroup#patchValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#patchValue` 。
   *
   */
  patchValue(value: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * Resets the `FormRecord`, marks all descendants `pristine` and `untouched` and sets
   * the value of all descendants to null.
   *
   * 重置 `FormRecord` ，将所有后代标记为 `pristine` 和 `untouched` ，并将所有后代的值设置为 null 。
   *
   * See `FormGroup#reset` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#reset` 。
   *
   */
  reset(value?: {[key: string]: ɵValue<TControl>}, options?: {
    onlySelf?: boolean,
    emitEvent?: boolean
  }): void;

  /**
   * The aggregate value of the `FormRecord`, including any disabled controls.
   *
   * `FormRecord` 的聚合值，包括任何禁用的控件。
   *
   * See `FormGroup#getRawValue` for additional information.
   *
   * 有关其他信息，请参阅 `FormGroup#getRawValue` 。
   *
   */
  getRawValue(): {[key: string]: ɵRawValue<TControl>};
}

/**
 * @description
 * Asserts that the given control is an instance of `FormRecord`
 *
 * @publicApi
 */
export const isFormRecord = (control: unknown): control is FormRecord =>
    control instanceof FormRecord;
