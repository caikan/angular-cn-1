/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * A codec for encoding and decoding URL parts.
 *
 * 用于编码和解码 URL 部分的编解码器。
 *
 * @publicApi
 **/
export abstract class UrlCodec {
  /**
   * Encodes the path from the provided string
   *
   * 解码所提供的字符串的路径
   *
   * @param path The path string
   *
   * 路径字符串
   *
   */
  abstract encodePath(path: string): string;

  /**
   * Decodes the path from the provided string
   *
   * 解码所提供的字符串的路径
   *
   * @param path The path string
   *
   * 路径字符串
   *
   */
  abstract decodePath(path: string): string;

  /**
   * Encodes the search string from the provided string or object
   *
   * 从所提供的字符串或对象中编码搜索字符串
   *
   * @param path The path string or object
   *
   * 路径字符串或对象
   *
   */
  abstract encodeSearch(search: string|{[k: string]: unknown}): string;

  /**
   * Decodes the search objects from the provided string
   *
   * 从所提供的字符串中解码搜索对象
   *
   * @param path The path string
   *
   * 路径字符串
   *
   */
  abstract decodeSearch(search: string): {[k: string]: unknown};

  /**
   * Encodes the hash from the provided string
   *
   * 对所提供的字符串中的哈希进行编码
   *
   * @param path The hash string
   *
   * 哈希字符串
   *
   */
  abstract encodeHash(hash: string): string;

  /**
   * Decodes the hash from the provided string
   *
   * 从所提供的字符串中解码哈希
   *
   * @param path The hash string
   *
   * 哈希字符串
   *
   */
  abstract decodeHash(hash: string): string;

  /**
   * Normalizes the URL from the provided string
   *
   * 从所提供的字符串中标准化 URL
   *
   * @param path The URL string
   *
   * URL 字符串
   *
   */
  abstract normalize(href: string): string;


  /**
   * Normalizes the URL from the provided string, search, hash, and base URL parameters
   *
   * 根据所提供的字符串、搜索、哈希和基本 URL 参数标准化 URL
   *
   * @param path The URL path
   *
   * 网址路径
   *
   * @param search The search object
   *
   * 搜索对象
   *
   * @param hash The has string
   *
   * 哈希字符串
   *
   * @param baseUrl The base URL for the URL
   *
   * 此 URL 的基本 URL
   *
   */
  abstract normalize(path: string, search: {[k: string]: unknown}, hash: string, baseUrl?: string):
      string;

  /**
   * Checks whether the two strings are equal
   *
   * 检查两个字符串是否相等
   *
   * @param valA First string for comparison
   *
   * 要比较的第一个字符串
   *
   * @param valB Second string for comparison
   *
   * 要比较的第二个字符串
   *
   */
  abstract areEqual(valA: string, valB: string): boolean;

  /**
   * Parses the URL string based on the base URL
   *
   * 根据基本 URL 解析 URL 字符串
   *
   * @param url The full URL string
   *
   * 完整的 URL 字符串
   *
   * @param base The base for the URL
   *
   * URL 的 base 部分
   *
   */
  abstract parse(url: string, base?: string): {
    href: string,
    protocol: string,
    host: string,
    search: string,
    hash: string,
    hostname: string,
    port: string,
    pathname: string
  };
}

/**
 * A `UrlCodec` that uses logic from AngularJS to serialize and parse URLs
 * and URL parameters.
 *
 * 一个 `UrlCodec`，它使用 AngularJS 中的逻辑来序列化和解析 URL 和 URL 参数。
 *
 * @publicApi
 */
export class AngularJSUrlCodec implements UrlCodec {
  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L15
  encodePath(path: string): string {
    const segments = path.split('/');
    let i = segments.length;

    while (i--) {
      // decode forward slashes to prevent them from being double encoded
      segments[i] = encodeUriSegment(segments[i].replace(/%2F/g, '/'));
    }

    path = segments.join('/');
    return _stripIndexHtml((path && path[0] !== '/' && '/' || '') + path);
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L42
  encodeSearch(search: string|{[k: string]: unknown}): string {
    if (typeof search === 'string') {
      search = parseKeyValue(search);
    }

    search = toKeyValue(search);
    return search ? '?' + search : '';
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L44
  encodeHash(hash: string) {
    hash = encodeUriSegment(hash);
    return hash ? '#' + hash : '';
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L27
  decodePath(path: string, html5Mode = true): string {
    const segments = path.split('/');
    let i = segments.length;

    while (i--) {
      segments[i] = decodeURIComponent(segments[i]);
      if (html5Mode) {
        // encode forward slashes to prevent them from being mistaken for path separators
        segments[i] = segments[i].replace(/\//g, '%2F');
      }
    }

    return segments.join('/');
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L72
  decodeSearch(search: string) {
    return parseKeyValue(search);
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L73
  decodeHash(hash: string) {
    hash = decodeURIComponent(hash);
    return hash[0] === '#' ? hash.substring(1) : hash;
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L149
  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/location.js#L42
  normalize(href: string): string;
  normalize(path: string, search: {[k: string]: unknown}, hash: string, baseUrl?: string): string;
  normalize(pathOrHref: string, search?: {[k: string]: unknown}, hash?: string, baseUrl?: string):
      string {
    if (arguments.length === 1) {
      const parsed = this.parse(pathOrHref, baseUrl);

      if (typeof parsed === 'string') {
        return parsed;
      }

      const serverUrl =
          `${parsed.protocol}://${parsed.hostname}${parsed.port ? ':' + parsed.port : ''}`;

      return this.normalize(
          this.decodePath(parsed.pathname), this.decodeSearch(parsed.search),
          this.decodeHash(parsed.hash), serverUrl);
    } else {
      const encPath = this.encodePath(pathOrHref);
      const encSearch = search && this.encodeSearch(search) || '';
      const encHash = hash && this.encodeHash(hash) || '';

      let joinedPath = (baseUrl || '') + encPath;

      if (!joinedPath.length || joinedPath[0] !== '/') {
        joinedPath = '/' + joinedPath;
      }
      return joinedPath + encSearch + encHash;
    }
  }

  areEqual(valA: string, valB: string) {
    return this.normalize(valA) === this.normalize(valB);
  }

  // https://github.com/angular/angular.js/blob/864c7f0/src/ng/urlUtils.js#L60
  parse(url: string, base?: string) {
    try {
      // Safari 12 throws an error when the URL constructor is called with an undefined base.
      const parsed = !base ? new URL(url) : new URL(url, base);
      return {
        href: parsed.href,
        protocol: parsed.protocol ? parsed.protocol.replace(/:$/, '') : '',
        host: parsed.host,
        search: parsed.search ? parsed.search.replace(/^\?/, '') : '',
        hash: parsed.hash ? parsed.hash.replace(/^#/, '') : '',
        hostname: parsed.hostname,
        port: parsed.port,
        pathname: (parsed.pathname.charAt(0) === '/') ? parsed.pathname : '/' + parsed.pathname
      };
    } catch (e) {
      throw new Error(`Invalid URL (${url}) with base (${base})`);
    }
  }
}

function _stripIndexHtml(url: string): string {
  return url.replace(/\/index.html$/, '');
}

/**
 * Tries to decode the URI component without throwing an exception.
 *
 * 尝试在不抛出异常的情况下解码 URI 组件。
 *
 * @param str value potential URI component to check.
 *
 * 值要检查的潜在 URI 组件。
 *
 * @returns
 *
 * the decoded URI if it can be decoded or else `undefined`.
 *
 * 解码的 URI（如果可以解码），否则为 `undefined` 。
 *
 */
function tryDecodeURIComponent(value: string): string|undefined {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    // Ignore any invalid uri component.
    return undefined;
  }
}


/**
 * Parses an escaped url query string into key-value pairs. Logic taken from
 * https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1382
 *
 * 将转义的 url
 * 查询字符串解析为键值对。逻辑来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1382
 *
 */
function parseKeyValue(keyValue: string): {[k: string]: unknown} {
  const obj: {[k: string]: unknown} = {};
  (keyValue || '').split('&').forEach((keyValue) => {
    let splitPoint, key, val;
    if (keyValue) {
      key = keyValue = keyValue.replace(/\+/g, '%20');
      splitPoint = keyValue.indexOf('=');
      if (splitPoint !== -1) {
        key = keyValue.substring(0, splitPoint);
        val = keyValue.substring(splitPoint + 1);
      }
      key = tryDecodeURIComponent(key);
      if (typeof key !== 'undefined') {
        val = typeof val !== 'undefined' ? tryDecodeURIComponent(val) : true;
        if (!obj.hasOwnProperty(key)) {
          obj[key] = val;
        } else if (Array.isArray(obj[key])) {
          (obj[key] as unknown[]).push(val);
        } else {
          obj[key] = [obj[key], val];
        }
      }
    }
  });
  return obj;
}

/**
 * Serializes into key-value pairs. Logic taken from
 * https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1409
 *
 * 序列化为键值对。逻辑来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1409
 *
 */
function toKeyValue(obj: {[k: string]: unknown}) {
  const parts: unknown[] = [];
  for (const key in obj) {
    let value = obj[key];
    if (Array.isArray(value)) {
      value.forEach((arrayValue) => {
        parts.push(
            encodeUriQuery(key, true) +
            (arrayValue === true ? '' : '=' + encodeUriQuery(arrayValue, true)));
      });
    } else {
      parts.push(
          encodeUriQuery(key, true) +
          (value === true ? '' : '=' + encodeUriQuery(value as any, true)));
    }
  }
  return parts.length ? parts.join('&') : '';
}


/**
 * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
 * https://tools.ietf.org/html/rfc3986 with regards to the character set (pchar) allowed in path
 * segments:
 *    segment       = *pchar
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "\_" / "~"
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 *
 * 我们需要我们的自定义方法，因为 encodeURIComponent
 * 过于激进，并且在路径段中允许的字符集（pchar）方面不遵循 https://tools.ietf.org/html/rfc3986
 * ：segment = *pchar pchar = unreserved / pct -encoded / sub-delims / “:” / “@” pct-encoded = “%”
 * HEXDIG HEXDIG unreserved = ALPHA / DIGIT /“-”/“。” /"\_" /"~" sub-delims = "!"
 * /“$”/“&”/“'”/“(”/“)”/“* ”/“+”/“,”/“;” / "="
 *
 * Logic from https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1437
 *
 * 来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1437 的逻辑
 *
 */
function encodeUriSegment(val: string) {
  return encodeUriQuery(val, true).replace(/%26/g, '&').replace(/%3D/gi, '=').replace(/%2B/gi, '+');
}


/**
 * This method is intended for encoding *key* or *value* parts of query component. We need a custom
 * method because encodeURIComponent is too aggressive and encodes stuff that doesn't have to be
 * encoded per https://tools.ietf.org/html/rfc3986:
 *    query         = *( pchar / "/" / "?" )
 *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
 *    unreserved    = ALPHA / DIGIT / "-" / "." / "\_" / "~"
 *    pct-encoded   = "%" HEXDIG HEXDIG
 *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
 *                     / "*" / "+" / "," / ";" / "="
 *
 * 此方法旨在编码查询组件的*键*或*值*部分。我们需要一个自定义方法，因为 encodeURIComponent
 * 太激进了，并且会编码不必按 https://tools.ietf.org/html/rfc3986 编码的东西： query = *( pchar /
 * "/" / "?" ) pchar = 未保留/pct 编码/子 delims/“:”/“@”未保留=ALPHA/DIGIT/“-”/“.” /“\_”/“~”
 * pct-encoded = “%” HEXDIG HEXDIG sub-delims = “!” /“$”/“&”/“'”/“(”/“)”/“* ”/“+”/“,”/“;” / "="
 *
 * Logic from https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1456
 *
 * 来自 https://github.com/angular/angular.js/blob/864c7f0/src/Angular.js#L1456 的逻辑
 *
 */
function encodeUriQuery(val: string, pctEncodeSpaces: boolean = false) {
  return encodeURIComponent(val)
      .replace(/%40/g, '@')
      .replace(/%3A/gi, ':')
      .replace(/%24/g, '$')
      .replace(/%2C/gi, ',')
      .replace(/%3B/gi, ';')
      .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}
