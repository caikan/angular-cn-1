/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Type} from '../interface/type';
import {assertLessThan} from '../util/assert';

import {ɵɵdefineInjectable} from './interface/defs';

/**
 * Creates a token that can be used in a DI Provider.
 *
 * 创建可用于 DI 提供者的令牌。
 *
 * Use an `InjectionToken` whenever the type you are injecting is not reified (does not have a
 * runtime representation) such as when injecting an interface, callable type, array or
 * parameterized type.
 *
 * 每当你要注入的类型无法确定（没有运行时表示形式）时，比如在注入接口、可调用类型、数组或参数化类型时，都应使用
 * `InjectionToken`。
 *
 * `InjectionToken` is parameterized on `T` which is the type of object which will be returned by
 * the `Injector`. This provides an additional level of type safety.
 *
 * `InjectionToken` 在 `T` 上的参数化版本，`T` 是 `Injector`
 * 返回的对象的类型。这提供了更高级别的类型安全性。
 *
 * ```
 * interface MyInterface {...}
 * const myInterface = injector.get(new InjectionToken<MyInterface>('SomeToken'));
 * // myInterface is inferred to be MyInterface.
 * ```
 *
 * When creating an `InjectionToken`, you can optionally specify a factory function which returns
 * (possibly by creating) a default value of the parameterized type `T`. This sets up the
 * `InjectionToken` using this factory as a provider as if it was defined explicitly in the
 * application's root injector. If the factory function, which takes zero arguments, needs to inject
 * dependencies, it can do so using the `inject` function.
 * As you can see in the Tree-shakable InjectionToken example below.
 *
 * 当创建 `InjectionToken` 时，可以选择指定一个工厂函数，该函数返回（可能通过创建）参数化类型 `T`
 * 的默认值。这将使用工厂型提供者设置
 * `InjectionToken`，就像它是在应用程序的根注入器中显式定义的一样。如果使用需要注入依赖项的零参数工厂函数，则可以使用
 * `inject` 函数来这样做。参见以下示例。
 *
 * Additionally, if a `factory` is specified you can also specify the `providedIn` option, which
 * overrides the above behavior and marks the token as belonging to a particular `@NgModule` (note:
 * this option is now deprecated). As mentioned above, `'root'` is the default value for
 * `providedIn`.
 *
 * 此外，如果指定了 `factory` ，你还可以指定 `providedIn`
 * 选项，它会覆盖上述行为并将标记标记为属于特定的 `@NgModule`
 * （注意：此选项现在已被弃用）。正如上面提到的， `'root'` 是 `providedIn` 的默认值。
 *
 * The `providedIn: NgModule` and `providedIn: 'any'` options are deprecated.
 *
 * @usageNotes
 *
 * ### Basic Examples
 *
 * ### 基本范例
 *
 * ### Plain InjectionToken
 *
 * ### 普通注入令牌
 *
 * {@example core/di/ts/injector_spec.ts region='InjectionToken'}
 *
 * ### Tree-shakable InjectionToken
 *
 * {@example core/di/ts/injector_spec.ts region='ShakableInjectionToken'}
 * @publicApi
 */
export class InjectionToken<T> {
  /** @internal */
  readonly ngMetadataName = 'InjectionToken';

  readonly ɵprov: unknown;

  /**
   * @param _desc   Description for the token,
   *                used only for debugging purposes,
   *                it should but does not need to be unique
   *
   * 标记的描述，仅用于调试目的，它应该但不需要是唯一的
   *
   * @param options Options for the token's usage, as described above
   *
   * 令牌使用的选项，如前所述
   *
   */
  constructor(protected _desc: string, options?: {
    providedIn?: Type<any>|'root'|'platform'|'any'|null, factory: () => T
  }) {
    this.ɵprov = undefined;
    if (typeof options == 'number') {
      (typeof ngDevMode === 'undefined' || ngDevMode) &&
          assertLessThan(options, 0, 'Only negative numbers are supported here');
      // This is a special hack to assign __NG_ELEMENT_ID__ to this instance.
      // See `InjectorMarkers`
      (this as any).__NG_ELEMENT_ID__ = options;
    } else if (options !== undefined) {
      this.ɵprov = ɵɵdefineInjectable({
        token: this,
        providedIn: options.providedIn || 'root',
        factory: options.factory,
      });
    }
  }

  /**
   * @internal
   */
  get multi(): InjectionToken<Array<T>> {
    return this as InjectionToken<Array<T>>;
  }

  toString(): string {
    return `InjectionToken ${this._desc}`;
  }
}

export interface InjectableDefToken<T> extends InjectionToken<T> {
  ɵprov: unknown;
}
