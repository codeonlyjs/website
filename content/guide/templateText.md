---
title: "Text and Comments"
---
# Text and Comments

## Text Nodes

To declare a text node in a template, use a plain JavaScript string.

```js
{
    type: "div",
    $: [
        "Hello & Goodbye World", /* i:  text child node*/
    ]   
}
```

With plain text, characters are automatically escaped and the above is
equivalent to:

```html
<div>Hello &amp; Goodbye World</div>
```


## Raw Text Nodes

To declare text that won't be escaped (ie: raw HTML), use the `Html.raw` method
and be sure to escape the text as required.

Notice how this example requires escaping the ampersand `&amp;`:

```js
import { Html } from 'codeonly.js';

{
    type: "div",
    $: [
        Html.raw("Hello &amp; Goodbye World", /* i:  HTML text child node*/
    ]   
}
```


<div class="tip">

Be careful using the `Html.raw` method especially with untrusted data as it will
be written directly to the DOM as is - malicious scripts included.

</div>

## Text Property

HTML elements also have a `text` property that can be used to directly assign
the inner text of the element

To create plain text elements, use the `text` property:

```js
// <div>This is my &lt;Div&gt;</div>
{
    type: "div",
    text: "This is my <Div>",
}
```

To create unescaped HTML text use the `Html.raw()` helper:

```js
import { Html } from 'codeonly.js';

// <div><span class="myclass">Span</span></div>
{
    type: "div",
    text: Html.raw('<span class="myclass">Span</span>'),
}
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


## Whitespace

Templates don't include any whitespace between HTML elements.  Often this
doesn't matter, but when it does, simply include the spaces in the template:

```js
{
    type: "div",
    $: [
        // Without spaces, these buttons would have no gaps between them
        { type: "button", $: "Button 1" },
        " ",
        { type: "button", $: "Button 2" },
        " ",
        { type: "button", $: "Button 3" },
    ]
}
```


## Comments

To create HTML comment nodes by use the special type `#comment`.

```js
{
    type: "#comment",
    text: "this is a comment",
}
```

which produces:

```html
<!-- this is a comment -->
```

As usual, the `text` can be dynamic:

```js
{
    type: "#comment",
    text: c => `rendered at ${new Date().toLocalTimeString()}`,
}
```

Although rarely used the comment node can be used for diagnostics, and
is also occassionally useful with server-side rendering (SSR).
