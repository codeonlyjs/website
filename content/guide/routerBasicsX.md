---
title: "Basics"
---
# Router Basics

<div class="tip">

TODO: This documentation is mostly out of date and needs to be updated.

</div>


CodeOnly includes a simple, but flexible URL router designed for use
in single-page apps.

The router requires the History API and provides normal web-history
style routing (not hash based routing).

## Router Class and Singleton Instance

The router functionality is implemented by the `Router` class:

```js
import { Router } from "@codeonlyjs/core";

// Create router
let router = new Router();

// Use router...
```

However since you only ever need one instance, there is a built-in
singleton instance available as `router`.

```js
import { router } from "@codeonlyjs/core";

// Use router...
```

## Router Framework

Routing involves the following participants:

* Router - the router itself responsible for handling browser navigation events 
  and mapping them to routes.
* Route handlers - objects registered with the router to provide URL
  matching and handling.
* Route instances - an object that represents a matched URL and includes
  information like the URL, the associated handler, state and any other data the 
  handler wishes to associate with the route.
* Router listener - listens to navigation events from the Router and updates
  the DOM with the newly navigated to route.


## Registering Route Handlers

Route handlers are registered using the Router's `register` function which expects
an object with properties that control the route handler's behaviour:

```js
router.register({
    // The URL pattern this route handler matches
    pattern: "/about",

    // A handler called if pattern matches
    match: (route) => {

        // Create component for this object
        route.page = new AboutPageComponent();

        // Return true to confirm match of this route
        return true;
    }
});
```

The following properties are supported:  All are optional except
for the `match` method.

* `pattern` - an optional `RegExp` or string specifying a URL pattern for this
    route handler to match against.  If not specified, the `match` function will
    be called for all URLs.

    If the pattern is a string, it's converted to a RegExp using the [`urlPattern`](utilities#urlpattern-function)
    function.

* `match(route)` - a callback that is invoked once the pattern has been matched (or always
    if pattern is not specified).  
  
    `route` will be a partially constructed route object
    with the `url`, `originalUrl`, `match`, `viewState` and `state` parameters set.

    The `match` function can reject the match by returning `false`, or accept it by
    returning `true`.  When matching, a route handler will typically set additional properties on the route (eg: the page component instance to show).

    If the match function returns `null`, router navigation is canceled and the navigation
    passed back to the browser to do page load navigation.

* `leave(route)` - a callback invoked when navigating away from any route matched
    by this handler.

* `order` - an optional numeric value indicating the order this route handler
    should be matched in comparison to others.  Defaults to `0` if not specified.

* `captureViewState` - a function that returns a JSON serializable object representing
    the current view state (eg: scroll position).  See below for more information
    about view state restoration.

* `restoreViewState` - a function that restores a previously captured view state.


## Registering Navigation Listeners

Once a route has been matched, it's up to your application to do something with
that matched route by listening to the "navigate" event.

```js
router.addEventListener("navigate", () => {

    // Load navigated page into router slot
    if (router.current.page)
        this.routerSlot.content = router.current.page;

});
```


## The Router Object

The `router` class instance supports the following methods and properties:

* `current` - the route object of the currently matched URL
* `navigate` - starts forward navigation to a new in-app page
* `back` - starts backward navigation to the previous page, or if there is
    no previous page to the home page.
* `register` - registers a route handler
* `prefix` - a path prefix if the application is mounted in a sub-path (set this
    before calling the `start` method)
* `start` - starts the router, connecting to window and history events and
    performing the initial page navigation for the starting URL.


## The Route Object

Once a URL is matched to a route handler, a `route` object is created
representing the current route with the following properties:

* `url` - the matched url
* `originalUrl` - the original full URL before the prefix was stripped
* `match` - the result of running the pattern RegExp against the URL
* `handler` - the route handler that matched the URL
* `state` - any previously saved history state
* `viewState` - any previously captured view state information

The route handler can attach any additional information to the route
object as required.  Although not required, typically, by convention
a route handler will set a `.page` property to the component that
implements the route's view.

In the above examples, note how the `/about` route handler creates an 
`AboutPageComponent` instance and stores it in the route's `page` property.
This component instance is then picked up by the `navigate` listener 
elsewhere in the app and loaded into an `EmbedSlot`.



## Creating Links to Routes

The router listens for any clicks on anchor elements with a `href` that
starts with a `/` and, if set, matches the `router.prefix`.

All other clicks on links will be ignored by the router and normal
page load navigation will take place.



## Reverting to Browser Navigation

If you have links that look like in-app links but are actually out-of-page 
links, you can force page load navigation by returning `null` from a route
handler's `match` function.

eg: suppose `/admin` should leave the single page app and load a separate
page.

```js
router.register({
    pattern: "/admin"
    match: (r) => null,         // null means cancel router and pass to browser.
});
```



## Typical Setup

The following shows a typical setup for using the router.

Firstly, create a component for each of your pages and register a 
route handler for it.  

If your page requests async data, set its `loading` property before 
returning from the `match` function to prevent the router from 
trying to restore the scroll position until the page data is loaded.
(See below for more about view state restoration)

```js
import { Component, router } from `codeonly`

// A component for the product page
class ProductPage extends Component
{
    constructor(product_id)
    {
        this.product_id = product_id;
        this.load();
    }

    async load()
    {
        // Set loading flag to prevent scroll position
        // restoration until initial load is complete
        this.loading = true;
        let data = await api.getProduct(this.product_id);
        this.loading = false;
    }

    // etc...
}

// Register route handler
router.register({
    pattern: "/product/:productId",
    match: (route) => {

        // Create new product page
        route.page = new ProductPage(route.match.groups.productId);

        // Indicate we've matched this route
        return true;

    },
});

```

Next, listen for the "navigate" event and load the created page into
the main content area of your app.  Also, call the router's `start` method to hook up event handlers and
do the initial page navigation.

```js
import { Component, router } from `codeonly`

// Main application instance mounted to DOM
class Application extends Component
{
    constructor()
    {
        // Listen for navigate event
        router.addEventListener("navigate", () => {

            // Load navigated page into router embed slot
            if (router.current.page != null)
                this.routerSlot.content = router.current.page;

        });

        // Start the router (connect to window and history 
        // navigation events, do initial page navigation).
        router.start();
    }


    static template = {
        type: "main",
        $: [
            { 
                // Router pages will be loaded here
                type: "embed-slot", 
                bind: "routerSlot",
            },
        ]
    };
}

```

That's it for simple page navigation.

