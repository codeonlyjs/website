---
title: "Static Rendering"
---

# Static HTML Rendering

Static HTML rendering lets you construct components and render them to a HTML string.

Static rendering might be used as part of static site generator, or for other templated 
HTML rendering requirements.


## Sample Component

Let's use this simple component as an example:

```js
class MyComponent extends Component
{
    #greeting = "Hello";
    get greeting()
    {
        return this.#greeting;
    }
    set greeting(value)
    {
        this.#greeting = value;
        this.invalidate();
    }

    static template = {
        type: "div",
        $: [
            {
                type: "div .greeting",
                text: c => c.greeting,
            },
            {
                type: "div",
                text: "World",
            }
        ]
    }
}
```

## Rendering HTML

To get the HTML of a component, use the `rootNode.html` property:

```js
let comp = new MyComponent();
console.log(comp.rootNode.html);
```

which produces:

```html
<div><div class="greeting">Hello</div><div>World</div></div>
```


<div class="tip">

The above assumes a single root node.  If the node has multiple roots
you can get the HTML using `comp.rootNodes.map(x => x.html).join("")`.

</div>

## Pretty Formatting

To get more nicely formatted output, use the `prettyHtml()` function:

```js
import { prettyHtml } from "@codeonlyjs/core";

let comp = new MyComponent();
console.log(prettyHtml(comp.rootNode.html));

```

to produce:

```html
<div>
  <div class="greeting">Hello</div>
  <div>World</div>
</div>
```



## Updates

Normally when rendering static output like this you won't need to render, apply 
updates and re-render.  If you do however, you need to make sure the components have
all updated the minidom, before re-rendering.

There's a few ways to do this:

1. If the component doesn't have any nested components, just call its `validate`
   method - any pending updates to this component will be applied.

2. Call the component's `destroy()` method to destroy the old DOM, causing a new
   one to be constructed (with the new values) on the next render.  This will 
   destroy nested component DOM trees too so the entire tree will be effectively
   updated.  This approach is effective but not particularly efficient (though 
   not terrible)

3. Call the `getEnv().whileBusy()` method and await the returned promise.  This
   waits for any pending `Component.load()` operations, any pending `nextFrame()`
   calls and any pending `Router.load()` operations.

Using `whileBusy()` is the most reliable mechanism:

```js
import { getEnv } from "@codeonlyjs/core";

// First render...
let comp = new Component();
console.log(prettyHtml(comp.rootNode.html));

// Second render...
comp.greeting = "Goodbye";
await getEnv().whileBusy();
console.log(prettyHtml(comp.rootNode.html));
```

Note: it's only necessary to await `whileBusy()` if:

* There have been `invalidate()` calls on any of the components in the tree
* There are pending async `Component.loading()` calls or router loads.

<div class="tip">

The reason this is only required after an update is because the DOM tree for the component
probably hasn't been created on the first render.  The initial access of the component's 
`.rootNode` or `.rootNodes` property causes the DOM tree to be created, and initialized with
the current settings.

If the component calls `create()` in its constructor and then invalidates the component, or
if it uses the `load` mechanism, you'll need to await in that case too.

</div>



