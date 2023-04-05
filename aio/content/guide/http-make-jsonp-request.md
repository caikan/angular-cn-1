# HTTP: Make a JSONP request

“JSON with Padding” (JSONP) is a method to deceive a web browser into carrying out requests with a `<script>` tag that uses the SRC attribute to make a special API request.

Apps can use the `HttpClient` to make [JSONP](https://en.wikipedia.org/wiki/JSONP) requests across domains when a server doesn't support [CORS protocol](https://developer.mozilla.org/docs/Web/HTTP/CORS).

当服务器不支持 [CORS 协议](https://developer.mozilla.org/docs/Web/HTTP/CORS)时，应用程序可以使用 `HttpClient` 跨域发出 [JSONP](https://en.wikipedia.org/wiki/JSONP) 请求。

Angular JSONP requests return an `Observable`.
Follow the pattern for subscribing to observables and use the RxJS `map` operator to transform the response before using the [async pipe](api/common/AsyncPipe) to manage the results.

Angular 的 JSONP 请求会返回一个 `Observable`。遵循订阅可观察对象变量的模式，并在使用 [async 管道](api/common/AsyncPipe)管理结果之前，使用 RxJS `map` 操作符转换响应。

In Angular, use JSONP by including `HttpClientJsonpModule` in the `NgModule` imports.
In the following example, the `searchHeroes()` method uses a JSONP request to query for heroes whose names contain the search term.

在 Angular 中，通过在 `NgModule` 的 `imports` 中包含 `HttpClientJsonpModule` 来使用 JSONP。在以下范例中，`searchHeroes()` 方法使用 JSONP 请求来查询名称包含搜索词的英雄。

<code-example format="typescript" language="typescript">

/* GET heroes whose name contains search term */
searchHeroes(term: string): Observable {
  term = term.trim();

  const heroesURL = `&dollar;{this.heroesURL}?&dollar;{term}`;
  return this.http.jsonp(heroesUrl, 'callback').pipe(
      catchError(this.handleError('searchHeroes', [])) // then handle the error
    );
}

</code-example>

This request passes the `heroesURL` as the first parameter and the callback function name as the second parameter.
The response is wrapped in the callback function, which takes the observables returned by the JSONP method and pipes them through to the error handler.

该请求将 `heroesURL` 作为第一个参数，并将回调函数名称作为第二个参数。响应被包装在回调函数中，该函数接受 JSONP 方法返回的可观察对象，并将它们通过管道传给错误处理程序。

## Request non-JSON data

Not all APIs return JSON data.
In this next example, a `DownloaderService` method reads a text file from the server and logs the file contents, before returning those contents to the caller as an `Observable<string>`.

不是所有的 API 都会返回 JSON 数据。在下面这个例子中，`DownloaderService` 中的方法会从服务器读取文本文件，并把文件的内容记录下来，然后把这些内容使用 `Observable<string>` 的形式返回给调用者。

<code-example header="app/downloader/downloader.service.ts (getTextFile)" linenums="false" path="http/src/app/downloader/downloader.service.ts" region="getTextFile"></code-example>

`HttpClient.get()` returns a string rather than the default JSON because of the `responseType` option.

这里的 `HttpClient.get()` 返回字符串而不是默认的 JSON 对象，因为它的 `responseType` 选项是 `'text'`。

The RxJS `tap` operator lets the code inspect both success and error values passing through the observable without disturbing them.

RxJS 的 `tap` 操作符使代码可以检查通过可观察对象的成功值和错误值，而不会干扰它们。

A `download()` method in the `DownloaderComponent` initiates the request by subscribing to the service method.

在 `DownloaderComponent` 中的 `download()` 方法通过订阅这个服务中的方法来发起一次请求。

<code-example header="app/downloader/downloader.component.ts (download)" linenums="false" path="http/src/app/downloader/downloader.component.ts" region="download"></code-example>

<a id="error-handling"></a>

@reviewed 2022-11-03
