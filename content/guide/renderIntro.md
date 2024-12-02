---
title: "Introduction"
description: An introduction and CodeOnly's SSR and SSG rendering
---
# Introduction to Rendering

Rendering refers to the process of converting components to HTML strings - 
instead of directly manipulating the DOM of a browser.

## Use Cases

Rendering can be used for a number of different purposes:

* [Server Side Rendering](renderSSR) - rendering on a server the complete version of a page rather
  that serving just a skeleton of the page that's later populated by client side script.
* [Static Site Generation](renderSSG) - generating static HTML files that can be served directly 
  from a simple file server.
* [Static HTML Rendering](renderStatic) - rendering static components and template to HTML
  for other utility purposes.



## MidiDom Rendering Environment

To support rendering the CodeOnly's NodeJS package includes a minimal version of the 
DOM API known as the "minidom".

The minidom includes just enough to support for CodeOnly's template engine - while also 
adding support for rendering the resulting DOM to a HTML string.

## The `coenv` Global Variable

CodeOnly has a concept of an environment that represents either the browser, 
or the server.  When CodeOnly is loaded by NodeJS it sets up the server environment.  When loaded into a browser it sets up the browser environment.

The environment can be retrieved and checked using the `coenv` global variable:

```js
if (coenv.browser)
{
    // Running in browser
}

if (coenv.ssr)
{
    // Running server side
}
```

In order to write code that will run both in the browser and on the server
be careful not to use the browser-only variables `document` or `window` - 
these are not available on the server.  (CodeOnly doesn't declare equivalent 
global properties with these names in a server environment because it 
confuses many libraries into thinking they're running in the browser).

Instead, use the equivalent properties of the `coenv` object - `coenv.document`
and `coenv.window`.  In server environments, these properties return minidom
objects with similar API to the browser (though far less functional).

<div class="tip">

The `coenv` variable is a global property that doesn't need to be imported.

The reason for this is that in SSR scenarios it need to be an accessor 
property that fetches the correct environment for the current rendering 
request. 

Since JavaScript doesn't support `import`ing a accessor property and since
we didn't want this to appear as a function, it's implemented as a property
get accessor on `globalThis`.

</div>

