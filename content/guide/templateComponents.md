---
title: "Components (in Templates)"
---
# Using Components in Templates

Besides text and other HTML nodes, a template can also reference a component.

## Component Type

To use a component in a template, set the node's `type` attribute to a constructor
or class reference.

eg: suppose you have a component called `MyButton`, with a title property.

```js
class MyButton extends Component
{
    #title;
    get title()
    {
        return this.#title;
    }
    set title()
    {
        this.#title = value;
        invalidate();
    }

    // etc...
}
```

To use this component in a template, create a node with the `type` property set to 
the component's class ie: `MyButton`

<div class="tip">

Note the component is referenced by it's JavaScript class, not a string of its name.

</div>

```js
import { MyButton } from "./MyButton.js"; /* Don't forget to import the component */

{
    type: "div",
    $: [
        { 
            type: MyButton, /* Use a class name to create a component */
            title: "Button 1" /* Other settings will be set as properties on the component */
        },
        { 
            type: MyButton, /* Create multiple instances if needed*/
            title: "Button 2", /* with different properties */
        },
    ]
}
```

## Component Properties

As shown in the above example  with the `title` property, any properties specified 
by the template that aren't recognized by the template compiler are assumed to be 
component properties and will be assigned to the component when it's created.

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

Normally when compiled template is updates (either directly or indirectly via 
`Component.invalidate()`) any component references will have changed properties
assigned, but the component itself does not have it's `update` method called.

The idea here is that components should handle updating themselves when their
properties changed.

This behaviour can be changed with the `update` property in the parent
template, which can have one of the following values:

* A function - the template will call the function and if it returns
  a truthy value, the component will be updated.
* The string "auto" - the component will be updated if any of its 
  dynamic properties changed in value.
* Any other truthy value - the component will always be updated
* A falsey value - the component will never be updated

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



