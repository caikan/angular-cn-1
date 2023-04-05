/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NormalizedUrl} from '../src/api';


/**
 * Determine whether the current environment provides all necessary APIs to run ServiceWorker tests.
 *
 * 确定当前环境是否提供了运行 ServiceWorker 测试的所有必要 API。
 *
 * @return Whether ServiceWorker tests can be run in the current environment.
 *
 * ServiceWorker 测试是否可以在当前环境中运行。
 *
 */
export function envIsSupported(): boolean {
  return typeof URL === 'function';
}

/**
 * Get a normalized representation of a URL relative to a provided base URL.
 *
 * 获取 URL 相对于提供的基本 URL 的规范化表示。
 *
 * More specifically:
 * 1. Resolve the URL relative to the provided base URL.
 * 2. If the URL is relative to the base URL, then strip the origin (and only return the path and
 *    search parts). Otherwise, return the full URL.
 *
 * 更具体地说： 1. 解析相对于所提供的基本 URL 的 URL。 2.如果 URL 是相对于基本 URL
 * 的，则删除源（并仅返回路径和搜索部分）。否则，返回完整的 URL。
 *
 * @param url The raw URL.
 *
 * 原始 URL。
 * @param relativeTo The base URL to resolve `url` relative to.
 *     (This is usually the ServiceWorker's origin or registration scope).
 *
 * 要解析 `url` 的相对基础 URL。（这通常是 ServiceWorker 的来源或注册范围）。
 * @return A normalized representation of the URL.
 *
 * URL 的规范化表示。
 */
export function normalizeUrl(url: string, relativeTo: string): NormalizedUrl {
  const {origin, path, search} = parseUrl(url, relativeTo);
  const {origin: relativeToOrigin} = parseUrl(relativeTo);

  return ((origin === relativeToOrigin) ? path + search : url) as NormalizedUrl;
}

/**
 * Parse a URL into its different parts, such as `origin`, `path` and `search`.
 *
 * 将 URL 解析为其不同的部分，例如 `origin`、`path` 和 `search` 。
 *
 */
export function parseUrl(
    url: string, relativeTo?: string): {origin: string, path: string, search: string} {
  const parsedUrl: URL = (!relativeTo ? new URL(url) : new URL(url, relativeTo));

  return {
    origin: parsedUrl.origin || `${parsedUrl.protocol}//${parsedUrl.host}`,
    path: parsedUrl.pathname,
    search: parsedUrl.search || '',
  };
}
