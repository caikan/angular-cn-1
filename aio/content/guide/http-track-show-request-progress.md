# HTTP - Track and show request progress

Sometimes applications transfer large amounts of data and those transfers can take a long time. File uploads are a typical example. You can give the users a better experience by providing feedback on the progress of such transfers.

应用程序有时会传输大量数据，而这些传输可能要花很长时间。文件上传就是典型的例子。你可以通过提供关于此类传输的进度反馈，为用户提供更好的体验。

## Make a request

To make a request with progress events enabled, create an instance of `HttpRequest` with the `reportProgress` option set true to enable tracking of progress events.

要想发出一个带有进度事件的请求，你可以创建一个 `HttpRequest` 实例，并把 `reportProgress` 选项设置为 true 来启用对进度事件的跟踪。

<code-example header="app/uploader/uploader.service.ts (upload request)" path="http/src/app/uploader/uploader.service.ts" region="upload-request"></code-example>

<div class="alert is-important">

**TIP**: <br />
Every progress event triggers change detection, so only turn them on if you need to report progress in the UI.

When using `HttpClient.request()` with an HTTP method, configure the method with `observe: 'events'` to see all events, including the progress of transfers.

</div>

## Track request progress

Next, pass this request object to the `HttpClient.request()` method, which returns an `Observable` of `HttpEvents` \(the same events processed by [interceptors](guide/http-intercept-requests-and-responses#interceptor-events)\).

<code-example header="app/uploader/uploader.service.ts (upload body)" path="http/src/app/uploader/uploader.service.ts" region="upload-body"></code-example>

The `getEventMessage` method interprets each type of `HttpEvent` in the event stream.

`getEventMessage` 方法解释了事件流中每种类型的 `HttpEvent`。

<code-example header="app/uploader/uploader.service.ts (getEventMessage)" path="http/src/app/uploader/uploader.service.ts" region="getEventMessage"></code-example>

<div class="alert is-helpful">

The sample app for this guide doesn't have a server that accepts uploaded files.
The `UploadInterceptor` in `app/http-interceptors/upload-interceptor.ts` intercepts and short-circuits upload requests by returning an observable of simulated events.

</div>

@reviewed 2023-02-27
