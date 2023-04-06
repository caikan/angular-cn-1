/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Inject, Injectable, InjectionToken, ɵɵinject} from '@angular/core';

import {getDOM} from '../dom_adapter';
import {DOCUMENT} from '../dom_tokens';

/**
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 *
 * 此类不应由应用程序开发人员直接使用。而应使用 {@link Location}。
 *
 * `PlatformLocation` encapsulates all calls to DOM APIs, which allows the Router to be
 * platform-agnostic.
 * This means that we can have different implementation of `PlatformLocation` for the different
 * platforms that Angular supports. For example, `@angular/platform-browser` provides an
 * implementation specific to the browser environment, while `@angular/platform-server` provides
 * one suitable for use with server-side rendering.
 *
 * `PlatformLocation` 封装了对 DOM API 的所有调用，这可以让路由器与平台无关。这意味着我们可以为
 * Angular 支持的不同平台提供 `PlatformLocation` 的不同实现。比如，`@angular/platform-browser`
 * 提供了特定于浏览器环境的实现，而 `@angular/platform-server`
 * 提供了适合与服务器端渲染一起使用的实现。
 *
 * The `PlatformLocation` class is used directly by all implementations of {@link LocationStrategy}
 * when they need to interact with the DOM APIs like pushState, popState, etc.
 *
 * {@link LocationStrategy} 的所有实现在需要与 DOM API（比如 pushState，popState
 * 等）进行交互时，都直接使用 `PlatformLocation`
 *
 * {@link LocationStrategy} in turn is used by the {@link Location} service which is used directly
 * by the {@link Router} in order to navigate between routes. Since all interactions between {@link
 * Router} /
 * {@link Location} / {@link LocationStrategy} and DOM APIs flow through the `PlatformLocation`
 * class, they are all platform-agnostic.
 *
 * {@link LocationStrategy} 由 {@link Router} 直接使用的 {@link Location}
 * 服务使用，以便在路由之间导航。由于 {@link Router} / {@link Location} / {@link LocationStrategy}与
 * DOM API 之间的所有交互都是通过 `PlatformLocation` 类进行的，因此它们都是与平台无关的。
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'platform',
  // See #23917
  useFactory: useBrowserPlatformLocation
})
export abstract class PlatformLocation {
  abstract getBaseHrefFromDOM(): string;
  abstract getState(): unknown;
  /**
   * Returns a function that, when executed, removes the `popstate` event handler.
   *
   * 返回一个函数，该函数在执行时会删除 `popstate` 事件处理程序。
   *
   */
  abstract onPopState(fn: LocationChangeListener): VoidFunction;
  /**
   * Returns a function that, when executed, removes the `hashchange` event handler.
   *
   * 返回一个函数，该函数在执行时会删除 `hashchange` 事件处理程序。
   *
   */
  abstract onHashChange(fn: LocationChangeListener): VoidFunction;

  abstract get href(): string;
  abstract get protocol(): string;
  abstract get hostname(): string;
  abstract get port(): string;
  abstract get pathname(): string;
  abstract get search(): string;
  abstract get hash(): string;

  abstract replaceState(state: any, title: string, url: string): void;

  abstract pushState(state: any, title: string, url: string): void;

  abstract forward(): void;

  abstract back(): void;

  historyGo?(relativePosition: number): void {
    throw new Error('Not implemented');
  }
}

export function useBrowserPlatformLocation() {
  return ɵɵinject(BrowserPlatformLocation);
}

/**
 * @description
 *
 * Indicates when a location is initialized.
 *
 * 指示何时初始化 location。
 *
 * @publicApi
 */
export const LOCATION_INITIALIZED = new InjectionToken<Promise<any>>('Location Initialized');

/**
 * @description
 *
 * A serializable version of the event from `onPopState` or `onHashChange`
 *
 * 来自 `onPopState` 或 `onHashChange` 的事件的可序列化版本
 *
 * @publicApi
 */
export interface LocationChangeEvent {
  type: string;
  state: any;
}

/**
 * @publicApi
 */
export interface LocationChangeListener {
  (event: LocationChangeEvent): any;
}



/**
 * `PlatformLocation` encapsulates all of the direct calls to platform APIs.
 * This class should not be used directly by an application developer. Instead, use
 * {@link Location}.
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'platform',
  // See #23917
  useFactory: createBrowserPlatformLocation,
})
export class BrowserPlatformLocation extends PlatformLocation {
  private _location: Location;
  private _history: History;

  constructor(@Inject(DOCUMENT) private _doc: any) {
    super();
    this._location = window.location;
    this._history = window.history;
  }

  override getBaseHrefFromDOM(): string {
    return getDOM().getBaseHref(this._doc)!;
  }

  override onPopState(fn: LocationChangeListener): VoidFunction {
    const window = getDOM().getGlobalEventTarget(this._doc, 'window');
    window.addEventListener('popstate', fn, false);
    return () => window.removeEventListener('popstate', fn);
  }

  override onHashChange(fn: LocationChangeListener): VoidFunction {
    const window = getDOM().getGlobalEventTarget(this._doc, 'window');
    window.addEventListener('hashchange', fn, false);
    return () => window.removeEventListener('hashchange', fn);
  }

  override get href(): string {
    return this._location.href;
  }
  override get protocol(): string {
    return this._location.protocol;
  }
  override get hostname(): string {
    return this._location.hostname;
  }
  override get port(): string {
    return this._location.port;
  }
  override get pathname(): string {
    return this._location.pathname;
  }
  override get search(): string {
    return this._location.search;
  }
  override get hash(): string {
    return this._location.hash;
  }
  override set pathname(newPath: string) {
    this._location.pathname = newPath;
  }

  override pushState(state: any, title: string, url: string): void {
    if (supportsState()) {
      this._history.pushState(state, title, url);
    } else {
      this._location.hash = url;
    }
  }

  override replaceState(state: any, title: string, url: string): void {
    if (supportsState()) {
      this._history.replaceState(state, title, url);
    } else {
      this._location.hash = url;
    }
  }

  override forward(): void {
    this._history.forward();
  }

  override back(): void {
    this._history.back();
  }

  override historyGo(relativePosition: number = 0): void {
    this._history.go(relativePosition);
  }

  override getState(): unknown {
    return this._history.state;
  }
}

export function supportsState(): boolean {
  return !!window.history.pushState;
}
export function createBrowserPlatformLocation() {
  return new BrowserPlatformLocation(ɵɵinject(DOCUMENT));
}
