/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CommonModule, DOCUMENT, XhrFactory, ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID} from '@angular/common';
import {APP_ID, ApplicationConfig as ApplicationConfigFromCore, ApplicationModule, ApplicationRef, createPlatformFactory, ErrorHandler, Inject, InjectionToken, ModuleWithProviders, NgModule, NgZone, Optional, PLATFORM_ID, PLATFORM_INITIALIZER, platformCore, PlatformRef, Provider, RendererFactory2, SkipSelf, StaticProvider, Testability, TestabilityRegistry, Type, ɵINJECTOR_SCOPE as INJECTOR_SCOPE, ɵinternalCreateApplication as internalCreateApplication, ɵsetDocument, ɵTESTABILITY as TESTABILITY, ɵTESTABILITY_GETTER as TESTABILITY_GETTER} from '@angular/core';

import {BrowserDomAdapter} from './browser/browser_adapter';
import {BrowserGetTestability} from './browser/testability';
import {BrowserXhr} from './browser/xhr';
import {DomRendererFactory2} from './dom/dom_renderer';
import {DomEventsPlugin} from './dom/events/dom_events';
import {EVENT_MANAGER_PLUGINS, EventManager} from './dom/events/event_manager';
import {KeyEventsPlugin} from './dom/events/key_events';
import {SharedStylesHost} from './dom/shared_styles_host';


/**
 * Set of config options available during the application bootstrap operation.
 *
 * 在引导操作期间通过 `bootstrapApplication` 调用可用的一组配置选项。
 *
 * @publicApi
 * @deprecated
 * `ApplicationConfig` has moved, please import `ApplicationConfig` from `@angular/core` instead.
 */
// The below is a workaround to add a deprecated message.
type ApplicationConfig = ApplicationConfigFromCore;
export {ApplicationConfig};

/**
   * Bootstraps an instance of an Angular application and renders a standalone component as the
   * application's root component. More information about standalone components can be found in [this
   * guide](guide/standalone-components).
   *
   * 引导 Angular 应用程序的实例，并将独立组件呈现为应用程序的根组件。有关独立组件的更多信息，请参阅[本指南](guide/standalone-components)。
   *
   * @usageNotes
   *
   * The root component passed into this function *must* be a standalone one (should have the
   * `standalone: true` flag in the `@Component` decorator config).
   *
   * 传递给此函数的根组件*必须*是独立的（在 `@Component` 装饰器配置中应该有 `standalone: true` 标志）。
   *
   * ```typescript
   * @Component({
   *   standalone: true,
   *   template: 'Hello world!'
   * })
   * class RootComponent {}
   *
   * const appRef: ApplicationRef = await bootstrapApplication(RootComponent);
   * ```
   *
   * You can add the list of providers that should be available in the application injector by
   * specifying the `providers` field in an object passed as the second argument:
   *
   * 你可以通过在作为第二个参数传递的对象中指定 `providers` 字段来添加应用程序注入器中应该可用的提供者列表：
   *
   * ```typescript
   * await bootstrapApplication(RootComponent, {
   *   providers: [
   *     {provide: BACKEND_URL, useValue: 'https://yourdomain.com/api'}
   *   ]
   * });
   * ```
   *
   * The `importProvidersFrom` helper method can be used to collect all providers from any
   * existing NgModule (and transitively from all NgModules that it imports):
   *
   * `importProvidersFrom` 帮助器方法可用于从任何现有的 NgModule （并且从它导入的所有 NgModule 中传递）收集所有提供者：
   *
   * ```typescript
   * await bootstrapApplication(RootComponent, {
   *   providers: [
   *     importProvidersFrom(SomeNgModule)
   *   ]
   * });
   * ```
   *
   * Note: the `bootstrapApplication` method doesn't include [Testability](api/core/Testability) by
   * default. You can add [Testability](api/core/Testability) by getting the list of necessary
   * providers using `provideProtractorTestingSupport()` function and adding them into the `providers`
   * array, for example:
   *
   * 注意：默认情况下， `bootstrapApplication` 方法不包含[Testability](api/core/Testability) 。你可以通过使用 `provideProtractorTestingSupport()` 函数获取必要的提供程序列表并将它们添加到 `providers` 数组中来添加[Testability](api/core/Testability) ，例如：
   *
   * ```typescript
   * import {provideProtractorTestingSupport} from '@angular/platform-browser';
   *
   * await bootstrapApplication(RootComponent, {providers: [provideProtractorTestingSupport()]});
   * ```
   *
   * @param rootComponent A reference to a standalone component that should be rendered.
   *
   * 对应该渲染的独立组件的引用。
   *
   * @param options Extra configuration for the bootstrap operation, see `ApplicationConfig` for
   *     additional info.
   *
   * 可选值。默认值为 `undefined`。
   *
   * @returns A promise that returns an `ApplicationRef` instance once resolved.
   * @publicApi
   */
export function bootstrapApplication(
    rootComponent: Type<unknown>, options?: ApplicationConfig): Promise<ApplicationRef> {
  return internalCreateApplication({rootComponent, ...createProvidersConfig(options)});
}

/**
 * Create an instance of an Angular application without bootstrapping any components. This is useful
 * for the situation where one wants to decouple application environment creation (a platform and
 * associated injectors) from rendering components on a screen. Components can be subsequently
 * bootstrapped on the returned `ApplicationRef`.
 *
 * 在不引导任何组件的情况下创建 Angular 应用程序的实例。这对于希望将应用程序环境创建（平台和关联的注入器）与屏幕上的渲染组件解耦的情况很有用。随后可以在返回的 `ApplicationRef` 上引导组件。
 *
 * @param options Extra configuration for the application environment, see `ApplicationConfig` for
 *     additional info.
 *
 * 可选值。默认值为 `undefined`。
 *
 * @returns A promise that returns an `ApplicationRef` instance once resolved.
 * @publicApi
 */
export function createApplication(options?: ApplicationConfig) {
  return internalCreateApplication(createProvidersConfig(options));
}

function createProvidersConfig(options?: ApplicationConfig) {
  return {
    appProviders: [
      ...BROWSER_MODULE_PROVIDERS,
      ...(options?.providers ?? []),
    ],
    platformProviders: INTERNAL_BROWSER_PLATFORM_PROVIDERS
  };
}

/**
 * Returns a set of providers required to setup [Testability](api/core/Testability) for an
 * application bootstrapped using the `bootstrapApplication` function. The set of providers is
 * needed to support testing an application with Protractor (which relies on the Testability APIs
 * to be present).
 *
 * 返回使用 `bootstrapApplication` 函数引导的应用程序设置[Testability](api/core/Testability)所需的一组提供程序。需要这组提供者来支持使用 Protractor（依赖于存在的 Testability API）测试应用程序。
 *
 * @returns An array of providers required to setup Testability for an application and make it
 *     available for testing using Protractor.
 * @publicApi
 */
export function provideProtractorTestingSupport(): Provider[] {
  // Return a copy to prevent changes to the original array in case any in-place
  // alterations are performed to the `provideProtractorTestingSupport` call results in app
  // code.
  return [...TESTABILITY_PROVIDERS];
}

export function initDomAdapter() {
  BrowserDomAdapter.makeCurrent();
}

export function errorHandler(): ErrorHandler {
  return new ErrorHandler();
}

export function _document(): any {
  // Tell ivy about the global document
  ɵsetDocument(document);
  return document;
}

export const INTERNAL_BROWSER_PLATFORM_PROVIDERS: StaticProvider[] = [
  {provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID},
  {provide: PLATFORM_INITIALIZER, useValue: initDomAdapter, multi: true},
  {provide: DOCUMENT, useFactory: _document, deps: []},
];

/**
 * A factory function that returns a `PlatformRef` instance associated with browser service
 * providers.
 *
 * 一个工厂函数，它返回与浏览器服务提供者关联的 `PlatformRef` 实例。
 *
 * @publicApi
 */
export const platformBrowser: (extraProviders?: StaticProvider[]) => PlatformRef =
    createPlatformFactory(platformCore, 'browser', INTERNAL_BROWSER_PLATFORM_PROVIDERS);

/**
 * Internal marker to signal whether providers from the `BrowserModule` are already present in DI.
 * This is needed to avoid loading `BrowserModule` providers twice. We can't rely on the
 * `BrowserModule` presence itself, since the standalone-based bootstrap just imports
 * `BrowserModule` providers without referencing the module itself.
 */
const BROWSER_MODULE_PROVIDERS_MARKER = new InjectionToken(
    (typeof ngDevMode === 'undefined' || ngDevMode) ? 'BrowserModule Providers Marker' : '');

const TESTABILITY_PROVIDERS = [
  {
    provide: TESTABILITY_GETTER,
    useClass: BrowserGetTestability,
    deps: [],
  },
  {
    provide: TESTABILITY,
    useClass: Testability,
    deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
  },
  {
    provide: Testability,  // Also provide as `Testability` for backwards-compatibility.
    useClass: Testability,
    deps: [NgZone, TestabilityRegistry, TESTABILITY_GETTER]
  }
];

const BROWSER_MODULE_PROVIDERS: Provider[] = [
  {provide: INJECTOR_SCOPE, useValue: 'root'},
  {provide: ErrorHandler, useFactory: errorHandler, deps: []}, {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: DomEventsPlugin,
    multi: true,
    deps: [DOCUMENT, NgZone, PLATFORM_ID]
  },
  {provide: EVENT_MANAGER_PLUGINS, useClass: KeyEventsPlugin, multi: true, deps: [DOCUMENT]},
  DomRendererFactory2, SharedStylesHost, EventManager,
  {provide: RendererFactory2, useExisting: DomRendererFactory2},
  {provide: XhrFactory, useClass: BrowserXhr, deps: []},
  (typeof ngDevMode === 'undefined' || ngDevMode) ?
      {provide: BROWSER_MODULE_PROVIDERS_MARKER, useValue: true} :
      []
];

/**
 * Exports required infrastructure for all Angular apps.
 * Included by default in all Angular apps created with the CLI
 * `new` command.
 * Re-exports `CommonModule` and `ApplicationModule`, making their
 * exports and providers available to all apps.
 *
 * 导出所有 Angular 应用都需要的基础设施。默认包含在用 CLI 的 `new` 命令创建的所有 Angular 应用中。 它二次导出了 `CommonModule` 和 `ApplicationModule`，以便它们的导出物和提供者能用于所有应用中。
 *
 * @publicApi
 */
@NgModule({
  providers: [...BROWSER_MODULE_PROVIDERS, ...TESTABILITY_PROVIDERS],
  exports: [CommonModule, ApplicationModule],
})
export class BrowserModule {
  constructor(@Optional() @SkipSelf() @Inject(BROWSER_MODULE_PROVIDERS_MARKER)
              providersAlreadyPresent: boolean|null) {
    if ((typeof ngDevMode === 'undefined' || ngDevMode) && providersAlreadyPresent) {
      throw new Error(
          `Providers from the \`BrowserModule\` have already been loaded. If you need access ` +
          `to common directives such as NgIf and NgFor, import the \`CommonModule\` instead.`);
    }
  }

  /**
   * Configures a browser-based app to transition from a server-rendered app, if
   * one is present on the page.
   *
   * 配置基于浏览器的应用，使其可以从当前页面上的服务端渲染（SSR）应用过渡而来。 指定的参数必须包含一个应用 id，在客户端应用和服务端应用之间它必须一致。
   *
   * @param params An object containing an identifier for the app to transition.
   * The ID must match between the client and server versions of the app.
   *
   * 包含要迁移的应用 id 的对象。在应用的客户端版本和服务端版本中这个 ID 必须匹配。
   *
   * @returns The reconfigured `BrowserModule` to import into the app's root `AppModule`.
   * @deprecated Use {@link APP_ID} instead to set the application ID.
   */
  static withServerTransition(params: {appId: string}): ModuleWithProviders<BrowserModule> {
    return {
      ngModule: BrowserModule,
      providers: [
        {provide: APP_ID, useValue: params.appId},
      ],
    };
  }
}
