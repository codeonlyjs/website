---
title: "Input Bindings"
---
# Input Bindings

Input bindings provide a two way binding between an HTML input element
and an object property.


## Basic Usage

To declare an input binding, use the `input` key of the template node
and set it to a string identifying the property on the component.

In this example, the input text field will be initialized to the value
of `userName` and as the user edits the value, the `userName` property
will be updated.

```js
// lab code demo
class Main extends Component
{
    userName = "darth-vader";
    static template = [
        {
            type: "input type=text",
            input: "userName"
        },
        " ",
        {
            type: "button",
            text: "Show Value",
            on_click: c => alert(c.userName),
        }
    ]
}
```



## Input Field Types

Most input field types map from the input element's `value` property
directly to the object property value.

There are some exceptions:

* Checkbox values are mapped between a JavaScript `boolean` value and the `input` 
  field's `checked` property (and vice-versa)
* Radio buttons map the `checked` input element's `value` property to a single
  string property value.  An input binding needs to be declared on each radio
  button.
* `<select>` elements with the `multiple` option are mapped as an array of 
  strings - one entry for each selected option.



## Use with Property Accessors

Often you will want to update other displayed values when an input changes.
One way to do this is to declare property accessors that invalidate the
component.

This example reflects the value of the input field converted to upper-case.

```js
// demo code lab
class Main extends Component
{
    #userName = "darth-vader";
    get userName()
    {
        return this.#userName;
    }
    set userName(value)
    {
        this.#userName = value;
        this.invalidate();
    }

    static template = [
        {
            type: "input type=text",
            input: "userName"
        },
        {
            type: "span .output",
            text: c => c.userName.toUpperCase(),
        }
    ]
}
// ---

Style.declare(`
    span.output
    {
        padding: 10px;
    }
`)
// ---
```


## Targeting a Sub-Object of a Component

In the above examples, the input binding was targeted to the
template's component.

To target a sub-object of the component, use dotted notation:

```js
// demo code lab
class Main extends Component
{
    user = {
        name: "darth-vader",
        position: "Sith Lord",
    }

    static template =  [
        {
            type: "input type=text",
            input: "user.name"
        },
        {
            type: "input type=text",
            input: "user.position"
        },
        {
            type: "button",
            text: "Show Values",
            on_click: c => alert(JSON.stringify(c.user, null, 4))
        },
    ]
}
// ---

Style.declare(`
    input
    {
        width: 200px;
        margin-right: 10px;
    }
`)
// ---
```



## Input Binding Options

For more complex input bindings the value of the `input` key
needs to be specified as an object.

In the above examples, a simple string value was used as the
input binding target.  When using an options object, the property 
name is declared using the `prop` key of the options object.

```js
input: {
    prop: "userName",
    // other settings here
}
```

### `event`

Normally, input bindings trigger in response to the HTML `input` event giving
immediate updates when the user interacts with the input field.

The `event` option lets you choose a different trigger event.  

eg: setting this to `change` will fire when the input value changes, but only
after the user leaves the field (not every keystroke)

```js
    input: {
        prop: 'myField',
        event: 'change'     // Trigger `change` event instead of `input`
    }
```

### format

A callback to format a property value for display in an input field.


eg: to display a floating point as a percentage with two decimal places:

```js
// demo lab code
class Main extends Component
{
    #percent = 1;
    get percent()
    {
        return this.#percent;
    }
    set percent(value)
    {
        this.#percent = value;
        this.invalidate();
    }

    static template = {
        type: "input type=number",
        input: {
            prop: 'percent',
            event: 'change',
            parse: v => parseFloat(v) / 100,
            format: v => (v * 100).toFixed(2).toString(),
        }
    }
}
```


### `get` / `set`

The `get` and `set` input options let you completely replace the
default `target`.`prop` mapping with your own accessor functions.

These callbacks, will be invoked with the following parameters

* `get(model, ctx)`
* `set(model, value, ctx)`

Where

* `model` is the template's model object (usually the component)
* `ctx` is the template's context object (not usually needed)
* `value` is the value received from the input field and to be 
  assigned/stored.


```js
    input: {
        get: (model) => model.myField,
        set: (model, value) => model.myField = value,
    }
```





### `on_change`

The `on_change` option specifies a callback to be invoked whenever the
input binding is triggered.

This could be used for example to invalidate a component when an input 
field changes. 

```js
    input: {
        prop: 'user.name',
        on_change: c => c.invalidate()
    }
```

<div class="tip">

This field is always `on_change` - regardless of the actual underlying
HTML event (ie: `input` vs `change`).

</div>


### parse

A callback to convert the original value from the HTML input field
to a format expected by the target property.

eg: if the target property must be an integer:

```js
    input: {
        prop: 'count',
        parse: v => parseInt(v),
    }
```


### `prop`

The name of the property on the target object to bind to/from.


### `target`

The `target` option specifies the target object of the input 
binding.  ie: the object whose `prop` is to be used.

eg: suppose you had a global `appSettings` object with a `darkMode`
setting, you could bind a checkbox like so:

```js
import { appSettings } from "./appSettings.js"

class MyComponent extends Component
{
    static template = {
        type: "input type=checkbox",
        input: {
            prop: "darkMode"
            target: appSettings,
        }
    }
}
```

The target property can also be a callback.

eg: in this contrived example, the checkbox would update the `enabled`
field on one of the objects in an array:

```js
class MyComponent extends Component
{
    options = [{
        enabled: true,
    }];
    selectedIndex = 0;

    static template = {
        type: "input type=checkbox",
        input: {
            prop: "enabled"
            target: c => c.options[c.selectedIndex],
        }
    }
}
```

When not specified, the template's `context.model` (usually the 
component) is used.

<div class="tip">

When using a `target` property you can still use the dotted
notation on the `prop` field to access sub-objects.

</div>


