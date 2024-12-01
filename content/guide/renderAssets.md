---
title: "Asset Fetching"
---

# Asset Fetching

Often when using SSR and SSG you'll need to access asset files such
as `.json`, `.md` and `.txt` files.

## `fetchTextAsset` and `fetchJsonAsset`

To support this, are two helper functions:

* `async fetchTextAsset(url)` - fetch a text asset
* `async fetchJsonAsset(url)` - fetch a JSON asset

On the browser, these functions make a web request using `fetch` API. On 
the server, the assets are loaded with `fs.readFile()`.

In both cases 

* The `url` must be absolute (ie: start with a '/') which is resolved 
  against the root directory of the project.
* When using a `urlMapper` with a `base` directory, the base will be
  prefixed to any `fetch` request ie: the url should be the internalized
  version.
* Both functions are `async` and return a `Promise` for the value, or 
  the promise is rejected.

Only get/read functionality is provided because these 
functions are designed to be used in rendering environments where 
posting or saving assets shouldn't be done anyway.


