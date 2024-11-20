---
title: "ForEach Directive"
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
to dynamic properties callbacks changes from `(model,context)` to 
`(item,itemContext)`.

* **`item`** - is the item itself from the list.

* **`itemContext`** is an object with additional properties relating
  to the list enumeration.

    * **`context.outer`** - the outer loop context (either an enclosing 
      `foreach` loop context, or the component's context)
    * **`context.model`** - the current item
    * **`context.key`** - the current item's key (see below)
    * **`context.index`** - the current item's zero based index in the collection

As shown in the above example, the convention is to name the `item` 
property `i` to distinguish it from the `c` used for the component
reference.

The `context.outer` property can be used to access outer `foreach`
iterators, or the component itself.  The `context.outer.model` will
give the actual outer component or item.


## Dynamic Collections

The above example shows using a `foreach` directive with a static 
array of items. 

More typically a dynamic collection is used.  In this example
items are randomly added/removed from an array and by calling
`invalidate()` on the component, the list it updated to reflect
the new array content.


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

Now when the template is updated, any changes in the array since the
last update will be reflected in the DOM.



## Options

Usually when working with `foreach` directives you'll need to specify some
additional settings to control exactly how the `foreach` directive works.

To specify anything more than just the array collection, use an 
object as the value of the `foreach` key.

The following properties are supported:

* **`items`** - the set of items to iterate over (or a callback to provide them)
* **`itemKey`** - a callback function to return a key for an item.
* **`condition`** - a callback function that indicates if an item should be 
  included
* **`empty`** - template items to show when the items array is empty.

See the sections below for more about these settings.


### itemKey

By default, a `foreach` blocks is updated by simply re-using the previous DOM 
elements in the same order and updating each with the new item at that position,
and then adding or removing elements at the end to match the new item count.

This works well for small lists and is easy to use, but for larger lists
can may not perform well as a single insert or delete near the start of the 
list may mean every subsequent element needs a full update.

To improve this provide an `itemKey` callback to the `foreach` directive that supplies an "key" for each item.  The returned value can be any value
that can be directly compared for equality using the JavaScript `==` operator.

When a keyed `foreach` block updates, it will re-use the DOM elements from the 
previous list's items for items in the new list with the same key. This can
dramatically improve the performance as most items will no longer need
any significant update.

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

<div class="tip">

Ideally the key for each item should be unique however it is not strict
requirement and the update logic will handle duplicate keys - and still be
more efficient that having no keys at all.

</div>


### condition

The `foreach` directive supports a `condition` callback that can be used to
filter the displayed list.

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


### index

The `itemContext.index` property gives the zero based index of the item
in the `items` array.

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


