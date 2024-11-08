---
title: "Basics"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
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
    static template = {}; /* The template must be declared static */
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
    type: "div",  /* "type" as a string => HTML Element */

    $: [ /* $ means an array child nodes */

        "Hello World", /* plain string => text node */

        Html.raw("<span>Hello</span>"), /* Html.raw => raw HTML text*/

        {
            type: "div", /* A child HTML element */
            text: "Hello World",
        },

        {
            type: MyComponent, /* Class name => component reference*/
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
{
    type: "header",
    $: [
        {
            type: "div",
            text: "apples",
        },
        {
            type: "div",
            text: "pears",
        }
    ]
}
```

The above is equivalent to:

```html
<header>
    <div>apples</div>
    <div>pears</div>
</header>
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
{
    type: "header",
    $: { /* only a single child node, so no need for an array here */
        type: "div",
        text: "apples",
    },
}
```


## Dynamic Properties

Most values in a template can be declared dynamically by providing a callback
instead of a static value:

```js
{
    type: "div",
    text: c => c.divText()  /* Call a function to get the text */
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