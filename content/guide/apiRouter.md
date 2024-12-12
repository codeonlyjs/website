---
title: Router API
description: CodeOnly Router API Reference
---

# Router API

## PageCache Class {#PageCache}


Implements a simple MRU cache that can be used to cache page components used by route handlers.


```ts
class PageCache {
    constructor(options: {
        max: number;
    });
    get(key: any, factory: (key: any) => any): any;
}
```

### constructor() {#PageCache#constructor}


Constructs a new page cache.



```ts
constructor(options: {
    max: number;
});
```

* **`options`** Options controlling the cache

* **`options.max`** The maximum number of cache entries to keep

### get() {#PageCache#get}


Get an object from the cache, or if no matches found invoke a callback
to create a new instance.



```ts
get(key: any, factory: (key: any) => any): any;
```

* **`key`** The key for the page.

* **`factory`** A callback to create the item when not found in the cache.

## Route {#Route}


Route objects store information about the current navigation, including the
URL, the matched handler and anything else the handler wants to associate with
the route.


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


`true` when this is the current route.

There will only ever be one current route.


```ts
current: boolean;
```

### handler {#Route#handler}


The [`RouteHandler`](apiRouter#RouteHandler) associated with this route.


```ts
handler: RouteHandler;
```

### page {#Route#page}


The page component for this route.

CodeOnly nevers sets or uses this property, but it is included here because
by convention, most applications will set a `page` property.


```ts
page?: any;
```

### state {#Route#state}


State associated with the route.

The router stores important information in the state object so the clients
should never edit settings in the state object.  An application can however
store additional information in the state object, by setting properties on
it and then calling the [`replace`](apiRouter#Router#replace) method.


```ts
state: any;
```

### title {#Route#title}


The route's page title

CodeOnly nevers sets or uses this property, but it is included here because
by convention, most applications will set a `title` property.


```ts
title?: string;
```

### url {#Route#url}


The route's internalized URL.


```ts
url: URL;
```

### viewState {#Route#viewState}


The route's view state.

This information will be available on the Route object once
the `mayEnter` event has been fired by the Router.

By default the web history router driver will save and restore the current document
scroll position but applications can save and restore additional custom information
as necessary. For more information see [View State Restoration](routerDetails#view-state-restoration).


```ts
viewState?: any;
```

## RouteHandler {#RouteHandler}


A route handler is an object that handles the navigation to and from a particular URL.

Route handlers are registered with the router during app startup and are called by the
router when a URL is loaded and needs to be matched to a particular handler.

When a route handler matches a URL it will usually store additional information on the
[`Route`](apiRouter#Route) object that describes the component or page to be displayed for that
URL along with any other information the handler or the application might find useful.

See [Route Handlers](routerDetails#route-handlers) for more information.


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


Notifies that a route that may have been entered was cancelled.


```ts
cancelEnter?: (from: Route, to: Route) => boolean;
```

### cancelLeave {#RouteHandler#cancelLeave}


Notifies that a route that may have been left was cancelled.


```ts
cancelLeave?: (from: Route, to: Route) => boolean;
```

### captureViewState {#RouteHandler#captureViewState}


A callback to capture the view state for this route handler's routes.


```ts
captureViewState?: (route: Route) => object;
```

### didEnter {#RouteHandler#didEnter}


Notifies that a route for this handler has been entered.


```ts
didEnter?: (from: Route, to: Route) => boolean;
```

### didLeave {#RouteHandler#didLeave}


Notifies that a route for this handler has been left.


```ts
didLeave?: (from: Route, to: Route) => boolean;
```

### match {#RouteHandler#match}


A callback to confirm the URL match. If not specified all URL's matching the pattern will be considered matches.


```ts
match?: (route: Route) => Promise<boolean>;
```

### mayEnter {#RouteHandler#mayEnter}


Notifies that a route for this handler may be entered.


```ts
mayEnter?: (from: Route, to: Route) => Promise<boolean>;
```

### mayLeave {#RouteHandler#mayLeave}


Notifies that a route for this handler may be left.


```ts
mayLeave?: (from: Route, to: Route) => Promise<boolean>;
```

### order {#RouteHandler#order}


Order of this route handler in relation to all others (default = 0, lowest first).


```ts
order?: number;
```

### pattern {#RouteHandler#pattern}


A string pattern (see [`urlPattern`](apiUtilities#urlPattern)) or regular expression to match URL pathnames to this route handler. If not specified, all URL's will match.


```ts
pattern?: string | RegExp;
```

### restoreViewState {#RouteHandler#restoreViewState}


A callback to restore the view state for this route handler's routes.


```ts
restoreViewState?: (route: Route, state: object) => void;
```

## router {#router}


Default [Router](apiRouter#Router) instance.

Nearly all applications only ever need a single router
instance and can use this pre-created instance.


```ts
let router: Router;
```

## Router Class {#Router}


A Router handles URL load requests, by creating route objects matching them to
route handlers and firing associated events.


```ts
class Router {
    constructor(handlers: RouteHandler[]);
    start(driver: object | null): Promise<any>;
    navigate: (url: URL | string) => Promise<Route>;
    replace: (url: URL | string) => void;
    back: () => void;
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


Adds an event listener.

Available events are:
  - `mayEnter`, `mayLeave` async, cancellable
  - `didEnter`, `didLeave` sync, non-cancellable
  - `cancel` - sync, notification only

The async cancellable events should return `Promise<boolean>` where a
resolved value of `false` cancels the navigation.

All event handlers receive two arguments a `from` and `to` route object.  For the
initial page load, the `from` parameter will be `null`.



```ts
addEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to listen to

* **`handler`** The event handler function

### back {#Router#back}


Navigates back one step in the history, or if there is
no previous history navigates to the root URL.


```ts
back: () => void;
```

### captureViewState {#Router#captureViewState}


A callback to capture the view state for a route.



```ts
captureViewState: (route: Route) => object;
```

### constructor() {#Router#constructor}


Constructs a new Router instance



```ts
constructor(handlers: RouteHandler[]);
```

* **`handlers`** *
An array of router handlers to initially register, however usually
handlers are registered using the [register](apiRouter#Router#register) method.

### current {#Router#current}


The current route object.


```ts
get current(): Route;
```

### externalize() {#Router#externalize}


Externalizes a URL.



```ts
externalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### internalize() {#Router#internalize}


Internalizes a URL.



```ts
internalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### navigate {#Router#navigate}


Navigates to a new URL.


```ts
navigate: (url: URL | string) => Promise<Route>;
```

### pending {#Router#pending}


The route currently being navigated to, but not yet committed.


```ts
get pending(): Route;
```

### register() {#Router#register}


Registers one or more route handlers.



```ts
register(handlers: RouteHandler | RouteHandler[]): void;
```

* **`handlers`** The handler or handlers to register

### removeEventListener() {#Router#removeEventListener}


Removes a previously registered event handler.



```ts
removeEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to remove the listener for

* **`handler`** The event handler function to remove

### replace {#Router#replace}


Replaces the current URL, without performing a navigation.


```ts
replace: (url: URL | string) => void;
```

### restoreViewState {#Router#restoreViewState}


A callback to restore the view state for a route.



```ts
restoreViewState: (route: Route, state: object) => void;
```

### revoke() {#Router#revoke}


Revoke previously registered handlers that match a predicate callback.



```ts
revoke(predicate: (handler: RouteHandler) => boolean): void;
```

* **`predicate`** Callback passed each route handler, return `true` to remove

### start() {#Router#start}


Starts the router, using the specified driver



```ts
start(driver: object | null): Promise<any>;
```

* **`driver`** The router driver to use, or `null` to use the default Web History router driver.

### urlMapper {#Router#urlMapper}


An optional URL mapper to be used for URL internalization and
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

