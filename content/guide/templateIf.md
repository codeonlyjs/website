---
title: "If Directive"
description: "How to conditionally include and exclude content in CodeOnly templates"
---
# If Directive

A template node (and all it's children) can be conditionally included or 
excluded using the `if`, `elseif` and `else` directives.

<div class="tip">

Unlike the `display` directive which simply hides an element, the
`if` directive completely removes it.

</div>


## `if`, `elseif` and `else` Directives

The `if` directive can be used to conditional include a template
node.  

The value of the `if` directive is the condition to be tested
and if it evaluates to a truthy value, the node and all its child
nodes are included.

```js
// code lab demo
// ---
class Main extends Component
{
    showIt = false;

    onClick()
    {
        this.showIt = !this.showIt;
        this.invalidate();
    }

    static template = [
// ---
        { 
            type: "div",
            text: "I'm here!",
            if: c => c.showIt,
        },
// ---
        " ",
        {
            type: "button",
            text: "Toggle",
            on_click: "onClick"
        }
    ]
}
// ---
```



The `else` directive can be used to show alternate content when
`if` directive's condition is false.

The value of an `else` directive is ignored but should be a truthy 
value. (eg: `else: true`)

```js
// code lab demo
// ---
class Main extends Component
{
    showIt = true;

    onClick()
    {
        this.showIt = !this.showIt;
        this.invalidate();
    }

    static template = [
// ---
        { 
            if: c => c.showIt,
            type: "div",
            text: "I'm here!",
        },
        {
            else: true,
            type: "div",
            text: "So am I",
        },
// ---
        " ",
        {
            type: "button",
            text: "Toggle",
            on_click: "onClick"
        }
    ]
}
// ---
```


You can also include one or more `elseif` directives:

```js
// lab code demo
// ---
class Main extends Component
{
    get selection()
    {
        return this.select.value;
    }

    static template = 
    [
// ---
        { 
            if: c => c.selection == "apples",
            type: "div",
            text: "Apples are Red",
        },
        {
            elseif: c => c.selection == "pears",
            type: "div",
            text: "Pears are Green",
        },
        {
            else: true,
            type: "div",
            text: "Bananas are yellow",
        },
// ---
        " ",
        {
            type: "select",
            bind: "select",
            on_input: c => c.invalidate(),
            $: [
                $.option("Apples").value("apples"),
                $.option("Pears").value("pears"),
                $.option("Bananas").value("bananas"),
            ]
        },
    ]
}
// ---
```
<div class="tip">

Nodes with `if`, `elseif` and `else` directives must all follow each 
other consecutively in the containing child node array.

</div>



## Static Conditions

Although not commonly used, an `if` directive can be hard coded as `true` or `false`.  

This can be handy for including or excluding content based on conditions like build environment.

```js
// lab code demo
// ---
class Main extends Component
{
    static template = 
    [
// ---
        "Before →",
        { 
            if: false,
            type: "div",
            text: "Nothing to See Here",
        },
        "← After",
// ---
    ]
}
// ---
```


## Update Semantics

When a template's DOM tree is updated any conditional directives are 
re-evaluated by calling their condition callbacks.  This is done in 
order from the first `if` directive through any `elseif` directives 
and to the last `else` directive (if present).

The first directive whose condition evaluates to `true` becomes the 
"active branch".

If the active branch is the same, the existing DOM tree of that branch is maintained.

If the active branch is different:

1. the DOM tree of the old branch is removed from the document and released
2. the DOM tree of the new branch is created and added to the document

In either case (same or different active branch) the eventual active branch 
is then updated so any dynamic callback properties in that branch are also
reflected in the DOM.

If any of the branches contain `bind` directives those element references
will be set to `null` when the branch is removed and restored to the
element reference when the branch is re-created.


## CSS Transitions

Condition directives can be used in conjunction with CodeOnly CSS transitions 
to produce animation effects when the active branch changes.

See [Transitions](templateTransitions) for more on this.
