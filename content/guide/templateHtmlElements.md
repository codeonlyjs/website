---
title: "HTML Elements"
---

# HTML Elements

This section describes how to declare HTML elements in templates.


## Tag Name

An HTML element is declared by specifying its tag name as the `type` property 
of the node:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "hr", /* i:  <hr /> */
    }
// ---
}
// ---
```

Note: unlike most other properties, the `type` property can *not* be a dynamic
callback function.



## Attributes

The attributes of an HTML element are declared as properties of
the template node:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "img",
        src: "/codeonly-icon.svg",
        width: "64",
        height: "64",
    }
// ---
}
// ---
```


Attributes declared this way can be dynamic, by providing a callback:

```js
// demo lab code
// ---
class Main extends Component
{
    size = 64;

    onToggle()
    {
        this.size = this.size == 64 ? 128 : 64;
        this.invalidate();
    }

    static template = [
// ---
    {
        type: "img",
        src: "/codeonly-icon.svg",
        width: c => c.size,
        height: c => c.size,
    },
// ---
    {
        type: "button",
        text: "Toggle Size",
        on_click: "onToggle",
    }
    ]
}
// ---
```

If an attribute name clashes with a name that has other special meaning, 
use the `attr_` prefix to explicitly state the value should be treated
as an attribute.

The most common example of this is setting the `type` attribute of an
input element (although this can usually be avoided using static attributes
as described below)


```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "input", 
        attr_type: "color", /* i: 'type' attribute clashes */
    }
// ---
}
// ---
```



## Static Attributes

The static attributes of an element can be set by appending them 
to the type field using the `name=value` syntax:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "input type=color", 
    }
// ---
}
// ---
```

<div class="tip">

Notice there's no clash on the 'type' attirbute using this method.

</div>


Use single or double quotes for attribute values with spaces:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "input type=password placeholder='Enter your password'", 
    }
// ---
}
// ---
```

The `id` and `class` attributes can also be set using a short-hand 
notation similar to CSS query selectors:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---

    {
        type: "div #my-div .redbox", 
        text: "This is my div",
    }

// ---
}
// ---

css`
#my-div
{
    width: 200px;
    text-align: center;
}
.redbox
{
    border: 1px solid red;
    color: red;
}
`
```

Spaces before `.class` and `#id` attributes are optional:

```js
// <div id="#my-div" class="class1 class2">
{
    type: "div#my-div.class1.class2",
}
```



## Inner Text/HTML

The inner text of an element can be set using the `text` property:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "div",
        text: "inner text",
    }
// ---
}
// ---
```

Use the `html()` directive to set inner HTML:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "div",
        text: html("<em>inner text</em>"),
    }
// ---
}
// ---
```


The text property also supports callbacks for dynamic content:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "div",
        text: html(() => `<em>${new Date().toString()}</em>`),
    }
// ---
}
// ---
```


Since inner text can also be expressed as child nodes, the
`$` property can also be used to set the text of an element:

```js
{
    type: "div",
    $: "inner text",
}
```

Caveat: when using a callback for the inner text of an element,
the `text` property is slightly more efficient than the `$` property.

ie: use `text: c => c.text` in preference to `$: c => c.text` where 
performance is critical.  

When the value is not a callback, the two approaches are identical.



## Child Nodes

The child nodes of an HTML element are declared using the `childNodes` property
or the special `$` content property (both are equivalent).

Child nodes are declared as an array:

```js
// lab code demo
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "div",
        $: [ /* i:  Array of child nodes */
            { type: "div", text: "child 1" },
            { type: "div", text: "child 2" },
            { type: "div", text: "child 3" },
        ]
    }
// ---
}
// ---
```

If there is only a single child the array container is not required:

```js
{
    type: "div",
    $: { /* i:  single child node */
        type: "div", text: "child" 
    },
}
```


## Boolean CSS Classes

Boolean classes conditionally add and remove a CSS class to an element.

Declare a boolean class by adding a property to the node named as the 
CSS class name prefixed by `class_`.

In this example the `selected` class will be added to, or removed from the
element depending on the value of the `c.selected` property:

```js
// code lab demo
// ---
class Main extends Component
{
    selected = false;

    onClick()
    {
        this.selected = !this.selected;
        this.invalidate();
    }

    static template = {
        type: "div .bool-class-demo",
        $: [
// ---
            { 
                type: "div",
                text: c => c.selected ? "Selected" : "Not Selected",
                class_selected: c => c.selected,
            },
// ---
            " ",
            {
                type: "button",
                text: "Toggle",
                on_click: "onClick"
            }
        ]
    }
}

css`
.bool-class-demo
{
    .selected
    {
        background-color: orange;
        color: white;
    }
}
`
// ---
```

To set class names that contain hyphens, use camelCase:

```js
{ 
    type: "div",
    class_isSelected: true, /* i:  class="is-selected" */
}
```

or, a string property key:

```js
{ 
    type: "div",
    'class_is-selected': true, /* i:  class="is-selected" */
}
```

Boolean classes can be used in conjunction with CodeOnly CSS transitions to 
provide animation effects when a class is added or removed from an element. 
See [CSS Transitions](templateTransitions) for more on this.



## Dynamic Named Styles

Named styles can be used to dynamically set the value of a single named 
CSS style property.

Declare a named styles by prefixing the name of the CSS property to set with `style_`:



```js
// code lab demo
// ---
class Main extends Component
{
    color = "green"

    onClick()
    {
        this.color = this.color == "green" ? "orange" : "green";
        this.invalidate();
    }

    static template = [
// ---
        { 
            type: "div",
            text: "Colored",
            style_color: c => c.color,
        },
// ---
        " ",
        {
            type: "button",
            text: "Toggle",
            on_click: "onClick"
        }
    ]
}
// ---
```

To set style names that contain hyphens, use camelCase:

```js
{ 
    type: "div",
    style_textAlign: "center", /* i:  <div style="text-align: center" > */
}
```

or, use a string property key:

```js
// <div style="text-align: center" >
{ 
    type: "div",
    'style_text-align': "center", /* i:  <div style="text-align: center" > */
}
```


## Display Visibility

The `display` attribute can be used to dynamically set the `display`
style property of an element.

Set `display` to:

* `true` to remove any display style previously set by this attribute
* `false` to set `display:none`
* a string to set the `display` style explicitly.

```js
// code lab demo
// ---
class Main extends Component
{
    showIt = false;

    onClick()
    {
        this.showIt = !this.showIt;
        this.invalidate();
    }

    static template = [
// ---
        { 
            type: "div",
            text: "I'm here!",
            display: c => c.showIt,
        },
// ---
        " ",
        {
            type: "button",
            text: "Toggle",
            on_click: "onClick"
        }
    ]
}
// ---
```

The display attribute remembers and correcly restores the previous
display style setting. 

In this example, the `display` property is correctly toggled between
`flex` and `none`:

```js
// code lab demo
// ---
class Main extends Component
{
    showIt = false;

    onClick()
    {
        this.showIt = !this.showIt;
        this.invalidate();
    }

    static template = [
// ---
        { 
            type: "div",
            style: "display: flex; justify-content: space-between",
            display: c => c.showIt,
            $: [ 
                $.span("I'm"),
                $.span("Here!"),
            ]
        },
// ---
        " ",
        {
            type: "button",
            text: "Toggle",
            on_click: "onClick"
        }
    ]
}
// ---
```


<div class="tip">

The above example is using [Fluent Templates](templateFluent) to 
declare the two child `span` elements.

</div>


The `display` setting can be used in conjunction with CodeOnly 
CSS transitions to provide animation effects when the element becomes 
visible or hidden. See [CSS Transitions](templateTransitions) for more on 
this.


