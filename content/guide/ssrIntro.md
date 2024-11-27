---
title: "Introduction"
---
# Introduction to Server Side Rendering

Server-side Rendering (SSR) is a technique where pages returned from a server
include the fully populated and loaded data of the page - and not just a 
"skeleton" HTML page that's later populated by single page app's scripts.

## Considerations for SSR

SSR has it's pros and cons and its use should be carefully considered.

Benifits of SSR include:

* Improved SEO - some search engines can't properly index single-page apps because the crawler
  only sees the empty "skeleton" page and not the content that should be indexed.
* Per-page social media meta information (Open Graph tags, Twitter cards)
* Faster initial appearance - because the page is downloaded fully populated, the page can 
  be presented sooner by the browser

Downsides of SSR include:

* Increased complexity
* All scripts and dependent libraries need to be able to run on client and server
* Additional load on the server

Often the primary quoted reason for SSR is improved SEO however most major search engines
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
  that is infrequently updated a better choice might be static site generation (SSG).

* If your app's content is publicly accessible, dynamically changing and requires good 
  SEO or social media meta info, then SSR may be the correct choice.


## MidiDom Rendering Environment

To support rendering components and templates to HTML strings, CodeOnly's NodeJS package 
includes a minimal version of the browser's DOM API known as the "minidom".

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


