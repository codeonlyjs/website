---
title: "Cheat Sheet"
description: "CodeOnlyJS Cheat Sheet"
---

# Cheat Sheet

This page gives a quick summary of all the basics for developing apps 
with CodeOnlyJS.

## Generating New Projects

You can generate a new CodeOnly project with `cogent`, the 
CodeOnly code generator:

To generate a new standalone single page app use the `spa` template:

```
npx codeonlyjs/cogent new spa MySinglePageApp
```

The `fullstack` template generates a single page app with an 
Node/ExpressJS server configured to serve the app and to serve
as a backend API server:

```
npx codeonlyjs/cogent new fullstack MySinglePageApp
```

The generated project will include a readme file with additional
information on the structure of the project and how to run it.

See also [cogent](cogent).

## Components

### Generating New Components

Cogent can also generate new components:

```
npx codeonlyjs/cogent new component MyNewComponent
```

The `page` template generates a component with router handler:

```
npx codeonlyjs/cogent new page MyNewPage
```


### Anatomy

Most components will conform to this basic structure:

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


### Mounting

Components are usually automatically mounted as children
of other components.  The root component of your application
needs to be manually mounted however by calling the `mount`
method and passing either an element to mount into, or a selector
for the element to mount into:

```js
// Create component
let main = new MyMainComponent();

// Mount it into the `body` element
main.mount("body");
```

When a component is mounted/unmounted, its `onMount`/`onUnmount` methods
will be called to notify the component.  The `mounted` property indicates
if the component is currently mounted.

```js
class MyComponent extends Component
{
    // Called when component is mounted
    onMount()
    {
        // Acquire external resources
    }

    // Called when component is unmounted
    onUnmount()
    {
        // Release external resources
    }
}
```

Components should only hold references to external resources (eg: external
event listeners) while the component is mounted otherwise dangling references
to the component might be held causing the component to be unable to be 
garbage collected.

The [`listen`](componentsAdvanced#listening-to-external-events) method 
provides an easy way to safely connect external event listeners.

See also [Mounting Components](components#mounting-components) and 
[Component Lifecycle](componentsAdvanced#component-life-cycle).

### Async Data Loads

The `load` method provides an easy mechanism for performing async data
loads:

```js
class MyComponent extends Component
{
    constructor()
    {
        super();
        this.refresh();
    }

    refresh()
    {
        // Async data load...
        load(async () => {
            this.data = await fetch(...);
        });
    }

    static template = [
        {
            // Show spinner while loading
            if: c => c.loading,
            type: "div .spinner",
        },
        {
            // Show error message if failed
            elseif: c => c.loadError,
            type: "div .error",
            text: c => c.loadError.message,
        },
        {
            // Otherwise show the loaded data
            else: true,
            type: "pre .data",
            text: c => JSON.stringify(c.data, null, 4),
        }
    ]
}
```

While the load is in progress the components `loading` property
will return `true` - this can be used to show a spinner for example.

If an error is thrown during the load, the `loadError` property will
hold the error (after the `load` method returns).

See also [Async Data Loads](componentsAdvanced#data-loads).

### Accessing HTML Elements

To access HTML elements created by a component's template, use the 
`bind` directive to store a reference to the element in a property on 
the component.

The `create` method ensures the DOM elements have been created (usually 
they're not created until the component is mounted).

```js
class MyComponent extends Component
{
    constructor()
    {
        // Make sure DOM is constructed...
        this.create();

        // ...before accessing bound elements:
        this.myDiv.whatever...
    }


    static template = {
        type: "div",
        bind: "myDiv",
    }
}
```

See also [Binding Elements](templates#binding-elements).

## Templates

Templates define the HTML content of a component and are are 
declared as the static `template` property of the component 
class (see anatomy example above).

### Text and HTML

Declare text nodes as JavaScript strings:

```js
static template = [
    "Text Node",
]
```

Use the `html` directive to include HTML in a template:

```js
static template = [
    html("<em>This is HTML</em>"),
]
```

See also [Text and HTML](templateText).

### Elements

HTML elements are declared as a JavaScript object with 
the `type` property set as the tag name.

Static attributes can be included after the tag name,
and `class` and `id` with CSS style syntax.

```js
static template = {
    type: "input .my-class #my-id type=password",
}
```

Attributes can also be declared as properties on the object:

```js
static template = {
    type: "a",
    href: "/",
    text: "Home",
}
```

Child elements are declared using the `$` property:

```js
static template = {
    type: "div",
    $: [
        { type: "span", text: "child 1" },
        { type: "span", text: "child 2" },
        { type: "span", text: "child 3" }
    ]
}
```

See also [HTML Elements](templateHtmlElements).

### Dynamic Content

Most things in a template can be declared dynamically using 
fat arrow `=>` callbacks.  The callback's first parameter
is a reference to the component instance and typically called
`c` (for "component").

When a dynamic property has changed, call `invalidate` to 
mark the component as requiring an update.

```js
class MyComponent extends Component
{
    #greeting = "Hello World",
    get greeting()
    {
        return this.#greeting;
    }
    set greeting(value)
    {
        // Store new greeting
        this.#greeting = value;

        // Schedule an update for this component's DOM
        this.invalidate();
    }

    static template = {
        type: "div",
        text: c => c.greeting,
    }
}
```

See also [Dynamic Content](templates#dynamic-content).

### Boolean Classes

To dynamicly add or remove a class to an element, include a property
in the template with the class name prefixed by `class_`:

```js
static template = {
    type: "div",
    class_selected: c => c.isSelected,
}
```

Similar settings are available [style properties](templateHtmlElements#dynamic-named-styles) and [element visibility](templateHtmlElements#display-visibility).

### Events

To connect event handlers to template elements, include
a property with `on_` prefixed to the event name:

```js
class MyComponent extends Component
{
    onClick(ev)
    {
        alert("Clicked");
    }

    static template = {
        type: "button",
        on_click: (c, ev) => c.onClick(ev),
    }
}
```

Instead of a function you can also just include the name of the
function on the component to call.  This is equivalent to the above:

```js
        on_click: "onClick"
```

See also [Event Handlers](templates#event-handlers).

### Nested Components

To use another component in a template, set the `type` property
to the component class.

Component properties and event handlers work just like with
HTML elements:

```js
import { MyOtherComponent } from "./MyOtherComponent.js";

class MyComponent extends Component
{
    static template => {
        type: MyOtherComponent,
        prop1: "Hello",
        prop2: "World",
        on_click: c => alert("Oi!"),
    }
}
```

See also [Component References](templateComponents).

### `if` Blocks

To conditionally include template content, use an `if` directive

```js
static template = [
    {
        if: c => c.someCondition,
        type: "div",
        text: "Hello World",
    }
]
```

`elseif` and `else` directives are also supported:

```js
static template = [
    {
        if: c => c.someCondition,
        type: "div",
        text: "Hello World",
    },
    {
        elseif: c => c.someOtherCondition,
        type: "div",
        text: "Goodbye",
    }
    {
        else: true
        type: "div",
        text: "Error",
    }
]
```

See also [if directive](templateIf).

### `foreach` Blocks

Repeat elements using the `foreach` directive, passing an 
array of items to repeat over.

The callbacks for other properties change from `c` for the 
component to `i` for the array item.  To access the component
use `i.outer.model`.

```js
static template = [
    {
        foreach: [ "apples", "pears", "bananas" ],
        type: "div",
        text: i => i,
    }
]
```

For more efficient updates on larger arrays, provide an item key callback:

```js
static template = [
    {
        foreach: {
            items: c => c.items,
            itemKey: i => i.id,
        },
        type: "div",
        text: i => `${i.id}: ${i.name}`,
    }
]
```

See also [foreach directive](templateForEach).

### Other

Templates also support [Input Bindings](templateInput),
[CSS Transitions](templateTransitions) and [Embed Slots](templateEmbedSlots).

Also, for a set of helpers for more concisely construction templates, see
the [Fluent API](templateFluent).

## Styles

Styles can be declared with the `css` template literal function and
will be added to the `<head>` section of the document:

```js
css`
div.my-class
{
}
`
```

See also [Styles](components#styles).

## Router

For single page apps, CodeOnly include a simple but effective
router object.

Register route handlers:

```js
import { router } from "@codeonlyjs/core";

router.register({
    pattern: "/about",
    match: (to) => { 
        to.page = new AboutPageComponent(); 
        return true;  
    }
});
```

Hook up event handler to show the loaded page:

```js
router.addEventListener("didEnter", (from, to) => {

    // Load page into our embed slot
    this.routerContentSlot.content = to.page;

});
```

Don't forget to start the router after you've mounted
the root component of your application:

```js
// Mount main component
new Main().mount("main");

// Start the router
router.start();
```

To construct links just use normal `<a href>` links - the 
router will detect clicks on suitable links and automatically 
perform in-page navigation - no special handling is required here.
See [Out of App Links](routerNotes#out-of-app-links) for more on
controlling which links the router responds to.

See [Router](routerBasics) for more information including how
to configure navigation guards, async page loading and URL mapping.


## Rendering

CodeOnlyJS supports server-side rendering (SSR) and static
site generation (SSG).

See [Rendering](renderIntro) for how to set this up.
