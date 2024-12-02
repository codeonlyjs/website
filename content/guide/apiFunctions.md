---
title: "Functions"
description: "CodeOnly Function API Reference"
---
# Functions

## $() 

The `$` function is the entry point for the fluent template API.

For full details, see [Fluent Templates](templateFluent).


## css()

The `css` function is used to add CSS style declarations to the current
document.

This function is designed to be used as a template literal function
like so:

```js
css`
.myclass
{
    background: orange;
    /* etc... */
}
`
```

All strings passed to the `css` function are coalesced into a single
style block and added to the `<head>` section of the current document.

The `css` function expects straight CSS and no pre-processing (LESS, 
SASS etc..) is done.  Use of CSS processors is outside the scope
of this documentation.


## fetchJsonAsset(url)

Fetches a JSON asset.

This function is a wrapper around `fetchTextAsset` that parses the
returned string into a JSON object.

See `fetchTextAsset` for more information about this function.



## fetchTextAsset(url)

Fetches a text asset.

On the browser, this function makes a web request using the `fetch` API. 
On the server, the asset is loaded with the NodeJS function `fs.readFile()`.

In both cases 

* The `url` must be absolute (ie: start with a '/') which is resolved 
  against the root directory of the project.
* When using a `urlMapper` with a `base` directory, the base will be
  prefixed to any `fetch` request ie: the url should be the internalized
  version.
* This function is `async` and returns a `Promise` for the value, or 
  the promise is rejected.


## generateStatic(options)

Recursively renders a site to a series of HTML files 
(static site generation).

The available options are:

* `entryFile` - same as for SSG
* `entryMain` - same as for SSG
* `entryHtml` - same as for SSG, but as a filename (not a HTML string)
* `entryUrls` - the internal URLs of the site to render
* `ext` - a file extension to append to all generated pages
* `pretty` - `true` for prettified HTML output
* `outDir` - base output directory where generated files will be written
* `baseUrl` - base URL used to construct URL objects passed to the router
* `verbose` - display more output
* `cssUrl` - path to CSS file to contain collected `css` styles

All of the options are optional, with the following defaults:

```js
options = {
    entryFile: [ "main-ssg.js", "main-ssr.js", "Main.js", ],
    entryMain: [ "main-ssg", "main-ssr", "main" ],
    entryHtml: [ "dist/index.html", "index-ssg.html", "index.ssr.html", "index.html" ],
    entryUrls: [ "/" ],
    ext: ".html",
    pretty: true,
    outDir: "./dist",
    baseUrl: "http://localhost/",
    verbose: false,
    cssUrl: "/assets/styles-[unique].css",
}
```

Note: 

* The `entryFile`, `entryMain` and `entryHtml` options can be an array where the
  first that exists will be used.
* The `entryUrls` property is an array but you only need list the entry point 
  URLs - any linked pages will be recursively rendered.  If you have content 
  that needs to be rendered but isn't linked from else where in the site, 
  list them here.
* The `baseUrl` is used to construct the URL objects passed to the router.  If 
  your site uses the full URL to construct links or display messages, this should
  be set to the final public URL where the site will be hosted.
* The `cssUrl` is the path where all collected `css` declarations will be written.
  The `[unique]` placeholder will be filled in with a hash value unique to build.

For more information, see [Static Site Generation](renderSSG).

## html(string)

The `html` function marks a string as containing HTML text.

In most places where a template accepts a text string to be used in the
DOM, the string is assumed to be plain text that should be escaped and 
displayed as is.

By wrapping text with the `html()` function it instructs the template
to treat the string as HTML and effectively sets the `innerHTML` of the
element instead of the `textContent`.

See also: [Text and HTML](templateText)


## htmlEncode(string)

The `htmlEncode` function encodes a string for use in a HTML document so 
that special characters normally recognized as part of HTML are treated
as plain text.

See also: [Text and HTML](templateText)



## input()

The `input` function is used to create bi-directional value bindings
between a component and HTML input fields.

For full details, see [Input Bindings](templateInput)


## nextFrame Function

The `nextFrame` function invokes a callback on the next update cycle.

```js
import { nextFrame} from "@codeonlyjs/core";

nextFrame(() => { /* i:  do something */ });
```

`nextFrame` is implemented using the standard browser `requestAnimationFrame` function.

The order of callbacks can be controlled by passing a second parameter.

```js
nextFrame(callback, order);
```

* Callbacks with a lower `order` will be called first.
* Callbacks with the same `order` will be called in undefined order. 
* If the `order` parameter is not specified, `0` is used.

The `Component.invalidate()` function uses `nextFrame` with an order of 
`Component.nextFrameOrder` (-100) to register pending DOM updates.

This ensures that `nextFrame` callbacks that don't specify an order
will be invoked after the DOM updates have completed.




## transition()

The `transition` function indicates that when a callback value changes
a CSS transition should be initiated when applying the changed value.

For a full discussion of this function see [Transistions](templateTransitions).



## urlPattern(pattern)

Converts a URL pattern to a regular expression string.

eg: 

```js
let rx = new RegExp(urlPattern("/foo/:id"));

let match = "/foo/bar".match(rx);
if (match)
{
    let id = match.groups.id;
    assert.equal(id, "bar");
}
```

For more examples, see the [unit tests](https://github.com/codeonlyjs/core/blob/main/test/urlPattern.js).


## viteGenerateStatic(options)

`viteGenerateStatic` is a Vite plugin to render SSG sites as part of the regular
build process.

It accepts the same options as the `generateStatic` function with the following
exceptions:

* The `outDir` setting doesn't need to be specified as the plugin picks 
  this up from the Vite build configuration.
* The `prebuild` option is an optional script file that will be `import`ed
  at the start of the build.  It can be used to pre-process data before the
  build runs.  eg: build a JSON meta data file for a static blog by scanning
  markdown files etc...

See also [SSG Vite Plugin](renderSSG#vite-plugin).