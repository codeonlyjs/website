---
title: "Introduction"
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

Related to this, CodeOnly has a concept of an environment that represents either the browser, 
or the server.  When CodeOnly is loaded by NodeJS it sets up the server environment.  When
loaded into a browser it sets up the browser environment.

The environment can be retrieved and checked using the `getEnv()` function:

```js
import { getEnv } from "@codeonlyjs/core";

if (getEnv().browser)
{
    // Running in browser
}

if (getEnv().ssr)
{
    // Running server side
}
```


