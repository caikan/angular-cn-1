/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {createInjectorWithoutInjectorInstances} from '../di/create_injector';
import {Injector} from '../di/injector';
import {EnvironmentProviders, Provider, StaticProvider} from '../di/interface/provider';
import {EnvironmentInjector, getNullInjector, R3Injector} from '../di/r3_injector';
import {Type} from '../interface/type';
import {ComponentFactoryResolver as viewEngine_ComponentFactoryResolver} from '../linker/component_factory_resolver';
import {InternalNgModuleRef, NgModuleFactory as viewEngine_NgModuleFactory, NgModuleRef as viewEngine_NgModuleRef} from '../linker/ng_module_factory';
import {assertDefined} from '../util/assert';
import {stringify} from '../util/stringify';

import {ComponentFactoryResolver} from './component_ref';
import {getNgModuleDef} from './definition';
import {maybeUnwrapFn} from './util/misc_utils';

/**
 * Returns a new NgModuleRef instance based on the NgModule class and parent injector provided.
 *
 * 根据提供的 NgModule 类和父注入器返回一个新的 NgModuleRef 实例。
 *
 * @param ngModule NgModule class.
 *
 * NgModule 类。
 * @param parentInjector Optional injector instance to use as a parent for the module injector. If
 *     not provided, `NullInjector` will be used instead.
 *
 * 用作模块注入器的父级的可选注入器实例。如果未提供，将改为使用 `NullInjector` 。
 * @returns
 *
 * NgModuleRef that represents an NgModule instance.
 *
 * NgModuleRef ，表示 NgModule 实例。
 *
 * @publicApi
 */
export function createNgModule<T>(
    ngModule: Type<T>, parentInjector?: Injector): viewEngine_NgModuleRef<T> {
  return new NgModuleRef<T>(ngModule, parentInjector ?? null, []);
}

/**
 * The `createNgModule` function alias for backwards-compatibility.
 * Please avoid using it directly and use `createNgModule` instead.
 *
 * 向后兼容的 `createNgModule` 函数别名。请避免直接使用它，而改用 `createNgModule` 。
 *
 * @deprecated
 *
 * Use `createNgModule` instead.
 *
 * 改用 `createNgModule` 。
 *
 */
export const createNgModuleRef = createNgModule;
export class NgModuleRef<T> extends viewEngine_NgModuleRef<T> implements InternalNgModuleRef<T> {
  // tslint:disable-next-line:require-internal-with-underscore
  _bootstrapComponents: Type<any>[] = [];
  // tslint:disable-next-line:require-internal-with-underscore
  _r3Injector: R3Injector;
  override instance: T;
  destroyCbs: (() => void)[]|null = [];

  // When bootstrapping a module we have a dependency graph that looks like this:
  // ApplicationRef -> ComponentFactoryResolver -> NgModuleRef. The problem is that if the
  // module being resolved tries to inject the ComponentFactoryResolver, it'll create a
  // circular dependency which will result in a runtime error, because the injector doesn't
  // exist yet. We work around the issue by creating the ComponentFactoryResolver ourselves
  // and providing it, rather than letting the injector resolve it.
  override readonly componentFactoryResolver: ComponentFactoryResolver =
      new ComponentFactoryResolver(this);

  constructor(
      ngModuleType: Type<T>, public _parent: Injector|null, additionalProviders: StaticProvider[]) {
    super();
    const ngModuleDef = getNgModuleDef(ngModuleType);
    ngDevMode &&
        assertDefined(
            ngModuleDef,
            `NgModule '${stringify(ngModuleType)}' is not a subtype of 'NgModuleType'.`);

    this._bootstrapComponents = maybeUnwrapFn(ngModuleDef!.bootstrap);
    this._r3Injector = createInjectorWithoutInjectorInstances(
                           ngModuleType, _parent,
                           [
                             {provide: viewEngine_NgModuleRef, useValue: this}, {
                               provide: viewEngine_ComponentFactoryResolver,
                               useValue: this.componentFactoryResolver
                             },
                             ...additionalProviders
                           ],
                           stringify(ngModuleType), new Set(['environment'])) as R3Injector;

    // We need to resolve the injector types separately from the injector creation, because
    // the module might be trying to use this ref in its constructor for DI which will cause a
    // circular error that will eventually error out, because the injector isn't created yet.
    this._r3Injector.resolveInjectorInitializers();
    this.instance = this._r3Injector.get(ngModuleType);
  }

  override get injector(): EnvironmentInjector {
    return this._r3Injector;
  }

  override destroy(): void {
    ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
    const injector = this._r3Injector;
    !injector.destroyed && injector.destroy();
    this.destroyCbs!.forEach(fn => fn());
    this.destroyCbs = null;
  }
  override onDestroy(callback: () => void): void {
    ngDevMode && assertDefined(this.destroyCbs, 'NgModule already destroyed');
    this.destroyCbs!.push(callback);
  }
}

export class NgModuleFactory<T> extends viewEngine_NgModuleFactory<T> {
  constructor(public moduleType: Type<T>) {
    super();
  }

  override create(parentInjector: Injector|null): viewEngine_NgModuleRef<T> {
    return new NgModuleRef(this.moduleType, parentInjector, []);
  }
}

export function createNgModuleRefWithProviders<T>(
    moduleType: Type<T>, parentInjector: Injector|null,
    additionalProviders: StaticProvider[]): InternalNgModuleRef<T> {
  return new NgModuleRef(moduleType, parentInjector, additionalProviders);
}

export class EnvironmentNgModuleRefAdapter extends viewEngine_NgModuleRef<null> {
  override readonly injector: R3Injector;
  override readonly componentFactoryResolver: ComponentFactoryResolver =
      new ComponentFactoryResolver(this);
  override readonly instance = null;

  constructor(config: {
    providers: Array<Provider|EnvironmentProviders>,
    parent: EnvironmentInjector|null,
    debugName: string|null,
    runEnvironmentInitializers: boolean
  }) {
    super();
    const injector = new R3Injector(
        [
          ...config.providers,
          {provide: viewEngine_NgModuleRef, useValue: this},
          {provide: viewEngine_ComponentFactoryResolver, useValue: this.componentFactoryResolver},
        ],
        config.parent || getNullInjector(), config.debugName, new Set(['environment']));
    this.injector = injector;
    if (config.runEnvironmentInitializers) {
      injector.resolveInjectorInitializers();
    }
  }

  override destroy(): void {
    this.injector.destroy();
  }

  override onDestroy(callback: () => void): void {
    this.injector.onDestroy(callback);
  }
}

/**
 * Create a new environment injector.
 *
 * 创建一个新的环境注入器。
 *
 * Learn more about environment injectors in
 * [this guide](guide/standalone-components#environment-injectors).
 *
 * 在[本指南](guide/standalone-components#environment-injectors)中了解有关环境注入器的更多信息。
 *
 * @param providers An array of providers.
 *
 * 提供程序的数组。
 *
 * @param parent A parent environment injector.
 *
 * 父环境注入器。
 *
 * @param debugName An optional name for this injector instance, which will be used in error
 *     messages.
 *
 * 此注入器实例的可选名称，将在错误消息中使用。
 *
 * @publicApi
 */
export function createEnvironmentInjector(
    providers: Array<Provider|EnvironmentProviders>, parent: EnvironmentInjector,
    debugName: string|null = null): EnvironmentInjector {
  const adapter = new EnvironmentNgModuleRefAdapter(
      {providers, parent, debugName, runEnvironmentInitializers: true});
  return adapter.injector;
}
