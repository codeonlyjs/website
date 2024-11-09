---
title: "Basics"
---
# Component Basics

A component is the core concept in CodeOnly.  

This page describes the most common and most important concepts of
working with components.  See [Advanced Component Topics](componentsAdvanced)
to go deeper.


## Anatomy of a Component

Most components will conform to the common basic structure consisting
of:

* logic
* a DOM template
* CSS style declarations

<div class="tip">

By declaring logic, templates and styles in code the entire
definition of a component can be contained in a single `.js` file - 
ie: single file components.

</div>


```js
import { Component, Style } from "@codeonlyjs/core";

// Components extend the 'Component' class
export class MyComponent extends Component
{
    // Logic here

    static template = {
        
        // DOM template here

    }
}

// CSS styles here
Style.declare(`

`);

```

## Logic

A component is just a regular JavaScript class so its "logic"
can be anything you like, but will typically consist of:

* Data fetching
* Business logic
* Public properties to configure the component
* Properties and methods to support the template
* Event handlers for DOM elements
* Event handlers for external objects
* Code to raise events from this component
* Life-cycle handlers (eg: `onMounted()`, `onUnmounted()`)



## Templates

Templates are covered in detail in the template documentation.

The following sections explain key concepts relating to use templates
in components.


## Template Declaration

A template is a JavaScript object that describes the DOM elements 
associated with a component.

Most components will declare their template using a static
field named `template` on the component class.

```js
export class MyComponent extends Component
{
    static template = {  /* This component's template */
        type: "div",
        text: "This is My Component",        
    }
}
```

<div class="tip">

It's important to understand that the template is static and not
associated with any one component instance.  

This is because CodeOnly "compiles" the template to JavaScript and 
it would be extremely inefficient to do this for every component instance.

</div>



## Dynamic Values

A template can declare dynamic values using callbacks.

```js
export class MyComponent extends Component
{
    constructor()
    {
    }

    #title;
    get title() 
    { 
        return this.#title 
    }
    set title(value)
    {
        this.#title = value;
        this.invalidate();  /* Update the DOM */ 
    }

    static template = {
        type: "div",
        text: c => c.title, /* Callback for dynamic content */
    }
}
```


If the dynamic content used by a component's template change, the 
component needs to be updated to apply those changes in the DOM.

There two methods for this:

* `update()` - updates the DOM immediately
* `invalidate()` - schedules the component to be update on the next
  update cycle.

In general you should use `invalidate()` as it can coaelesc multiple 
updates into a single DOM update.  This save's the browser from multiple
reflows and is more efficient.

<div class="tip">

If you need to access the DOM but there are pending updates you 
can either call the `update` method, or use the `nextFrame` function
to get a callback after the pending updates have been made.

</div>


## Binding Elements

To access the DOM element in a template, use the `bind` setting.

eg: suppose you're using a third party light-box component as a photo
    viewer and it needs to be passed a root element to work in.

```js
export class MyLightBox extends Component
{
    constructor()
    {
        super();

        // Make sure DOM is created before accessing it
        this.create();

        // `this.lightbox` set by the bind setting in the template
        externalLightBoxLibrary.init(this.lightbox);
    }

    static template = [
        {
            type: "div",
            bind: "lightbox",
        }
    ]
}
```

<div class="tip">

Normally, the DOM elements for a component aren't created until
the component is mounted.  To access the elements before then,
call the `create()` method as shown in the above example.

</div>


## Event Handlers

Hook up event handlers using the `on_` prefix in the template.

```js
export class MyButton extends Component
{
    onClick()
    {
        alert("Oi!");
    }

    static template = {
        type: "button",
        on_click: c => c.onClick(),
    }
}
```

If you need the event object, it's passed as the second parameter to the 
callback:

```js
export class MyForm extends Component
{
    onSubmit(ev)
    {
        ev.preventDefault();
    }

    static template = {
        type: "form",
        on_submit: (c, ev) => c.onSubmit(ev),
    }
}
```

## Components in Templates

To use another component in a template:

1. set the "type" setting to the component class
2. set properties and event handlers as per usual

In the following example, the `Main` component's template uses three other 
components:  `Header`, `SidePanel` and `ContentArea`.

```js
import { Header } from "./Header.js";
import { SidePanel} from "./SidePanel.js";
import { ContentArea } from "./ContentArea.js";

export class Main extends Component
{
    static template = [
        Header, /* If no other settings, just use class name */
        {
            type: "div",
            $: [
                {
                    type: SidePanel, /* Component class */
                    title: "Table of Contents", /* A component property */
                    on_click: c => /* A event from the component */
                        c.onSidePanelClick() 
                },
                {
                    type: ContentArea, /* Component class */
                    document: "readme.md", /* A Component property */
                }
            ]
        }
    ]
}
```

<div class="tip">

If a referenced component has no properties or event handlers, you
can just use the component class name directly - as shown in the 
above example with the `Header` component.

ie; `Header` is a shortcut for `{ type: Header }`

</div>



## Raising Events

The `Component` class extends the standard `EventTarget` class so
it can raise (aka "fire" or "dispatch") it's own events.

eg: a custom button component raising a "click" event.

```js
class MyButton extends Component  /* Component extends EventTarget */
{
    onClick()
    {
        // Raise event
        let ev = new Event("click");
        ev.target = this;   /* Attach any other event properties here */
        this.dispatchEvent(ev);
    }

    static template = {
        type: "button",
        on_click: c => c.onClick(), /* Original event from the internal button */
    }
}
```


## Async Data Loads

Components will often need to load data from external sources. 
This is commonly referred to as "async data loading" and usually 
a spinner will be shown until the data is received.

Since this is a common pattern for many components, the `Component`
class includes a couple of helpers: a `load` method, a `loading` and
`loadError` property and some associated events.

The `load` method does the following:

1. sets the `loading` property to true 
2. clears the `loadError` property
3. calls the `invalidate` method to mark the component for update
4. dispatches a `loading` event
5. calls and `await`s the supplied callback
6. catches and stores any thrown errors to the `loadError` property
7. calls the `invalidate` method again
8. dispatches a `loaded` event

For example:

```js
class ProductsPage extends Component
{
    constructor()
    {
        // Call refresh method to start data load
        this.refresh();
    }

    async refresh()
    {
        // Call `load`
        return this.load(async () => {

            // Clear old data
            this.data = null;

            // Load new data
            let response = await fetch("/products");
            this.data = await response.json();

        });
    }

    static template = [
        {
            // Show spinner (while loading)
            if: c => c.loading,
            type: MySpinnerComponent,
        },
        {
            // Show load error (if failed)
            elseif: c = c.loadError,
            type: "div",
            class: "error",
            text: c => c.loadError.message,
        },
        {
            // Show data (if succeeded)
            else: true,
            type: "div",
            class: "products",
            $: {
                // products template here
            }
        }
    ]
}
```

Using this approach provides a couple of benefits:

* The `load` method is `async`, so you can `await` it to know
  when the load has finished.
* It's exception safe - any thrown errors are captured and the 
  the `loading` flag is cleared on success or failure.
* It provides an easy mechanism for a component to know if
  data, an error or a spinner should be shown.
* It's integrated with a broader "environment" loading mechanism 
  so other interested parties (eg: server side rendering) can
  be notified when the entire page is loaded - more on this later.



## Mounting Components

Mounting a component makes it appear on the page.

Most of your components will be mounted automatically by parent
components, but the root of your application needs to be mounted
manually.

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
might mount the top-level component for an entire application, the
same approach can be used to mount smaller widgets, controls and
panels - even if the rest of the proejct doesn't use CodeOnly.

</div>


## Component Life-Cycle

Components have the following life-cycle states:

* **Constructed**: Immediately after the JavaScript object is constructed
but before the DOM elements have been created. 

* **Created**: Once the DOM elements have been created. Usually this 
happens automatically just before the component is mounted.  If you
need to access the DOM elements beforehand, call the `create()` method.

* **Mounted**: After the component's DOM is attached to the document DOM - 
The component's `onMounted()` method is called when it's mounted.

* **Unmounted**: After a component is removed from the document DOM.  
The component's `onUnmounted()` method is called when it's unmounted.

* **Destroyed**: After a parent component that constructed this component
no longer needs the component it will call's the component's `destroy()`
method which releases the DOM elements associated with the component.

In general a component should connect to external resources in the
`onMounted()` and disconnect from them in `onUnmounted()`.  These are
the most reliable mechanism to know if a component is still in use.

A component will never be destroyed while it's mounted.

A destroyed component is effectively reset to the "constructed" state
and can re-created if necessary.  


## Styles

To declare CSS styles associated with your component, use the 
`Style.declare()` function.  It takes a CSS string and adds
it to the `<head>` section of the document.

We recommend scoping your styles to a component specific CSS class 
to avoid CSS name clashes.

This example scopes its content with the class name `my-component`
and nests styles with-in that class.  Styles on the `<p>` element
only apply to those in this component.

```js
class MyComponent extends Component
{
  static template = { 
    type: "div", 
    class: "my-component",
    $: [ 
        // Child elements
        {
            type: "p",
            text: "This is some text",
        }
    ]
  }
}

Style.declare(`
.my-component
{
    p
    {
        text-align: center;
    }
}
`); 
```

<div class="tip">

Styles declared by `Style.declare()` are added to the document
exactly as specified.  The above example using nested CSS for
scoping requires a reasonably modern browser.

If you need to work with old browsers that don't support this you
will need to either manually de-nest your declarations or use an 
external CSS preprocesor (LESS, SASS etc...) - but they can't be
used with the CodeOnly's `Style.declare` mechanism.

</div>


## Next Steps

* Learn more about [Templates](templates)
* Read about [Advanced Component Topics](componentsAdvanced)


