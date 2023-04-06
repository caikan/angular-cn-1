/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Route, UrlMatchResult} from './models';
import {UrlSegment, UrlSegmentGroup} from './url_tree';


/**
 * The primary routing outlet.
 *
 * 主路由出口的名字。
 *
 * @publicApi
 */
export const PRIMARY_OUTLET = 'primary';

/**
 * A private symbol used to store the value of `Route.title` inside the `Route.data` if it is a
 * static string or `Route.resolve` if anything else. This allows us to reuse the existing route
 * data/resolvers to support the title feature without new instrumentation in the `Router` pipeline.
 *
 * 一个私有符号，用于将 `Route.title` 的值存储在 `Route.data` 中（如果是静态字符串），或者 `Route.resolve` 如果是其他）。这允许我们重用现有的路由数据/解析器来支持标题特性，而无需在 `Router` 管道中进行新的检测。
 *
 */
export const RouteTitleKey = Symbol('RouteTitle');

/**
 * A collection of matrix and query URL parameters.
 *
 * 矩阵和查询 URL 参数的集合。
 *
 * @see `convertToParamMap()`
 * @see `ParamMap`
 *
 * @publicApi
 */
export type Params = {
  [key: string]: any;
};

/**
 * A map that provides access to the required and optional parameters
 * specific to a route.
 * The map supports retrieving a single value with `get()`
 * or multiple values with `getAll()`.
 *
 * 提供访问特定于路由的必需和可选参数的映射表。该映射表支持使用 `get()` 检索单个值或使用 `getAll()`
 * 检索多个值。
 *
 * @see [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
 *
 * @publicApi
 */
export interface ParamMap {
  /**
   * Reports whether the map contains a given parameter.
   *
   * 报告此映射表是否包含给定的参数。
   *
   * @param name The parameter name.
   *
   * 参数名称。
   *
   * @returns True if the map contains the given parameter, false otherwise.
   *
   * 如果此映射表包含给定参数，则为 true，否则为 false。
   *
   */
  has(name: string): boolean;
  /**
   * Retrieves a single value for a parameter.
   *
   * 检索参数的单个值。
   *
   * @param name The parameter name.
   *
   * 参数名称。
   *
   * @return The parameter's single value,
   * or the first value if the parameter has multiple values,
   * or `null` when there is no such parameter.
   *
   * 参数的单个值；如果参数具有多个值，则返回第一个值；如果没有这样的参数，则返回 `null`。
   *
   */
  get(name: string): string|null;
  /**
   * Retrieves multiple values for a parameter.
   *
   * 检索参数的多个值。
   *
   * @param name The parameter name.
   *
   * 参数名称。
   *
   * @return An array containing one or more values,
   * or an empty array if there is no such parameter.
   *
   * 包含一个或多个值的数组；如果没有这样的参数，则为空数组。
   *
   */
  getAll(name: string): string[];

  /**
   * Names of the parameters in the map.
   *
   * 映射表中参数的名称。
   *
   */
  readonly keys: string[];
}

class ParamsAsMap implements ParamMap {
  private params: Params;

  constructor(params: Params) {
    this.params = params || {};
  }

  has(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.params, name);
  }

  get(name: string): string|null {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v[0] : v;
    }

    return null;
  }

  getAll(name: string): string[] {
    if (this.has(name)) {
      const v = this.params[name];
      return Array.isArray(v) ? v : [v];
    }

    return [];
  }

  get keys(): string[] {
    return Object.keys(this.params);
  }
}

/**
 * Converts a `Params` instance to a `ParamMap`.
 *
 * 将 `Params` 实例转换为 `ParamMap` 。
 *
 * @param params The instance to convert.
 *
 * 要转换的实例。
 *
 * @returns The new map instance.
 *
 * 新的 `ParamMap` 实例。
 *
 * @publicApi
 */
export function convertToParamMap(params: Params): ParamMap {
  return new ParamsAsMap(params);
}

/**
 * Matches the route configuration (`route`) against the actual URL (`segments`).
 *
 * 将路由配置 ( `route` ) 与实际 URL ( `segments` ) 匹配。
 *
 * When no matcher is defined on a `Route`, this is the matcher used by the Router by default.
 *
 * 当 `Route` 上没有定义匹配器时，这是 Router 默认使用的匹配器。
 *
 * @param segments The remaining unmatched segments in the current navigation
 *
 * 当前导航中剩余的不匹配段
 *
 * @param segmentGroup The current segment group being matched
 *
 * 正在匹配的当前段组
 *
 * @param route The `Route` to match against.
 *
 * 要匹配的 `Route` 。
 *
 * @see UrlMatchResult
 * @see Route
 *
 * 路由
 *
 * @returns
 *
 * The resulting match information or `null` if the `route` should not match.
 *
 * 结果的匹配信息，如果 `route` 不应该匹配，则为 `null` 。
 *
 * @publicApi
 */
export function defaultUrlMatcher(
    segments: UrlSegment[], segmentGroup: UrlSegmentGroup, route: Route): UrlMatchResult|null {
  const parts = route.path!.split('/');

  if (parts.length > segments.length) {
    // The actual URL is shorter than the config, no match
    return null;
  }

  if (route.pathMatch === 'full' &&
      (segmentGroup.hasChildren() || parts.length < segments.length)) {
    // The config is longer than the actual URL but we are looking for a full match, return null
    return null;
  }

  const posParams: {[key: string]: UrlSegment} = {};

  // Check each config part against the actual URL
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    const segment = segments[index];
    const isParameter = part.startsWith(':');
    if (isParameter) {
      posParams[part.substring(1)] = segment;
    } else if (part !== segment.path) {
      // The actual URL part does not match the config, no match
      return null;
    }
  }

  return {consumed: segments.slice(0, parts.length), posParams};
}
