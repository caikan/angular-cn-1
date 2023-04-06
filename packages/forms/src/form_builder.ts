/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {inject, Injectable} from '@angular/core';

import {AsyncValidatorFn, ValidatorFn} from './directives/validators';
import {AbstractControl, AbstractControlOptions, FormHooks} from './model/abstract_model';
import {FormArray, UntypedFormArray} from './model/form_array';
import {FormControl, FormControlOptions, FormControlState, UntypedFormControl} from './model/form_control';
import {FormGroup, FormRecord, UntypedFormGroup} from './model/form_group';

function isAbstractControlOptions(options: AbstractControlOptions|{[key: string]: any}|null|
                                  undefined): options is AbstractControlOptions {
  return !!options &&
      ((options as AbstractControlOptions).asyncValidators !== undefined ||
       (options as AbstractControlOptions).validators !== undefined ||
       (options as AbstractControlOptions).updateOn !== undefined);
}

/**
 * The union of all validator types that can be accepted by a ControlConfig.
 */
type ValidatorConfig = ValidatorFn|AsyncValidatorFn|ValidatorFn[]|AsyncValidatorFn[];

/**
 * The compiler may not always be able to prove that the elements of the control config are a tuple
 * (i.e. occur in a fixed order). This slightly looser type is used for inference, to catch cases
 * where the compiler cannot prove order and position.
 *
 * For example, consider the simple case `fb.group({foo: ['bar', Validators.required]})`. The
 * compiler will infer this as an array, not as a tuple.
 */
type PermissiveControlConfig<T> = Array<T|FormControlState<T>|ValidatorConfig>;

/**
 * Helper type to allow the compiler to accept [XXXX, { updateOn: string }] as a valid shorthand
 * argument for .group()
 */
interface PermissiveAbstractControlOptions extends Omit<AbstractControlOptions, 'updateOn'> {
  updateOn?: string;
}

/**
 * ControlConfig<T> is a tuple containing a value of type T, plus optional validators and async
 * validators.
 *
 * @publicApi
 */
export type ControlConfig<T> = [T|FormControlState<T>, (ValidatorFn|(ValidatorFn[]))?, (AsyncValidatorFn|AsyncValidatorFn[])?];

// Disable clang-format to produce clearer formatting for this multiline type.
// clang-format off

/**
 * FormBuilder accepts values in various container shapes, as well as raw values.
 * Element returns the appropriate corresponding model class, given the container T.
 * The flag N, if not never, makes the resulting `FormControl` have N in its type.
 */
export type ɵElement<T, N extends null> =
  // The `extends` checks are wrapped in arrays in order to prevent TypeScript from applying type unions
  // through the distributive conditional type. This is the officially recommended solution:
  // https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
  //
  // Identify FormControl container types.
  [T] extends [FormControl<infer U>] ? FormControl<U> :
  // Or FormControl containers that are optional in their parent group.
  [T] extends [FormControl<infer U>|undefined] ? FormControl<U> :
  // FormGroup containers.
  [T] extends [FormGroup<infer U>] ? FormGroup<U> :
  // Optional FormGroup containers.
  [T] extends [FormGroup<infer U>|undefined] ? FormGroup<U> :
  // FormRecord containers.
  [T] extends [FormRecord<infer U>] ? FormRecord<U> :
  // Optional FormRecord containers.
  [T] extends [FormRecord<infer U>|undefined] ? FormRecord<U> :
  // FormArray containers.
  [T] extends [FormArray<infer U>] ? FormArray<U> :
  // Optional FormArray containers.
  [T] extends [FormArray<infer U>|undefined] ? FormArray<U> :
  // Otherwise unknown AbstractControl containers.
  [T] extends [AbstractControl<infer U>] ? AbstractControl<U> :
  // Optional AbstractControl containers.
  [T] extends [AbstractControl<infer U>|undefined] ? AbstractControl<U> :
  // FormControlState object container, which produces a nullable control.
  [T] extends [FormControlState<infer U>] ? FormControl<U|N> :
  // A ControlConfig tuple, which produces a nullable control.
  [T] extends [PermissiveControlConfig<infer U>] ? FormControl<Exclude<U, ValidatorConfig| PermissiveAbstractControlOptions>|N> :
  FormControl<T|N>;

// clang-format on

/**
 * @description
 *
 * Creates an `AbstractControl` from a user-specified configuration.
 *
 * 使用用户指定的配置创建 `AbstractControl`。
 *
 * The `FormBuilder` provides syntactic sugar that shortens creating instances of a
 * `FormControl`, `FormGroup`, or `FormArray`. It reduces the amount of boilerplate needed to
 * build complex forms.
 *
 * `FormBuilder` 提供了一个语法糖，以简化 `FormControl`、`FormGroup` 或 `FormArray` 实例的创建过程。 它会减少构建复杂表单时所需的样板代码的数量。
 *
 * @see [Reactive Forms Guide](guide/reactive-forms)
 *
 * [响应式表单](/guide/reactive-forms)
 *
 * @publicApi
 */
@Injectable({providedIn: 'root'})
export class FormBuilder {
  private useNonNullable: boolean = false;

  /**
   * @description
   *
   * Returns a FormBuilder in which automatically constructed `FormControl` elements
   * have `{nonNullable: true}` and are non-nullable.
   *
   * **Constructing non-nullable controls**
   *
   * **构建不可为空的控件**
   *
   * When constructing a control, it will be non-nullable, and will reset to its initial value.
   *
   * 构造控件时，它将是不可为空的，并将重置为其初始值。
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.control('Alex'); // FormControl<string>
   * name.reset();
   * console.log(name); // 'Alex'
   * ```
   *
   * **Constructing non-nullable groups or arrays**
   *
   * **构造不可为空的组或数组**
   *
   * When constructing a group or array, all automatically created inner controls will be
   * non-nullable, and will reset to their initial values.
   *
   * 构造组或数组时，所有自动创建的内部控件都将不可为空，并将重置为它们的初始值。
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
   * name.reset();
   * console.log(name); // {who: 'Alex'}
   * ```
   *
   * **Constructing *nullable* fields on groups or arrays**
   *
   * **在组或数组上构造可以为*空*的字段**
   *
   * It is still possible to have a nullable field. In particular, any `FormControl` which is
   * *already* constructed will not be altered. For example:
   *
   * 仍然可以有一个可以为 null 的字段。特别是，任何*已经*构建的 `FormControl` 都不会被更改。例如：
   *
   * ```ts
   * let nnfb = new FormBuilder().nonNullable;
   * // FormGroup<{who: FormControl<string|null>}>
   * let name = nnfb.group({who: new FormControl('Alex')});
   * name.reset(); console.log(name); // {who: null}
   * ```
   *
   * Because the inner control is constructed explicitly by the caller, the builder has
   * no control over how it is created, and cannot exclude the `null`.
   *
   * 因为内部控件是由调用者显式构造的，所以构建器无法控制它的创建方式，并且不能排除 `null` 。
   *
   */
  get nonNullable(): NonNullableFormBuilder {
    const nnfb = new FormBuilder();
    nnfb.useNonNullable = true;
    return nnfb as NonNullableFormBuilder;
  }

  /**
   * @description
   *
   * Constructs a new `FormGroup` instance. Accepts a single generic argument, which is an object
   * containing all the keys and corresponding inner control types.
   *
   * 构造一个新的 `FormGroup` 实例。接受单个泛型参数，该参数是包含所有键和对应的内部控件类型的对象。
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * 子控件的集合。每个子控件的键就是其注册名称。
   *
   * @param options Configuration options object for the `FormGroup`. The object should have the
   * `AbstractControlOptions` type and might contain the following fields:
   *
   * `FormGroup` 的配置选项对象。该对象应该具有 `AbstractControlOptions` 类型，并可能包含以下字段：
   *
   * * `validators`: A synchronous validator function, or an array of validator functions.
   *
   *   `validators`：一个同步验证器函数或其数组。
   *
   * * `asyncValidators`: A single async validator or array of async validator functions.
   *
   *   `asyncValidators`：一个异步验证器函数或其数组。
   *
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
   *   | submit').
   *
   *   `updateOn` ：控件应更新的事件（选项： 'change' | 'blur' | submit'）。
   *
   */
  group<T extends {}>(
      controls: T,
      options?: AbstractControlOptions|null,
      ): FormGroup<{[K in keyof T]: ɵElement<T[K], null>}>;

  /**
   * @description
   *
   * Constructs a new `FormGroup` instance.
   *
   * 构造一个新的 `FormGroup` 实例。
   *
   * @deprecated This API is not typesafe and can result in issues with Closure Compiler renaming.
   * Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
   * Note that `AbstractControlOptions` expects `validators` and `asyncValidators` to be valid
   * validators. If you have custom validators, make sure their validation function parameter is
   * `AbstractControl` and not a sub-class, such as `FormGroup`. These functions will be called
   * with an object of type `AbstractControl` and that cannot be automatically downcast to a
   * subclass, so TypeScript sees this as an error. For example, change the `(group: FormGroup) =>
   * ValidationErrors|null` signature to be `(group: AbstractControl) => ValidationErrors|null`.
   * @param controls A record of child controls. The key for each child is the name
   * under which the control is registered.
   *
   * 子控件的集合。每个子控件的键就是其注册名称。
   *
   * @param options Configuration options object for the `FormGroup`. The legacy configuration
   * object consists of:
   *
   * `FormGroup` 配置选项对象。旧的配置对象包括：
   *
   * * `validator`: A synchronous validator function, or an array of validator functions.
   *
   *   `validator`：一个同步验证器函数或其数组。
   *
   * * `asyncValidator`: A single async validator or array of async validator functions
   *   Note: the legacy format is deprecated and might be removed in one of the next major versions
   *   of Angular.
   *
   *   `asyncValidator` ：单个异步验证器或异步验证器函数数组。注意：不推荐使用旧格式，并且会在 Angular 的后面的某个主要版本中将其删除。
   *
   */
  group(
      controls: {[key: string]: any},
      options: {[key: string]: any},
      ): FormGroup;

  group(controls: {[key: string]: any}, options: AbstractControlOptions|{[key: string]:
                                                                             any}|null = null):
      FormGroup {
    const reducedControls = this._reduceControls(controls);
    let newOptions: FormControlOptions = {};
    if (isAbstractControlOptions(options)) {
      // `options` are `AbstractControlOptions`
      newOptions = options;
    } else if (options !== null) {
      // `options` are legacy form group options
      newOptions.validators = (options as any).validator;
      newOptions.asyncValidators = (options as any).asyncValidator;
    }
    return new FormGroup(reducedControls, newOptions);
  }

  /**
   * @description
   *
   * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
   * containing all the keys and corresponding inner control types.
   *
   * 构造一个新的 `FormRecord` 实例。接受单个泛型参数，该参数是包含所有键和对应的内部控件类型的对象。
   *
   * @param controls A collection of child controls. The key for each child is the name
   * under which it is registered.
   *
   * 子控件的集合。每个子控件的键就是其注册名称。
   *
   * @param options Configuration options object for the `FormRecord`. The object should have the
   * `AbstractControlOptions` type and might contain the following fields:
   *
   * `FormRecord` 的配置选项对象。该对象应该具有 `AbstractControlOptions` 类型，并可能包含以下字段：
   *
   * * `validators`: A synchronous validator function, or an array of validator functions.
   *
   *   `validators`：一个同步验证器函数或其数组。
   *
   * * `asyncValidators`: A single async validator or array of async validator functions.
   *
   *   `asyncValidators`：一个异步验证器函数或其数组。
   *
   * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
   *   | submit').
   *
   *   `updateOn` ：控件应更新的事件（选项： 'change' | 'blur' | submit'）。
   *
   */
  record<T>(controls: {[key: string]: T}, options: AbstractControlOptions|null = null):
      FormRecord<ɵElement<T, null>> {
    const reducedControls = this._reduceControls(controls);
    // Cast to `any` because the inferred types are not as specific as Element.
    return new FormRecord(reducedControls, options) as any;
  }

  /** @deprecated Use `nonNullable` instead. */
  control<T>(formState: T|FormControlState<T>, opts: FormControlOptions&{
    initialValueIsDefault: true
  }): FormControl<T>;

  control<T>(formState: T|FormControlState<T>, opts: FormControlOptions&{nonNullable: true}):
      FormControl<T>;

  /**
   * @deprecated When passing an `options` argument, the `asyncValidator` argument has no effect.
   */
  control<T>(
      formState: T|FormControlState<T>, opts: FormControlOptions,
      asyncValidator: AsyncValidatorFn|AsyncValidatorFn[]): FormControl<T|null>;

  control<T>(
      formState: T|FormControlState<T>,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl<T|null>;

  /**
   * @description
   *
   * Constructs a new `FormControl` with the given state, validators and options. Sets
   * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
   * control will be nullable. Accepts a single generic argument, which is the type  of the
   * control's value.
   *
   * 构建一个新的 `FormControl` 实例。
   *
   * @param formState Initializes the control with an initial state value, or
   * with an object that contains both a value and a disabled status.
   *
   * 使用一个初始值或一个定义了初始值和禁用状态的对象初始化该控件。
   *
   * @param validatorOrOpts A synchronous validator function, or an array of
   * such functions, or a `FormControlOptions` object that contains
   * validation functions and a validation trigger.
   * @param asyncValidator A single async validator or array of async validator
   * functions.
   *
   * 单个的异步验证器函数或其数组。
   *
   * @usageNotes
   *
   * ### Initialize a control as disabled
   *
   * ### 把控件初始化为禁用状态
   *
   * The following example returns a control with an initial value in a disabled state.
   *
   * 下面的例子返回一个带有初始值并已禁用的控件。
   *
   * <code-example path="forms/ts/formBuilder/form_builder_example.ts" region="disabled-control">
   * </code-example>
   *
   */
  control<T>(
      formState: T|FormControlState<T>,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl {
    let newOptions: FormControlOptions = {};
    if (!this.useNonNullable) {
      return new FormControl(formState, validatorOrOpts, asyncValidator);
    }
    if (isAbstractControlOptions(validatorOrOpts)) {
      // If the second argument is options, then they are copied.
      newOptions = validatorOrOpts;
    } else {
      // If the other arguments are validators, they are copied into an options object.
      newOptions.validators = validatorOrOpts;
      newOptions.asyncValidators = asyncValidator;
    }
    return new FormControl<T>(formState, {...newOptions, nonNullable: true});
  }

  /**
   * Constructs a new `FormArray` from the given array of configurations,
   * validators and options. Accepts a single generic argument, which is the type of each control
   * inside the array.
   *
   * 构造一个新的 `FormArray` 实例。
   *
   * @param controls An array of child controls or control configs. Each child control is given an
   *     index when it is registered.
   *
   * 一个子控件数组。每个子控件的 key 都是它在数组中的索引。
   *
   * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
   *     `AbstractControlOptions` object that contains
   * validation functions and a validation trigger.
   *
   * 一个同步验证器函数或其数组，或者一个包含验证函数和验证触发器的 `AbstractControlOptions` 对象。
   *
   * @param asyncValidator A single async validator or array of async validator functions.
   *
   * 单个的异步验证器函数或其数组。
   *
   */
  array<T>(
      controls: Array<T>, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormArray<ɵElement<T, null>> {
    const createdControls = controls.map(c => this._createControl(c));
    // Cast to `any` because the inferred types are not as specific as Element.
    return new FormArray(createdControls, validatorOrOpts, asyncValidator) as any;
  }

  /** @internal */
  _reduceControls<T>(controls:
                         {[k: string]: T|ControlConfig<T>|FormControlState<T>|AbstractControl<T>}):
      {[key: string]: AbstractControl} {
    const createdControls: {[key: string]: AbstractControl} = {};
    Object.keys(controls).forEach(controlName => {
      createdControls[controlName] = this._createControl(controls[controlName]);
    });
    return createdControls;
  }

  /** @internal */
  _createControl<T>(controls: T|FormControlState<T>|ControlConfig<T>|FormControl<T>|
                    AbstractControl<T>): FormControl<T>|FormControl<T|null>|AbstractControl<T> {
    if (controls instanceof FormControl) {
      return controls as FormControl<T>;
    } else if (controls instanceof AbstractControl) {  // A control; just return it
      return controls;
    } else if (Array.isArray(controls)) {  // ControlConfig Tuple
      const value: T|FormControlState<T> = controls[0];
      const validator: ValidatorFn|ValidatorFn[]|null = controls.length > 1 ? controls[1]! : null;
      const asyncValidator: AsyncValidatorFn|AsyncValidatorFn[]|null =
          controls.length > 2 ? controls[2]! : null;
      return this.control<T>(value, validator, asyncValidator);
    } else {  // T or FormControlState<T>
      return this.control<T>(controls);
    }
  }
}

/**
 * @description
 * `NonNullableFormBuilder` is similar to {@link FormBuilder}, but automatically constructed
 * {@link FormControl} elements have `{nonNullable: true}` and are non-nullable.
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'root',
  useFactory: () => inject(FormBuilder).nonNullable,
})
export abstract class NonNullableFormBuilder {
  /**
   * Similar to `FormBuilder#group`, except any implicitly constructed `FormControl`
   * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
   * that already-constructed controls will not be altered.
   *
   * 类似于 `FormBuilder#group` ，只是任何隐式构造的 `FormControl` 都将是不可空的（即它将 `nonNullable` 设置为 true）。请注意，已经构建的控件不会被更改。
   *
   */
  abstract group<T extends {}>(
      controls: T,
      options?: AbstractControlOptions|null,
      ): FormGroup<{[K in keyof T]: ɵElement<T[K], never>}>;

  /**
   * Similar to `FormBuilder#record`, except any implicitly constructed `FormControl`
   * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
   * that already-constructed controls will not be altered.
   *
   * 与 `FormBuilder#record` 类似，只是任何隐式构造的 `FormControl` 都将是不可为空的（即它将 `nonNullable` 设置为 true ）。请注意，已经构建的控件不会被更改。
   *
   */
  abstract record<T>(
      controls: {[key: string]: T},
      options?: AbstractControlOptions|null,
      ): FormRecord<ɵElement<T, never>>;

  /**
   * Similar to `FormBuilder#array`, except any implicitly constructed `FormControl`
   * will be non-nullable (i.e. it will have `nonNullable` set to true). Note
   * that already-constructed controls will not be altered.
   *
   * 类似于 `FormBuilder#array` ，只是任何隐式构造的 `FormControl` 都将是不可为空的（即它将 `nonNullable` 设置为 true）。请注意，已经构建的控件不会被更改。
   *
   */
  abstract array<T>(
      controls: Array<T>, validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormArray<ɵElement<T, never>>;

  /**
   * Similar to `FormBuilder#control`, except this overridden version of `control` forces
   * `nonNullable` to be `true`, resulting in the control always being non-nullable.
   *
   * 类似于 `FormBuilder#control` ，只是此 `control` 的覆盖版本会强制 `nonNullable` 为 `true` ，导致控件始终不可为空。
   *
   */
  abstract control<T>(
      formState: T|FormControlState<T>,
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): FormControl<T>;
}

/**
 * UntypedFormBuilder is the same as `FormBuilder`, but it provides untyped controls.
 */
@Injectable({providedIn: 'root'})
export class UntypedFormBuilder extends FormBuilder {
  /**
   * Like `FormBuilder#group`, except the resulting group is untyped.
   *
   * 与 `FormBuilder#group` 一样，只是结果组是无类型的。
   *
   */
  override group(
      controlsConfig: {[key: string]: any},
      options?: AbstractControlOptions|null,
      ): UntypedFormGroup;

  /**
   * @deprecated This API is not typesafe and can result in issues with Closure Compiler renaming.
   * Use the `FormBuilder#group` overload with `AbstractControlOptions` instead.
   */
  override group(
      controlsConfig: {[key: string]: any},
      options: {[key: string]: any},
      ): UntypedFormGroup;

  override group(
      controlsConfig: {[key: string]: any},
      options: AbstractControlOptions|{[key: string]: any}|null = null): UntypedFormGroup {
    return super.group(controlsConfig, options);
  }

  /**
   * Like `FormBuilder#control`, except the resulting control is untyped.
   *
   * 与 `FormBuilder#control` 一样，只是结果控件是无类型的。
   *
   */
  override control(
      formState: any, validatorOrOpts?: ValidatorFn|ValidatorFn[]|FormControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): UntypedFormControl {
    return super.control(formState, validatorOrOpts, asyncValidator);
  }

  /**
   * Like `FormBuilder#array`, except the resulting array is untyped.
   *
   * 与 `FormBuilder#array` 一样，只是结果数组是无类型的。
   *
   */
  override array(
      controlsConfig: any[],
      validatorOrOpts?: ValidatorFn|ValidatorFn[]|AbstractControlOptions|null,
      asyncValidator?: AsyncValidatorFn|AsyncValidatorFn[]|null): UntypedFormArray {
    return super.array(controlsConfig, validatorOrOpts, asyncValidator);
  }
}
