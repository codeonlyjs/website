---
title: "Details"
---
# Router Details

This page covers use of CodeOnly's Router for more complex 
setups than those covered by [basic URL routing](routerBasics).



## Terms and Concepts

When working with the router, there's a few terms and concepts you should be
familiar with. We'll cover all these in detail, but it's good to have a high
level view of all the pieces:

* **Router** - the central controller of route operations.  The router 
  receives URL load requests, matches them to route handlers and fires 
  events that provide hooks into the navigation process.

* **Navigation Events** - on each navigation the router goes through a sequence
  of steps to fully resolve and handle the URL.  As it does so it calls notification methods on the source and target route handlers and fires events
  to other attached listeners.

* **Route Handlers** - these are objects your application registers with the 
  router that are responsible for matching recognized URLs and populating
  the route object with information about the page to be shown.

* **Route Objects** - a route object stores everything about the current 
  navigation. This includes the URL, the matched handler and anything else the
  handler (ie: your application) wants to associate with this route.

* **Router Driver** - the router itself interacts with the browser through a 
  "driver".  The included `WebHistoryRouterDriver` provides the glue
  between the router and the browser's History API.

* **View State Restoration** - when navigating through the browser 
  history there is usually transient "view state" such as the current scroll
  position that needs to be captured and restored. 

* **Internal URLs** - URLs in a form understood by your application.

* **External URLs** - URLs in a form as seen by the browser (and the user).

* **URL Mapper** - an object that internalizes and externalizes URLs. 

Let's take a look at each of these concepts in a more detail...


## The Router

The `Router` class is the main participant in routing operations.  Its
responsibilities include:

* Receiving URL load requests
* Matching URLs to route handlers
* Firing a sequence of events for each URL navigation
* Handling clean up of cancelled navigations

Almost always there is only ever a single instance of the router. 

The convention is to create and configure the router in a file named 
`router.js` that exports a singleton `router` object instance:

```js
import { Router } from "@codeonlyjs/core";

// Create the router
export let router = new Router( /* i:  Create the router instance */
    new WebHistoryRouterDriver() /* i:  See below */
);
```

Route handlers are registered with the router using the `register` method. 

The router also has methods that can be used by your app to
invoke navigation (`navigate`, `back`, `replace`) but these simply
pass through to the router driver.



## Navigation Events

When the router receives a URL load request and after it has matched it
to a route handler, it proceeds through a series of steps to "leave" the 
old route, and "enter" the new route.

These steps take place in two phases:

* The "may navigate" phase - a series of events where route
  handlers and event listeners can perform async operations and
  optionally cancel the navigation.

* The "will navigate" phase - a synchronous set of non-cancellable 
  steps that notify that the old route will be left and the new 
  route will be entered.

Within each phase, the Router fires two kinds of events: 

  1. broadcast events to all attached listeners, and 
  2. targeted calls to the route managers of the route being left and 
    the route being entered.

The full sequence of events is as follows:

Firstly, Phase 1, the cancellable, async "may navigate" phase starts:

1. Broadcast the "`mayLeave`" event
2. Call `mayLeave` on the `from` route handler
3. Call `mayEnter` on the `to` route handler
4. Broadcast the "`mayEnter`" event

If this point is reached without the navigation being cancelled, then 
Phase 2, the synchronous, non-cancellable "will navigate" phase starts:

5. Broadcast the "`didLeave`" event
6. Call `didLeave` on the `from` route handler
7. Call `didEnter` on the `to` route handler
8. Broadcast the "`didEnter`" event 


<div class="tip">

Note that in phase 1, the navigation might be cancelled by the event
handlers, the route handlers or by a second URL load request being received
before the first one has finished.

A second load request might come from the user navigating the browser history
or it might come from your app initiating a navigation before the first
one has completed.

</div>


## Route Handlers

A route handler is an object that handles the navigation to and from 
a particular URL.  

Route handlers are registered with the router during app startup and are 
called by the router when a URL is loaded and needs to be matched to
a particular handler.

When a route handler matches a URL it will usually store additional 
information on the route object that describes the component or page
to be displayed for that URL along with any other information the 
handler or the application might find useful.

Route handlers can have the following members, none of which are required:

```js
{
    pattern: "/url/pattern",
    match: async (to) => true;
    mayLeave: async (from, to) => true;
    mayEnter: async (from, to) => true;
    didLeave: (from, to) {},
    didEnter: (from, to) {},
    cancelLeave: (from, to) {},
    cancelEnter: (from, to) {},
    order: 0,
}
```

The `pattern` parameter can be either a URL pattern string, or a regular 
expression object.  If not specified, all URLs are matched.  

When the URL matches a handler's pattern, the handler's `match` function is 
called to confirm the match. It should return true to accept the URL
or false to reject it.

If the `match` handler returns `null`, this instructs the router and router
driver to ignore the navigation event and revert to a normal browser
page load.  This can be used to redirect routes to external pages.

If present, the `match`, `mayLeave` and `mayEnter` functions must all
return true for navigation to succeed.  These methods can all return a 
promise for the `true`/`false` result.

The `from` argument is the route object being navigated away from (leaving). 
On initial page load `from` will be `null`.  

The `to` argument is the route object being navigated to (entering). 

The `cancelEnter` and `cancelLeave` functions are called if a navigation
was cancelled after a previous notification of `mayEnter` or `mayLeave` 
respectively.

The `order` parameter controls the order in which route handlers are 
matched to URLs.  It can be used to resolve conflicts where two handlers would
otherwise both match a URL.  It is often used to configure a "Not Found"
route handler to match any URL - after all other handlers failed to match. 



## Route Objects

A route object stores everything related to a particular URL load operation.

Route objects are never re-used and only last from the start of the 
URL load that created it, until the URL is navigated away from.  

ie: navigating "back" doesn't re-use the same route
object instance as last time - a new object is created every time. 

Route objects are initially created by the Router with the following
properties:

```js
{
    url: new URL(),
    state: { } 
    current: false,
}
```

Once a handler has been matched to a URL a reference to the 
handler will be added to route object:

```js
{
    url: new URL(),
    state: { },
    current: false,
    handler: { }
}
```

These are the known, built-in properties of the route:

* `url` - the internalized URL of the route (this is a URL object, not a string)
* `state` - any previously saved state associated with the URL
* `current` - true if this is the route that would be returned by `router.current`
* `handler` - the matched handler for this route

At any point event and route handlers can add additional information
to the route object.

eg: 

* Route handlers will typically create a page component and store it on the route
  object to be picked up elsewhere in the app to be loaded into the document.

* Other event handlers may also attach additional information to the route object.

  eg: the built-in `ViewStatePersistence` object, in its `mayEnter` event handler,
  stores any previously saved view state as `viewState` property on the route object.



## Router Driver

The router driver connects the router to its hosting environment.

Most typically this is the browser. The built-in `WebHistoryRouterDriver` class 
works with the browser's History API to handle all browser navigation.

The `WebHistoryRouterDriver` also listens for clicks on anchor `<a>` elements, 
inspects the `href` attribute and if it looks like an in-page link, instructs
the router to initiate a URL load for the href.

Currently the `WebHistoryRouteDriver` is the only available driver, but may be 
expanded with a similar driver for the Navigation API.  A server side
router driver will also be developed for use in server-side rendering scenarios.



## View State Restoration

View state restoration is the process of maintaining any otherwise transient
view state information when navigating through the session history.

The most common kind of view state to be persisted is the current scroll position
and the built in ViewStateRestoration object can handle this automatically.

The built-in component normally just saves the document scroll position but it
can be customized:

* View state restoration can be customized on a per-route handler basis by adding 
  `captureViewState()` and `restoreViewState(viewState)` functions to the route handler.

* By adding `captureViewState()` and `restoreViewState(viewState)` methods to the 
  router object it can be customized globally.



## Internal vs External URLs

The router supports a concept of internal and external URLs:

* Internal URLs are those as seen by your application code
* External URLs are those as seen by the browser and end-users

Whenever the router driver receives a URL from the browser it first calls
the Router's `internalize` method to convert it to an internal URL.  Similarly
before passing any internal URL to the browser it first calls the Router's
`externalize` method to convert the internal URL to an external one.

The `internalize` and `externalize` methods can accept URL objects (in which
case a new URL object is returned), or string URLs (in which case a string
is returned).

The default `internalize` and `externalize` methods just return a copy of the
the same URL.

If you set the router's `urlMapper` property to anyobject with `internalize`
and `externalize` methods the Router will forward these calls to that object.

CodeOnly includes a `UrlMapper` object for a couple of common use cases...


## UrlMapper

The `UrlMapper` class provides support for internalizing and externalizing
URLs with a base prefixes and/or hashed URL paths instead of normal URL paths.

Base prefixes can be used to load a single page app into a sub-path of the root
domain.  

For example, suppose you wanted your single page app to appear in a sub-path
`/myapp`:

```js
router.urlMapper = new UrlMapper({
    base: "/myapp/"
});
```

Now any URL's received from the browser will have the `/myapp` prefix removed
and URL's generated by your app will have the `/myapp` prefix prepended.

eg: an external URL of `/myapp/about` would appear to your application
(and the router) as `/about`.

The `UrlMapper` can also be used for hashed URL paths.  This can be used when 
you have a single page application that doesn't have the required server-side
support for normal URL paths:

```js
router.urlMapper = new UrlMapper({
    hash: true,
});
```

When hashed URLs are enabled, an internal URL of `/about` would be 
externalized to `/#/about` (and vice-versa)

Note: when creating `<a>` links in your application, you should use the external
URL not the internal one.  This can be done by calling the router's 
`externalize()` method:

```js
{
    type: "a",
    href: router.externalize("/about"),
    text: "About this Site",
}
```

<div class="tip">

In the above example, we're not using a dynamic callback
for the `href` attribute because it's not a dynamic 
value. 

</div>