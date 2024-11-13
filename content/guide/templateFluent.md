---
title: "Fluent Templates"
---
# Fluent Templates

Fluent templates are an alternative way to declare CodeOnly templates
that can be more concise than JSON-like structured declarations.

Templates declared this way are constructed using a 
[fluent-style API](https://en.wikipedia.org/wiki/Fluent_interface).


## The `$` Function

To use fluent templates, first import the `$` function:

```js
import { $ } from "@codeonlyjs/core"
```

The `$` function is used to construct a fluent template node:

```js
$("div")
```

yields:

```js
{
    type: "div"
}
```

For element names that conform to JavaScript identifiers, accessing
a property on the `$` function also create elements:

```js
$.div   // equivalent to $("div")
```

## Setting Properties

Once you've constructed a fluent node, you can set its properties
by calling functions on the object with the property's name.

Each function you call returns the original fluent node which 
allows chaining:

```js
$.div.id("my-id").class("class")
```

yields:

```js
{
    type: "div",
    id: "my-id",
    class: "class"
}
```


<div class="tip">

While it might appear that fluent templates are limited to a set of hard-coded
element and attribute names, this isn't the case.

The fluent node object uses JavaScript Prox to detect the property names
as they're invoked allowing any element/attribute name to be set.

ie: `$.foo.bar("baz")` will give `<foo bar="baz">` - even though CodeOnly 
doesn't include a property named `foo` nor a function named `bar`.

</div>


## The `type` Property

The `type` property is automatically mapped to `attr_type` resolving
the conflict between the HTML `type` attribute and the CodeOnly `type` property.

ie: this works as expected

```js
$.input.type("password")
```



## Dynamic Content

Dynamic callbacks can be used anywhere they can be used in structured
templates:

```js
$.span.text(c => `Count: ${c.count}`)
```

yields:

```js
{
  type: "span",
  text: c => `Count: ${c.count}`,
}
```

## Boolean Classes and Named Styles

If the `class` and `style` methods are called with more than one 
parameter they are converted to boolean classes and named styles:

```js
[
  $.div.class("selected", c => c.isSelected),
  $.div.style("color", c => c.color),
]
```

yields

```js
[
  {
    type: "div",
    class_selected: c => c.isSelected,
  },
  {
    type: "div",
    style_color: c => c.color,
  }
]
```

## Event Handlers

Connecting event handlers works as expected:

```js
{
  $.input.type("text").on_click(c => c.onClick());
}
```

Fluent templates also allow this alternate format:

```js
{
  $.input.type("text").on("click", c => c.onClick());
}
```


## Child Nodes

A fluent node is a function that appends child nodes to the element
being constructed.

The append function accepts a variable number of arguments and all arguments
will be appended as child nodes.

In this example, the container has two child items, and each item
has a text child node ("Apples" and "Pears")

```js
$.div.class("container")(
  $.div.class("item1")("Apples")
  $.div.class("item2")("Pears")
)
```

The append function returns the same fluent node object so chaining
order for content vs attributes doesn't matter:

```js
  // This... 
  $.div.class("item2")("Pears")

  // is equivalent to this
  $.div("Pears").class("item2")
```

You can also call the append function multiple times:

```js
$.div  
  ($.span("apples"))  // Append first child span
  ($.span("pears"))   // Append second child span
```

Appending an array will append each item:

```js
$.div(makeChildren());

function makeChildren()
{
  return [
    $.span("apples"),
    $.span("pears")
  ]
}
```

## Referencing Components

To reference a component using the fluent method, pass the 
component constructor to the `$()` function:

```js
$(MyComponent).title("My Component")
```

yields:

```js
{
  type: MyComponent,
  title: "My Component"
}
```



## Mix and Match

The fluent and structured formats can be inter-mixed:

eg: structured inside fluent

```js
$.div.class("container")(
  { type: "div", class: "item1", $: "Apples" },
  { type: "div", class: "item1", $: "Pears" },
)
```

or fluent inside structured:

```js
{
  type: "div",
  class: "container",
  $: [
    $.div.class("item1")("Apples"),
    $.div.class("item2")("Pears")
  ]
}
```


## Unwrapping

A fluent node represents a template node that's under construction.

The actual structured template of a fluent node is available as the 
`$node` property.

Unwrapping is done automatically by the template compiler so usually
you shouldn't need to do this unless you're trying to manually combine
fluent and structured templates.


## When to Use?

Both template formats can be used to express any kind of content
so their use often comes down to personal preference.

However as general guide:

* The structured format works best for block level content (panels,
  sections, headers, etc...)

* The fluent format works best for inline-span level content (paragraphs,
  links, spans, images etc...)

Also, we don't recommend using the fluent method for nodes using
template directives such as `foreach` and `if` - these are more
clearly expressed using the structured format.
