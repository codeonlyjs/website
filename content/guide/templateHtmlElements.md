---
title: "HTML Elements"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---

# HTML Elements

This section describes how to use declare HTML elements in CodeOnly templates.

<div class="tip">

HTML elements are the most common nodes declared in templates so it's worth 
learning this section well.

</div>


## Tag Name

An HTML element is declared in a template by specifying the tag name as a 
string for the`type` property of the node:

```js
{
    type: "div", /* A string value for the type makes this an HTML element */
}
```

Note: unlike most other properties, the `type` property *can not* be a dynamic
callback function.

## Attributes

The attributes of a HTML element are declared using property names prefixed with 
`attr_`:

```js
{
    type: "img",
    attr_src: "/content/logo.svg",
}
```

yields:

```html
<img src="/content/logo.svg" >
```

Attribute values can be dynamic:

```js
{
    type: "img",
    attr_src: c => c.currentPhotoUrl,
}
```

<div class="tip">

For some common attributes there are short-cut properties the remove the need 
for the `attr_` prefix - see below.

</div>

## Id

The `id` of a HTML element can be declared with the short-hand property "id":

```js
{
    type: "header",
    id: "main-header",
}
```

yields:

```html
<header id="main-header"></header>
```

The `id` property can be a dynamic callback, but this is rarely used.



## Inner Text/HTML

The inner text of an HTML element can be set with the `text` property:

```js
{
    type: "p",
    text: "Hello World",
}
```

To set raw HTML, use the `Html.raw` modifier function:

```js
import { Html } from "@codeonlyjs/core";

{
    type: "p",
    text: Html.raw('<span class="bold">Hello</span> World'),
}
```

The text property can be a dynamic callback and it can return
either plain or raw text.

Note, since the HTML content of an element are child nodes, an element's
text can also be specified using the `$` child node syntax:

```js
{
    type: "p",
    $: "Hello World",
}
```



## Child Nodes

The child nodes of an HTML element are declared using the `childNodes` property
or the special `$` content property (both are equivalent).

The child nodes are declared as an array:

```js
{
    type: "div",
    $: [ /* Array of child nodes */
        { type: "div", text: "child 1" },
        { type: "div", text: "child 2" },
        { type: "div", text: "child 3" },
    ]
}
```

If there is only a single child the array container is not required:

```js
{
    type: "div",
    $: { /* single child node */
        type: "div", text: "child" 
    },
}
```



## CSS Classes

The `class` attribute of an HTML element can be declared with the short-hand property "class":

```js
{
    type: "div",
    class: "my-class",
}
```

Dynamic callbacks are supported:

```js
{
    type: "div",
    class: c => `my-class ${c.otherClasses}`,
}
```

## Boolean CSS Classes

Boolean classes conditionally add a CSS class to an element.

Declare a boolean class by prefixing the name of the class to add or remove with `class_`:

```js
// when c.isSelected is true:
//    <div class="selected" >
// otherwise
//    <div class="" >
{ 
    type: "div",
    class_selected: c => isSelected,
}
```

To set class names that contain hyphens, use camelCase:

```js
{ 
    type: "div",
    class_isSelected: true, /* class="is-selected" */
}
```

or, a string property key:

```js
{ 
    type: "div",
    'class_is-selected': true, /* class="is-selected" */
}
```


## CSS Styles

The `style` attribute of an HTML element can be declared with the short-hand property "style":

```js
{
    type: "div",
    style: "text-align: center",
}
```

Dynamic callbacks are supported:

```js
{
    type: "div",
    style: c => `text-align: ${c.currentAlignment}`,
}
```



## Dynamic Named Styles

Named styles dynamically set the value of a single named CSS style property.

Declare a named styles by prefixing the name of the CSS property to set with `style_`:


```js
// when textColor returns 'red':
//    <div style="color: red" >
{ 
    type: "div",
    style_color: c => textColor,
}
```

To set style names that contain hyphens, use camelCase:

```js
{ 
    type: "div",
    style_textAlign: "center", /* <div style="text-align: center" > */
}
```

or, use a string property key:

```js
// <div style="text-align: center" >
{ 
    type: "div",
    'style_text-align': "center", /* <div style="text-align: center" > */
}
```


## Display Visibility

The `display` attribute can be used to contol the visibility of an element.

Set `display` to:

* `true` to remove any display style previously set by this attribute
* `false` to set `display:none`
* a string to set the `display` style explicitly.

```js
// when isVisible returns true:
//     <div style="">
// otherwise
//     <div style="display: none">
{ 
    type: "div",
    display: c => isVisible,
}
```

Note the display attribute is smart enough to remember the previous
display style setting:

```js
// when isVisible returns true:
//     <div style="display: flex">
// otherwise
//     <div style="display: none">
{ 
    type: "div",
    style_display: "flex",
    display: c => isVisible,
}
```



