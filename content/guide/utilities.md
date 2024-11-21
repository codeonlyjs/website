---
title: "Utilities"
---
# Utilities



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



