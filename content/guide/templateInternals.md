---
title: "Internals"
---
# Template Internals

A CodeOnly template is a JavaScript object that can be used to create and update
DOM elements.

Templates are just-in-time ("JIT") compiled - that is they're converted to JavaScript 
code at run-time on-demand.  A compiled template is simply a function that when called 
returns an object that manages a `DomTree`.

A `DomTree` is an object that manages a set of DOM nodes and conforms to the CodeOnly
component like object (aka CLObject) requirements.

Once the `DomTree` has been constructed it can be added the document DOM and updated 
as necessary.

Templates support dynamic values and updates through callback functions - usually
fat arrow "`=>`" callbacks that provide values on demand.  By calling the 
constructed templates `update()` method any changes dynamic values are applied
to the DOM, effectively updating what's shown in the browser.

A compiled template can be used multiple times.  For example the template for the
items in a list would be compiled once and instantiated multiple times to create
each item in the list.

Compiling and instantiating templates is mostly transparent and done automatically
by components, but you can use the template compiler directly.



## Terminology

The following terms are used when describing how CodeOnly templates work:

* `template` - the JSON-like object (with embedded callbacks) that describes
  a heirarchy of DOM elements.
* `DomTreeConstructor` - a function that creates a DomTree.
* `DomTree` - an object that manages a set of DOM nodes and nested CLObjects.


<div class="tip">

A "DomTree" is a JavaScript object that conforms to the CodeOnly component like
object (CLObject) requirements.  It is *not* the actual DOM element tree.

</div>


## Compiling a Template

TODO!

## Calling the DomTreeConstructor

TODO!

## Using a DomTree

TODO!


