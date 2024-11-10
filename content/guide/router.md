---
title: "API"
---
# Router API


## Router Class

### constructor(driver, handlers)

Constructs a new Router object.

* `driver` - the router driver to be used to communicate with the environment
* `handlers` - an optional array of route handlers to be registered.

### start()

Delegates to the driver's `start()` method, passing itself as the router 
the driver should connect with.

### navigate()

Bound to the driver's `navigate()` method.

### replace()

Bound to the driver's `replace()` method.

### back()

Bound to the driver's `back()` method.

### internalize(url)

Internalizes a URL.  

If the `urlMapper` property has been set this method delegates to the 
mapper, otherwise a copy of the passed URL is returned.

* url - the URL to be internalized (must be a URL object, not a string)

### externalize(url)

Externalizes a URL.

If the `urlMapper` property has been set this method delegates to the 
mapper, otherwise a copy of the passed URL is returned.

* url - the URL to be externalized (must be a URL object, not a string)

### current

Returns the current route object.

### pending

Returns the route object that's currently being entered, but has
not yet been confirmed.


### addEventListener(event, handler)

Adds an event listener to the router.

* `event` - name of the event to listen for
* `handler(from, to)` - the callback which will be passed the route being left and the route being entered.

Note, events fired during the first phase of navigation (ie: the `"mayLeave"` 
and `"mayEnter"` events) can cancel the navigation by returning false.  These
events can also be `async` and return a promise that resolves to true or false.

### removeEventListener(event, handler)

Removes a previously registered event listenter.

### register(handler)

Registers route handlers with the router.

* `handler` - either a single route handler, or an array of route handlers.



### revoke(predicate)

Revokes route handlers that match a predicate.

* `predicate(handler)` - callback that will be passed each currently registered
handler.  Return true to revoke the handler, false to keep it.



## Route Handler Object

Route handlers are plain JavaScript objects (ie: they're not a class) with
the follow properties, all of which are options.

### pattern

A URL pattern string or a RegExp object to be used as an initial match
against URLs.

If specified and a URL matches the pattern, or if a pattern isn't specified
this route handler is considered as a candidate for the URL.

Considered router handlers aren't confirmed as a match until the `match` 
function (if specified) returns true.



### async match(to)

If a route handler is considered a candidate (because it didn't specify
a `pattern` or because the pattern matched) its `match` function
will be called to confirm the match.

* `to` - the route object being navigated to

This function should return.

* `true` to confirm the match
* `false` to reject the match
* `null` to instruct the router and driver to abandon in-app navigation
and perform an full external page load on the URL.

This function can be `async` and return a promise for one of the above values.


### async mayEnter(from, to)

Notifies the route handler that a route it manages may become the 
new current route.

* `from` - the route being navigated away from, or `null` if this is the initial page load.
* `to` - the route being navigated to (always a route managed by this route handler)

This function should return `true` to accept the navigation, `false` to cancel
the navigation, or a promise resolving to `true` or `false`.

### async mayLeave(from, to)

Notifies the route handler of the current route that it may be navigated
away from.

* `from` - the route being navigated away from (always a route managed by 
  this route handler)
* `to` - the route being navigated to.

This function should return `true` to accept the navigation, `false` to cancel
the navigation, or a promise resolving to `true` or `false`.


### didEnter(from, to)

Notifies the route handler that a route it manages has become the new current
route.

* `from` - the route being navigated away from, or `null` if this is the
  initial page load.
* `to` - the new current route object (always a route object managed by this 
  route handler)


### didLeave(from, to)

Notifies the route handler that a route object it manages is no longer
the current route.

* `from` - the route object that is no longer current (always a route 
  object managed by this route handler)
* `to` - the new current route object


### order

A numeric value that sets the order of this route manager in relation to
others.  If not specified, a value of `0` is assumed.

This setting can be used to resolve conflicts when a URL might otherwise
match multiple route handlers, giving precedence to the handler with the
lower `order` value.

This setting is often used with a route handler for a "Not Found" as a
catch all in case no other route manager matches a URL.  By giving such
a route handler a high order value it will always be matched after all
other handlers.



## Route Object

Route objects are created by the Router when a new navigation event begins
and will have at least the properties described here.

Usually route handlers will attach additional properties to the route object
but that's up to your application.

### url

The internalized URL of the route as URL object (not a string)

### state

Any previously saved state associated with this route.

### current

True if this is the route that Router.current would return.

### handler

The route handler that is associated with this route object. 

Before a route is matched to a handler, this property is `undefined`.

### viewState

If you're using the `ViewStateRestoration` component it will
attach any previously saved view state to the route object in its
`"mayEnter"` handler.


## ViewStateRestoration Class

The `ViewStateRestoration` class implements this default view
state restoration features of the Router.

It doesn't have a public API itself, but it will call capture and
restore methods on the route handlers and/or the router itself.

### captureViewState()

When capturing view state, the following methods are tried:

1. `captureViewState()` on the route handler being navigated away from.
2. `captureViewState()` on the Router itself
3. Otherwise the current document scroll position is captured.

The `captureViewState()` function should return an JSON serializable
object with any view state information that should be tracked.

### restoreViewState(state)

When restoring view state, the following methods are tried:

1. `restoreViewState(state)` on the route handler being navigated to.
2. `restoreViewState(state)` on the Router itself
3. Otherwise the current document scroll position is restored.

The `restoreViewState(state)` function will be passed a copy of the
view state object as previously returned from `captureViewState()`

## WebHistoryRouterDriver Class

The `WebHistoryRouterDriver` provides the connection between the
Router and the browser's History API and DOM.

Usually an application should only interact with it through the
following methods which are forwarded by the Router to the driver:



### async start(router)

Initializes the driver by:

1. connecting required event handlers to browser History API and DOM
2. performing initial page load navigation

Parameters:

* `router` - the Router this drive is to connect with.

Don't call this method directly, instead call the `Router.start()`
method which will delegate to this method.



### async navigate(url)

Navigates to a new URL.

* `url` - the internal URL to navigate to.  Can be a string or a URL object.

Returns a promise that resolves when navigation is complete.  The resolved
promise is the route object of the new navigation or `null` if navigation
was cancelled.



### back()

Navigates back one step in the browser history, or, if there is no previous
entry to go back to, navigates to the home page.

This method can be used with routes to modal dialog to close the dialog and
return to the previous route, or the home page (if the modal was loaded directly
from an initial page load  URL).



### replace(url)

Replaces the current URL shown in the browser (and the history) and updates
the current route object with the new URL information.



## UrlMapper Class

The `UrlMapper` class provides methods to internalize and external URLs
performing two commong functions:

1. Supporting a base URL prefix
2. Supporting hash based URL path

### constructor(options)

Constructs a new `UrlMapper` object.

* `options` - an object with settings controlling how URLs are mapped
    - `base` - a URL prefix for external URLs
    - `hash` - if true URLs will be externalized as hash URL paths.

### internalize(url)

Internalizes a URL.

* `url` - a URL object (not string) to be internalized.

Throws an Error if the URL can't be internalized.


### externalize(url)

Externalizes a URL.

* `url` - a URL object (not string) to be externalized.

Throws an Error if the URL can't be externalized.

