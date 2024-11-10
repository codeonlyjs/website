---
title: "Typical Setup"
---
# Router Typical Setup

The following shows how the router is typically configured and used
in a CodeOnly project.

## router.js

This file creates and configures the router and exports it.

```js
import { Router, WebHistoryRouterDriver, ViewStateRestoration } from "@codeonlyjs/core";

export let router = new Router(new WebHistoryRouterDriver());

new ViewStateRestoration(router);
```

## Page.js

This would be repeated for all the different pages in your app

```js
import { Component, router } from `@codeonlyjs/core`

// A component for the product page
class ProductPage extends Component
{
    constructor(product_id)
    {
        this.product_id = product_id;
    }

    // logic and template here
}

// Register route handler
router.register({
    pattern: "/product/:productId",
    match: (to) => {

        // Create new product page
        to.page = new ProductPage(route.match.groups.productId);

        // Indicate we've matched this route
        return true;

    },
});

```


## Main.js

The main root component and the application entry point:

```js
import { Component, router } from `codeonly`

// Main application component
class Main extends Component
{
    constructor()
    {
        // Listen for navigate event
        router.addEventListener("didEnter", (from, to) => {

            // Load navigated page into router embed slot
            if (to.page != null)
                this.routerSlot.content = to.page;

        });
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

// Main entry point
export function main()
{
    // Create Main component and mount it
    new Main().mount("body");

    // Start the router
    router.start();
}

```

