---
title: "ForEach Directive"
description: "All about list rendering in CodeOnly"
---
# ForEach Directive

A template node can be repeated using the `foreach` directive.


## Basic Usage

Adding a `foreach` attribute on an template node causes that node
to be repeated for each item in the array.

```js
// lab demo code
// ---
class Main extends Component
{
    static template = [
// ---
        { 
            foreach: [ "Apples", "Pears", "Bananas" ],
            type: "div",
            text: i => i,
        },
// ---
    ]
}
// ---
```


On template nodes with a `foreach` directive the arguments passed
to dynamic property callbacks changes from `(model,context)` to 
`(item,itemContext)`.

* **`item`** - is the current item from the list

* **`itemContext`** is an object with additional properties relating
  to the list enumeration.

    * **`context.outer`** - the outer loop context (either an enclosing 
      `foreach` loop context, or the component's context)
    * **`context.model`** - the current item
    * **`context.key`** - the current item's key (see below)
    * **`context.index`** - the current item's zero based index in the collection

As shown in the above example, the convention is to name the `item` 
argument `i` to distinguish it from the `c` used for the component
reference.

The `context.outer` property can be used to access outer `foreach`
iterators, or the component itself where `context.outer.model` will
give the actual outer component or item.



## Dynamic Collections

The above example shows using a `foreach` directive with a static 
array of items but more typically a dynamic collection is used. 

In this example items are randomly added/removed from an array and 
by calling `invalidate()` on the component, the list is updated to 
reflect the new array content.


```js
// lab demo code
// ---
class Main extends Component
{
    items = [ "Apples", "Pears", "Bananas" ];
    nextItem = 1;

    randomPos(ins)
    {
        return Math.floor(Math.random() * (this.items.length + (ins ? 1 : 0)))
    }

// ---
    onAdd()
    {
        this.items.splice(this.randomPos(true), 0, `New Item ${this.nextItem++}`);
        this.invalidate();
    }
    onRemove()
    {
        if (this.items.length > 0)
            this.items.splice(this.randomPos(false), 1);
        this.invalidate();
    }
// ---

    static template = [
        $.button("Add").on_click("onAdd"),
        " ",
        $.button("Remove").on_click("onRemove"),
// ---
        { 
            foreach: c => c.items,
            type: "div",
            text: i => i,
        },
// ---
    ]
}
// ---
```


## Item Indicies

The `itemContext.index` property gives the zero based index of the item
in the `items` array.

If the `condition` option (see below) is used, it's the index after 
non-matching items have been removed. ie: the index in the filtered array.

```js
// lab demo code
// ---
class Main extends Component
{
    items = [ "Apples", "Pears", "Bananas" ];
    nextItem = 1;

    randomPos(ins)
    {
        return Math.floor(Math.random() * (this.items.length + (ins ? 1 : 0)))
    }

    onAdd()
    {
        this.items.splice(this.randomPos(true), 0, `New Item ${this.nextItem++}`);
        this.invalidate();
    }
    onRemove()
    {
        if (this.items.length > 0)
            this.items.splice(this.randomPos(false), 1);
        this.invalidate();
    }

    static template = [
        $.button("Add").on_click("onAdd"),
        " ",
        $.button("Remove").on_click("onRemove"),
// ---
        { 
            foreach: c => c.items,
            type: "div",
            class_even: (i,ctx) => (ctx.index % 2) == 0,
            class_odd: (i,ctx) => (ctx.index % 2) != 0,
            text: (i,ctx) => `${ctx.index}: ${i}`,
        },
// ---
    ]
}
// ---
css`
.odd { color: orange }
.even { color: lime }
`
```




## Options

Often when working with `foreach` directives you'll need to specify some
additional settings to control exactly how the `foreach` directive works.

To specify anything more than just the array collection, use an 
object as the value of the `foreach` key and set the `items` property
to the array of items to iterate over, or a callback for an array.

```js
{
    foreach: {
        items: [],
        // other options here
    }
}
```

The following options are supported:

* **`itemKey`** - a callback function to return a key for an item.
* **`condition`** - a callback function that indicates if an item should be 
  included
* **`empty`** - template to show when the items array is empty.



### itemKey

The `itemKey` option is a callback that should provide a key value 
for an item.  By providing a key, list item DOM elementscan more
efficiently re-used during updates.

The value returned by the `itemKey` callback can be any value that can 
be directly compared to other keys for equality using the JavaScript `==` 
operator.

For example, suppose we're displaying a list of items with a `name` and `id`
property:

```js
{
    foreach: { /* i:  foreach directive */
        items: c => items, /* i:  This provides items */
        itemKey: i => i.id, /* i:  This provides item keys for items */
    },
    type: "div", /* i:  The rest is repeated for each item */
    text: i => i.name, /* i:  `i` is the list item */
}
```

For more details on how item keys are used, see 
[Update Semantics](#update-sematics) below.

<div class="tip">

Ideally the key for each item should be unique however it is not strict
requirement and the update logic will handle duplicate keys - and still be
more efficient that having no keys at all.

</div>


### condition

The `condition` option is a predicate callback that can be used to filter 
which items in the array should be shown.  Return `true` to include
an item, or `false` to exlude it.

This example filters the list to only show items with a price below $100.

```js
// lab demo code
// ---
class Main extends Component
{
// ---
    items = [
        { name: "Bread", price: 4 },
        { name: "Phone", price: 1000 },
        { name: "Gift Voucher", price: 50 },
        { name: "Car", price: 50000 },
        { name: "Wine", price: 40 }
    ];
// ---
    
    static template = 
    {
// ---
        foreach: { 
            items: c => c.items,
            condition: i => i.price < 100,
        },
        type: "div",
        text: i => `${i.name}: \$${i.price}`,
// ---
    }
}
// ---
```


### empty

The `empty` setting can be used to specify a template to be used if the
list of items is empty.

```js
// demo lab code
// ---
class Main extends Component
{
    items = [ ];

    onLoad()
    {
        this.items = [ "foo", "bar", "baz" ];
        this.invalidate();
    }
    onClear()
    {
        this.items = [];
        this.invalidate();
    }
    
    static template = [
        $.button("Load").on_click("onLoad"),
        " ",
        $.button("Clear").on_click("onClear"),
// ---
        {
            foreach: { 
                items: c => c.items,
                empty: { /* i: this will be displayed if the list is empty */
                    type: "div",
                    text: "Nothing Here!"
                }
            },
            type: "div",
            text: i => i,
        },
// ---
    ]
}
// ---
```


## Update Semantics

The `foreach` directive uses one of two strategies to apply updates depending
on whether an `itemKey` callback has been supplied.

### Unkeyed

When item keys are not provided the list is updated by re-using the previous DOM 
elements in the same order, updating each with the new item at that position,
and then adding or removing elements at the end to match the new item count.

With this strategy, the re-used items are not unmounted/remounted - they're
simply in-place patched.

This works well for small lists and is easy to use, but for larger lists may 
not perform well as a single insert or delete near the start of the 
list may mean every subsequent element needs a full update.

### Keyed

When a keyed `foreach` block updates the item keys for the new and old
arrays are compared and each item is determined to be either:

* an existing item - one that appears in both arrays
* a new item - one that didn't exist in the old array, but does in the new
* an old item - one that did exist in the old array, but does not in the new

The items are then updated:

* existing items - re-use the same DOM elements as the matching item
  from before.
* old items - elements are either discarded or re-purposed for new items
* new items - old elements are re-purposed if available, or new elements created

In this strategy, when an items is re-purposed it will first be unmounted, 
changed properties applied and then re-mounted after being added back into
the DOM.

This strategy can dramatically improve the performance of typical list 
updates as most items will be re-used and not require significant 
updates.


### Components

When a `foreach` block includes a nested component, the changed properties
of the component will be applied, but the component's `update` method
is *not* called.

This is consistent with how templates update components used elsewhere
but warrants some consideration for `foreach` blocks.

Often a `foreach` block will be used to display a set of items where
each item is an object that's displayed using a component.

As an example, say you're building a photo management app and you have 
a `Photo` object with properties for various attributes of each photo:

```js
class Photo
{
    filename;
    size;
    date;
    favorite;
}
```

You also have a `PhotoCell` component that can display
a thumbnail view for a single photo:

```js
class PhotoCell extends Component
{
    #photo;
    get photo()
    {
        return this.#photo;
    }
    set photo(val)
    {
        this.#photo = value;
        this.invalidate();
    }

    static template = { /* ... */ }
}
```

You could show a collection of photos using a `foreach` block:

```js
{
    foreach: {
        items: c => c.allPhotos,
        itemKey: i => i.filename,
    },
    type: PhotoCell,
    photo: i => i,
}
```

How this works for updates will depend on whether you replace
the `Photo` instance when it changes, or just update its properties.

* If the `Photo` instance is replaced with a new instance, but the same
  key, the template will see the `PhotoCell.photo` property as being 
  different and assign the new value to the component.  The component will
  update itself and the changes will be reflected in the DOM.

* If however properties of the `Photo` are updated, the template will  
  consider the `PhotoCell.photo` property unchanged, won't re-assign it
  and the DOM won't be updated.

While the behaviour in the second case may seem inconvenient and problematic
this is actually the exact behaviour you want when managing large collections
because it allows you to make small and precise updates.

One way to handle this is to use [deep component updates](templateUpdateSemantics#deep-component-updates)
although this is generally not recommended - especially for large collections.

The correct way to handle this is to have the `Photo` object fire change events and
for the `PhotoCell` component to add listeners for those events.  In other
words this is a problem that should be solved by the `Photo` object and
`PhotoCell` component - not by the `foreach` block.

To setup this event/listener mechanism you can either roll your own event
system, use the standard 
[`EventTarget`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget)
 mechanism, or use CodeOnly's [`notify`](Notify).

Also consider using [`Component.listen`](components#listening-to-external-events) to simplify adding
and removing event listeners in the item component.
