---
title: "Notes"
description: "Addtional notes on using CodeOnly's SPA router"
---
# Router Notes

## Not Found Page

To handle URL's not recognized by your app, you should register
a "Not Found" page.

The following "not found" handler doesn't have a pattern (ie: it matches
anything) and the `order` property is set high enough to be matched
after all other routes have failed to match.

```js
router.register({
    match: (to) => {
        to.page = new NotFoundPage(r.url);
        return true;
    },
    order: 1000,
});
```


## Page Titles

The Router doesn't include any built in support for page titles
but it's pretty easy to build it yourself.

Just have the route handler add a `title` property to the route when it
matches:

```js
router.register({
    pattern: "/product/:productId",
    match: (to) => {
        route.page = new ProductPage(route.match.groups.productId);
        route.title = `Product ${route.match.groups.productId}`;
        return true;
    },
});
```

Update the `document.title` in your navigation handler:

```js
router.addEventListener("didEnter", (from, to) => {

    if (to.page)
        this.routerSlot.content = router.current.page;

    // Update document title
    if (to.title)
        document.title = `${to.title} - My CodeOnly Site`;
    else
        document.title = "My CodeOnly Site";

});
```

Now, visiting `/product/prod-123` will set the document title
of "prod-123 - My CodeOnly Site" and any routes that don't have a 
title will display just the site name.

<div class="tip">

The above example synchronously sets the page title in the `match`
function.  If you need to make async data load requests to retrieve
the title you can do this by using an `async` version of `match`
or `mayEnter`

</div>


## Routes to Modal Dialogs

In addition to regular page navigation, the router can also be used
for routes that present as modal dialogs.

Firstly, the `didEnter` function should create and show the modal dialog and 
the `didLeave` method should close the dialog:

```js
router.register({
    pattern: "/product-photo-popup/:productIdd",
    didEnter: (from, to) => {
        to.modal = new ProductPhotoDialog(r.match.groups.productId);
        to.modal.showModal();
        return true;
    },
    didLeave: (from, to) => {
        from.modal.close();
    },
});
```

Notice how the route handler doesn't set the `page` property on the
route. (Make sure your code that listens for router "`didEnter`" events
is prepared for this)

As is, this will handle forward and back navigation to/from the dialog
however we need to also handle the case where the user explicitly closes
the dialog via a button or Escape key.

Your dialog probably already has a `close` listener to remove the 
dialog from the DOM when it's closed. At this point, we just check
if the current route refers to this dialog, and if so, tell the 
router to navigate back:

```js
    this.dom.rootNode.addEventListener("close", () => {

        // If we're the current router item this means
        // we were closed by the UI (escape key) and not
        // by navigating backwards.  Do the back navigation
        // now to go back to where we came.
        if (router.current.modal == this)
            router.back();
```

Note: if the initial page loaded by the app was the dialog, the `back`
function doesn't have anywhere to go back to.  The router detects this
case and instead navigates to the home page `/`.


## Out of App Links

When you click on a link in your site the router (or more specifically
the router driver) intercepts the click.  If the href of the link
looks like an internal page URL it initiates an in-app page load.

If you have links that look like in-app links, but actually require 
an external page load, you need to register a route handler that 
matches those URLs and returns `null`.

For example, suppose you needed to create a link an admin page at
`/admin` - but the admin page is implemented separately to your
app and needs a normal external page load, not an in-app page load.

```js
router.register({
    pattern: "/admin", 
    match: () => null
});
```


## Centralized Routing Table

All the examples in this documentation show "distributed" route
registration where the route handlers live with the page that 
handles the route.

For most sites this is the preferred approach as it keeps
everything to do with a single page in one place.

However if you have particularly complex routing requirements you
might find it easier to use a centralized approach where all the 
routes are declared in one central routing table. 

All this requires is moving all the `router.register` calls into 
a one central file.  And since the `register()` method accepts an 
array of route handlers all the routes can be registered in a
single call:

```js
router.register([
    {
        pattern: "/",
        // etc...
    },
    {
        pattern: "/about",
        // etc...
    },
    {
        pattern: "/admin",
        // etc...
    },
    // etc...

])
```

## Page Caching

CodeOnly includes a page cache object that can be used to 
re-use previosly created page objects.  This works particularly
well with back navigation to prevent previous pages from
having to reload data.

To use the page cache first construct it, optionally passing
the maximum number of pages to keep cached (the default is 10
if not specified) as an options object:

```js
export let pageCache = new PageCache({
    max: 10
});
```

Then, instead of always constructing new page objects in your
route handlers, you can use the cache to retrieve a previous
instance or create a new one.

```js
router.register({
    pattern: "/product/:productId",
    match: (to) => {
        to.page = pageCache.get(
            to.url, 
            () => new ResultsPage(route.match.groups.productId)
        );
    },
});
```

The `PageCache.get` takes two parameters:

* `key` - a key identifying the page to retrieve from the cache.  This
  can be any value that can be compared with the JavaScript equality 
  operator (`==`).  If passed a URL object, the url's path and query are 
  concatenated to form the key.
* `factory` - a callback to create a new page instance if the the existing
  key can't be found in the cache.

The page cache will keep up to the maximum count specified, discarding the
least recently used pages first.

