---
title: "Details"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Router Details

This page covers use of CodeOnly's Router for more complex 
setups than those covered by [basic URL routing](routerBasics).



## Terms and Concepts

When working with the router, there's a few terms and concepts you should be
familiar with. We'll cover all these in detail, but it's good to have a high
level view of all the pieces:

* The Router - the central controller for route operations.  The router 
  receives URL load requests, matches them to route handlers and fires 
  events that provide hooks into the navigation process.

* Navigation Events - on each navigation the router goes through a sequence
  of steps to fully resolve and handle the URL being loaded.  As it does so 
  it fires events to the source and target route handlers and to other 
  listeners.

* Route Handlers - these are objects the your application registers with the 
  router that are responsible for matching recognized URL's and populating
  the route object with information about the page to be shown.

* Route Objects - a route object stores everything about the current 
  navigation. This includes the URL, the matched handler and anything else the
  handler (ie: your application) wants to associate with this route.

* Router Driver - the router itself interacts with the browser through a 
  "driver".  The included `WebHistoryRouterDriver` provides the glue
  between the router and the browser's History API.

* View State Restoration - when navigating through the browser 
  history there will be "view state" that needs to be captured and 
  restored.  The main example of this is saving and restoring the current 
  scroll position.

* Internal URLs - URLs in a form understood by your application.

* External URLs - URLs in a form as seen by the browser (and the user).

* URL Mapper - an object that internalizes and externalizes URLs. 

Let's take a look at each of these concepts in a more detail...


## The Router

The `Router` class is the main participant in routing 
whose responsibilities include:

* Receiving URL load requests
* Matching URLs to route handlers
* Firing a sequence of events for each URL navigation
* Handling clean up of cancelled navigations

Almost always, there is only ever a single instance of the router. 

The convention is to create and configure the router in a file named 
`router.js` that exports a singleton `router` object instance:

```js
import { Router } from "@codeonlyjs/core";

// Create the router
export let router = new Router( /* Create the router instance */
    new WebHistoryRouterDriver() /* See below */
);
```

Route handlers are registered with the router using the `register` method. 

The router also has methods that can be used by your app to
invoke navigation (`navigate`, `back`, `replace`) but these simply
pass through to the router driver.



## Navigation Events

When the router receives a URL load request and after it has matched it
to a router handler, it proceeds through a series of steps to "leave" the 
old route, and "enter" the new route.

These steps take place in two phases:

* The "may navigate" phase - a series of events where route
  handlers and event listeners can perform async operations and
  optionally cancel the navigation.

* The "will navigate" phase - a synchronous set of non-cancellable 
  steps that notify that the old route will be left and the new 
  route will be entered.

Within each phase, the Router fires two kinds of events: 

  1. broadcast events that anyone can listen for and 
  2. targeted calls to the route managers of the route being left and 
    the route being entered.

The full sequence of events is as follows:

Firstly, Phase 1, the cancellable, async "may navigate" phase starts:

1. Broadcast the "`mayLeave`" event
2. Call `mayLeave` on the `from` route handler
3. Call `mayEnter` on the `to` route handler
4. Broadcast the "`mayEnter`" event

If this point is reached without the navigation being cancelled, and 
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
a particular URL pattern.  

Route handlers are registered with the router during app startup and the router calls the 
handlers when a URL is loaded and needs to be matched to a particular handler.

When a route handler matches a URL it will usually store additional 
information on the route object that describes the component or page
to be displayed for that URL along with any other information the 
handler or the application might find useful.

Route handlers have the following members, all of which are optional:

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
expression.  If not specified, all URLs are matched.  

When the URL matches a handler's pattern, the handler's `match` function is 
called to confirm the match. It should return true to accept the URL
or false to reject it.

If the `match` handler returns null, this instructs the router and router
driver to ignore the navigation event and revert to a normal browser
page load.  This can be used to redirect routes to external pages instead
of in-page route.

If present, the `match`, `mayLeave` and `mayEnter` functions must all
return true for navigation to succeed.  These methods can all return a 
promise for the true/false result.

The `from` argument is the route object being navigated away from (leaving). 
On initial page load `from` will be `null`.  

To `to` argument is the route object being navigated to (entering). 

The `cancelEnter` and `cancelLeave` functions are called if a navigation
was cancelled after a previous notification of `mayEnter` or `mayLeave` 
respectively.

The `order` parameter controls the order in which this route handler
is matched and can be used to resolve conflicts where two handlers would
otherwise both match a URL.  It's usually used to configure a `Not Found`
route handler to be matched after all other handlers ignored a URL. 



## Route Objects

A route object is an object that stores everything related to a particular 
URL load.  

Route objects are never re-used and only last from the start of the 
URL load that created it, until the URL is navigated away from.  

ie: navigating "back" doesn't use the same route
object instance as beforea new object is created every time. 

Route objects are initially created by the Router with the following
properties:

```js
{
    url: new URL(),
    state: { } 
    current: false,
}
```

Once a route manager has been matched to a URL a reference to the 
handler will be added to route object:

```js
{
    url: new URL(),
    state: { },
    current: false,
    handler: { }
}
```

These are known as the built-in properties of the route:

* `url` - the internalized URL of the route (this is a URL object, not a string)
* `state` - any previously saved state associated with the URL
* `current` - true if this is the route that would be returned by `router.current`
* `handler` - the matched handler for this route

At any point event handler and route handlers can add additional information
to the route object.

eg: 

* Route managers will typically create a page component and store it on the route
  object to be picked up elsewhere in the app to be loaded into the document.

* Other event handlers may also attach additional information to the route object.

  eg: the built-in `ViewStatePersistence` object in its `mayEnter` event handler
  stores any previously saved view state as `viewState` property on the route object.



## Router Driver

The router driver connects the router to its hosting environment.

Most typically this is the browser and built-in `WebHistoryRouterDriver` class works
with the browser's History API to handle all browser navigation.

The `WebHistoryRouterDriver` also listens for clicks on anchor `<a>` elements, 
inspects the `href` attribute and if it looks like an in-page link, instructs
the Router to initiate a URL load for the href.

Currently the `WebHistoryRouteDriver` is the only available driver, but in the 
future this may be expanded with a similar driver for interfacing with the 
Navigation API.  A server side
router driver will also be developed for use in server-side rendering scenarios. .



## View State Restoration

View state restoration is the process of maintaining any otherwise transient
view state information when navigating through the session history.

The most common kind of view state to be persisted is the current scroll position
and the built in ViewStateRestoration object can handle this automatically.

The built-in component normally just saves the document scroll position but it
can be customized:

* By adding `captureViewState()` and `restoreViewState(viewState)` functions to 
  the route handler, the view state restoration can be customized on a per-route handler 
  basis.

* By adding `captureViewState()` and `restoreViewState(viewState)` methods to the 
  Router object it can be customized globally.



## Internal vs External URLs

The router supports a concept of internal and external URLs:

* Internal URLs are those as seen by your application code
* External URLs are those as seen by the browser and end-users

Whenever the router driver receives a URL from the browser it first calls
the Router's `internalize` method to convert it to an internal URL.  Similarly
before passing any internal URL to the browser it first calls the Router's
`externalize` method to convert the internal URL to an external one.

The `internalize` and `externalize` methods both accept and return a URL 
object (not a URL string).

The default `internalize` and `externalize` methods just return a copy of the
the URL.

If you set the router's `urlMapper` property to any object with `internalize`
and `externalize` methods the Router will instead these calls
to that object.

CodeOnly includes a UrlMapper object for a couple of common use cases...


## UrlMapper

CodeOnly's UrlMapper class provides support for internalizing and externalizing
URLs with common base prefixes and/or supports using hashed URL paths instead of 
normal URL paths.

Base prefixes can be used to load a single path app into a sub-path of the root
domain.  

For example, suppose you wanted your single page app to appear in a sub-path
`/myapp`:

```js
router.urlMapper = new UrlMapper({
    base: "/myapp"
});
```

Now any URL's received from the browser will have the `/myapp` prefix removed
and URL's generated by your app will have the `/myapp` prefix prepended.

In otherwords, an external URL of `/myapp/about` would appear to your application
(and the router) as `/about`.

The `UrlMapper` can also be used for hashed URL paths.  This can be used when 
you have a single page application that doesn't have the required server-side
support for normal URLs:

```js
router.urlMapper = new UrlMapper({
    hash: true,
});
```

Now, an internal URL of `/about` would be externalized to `/#/about` (and vice-versa)

Note: when creating `<a>` links in your application, you should use the external
URL not the internal one.  This can bepool done by calling the Router's 
externalize method:

```js
{
    type: "a",
    attr_href: router.externalize("/about"),
    text: "About this Site",
}
```

<div class="tip">

In the above example, we're not using a dynamic callback
for the `attr_href` attribute because it's not a dynamic 
value.  You just need to make sure the router is configured
and the UrlMapper connected before the template is parsed
by the JavaScript module loader.

</div>