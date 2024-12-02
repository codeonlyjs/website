---
title: "Basics"
description: An introduction to working with CodeOnly Components
---
# Component Basics

Components are the primary building block for constructing CodeOnly
applications. They encapsulate program logic, a DOM (aka HTML) template 
and an optional a set of CSS styles.

Components can be used either in the templates of other components
or mounted onto the document DOM to appear in a web page.


## Anatomy of a Component

Most components will conform to this common structure:

```js
import { Component, css } from "@codeonlyjs/core";

// Components extend the 'Component' class
export class MyComponent extends Component
{
    // Logic
    constructor()
    {
        super()
    }

    // DOM template
    static template = {

    }
}

// CSS styles
css`
`;
```

<div class="tip">

By declaring logic, templates and styles in code the entire
definition of a component can be contained in a single `.js` file.

</div>



## Logic

A component is just a regular JavaScript class so its "logic"
can be anything you like, but will typically consist of:

* Business logic
* Data fetching
* Public properties to configure the component
* Properties and methods to support the template
* Event handling and dispatching
* Life-cycle handlers (eg: `onMount()`, `onUnmount()`)



## Templates

A component's template declares the HTML elements that will appear
in the document and provide the visual representation of the component.

Templates are [covered in detail here](templates), but since they're 
central to understanding components the following is a brief introduction.

A template is a JSON-like object that describes the DOM structure of a 
component - that is the set of HTML elements that comprise the component's
appearance.

Most components will declare their template using a static
field named `template` on the component class.



```js
// lab demo code
class MyComponent extends Component
{
    static template = {  /* i:  This component's template */
        type: "div",
        text: "This is My Component",        
    }
}
```

<div class="tip">

Templates are declared static because they are compiled at runtime to JavaScript 
and it would be extremely inefficient to re-compile for each component instance.  

The template is compiled the first time an instance of a component is constructed 
and re-used for all subsequent instances.

</div>


## Dynamic Content

A template can use fat arrow (`=>`) callbacks for dynamic content.

The callback is passed a reference to the owning component instance
and by convention the argument is usually named `c` (for "component"):

This example sets a `<div>`'s inner text using the component's `greeting`
property:

```js
    static template = {
        type: "div",
        text: c => c.greeting, /* i: Callback to get text content */
    }
```


When the value of any dynamic content changes, the component needs to 
be updated to apply those changes in the DOM using one of these two
methods:

* `update()` - updates the DOM immediately
* `invalidate()` - schedules the component to be updated on the next
  update cycle.

<div class="tip">

In general you should use `invalidate()` as it coaelesces multiple 
updates into a single DOM update.  This is more efficient as it saves
the browser from multiple reflows.

</div>

The following example toggles the text shown in a `<div>` each time
it is clicked.

```js
// lab demo code
class MyComponent extends Component
{
    #on = false;

    // A dynamic property used by the template
    get text() 
    { 
        return this.#on ? "On" : "Off";
    }

    onClick()
    {
        this.#on = !this.#on;
        this.invalidate(); /* i: Tells component to update */
    }

    static template = {
        type: "div",
        text: c => c.text, /* i: Callback for dynamic content */
        on_click: "onClick",
    }
}
```

Templates also support events, conditional blocks, list rendering, 
embed slots, CSS transitions and more.  See [Templates](templates) 
for more on working with templates.


## Mounting Components

Mounting a component makes it appear on the page.

Most components are mounted automatically by parent components, but
 the root of your application needs to be mounted manually.

To mount a component, call the `mount` method passing an element 
or selector indicating where the component should be appear:

eg: 

`main.js`

```js
// Main component
class MainPage extends Component
{
}


// Main entry point into the application
export function main()
{
    // Create main page and mount it in div#main
    new MainPage().mount("#main");

    // Other app initialization can go here
}
```

`index.html`

```js
<html>
<body>
    <!-- This is where the Main component will be mounted --> 
    <div id="main"></div>
    
    <script type="module">  
        // Call "main" method to mount the component
        import { main } from "/main.js";
        main();
    </script>
</body>
</html>

```

<div class="tip">

Although this example shows how a typical single-page-application
might mount the top-level component, the same approach can be used 
to mount smaller widgets, controls and panels - even if the rest 
of the project doesn't use CodeOnly.

</div>


## Styles

To declare CSS styles associated with your component, use the 
<code>css``</code> template literal function.  It takes a CSS string and adds
it to the `<head>` section of the document.

We recommend scoping your styles to a component specific CSS class 
to avoid name clashes.

The example scopes its content with the class name `my-component`
and nests styles within that class.  Styles declared for the `<p>` 
element only apply to those in this component.

```js
// lab code demo
class MyComponent extends Component
{
  static template = { 
    type: "div", 
    class: "my-component",
    $: [ 
        // Child elements
        {
            type: "p",
            text: "A Styled Paragraph",
        }
    ]
  }
}

css`
.my-component
{
    p
    {
        text-align: center;
        font-weight: bold;
        color: orange;
    }
}
`; 
```

<div class="tip">

Styles declared with <code>css``</code> are added to the document
exactly as declared.  The above example is using nested CSS 
for scoping which requires a reasonably modern browser.

If you need to work with old browsers that don't support this you
will need to either manually de-nest your declarations or use an 
external CSS preprocesor (LESS, SASS etc...) - but they can't be
used with the <code>css``</code> function.

</div>


