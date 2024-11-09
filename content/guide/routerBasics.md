---
title: "Basics"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Router Basics

CodeOnly include s simple but flexible router for use in single page apps.

<div class="tip">

Not sure what a router is?

In single page apps, page navigation is handled by the application itself - 
not by the browser. A router provides a way to use browser displayed
URLs to navigate within your app.

</div>

## Features

The router supports the following features:

* Centralized or distributed route configuration
* Use URL patterns or regular expressions to match routes
* Fine grained URL matching via a callback
* Async events and hooks
* Navigation cancellation (aka "Navigation Guards")
* Uses the browser's History API
* Supports normal URLs (may require minimal server support) or
  hash based URLs
* View state persistence (eg: scroll position)
* URL base prefix and other URL mapping
* Supports pre and post navigation async data loads



## Quick Overview

The get an idea for how the router works, lets start with a simple example.

Central to routing is the Router object itself.  

We recommend a using file named `router.js` that exports a singleton router
instance:

router.js:

```js
import { Router } from "@codeonlyjs/core";

// Create the router
export let router = new Router( /* Create the router instance */
    new WebHistoryRouterDriver() /* We'll cover this later */
);
```

Next, we register "router handlers" with the router.  

A route handler is an object that matches URLs to pages in your app.

This example sets up a router handler for an `/about` page url.

```js
import { router} from "./router.js"; /* This is the router object from above */

router.register({ /* Register this route handler with the router */
    pattern: "/about", /* This is the URL we handle */
    match: (to) => { /* After the pattern matches, the match function is called */
        to.page = new AboutPageComponent(); /* Create a component to display for this page */
        return true; /* Return true to accept the match */
    }
});
```

Finally, we need to listen to the router for navigation events and
update what's shown for the new URL.  

Usually this is done by receiving a page component (eg: the 
`AboutPageComponent` from above) and loading it into an [embed-slot](templateEmbedSlots)
designated for showing router page content.

```js
router.addEventListener("didEnter", (from, to) => { /* Notifies that navigation happened */

    // Load page into our embed slot
    this.routerContentSlot.content = to.page;  /* Load the page component from above into a slot */

});
```

<div class="tip">

Note that the router itself knows nothing about components, templates, 
or embed slots.

Instead you attach the information and objects your app needs to the route 
object (the `to` object in the above callbacks) and use it however suits 
your app.

</div>

To sum up:

1. Create a router object
2. Register route handlers to match URLs, create page components for the URL's 
   content and attach them to the route object
3. Register an event listener for navigation events and use information attached
   to the route object to re-configure what's shown on-screen


## Terms and Concepts

When working with the router, there's a few terms and concepts you should be
familiar with. We'll cover all these in detail, but it's good to have a high
level view of all the pieces:

* The Router - the central manager of routing.  The router it handles load 
  requests, matches them to route handlers and dispatches events that provide 
  hooks into the navigation process.

* Route Handlers - objects registered with the router that can match a URL
  and populate a route object with information associated with the route.

* Route Objects - a route object represents everything about the current 
  navigation. This includes the URL, the matched handler and anything else the
  handler (ie: your application) want's to associate with this route.

* Navigation Events - on each navigation the router goes through a sequence
  of events to fully resolve and handle the URL being loaded.  As it does so 
  it fires events to the source and target route handlers and to other listeners.

* Router Driver - the router itself interacts with the browser through a 
  "driver".  The included `WebHistoryRouterDriver` provides the glue
  between the router and the browser's History API.

* View State Persistance - when navigating forward/back through the browser 
  history there will be "view state" that needs to be captured and 
  restored.  The main example of this is saving and restoring the current 
  scroll position.

* Internal URLs - URLs in the form as understood by your application.

* External URLs - URLs in the form as shown in the browser address bar.

* URL Mapper - the process of converting internal to external URLs and vice
  versa.  Often internal and external URLs are the same, but URL mapping
  can be used for for URL base prefixes and for hash based navigation.
