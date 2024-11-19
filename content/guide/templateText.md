---
title: "Text and HTML"
---
# Text and HTML

## Text Nodes

To declare a text node in a template, use a plain JavaScript string.  

Plain text nodes are automatically escaped and can safely be passed 
untrusted text data.

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
    {
        type: "div",
        $: [
// ---
"Hello & Goodbye World", /* i:  text child node*/
// ---
        ]   
    }
}
// ---
```



## HTML Nodes

To declare text that won't be escaped (ie: raw HTML), use the `html` directive
to mark the text as html.

This example requires escaping on the ampersand (`&amp;`) and uses embedded 
formatting elements (`<em>`):

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
    {
        type: "div",
        $: [
// ---
html("Hello &amp; Goodbye <em>World</em>"),
// ---
        ]   
    }
}
// ---
```



## Dynamic Text

A callback function can be used to provide dynamic text:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
    {
        type: "div",
        $: [
// ---
() => new Date().toString(), /* i: dynamic text content */
// ---
        ]   
    }
}
// ---
```

For dynamic HTML, wrap the callback itself in the `html()` directive:

ie: do this:

```js
html(c => getHtml())
```

not this:

```js
c => html(getHtml())
```

eg:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
    {
        type: "div",
        $: [
// ---
html(() => `<strong>${htmlEncode(new Date().toString())}</strong>`), 
// ---
        ]   
    }
}
// ---
```

<div class="tip">

Never use the `html()` method with untrusted data. `html()` inserts
the passed text directly into the document - malicious scripts included.

</div>


To mix untrusted data with HTML content it's usually best to express
the HTML using template nodes explicitly rather than using the `html()` 
directive.

```js
// lab code demo
// ---
class Main extends Component
{
    untrustedData = "<script>alert('Bad guy here')</" + "script>";
    static template = 
    {
        type: "div",
        $: [
// ---
{
    type: "em",
    text: c => c.untrustedData
}
// ---
        ]   
    }
}
// ---
```


If you really must mix the `html()` directive and untrusted data, 
use the `htmlEncode` function to escape the untrusted data:

```js
// lab code demo
// ---
class Main extends Component
{
    untrustedData = "<script>alert('Bad guy here')</" + "script>";
    static template = 
    {
        type: "div",
        $: [
// ---
html(c => `<em>${htmlEncode(c.untrustedData)}</em>`),
// ---
        ]   
    }
}
// ---
```


## Text Property

HTML elements also have a `text` property that can be used to directly assign
the inner text or HTML of an element.

See [Inner Text/HTML](templateHtmlElements#inner-text-html) for more on this.



## Whitespace

Templates don't include any whitespace between HTML elements.  

Usually this doesn't matter, but when it does, simply include the spaces 
in the template:

```js
// demo lab code
// ---
class Main extends Component
{
    static template = 
// ---
    {
        type: "div",
        $: [
            // Without spaces, these buttons would have no 
            // gaps between them
            { type: "button", text: "Button 1" },
            " ",
            { type: "button", text: "Button 2" },
            " ",
            { type: "button", text: "Button 3" },
        ]
    }
// ---
}
// ---
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
