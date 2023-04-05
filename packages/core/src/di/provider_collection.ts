/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {RuntimeError, RuntimeErrorCode} from '../errors';
import {Type} from '../interface/type';
import {getComponentDef} from '../render3/definition';
import {getFactoryDef} from '../render3/definition_factory';
import {throwCyclicDependencyError, throwInvalidProviderError} from '../render3/errors_di';
import {stringifyForError} from '../render3/util/stringify_utils';
import {deepForEach} from '../util/array_utils';
import {EMPTY_ARRAY} from '../util/empty';
import {getClosureSafeProperty} from '../util/property';
import {stringify} from '../util/stringify';

import {resolveForwardRef} from './forward_ref';
import {ENVIRONMENT_INITIALIZER} from './initializer_token';
import {ɵɵinject as inject} from './injector_compatibility';
import {getInjectorDef, InjectorType, InjectorTypeWithProviders} from './interface/defs';
import {ClassProvider, ConstructorProvider, EnvironmentProviders, ExistingProvider, FactoryProvider, ImportedNgModuleProviders, InternalEnvironmentProviders, isEnvironmentProviders, ModuleWithProviders, Provider, StaticClassProvider, TypeProvider, ValueProvider} from './interface/provider';
import {INJECTOR_DEF_TYPES} from './internal_tokens';

/**
 * Wrap an array of `Provider`s into `EnvironmentProviders`, preventing them from being accidentally
 * referenced in \`@Component in a component injector.
 *
 * 将 `Provider` 数组包装到 `EnvironmentProviders` 中，以防止它们在组件注入器的 \`@Component 中被意外引用。
 *
 */
export function makeEnvironmentProviders(providers: (Provider|EnvironmentProviders)[]):
    EnvironmentProviders {
  return {
    ɵproviders: providers,
  } as unknown as EnvironmentProviders;
}

/**
 * A source of providers for the `importProvidersFrom` function.
 *
 * `importProvidersFrom` 函数的提供程序来源。
 *
 * @publicApi
 */
export type ImportProvidersSource =
    Type<unknown>|ModuleWithProviders<unknown>|Array<ImportProvidersSource>;

/**
 * Collects providers from all NgModules and standalone components, including transitively imported
 * ones.
 *
 * 从所有 NgModule 和独立组件（包括可传递导入的组件）收集提供程序。
 *
 * Providers extracted via `importProvidersFrom` are only usable in an application injector or
 * another environment injector (such as a route injector). They should not be used in component
 * providers.
 *
 * 通过 `importProvidersFrom`
 * 提取的提供程序仅在应用程序注入器或另一个环境注入器（例如路由注入器）中可用。它们不应该在组件提供程序中使用。
 *
 * More information about standalone components can be found in [this
 * guide](guide/standalone-components).
 *
 * 有关独立组件的更多信息，请参阅[本指南](guide/standalone-components)。
 *
 * @usageNotes
 *
 * The results of the `importProvidersFrom` call can be used in the `bootstrapApplication` call:
 *
 * `importProvidersFrom` 调用的结果可在 `bootstrapApplication` 调用中使用：
 *
 * ```typescript
 * await bootstrapApplication(RootComponent, {
 *   providers: [
 *     importProvidersFrom(NgModuleOne, NgModuleTwo)
 *   ]
 * });
 * ```
 *
 * You can also use the `importProvidersFrom` results in the `providers` field of a route, when a
 * standalone component is used:
 *
 * 当使用独立组件时，你还可以在路由的 `providers` 字段中使用 `importProvidersFrom` 结果：
 *
 * ```typescript
 * export const ROUTES: Route[] = [
 *   {
 *     path: 'foo',
 *     providers: [
 *       importProvidersFrom(NgModuleOne, NgModuleTwo)
 *     ],
 *     component: YourStandaloneComponent
 *   }
 * ];
 * ```
 *
 * @returns
 *
 * Collected providers from the specified list of types.
 *
 * 从指定的类型列表中收集的提供程序。
 *
 * @publicApi
 */
export function importProvidersFrom(...sources: ImportProvidersSource[]): EnvironmentProviders {
  return {
    ɵproviders: internalImportProvidersFrom(true, sources),
    ɵfromNgModule: true,
  } as InternalEnvironmentProviders;
}

export function internalImportProvidersFrom(
    checkForStandaloneCmp: boolean, ...sources: ImportProvidersSource[]): Provider[] {
  const providersOut: SingleProvider[] = [];
  const dedup = new Set<Type<unknown>>();  // already seen types
  let injectorTypesWithProviders: InjectorTypeWithProviders<unknown>[]|undefined;
  deepForEach(sources, source => {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && checkForStandaloneCmp) {
      const cmpDef = getComponentDef(source);
      if (cmpDef?.standalone) {
        throw new RuntimeError(
            RuntimeErrorCode.IMPORT_PROVIDERS_FROM_STANDALONE,
            `Importing providers supports NgModule or ModuleWithProviders but got a standalone component "${
                stringifyForError(source)}"`);
      }
    }

    // Narrow `source` to access the internal type analogue for `ModuleWithProviders`.
    const internalSource = source as Type<unknown>| InjectorTypeWithProviders<unknown>;
    if (walkProviderTree(internalSource, providersOut, [], dedup)) {
      injectorTypesWithProviders ||= [];
      injectorTypesWithProviders.push(internalSource);
    }
  });
  // Collect all providers from `ModuleWithProviders` types.
  if (injectorTypesWithProviders !== undefined) {
    processInjectorTypesWithProviders(injectorTypesWithProviders, providersOut);
  }

  return providersOut;
}

/**
 * Collects all providers from the list of `ModuleWithProviders` and appends them to the provided
 * array.
 *
 * 从 `ModuleWithProviders` 列表中收集所有提供程序，并将它们附加到提供的数组。
 *
 */
function processInjectorTypesWithProviders(
    typesWithProviders: InjectorTypeWithProviders<unknown>[], providersOut: Provider[]): void {
  for (let i = 0; i < typesWithProviders.length; i++) {
    const {ngModule, providers} = typesWithProviders[i];
    deepForEachProvider(providers! as Array<Provider|InternalEnvironmentProviders>, provider => {
      ngDevMode && validateProvider(provider, providers || EMPTY_ARRAY, ngModule);
      providersOut.push(provider);
    });
  }
}

/**
 * Internal type for a single provider in a deep provider array.
 *
 * 深提供程序数组中单个提供程序的内部类型。
 *
 */
export type SingleProvider = TypeProvider|ValueProvider|ClassProvider|ConstructorProvider|
    ExistingProvider|FactoryProvider|StaticClassProvider;

/**
 * The logic visits an `InjectorType`, an `InjectorTypeWithProviders`, or a standalone
 * `ComponentType`, and all of its transitive providers and collects providers.
 *
 * 该逻辑会访问 `InjectorType`、`InjectorTypeWithProviders` 或独立 `ComponentType`
 * ，以及其所有可传递提供者和集合提供者。
 *
 * If an `InjectorTypeWithProviders` that declares providers besides the type is specified,
 * the function will return "true" to indicate that the providers of the type definition need
 * to be processed. This allows us to process providers of injector types after all imports of
 * an injector definition are processed. (following View Engine semantics: see FW-1349)
 *
 * 如果指定了除了类型之外还声明提供者的 `InjectorTypeWithProviders`
 * ，则函数将返回“true”以表明需要处理此类型定义的提供者。这允许我们在处理注入器定义的所有导入之后处理注入器类型的提供者。
 *（遵循视图引擎语义：请参阅 FW-1349）
 *
 */
export function walkProviderTree(
    container: Type<unknown>|InjectorTypeWithProviders<unknown>, providersOut: SingleProvider[],
    parents: Type<unknown>[],
    dedup: Set<Type<unknown>>): container is InjectorTypeWithProviders<unknown> {
  container = resolveForwardRef(container);
  if (!container) return false;

  // The actual type which had the definition. Usually `container`, but may be an unwrapped type
  // from `InjectorTypeWithProviders`.
  let defType: Type<unknown>|null = null;

  let injDef = getInjectorDef(container);
  const cmpDef = !injDef && getComponentDef(container);
  if (!injDef && !cmpDef) {
    // `container` is not an injector type or a component type. It might be:
    //  * An `InjectorTypeWithProviders` that wraps an injector type.
    //  * A standalone directive or pipe that got pulled in from a standalone component's
    //    dependencies.
    // Try to unwrap it as an `InjectorTypeWithProviders` first.
    const ngModule: Type<unknown>|undefined =
        (container as InjectorTypeWithProviders<any>).ngModule as Type<unknown>| undefined;
    injDef = getInjectorDef(ngModule);
    if (injDef) {
      defType = ngModule!;
    } else {
      // Not a component or injector type, so ignore it.
      return false;
    }
  } else if (cmpDef && !cmpDef.standalone) {
    return false;
  } else {
    defType = container as Type<unknown>;
  }

  // Check for circular dependencies.
  if (ngDevMode && parents.indexOf(defType) !== -1) {
    const defName = stringify(defType);
    const path = parents.map(stringify);
    throwCyclicDependencyError(defName, path);
  }

  // Check for multiple imports of the same module
  const isDuplicate = dedup.has(defType);

  if (cmpDef) {
    if (isDuplicate) {
      // This component definition has already been processed.
      return false;
    }
    dedup.add(defType);

    if (cmpDef.dependencies) {
      const deps =
          typeof cmpDef.dependencies === 'function' ? cmpDef.dependencies() : cmpDef.dependencies;
      for (const dep of deps) {
        walkProviderTree(dep, providersOut, parents, dedup);
      }
    }
  } else if (injDef) {
    // First, include providers from any imports.
    if (injDef.imports != null && !isDuplicate) {
      // Before processing defType's imports, add it to the set of parents. This way, if it ends
      // up deeply importing itself, this can be detected.
      ngDevMode && parents.push(defType);
      // Add it to the set of dedups. This way we can detect multiple imports of the same module
      dedup.add(defType);

      let importTypesWithProviders: (InjectorTypeWithProviders<any>[])|undefined;
      try {
        deepForEach(injDef.imports, imported => {
          if (walkProviderTree(imported, providersOut, parents, dedup)) {
            importTypesWithProviders ||= [];
            // If the processed import is an injector type with providers, we store it in the
            // list of import types with providers, so that we can process those afterwards.
            importTypesWithProviders.push(imported);
          }
        });
      } finally {
        // Remove it from the parents set when finished.
        ngDevMode && parents.pop();
      }

      // Imports which are declared with providers (TypeWithProviders) need to be processed
      // after all imported modules are processed. This is similar to how View Engine
      // processes/merges module imports in the metadata resolver. See: FW-1349.
      if (importTypesWithProviders !== undefined) {
        processInjectorTypesWithProviders(importTypesWithProviders, providersOut);
      }
    }

    if (!isDuplicate) {
      // Track the InjectorType and add a provider for it.
      // It's important that this is done after the def's imports.
      const factory = getFactoryDef(defType) || (() => new defType!());

      // Append extra providers to make more info available for consumers (to retrieve an injector
      // type), as well as internally (to calculate an injection scope correctly and eagerly
      // instantiate a `defType` when an injector is created).
      providersOut.push(
          // Provider to create `defType` using its factory.
          {provide: defType, useFactory: factory, deps: EMPTY_ARRAY},

          // Make this `defType` available to an internal logic that calculates injector scope.
          {provide: INJECTOR_DEF_TYPES, useValue: defType, multi: true},

          // Provider to eagerly instantiate `defType` via `ENVIRONMENT_INITIALIZER`.
          {provide: ENVIRONMENT_INITIALIZER, useValue: () => inject(defType!), multi: true}  //
      );
    }

    // Next, include providers listed on the definition itself.
    const defProviders = injDef.providers as Array<SingleProvider|InternalEnvironmentProviders>;
    if (defProviders != null && !isDuplicate) {
      const injectorType = container as InjectorType<any>;
      deepForEachProvider(defProviders, provider => {
        ngDevMode && validateProvider(provider as SingleProvider, defProviders, injectorType);
        providersOut.push(provider as SingleProvider);
      });
    }
  } else {
    // Should not happen, but just in case.
    return false;
  }

  return (
      defType !== container &&
      (container as InjectorTypeWithProviders<any>).providers !== undefined);
}

function validateProvider(
    provider: SingleProvider, providers: Array<SingleProvider|InternalEnvironmentProviders>,
    containerType: Type<unknown>): void {
  if (isTypeProvider(provider) || isValueProvider(provider) || isFactoryProvider(provider) ||
      isExistingProvider(provider)) {
    return;
  }

  // Here we expect the provider to be a `useClass` provider (by elimination).
  const classRef = resolveForwardRef(
      provider && ((provider as StaticClassProvider | ClassProvider).useClass || provider.provide));
  if (!classRef) {
    throwInvalidProviderError(containerType, providers, provider);
  }
}

function deepForEachProvider(
    providers: Array<Provider|InternalEnvironmentProviders>,
    fn: (provider: SingleProvider) => void): void {
  for (let provider of providers) {
    if (isEnvironmentProviders(provider)) {
      provider = provider.ɵproviders;
    }
    if (Array.isArray(provider)) {
      deepForEachProvider(provider, fn);
    } else {
      fn(provider);
    }
  }
}

export const USE_VALUE =
    getClosureSafeProperty<ValueProvider>({provide: String, useValue: getClosureSafeProperty});

export function isValueProvider(value: SingleProvider): value is ValueProvider {
  return value !== null && typeof value == 'object' && USE_VALUE in value;
}

export function isExistingProvider(value: SingleProvider): value is ExistingProvider {
  return !!(value && (value as ExistingProvider).useExisting);
}

export function isFactoryProvider(value: SingleProvider): value is FactoryProvider {
  return !!(value && (value as FactoryProvider).useFactory);
}

export function isTypeProvider(value: SingleProvider): value is TypeProvider {
  return typeof value === 'function';
}

export function isClassProvider(value: SingleProvider): value is ClassProvider {
  return !!(value as StaticClassProvider | ClassProvider).useClass;
}
