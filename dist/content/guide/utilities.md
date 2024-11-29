---
title: "Utilities"
---
# Utilities

## $() 

The `$` function is the entry point for the fluent template API.

For full details, see [Fluent Templates](templateFluent).


## css()

The `css` function is used to add CSS style declarations to the current
document.

This function is designed to be used as a template literal function
like so:

```js
css`
.myclass
{
    background: orange;
    /* etc... */
}
`
```

All strings passed to the `css` function are coalesced into a single
style block and added to the `<head>` section of the current document.

The `css` function expects straight CSS and no pre-processing (LESS, 
SASS etc..) is done.  Use of CSS processors is outside the scope
of this documentation.



## html(string)

The `html` function marks a string as containing HTML text.

In most places where a template accepts a text string to be used in the
DOM, the string is assumed to be plain text that should be escaped and 
displayed as is.

By wrapping text with the `html()` function it instructs the template
to treat the string as HTML and effectively sets the `innerHTML` of the
element instead of the `textContent`.

See also: [Text and HTML](templateText)


## htmlEncode(string)

The `htmlEncode` function encodes a string for use in a HTML document so 
that special characters normally recognized as part of HTML are treated
as plain text.

See also: [Text and HTML](templateText)



## input()

The `input` function is used to create bi-directional value bindings
between a component and HTML input fields.

For full details, see [Input Bindings](templateInput)


## transition()

The `transition` function indicates that when a callback value changes
a CSS transition should be initiated when applying the changed value.

For a full discussion of this function see [Transistions](templateTransitions).



## urlPattern(pattern)

Converts a URL pattern to a regular expression string.

eg: 

```js
let rx = new RegExp(urlPattern("/foo/:id"));

let match = "/foo/bar".match(rx);
if (match)
{
    let id = match.groups.id;
    assert.equal(id, "bar");
}
```

For more examples, see the [unit tests](https://github.com/codeonlyjs/core/blob/main/test/urlPattern.js).

