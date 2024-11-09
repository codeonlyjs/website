---
title: "ForEach Blocks"
---
# ForEach Blocks

Nodes in a template can be repeated using the `foreach` directive.


## Basic Usage

Added a `foreach` attribute on an template node causes that node
to be repeated for each item in the array.

```js
{
    foreach: [ "Apples", "Pears", "Bananas" ]
    type: "div",
    test: i => i, /* `i` is the item from the array */
}
```

gives:

```html
<div>Apples</div>
<div>Pears</div>
<div>Bananas</div>
```


## Item Callbacks and Context

On template nodes with a `foreach` directive the arguments passed
to dynamic properties callbacks changes from `(component) => ` to 
`(item, itemContext) => `.

The `item` is the item itself from the list.

The `itemContext` is an object with the following properties:

* `context.outer` - the outer loop context (either an enclosing 
   `foreach` loop context, or the component's context)
* `context.model` - the current item
* `context.key` - the current item's key (see below)
* `context.index` - the current item's zero based index in the collection



## Dynamic Collections

The above example shows using a `foreach` block with a static 
array of items. 

More typically a dynamic collection is used:


```js
{
    foreach: c => c.items, /* A callback for items */
    type: "div",
    test: i => i,
}
```

Now when the template is updated, any changes in the array since the
last update will be reflected in the DOM.



## Additional ForEach Block Properties

Usually when working with `foreach` blocks you'll need to specify some
additional settings to control exactly how the `foreach` block works.

To specify anything more than just the array collection, use an 
object as the value of the `foreach` key.

The following properties are supported:

* `items` - the set of items to iterate over (or a callback to provide them)
* `itemKey` - a callback function to return a unique key for an item
* `condition` - a callback function that indicates if an item should be included
* `empty` - template items to show when the items array is empty.

In otherwords, the syntax used in the previous example is a shortcut for
`foreach: { items: [ "Apples", "Pears", "Bananas" ] }`

See the sections below for more about these settings.


## Item Keys

By default, when a `foreach` block is updated it simply re-uses the previous DOM 
nodes in the same order and updates each with the new item at that position, 
adding and removing elements at the end of the list match the item count.

This works well for small lists and is easy to use, but for larger lists
can impact performance because one insert or delete near the start of the list
means the DOM tree for every subsequent item will need a full update.

To improve this, you can provide a callback to the `foreach` block that supplies
an item "key" for each item.

For example, suppose we're displaying a list of items with a `name` and `id`
property:

```js
{
    foreach: { /* This describes the "foreach" block */
        items: c => items, /* This provides items */
        itemKey: i => i.id, /* This provides item keys for items */
    },

    type: "div", /* The rest is repeated for each item */
    text: i => i.name, /* `i` is the list item */
}
```

Now when the `foreach` block is updated it will re-use the DOM tree from
previous items with the same item key for new items with the same item key
which can dramatically improve the performance as the rest of the item update
is more likely to become a no-op.

<div class="tip">

Ideally the key for each item should be unique however that's not an absolute
requirement and the update logic will handle duplicate keys - and still be
more efficient that having no keys at all.

</div>


## Conditional Including Items

The `foreach` directive supports a `condition` callback that can be used to
filter the displayed list.

For example, only show the items under $100.00:

```js
{
    foreach: { 
        items: c => items,
        condition: i => i.price < 100,
    },

    type: "div",
    text: i => `${i.name} - $${i.price}`,
}
```


## Empty Placeholders

The `empty` setting can be used to specify a `template` to be used if the
list of items is empty.

```js
{
    foreach: {
        items: c => items,
        empty: { /* This will be displayed if there are no items */
            type: "div",
            $: "Nothing to see here",
        }
    },
    type: "div",
    text: i => i,
}
```


## Use with ObservableArrays

Normally the `foreach` component runs a diff algorithm to work out what needs 
to be updated in the DOM.  This works well and is very efficient, but
an alternative appreach is to use CodeOnly's [`ObservableArray`](observableArray).

When the items collection provided to a `foreach` block is an `ObservableArray`,
the `foreach` block adds a listener and automatically and immediately updates the
DOM when changes are made.

```js
import { Component, ObservableArray } from "@codeonlyjs/core";

export class MyComponent extends Component
{
    #items = new ObservableArray();

    get items()
    {
        return this.#items;
    }

    someMethod()
    {
        this.#items.push(   /* This will trigger the foreach block to update */
            { text: "new item 1" },
            { text: "new item 2" },
        );
    }

    static template = {
        type: "section"
        $: {
            foreach: c => c.items, 
            type: "div",
            text: i => i.text,
        }
    }
}
```

Note the following when using an `ObservableArray`:

* the `foreach.itemKey` can still be provided and will still help 
  in matching previous items to new items. (see notes below)
* the `foreach.condition` callback isn't supported
* changes to array are reflected in the DOM immediately and not
  delayed through the `invalidate` mechanism.
* returning a different observable array instance will reload
  the entire list (destroy + recreate the DOM) and start
  monitoring the new observable array.



## Update Semantics

TODO!
