---
title: "Basics"
---
# Router Basics

CodeOnly includes simple but flexible router for use with single page apps.

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

To get an idea for how the router works, let's start with a simple example.

### Create the Router

Central to routing is the Router object itself which needs to be created
and configured by your application.

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

### Register Route Handlers

Next, we register "route handlers" with the router. A handler is an 
object that matches URLs to pages in your app.

This example sets up a route handler for the URL `/about`.

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

Note that for this to work, the code that registers the route handler must 
be run - which usually just means adding an import to the page's JavaScript
file from your app's main component:

```js
// Add this to you main component's .js file
import "AboutPageComponent.js";
```


### Show the Route's Page

Finally, the app listens to the router for navigation events and
updates what's shown for the new URL.  

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
object and use it however suits your app.

</div>

### Start the Router

Finally, the router needs to be started.  This tells the router to connect its 
event listeners to the DOM and History API and to perform the initial page load 
navigation.

This should be done after all route handlers have been registered and usually
the main component of your application has been mounted.

```js
// Mount main component
new Main().mount("main");

// Start the router
router.start();
```


### Summary

To sum up:

1. Create a router object
2. Register route handlers that match URLs and create page components for 
   the URL and store them on the route object
3. Register an event listener for navigation events and use information 
   stored on the route object to re-configure what's shown
4. Start the router.



## Creating Links to Routes

Of course there's not much point having a router without links to URLs
that the router can work with.  But, there's nothing special to do here.

Just create the anchor elements (eg: `<a href="/about">`) as per normal 
and the router will automatically detect clicks on in-app links and
invoke the router to load the page.

```js
{
    type: "a",
    attr_href: "/about",
    text: "About this Site",
}
```


## View State Restoration

When stepping backward and forward through the browser history there is 
usually some "view state" that needs to be captured and restored.  

The main example of this is saving and restoring the current 
scroll position - nobody wants to hit the back button and then have
to scroll to get back to where the were before.

The router supports capturing any view state you need, but often the 
scroll position is enough so we've included a component that can do this
automatically.

All you need to do is create an instance of it and pass it the router
object.

```js
new ViewStateRestoration(router);
```


## Next Steps

For many single page apps, what's been described above will cover most requirements.  If
you use the CodeOnly project generator to create a single-page app it
will setup all this for you automatically.

For more complex setups though, let's dig into [the details](routerDetails)...



