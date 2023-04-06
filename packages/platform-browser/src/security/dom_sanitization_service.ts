/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {DOCUMENT} from '@angular/common';
import {forwardRef, Inject, Injectable, Injector, Sanitizer, SecurityContext, ɵ_sanitizeHtml as _sanitizeHtml, ɵ_sanitizeUrl as _sanitizeUrl, ɵallowSanitizationBypassAndThrow as allowSanitizationBypassOrThrow, ɵbypassSanitizationTrustHtml as bypassSanitizationTrustHtml, ɵbypassSanitizationTrustResourceUrl as bypassSanitizationTrustResourceUrl, ɵbypassSanitizationTrustScript as bypassSanitizationTrustScript, ɵbypassSanitizationTrustStyle as bypassSanitizationTrustStyle, ɵbypassSanitizationTrustUrl as bypassSanitizationTrustUrl, ɵBypassType as BypassType, ɵgetSanitizationBypassType as getSanitizationBypassType, ɵunwrapSafeValue as unwrapSafeValue, ɵXSS_SECURITY_URL as XSS_SECURITY_URL} from '@angular/core';

export {SecurityContext};



/**
   * Marker interface for a value that's safe to use in a particular context.
   *
   * 一个标记性接口，用于表示一个值可以安全的用在特定的上下文中。
   *
   * @publicApi
   */
export interface SafeValue {}

/**
 * Marker interface for a value that's safe to use as HTML.
 *
 * 一个标记性接口，用于表示一个值可以安全地用在 HTML 上下文中。
 *
 * @publicApi
 */
export interface SafeHtml extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as style (CSS).
 *
 * 一个标记性接口，用于表示一个值可以安全地用在样式（CSS）上下文中。
 *
 * @publicApi
 */
export interface SafeStyle extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as JavaScript.
 *
 * 一个标记性接口，用于表示一个值可以安全地用在 JavaScript 上下文中。
 *
 * @publicApi
 */
export interface SafeScript extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as a URL linking to a document.
 *
 * 一个标记性接口，用于表示一个值可以安全地用作 URL 链接到一个文档。
 *
 * @publicApi
 */
export interface SafeUrl extends SafeValue {}

/**
 * Marker interface for a value that's safe to use as a URL to load executable code from.
 *
 * 一个标记性接口，用于表示一个值可以安全地用作 URL 以加载可执行代码。
 *
 * @publicApi
 */
export interface SafeResourceUrl extends SafeValue {}

/**
 * DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
 * values to be safe to use in the different DOM contexts.
 *
 * DomSanitizer 可以把值净化为在不同 DOM 上下文中的安全内容，来帮你防范跨站脚本攻击（XSS）类的安全问题。
 *
 * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
 * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
 * the website.
 *
 * 如果该值本身是安全的，则不需要绕过安全性检查，比如那些没有使用可疑协议的 URL 或者不包含危险代码的 HTML 片段。 净化器会确保值的安全性。
 *
 * In specific situations, it might be necessary to disable sanitization, for example if the
 * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
 * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
 * methods, and then binding to that value from the template.
 *
 * 在特定场景下，可能要禁用净化机制，比如，如果应用程序真的需要生成具有动态值的 `javascript:` 链接。 用户可以通过使用 `bypassSecurityTrust...` 方法来构建出一个值，以绕过安全性检查，并在模板中绑定它。
 *
 * These situations should be very rare, and extraordinary care must be taken to avoid creating a
 * Cross Site Scripting (XSS) security bug!
 *
 * 这种场景其实非常罕见，必须特别小心，避免引入跨站脚本攻击（XSS）类的安全风险。
 *
 * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
 * close as possible to the source of the value, to make it easy to verify no security bug is
 * created by its use.
 *
 * 当使用 `bypassSecurityTrust...` 时，请尽量确保尽早调用该方法，并且让他尽可能接近值的来源，以便能更容易地验证使用它时有没有引入安全风险。
 *
 * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
 * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
 * code. The sanitizer leaves safe values intact.
 *
 * 如果该值本身是安全的，则不需要绕过安全性检查，比如那些没有使用可疑协议的 URL 或者不包含危险代码的 HTML 片段。 净化器会确保值的安全性。
 *
 * @security Calling any of the `bypassSecurityTrust...` APIs disables Angular's built-in
 * sanitization for the value passed in. Carefully check and audit all values and code paths going
 * into this call. Make sure any user data is appropriately escaped for this security context.
 * For more detail, see the [Security Guide](https://g.co/ng/security).
 * @publicApi
 */
@Injectable({providedIn: 'root', useExisting: forwardRef(() => DomSanitizerImpl)})
export abstract class DomSanitizer implements Sanitizer {
  /**
   * Gets a safe value from either a known safe value or a value with unknown safety.
   *
   * If the given value is already a `SafeValue`, this method returns the unwrapped value.
   * If the security context is HTML and the given value is a plain string, this method
   * sanitizes the string, removing any potentially unsafe content.
   * For any other security context, this method throws an error if provided
   * with a plain string.
   */
  abstract sanitize(context: SecurityContext, value: SafeValue|string|null): string|null;

  /**
   * Bypass security and trust the given value to be safe HTML. Only use this when the bound HTML
   * is unsafe (e.g. contains `<script>` tags) and the code should be executed. The sanitizer will
   * leave safe HTML intact, so in most situations this method should not be used.
   *
   * 绕过安全检查，并信任给定的值是一个安全的 HTML。只有当要绑定的 HTML 是不安全内容（比如包含 `<script>`）而且你确实希望运行这些代码时，才需要使用它。 净化器会确保安全 HTML 的完整性，因此在大多数场景下都不需要使用该方法。
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   *
   * **警告：** 使用不可信的用户数据调用此方法将会让你的应用暴露在 XSS 安全风险之下！
   *
   */
  abstract bypassSecurityTrustHtml(value: string): SafeHtml;

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * 绕过安全检查，并信任给定的值是一个安全的样式（CSS）。
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   *
   * **警告：** 使用不可信的用户数据调用此方法将会让你的应用暴露在 XSS 安全风险之下！
   *
   */
  abstract bypassSecurityTrustStyle(value: string): SafeStyle;

  /**
   * Bypass security and trust the given value to be safe JavaScript.
   *
   * 绕过安全检查，并信任给定的值是一个安全的 JavaScript。
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   *
   * **警告：** 使用不可信的用户数据调用此方法将会让你的应用暴露在 XSS 安全风险之下！
   *
   */
  abstract bypassSecurityTrustScript(value: string): SafeScript;

  /**
   * Bypass security and trust the given value to be a safe style URL, i.e. a value that can be used
   * in hyperlinks or `<img src>`.
   *
   * 绕过安全检查，并信任给定的值是一个安全的样式 URL。也就是说该值可安全地用在链接或 `<img src>` 中。
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   *
   * **警告：** 使用不可信的用户数据调用此方法将会让你的应用暴露在 XSS 安全风险之下！
   *
   */
  abstract bypassSecurityTrustUrl(value: string): SafeUrl;

  /**
   * Bypass security and trust the given value to be a safe resource URL, i.e. a location that may
   * be used to load executable code from, like `<script src>`, or `<iframe src>`.
   *
   * 绕过安全检查，并信任给定的值是一个安全的资源 URL。也就是说该地址可以安全的用于加载可执行代码，比如 `<script src>` 或 `<iframe src>`。
   *
   * **WARNING:** calling this method with untrusted user data exposes your application to XSS
   * security risks!
   *
   * **警告：** 使用不可信的用户数据调用此方法将会让你的应用暴露在 XSS 安全风险之下！
   *
   */
  abstract bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl;
}

export function domSanitizerImplFactory(injector: Injector) {
  return new DomSanitizerImpl(injector.get(DOCUMENT));
}

@Injectable({providedIn: 'root', useFactory: domSanitizerImplFactory, deps: [Injector]})
export class DomSanitizerImpl extends DomSanitizer {
  constructor(@Inject(DOCUMENT) private _doc: any) {
    super();
  }

  override sanitize(ctx: SecurityContext, value: SafeValue|string|null): string|null {
    if (value == null) return null;
    switch (ctx) {
      case SecurityContext.NONE:
        return value as string;
      case SecurityContext.HTML:
        if (allowSanitizationBypassOrThrow(value, BypassType.Html)) {
          return unwrapSafeValue(value);
        }
        return _sanitizeHtml(this._doc, String(value)).toString();
      case SecurityContext.STYLE:
        if (allowSanitizationBypassOrThrow(value, BypassType.Style)) {
          return unwrapSafeValue(value);
        }
        return value as string;
      case SecurityContext.SCRIPT:
        if (allowSanitizationBypassOrThrow(value, BypassType.Script)) {
          return unwrapSafeValue(value);
        }
        throw new Error('unsafe value used in a script context');
      case SecurityContext.URL:
        if (allowSanitizationBypassOrThrow(value, BypassType.Url)) {
          return unwrapSafeValue(value);
        }
        return _sanitizeUrl(String(value));
      case SecurityContext.RESOURCE_URL:
        if (allowSanitizationBypassOrThrow(value, BypassType.ResourceUrl)) {
          return unwrapSafeValue(value);
        }
        throw new Error(`unsafe value used in a resource URL context (see ${XSS_SECURITY_URL})`);
      default:
        throw new Error(`Unexpected SecurityContext ${ctx} (see ${XSS_SECURITY_URL})`);
    }
  }

  override bypassSecurityTrustHtml(value: string): SafeHtml {
    return bypassSanitizationTrustHtml(value);
  }
  override bypassSecurityTrustStyle(value: string): SafeStyle {
    return bypassSanitizationTrustStyle(value);
  }
  override bypassSecurityTrustScript(value: string): SafeScript {
    return bypassSanitizationTrustScript(value);
  }
  override bypassSecurityTrustUrl(value: string): SafeUrl {
    return bypassSanitizationTrustUrl(value);
  }
  override bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl {
    return bypassSanitizationTrustResourceUrl(value);
  }
}
