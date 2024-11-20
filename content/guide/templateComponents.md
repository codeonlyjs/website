---
title: "Component References"
---
# Component References

A template can use other components.

1. set the `type` setting to the component class
2. set properties and event handlers as per usual

The following example implements a `Widget` component that displays 
a `text` property in a `div`.  The main component then uses
two instances of the Widget.

```js
// lab code demo
// A useless "widget"
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


## Component Properties

Any properties specified by the template that aren't recognized by the 
template compiler are assumed to be component properties and will be 
assigned to the component when it's created.

Component properties can be dynamic callbacks:

```js
{
    type: MyButton,
    title: c => c.isLoggedIn ? "Sign Out" : "Sign In",
}
```

## Handling Events

Components extend the `EventTarget` class so are able to raise events.

Adding event handlers to components is exactly the same as adding event
handlers for HTML elements:

eg: suppose the `MyButton` class has a click event:

```js
{
    type: MyButton,
    title: "Click Me!",
    on_click: (c, ev) => c.onButtonClicked(ev),
}
```



## The Content Property

While the `$` property is used to add child nodes to HTML elements, for 
components its simply a short cut to a property named `content`.

Of course what your component decides to do with it's content is up to you.



## Deep Updates

Normally when a template is updated any nested component references will 
have changed properties applied, but the component's own `update` method 
is *not* invoked.

The idea here is that components should handle updating themselves when their
properties changed.

This behaviour can be changed with the `update` property in the parent
template, which can have one of the following values:

* **A callback** - the template will call the function and if it returns
  a truthy value, the component will be updated
* **The string "auto"** - the component will be updated if any of its 
  properties were changed by the parent template
* **Any other truthy value** - the component will always be updated
* **A falsey value** - the component will never be updated

eg: Always update:

```js
template = {
    type: MyComponent,

    // update MyComponent when this template updates
    update: true,           
};
```

eg: Conditionally update:

```js
template = { 
    type: MyComponent,

    // update MyComponent if c.shouldUpdate is true
    update: c => c.shouldUpdate
}
```

eg: Automatically update:

```js
template = { 
    type: MyComponent,

    // update MyComponent only if any of the 
    // dynamic properties below changed
    update: "auto"

    prop1: c => c.prop1,
    prop2: c => c.prop2,
    prop3: c => c.prop3,
}
```



