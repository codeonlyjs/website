---
title: "Introduction"
---
# Introduction

CodeOnly is a simple, lightweight, easy-to-learn framework for
front-end web development. 

It's designed for coders, it's fast and small and uses modern 
JavaScript.  It's tool-free during development so there's
no bundling or build steps but can, and should be bundled for
production.

Perhaps controversially, it's non-reactive. But, this also means 
it's non-invasive - your objects are untouched. There's no 
observables or watchers and definitely no monkey-patching or 
`Proxy` wrappers.

CodeOnly provides an amazing development experience because there
is no build step. Code changes apply instantly and you debug your code 
exactly as you wrote it - no transpiling and no surprising wrappers
or proxies to debug through.

## What Can it Do?

CodeOnly is primarily designed for building complete single page 
front-end websites but can also be used to make small embellishments
to existing projects - basically any project that needs an easy way 
to populate and make updates to the DOM. 

## Features

* Self Contained Componets
* Expressive JSON-like DOM templates
* Everything in modern JavaScript
* No template or markup languages to learn
* Two-way input bindings
* Includes flexible SPA router
    * async
    * navigation guards
    * uses History API
    * normal or hashed URL paths
* CSS animations and transitions 
* Tuned to run fast
* No proxies, wrappers or reactivity 
* No build server
* Debug your code exactly as you wrote it
* Live Server auto reload
* Less than 50kB minimized, 15kB gzipped.


## Basic Example

Before getting into the details of how to setup a CodeOnly project
let's have a look at a simple example that will give you an idea of 
what working with CodeOnly is like.

This component consists of a `div` containing a `button` and 
a text `span` that shows how many times the button has been clicked.

<div class="tip">

Hovering over the info icons in sample code shows further explanatory notes.

</div>

```js
// code lab demo
class Main extends Component /* i:  Components extend the `Component` class */
{
  count = 0; /* i:  Class fields and functions are available to the template */

  onClick() /* i:  Button click event handler */
  { 
    this.count++; 
    this.invalidate(); /* i:  Marks the component as needing DOM update */
  }

  static template = { /* i:  This is the component's DOM template */
    type: "div", /* i:  Root element type */
    class: "counter", /* i:  Scoping CSS class */
    $: [ /* i:  Child nodes array */
      {
        type: "button",
        text: `Click Me`,
        on_click: c => c.onClick(), /* i:  `c` is the component instance */
      },
      {
        type: "span",
        text: c => ` Count: ${c.count}`, /* i:  Callback for dynamic content */
      }
    ]
  }
}

Style.declare(` /* i:  CSS styles (with '.counter' as scoping class) */
.counter
{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
`); 
```

Let's take a closer look some of the features of developing components this way.


## Single File Components

One of the nicest things about developing CodeOnly components is that everything
about a component can be contained in one regular `.js` file.

Notice in the above example that the logic, DOM template and CSS styles are all
declared together in the one place.

Also, because it's straight JavaScript there's no need for tooling, a build
step or special editor support.


## Non-Reactive

Unlike most other front-end frameworks, we've decided against any form of
automatic reactivity in CodeOnly.

There's a few reasons for this but primarily we feel its just too
intrusive. Proxies, wrappers and all the plumbing required for
reactivity adds a lot of complexity, often making a project harder to 
understand and to debug. 

With CodeOnly your objects are left alone. 

Of course this means you need to do a little extra work to keep the DOM
up to date, but it's usually not that hard and we think the trade off 
is worth it.

With frontend development its usually not that hard to figure out when 
things need to be updated.  The trickier part is actually making the
updates - and for that CodeOnly has you covered. 


## JavaScript DOM Templates

CodeOnly doesn't try to cram the declaration of dynamic values into an
existing markup language.  Instead, CodeOnly's DOM templates are declared 
using plain JavaScript objects. 

Templates are JSON-like structures with fat arrow `=>` callbacks to provide 
dynamic values.

Yes, it's a little more verbose but it's surprising how flexible this
approach is.

* There's no special syntax or markup to learn.
* Templates can be included directly in the component class without
  special tooling (ie: no dev build server)
* You can compose and generate templates by calling functions to "create"
  the template.


## Styles

In the above example, notice how it includes the CSS declarations
for the component using the `Style.declare()` method.

This approach is completely optional, but it lets us declare everything 
about a component in the one file.

Also, notice how we've use a class to scope the CSS declarations
for this component to a CSS class applied at the root of the component's
DOM template.  This helps avoid CSS clashes between components.



## Next Steps

* [Get Started](start)
* Learn more about [Components](component)
* Learn more about [Templates](template)

