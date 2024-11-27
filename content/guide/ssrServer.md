---
title: "Server Side Rendering"
---

# Server Side Rendering

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



## Setup

To support server side rendering are two classes:

* `SSRWorker` - the main class responsible for loading and rendering components
  and pages

* `SSRWorkerThread` - a wrapper that runs an `SSRWorker` instance on a worker thread.

Both classes have identical API with the only difference being that `SSRWorkerThread` 
loads an instance of `SSRWorker` on a NodeJS Worker thread and marshals calls to it.

Worker threads are the mechanism CodeOnly uses to keep multiple server-side apps isolated.

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


## Rendering

Once the worker has been constructed and initialized, you can render pages
using the `render` method, passing the URL of the page to be rendered:

```js
    let html = await worker.render(url.href);
```

The `render()` performs the following the steps to render a page
to HTML.

1. Sets up an `AsyncStorage` for the request with a new SSR environment 
   instance specific to this request. This allows multiple requests to run 
   concurrently while still being isolated from each other.
2. Sets up an SSR router driver with the requested URL
3. Calls the `entryMain` function in `entryFile` - the entry point into
   your application.
4. Invokes the router to load the URL
5. Waits for any async route and data loads to complete
6. Ensures any invalidated components are updated
7. Renders all mounted components and registered CSS styles into `entryHtml`
8. Returns the final HTML string


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



## Use with Bundle-free

If your server uses Bundle-free, you'll also want to inject the import maps and other 
changes bundle-free provides into the `entryHtml` string.

This can be managed by setting up bundle-free slightly differently:

1. Capture a reference to the bundle-free middleware (see the `bf` variable in 
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
let entryHtml = await bf.patch_html_file("", path.join(bf.options.path, "index.html"));
```

## ExpressJS Page Rendering

If you're using ExpressJS as the server framework library, installing an SSR page 
rendering route handler can be done as follows.

This should be done after all other route handlers as we want all unknown URL's
to fallback to the single-page application (assuming we're using normal URL paths 
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

To support the above, the `SSRWorker` makes several additional "co-ssr" injections 
into the rendered HTML:

* A meta tag indicating the page was SSR rendered:

    ```html
    <meta name="co-ssr" value="true">
    ```

* Comments to delimit any SSR rendered content that will be removed (this includes
  mounted components and registered CSS styles)

    ```html
    <!--co-ssr-start-->
    <div>
        This div was server-side rendered and will be replaced
    </div>
    <!--co-ssr-end-->    
    ```
