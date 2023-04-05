# Service worker in production

# 生产环境下的 Service Worker

This page is a reference for deploying and supporting production applications that use the Angular service worker.
It explains how the Angular service worker fits into the larger production environment, the service worker's behavior under various conditions, and available resources and fail-safes.

本页讲的是如何使用 Angular Service Worker 发布和支持生产环境下的应用。它解释了 Angular Service Worker 如何满足大规模生产环境的需求、Service Worker 在多种条件下有哪些行为以及有哪些可用的资源和故障保护机制。

## Prerequisites

## 前提条件

A basic understanding of the following:

对下列知识有基本的了解：

* [Service Worker Communication](guide/service-worker-communications)

  [与 Service Worker 通讯](guide/service-worker-communications).

## Service worker and caching of application resources

## Service Worker 与应用资源的缓存

Imagine the Angular service worker as a forward cache or a Content Delivery Network (CDN) edge that is installed in the end user's web browser.
The service worker responds to requests made by the Angular application for resources or data from a local cache, without needing to wait for the network.
Like any cache, it has rules for how content is expired and updated.

你可以把 Angular Service Worker 想象成一个转发式缓存或装在最终用户浏览器中的 CDN（内容分发网络）边缘。Service Worker 的工作是从本地缓存中响应 Angular 应用对资源或数据的请求，而不用等待网络。和所有缓存一样，它有一些规则来决定内容该如何过期或更新。

<a id="versions"></a>

### Application versions

### 应用的版本

In the context of an Angular service worker, a "version" is a collection of resources that represent a specific build of the Angular application.
Whenever a new build of the application is deployed, the service worker treats that build as a new version of the application.
This is true even if only a single file is updated.
At any given time, the service worker might have multiple versions of the application in its cache and it might be serving them simultaneously.
For more information, see the [Application tabs](guide/service-worker-devops#tabs) section.

在 Angular Service Worker 的语境下，“版本”是指用来表示 Angular 应用的某一次构建成果的一组资源。当应用的一个新的构建发布时，Service Worker 就把它看做此应用的一个新版本。就算只修改了一个文件，也同样如此。在任何一个给定的时间，Service Worker 可能会在它的缓存中拥有此应用的多个版本，这几个版本也都能用于提供服务。要了解更多，参阅 [App 选项卡](guide/service-worker-devops#tabs)。

To preserve application integrity, the Angular service worker groups all files into a version together.
The files grouped into a version usually include HTML, JS, and CSS files.
Grouping of these files is essential for integrity because HTML, JS, and CSS files frequently refer to each other and depend on specific content.
For example, an `index.html` file might have a `<script>` tag that references `bundle.js` and it might attempt to call a function `startApp()` from within that script.
Any time this version of `index.html` is served, the corresponding `bundle.js` must be served with it.
For example, assume that the `startApp()` function is renamed to `runApp()` in both files.
In this scenario, it is not valid to serve the old `index.html`, which calls `startApp()`, along with the new bundle, which defines `runApp()`.

要保持应用的整体性，Angular Service Worker 会用所有的文件共同组成一个版本。组成版本的这些文件通常包括 HTML、JS 和 CSS 文件。把这些文件分成一组是至关重要的，因为它们会互相引用，并且依赖于一些特定内容。比如，`index.html` 文件可能有个引用 `bundle.js` 的 `<script>` 标签，它可能会试图从这个脚本中调用一个 `startApp()` 函数。任何时候，只要这个版本的 `index.html` 被提供了，与它对应的 `bundle.js` 也必须同时提供。这种情况下，使用调用了 `startApp()` 的老的 `index.html` 并同时使用定义了 `runApp()` 的新 bundle 就是无效的。

This file integrity is especially important when lazy loading modules.
A JS bundle might reference many lazy chunks, and the filenames of the lazy chunks are unique to the particular build of the application.
If a running application at version `X` attempts to load a lazy chunk, but the server has already updated to version `X + 1`, the lazy loading operation fails.

当使用惰性加载模块时，文件的整体性就显得格外重要。某个 JS 包可能引用很多惰性块，而这些惰性块的文件名在应用的每次特定的构建中都是唯一的。如果运行应用的 `X` 版本视图加载一个惰性块，但该块的服务器已经升级到了 `X + 1` 版本，这次惰性加载操作就会失败。

The version identifier of the application is determined by the contents of all resources, and it changes if any of them change.
In practice, the version is determined by the contents of the `ngsw.json` file, which includes hashes for all known content.
If any of the cached files change, the file's hash changes in `ngsw.json`. This change causes the Angular service worker to treat the active set of files as a new version.

本应用的版本标识符由其所有资源的内容决定，如果它们中的任何一个发生了变化，则版本标识符也随之改变。实际上，版本是由 `ngsw.json` 文件的内容决定的，包含了所有已知内容的哈希值。如果任何一个被缓存的文件发生了变化，则该文件的哈希也将在 `ngsw.json` 中随之变化，从而导致 Angular Service Worker 将这个活动文件的集合视为一个新版本。

<div class="alert is-helpful">

The build process creates the manifest file, `ngsw.json`, using information from `ngsw-config.json`.

此构建过程会使用来自 `ngsw-config.json` 的信息创建清单文件（`ngsw.json`）。

</div>

With the versioning behavior of the Angular service worker, an application server can ensure that the Angular application always has a consistent set of files.

借助 Angular Service Worker 的这种版本控制行为，应用服务器就可以确保这个 Angular 应用中的这组文件始终保持一致。

#### Update checks

#### 更新检测

Every time the user opens or refreshes the application, the Angular service worker checks for updates to the application by looking for updates to the `ngsw.json` manifest.
If an update is found, it is downloaded and cached automatically, and is served the next time the application is loaded.

每当用户打开或刷新应用程序时，Angular Service Worker 都会通过查看清单（manifest）文件 “ngsw.json” 的更新来检查该应用程序的更新。如果它找到了更新，就会自动下载并缓存这个版本，并在下次加载应用程序时提供。

### Resource integrity

### 资源整体性

One of the potential side effects of long caching is inadvertently caching a resource that's not valid.
In a normal HTTP cache, a hard refresh or the cache expiring limits the negative effects of caching a file that's not valid.
A service worker ignores such constraints and effectively long-caches the entire application.
It's important that the service worker gets the correct content, so it keeps hashes of the resources to maintain their integrity.

长周期缓存的潜在副作用之一就是可能无意中缓存了无效的资源。在普通的 HTTP 缓存中，硬刷新或缓存过期限制了缓存这种无效文件导致的负面影响。而 Service Worker 会忽略这样的约束，事实上会对整个应用程序进行长期缓存。因此，让 Service Worker 获得正确的内容就显得至关重要，所以它会保持这些资源的哈希值，以维护其完整性。

#### Hashed content

#### 哈希内容

To ensure resource integrity, the Angular service worker validates the hashes of all resources for which it has a hash.
For an application created with the [Angular CLI](cli), this is everything in the `dist` directory covered by the user's `src/ngsw-config.json` configuration.

为了确保资源的整体性，Angular Service Worker 会验证所有带哈希的资源的哈希值。通常，对于 [Angular CLI](cli) 应用程序，用户的 `src/ngsw-config.json` 配置文件中会涵盖 `dist` 目录下的所有内容。

If a particular file fails validation, the Angular service worker attempts to re-fetch the content using a "cache-busting" URL parameter to prevent browser or intermediate caching.
If that content also fails validation, the service worker considers the entire version of the application to not be valid and stops serving the application.
If necessary, the service worker enters a safe mode where requests fall back on the network. The service worker doesn't use its cache if there's a high risk of serving content that is broken, outdated, or not valid.

如果某个特定的文件未能通过验证，Angular Service Worker 就会尝试用 “cache-busting” URL 为参数重新获取内容，以消除浏览器或中间缓存的影响。如果该内容也未能通过验证，则 Service Worker 会认为该应用的整个版本都无效，并停止用它提供服务。如有必要，Service Worker 会进入安全模式，这些请求将退化为直接访问网络。如果服务无效、损坏或内容过期的风险很高，则会选择不使用缓存。

Hash mismatches can occur for a variety of reasons:

导致哈希值不匹配的原因有很多：

* Caching layers between the origin server and the end user could serve stale content

  在源服务器和最终用户之间缓存图层可能会提供陈旧的内容。

* A non-atomic deployment could result in the Angular service worker having visibility of partially updated content

  非原子化的部署可能会导致 Angular Service Worker 看到部分更新后的内容。

* Errors during the build process could result in updated resources without `ngsw.json` being updated.
  The reverse could also happen resulting in an updated `ngsw.json` without updated resources.

  构建过程中的错误可能会导致更新了资源，却没有更新 `ngsw.json`。反之，也可能发生没有更新资源，却更新了 `ngsw.json` 的情况。

#### Unhashed content

#### 不带哈希的内容

The only resources that have hashes in the `ngsw.json` manifest are resources that were present in the `dist` directory at the time the manifest was built.
Other resources, especially those loaded from CDNs, have content that is unknown at build time or are updated more frequently than the application is deployed.

`ngsw.json` 清单中唯一带哈希值的资源就是构建清单时 `dist` 目录中的资源。而其它资源，特别是从 CDN 加载的资源，其内容在构建时是未知的，或者会比应用程序部署得更频繁。

If the Angular service worker does not have a hash to verify a resource is valid, it still caches its contents. At the same time, it honors the HTTP caching headers by using a policy of *stale while revalidate*.
The Angular service worker continues to serve a resource even after its HTTP caching headers indicate
that it is no longer valid. At the same time, it attempts to refresh the expired resource in the background.
This way, broken unhashed resources do not remain in the cache beyond their configured lifetimes.

如果 Angular Service Worker 没有哈希可以验证给定的资源，它仍然会缓存它的内容，但会使用 “重新验证时失效” 的策略来承认 HTTP 缓存头。也就是说，即使被缓存资源的 HTTP 缓存头指出该资源已不再有效，Angular Service Worker 仍然会继续提供内容。同时它会在后台刷新资源。这样，那些被破坏的非哈希资源留在缓存中的时间就不会超出为它配置的生命周期。

<a id="tabs"></a>

### Application tabs

### App 选项卡

It can be problematic for an application if the version of resources it's receiving changes suddenly or without warning.
See the [Application versions](guide/service-worker-devops#versions) section for a description of such issues.

如果应用程序的资源版本突然发生了变化或没有给出警告，就可能会有问题。关于这些问题的描述，请参阅前面的 [版本](guide/service-worker-devops#versions) 部分。

The Angular service worker provides a guarantee: a running application continues to run the same version of the application.
If another instance of the application is opened in a new web browser tab, then the most current version of the application is served.
As a result, that new tab can be running a different version of the application than the original tab.

Angular Service Worker 会保证：正在运行的应用程序会继续运行和当前应用相同的版本。而如果在新的 Web 浏览器选项卡中打开了该应用的另一个实例，则会提供该应用的最新版本。因此，这个新标签可以和原始标签同时运行不同版本的应用。

<div class="alert is-important">

**IMPORTANT**: <br />
This guarantee is **stronger** than that provided by the normal web deployment model.
Without a service worker, there is no guarantee that lazily loaded code is from the same version as the application's initial code.

**重要**：<br />
这种担保比普通的 Web 部署模型提供的担保还要**更强一点**。
如果没有 Service Worker，则不能保证稍后在这个惰性加载的代码
和其初始代码的版本是一样的。

</div>

The Angular service worker might change the version of a running application under error conditions such as:

Angular Service Worker 可能会在错误条件下更改正在运行的应用程序的版本，例如：

* The current version becomes non-valid due to a failed hash

  由于哈希失败，当前版本变得无效

* An unrelated error causes the service worker to enter safe mode and deactivates it temporarily

  不相关的错误导致 Service Worker 进入安全模式并暂时停用它

The Angular service worker cleans up application versions when no tab is using them.

当没有标签页使用它们时，Angular Service Worker 会清理应用版本。

Other reasons the Angular service worker might change the version of a running application are normal events:

另一些可能导致 Angular Service Worker 在运行期间改变版本的因素是一些正常事件：

* The page is reloaded/refreshed

  页面被重新加载/刷新。

* The page requests an update be immediately activated using the `SwUpdate` service

  该页面通过 `SwUpdate` 服务请求立即激活这个更新。

### Service worker updates

### Service Worker 更新

The Angular service worker is a small script that runs in web browsers.
From time to time, the service worker is updated with bug fixes and feature improvements.

Angular Service Worker 是一个运行在 Web 浏览器中的小脚本。有时，这个 Service Worker 也可能会需要更新，以修复错误和增强特性。

The Angular service worker is downloaded when the application is first opened and when the application is accessed after a period of inactivity.
If the service worker changes, it's updated in the background.

首次打开应用时或在一段非活动时间之后再访问应用程序时，就会下载 Angular Service Worker。如果 Service Worker 发生了变化，就会在后台进行更新。

Most updates to the Angular service worker are transparent to the application. The old caches are still valid and content is still served normally.
Occasionally, a bug fix or feature in the Angular service worker might require the invalidation of old caches.
In this case, the service worker transparently refreshes the application from the network.

Angular Service Worker 的大部分更新对应用程序来说都是透明的。旧缓存仍然有效，其内容仍然能正常使用。但是，在 Angular Service Worker 中可能偶尔会有错误修复或新功能，需要让旧的缓存失效。这时，应用程序就从会网络上透明地进行刷新。

### Bypassing the service worker

### 绕过 Service Worker

In some cases, you might want to bypass the service worker entirely and let the browser handle the request.
An example is when you rely on a feature that is currently not supported in service workers, such as [reporting progress on uploaded files](https://github.com/w3c/ServiceWorker/issues/1141).

某些情况下，你可能想要完全绕过 Service Worker，转而让浏览器处理请求。比如当你要用到某些 Service Worker 尚不支持的特性时（比如[报告文件上传的进度](https://github.com/w3c/ServiceWorker/issues/1141)）。

To bypass the service worker, set `ngsw-bypass` as a request header, or as a query parameter.
The value of the header or query parameter is ignored and can be empty or omitted.

要想绕过 Service Worker，你可以设置一个名叫 `ngsw-bypass` 的请求头或查询参数。这个请求头或查询参数的值会被忽略，可以把它设为空字符串或略去。

### Service worker requests when the server can't be reached

### 无法访问服务器时的 Service Worker 请求

The service worker processes all requests unless the [service worker is explicitly bypassed](#bypassing-the-service-worker).
The service worker either returns a cached response or sends the request to the server, depending on the state and configuration of the cache. 
The service worker only caches responses to non-mutating requests, such as `GET` and `HEAD`.

除非[显式绕过 Service Worker](#bypassing-the-service-worker)，否则 Service Worker 会处理所有请求。根据缓存的状态和配置，Service Worker 可以返回缓存的响应或将请求发送到服务器。Service Worker 仅缓存对非修改型请求的响应，例如 `GET` 和 `HEAD`。

If the service worker receives an error from the server or it doesn't receive a response, it returns an error status that indicates the result of the call.
For example, if the service worker doesn't receive a response, it creates a [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) status to return. The `504` status in this example could be returned because the server is offline or the client is disconnected.

如果 Service Worker 收到来自服务器的错误或没有收到响应，它会返回一个错误状态，以表明调用的结果。例如，如果 Service Worker 没有收到响应，它会创建并返回一个 [504 Gateway Timeout](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/504) 状态。此示例中的 `504` 状态可能是因为服务器脱机或客户端已断开连接而返回的。

## Debugging the Angular service worker

## 调试 Angular Service Worker

Occasionally, it might be necessary to examine the Angular service worker in a running state to investigate issues or whether it's operating as designed.
Browsers provide built-in tools for debugging service workers and the Angular service worker itself includes useful debugging features.

偶尔，可能会需要检查运行中的 Angular Service Worker，以调查问题或确保它在按设计运行。浏览器提供了用于调试 Service Worker 的内置工具，而且 Angular Service Worker 本身也包含了一些有用的调试功能。

### Locating and analyzing debugging information

### 定位并分析调试信息

The Angular service worker exposes debugging information under the `ngsw/` virtual directory.
Currently, the single exposed URL is `ngsw/state`.
Here is an example of this debug page's contents:

Angular Service Worker 会在虚拟目录 `ngsw/` 下暴露出调试信息。目前，它暴露的唯一的 URL 是 `ngsw/state`。下面是这个调试页面中的一段范例内容：

<code-example format="output" hideCopy language="shell">

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 &ast; init post-load (update, cleanup)

Debug log:

</code-example>

#### Driver state

#### 驱动程序的状态

The first line indicates the driver state:

第一行表示驱动程序的状态：

<code-example format="output" hideCopy language="shell">

Driver state: NORMAL ((nominal))

</code-example>

`NORMAL` indicates that the service worker is operating normally and is not in a degraded state.

`NORMAL` 表示这个 Service Worker 正在正常运行，并且没有处于降级运行的状态。

There are two possible degraded states:

有两种可能的降级状态：

| Degraded states         | Details                                                                                                                                                                                                                                                                                                                                                                                                                       |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 降级状态                | 详情                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `EXISTING_CLIENTS_ONLY` | The service worker does not have a clean copy of the latest known version of the application. Older cached versions are safe to use, so existing tabs continue to run from cache, but new loads of the application will be served from the network. The service worker will try to recover from this state when a new version of the application is detected and installed. This happens when a new `ngsw.json` is available. |
| `EXISTING_CLIENTS_ONLY` | Service Worker 没有应用的最新已知版本的干净副本。较旧的缓存版本可以安全使用，因此现有的选项卡会继续从缓存中运行，但应用中的新加载将由网络提供。当检测到并安装好新版本的应用程序时，Service Worker 将尝试从此状态恢复。当有新的 `ngsw.json` 可用时，会发生这种情况。                                                                                                                                                           |
| `SAFE_MODE`             | The service worker cannot guarantee the safety of using cached data. Either an unexpected error occurred or all cached versions are invalid. All traffic will be served from the network, running as little service worker code as possible.                                                                                                                                                                                  |
| `SAFE_MODE`             | Service Worker 不能保证使用缓存数据的安全性。发生了意外错误或所有缓存版本都无效。这时所有的流量都将从网络提供，尽量少运行 Service Worker 中的代码。                                                                                                                                                                                                                                                                           |

In both cases, the parenthetical annotation provides the
error that caused the service worker to enter the degraded state.

在这两种情况下，后面的括号注解中都会提供导致 Service Worker 进入降级状态的错误信息。

Both states are temporary; they are saved only for the lifetime of the [ServiceWorker instance](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope).
The browser sometimes terminates an idle service worker to conserve memory and processor power, and creates a new service worker instance in response to network events.
The new instance starts in the `NORMAL` mode, regardless of the state of the previous instance.

这两种状态都是暂时的；它们仅在 [ServiceWorker 实例](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) 的生命周期内保存。 浏览器有时会终止空闲的 Service Worker，以节省内存和处理能力，并创建一个新的 Service Worker 实例来响应网络事件。 无论先前实例的状态如何，新实例均以 `NORMAL` 模式启动。

#### Latest manifest hash

#### 最新清单的哈希

<code-example format="output" hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</code-example>

This is the SHA1 hash of the most up-to-date version of the application that the service worker knows about.

这是 Service Worker 所知道的应用最新版本的 SHA1 哈希值。

#### Last update check

#### 最后一次更新检查

<code-example format="output" hideCopy language="shell">

Last update check: never

</code-example>

This indicates the last time the service worker checked for a new version, or update, of the application.
`never` indicates that the service worker has never checked for an update.

这表示 Service Worker 最后一次检查应用程序的新版本或更新的时间。“never” 表示 Service Worker 从未检查过更新。

In this example debug file, the update check is currently scheduled, as explained the next section.

在这个调试文件范例中，这次更新检查目前是已排期的，如下一节所述。

#### Version

#### 版本

<code-example format="output" hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</code-example>

In this example, the service worker has one version of the application cached and being used to serve two different tabs.

在这个例子中，Service Worker 拥有一个版本的应用程序缓存并用它服务于两个不同的选项卡。

<div class="alert is-helpful">

**NOTE**: <br />
This version hash is the "latest manifest hash" listed above.
Both clients are on the latest version.
Each client is listed by its ID from the `Clients` API in the browser.

**注意**：<br/>
这个版本哈希值是上面列出的“最新清单的哈希”。
它的两个客户运行的都是最新版本。每个客户都用浏览器中 `Clients` API 的 ID 列了出来。

</div>

#### Idle task queue

#### 空闲任务队列

<code-example format="output" hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:
 &ast; init post-load (update, cleanup)

</code-example>

The Idle Task Queue is the queue of all pending tasks that happen in the background in the service worker.
If there are any tasks in the queue, they are listed with a description.
In this example, the service worker has one such task scheduled, a post-initialization operation involving an update check and cleanup of stale caches.

空闲任务队列是 Service Worker 中所有在后台发生的未决任务的队列。如果这个队列中存在任何任务，则列出它们的描述。在这个例子中，Service Worker 安排的任务是一个用于更新检查和清除过期缓存的后期初始化操作。

The last update tick/run counters give the time since specific events happened related to the idle queue.
The "Last update run" counter shows the last time idle tasks were actually executed.
"Last update tick" shows the time since the last event after which the queue might be processed.

最后的 tick/run 计数器给出了与特定事件发生有关的空闲队列中的时间。“Last update run” 计数器显示的是上次执行空闲任务的时间。“Last update tick” 显示的是自上次事件以来可能要处理的队列的时间。

#### Debug log

#### 调试日志

<code-example format="output" hideCopy language="shell">

Debug log:

</code-example>

Errors that occur within the service worker are logged here.

Service Worker 中发生的错误会记录在此。

### Developer tools

### 开发者工具

Browsers such as Chrome provide developer tools for interacting with service workers.
Such tools can be powerful when used properly, but there are a few things to keep in mind.

Chrome 等浏览器提供了能与 Service Worker 交互的开发者工具。这些工具在使用得当时非常强大，但也要牢记一些事情。

* When using developer tools, the service worker is kept running in the background and never restarts.
  This can cause behavior with Dev Tools open to differ from behavior a user might experience.

  使用开发人员工具时，Service Worker 将继续在后台运行，并且不会重新启动。这可能会导致开着 Dev Tools 时的行为与用户实际遇到的行为不一样。

* If you look in the Cache Storage viewer, the cache is frequently out of date.
  Right-click the Cache Storage title and refresh the caches.

  如果你查看缓存存储器的查看器，缓存就会经常过期。右键单击缓存存储器的标题并刷新缓存。

* Stopping and starting the service worker in the Service Worker pane checks for updates

  在 Service Worker 页停止并重新启动这个 Service Worker 将会触发一次更新检查。

## Service worker safety

## Service Worker 的安全性

Bugs or broken configurations could cause the Angular service worker to act in unexpected ways.
If this happens, the Angular service worker contains several failsafe mechanisms in case an administrator needs to deactivate the service worker quickly.

错误或损坏的配置可能会导致 Angular Service Worker 以不可预知的方式工作。如果出现了这种情况，管理员需要快速停用 Service Worker，Angular Service Worker 也包含多种故障保护机制。

### Fail-safe

### 故障保护机制

To deactivate the service worker, rename the `ngsw.json` file or delete it.
When the service worker's request for `ngsw.json` returns a `404`, then the service worker removes all its caches and de-registers itself, essentially self-destructing.

要停用 Service Worker，请删除或重命名 `ngsw.json` 文件。当 Service Worker 对 `ngsw.json` 的请求返回 `404` 时，Service Worker 就会删除它的所有缓存并注销自己，本质上就是自毁。

### Safety worker

### 安全工作者

<!-- vale Angular.Google_Acronyms = NO -->

A small script, `safety-worker.js`, is also included in the `@angular/service-worker` NPM package.
When loaded, it un-registers itself from the browser and removes the service worker caches.
This script can be used as a last resort to get rid of unwanted service workers already installed on client pages.

`@angular/service-worker` NPM 包中还包含一个小脚本 `safety-worker.js`。当加载它时，就会把它从浏览器中注销，并移除此 Service Worker 的缓存。这个脚本可以作为终极武器来摆脱那些已经安装在客户端页面上的不想要的 Service Worker。

<!-- vale Angular.Google_Acronyms = YES -->

<div class="alert is-important">

**IMPORTANT**: <br />
You cannot register this worker directly, as old clients with cached state might not see a new `index.html` which installs the different worker script.

**重要**：<br />
你不能直接注册这个 Safety Worker，因为具有已缓存状态的旧客户端可能无法看到一个新的、用来安装 另一个 worker 脚本的 `index.html`。

</div>

Instead, you must serve the contents of `safety-worker.js` at the URL of the Service Worker script you are trying to unregister. You must continue to do so until you are certain all users have successfully unregistered the old worker.
For most sites, this means that you should serve the safety worker at the old Service Worker URL forever.
This script can be used to deactivate `@angular/service-worker` and remove the corresponding caches. It also removes any other Service Workers which might have been served in the past on your site.

你必须在想要注销的 Service Worker 脚本的 URL 中提供 `safety-worker.js` 的内容，
而且必须持续这样做，直到确定所有用户都已成功注销了原有的 Worker。
对大多数网站而言，这意味着你应该永远为旧的 Service Worker URL 提供 这个 Safety Worker。
这个脚本可以用来停用 `@angular/service-worker`（并移除相应的缓存）以及任何其它曾在你的站点上提供过的 Service Worker。

### Changing your application's location

### 更改应用的位置

<div class="alert is-important">

**IMPORTANT**: <br />
Service workers don't work behind redirect.
You might have already encountered the error `The script resource is behind a redirect, which is disallowed`.

**重要**：<br />
Service Worker 无法在重定向后工作。你可能已经遇到过这种错误：`The script resource is behind a redirect, which is disallowed`。

</div>

This can be a problem if you have to change your application's location.
If you set up a redirect from the old location, such as `example.com`, to the new location, `www.example.com` in this example, the worker stops working.
Also, the redirect won't even trigger for users who are loading the site entirely from Service Worker.
The old worker, which was registered at `example.com`, tries to update and sends a request to the old location `example.com`. This request is redirected to the new location `www.example.com` and creates the error: `The script resource is behind a redirect, which is disallowed`.

如果你不得不更改应用的位置，就可能会出现问题。如果你设置了从旧位置（比如 `example.com`）到新位置（比如 `www.example.com`）的重定向，则 Service Worker 将停止工作。同样，对于完全从 Service Worker 加载该网站的用户，甚至都不会触发重定向。老的 Worker（注册在 `example.com`）会尝试更新并将请求发送到原来的位置 `example.com`，该位置重定向到新位置 `www.example.com` 就会导致错误 `The script resource is behind a redirect, which is disallowed`。

To remedy this, you might need to deactivate the old worker using one of the preceding techniques: [Fail-safe](#fail-safe) or [Safety Worker](#safety-worker).

为了解决这个问题，你可能需要用上述技巧（[故障安全](#fail-safe)或[Safety Worker](#safety-worker)）之一移除老的 Worker。

## More on Angular service workers

## 关于 Angular Service Worker 的更多信息

You might also be interested in the following:

你可能还对下列内容感兴趣：

* [Service Worker Configuration](guide/service-worker-config)

  [Service Worker 配置](guide/service-worker-config)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
