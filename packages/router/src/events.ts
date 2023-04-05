/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Route} from './models';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from './router_state';

/**
 * Identifies the call or event that triggered a navigation.
 *
 * 表示使用调用或是事件来触发导航。
 *
 * * 'imperative': Triggered by `router.navigateByUrl()` or `router.navigate()`.
 *
 *   'imperative'：由 `router.navigateByUrl()` 或 `router.navigate()` 触发。
 *
 * * 'popstate' : Triggered by a `popstate` event.
 *
 *   'popstate'：由 `popstate` 事件触发。
 *
 * * 'hashchange'-: Triggered by a `hashchange` event.
 *
 *   'hashchange'：由 `hashchange` 事件触发。
 *
 * @publicApi
 */
export type NavigationTrigger = 'imperative'|'popstate'|'hashchange';
export const IMPERATIVE_NAVIGATION = 'imperative';

/**
 * Identifies the type of a router event.
 *
 * 标识路由器事件的类型。
 *
 * @publicApi
 */
export const enum EventType {
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RoutesRecognized,
  ResolveStart,
  ResolveEnd,
  GuardsCheckStart,
  GuardsCheckEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ChildActivationStart,
  ChildActivationEnd,
  ActivationStart,
  ActivationEnd,
  Scroll,
  NavigationSkipped,
}

/**
 * Base for events the router goes through, as opposed to events tied to a specific
 * route. Fired one time for any given navigation.
 *
 * 路由器相关事件的（而不是关于特定路由的）基类。对于任何指定的导航，`RouterEvent` 只会触发一次。
 *
 * The following code shows how a class subscribes to router events.
 *
 * 以下代码演示了一个类是如何订阅路由器事件的。
 *
 * ```ts
 * import {Event, RouterEvent, Router} from '@angular/router';
 *
 * class MyService {
 *   constructor(public router: Router) {
 *     router.events.pipe(
 *        filter((e: Event): e is RouterEvent => e instanceof RouterEvent)
 *     ).subscribe((e: RouterEvent) => {
 *       // Do something
 *     });
 *   }
 * }
 * ```
 *
 * @see `Event`
 * @see [Router events summary](guide/router-reference#router-events)
 *
 * [路由器事件汇总](guide/router-reference#router-events)
 *
 * @publicApi
 */
export class RouterEvent {
  constructor(
      /** A unique ID that the router assigns to every router navigation. */
      public id: number,
      /** The URL that is the destination for this navigation. */
      public url: string) {}
}

/**
 * An event triggered when a navigation starts.
 *
 * 代表导航开始时触发的事件。
 *
 * @publicApi
 */
export class NavigationStart extends RouterEvent {
  readonly type = EventType.NavigationStart;

  /**
   * Identifies the call or event that triggered the navigation.
   * An `imperative` trigger is a call to `router.navigateByUrl()` or `router.navigate()`.
   *
   * 标识触发本次导航的调用或事件。`imperative` 触发器来自对 `router.navigateByUrl()` 或
   * `router.navigate()` 的调用。
   *
   * @see `NavigationEnd`
   * @see `NavigationCancel`
   * @see `NavigationError`
   */
  navigationTrigger?: NavigationTrigger;

  /**
   * The navigation state that was previously supplied to the `pushState` call,
   * when the navigation is triggered by a `popstate` event. Otherwise null.
   *
   * 当导航是由 `popstate` 事件触发的时，这里就是先前提供给 `pushState` 的导航状态，否则为 null。
   *
   * The state object is defined by `NavigationExtras`, and contains any
   * developer-defined state value, as well as a unique ID that
   * the router assigns to every router transition/navigation.
   *
   * 状态对象由 `NavigationExtras`
   * 定义，并包含任何由开发人员定义的状态值以及路由器分配给每次路由器转换/导航的唯一 ID。
   *
   * From the perspective of the router, the router never "goes back".
   * When the user clicks on the back button in the browser,
   * a new navigation ID is created.
   *
   * 从路由器的角度来看，路由器从来不会“后退”。当用户单击浏览器中的后退按钮时，将创建一个新的导航
   * ID。
   *
   * Use the ID in this previous-state object to differentiate between a newly created
   * state and one returned to by a `popstate` event, so that you can restore some
   * remembered state, such as scroll position.
   *
   * 使用此先前状态对象中的 ID 可以区分新创建的状态和由 `popstate`
   * 事件返回的状态，以便可以恢复某些记忆状态，比如滚动位置。
   *
   */
  restoredState?: {[k: string]: any, navigationId: number}|null;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      navigationTrigger: NavigationTrigger = 'imperative',
      /** @docsNotRequired */
      restoredState: {[k: string]: any, navigationId: number}|null = null) {
    super(id, url);
    this.navigationTrigger = navigationTrigger;
    this.restoredState = restoredState;
  }

  /** @docsNotRequired */
  override toString(): string {
    return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
  }
}

/**
 * An event triggered when a navigation ends successfully.
 *
 * 表示当导航成功结束时触发的事件。
 *
 * @see `NavigationStart`
 * @see `NavigationCancel`
 * @see `NavigationError`
 *
 * @publicApi
 */
export class NavigationEnd extends RouterEvent {
  readonly type = EventType.NavigationEnd;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string) {
    super(id, url);
  }

  /** @docsNotRequired */
  override toString(): string {
    return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}')`;
  }
}

/**
 * A code for the `NavigationCancel` event of the `Router` to indicate the
 * reason a navigation failed.
 *
 * `Router` 的 `NavigationCancel` 事件的代码，用于表明导航失败的原因。
 *
 * @publicApi
 */
export const enum NavigationCancellationCode {
  /**
   * A navigation failed because a guard returned a `UrlTree` to redirect.
   *
   * 导航失败，因为守卫返回了要重定向的 `UrlTree` 。
   *
   */
  Redirect,
  /**
   * A navigation failed because a more recent navigation started.
   *
   * 导航失败，因为启动了更新的导航。
   *
   */
  SupersededByNewNavigation,
  /**
   * A navigation failed because one of the resolvers completed without emiting a value.
   *
   * 导航失败，因为其中一个解析器在未发出值的情况下完成。
   *
   */
  NoDataFromResolver,
  /**
   * A navigation failed because a guard returned `false`.
   *
   * 导航失败，因为守卫返回 `false` 。
   *
   */
  GuardRejected,
}

/**
 * A code for the `NavigationSkipped` event of the `Router` to indicate the
 * reason a navigation was skipped.
 *
 * @publicApi
 */
export const enum NavigationSkippedCode {
  /**
   * A navigation was skipped because the navigation URL was the same as the current Router URL.
   */
  IgnoredSameUrlNavigation,
  /**
   * A navigation was skipped because the configured `UrlHandlingStrategy` return `false` for both
   * the current Router URL and the target of the navigation.
   *
   * @see UrlHandlingStrategy
   */
  IgnoredByUrlHandlingStrategy,
}

/**
 * An event triggered when a navigation is canceled, directly or indirectly.
 * This can happen for several reasons including when a route guard
 * returns `false` or initiates a redirect by returning a `UrlTree`.
 *
 * 直接或间接取消导航时触发的事件。当路由守卫返回了 `false`，或返回了 `UrlTree`
 * 以发起重定向时，可能会发生这种情况。
 *
 * @see `NavigationStart`
 * @see `NavigationEnd`
 * @see `NavigationError`
 *
 * @publicApi
 */
export class NavigationCancel extends RouterEvent {
  readonly type = EventType.NavigationCancel;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /**
       * A description of why the navigation was cancelled. For debug purposes only. Use `code`
       * instead for a stable cancellation reason that can be used in production.
       */
      public reason: string,
      /**
       * A code to indicate why the navigation was canceled. This cancellation code is stable for
       * the reason and can be relied on whereas the `reason` string could change and should not be
       * used in production.
       */
      readonly code?: NavigationCancellationCode) {
    super(id, url);
  }

  /** @docsNotRequired */
  override toString(): string {
    return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
  }
}

/**
 * An event triggered when a navigation is skipped.
 * This can happen for a couple reasons including onSameUrlHandling
 * is set to `ignore` and the navigation URL is not different than the
 * current state.
 *
 * @publicApi
 */
export class NavigationSkipped extends RouterEvent {
  readonly type = EventType.NavigationSkipped;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /**
       * A description of why the navigation was skipped. For debug purposes only. Use `code`
       * instead for a stable skipped reason that can be used in production.
       */
      public reason: string,
      /**
       * A code to indicate why the navigation was skipped. This code is stable for
       * the reason and can be relied on whereas the `reason` string could change and should not be
       * used in production.
       */
      readonly code?: NavigationSkippedCode) {
    super(id, url);
  }
}

/**
 * An event triggered when a navigation fails due to an unexpected error.
 *
 * 表示当导航出错时触发的事件。
 *
 * @see `NavigationStart`
 * @see `NavigationEnd`
 * @see `NavigationCancel`
 *
 * @publicApi
 */
export class NavigationError extends RouterEvent {
  readonly type = EventType.NavigationError;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public error: any,
      /**
       * The target of the navigation when the error occurred.
       *
       * Note that this can be `undefined` because an error could have occurred before the
       * `RouterStateSnapshot` was created for the navigation.
       */
      readonly target?: RouterStateSnapshot) {
    super(id, url);
  }

  /** @docsNotRequired */
  override toString(): string {
    return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
  }
}

/**
 * An event triggered when routes are recognized.
 *
 * 表示当路由被识别出来时触发的事件。
 *
 * @publicApi
 */
export class RoutesRecognized extends RouterEvent {
  readonly type = EventType.RoutesRecognized;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  /** @docsNotRequired */
  override toString(): string {
    return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * An event triggered at the start of the Guard phase of routing.
 *
 * 表示路由的守卫（`Guard`）阶段的开始。
 *
 * @see `GuardsCheckEnd`
 *
 * @publicApi
 */
export class GuardsCheckStart extends RouterEvent {
  readonly type = EventType.GuardsCheckStart;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  override toString(): string {
    return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * An event triggered at the end of the Guard phase of routing.
 *
 * 表示路由的守卫（`Guard`）阶段的结束。
 *
 * @see `GuardsCheckStart`
 *
 * @publicApi
 */
export class GuardsCheckEnd extends RouterEvent {
  readonly type = EventType.GuardsCheckEnd;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot,
      /** @docsNotRequired */
      public shouldActivate: boolean) {
    super(id, url);
  }

  override toString(): string {
    return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
  }
}

/**
 * An event triggered at the start of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段开始时触发的事件。
 *
 * Runs in the "resolve" phase whether or not there is anything to resolve.
 * In future, may change to only run when there are things to be resolved.
 *
 * 表示路由解析（`Resolve`）阶段的开始。该事件的触发时机将来可能会改变，因为它是试验性的。
 * 在当前的迭代中，它将会在 `resolve` 阶段执行，而不管有没有东西要 `resolve`。
 * 将来，这种行为可能会修改成只有当有东西要 `resolve` 时才执行。
 *
 * @see `ResolveEnd`
 *
 * @publicApi
 */
export class ResolveStart extends RouterEvent {
  readonly type = EventType.ResolveStart;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  override toString(): string {
    return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * An event triggered at the end of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段结束时触发的事件。
 *
 * @see `ResolveStart`.
 *
 * 表示路由解析（`Resolve`）阶段的结束。参见 `ResolveStart` 上的注释以了解这个试验性 API 的用法。
 *
 * @publicApi
 */
export class ResolveEnd extends RouterEvent {
  readonly type = EventType.ResolveEnd;

  constructor(
      /** @docsNotRequired */
      id: number,
      /** @docsNotRequired */
      url: string,
      /** @docsNotRequired */
      public urlAfterRedirects: string,
      /** @docsNotRequired */
      public state: RouterStateSnapshot) {
    super(id, url);
  }

  override toString(): string {
    return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${
        this.urlAfterRedirects}', state: ${this.state})`;
  }
}

/**
 * An event triggered before lazy loading a route configuration.
 *
 * 表示在惰性加载某个路由配置前触发的事件。
 *
 * @see `RouteConfigLoadEnd`
 *
 * @publicApi
 */
export class RouteConfigLoadStart {
  readonly type = EventType.RouteConfigLoadStart;

  constructor(
      /** @docsNotRequired */
      public route: Route) {}
  toString(): string {
    return `RouteConfigLoadStart(path: ${this.route.path})`;
  }
}

/**
 * An event triggered when a route has been lazy loaded.
 *
 * 表示当某个路由被惰性加载时触发的事件。
 *
 * @see `RouteConfigLoadStart`
 *
 * @publicApi
 */
export class RouteConfigLoadEnd {
  readonly type = EventType.RouteConfigLoadEnd;

  constructor(
      /** @docsNotRequired */
      public route: Route) {}
  toString(): string {
    return `RouteConfigLoadEnd(path: ${this.route.path})`;
  }
}

/**
 * An event triggered at the start of the child-activation
 * part of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段的子路由激活部分开始时触发的事件。
 *
 * @see  `ChildActivationEnd`
 * @see `ResolveStart`
 *
 * @publicApi
 */
export class ChildActivationStart {
  readonly type = EventType.ChildActivationStart;

  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ChildActivationStart(path: '${path}')`;
  }
}

/**
 * An event triggered at the end of the child-activation part
 * of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段的子路由激活部分结束时触发的事件。
 *
 * @see `ChildActivationStart`
 * @see `ResolveStart`
 * @publicApi
 */
export class ChildActivationEnd {
  readonly type = EventType.ChildActivationEnd;

  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ChildActivationEnd(path: '${path}')`;
  }
}

/**
 * An event triggered at the start of the activation part
 * of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段的激活部分开始时触发的事件。
 *
 * @see `ActivationEnd`
 * @see `ResolveStart`
 *
 * @publicApi
 */
export class ActivationStart {
  readonly type = EventType.ActivationStart;

  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ActivationStart(path: '${path}')`;
  }
}

/**
 * An event triggered at the end of the activation part
 * of the Resolve phase of routing.
 *
 * 在路由的“解析”阶段的激活部分结束时触发的事件。
 *
 * @see `ActivationStart`
 * @see `ResolveStart`
 *
 * @publicApi
 */
export class ActivationEnd {
  readonly type = EventType.ActivationEnd;

  constructor(
      /** @docsNotRequired */
      public snapshot: ActivatedRouteSnapshot) {}
  toString(): string {
    const path = this.snapshot.routeConfig && this.snapshot.routeConfig.path || '';
    return `ActivationEnd(path: '${path}')`;
  }
}

/**
 * An event triggered by scrolling.
 *
 * 表示一个滚动事件。
 *
 * @publicApi
 */
export class Scroll {
  readonly type = EventType.Scroll;

  constructor(
      /** @docsNotRequired */
      readonly routerEvent: NavigationEnd|NavigationSkipped,

      /** @docsNotRequired */
      readonly position: [number, number]|null,

      /** @docsNotRequired */
      readonly anchor: string|null) {}

  toString(): string {
    const pos = this.position ? `${this.position[0]}, ${this.position[1]}` : null;
    return `Scroll(anchor: '${this.anchor}', position: '${pos}')`;
  }
}

/**
 * Router events that allow you to track the lifecycle of the router.
 *
 * 路由器事件能让你跟踪路由器的生命周期。
 *
 * The events occur in the following sequence:
 *
 * 这些事件按以下顺序发生：
 *
 * * [NavigationStart](api/router/NavigationStart): Navigation starts.
 *
 *   [NavigationStart](api/router/NavigationStart)：导航开始。
 *
 * * [RouteConfigLoadStart](api/router/RouteConfigLoadStart): Before
 *   the router [lazy loads](/guide/router#lazy-loading) a route configuration.
 *
 *   [RouteConfigLoadStart](api/router/RouteConfigLoadStart)
 *   ：在路由器[惰性加载](/guide/router#lazy-loading)路由配置之前。
 *
 * * [RouteConfigLoadEnd](api/router/RouteConfigLoadEnd): After a route has been lazy loaded.
 *
 *   [RouteConfigLoadEnd](api/router/RouteConfigLoadEnd) ：惰性加载路由后。
 *
 * * [RoutesRecognized](api/router/RoutesRecognized): When the router parses the URL
 *   and the routes are recognized.
 *
 *   [RoutesRecognized](api/router/RoutesRecognized) ：路由器解析 URL 并识别出路由时。
 *
 * * [GuardsCheckStart](api/router/GuardsCheckStart): When the router begins the *guards*
 *   phase of routing.
 *
 *   [GuardsCheckStart](api/router/GuardsCheckStart) ：当路由器开始*路由的守卫*阶段时。
 *
 * * [ChildActivationStart](api/router/ChildActivationStart): When the router
 *   begins activating a route's children.
 *
 *   [ChildActivationStart](api/router/ChildActivationStart) ：当路由器开始激活子路由时。
 *
 * * [ActivationStart](api/router/ActivationStart): When the router begins activating a route.
 *
 *   [ActivationStart](api/router/ActivationStart) ：路由器开始激活路由时。
 *
 * * [GuardsCheckEnd](api/router/GuardsCheckEnd): When the router finishes the *guards*
 *   phase of routing successfully.
 *
 *   [GuardsCheckEnd](api/router/GuardsCheckEnd) ：当路由器*成功完成路由的保护*阶段时。
 *
 * * [ResolveStart](api/router/ResolveStart): When the router begins the *resolve*
 *   phase of routing.
 *
 *   [ResolveStart](api/router/ResolveStart) ：路由器开始*路由的解析*阶段时。
 *
 * * [ResolveEnd](api/router/ResolveEnd): When the router finishes the *resolve*
 *   phase of routing successfully.
 *
 *   [ResolveEnd](api/router/ResolveEnd) ：当路由器*成功完成路由的解析*阶段时。
 *
 * * [ChildActivationEnd](api/router/ChildActivationEnd): When the router finishes
 *   activating a route's children.
 *
 *   [ChildActivationEnd](api/router/ChildActivationEnd) ：当路由器完成激活子路由时。
 *
 * * [ActivationEnd](api/router/ActivationEnd): When the router finishes activating a route.
 *
 *   [ActivationEnd](api/router/ActivationEnd) ：路由器完成路由激活后。
 *
 * * [NavigationEnd](api/router/NavigationEnd): When navigation ends successfully.
 *
 *   [NavigationEnd](api/router/NavigationEnd) ：导航成功结束时。
 *
 * * [NavigationCancel](api/router/NavigationCancel): When navigation is canceled.
 *
 *   [NavigationCancel](api/router/NavigationCancel) ：取消导航时。
 *
 * * [NavigationError](api/router/NavigationError): When navigation fails
 *   due to an unexpected error.
 *
 *   [NavigationError](api/router/NavigationError) ：由于意外错误导致导航失败时。
 *
 * * [Scroll](api/router/Scroll): When the user scrolls.
 *
 *   [Scroll](api/router/Scroll)：用户滚动时。
 *
 * @publicApi
 */
export type Event = NavigationStart|NavigationEnd|NavigationCancel|NavigationError|RoutesRecognized|
    GuardsCheckStart|GuardsCheckEnd|RouteConfigLoadStart|RouteConfigLoadEnd|ChildActivationStart|
    ChildActivationEnd|ActivationStart|ActivationEnd|Scroll|ResolveStart|ResolveEnd|
    NavigationSkipped;

export function stringifyEvent(routerEvent: Event): string {
  switch (routerEvent.type) {
    case EventType.ActivationEnd:
      return `ActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ''}')`;
    case EventType.ActivationStart:
      return `ActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ''}')`;
    case EventType.ChildActivationEnd:
      return `ChildActivationEnd(path: '${routerEvent.snapshot.routeConfig?.path || ''}')`;
    case EventType.ChildActivationStart:
      return `ChildActivationStart(path: '${routerEvent.snapshot.routeConfig?.path || ''}')`;
    case EventType.GuardsCheckEnd:
      return `GuardsCheckEnd(id: ${routerEvent.id}, url: '${
          routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${
          routerEvent.state}, shouldActivate: ${routerEvent.shouldActivate})`;
    case EventType.GuardsCheckStart:
      return `GuardsCheckStart(id: ${routerEvent.id}, url: '${
          routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${
          routerEvent.state})`;
    case EventType.NavigationCancel:
      return `NavigationCancel(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.NavigationSkipped:
      return `NavigationSkipped(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.NavigationEnd:
      return `NavigationEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${
          routerEvent.urlAfterRedirects}')`;
    case EventType.NavigationError:
      return `NavigationError(id: ${routerEvent.id}, url: '${routerEvent.url}', error: ${
          routerEvent.error})`;
    case EventType.NavigationStart:
      return `NavigationStart(id: ${routerEvent.id}, url: '${routerEvent.url}')`;
    case EventType.ResolveEnd:
      return `ResolveEnd(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${
          routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.ResolveStart:
      return `ResolveStart(id: ${routerEvent.id}, url: '${routerEvent.url}', urlAfterRedirects: '${
          routerEvent.urlAfterRedirects}', state: ${routerEvent.state})`;
    case EventType.RouteConfigLoadEnd:
      return `RouteConfigLoadEnd(path: ${routerEvent.route.path})`;
    case EventType.RouteConfigLoadStart:
      return `RouteConfigLoadStart(path: ${routerEvent.route.path})`;
    case EventType.RoutesRecognized:
      return `RoutesRecognized(id: ${routerEvent.id}, url: '${
          routerEvent.url}', urlAfterRedirects: '${routerEvent.urlAfterRedirects}', state: ${
          routerEvent.state})`;
    case EventType.Scroll:
      const pos =
          routerEvent.position ? `${routerEvent.position[0]}, ${routerEvent.position[1]}` : null;
      return `Scroll(anchor: '${routerEvent.anchor}', position: '${pos}')`;
  }
}
