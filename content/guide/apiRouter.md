---
title: Router API
description: CodeOnly Router API Reference
---

# Router API

## PageCache Class {#PageCache}

Implements a simple MRU cache that can be used to cache Page components for route handlers 

```ts
class PageCache {
    constructor(options: {
        max: number;
    });
    get(key: any, factory: (key: any) => any): any;
}
```

### constructor() {#PageCache#constructor}

Constructs a new page cache


```ts
constructor(options: {
    max: number;
});
```

* **`options`** Options controlling the cache

* **`options.max`** The maximum number of cache entries to keep

### get() {#PageCache#get}

Get a cached object from the cache, or create a new one


```ts
get(key: any, factory: (key: any) => any): any;
```

* **`key`** The key for the page

* **`factory`** A callback to create the page item if not in the cache

## Route {#Route}


Represents a Route instance


```ts
type Route = {
    url: URL;
    state: any;
    current: boolean;
    handler: RouteHandler;
    viewState?: any;
    page?: any;
    title?: string;
};
```

### current {#Route#current}


True when this is the current route


```ts
current: boolean;
```

### handler {#Route#handler}


The handler associated with this route


```ts
handler: RouteHandler;
```

### page {#Route#page}


The page component for this route


```ts
page?: any;
```

### state {#Route#state}


State associated with the route


```ts
state: any;
```

### title {#Route#title}


The route's page title


```ts
title?: string;
```

### url {#Route#url}


The route's URL


```ts
url: URL;
```

### viewState {#Route#viewState}


The route's view state


```ts
viewState?: any;
```

## RouteHandler {#RouteHandler}


RouteHandlers handle mapping URLs to Route instances


```ts
type RouteHandler = {
    pattern?: string | RegExp;
    match?: (route: Route) => Promise<boolean>;
    mayEnter?: (from: Route, to: Route) => Promise<boolean>;
    mayLeave?: (from: Route, to: Route) => Promise<boolean>;
    didEnter?: (from: Route, to: Route) => boolean;
    didLeave?: (from: Route, to: Route) => boolean;
    cancelEnter?: (from: Route, to: Route) => boolean;
    cancelLeave?: (from: Route, to: Route) => boolean;
    order?: number;
    captureViewState?: (route: Route) => object;
    restoreViewState?: (route: Route, state: object) => void;
};
```

### cancelEnter {#RouteHandler#cancelEnter}


Notifies that a route that could have been entered was cancelled


```ts
cancelEnter?: (from: Route, to: Route) => boolean;
```

### cancelLeave {#RouteHandler#cancelLeave}


Notifies that a route that could have been left was cancelled


```ts
cancelLeave?: (from: Route, to: Route) => boolean;
```

### captureViewState {#RouteHandler#captureViewState}


A callback to capture the view state for this route handler's routes


```ts
captureViewState?: (route: Route) => object;
```

### didEnter {#RouteHandler#didEnter}


Notifies that a route for this handler has been entered


```ts
didEnter?: (from: Route, to: Route) => boolean;
```

### didLeave {#RouteHandler#didLeave}


Notifies that a route for this handler has been left


```ts
didLeave?: (from: Route, to: Route) => boolean;
```

### match {#RouteHandler#match}


A callback to confirm the URL match


```ts
match?: (route: Route) => Promise<boolean>;
```

### mayEnter {#RouteHandler#mayEnter}


Notifies that a route for this handler may be entered


```ts
mayEnter?: (from: Route, to: Route) => Promise<boolean>;
```

### mayLeave {#RouteHandler#mayLeave}


Notifies that a route for this handler may be left


```ts
mayLeave?: (from: Route, to: Route) => Promise<boolean>;
```

### order {#RouteHandler#order}


Order of this route handler when compared to all others (default = 0, lowest first)


```ts
order?: number;
```

### pattern {#RouteHandler#pattern}


A string pattern or regular expression to match URL pathnames to this route handler


```ts
pattern?: string | RegExp;
```

### restoreViewState {#RouteHandler#restoreViewState}


A callback to restore the view state for this route handler's routes


```ts
restoreViewState?: (route: Route, state: object) => void;
```

## router {#router}


Default [Router](apiRouter#Router) Instance


```ts
let router: Router;
```

## Router Class {#Router}


The Router class - handles URL load requests, creating
route objects using route handlers and firing associated
events


```ts
class Router {
    constructor(handlers: RouteHandler[]);
    start(driver: object): any;
    navigate: any;
    replace: any;
    back: any;
    urlMapper: UrlMapper;
    internalize(url: URL | string): URL | string;
    externalize(url: URL | string): URL | string;
    get current(): Route;
    get pending(): Route;
    addEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
    removeEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
    register(handlers: RouteHandler | RouteHandler[]): void;
    revoke(predicate: (handler: RouteHandler) => boolean): void;
    captureViewState: (route: Route) => object;
    restoreViewState: (route: Route, state: object) => void;
}
```

### addEventListener() {#Router#addEventListener}

Adds an event listener

Available events are:
  - "mayEnter", "mayLeave" (async, cancellable events)
  - "didEnter" and "didLeave" (sync, non-cancellable events)
  - "cancel" (sync, notification only)



```ts
addEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to listen to

* **`handler`** The event handler function

### back {#Router#back}


Navigates back one step in the history, or if there is
no previous history navigates to the root URL


```ts
back: any;
```

### captureViewState {#Router#captureViewState}

a callback to capture the view state for this route handler's routes


```ts
captureViewState: (route: Route) => object;
```

### constructor() {#Router#constructor}

Constructs a new Router instance


```ts
constructor(handlers: RouteHandler[]);
```

* **`handlers`** An array of router handlers to initially register

### current {#Router#current}

The current route object


```ts
get current(): Route;
```

### externalize() {#Router#externalize}

Externalizes a URL


```ts
externalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### internalize() {#Router#internalize}

Internalizes a URL


```ts
internalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### navigate {#Router#navigate}


Navigates to a new URL


```ts
navigate: any;
```

* **`url`** The external URL to navigate to

### pending {#Router#pending}

The route currently being navigated to


```ts
get pending(): Route;
```

### register() {#Router#register}

Registers one or more route handlers with the router


```ts
register(handlers: RouteHandler | RouteHandler[]): void;
```

* **`handlers`** The handler or handlers to register

### removeEventListener() {#Router#removeEventListener}

Removes a previously added event handler



```ts
removeEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to remove the listener for

* **`handler`** The event handler function to remove

### replace {#Router#replace}


Replaces the current URL, without performing a navigation


```ts
replace: any;
```

* **`url`** The new URL to display

### restoreViewState {#Router#restoreViewState}

a callback to restore the view state for this route handler's routes


```ts
restoreViewState: (route: Route, state: object) => void;
```

### revoke() {#Router#revoke}

Revoke previously used handlers by matching to a predicate


```ts
revoke(predicate: (handler: RouteHandler) => boolean): void;
```

* **`predicate`** Callback passed each route handler, return true to remove

### start() {#Router#start}

Starts the router, using the specified driver


```ts
start(driver: object): any;
```

* **`driver`** The router driver to use

### urlMapper {#Router#urlMapper}


An option URL mapper to be used for URL internalization and
externalization.


```ts
urlMapper: UrlMapper;
```

## UrlMapper Class {#UrlMapper}

Provides URL internalization and externalization 

```ts
class UrlMapper {
    constructor(options: {
        base: string;
        hash: boolean;
    });
    internalize(url: URL): URL;
    externalize(url: URL, asset?: boolean): URL;
}
```

### constructor() {#UrlMapper#constructor}

Constructs a new Url Mapper


```ts
constructor(options: {
    base: string;
    hash: boolean;
});
```

* **`options`** Options for how to map URLs

* **`options.base`** The base URL of the external URL

* **`options.hash`** True to use hashed URLs

### externalize() {#UrlMapper#externalize}

Externalizes a URL



```ts
externalize(url: URL, asset?: boolean): URL;
```

* **`url`** The URL to externalize

* **`asset`** If true, ignores the hash option (used to externalize asset URLs with base only)

### internalize() {#UrlMapper#internalize}

Internalizes a URL



```ts
internalize(url: URL): URL;
```

* **`url`** The URL to internalize

