# Security

# 安全

This topic describes Angular's built-in protections against common web-application vulnerabilities and attacks such as cross-site scripting attacks.
It doesn't cover application-level security, such as authentication and authorization.

本主题会讲述 Angular 为防范 Web 应用常见的安全漏洞和攻击（比如跨站脚本攻击）内置的保护措施，但不会涉及应用级安全，比如用户认证（*这个用户是谁？*）和授权(*这个用户能做什么？*)。

For more information about the attacks and mitigations described below, see the [Open Web Application Security Project (OWASP) Guide](https://www.owasp.org/index.php/Category:OWASP_Guide_Project).

要了解更多攻防信息，参阅[开放式 Web 应用程序安全项目(OWASP)](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)。

You can run the <live-example></live-example> in Stackblitz and download the code from there.

你可以运行<live-example></live-example>，在 Stackblitz 中试用并下载本页的代码。

<a id="report-issues"></a>

<div class="callout is-important">

<header>Reporting vulnerabilities</header>

<header>举报漏洞</header>

Angular is part of Google [Open Source Software Vulnerability Reward Program](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules), for vulnerabilities in Angular please submit your report [here](https://bughunters.google.com/report).

Angular 是 Google 的[开源软件漏洞奖励项目](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules)的一部分，对于 Angular 中的漏洞，请把报告提交到[这里](https://bughunters.google.com/report)。

For more information about how Google handles security issues, see [Google's security philosophy](https://www.google.com/about/appsecurity).

要了解关于“谷歌如何处理安全问题”的更多信息，参阅[谷歌的安全哲学](https://www.google.com/about/appsecurity/)。

</div>

<a id="best-practices"></a>

<div class="callout is-helpful">

<header>Best practices</header>

<header>最佳实践</header>

| Practices | Details |
| :-------- | :------ |
| 实践 | 详情 |
| Keep current with the latest Angular library releases | The Angular libraries get regular updates, and these updates might fix security defects discovered in previous versions. Check the Angular [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md) for security-related updates. |
| 及时把 Angular 包更新到最新版本 | 我们会频繁的更新 Angular 库，这些更新可能会修复之前版本中发现的安全漏洞。查看 Angular 的[更新记录](https://github.com/angular/angular/blob/main/CHANGELOG.md)，了解与安全有关的更新。 |
| Don't alter your copy of Angular | Private, customized versions of Angular tend to fall behind the current version and might not include important security fixes and enhancements. Instead, share your Angular improvements with the community and make a pull request. |
| 不要修改你的 Angular 副本 | 私有的、定制版的 Angular 往往跟不上最新版本，这可能导致你忽略重要的安全修复与增强。反之，应该在社区共享你对 Angular 所做的改进并创建 Pull Request。. |
| Avoid Angular APIs marked in the documentation as "*Security Risk*" | For more information, see the [Trusting safe values](guide/security#bypass-security-apis) section of this page. |
| 避免使用本文档中带“[*安全风险*](guide/security#bypass-security-apis)”标记的 Angular API | 要了解更多信息，请参阅本章的[信任那些安全的值](guide/security#bypass-security-apis)部分。 |

</div>

## Preventing cross-site scripting (XSS)

## 防范跨站脚本(XSS)攻击

[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) enables attackers to inject malicious code into web pages.
Such code can then, for example, steal user and login data, or perform actions that impersonate the user.
This is one of the most common attacks on the web.

[跨站脚本(XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting)允许攻击者将恶意代码注入到页面中。这些代码可以偷取用户及其登录数据数据，还可以冒充用户执行操作。它是 Web 上最常见的攻击方式之一。

To block XSS attacks, you must prevent malicious code from entering the Document Object Model (DOM).
For example, if attackers can trick you into inserting a `<script>` tag in the DOM, they can run arbitrary code on your website.
The attack isn't limited to `<script>` tags —many elements and properties in the DOM allow code execution, for example, `<img alt="" onerror="...">` and `<a href="javascript:...">`.
If attacker-controlled data enters the DOM, expect security vulnerabilities.

为了防范 XSS 攻击，你必须阻止恶意代码进入 DOM。比如，如果某个攻击者能骗你把 `<script>` 标签插入到 DOM，就可以在你的网站上运行任何代码。除了 `<script>`，攻击者还可以使用很多 DOM 元素和属性来执行代码，比如 `<img alt="" onerror="...">`、`<a href="javascript:...">`。如果攻击者所控制的数据混进了 DOM，就会导致安全漏洞。

### Angular's cross-site scripting security model

### Angular 的“跨站脚本安全模型”

To systematically block XSS bugs, Angular treats all values as untrusted by default.
When a value is inserted into the DOM from a template binding, or interpolation, Angular sanitizes and escapes untrusted values.
If a value was already sanitized outside of Angular and is considered safe, communicate this to Angular by marking the [value as trusted](#bypass-security-apis).

为了系统性的防范 XSS 问题，Angular 默认把所有值都当做不可信任的。
当值从模板中以属性（Property）、DOM 元素属性（Attribte)、CSS 类绑定或插值等途径插入到 DOM 中的时候，
Angular 将对这些值进行无害化处理（Sanitize），对不可信的值进行编码。如果某个值已经在 Angular 之外进行过无害化处理，可以确信是安全的，可以[把这个值标记为安全的](#bypass-security-apis)来把这一点通知 Angular。

Unlike values to be used for rendering, Angular templates are considered trusted by default, and should be treated as executable code.
Never create templates by concatenating user input and template syntax.
Doing this would enable attackers to [inject arbitrary code](https://en.wikipedia.org/wiki/Code_injection) into your application.
To prevent these vulnerabilities, always use the default [Ahead-Of-Time (AOT) template compiler](guide/security#offline-template-compiler) in production deployments.

与用于渲染的值不同，默认情况下，Angular 模板被认为是受信任的，应被视为可执行代码。切勿通过串联用户输入和模板语法来生成模板。这样做会使攻击者能够[将任意代码注入](https://en.wikipedia.org/wiki/Code_injection)你的应用程序。为避免这些漏洞，请始终在生产部署中[使用默认的 AOT 模板编译器。](guide/security#offline-template-compiler)。

An extra layer of protection can be provided through the use of Content security policy and Trusted Types.
These web platform features operate at the DOM level which is the most effective place to prevent XSS issues. Here they can't be bypassed using other, lower-level APIs.
For this reason, it is strongly encouraged to take advantage of these features. To do this, configure the [content security policy](#content-security-policy) for the application and enable [trusted types enforcement](#trusted-types).

借助内容安全策略和可信类型，可以提供额外的保护层。这些 Web 平台特性会在 DOM 级别运行，这是用来防范 XSS 问题的最有效位置，因为即使使用其它低级 API 也无法绕过它们。出于这个原因，我们强烈建议开发人员通过为其应用程序配置[内容安全策略](#content-security-policy)并启用[强制可信类型](#trusted-types)来利用这些特性。

### Sanitization and security contexts

### 无害化处理与安全环境

*Sanitization* is the inspection of an untrusted value, turning it into a value that's safe to insert into the DOM.
In many cases, sanitization doesn't change a value at all.
Sanitization depends on context:
A value that's harmless in CSS is potentially dangerous in a URL.

无害化处理会审查不可信的值，并将它们转换成可以安全插入到 DOM 的形式。多数情况下，这些值并不会在处理过程中发生任何变化。无害化处理的方式取决于所在的环境：一个在 CSS 里面无害的值，可能在 URL 里很危险。

Angular defines the following security contexts:

Angular 定义了四个安全环境：

| Security contexts | Details |
| :---------------- | :------ |
| 安全上下文 | 详情 |
| HTML | Used when interpreting a value as HTML, for example, when binding to `innerHtml`. |
| HTML | 值需要被解释为 HTML 时使用，比如当绑定到 `innerHTML` 时。 |
| Style | Used when binding CSS into the `style` property. |
| 样式 | 值需要作为 CSS 绑定到 `style` 属性时使用。 |
| URL | Used for URL properties, such as `<a href>`. |
| URL | 值需要被用作 URL 属性时使用，比如 `<a href>`。 |
| Resource URL | A URL that is loaded and executed as code, for example, in `<script src>`. |
| 资源 URL | 值需要作为代码进行加载并执行，比如 `<script src>` 中的 URL。 |

Angular sanitizes untrusted values for HTML, styles, and URLs. Sanitizing resource URLs isn't possible because they contain arbitrary code.
In development mode, Angular prints a console warning when it has to change a value during sanitization.

Angular 会对前三项中种不可信的值进行无害化处理，但不能对第四种资源 URL 进行无害化，因为它们可能包含任何代码。在开发模式下，如果在进行无害化处理时需要被迫改变一个值，Angular 就会在控制台上输出一个警告。

### Sanitization example

### 无害化范例

The following template binds the value of `htmlSnippet`. Once by interpolating it into an element's content, and once by binding it to the `innerHTML` property of an element:

下面的例子绑定了 `htmlSnippet` 的值。一次把它放进插值里，另一次把它绑定到元素的 `innerHTML` 属性上。

<code-example header="src/app/inner-html-binding.component.html" path="security/src/app/inner-html-binding.component.html"></code-example>

Interpolated content is always escaped —the HTML isn't interpreted and the browser displays angle brackets in the element's text content.

插值的内容总会被编码 - 其中的 HTML 不会被解释，所以浏览器会在元素的文本内容中显示尖括号。

For the HTML to be interpreted, bind it to an HTML property such as `innerHTML`.
Be aware that binding a value that an attacker might control into `innerHTML` normally causes an XSS vulnerability.
For example, one could run JavaScript in a following way:

如果希望这段 HTML 被正常解释，就必须绑定到一个 HTML 属性上，比如 `innerHTML`。但要小心如果把一个可能被攻击者控制的值绑定到 `innerHTML` 就会导致 XSS 漏洞。比如，某些人可以用这种方式来执行恶意代码：

<code-example header="src/app/inner-html-binding.component.ts (class)" path="security/src/app/inner-html-binding.component.ts" region="class"></code-example>

Angular recognizes the value as unsafe and automatically sanitizes it, which removes the `script` element but keeps safe content such as the `<b>` element.

Angular 认为这些值是不安全的，并自动进行无害化处理。它会移除 `script` 元素，但保留安全的内容，比如该片段中的 `<b>` 元素。

<div class="lightbox">

<img alt="A screenshot showing interpolated and bound HTML values" src="generated/images/guide/security/binding-inner-html.png">

</div>

### Direct use of the DOM APIs and explicit sanitization calls

### 避免直接使用 DOM API

Unless you enforce Trusted Types, the built-in browser DOM APIs don't automatically protect you from security vulnerabilities.
For example, `document`, the node available through `ElementRef`, and many third-party APIs contain unsafe methods.
Likewise, if you interact with other libraries that manipulate the DOM, you likely won't have the same automatic sanitization as with Angular interpolations.
Avoid directly interacting with the DOM and instead use Angular templates where possible.

除非你强制使用可信类型（Trusted Types），否则浏览器内置的 DOM API 不会自动保护你免受安全漏洞的侵害。比如 `document`、通过 `ElementRef` 拿到的节点和很多第三方 API，都可能包含不安全的方法。如果你使用能操纵 DOM 的其它库，也同样无法借助像 Angular 插值那样的自动清理功能。所以，要避免直接和 DOM 打交道，而是尽可能使用 Angular 模板。

For cases where this is unavoidable, use the built-in Angular sanitization functions.
Sanitize untrusted values with the [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) method and the appropriate `SecurityContext`.
That function also accepts values that were marked as trusted using the `bypassSecurityTrust` … functions, and does not sanitize them, as [described below](#bypass-security-apis).

在无法避免的情况下，使用内置的 Angular 无害化处理函数。使用 [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) 方法以及适当的 `SecurityContext` 来对不可信的值进行无害化处理。此函数也可以接受使用 `bypassSecurityTrust` 函数标为可信的值，而且不会对它们进行无害化处理，就像[稍后讲的那样](#bypass-security-apis)。

<a id="bypass-security-apis"></a>

### Trusting safe values

### 信任安全值

Sometimes applications genuinely need to include executable code, display an `<iframe>` from some URL, or construct potentially dangerous URLs.
To prevent automatic sanitization in these situations, tell Angular that you inspected a value, checked how it was created, and made sure it is secure.
Do *be careful*.
If you trust a value that might be malicious, you are introducing a security vulnerability into your application.
If in doubt, find a professional security reviewer.

有时候，应用程序确实需要包含可执行的代码，比如使用 URL 显示 `<iframe>`，或者构造出有潜在危险的 URL。为了防止在这种情况下被自动无害化，可以告诉 Angular，你已经审查了这个值，检查了它是怎么生成的，并确信它总是安全的。但是**千万要小心**！如果你信任了一个可能是恶意的值，就会在应用中引入一个安全漏洞。如果你有疑问，请找一个安全专家复查下。

To mark a value as trusted, inject `DomSanitizer` and call one of the following methods:

注入 `DomSanitizer` 服务，然后调用下面的方法之一，你就可以把一个值标记为可信任的。

* `bypassSecurityTrustHtml`

* `bypassSecurityTrustScript`

* `bypassSecurityTrustStyle`

* `bypassSecurityTrustUrl`

* `bypassSecurityTrustResourceUrl`

Remember, whether a value is safe depends on context, so choose the right context for your intended use of the value.
Imagine that the following template needs to bind a URL to a `javascript:alert(...)` call:

记住，一个值是否安全取决于它所在的环境，所以你要为这个值按预定的用法选择正确的环境。假设下面的模板需要把 `javascript.alert(...)` 方法绑定到 URL。

<code-example header="src/app/bypass-security.component.html (URL)" path="security/src/app/bypass-security.component.html" region="URL"></code-example>

Normally, Angular automatically sanitizes the URL, disables the dangerous code, and in development mode, logs this action to the console.
To prevent this, mark the URL value as a trusted URL using the `bypassSecurityTrustUrl` call:

通常，Angular 会自动无害化这个 URL 并禁止危险的代码。为了防止这种行为，可以调用 `bypassSecurityTrustUrl` 把这个 URL 值标记为一个可信任的 URL：

<code-example header="src/app/bypass-security.component.ts (trust-url)" path="security/src/app/bypass-security.component.ts" region="trust-url"></code-example>

<div class="lightbox">

<img alt="A screenshot showing an alert box created from a trusted URL" src="generated/images/guide/security/bypass-security-component.png">

</div>

If you need to convert user input into a trusted value, use a component method.
The following template lets users enter a YouTube video ID and load the corresponding video in an `<iframe>`.
The `<iframe src>` attribute is a resource URL security context, because an untrusted source can, for example, smuggle in file downloads that unsuspecting users could run.
To prevent this, call a method on the component to construct a trusted video URL, which causes Angular to let binding into `<iframe src>`:

如果需要把用户输入转换为一个可信任的值，可以在组件方法中处理。下面的模板允许用户输入一个 YouTube 视频的 ID，然后把相应的视频加载到 `<iframe>` 中。`<iframe src>` 是一个“资源 URL”的安全环境，因为不可信的源码可能作为文件下载到本地，被毫无防备的用户执行。所以要调用一个组件方法来构造一个新的、可信任的视频 URL，这样 Angular 就会允许把它绑定到 `<iframe src>`。

<code-example header="src/app/bypass-security.component.html (iframe)" path="security/src/app/bypass-security.component.html" region="iframe"></code-example>

<code-example header="src/app/bypass-security.component.ts (trust-video-url)" path="security/src/app/bypass-security.component.ts" region="trust-video-url"></code-example>

<a id="content-security-policy"></a>

### Content security policy

### 内容安全政策

Content Security Policy (CSP) is a defense-in-depth technique to prevent XSS.
To enable CSP, configure your web server to return an appropriate `Content-Security-Policy` HTTP header.
Read more about content security policy at the [Web Fundamentals guide](https://developers.google.com/web/fundamentals/security/csp) on the Google Developers website.

内容安全策略（CSP）是防止 XSS 的深度防御技术。要启用 CSP，请将你的 Web 服务器配置为返回适当的 `Content-Security-Policy` HTTP 请求头。在 Google Developers 网站上的[《网络基础知识》指南](https://developers.google.com/web/fundamentals/security/csp)中了解有关内容安全政策的更多信息。

The minimal policy required for a brand-new Angular application is:

新版 Angular 所需的最小化策略是：

<code-example format="none" language="none">

default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';

</code-example>

When serving your Angular application, the server should include a  randomly-generated nonce in the HTTP header for each request.
You must provide this nonce to Angular so that the framework can render `<style>` elements.
You can set the nonce for Angular in one of two ways:

1. Set the `ngCspNonce` attribute on the root application element as `<app ngCspNonce="randomNonceGoesHere"></app>`. Use this approach if you have access to server-side templating that can add the nonce both to the header and the `index.html` when constructing the response.
2. Provide the nonce using the `CSP_NONCE` injection token. Use this approach if you have access to the nonce at runtime and you want to be able to cache the `index.html`.

<code-example format="typescript" language="typescript">

import {bootstrapApplication, CSP_NONCE} from '&commat;angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [{
    provide: CSP_NONCE,
    useValue: globalThis.myRandomNonceValue
  }]
});

</code-example>

<div class="callout is-helpful">

Always ensure that the nonces you provide are <strong>unique per request</strong> and that they are not predictable or guessable.
If an attacker can predict future nonces, they can circumvent the protections offered by CSP.

</div>

If you cannot generate nones in your project, you can allow inline styles by adding `'unsafe-inline'` to the `style-src` section of the CSP header.

| Sections                | Details |
|:---                     |:---     |
| `default-src 'self';`   | Allows the page to load all its required resources from the same origin. |
| `style-src 'self' 'nonce-randomNonceGoesHere';`     | Allows the page to load global styles from the same origin \(`'self'`\) and styles inserted by Angular with the `nonce-randomNonceGoesHere`. |
| `script-src 'self' 'nonce-randomNonceGoesHere';`     | Allows the page to load JavaScript from the same origin \(`'self'`\) and scripts inserted by the Angular CLI with the `nonce-randomNonceGoesHere`. This is only required if you're using critical CSS inlining. |

Angular itself requires only these settings to function correctly.
As your project grows, you may need to expand your CSP settings to accommodate extra features specific to your application.

Angular 本身只需要这些设置即可正常运行。随着项目的增长，你可能需要将 CSP 设置扩展出应用特有的一些额外特性。

<a id="trusted-types"></a>

<!-- vale Angular.Google_Headings = NO -->

### Enforcing Trusted Types

### 强制执行可信类型

<!-- vale Angular.Google_Headings = YES -->

It is recommended that you use [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) as a way to help secure your applications from cross-site scripting attacks.
Trusted Types is a [web platform](https://en.wikipedia.org/wiki/Web_platform) feature that can help you prevent cross-site scripting attacks by enforcing safer coding practices.
Trusted Types can also help simplify the auditing of application code.

建议使用[可信类型](https://w3c.github.io/webappsec-trusted-types/dist/spec)来帮助保护你的应用程序免受跨站脚本攻击。可信类型是一项 [Web 平台](https://en.wikipedia.org/wiki/Web_platform)功能，可通过实施更安全的编码实践来帮助你防范跨站脚本攻击。可信类型还可以帮助简化应用程序代码的审计。

<div class="callout is-helpful">

Trusted Types might not yet be available in all browsers your application targets.
In the case your Trusted-Types-enabled application runs in a browser that doesn't support Trusted Types, the features of the application are preserved. Your application is guarded against XSS by way of Angular's DomSanitizer.
See [caniuse.com/trusted-types](https://caniuse.com/trusted-types) for the current browser support.

可信类型可能尚未在你的应用程序目标的所有浏览器中可用。如果启用了可信类型的应用程序在不支持可信类型的浏览器中运行，应用程序的功能将被保留，并且你的应用程序将通过 Angular 的 DomSanitizer 防范 XSS。有关当前浏览器支持，请参阅 [caniuse.com/trusted-types](https://caniuse.com/trusted-types)。

</div>

To enforce Trusted Types for your application, you must configure your application's web server to emit HTTP headers with one of the following Angular policies:

要为你的应用程序强制实施可信类型，你必须将应用程序的 Web 服务器配置为使用以下 Angular 策略之一发出 HTTP 请求头：

| Policies | Detail |
| :------- | :----- |
| 策略 | 详情 |
| `angular` | This policy is used in security-reviewed code that is internal to Angular, and is required for Angular to function when Trusted Types are enforced. Any inline template values or content sanitized by Angular is treated as safe by this policy. |
| `angular` | 此策略用于 Angular 内部经过安全审查的代码，并且当强制执行可信类型时，Angular 需要此策略才能正常运行。任何由 Angular 清理的内联模板值或内容都被此政策视为安全的。 |
| `angular#unsafe-bypass` | This policy is used for applications that use any of the methods in Angular's [DomSanitizer](api/platform-browser/DomSanitizer) that bypass security, such as `bypassSecurityTrustHtml`. Any application that uses these methods must enable this policy. |
| `angular#unsafe-bypass` | 此策略用于要使用 Angular 的 [DomSanitizer](api/platform-browser/DomSanitizer) 的各个方法来绕过安全性的应用程序，比如 `bypassSecurityTrustHtml`。任何使用了这些方法的应用程序都必须启用此策略。 |
| `angular#unsafe-jit` | This policy is used by the [Just-In-Time (JIT) compiler](api/core/Compiler). You must enable this policy if your application interacts directly with the JIT compiler or is running in JIT mode using the [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic). |
| `angular#unsafe-jit` | 此策略供[Just-In-Time (JIT) 编译器](api/core/Compiler)使用。如果你的应用程序直接与 JIT 编译器交互或使用[平台浏览器动态](api/platform-browser-dynamic/platformBrowserDynamic)以 JIT 模式运行，你必须启用此策略。 |
| `angular#bundler` | This policy is used by the Angular CLI bundler when creating lazy chunk files. |
| `angular#bundler` | 创建惰性加载块文件时，Angular CLI 打包器会使用此策略。 |

You should configure the HTTP headers for Trusted Types in the following locations:

你应该在以下位置为可信类型配置 HTTP 请求头：

* Production serving infrastructure

  生产环境基础设施服务器

* Angular CLI (`ng serve`), using the `headers` property in the `angular.json` file, for local development and end-to-end testing

  Angular CLI ( `ng serve` )，使用 `angular.json` 文件中的 `headers` 属性，用于本地开发和端到端测试

* Karma (`ng test`), using the `customHeaders` property in the `karma.config.js` file, for unit testing

  Karma ( `ng test` )，使用 `karma.config.js` 文件中的 `customHeaders` 属性，进行单元测试

The following is an example of a header specifically configured for Trusted Types and Angular:

以下是为可信类型和 Angular 配置的请求头示例：

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';

</code-example>

An example of a header specifically configured for Trusted Types and Angular applications that use any of Angular's methods in [DomSanitizer](api/platform-browser/DomSanitizer) that bypasses security:

以下是为可信类型和 Angular 应用程序专门配置的请求头示例，这些应用程序使用了 Angular [DomSanitizer](api/platform-browser/DomSanitizer) 中那些可以绕过安全性的方法。

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';

</code-example>

The following is an example of a header specifically configured for Trusted Types and Angular applications using JIT:

以下是使用 JIT，且专门为可信类型和 Angular 应用程序配置的请求头示例：

<code-example format="html" language="html">

Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';

</code-example>

The following is an example of a header specifically configured for Trusted Types and Angular applications that use lazy loading of modules:

以下是专门为使用惰性加载模块的受信任类型和 Angular 应用程序配置的标头示例：

<code-example language="html">

Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';

</code-example>

<div class="callout is-helpful">

<header>Community contributions</header>

<header>社区贡献</header>

To learn more about troubleshooting Trusted Type configurations, the following resource might be helpful:

要了解关于如何对可信类型配置进行故障排除的更多信息，以下资源可能会有所帮助：

[Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

[使用可信类型防范基于 DOM 的跨站脚本漏洞](https://web.dev/trusted-types/#how-to-use-trusted-types)

</div>

<a id="offline-template-compiler"></a>

### Use the AOT template compiler

### 使用 AOT 模板编译器

The AOT template compiler prevents a whole class of vulnerabilities called template injection, and greatly improves application performance.
The AOT template compiler is the default compiler used by Angular CLI applications, and you should use it in all production deployments.

AOT 模板编译器可防止称为模板注入的一整类漏洞，并大大提高了应用程序性能。AOT 模板编译器是 Angular CLI 应用程序使用的默认编译器，你应该在所有生产部署中使用它。

An alternative to the AOT compiler is the JIT compiler which compiles templates to executable template code within the browser at runtime.
Angular trusts template code, so dynamically generating templates and compiling them, in particular templates containing user data, circumvents Angular's built-in protections. This is a security anti-pattern.
For information about dynamically constructing forms in a safe way, see the [Dynamic Forms](guide/dynamic-form) guide.

AOT 编译器的替代方法是 JIT 编译器，它可以在运行时将模板编译为浏览器中的可执行模板代码。Angular 信任这些模板代码，因此动态生成模板并进行编译（尤其是包含用户数据的模板）可以规避 Angular 的内置保护就。这是一种安全性方面的反模式。要了解如何以安全方式动态构建表单，请参见[《动态表单》](guide/dynamic-form)指南。

<a id="server-side-xss"></a>

### Server-side XSS protection

### 服务器端 XSS 保护

HTML constructed on the server is vulnerable to injection attacks.
Injecting template code into an Angular application is the same as injecting executable code into the application:
It gives the attacker full control over the application.
To prevent this, use a templating language that automatically escapes values to prevent XSS vulnerabilities on the server.
Don't create Angular templates on the server side using a templating language. This carries a high risk of introducing template-injection vulnerabilities.

在服务器上构造的 HTML 容易受到注入攻击。将模板代码注入到 Angular 应用程序中与注入可执行代码是一样的：它使攻击者可以完全控制该应用程序。为避免这种情况，请使用一种模板语言来自动转义值以防止服务器上的 XSS 漏洞。不要在服务器端使用模板语言生成 Angular 模板。这样做会带来引入模板注入漏洞的高风险。

<a id="http"></a>

<!-- vale Angular.Google_Acronyms = NO -->

## HTTP-level vulnerabilities

## HTTP 级漏洞

Angular has built-in support to help prevent two common HTTP vulnerabilities, cross-site request forgery (CSRF or XSRF) and cross-site script inclusion (XSSI).
Both of these must be mitigated primarily on the server side, but Angular provides helpers to make integration on the client side easier.

Angular 内置了一些支持来防范两个常见的 HTTP 漏洞：跨站请求伪造（XSRF）和跨站脚本包含（XSSI）。这两个漏洞主要在服务器端防范，但是 Angular 也自带了一些辅助特性，可以让客户端的集成变得更容易。

<a id="xsrf"></a>

### Cross-site request forgery

### 跨站请求伪造

In a cross-site request forgery (CSRF or XSRF), an attacker tricks the user into visiting a different web page (such as `evil.com`) with malignant code. This web page secretly sends a malicious request to the application's web server (such as `example-bank.com`).

在跨站请求伪造（XSRF 或 CSRF）中，攻击者欺骗用户，让他们访问一个假冒页面(比如 `evil.com`)。该页面带有恶意代码，秘密的向你的应用程序服务器发送恶意请求(比如 `example-bank.com`)。

Assume the user is logged into the application at `example-bank.com`.
The user opens an email and clicks a link to `evil.com`, which opens in a new tab.

假设用户已经在 `example-bank.com` 登录。用户打开一个邮件，点击里面的链接，在新页面中打开 `evil.com`。

The `evil.com` page immediately sends a malicious request to `example-bank.com`.
Perhaps it's a request to transfer money from the user's account to the attacker's account.
The browser automatically sends the `example-bank.com` cookies, including the authentication cookie, with this request.

该 `evil.com` 页面立刻发送恶意请求到 `example-bank.com`。这个请求可能是从用户账户转账到攻击者的账户。与该请求一起，浏览器自动发出 `example-bank.com` 的 cookie。

If the `example-bank.com` server lacks XSRF protection, it can't tell the difference between a legitimate request from the application and the forged request from `evil.com`.

如果 `example-bank.com` 服务器缺乏 XSRF 保护，就无法辨识请求是从应用程序发来的合法请求还是从 `evil.com` 来的假请求。

To prevent this, the application must ensure that a user request originates from the real application, not from a different site.
The server and client must cooperate to thwart this attack.

为了防止这种情况，你必须确保每个用户的请求都是从你自己的应用中发出的，而不是从另一个网站发出的。客户端和服务器必须合作来抵挡这种攻击。

In a common anti-XSRF technique, the application server sends a randomly created authentication token in a cookie.
The client code reads the cookie and adds a custom request header with the token in all following requests.
The server compares the received cookie value to the request header value and rejects the request if the values are missing or don't match.

常见的反 XSRF 技术是服务器随机生成一个用户认证令牌到 cookie 中。客户端代码获取这个 cookie，并用它为接下来所有的请求添加自定义请求页头。服务器比较收到的 cookie 值与请求页头的值，如果它们不匹配，便拒绝请求。

This technique is effective because all browsers implement the *same origin policy*.
Only code from the website on which cookies are set can read the cookies from that site and set custom headers on requests to that site.
That means only your application can read this cookie token and set the custom header.
The malicious code on `evil.com` can't.

这个技术之所以有效，是因为所有浏览器都实现了*同源策略*。只有设置 cookie 的网站的代码可以访问该站的 cookie，并为该站的请求设置自定义页头。这就是说，只有你的应用程序可以获取这个 cookie 令牌和设置自定义页头。`evil.com` 的恶意代码不能。

Angular's `HttpClient` has built-in support for the client-side half of this technique.
Read about it more in the [HttpClient guide](guide/http#security-xsrf-protection).

Angular 的 `HttpClient` 对这项技术的客户端部分提供了内置的支持要了解更多信息，参阅 [HttpClient 部分](guide/http#security-xsrf-protection)。

For information about CSRF at the Open Web Application Security Project (OWASP), see [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) and [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
The Stanford University paper [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) is a rich source of detail.

可到 "开放式 Web 应用程序安全项目 (OWASP) " 深入了解 CSRF，参阅[Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) 和[Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)。这个斯坦福大学论文 [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) 有详尽的细节。

See also Dave Smith's [talk on XSRF at AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY "Cross Site Request Funkery Securing Your Angular Apps From Evil Doers").

参阅 Dave Smith 在[AngularConnect 2016 关于 XSRF 的演讲](https://www.youtube.com/watch?v=9inczw6qtpY "Cross Site Request Funkery Securing Your Angular Apps From Evil Doers")。

<!-- vale Angular.Google_Acronyms = YES -->

<a id="xssi"></a>

### Cross-site script inclusion (XSSI)

### 跨站脚本包含(XSSI)

Cross-site script inclusion, also known as JSON vulnerability, can allow an attacker's website to read data from a JSON API.
The attack works on older browsers by overriding built-in JavaScript object constructors, and then including an API URL using a `<script>` tag.

跨站脚本包含，也被称为 Json 漏洞，它可以允许一个攻击者的网站从 JSON API 读取数据。这种攻击发生在老的浏览器上，它重写原生 JavaScript 对象的构造函数，然后使用 `<script>` 标签包含一个 API 的 URL。

This attack is only successful if the returned JSON is executable as JavaScript.
Servers can prevent an attack by prefixing all JSON responses to make them non-executable, by convention, using the well-known string `")]}',\n"`.

只有在返回的 JSON 能像 JavaScript 一样可以被执行时，这种攻击才会生效。所以服务端会约定给所有 JSON 响应体加上前缀 `")]}',\n"`，来把它们标记为不可执行的，以防范这种攻击。

Angular's `HttpClient` library recognizes this convention and automatically strips the string `")]}',\n"` from all responses before further parsing.

Angular 的 `HttpClient` 库会识别这种约定，并在进一步解析之前，自动把字符串 `")]}',\n"` 从所有响应中去掉。

For more information, see the XSSI section of this [Google web security blog post](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

要学习更多这方面的知识，请参阅[谷歌 Web 安全博客文章](https://security.googleblog.com/2011/05/website-security-for-webmasters.html)的 XSSI 小节。

<a id="code-review"></a>

## Auditing Angular applications

## 审计 Angular 应用程序

Angular applications must follow the same security principles as regular web applications, and must be audited as such.
Angular-specific APIs that should be audited in a security review, such as the [*bypassSecurityTrust*](guide/security#bypass-security-apis) methods, are marked in the documentation as security sensitive.

Angular 应用应该遵循和常规 Web 应用一样的安全原则并按照这些原则进行审计。Angular 中某些应该在安全评审中被审计的 API（比如[*bypassSecurityTrust*](guide/security#bypass-security-apis) API）都在文档中被明确标记为安全性敏感的。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28