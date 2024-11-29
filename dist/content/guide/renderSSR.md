---
title: "Server Side Rendering (SSR)"
---

# Server Side Rendering

Server-side Rendering (SSR) is a technique where pages returned from a server
include the fully populated and loaded data of the page - and not just a 
"skeleton" HTML page that's later populated by page scripts.

## Considerations for SSR

SSR has it's pros and cons and its use should be carefully considered.

Benefits of SSR include:

* Improved SEO - some search engines can't properly index single-page apps because the crawler
  only sees the empty "skeleton" page and not the content that should be indexed.
* Support for per-page social media meta information (Open Graph tags, Twitter cards)
* Faster initial appearance - because the page is downloaded fully populated, the page can 
  be presented sooner by the browser

Downsides of SSR include:

* Increased complexity
* All scripts and dependent libraries need to be able to run on client and server
* Additional load on the server

Often the main quoted reason for SSR is improved SEO however most major search engines
can now run page scripts and "see" the fully populated version of a page without using SSR.

A perhaps more important reason for SSR is for the inclusion of per-page social
media meta tags - in which case a simpler solution may be to just provide those 
on a per-URL basis rather than server side rendering the entire page.

While there are valid reasons for wanting full SSR you should consider your requirements
carefully as it does add quite a bit of complexity - although we've tried to
make it as easy as possible with CodeOnly.

Some things to consider:

* If your app's content is only available to authenticated users there's no point using
  SSR for improved SEO - the web crawler can't see your content anyway.

* If your app's content is static, or mostly static (eg: a blog, or documentation site)
  that is infrequently updated a better choice might be [static site generation (SSG)](renderSSG)

* If your app's content is publicly accessible, dynamically changing and requires good 
  SEO or social media meta info, then SSR may be the correct choice.


## Technical Concepts

CodeOnly includes support for rendering HTML on a server where requests
for page URLs need to return fully populated and rendered HTML pages.

The idea here is to use the same JavaScript components as used on the client
to also render HTML on the server.

When rendering on a server, special consideration needs to be given to:

* Rendering multiple pages concurrently

* Isolating multiple apps from each other 

  eg: suppose you use different apps for authenticated vs non-authenticates users - 
  anything that's global (eg: `css()` style sheet declarations, route handlers, etc...)
  needs to be kept separate.

* Waiting for async routing and async data loads to complete before rendering.

  eg: if a page loads async data, the server needs to wait for the page to finish
  loading that data before rendering.


## Quick Start

The sections below describe how to set up server side rendering. 

To quickly get started the code generator can generate a project already 
configured for SSR.

With NodeJS installed, from a command line run:

```
npx codeonlyjs/cogent new fullstack MyApp
```

By default the project is generated with SSR disabled.  To enable it, open
the `server/config.js` file, and set the `ssr` option to `true`.

To confirm it's working:

1. Run the project (eg: `npm run dev`)
2. View the site in a browser (typically `http://localhost:3000`)
3. Right click and choose "View Source"
4. Check that the page content has been rendered and is present in the 
   source HTML.

Most of the code relating to SSR can be found in these files:

* `server/server.js` (search for "ssr")
* `client/main_ssr.js` (the main entry point when running on the server)

Note that when using SSR, the code in the `client/` directory runs on
both the client and the server.


## SSRWorker Classes

There are two classes to support server side rendering:

* `SSRWorker` - the main class responsible for loading and rendering components
  and pages

* `SSRWorkerThread` - a wrapper that runs an `SSRWorker` instance on a worker thread.

Both classes have identical APIs with the only difference being that `SSRWorkerThread` 
loads an instance of `SSRWorker` on a NodeJS Worker thread and marshals calls to it.

Worker threads are the mechanism used to keep multiple server-side apps isolated.

To use the `SSRWorkerThread` class, first create an instance and call its `init` method:

```js
import { SSRWorkerThread } from "@codeonlyjs/core";

// Create and initialize worker thread
let worker = new SSRWorkerThread();
await worker.init({
    entryFile: path.join(__dirname, "../client/main_ssr.js"), 
    entryMain: "main_ssr",
    entryHtml,
});
```

The `init()` method takes an object with the following parameters:

* `entryFile` - the name of the main `.js` entry point into the server-side 
  version of the application (see below for an example)
* `entryMain` - the name of the exported entry point function in `entryFile`
* `entryHtml` - the app's `index.html` file loaded to a string


## `entryFile` and `entryMain`

Client side apps typically have an entry point that's called from 
`index.html` to create and mount the main component, start the router etc...

`Main.js`:

```js
export async function main()
{
    new Main().mount("body");
    router.start();
}
```

In the case of server side rendering, the entry point often needs to be slightly 
different and is specified using the `entryFile` and `entryMain` options
passed to the `SSRWorker`'s `init` method:

`main_ssr.js`:

```js
import fetch from "node-fetch-native";
import { Main } from "./Main.js";

globalThis.fetch = fetch;

export function main_ssr()
{
    new Main().mount("body");
}
```

Note the following:

* The same `Main` component is constructed and mounted to the `body` element
* The router doesn't need to be started as this is managed by the `SSRWorker`
* Any server-only module dependencies can be loaded here.  In the above example
  it imports `node-fetch-native` and attaches it to `globalThis`, making it
  available to other parts of the application when running on the server, 
  just as it would be in a browser.


## `entryHtml`

In a browser environment, the entry point is called directly from the `index.html` 
file.  In a server environment we need to specify the `index.html` as an HTML string
into which the mounted components will be inserted to produce the final rendered 
version of the page.

Often the `entryHtml` file will be the same `client/index.html` file
loaded into a string:

```js
let entryHtml = await fs.readFile(path.join(__dirname, "../client/index.html"), "utf8");
```



## Use with Bundle Free

If your server uses Bundle Free, you'll also want to inject the import maps and other 
changes it provides into the `entryHtml` string.

This can be managed by setting up the Bundle Free middleware slightly differently:

1. Capture a reference to the middleware for later use (see the `bf` variable in 
   the following example)
2. Set the `spa` option to `false` - since we'll be handling page loads ourself
3. Set the `default` option to `false` - to prevent automatically loading `index.html`
   on directory URL requests.
4. Be sure to do this for both "production" and "development" modes.


```js
let bf;
if (app.get('env') === 'production')
{
    // Production
    app.use(bf = bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: false, /* i: disable SPA */
        default: false, /* i: disable index.html */
    }));
}
else
{
    // Development
    app.use(bf = bundleFree({
        path: path.join(__dirname, "../client"),
        spa: false, /* i: disable SPA */
        default: false, /* i: disable index.html */
        modules: [ 
            "@codeonlyjs/core",
        ],
        replace: [
            { from: "./Main.js", to: "/Main.js" },
        ],
        // etc..
    }));
}
```

We can now call `bf.patch_html_file` to load the html file and inject the import maps
and other changes into the HTML content:

```js
// Load index.html and inject import maps etc...
let entryHtml = await bf.patch_html_file(
    "",  /* i: base subpath if necessary */
    path.join(bf.options.path, "index.html") /* i: in either ../client or ../client/dist */
);
```

## Rendering

Once the worker has been constructed and initialized, you can render pages
using the `render` method, passing the URL of the page to be rendered:

```js
let html = await worker.render(url.href);
```

The `render` method performs the following steps:

1. Sets up an `AsyncStorage` for the request with a new SSR environment 
   instance specific to this request. This allows multiple requests to run 
   concurrently while still being isolated from each other.
2. Sets up an SSR router driver with the requested URL
3. Calls the `entryMain` function in `entryFile` (ie: the entry point into
   your application).
4. Invokes the router to load the URL
5. Waits for any async route and data loads to complete
6. Ensures any invalidated components are updated
7. Injects the rendered HTML of all mounted components and registered CSS 
   styles into `entryHtml`.
8. Returns the final HTML string


## ExpressJS Page Rendering

If you're using ExpressJS as the server framework library, installing an SSR page 
rendering route handler can be done as follows.

This should be done after all other route handlers as we want to handle all 
unknown URL's using the client application (assuming we're using normal URL paths 
and not hashed URL paths).

```js
import { prettyHtml } from "@codeonlyjs/core";

// SPA handler
app.get(/\/.*/, async (req, res, next) => {

    // Only if asking for text/html
    if (req.headers.accept.split(",").indexOf("text/html") < 0)
        return next();

    // Create full URL
    let url = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);

    // Render page
    let html = await worker.render(url.href);

    // In development mode, make it pretty
    if (app.get('env') !== 'production')
       html = prettyHtml(html);

    // Send it
    res.send(html);

});
```

## Passing Data to SSRWorker

It is possible to pass data to `SSRWorker` both globally and on a per-render
basis.

All settings passed to `SSRWorker.init()` including the `entryFile`, `entryMain`
and `entryHtml` options are available to components running in the worker
as `getEnv().options`.

eg: suppose you need to pass the URL of a back-end server to be used for data
    fetch requests:

```js
await worker.init({
    entryFile: path.join(__dirname, "../client/main_ssr.js"), 
    entryMain: "main_ssr",
    entryHtml,
    backEndApiServer: "http://localhost:3005/api",
});
```

A component being rendered could then access that setting via `getEnv().options`:

```js
class MyPage extends Component
{
    refresh()
    {
        this.load(async () => {
            let url = getEnv().options.backEndApiServer + "/user/...";
            let response = await fetch(url);
        });
    }
}
```

Similarly, per-request data can be passed as a second parameter to the render
method:

eg: passing the id of a logged in user

```js
let html = await worker.render(url, {
    userId: currentUser.id,
});
```

The values passed as the second parameter are merged over a copy of the original
SSRWorker options and can be accessed in the same way:

```js
let userId = getEnv().options.userId;
```

When using `SSRWorkerThread` any values passed to the worker thread need to be
compatible with the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) 
since they're passed via Node's [`postMessage`](https://nodejs.org/api/worker_threads.html#portpostmessagevalue-transferlist)
 function.


## Hydration

Hydration refers to the client side process of connecting the DOM elements loaded from the 
SSR rendered HTML page with DOM elements created by scripted components.

Some frameworks solve this by trying to marry up the DOM elements created from 
the SSR rendered page with elements constructed by script in the single page app.

CodeOnly takes a simpler approach:

1. The page is loaded as per usual (with all SSR content intact)
2. The app's main entry point is invoked, components mounted, CSS registered etc... 
3. However... if the page was rendered by SSR, any changes to the DOM are delayed until the initial 
   load is complete - including waiting for router navigation, async data loads, `nextFrame()` 
   callbacks etc...
4. Once the initial load is complete, all SSR rendered content is removed and replaced
   by the script generated content.

While this approach is somewhat naive it's considerably simpler, very reliable and has 
few (if any) downsides over a more complicated approach.

To support the above, the `SSRWorker` makes some additional injections 
into the rendered HTML:

* A meta tag indicating the page was SSR rendered:

    ```html
    <meta name="co-ssr" value="true">
    ```

* Comments to delimit any SSR rendered content that needs be removed (this includes
  mounted components and registered CSS styles):

    ```html
    <!--co-ssr-start-->
    <div>
        This div was server-side rendered and will be replaced
    </div>
    <!--co-ssr-end-->    
    ```

