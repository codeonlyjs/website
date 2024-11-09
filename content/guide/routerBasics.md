---
title: "Basics"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Router Basics

CodeOnly includes simple but flexible router for use in single page apps.

<div class="tip">

Not sure what a router is?

In single page apps, page navigation is handled by the application itself - 
not by the browser. A router provides a way to use browser displayed
URLs to navigate within your app.

</div>

## Features

The CodeOnly router supports the following features:

* Centralized or distributed route configuration
* Use URL patterns or regular expressions to match routes
* Fine grained URL matching via a callback
* Async events and hooks
* Navigation cancellation (aka "Navigation Guards")
* Uses the browser's History API
* Ordinary and hashed URL paths
* View state persistence (eg: scroll position)
* URL base prefix and other URL mapping
* Supports pre and post navigation async data loads



## Quick Overview

The get an idea for how the router works, let's start with a simple example.

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

// Setup view state restoration
new ViewStateRestoration(router); /* Save and restore the scroll position between pages */

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



## View State Restoration

When navigating back and forward through the browser history there is 
usually some "view state" that needs to be captured and restored.  

The main example of this is saving and restoring the current 
scroll position - nobody want's to hit the back button and then have
to scroll to get back to where the were before.

The router supports capturing any view state you need, but often the 
scroll position is enough so we've included a component can do this
automatically.

All you need to do is create an instance of it and pass is the router
object.

```js
new ViewStateRestoration(router);
```


## Next Steps

For many single page apps, what's been described above is enough. 

Also, the CodeOnly single page project generator will automatically 
configure all this for you.

For more complex setups though,  let's dig into [the details](routerDetails)...



