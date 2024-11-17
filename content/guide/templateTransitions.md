---
title: "Transitions"
---
# Transitions

CodeOnly can initiate CSS transitions by applying classes to DOM 
elements where certain actions are initiated:

* Inserting and removing content with `if` directives
* Showing and hiding elements with the `display` directive
* Adding or removing a class with boolean `class_` directives
* Changing the content of an embed slot
* Changing an item's `key`

## In/Out States

All transitions currently supported are considered
to be in either an "in-state" or an "out-state". 

* `if` directives - the active branch has the in-state and all other branches
  are in the out-state.
* `display` directive - a shown item is in the in-state, a hidden
  item is in the out-state.
* `class_` directives - a true condition is the in-state 
  and a false condition is the out-state.

When the state of an element switches from the out-state to the 
in-state it is said to be "entering".  When an item switches from 
the in-state to the out-state is it said to be leaving.



## Declaring Transition Conditions

To declare that a setting should trigger transitions, wrap the callback 
that determines the in/out state with the `transition` directive:

```js
import { transition } from "@codeonlyjs/core";

class MyComponent extends Component
{  
    get includeCondition()
    {
        // some condition
    }

    // In template
    {
        if: transition(c => c.includeCondition),
        type: "div",
    }
}
```

<div class="tip">

For `if` blocks with `elseif` or `else` conditions, the `transition` 
directive must be on the first `if` condition.

ie: you can't declare different transitions for different branches.

</div>


The same format is used for the `display` directive:

```js
{
    display: transition(c => c.someCondition),
}
```

and for boolean classes:

```js
{
    class_selected: transition(c => c.isSelected),
}
```

The `transition` directive declares that when the condition changes
certain CSS classes should be added to the entering and leaving
DOM elements.


## Key Triggered Transitions

Another way to trigger transitions is by setting a `key`
property on an element:

```js
{
    type: "div",
    text: c => c.counter,
    key: transition(c => c.counter),
}
```

In this case the transition triggers when the key changes.

When a transition is triggered by a key change:

* a new instance of the element is created and transitioned in
* the old instance of the element is transitioned out

This can be used to create transitions between values.  In the 
above example you could create a cross fade effect as the
counter value changes, or you could slide the old value
out and the new value in etc...

<div class="tip">
  
The `key` property is not to be confused with the item keys
used by `foreach` directices. 

</div>


## Embed Slot Transitions

Transitions on embed slots are declared by placing the `transition`
directive on the content property.

```js
{
    type: "embed-slot",
    content: transition(c => c.content),
}
```

The transition will trigger when the content value changes.



## Transition CSS Classes

To understand the set of CSS classes used by CodeOnly it's useful to consider
the two main types of transitions - symmetric vs asymmetric.

<div class="tip">

The following sections describe the default CSS class names - see below for 
information on how to customize these names.

</div>


### Symmetric vs Asymmetric

A symmetric transition is one where the leave transition is the exact inverse
of the enter transition.

A fade in/out transition is symmetric:

* on entering it starts with opacity 0 and transitions to opacity 1
* on leaving it starts at opacity 1 and transitions to opacity 0

A slide in/out transition is symmetric if it slides in in one direction and
slides out in the opposite direction.

A slide in/out transition that slides in from one side of the screen and 
out the other would not be symmetric because the start and end positions
are different.  It's an asymmetric transition.

The classes used in transitions are designed to be easy to use for both cases
but more concise for symmetric transitions.



### Symmetric Class Names

For symmetric transitions the following classes are used for transitions:

* `tx-active` - transitioning in or out
* `tx-out` - the out state of the transition
* `tx-in` - the in state of the transition (rarely used)

A fade in/out transition can be configured with just two CSS
declarations:

```css
.scoping-selector-for-you-element
{
    .tx-active
    {
        /* While active class is set CSS transition property
           for opacity */
        transition: opacity 1s;
    }
    .tx-out
    {
        /* In the out state, the opacity is zero */
        opacity: 0;
    }
}
```

There's no need to use the `tx-in` class here because the default opacity
of an element is 1 and doesn't need to be explicitly set.

<div class="tip">

We recommend specifying the `transition` properties on the `tx-active` class
instead of the non-qualified element selector as it helps avoid conflicts
with other transition settings.

</div>




### Asymmetric Class Names

For asymmetric transitions use the following classes for used for the enter
side of the transition:

* `tx-entering` - element is entering
* `tx-enter-start` - state to enter from
* `tx-enter-end` - state to enter to

and these when leaving:

* `tx-leaving` - element is leaving
* `tx-leave-start` - start to leave from
* `tx-leave-end` - start to leave to

Suppose you wanted an animation that entered by sliding in from below
and left by fading out:

```css
.scoping-selector-for-you-element
{
    /* This controls the entering transition - transform*/
    .tx-entering
    {
        transition: transform 1s;
    }
    .tx-enter-start
    {
        transform: translateY(30);
    }

    /* This controls the leaving transition - opacity */
    .tx-leaving
    {
        transition: opacity 0.5s;
    }
    .tx-leave-end
    {
        opacity: 0;
    }
}
```

Of course you can combine things too.  

eg: for a slide in from the bottom, slide out to the top with fading

```css
.scoping-selector-for-you-element
{
    .tx-active
    {
        /* This applies to both enter and leave */
        transition: transform 1s, opacity 1s;
    }
    .tx-out
    {
        /* This is the out-state of both enter and leave */
        opacity: 0;
    }
    .tx-enter-start
    {
        /* This is out-state for entering */
        transform: translateY(30);
    }
    .tx-leave-end
    {
        /* This is out-state for leaving */
        transform: translateY(-30);
    }
}
```

### Full Transition Class List

There's no need to specify whether a transition is symmetric or asymmetric - in both cases
both sets of classes are applied.

The full list of class names is therefore:

* `tx-active` - the element is actively entering or leaving
* `tx-entering` - the element is actively entering
* `tx-enter-start` - set for one frame when an element starts entering
* `tx-enter-end` - set for the rest of the frames until the transition ends
* `tx-leaving` - the element is actively leaving
* `tx-leave-start` - set for one frame when an element starts leaving
* `tx-leave-end` - set for the rest of the frames until the transition ends
* `tx-out` - same as `tx-enter-start` for entering elements and `tx-leave-end`
  for leaving elements
* `tx-in` - same as `tx-enter-end` for entering elements and `tx-leave-start`
  for leaving elements



Looking at this from the perspective of an entering element:

1. Before the element is switched to the entered state, the `tx-active`,
   `tx-entering`, `tx-enter-start` and `tx-out` classes are added.
2. The element is "entered" - ie: the DOM is mutated.
3. One frame later the `tx-enter-start` and `tx-out` classes are removed
   and the `tx-enter-end` and `tx-in` classes are added
4. The elements and all their child elements are monitored for animations 
   and transitions and once all have finished the transition classes
   are removed (ie: `tx-active`, `tx-entering`, `tx-enter-end` and `tx-in`).

The inverse happens for a leaving element:

1. The `tx-active`, `tx-leaving`, `tx-leave-start` and `tx-in` classes are
   added.
3. One frame later the `tx-leave-start` and `tx-in` classes are removed
   and the `tx-leave-end` and `tx-out` classes are added
4. The elements and all their child elements are monitored for animations 
   and transitions and once all have finished all the transition classes
   are removed (ie: `tx-active`, `tx-leaving`, `tx-leave-end` and `tx-out`).
5. The element is left ie: the DOM is mutated. 


## Transition Options

Transitions have various options that control
 transition behaviour.  

Set these options by passing an object to the transition function. 

The value callback can be specified with the `value` key:

The following is equivalent to `transition(c => c.showThisDiv)`.

```js
{
    type: "div",
    display: transition({
        value: c => c.showThisDiv,
        // other options go here.
    })
}
```

Alternatively you can specify options as a series of
values and objects.  Each successive argument is merged 
over thr previous ones:

* a function argument is merged as the `value` property
* a string argument is merged as the `name` property
* an object is merged using `Object.assign`. 

eg:

```js
transition(c => c.show, "transition", 
    { 
        // other options
        mode: "enter-leave"
    },
    {
        // more options
        on_finish: c => c.onFinish(),
    }
)
```

Is the equivalent of

```js
transition({
    value: c => c.show,
    name: "transition",
    mode: "enter-leave",
    on_finish: c => c.onFinish()
});
```

### mode

By default when a transition has both entering and leaving elements, 
both the enter and leave transitions run
concurrently.

For example, consider an `if`/`else` block with a fade transition. The
old active branch will be faded out at 
the same time the new active branch is faded in.

The `mode` option on a `transition` can be used to make the two
transitions run one after the other. 

* "enter-leave" - run the enter transition then the leave
* "leave-enter" - run the leave transition then the enter

```js
[
    {
        type: "div",
        class: "div1",
        if: transition({
            value: c => c.someCondition,
            mode: "enter-leave"
        })
    },
    {
        type: "div",
        class: "div2",
        else: true
    },
]
```

The mode propery can be a string or a callback returning a string. 

### name

By default transitions have a prefix name of "tx-" (as shown in all the 
above examples).  By setting the transition's `name` option the prefix
can be changed:

```js
{
    type: "div",
    display: transition({
        value: c => c.showThisDiv,
        name: "fade",
    })
},
```

Now the transition will use class names `fade-active`, `fade-out`, 
`fade-in` etc...

The name propery can be a string or a callback returning a string. 

### classNames

For even more control over class names you can explicitly specify them 
by setting the `classNames` property in the transition options:

```js
{
    type: "div",
    display: transition({
        value: c => c.showThisDiv,
        classNames: {
            "entering": "my-enter",
            "enter-start": "my-enter-start",
            "enter-end": "my-enter-end",
            "leaving": "my-leaving",
            "leave-start": "my-leave-start",
            "leave-end": "*my-leave-end",
        },
    })
},
```

Any classes not specified will revert to the defaults:

```js
{
    "entering": "*-entering;*-active",
    "enter-start": "*-enter-start;*-out",
    "enter-end": "*-enter-end;*-in",
    "leaving": "*-leaving;*-active",
    "leave-start": "*-leave-start;*-in",
    "leave-end": "*-leave-end;*-out",
}
```

Note that "`*`" will be replaced by the transition's name property 
(or "`tx`" if not set) and multiple class names can be specified by 
separating them with semi-colons.

The `classNames` propery can be a object map of class names or a 
callback that returns one. 

To change the default class names globally, change the `defaultClassNames`
property of the `TransitionCss` function:

```js
import { TransitionCss } from "@codeonlyjs/core";

TransitionCss.defaultClassNames = {
    // Your class names
}
```

The supplied object must include class name entries for all classes.


### duration

The `duration` option lets you specify an explicit duration of a transition
instead of watching for the element's animations to complete.  

This can be useful in complex scenarios with many animations where determining 
the correct end condition might be ambiguous.

The `duration` is specified in milliseconds and can be:

* A single value used for both the entering and leaving phase of the transition
* An array of two values, where `[0]` is the entering duration and `[1]` the 
  leaving duration.
* A callback that returns one of the above.


### subtree

By default when watching for a transition to complete, the
entire sub-tree of the contained elements are monitored for animations.

If a transition only affects the immediate child elements contained within
it, the `subtree` property can be set to `false` to only monitor those elements.

This can be used in situations when:

* elements have a very deep sub-tree that might be expensive to monitor, or 
* elements have other unrelated animations that might confuse the end of 
  transition detection.



## Notifications

To receive notifications when a transition starts, ends or is 
cancelled, set callbacks on the options object:

* `on_start` - notifies a transition has started
* `on_finish` - notifies a transition has finished
* `on_cancel` - notifies a transition has been canceled

The arguments passed to the callbacks are the same as other 
dynamic property callbacks from templates.


```js
{
    type: "div",
    display: transition({
        value: c => c.showThisDiv,
        on_finish: c => c.onTransitionFinished(),
    })
},
```

<div class="tip">

An animation is cancelled if a new transition is started before the
current transition has completed.

</div>



## Custom Transitions

Everything described above applies to CodeOnly's built-in 
`TransitionCss` transition handler. 

You can however built your own transition handlers that use JavaScript
or other animation techniques and libraries for animations.

If the transition options has a `type` property it is used as a
constructor to create a custom transition handler.

The handler is constructed using the `new` operator
and passed the following parameters:

* `options` - the options object passed to the `transition` function.
* `context` - the template's context object.

<div class="tip">

The owning Component instance is available as the `context.model` property.

</div>

The object returned by the constructor is expected to have the 
following members, all of which are required:

### enterNodes(nodes)

A function that receives an array of nodes being entered.  May be
called multiple times so the transition object should accumulate 
all passed nodes.

### leaveNodes(nodes)

Same as `enterNodes` except it receives the nodes that are leaving.

### onWillEnter(callback)

Receives a function that the custom transition must call when the enter
phase of the transition is about to start.

This callback is used to mutate the DOM for the entering state. 

### onDidLeave(callback)

Receives a function that the custom transition must call after the leave
phase of the transition has completed.

This callback is used to mutate the DOM for the leaving state. 

Important: the `onWillEnter` callback must always be called before
the `onDidLeave`.  This is because usually the entering nodes will
be replacing the leaving nodes.  If the leaving nodes are removed
before the entering nodes are inserted the position in the DOM can
be lost.

### start()

Instructs the transition to start.  

Once `start` has been called the `onWillEnter` and `onDidLeave` supplied
callbacks must be called - either at some point in the future as the transition
runs, or in response to the `finish` method being called.

Further, `onWillEnter` and `onDidLeave` must be called
exactly once each. 


### finish()

Instructs the transition to finish, cancelling any pending actions
and immediately completing any pending calls to `onWillEnter` and 
`onDidLeave`.

