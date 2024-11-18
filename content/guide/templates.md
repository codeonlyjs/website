---
title: "Basics"
---
# Template Basics

A CodeOnly template is a JavaScript object that can be used to create and update
DOM elements.

<div class="tip">

Most of the documentation on templates assumes their use with CodeOnly
Components.  For information on using the template compiler directly see
[Template Internals](templateInternals).

</div>


## Declaring a Component Template

A CodeOnly component declares its template as a static member of the component class:

```js
class MyComponent extends Component
{
    static template = {}; /* i:  The template must be declared static */
}
```

<div class="tip">

Templates are declared static because they're are compiled at runtime to JavaScript 
and it would be extremely inefficient to re-compile for each component instance.  

The template is compiled the first time an instance of a component is constructed 
and re-used for all subsequent instances.

</div>


## Node Kinds

The structure of a template is a tree of JavaScript objects called "nodes"
that describe the heirarchy of the template.

There are different kinds of template nodes:

* Text
* HTML Text
* HTML Comments
* HTML Elements
* Fragments (aka multi-root elements)
* Components
* Integrated Components

The kind of node is determined by how it's declared in the template.  For example
here is a template that declares nodes of various kinds:

```js
{
    type: "div",  /* i:  "type" as a string => HTML Element */

    $: [ /* i:  $ means an array child nodes */

        "Hello World", /* i:  plain string => text node */

        Html.raw("<span>Hello</span>"), /* i:  Html.raw => raw HTML text*/

        {
            type: "div", /* i:  A child HTML element */
            text: "Hello World",
        },

        {
            type: MyComponent, /* i:  Class name => component reference*/
            prop1: "Apples",
            prop2: "Pears",
        },
    ]
}
```


## Child Nodes

The `$` property is called the content property and declares
the child content of a node.

For HTML elements it's an array of child nodes:

```js
// code demo lab
// ---
class Main extends Component
{
// ---
    static template = {
        type: "div .child-nodes-demo",
        $: [
            {
                type: "span",
                text: "apples",
            },
            {
                type: "span",
                text: "pears",
            }
        ]
    }
// ---
}

Style.declare(`
.child-nodes-demo
{
    span
    {
        display: inline-block;
        padding: 0 10px;
        margin: 0 5px;
        border: 1px solid var(--gridline-color);
        border-radius: 5px;
    }
}
`)
// ---
```

The above is equivalent to:

```html
<div class="child-nodes-demo">
    <span>apples</span>
    <span>pears</span>
</div
```

<div class="tip">

You might be looking at the above template vs HTML declaration and feel
the HTML is easier to type and clearer to understand.

For this simple example it is but by the time you add in dynamic
properties, event handlers, component references, conditional blocks and
list rendering the template format starts to become much more attractive
(at least we think so).

</div>


If a node has only a single child node, there's no need for the array syntax:

```js
// code demo lab
// ---
class Main extends Component
{
    static template = {
        type: "div .child-nodes-demo2",
// ---
        $: { /* i:  only a single child node, so no need for an array here */
            type: "span",
            text: "apples",
        },
// ---
    }
}

Style.declare(`
.child-nodes-demo2
{
    span
    {
        display: inline-block;
        padding: 0 10px;
        margin: 0 5px;
        border: 1px solid var(--gridline-color);
        border-radius: 5px;
    }
}
`)
// ---
```


## Dynamic Properties

Most values in a template can be declared dynamically by providing a callback
instead of a static value:

```js
{
    type: "div",
    text: c => c.divText()  /* i:  Call a function to get the text */
}
```

The arguments passed to a callback are a `model` object and a `context` object.

```js
callback(model, context)
```

When using templates with components the `model` object is the component instance 
which is why we conventionally call it `c`. The `context` object is often unused. 

<div class="tip">

The callback's `this` argument is also set to the model object however this is 
rarely (if ever?) used.

</div>

When the value of a dynamic property has changed, the template's `update` method
needs to be called in order for the change to be reflected in the DOM.  When working
with components this can be managed using the `Component.invalidate()` or
`Component.update()` methods - [see here](components#dynamic-values).


## Event Handlers

HTML Elements and Components can raise events.  To listen to these events
add a property to the template node using the event prefixed with `on_`.

If you don't need the event object you can leave it out:

```js
{
    type: "button",
    on_click: c => c.onClick();
}
```

If you do need the event object, it's passed as a second parameter:

```js
{
    type: "button",
    on_click: (c,ev) => c.onClick(ev);
}
```


## Binding

To access the constructed nodes in a template (ie: the actual DOM elements
or constructed component instances) add a `bind` property to the node specifying
the name of a property on your component to assign the reference to.

Binding is often used with input fields:

```js
{
    type: "input",
    bind: "elInput",
}
```

In the above example, when the DOM is created, a reference to the created
`<input>` element will be assigned to a property `elInput` on the template's 
model object (ie: your component).

In your component you an now get and set that value when needed:

```js
class MyComponent extends Component
{
    someFunction()
    {
        alert(this.elInput.value);
    }

    static template = {
        type: "input",
        bind: "elInput",
    }
}
```

<div class="tip">

Templates also support a similar concept to binding called "exporting".

With exporting instead of the element reference being assigned to a 
property on the model, a property is added to the constructed DOM object.

This is rarely used but is convered in [Template Internals](templateInternals).

</div>


<div class="tip">

It's important to understand that the template is static and not
associated with any one component instance.  

This is because templates are "compiled" to JavaScript. To re-compile
the template for every component instance would be extremely inefficient.

</div>



## Dynamic Values

A template can declare dynamic values using callbacks.

```js
// lab demo code
class MyComponent extends Component
{
    #clicked = false;

    // A dynamic property used by the template
    get title() 
    { 
        return this.#clicked ? "Clicked" : "Not Clicked";
    }

    onClick()
    {
        this.#clicked = !this.#clicked;
        this.invalidate(); /* i: Tells component to update */
    }

    static template = {
        type: "div",
        text: c => c.title, /* i: Callback for dynamic content */
        on_click: "onClick", /* i: See below for more on events */
    }
}
```


If the dynamic content used by a component's template change, the 
component needs to be updated to apply those changes in the DOM.

There two methods for this:

* `update()` - updates the DOM immediately
* `invalidate()` - schedules the component to be updated on the next
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

To access a DOM element in a template, use the `bind` directive.

eg: suppose you're using a third party light-box component as a photo
    viewer and it needs to be passed a root element to work with.

```js
export class MyLightBox extends Component
{
    constructor()
    {
        super();

        this.create(); /* i: see tip below */

        // `this.lightbox` will be set to the div element due
        // to the `bind: "lightbox"` directive in the template
        externalLightBoxLibrary.init(this.lightbox);
    }

    static template = [
        {
            type: "div",
            bind: "lightbox", /* i: Causes this.lightbox above to be set */
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
// demo lab code
class MyButton extends Component
{
    onClick()
    {
        alert("Oi!");
    }

    static template = {
        type: "button",
        text: "Click Me",
        on_click: c => c.onClick(),
    }
}
```

If you need the event object, it's passed as the second parameter to the 
callback:

```js
// demo lab code
class MyComponent extends Component
{
    onClick(ev)
    {
        ev.preventDefault();
        alert("Navigation Cancelled");
    }

    static template = {
        type: "a",
        href: "https://codeonlyjs.org/",
        text: "Link",
        on_click: (c, ev) => c.onClick(ev),
    }
}
```

Passing the name of an event handler as a string is a short-cut. The
following is identical to the above:

```js
// demo lab code
// ---
class MyComponent extends Component
{
    onClick(ev)
    {
        ev.preventDefault();
        alert("Navigation Cancelled");
    }

    static template = {
        type: "a",
        href: "https://codeonlyjs.org/",
        text: "Link",
// ---
        on_click: "onClick",
// ---
    }
}
// ---
```


## Components in Templates

To use a component in a template:

1. set the `type` setting to the component class
2. set properties and event handlers as per usual

The following example implements a `Widget` component that displays 
a `text` property in a `div`.  The main component then uses
two instances of the Widget.

```js
// lab code demo
// A simple "widget"
class Widget extends Component
{
    text;

    static template = {
        type: "div",
        text: c => c.text,
    }
}

class Main extends Component
{
    static template = [
        {
            type: Widget, /* i: First Widget component */
            text: "Hello", /* i: Sets the Widget's 'text' property */
        },
        {
            type: Widget, /* i: Second component instance */
            text: "World",
        }
    ]
}
```

If a referenced component has no properties or event handlers, you
can just use the component class name directly:

```js
// demo lab code
// A button that shows an alert when clicked
class MyButton extends Component
{
    static template = {
        type: "button",
        text: "Click Me",
        style_marginRight: "10px",
        on_click: () => alert("Click"),
    }
}

class Main extends Component
{
    static template = [
        MyButton,  /* i: No properties or events so no need for { type: } */
        MyButton,
        MyButton,
    ]
}
```
