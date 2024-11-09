---
title: "Tips & Tricks"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Router Tips and Tricks

<div class="tip">

TODO: This documentation is mostly out of date and needs to be updated.

</div>


## Not Found Page

To handle URL's not recognized by your app, you should register
a "Not Found" page.

Notice this handler doesn't have a pattern (ie: it matches
anything) and the `order` property is set high enough to be matched
after all other routes have failed to match.

```js
router.register({
    match: (r) => {
        r.page = new NotFoundPage(r.url);
        return true;
    },
    order: 1000,
});
```


## Page Titles

The Router doesn't include any built in support for document page titles
but it's pretty easy to build it yourself.

Just have the route handler add a `title` property to the route when it
matches:

```js
router.register({
    pattern: "/product/:productId",
    match: (route) => {
        route.page = new ProductPage(route.match.groups.productId);
        route.title = `Product ${route.match.groups.productId}`;
        return true;
    },
});
```

Update the `document.title` in your navigation handler:

```js
router.addEventListener("navigate", () => {

    if (router.current.page)
        this.routerSlot.content = router.current.page;

    // Update document title
    if (router.current.title)
        document.title = `${router.current.title} - My CodeOnly Site`;
    else
        document.title = "My CodeOnly Site";

});
```

Now, visiting `/product/prod-123` will set the document title
of "prod-123 - My CodeOnly Site" and any routes that don't have a 
title will display just the site name.



## Routes to Modal Dialogs

In additional to regular page navigation, the router can also be used
for routes that present as modal dialogs.

Firstly, the `match` function should create and show the modal dialog and 
the `leave` method should close the dialog:

```js
router.register({
    pattern: "/product-photo-popup/:productIdd",
    match: (r) => {
        r.modal = new ProductPhotoDialog(r.match.groups.productId);
        r.modal.showModal();
        return true;
    },
    leave: (r) => {
        r.modal.close();
    },
});
```

Notice how the `match` function doesn't set the `page` property on the
route. (Make sure your `navigate` event handler is ready for this).

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
case and instead navigates to the home page - as indicated by the 
`router.prefix` if set, otherwise `/`.


## Out of App Links

This works fine for most links, except when you have links that look like
internal page links, but in-fact require external page load.

For example, suppose you needed to create a link an admin page at
`/admin` - but the admin page is implemented separately to your main
app and needs a normal external page load, not an in-app page load.

For these cases provide a route handler that returns `null` from its 
`match` function and the router will do an external page load.

```js
router.register({
    pattern: "/admin", 
    match: () => null
});
```


