---
title: "Welcome"
---
# Welcome to CodeOnly

CodeOnly is a simple, lightweight, easy-to-learn framework for web development. 

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

CodeOnly is primarily designed for building single page apps (SPA) 
but can also be used to make small embellishments to existing sites -
basically any project that needs an easy way to populate and 
make updates to the DOM. 

It also supports server-side rendering (SSR) and static site generation 
(SSG) for fast load times and great SEO and social media engagement. We've 
even included a project template with simple, ready to go Docker 
container support.


## Features

* Self Contained Componets
* Expressive JSON-like DOM templates
* Flexible SPA router with async navigation guards
* CSS animations and transitions 
* Two-way input element bindings
* Static Site Generation (SSG)
* Server Side Rendering (SSR)
* DOM templates are JIT compiled and tuned to run fast
* Less than 50kB minimized, 15kB gzipped.


## Benefits

* Everything in written in clean, modern JavaScript
* No proxies, wrappers or reactivity 
* No template or markup languages to learn
* No build server to get in the way
* Debug your code in the browser exactly as you wrote it
* Edit and save your code right there in Chromium's debugger
* Live Server auto reload


## Basic Example

Before getting into the details of how to setup a CodeOnly project
let's have a look at a simple example that will give you an idea of 
what working with CodeOnly is like.

The following component consists of a `div` containing a `button` and 
a text `span`.  Each time the button is clicked, the span is updated
with the number of clicks.

<div class="tip">

Hovering over the info icons in sample code shows further explanatory notes.

</div>

```js
// code lab demo
class Main extends Component /* i:  Components extend the `Component` class */
{
  index = 0; /* i:  Class fields and functions are available to the template */

  get character() /* i: Standard JavaScript property accessors work too*/
  {
    return Main.characters[this.index % 3];
  }

  onClick() /* i:  Button click event handler */
  { 
    this.index++; 
    this.invalidate(); /* i:  Marks the component as needing DOM update */
  }

  static characters = [ "Luke", "R2-D2", "C-3PO" ]

  static template = { /* i:  This is the component's DOM template */
    type: "div", /* i:  Root element type */
    class: "counter", /* i:  Scoping CSS class */
    $: [ /* i:  Child nodes array */
      {
        type: "span",
        text: c => c.character, /* i: `c` is the component instance */
      },
      {
        type: "button",
        text: `Next Character`,
        on_click: c => c.onClick(), /* i: Event handler */
      },
    ]
  }
}

css` /* i:  CSS styles (with '.counter' as scoping class) */
.counter
{
  display: flex;
  align-items: center;
  justify-content: center;
  span
  {
    display: inline-block;
    width: 5rem;
  }
}
`; 
```

Let's take a closer look some of the features of developing components this way.


## Self Contained Components

Notice in the above example that the logic, DOM template and CSS styles are all
declared together in the one place meaning everything about a component can be contained in one regular `.js` file.

Also, because it's straight JavaScript there's no need for tooling, a build
step or special editor support.


## Non-Reactive

Unlike some other frameworks, we've decided against any form of
automatic reactivity in CodeOnly.

There's a few reasons for this but primarily we feel its just too
intrusive. Proxies, wrappers and all the plumbing required for
reactivity adds a lot of complexity, often making a project harder to 
understand and to debug. 

With CodeOnly your objects are left alone. 

Take another look at the above example and notice that it's all 
vanilla JavaScript.  No markup, build steps, proxy objects or 
wrapper functions.  It's easy to debug, easy to edit and no surprises.

Of course this means you need to do a little extra work to keep the DOM
up to date, but it's usually not that hard and we think the trade off 
is worth it.


## JavaScript DOM Templates

CodeOnly doesn't try to cram the declaration of dynamic values into an
existing markup language.  Instead, CodeOnly's DOM templates are declared 
using plain JavaScript objects. 

Templates are JSON-like structures with fat arrow `=>` callbacks to provide 
dynamic values.

Yes, it's a little more verbose but it's surprising how flexible this
approach is.

* There's no special syntax or markup to learn.
* Templates can be included directly in the component class
* It's all just JavaScript so you can call functions or reference out of 
  line template elements to produce a final template. Compose and extend.

## Styles

In the above example, notice that it includes component specific CSS 
declarations using the `css` template literal string.

This approach is completely optional, but it lets us declare everything 
about a component in the one file.

Also, notice how we've use a class to scope the CSS declarations
for this component to a CSS class applied at the root of the component's
DOM template.  This helps avoid CSS clashes between components.


