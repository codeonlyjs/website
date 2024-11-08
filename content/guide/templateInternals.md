---
title: "Internals"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Template Internals

<div class="tip">

TODO: This page is still being written

</div>


A CodeOnly template is a JavaScript object that can be used to create and update
DOM elements.

Templates are just-in-time ("JIT") compiled. That is they're converted to JavaScript 
code at run-time on-demand.  A compiled template is simply a function that when called 
returns an object that manages a DOM tree.

Once the DOM tree has been constructed it can be added the document DOM and updated 
as necessary.

Template support dynamic values and updates through callback functions - usually
fat arrow "`=>`" callbacks that provide values on demand.  By calling the 
constructed templates `update()` method any changes dynamic values are applied
to the DOM, effectively updating what's shown in the browser.

A compiled template can be used multiple times.  For example the template for the
items in a list would be compiled once and instantiated multiple times to create
each items in the list.

Compiling and instantiating templates is mostly transparent and done automatically
by components, but you can use the template compiler directly.



## Terminology

The following terms are used when describing how CodeOnly templates work:

* "template" - the JavaScript object (with embedded callbacks) that describes
  a heirarchy of DOM elements.
* "compiled template" or "DOM constructor" - the function returned by the template
  compiler that when called constructs the DOM tree of the element.
* "dom" - the object returned by the compiled template function
  that manages the set of created DOM elements.

Note: the use of the term "dom" is a slight misnomer as it actually refers to the
"component like object" that manages the DOM elements, rather than the DOM elements
themselves.

