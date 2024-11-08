---
title: "View State Restoration"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Router View State Restoration

<div class="tip">

TODO: This documentation is mostly out of date and needs to be updated.

</div>


## View State Restoration

View state restoration refers to the ability to capture and restore
information about the current page that typically isn't included in 
the URL.

The most common kind of view state data is the current document scroll 
position - which the router handles automatically for most use cases, 
but this process can be customized.

* When a route is left, the router calls the handler's `captureViewState`
    method which should capture the current view state and return it as 
    JSON serializable object.

* When a route is returned to, the router calls the handler's `restoreViewState`
    passing the previously captured state.

If the handler doesn't define the `captureViewState` nor `restoreViewState`
methods, they're automatically mapped to `DocumentScrollPosition.get()` and 
`DocumentScrollPosition.set(value)` which simply capture and restore the current 
document scroll position.

There are several ways to customize view state restoration:

* Supply your own implementations of the capture and restore view state methods.
* Supply your own implementation of `captureViewState`, but leave 
    `restoreViewState` unset (or set to null) and use the `route.viewState` view 
    to restore the view. (eg: from inside the `match` call).
* Set both `captureViewState` and `restoreViewState` to null to disable
    view state restoration.

## View State Restoration with Async Data Loads

Often a single page app will need to asynchronously load data from a
server when loading a new page.  In this case,  view state restoration needs
to be delayed until that initial data load has completed.

This is supported automatically by the router by the convention of using
`route.page` to hold a page component for the navigated to page and using
the page's `loading` property to indicate if the page has loaded.

After the router fires the `navigate` event to load the new page, it
checks if the route has a `.page` property.  If it does and if the page
has a `.loading` property set to true it delays the call to 
`restoreViewState` until the page's `loaded` event is fired.

In other words to support view state restoration with async data load:

* use the `page` property of the `route` object to represent the page to 
    be loaded.
* before returning from `match` make sure the page's `loading` property
    is set to true.



## View State Restoration and Silent Page Refreshes

If a page instance is cached and re-used for multiple routes or when 
returning to a previously loaded page, that page might already have
data loaded and view state restoration usually doesn't need to be 
delayed.  

However, if the page needs to silently refresh itself when it comes back 
into view, consider not setting the `loading` property during the refresh 
data request - this will both allow the view state restoration to complete 
immediately and also prevent spinners and other UI feedback during the 
silent background refresh.


