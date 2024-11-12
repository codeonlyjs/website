---
title: "Utilities"
---
# Utilities


## Html Class

The `Html` class provides utilities functions for use in templates:

### h(level, text)

Helper for generating HTML heading tags.

### p(text)

Helper for generating HTML `<p>` tags

### a(href, text)

Helper for generating HTML `<a>` tags

### raw(text)

Marks a string as "raw" so that it won't be escaped when added to the DOM.

If passed a function, wraps the passed function in a function that
marks the return value of the inner function as HTML.

ie: do this:

```js
{
    type: "div",
    $: Html.raw(c => c.htmlContent),
}
```

not this: `c => Html.raw(c.htmlContent)`.



### encode(text)

HTML encodes a string


## Functions

### urlPattern(pattern)

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



