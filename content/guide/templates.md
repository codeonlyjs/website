---
title: "Basics"
---
# Template Basics

A template is a JSON-like object that describes how create and update
a heirarchy of DOM elements.   

<div class="tip">

Most of the documentation on templates assumes their use with CodeOnly
Components.  For information on using the template compiler directly see
[Template Internals](templateInternals).

</div>


## Declaring a Component Template

Most components declare their template as a static field named
`template` on the component class:

```js
class MyComponent extends Component
{
    static template = {}; /* i:  The template must be declared static */
}
```


## Node Kinds

The structure of a template is a tree of "nodes" that describe a 
heirarchy of DOM elements that the template creates and manages. 

There are different kinds of template nodes:

* **Plain Text** - declared as a string or a function that
  returns a string:

  ```js
  "Hello World, I'm a text node",
  () => new Date().toString(),
  ```

* **HTML Text** - declared using the `html()` directive wrapping a string or 
  a callback that returns a string. 

  ```js
  html("<span>My Text Span</span>"),
  html(() => `Now: <span>${new Date().toString()}</span>`),
  ```

* **HTML Elements** - declared as an object with a `type` property that is 
  the tag name of the element, attributes declared as other properties and 
  child nodes declared with the `$` property:
  
  ```js
  {
    type: "div", /* i: tag name */
    id: "my-div", /* i: id attribute */
    $: [ /* i: child nodes array */
        { type: "span" }, /* i: child node 1 */
        { type: "span" }, /* i: child node 2 */
    ]
  }
  ```

  produces:

  ```html
  <div id="my-div">
    <span></span>
    <span></span>
  </div>
  ```

* **Fragments** - fragments are multi-root elements declared as an object 
  with child nodes, but no type property:
  
  ```js
  { /* i: no "type" attribute makes this a fragment */
    $: [
        "child 1", 
        "child 2",
        "child 3",
    ]
  }
  ```
  

* **Components** - templates can include components by declaring a node
  with a `type` property that is the component class and other properties
  declaring propertirs to be assigned to tbe component. 

  ```js
  {
    type: MyComponent, /* i: the component class */
    myProp: "Hello World", /* i: will set "myProp" on the component */
  }
  ```



## Child Nodes

The `$` property is called the content property.

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

css`
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
`
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

You might look at the above template and HTML and feel
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

css`
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
`
// ---
```


## Dynamic Content

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

When any dynamic content changes, the template's `update` method
needs to be called in order for the change to be reflected in the DOM.  

When working with components this can be managed using the `Component.invalidate()` 
or `Component.update()` methods - [see here](components#dynamic-content).

This example toggles the text displayed in a `div` each time it's clicked:

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
        on_click: "onClick", /* i: See below for more on event handlers */
    }
}
```


## Event Handlers

To listen to events raised by HTML elements and components,
add a property to the template node using the event named prefixed 
with `on_`.

```js
    on_click: c => c.onClick();
```

This example listens to a button for its "click" event:

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
        on_click: c => c.onClick(), /* i: event handler */
    }
}
```

If you need the event object, it's passed as the second parameter to the 
callback:

```js
    on_click: (c,ev) => c.onClick(ev);
```

This example uses `preventDefault()` to prevent navigation when clicking 
on an `<a>` element:


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
        on_click: (c, ev) => c.onClick(ev), /* i: event handler */
    }
}
```

Instead of passing a function as the event handler, you can instead pass
the string name of a function to call on the component.

The following is identical to the previous example, passing `(ev)` to 
the handler:

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



## Binding Elements

To access the DOM nodes and nested compoonents constructed by a template 
use the `bind` directive to specify the name of a property on your component.

When the DOM tree is created, the specified property will be assigned a reference
to the created element (or component).

For example this would make the input field available to the component
as `this.myInput`:

```js
{
    type: "input",
    bind: "myInput",
}
```

Before accessing bound fields, you need to make sure the component
has been "created" and not just constructed.  Normally a component's
DOM tree isn't created until it's first mounted.

If you need the DOM elements beforehand, call the component's `create()` 
method to ensure the DOM has been created.

For example, suppose you're using a third party light-box component as 
a photo viewer and it needs to be passed a root element to work with.

```js
export class MyLightBox extends Component
{
    constructor()
    {
        super();

        // Ensure DOM created before accessing bound elements
        this.create(); 

        // `this.lightbox` will be set to the div element
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



