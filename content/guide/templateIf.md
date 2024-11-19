---
title: "If Directive"
---
# If Directive

A template node (and all it's children) can be conditionally included or 
excluded using the `if`, `elseif` and `else` directives.


## The `if` Directive

The `if` directive can be used to dynamically include or exclude an items:

```js
{
    type: "div",
    $: [
        {
            if: c => showError,
            type: "div",
            class: "error",
            $: "Failed: ...",
        }
    ]
}
```

## The `else` Directive

To declare alternative nodes if the `if` condition is false,  
add an `else` directive on the node immediately following the node 
with the `if` directive,

For `else` directives, the value is ignored but should the truthy.

```js
{
    type: "div",
    $: [
        {
            if: c => showError,
            type: "p",
            $: "Error: ...",
        },
        {
            else: true,     /* i:  Value ignored */
            type: "p",
            $: "All is well!",
        }
    ]
}
```


## The `elseif` Directive

You can also include one or more `elseif` directives after the `if` nodes.

```js
{
    type: "div",
    $: [
        {
            if: c => showError,
            type: "p",
            $: "Error: ...",
        },
        {
            elseif: c => showWarning,
            type: "p",
            $: "Warning: ...",
        },
        {
            else: true,
            type: "p",
            $: "All OK",
        }
    ]
}
```

<div class="tip">

The `if`, `elseif` and `else` conditional elements must all follow each other consecutively 
in the containing child node array.

</div>



## Static Conditions

Although not commonly used, an `if` directive can be hard coded as `true` or `false`.  

This can be handy for including or excluding content based on conditions like build environment.

```js
// Template
{
    type: "pre",
    if: isDevelopmentMode(), /* i:  Static `if`, because there's no callback */
    $: {
        type: "code",
        $: c => JSON.stringify(c.returnedData)
    },
}

// Elsewhere
function isDevelopmentMode()
{
    return true;
}
```

<div class="tip">

In the above example, the `isDevelopmentMode()` function will be called when the 
template object is first executed by the JavaScript loader.

The result will be stored in the template and then when the template is later 
compiled for the first time whatever value the function returned originally 
will decide if that part of the template will be included or note.

</div>


## Update Semantics

When a template's DOM tree is updated any conditional directives are 
re-evaluated by calling their condition callbacks.  This is done in 
order from the first `if` directive through any `elseif` directives 
and to the last `else` directive (if present).

The first directive that matches becomes the "active branch".

If the active branch is the same, the existing DOM tree of that branch is maintained.

If the active branch is different:

1. the DOM tree of the old branch is removed from the document and released
2. the DOM tree of the new branch is created and added to the document

In either case (same or different active branch) the eventual active branch 
is then updated so any dynamic callback properties in that branch are also
reflected in the DOM.


## CSS Transitions

Condition directives can be used in conjunction with CodeOnly CSS transitions 
to produce animation effects when the active branch changes.

See [Transitions](templateTransitions) for more on this.
