---
title: "Transitions"
---
# Transitions

CodeOnly provides support for CSS transitions on various 
operations in templates:

* Insert and removing content with `if` directives
* Showing and hiding elements with the `display` directive
* Adding or removing a called with boolean `class_` directives
* Changing the `key` on an item

Transitions are supported by adding CSS classes to the element(s) 
affected by the operation before the operation and removing those
classes when all pending animations have completed.

## In/Out States

All transitions currently supported by CodeOnly are considered
to be in either an in-state or an out-state". 

* For `if` directives, an included item is the in-state,
  and an exluded item is in the out-state.
* For `display` directives, a shown item is in the in-state, a hidden
  item is in the out-state.
* For boolean `class_` directives, a true condition is the in-state 
  and a false condition is the out-state.

When the state of an element switches from the out-state to the 
in-state it is said to be "entering" and when an item switches from 
the in-state to the out-state is it said to be leaving.



## Declaring Transition Conditions

To declare that a setting should be transitioned, wrap the callback
function that determines the entered/left state with the `transition`
function:

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

The `transition` function indicates that when the condition changes
certain CSS classes should be added to the entering and leaving
DOM elements.


## Transition CSS Classes

<div class="tip">

The following describes the default CSS classes used in transitions.
See below for information on how to customize the class names

</div>

When an element is being transitioned, the following classes are 
applied:

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
2. The element is "entered" - ie: added to the DOM, shown etc...
3. One frame later the `tx-enter-start` and `tx-out` classes are removed
   and the `tx-enter-end` and `tx-in` classes are added
4. The elements and all their child elements are monitored for animations 
   and transitions and once all have finished all the transition classes
   are removed (ie: `tx-active`, `tx-entering`, `tx-enter-end` and `tx-in`).

The inverse happens for a leaving element:

1. The `tx-active`, `tx-leaving`, `tx-leave-start` and `tx-in` classes are
   added.
3. One frame later the `tx-leave-start` and `tx-in` classes are removed
   and the `tx-leave-end` and `tx-out` classes are added
4. The elements and all their child elements are monitored for animations 
   and transitions and once all have finished all the transition classes
   are removed (ie: `tx-active`, `tx-leaving`, `tx-leave-end` and `tx-out`).

There's a lot to grasp here, and one way to better understand these classes
is to consider symmetric vs asymmetric transitions.



## Symmetric vs Asymmetric Transitions

A symmetric transition is one where the leave transition is the exact inverse
of the enter transition.

A fade in/out transition is symmetric:

* on entering it starts with opacity 0 and transitions to opacity 1
* on leaving it starts at opacity 1 and transitions to opacity 0

A slide in/out transition is symmetric if it slides in one direction and
slides out the opposite direction.

A slide in/out transition that slides in from one side of the screen and 
out the other would not be symmetric because the start and end positions
are different.  It's an asymmetric transition.

The classes used in transitions are designed to be easy to use for both cases
but more concise for symmetric transitions.



## CSS Classes for Symmetric Transitions

For symmetric transitions the following classes can be used

* `tx-active` - transitioning in or out
* `tx-out` - the out state of the transition
* `tx-in` - the in state of the transition (rarely used)

A fade in/out transition can be configured like this:

```
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

This example doesn't specify the `tx-in` class because the default opacity
of an element is 1 and doesn't need to be explicitly set.

<div class="tip">

We recommend specifying the `transition` properties on the `tx-active` class
instead of on the non-qualified element selector as it helps avoid conflicts
with other transition settings.

</div>




## CSS Classes for Asymmetric Transitions

For asymmetric transitions use the following classes for the enter
side of the transition:

* `tx-entering` - element is entering
* `tx-enter-start` - state to enter from
* `tx-enter-end` - state to enter to

and these when leaving:

* `tx-leaving` - element is leaving
* `tx-leave-start` - start to leave from
* `tx-leave-end` - start to leave to

Suppose you wanted to transition that entered by sliding in from below
and left by fading out:

```
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

```
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


## Key Triggered Transitions

The other way a transition can be triggered is by setting a `key`
property on an element:

```js
{
    type: "div",
    text: c => c.counter,
    key: transition(c => c.counter),
}
```

In this case the transition is triggered when the key changes.

When a transition is triggered by a key change:

* a new instance of the element is created and transitioned in
* the old instance of the elemtn is transitioned out

This can be used to create transitions between values.  In the 
above example you could create a cross fade effect between the
counter value as it changes, or you could slide the old value
out and the new value in etc...



## Transition Options

Transitions have various options that can be set to control the
the transition behaviour.  

To set these options, pass an object to the transition function 
with the condition callback specified as the `value` key:

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


## Transition Modes

By default when a transition enters one set of elements and
leaves another, both the enter and leave transitions run
concurrently.

For example, on an `if`/`else` block with a fade transition the
old branch active branch of the `if` block will be faded out at 
the same time the new active branch is faded in.

The `mode` option on a `transition` can be used to change this
so the enter transition runs first and completes before the 
leave transition starts... or vice versa.

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



## Setting a CSS Class Name Prefix

There are two ways to customize the CSS class names used in transitions.

By default transitions have a prefix name of "tx-" (as shown in all the
class names above).  By setting the transition's `name` option the prefix
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



## Customizing CSS Class names

For even more control over class names you can specify them precisely
by setting the class names on the transition options:

```js
{
    type: "div",
    display: transition({
        value: c => c.showThisDiv,
        "entering": "my-enter",
        "enter-start": "my-enter-start",
        "enter-end": "my-enter-end",
        "leaving": "my-leaving",
        "leave-start": "my-leave-start",
        "leave-end": "*my-leave-end",
    })
},
```


The default values are:

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

Note that "`*`" is a place-holder for the transition's name property 
(or "`tx`" if not set) and multiple class names can be specified by 
separating them with semi-colons.

To change the default class names globally, change the `defaultClassNames`
property of the `TransitionCss` function:

```js
import { TransitionCss } from "@codeonlyjs/core";

TransitionCss.defaultClassNames = {
    // Your class names
}
```


## JavaScript Notifications

To receive notifications of when a transition starts, ends or is 
cancelled, set the function callbacks on the options object:

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
`TransitionCss` transition.

You can however built your own transitions that use JavaScript
or other animation techniques for transitions.

If the transition options has a `type` property it is used as a
constructor create a custom transition handler.

The handler is constructed using the JavaScript `new` operator
and passed the following parameters:

* `options` - the options object passed to the `transition` function.
* `context` - the template's context object.

<div class="tip">

The Component object is available as the `context.model` property.

</div>

The object constructed by the constructor is expected to have the 
following members, all required:

### enterNodes(nodes)

A function that receives an array of nodes being entered.  May be
called multiple times so the transition object should keep track
of all passed nodes.

### leaveNodes(nodes)

Same as `enterNodes` except it passes the nodes that are leaving.

### onWillEnter(callback)

Receives a function that the custom transition must call when the enter
phase of the transition is about to start.

The template engine will typically use this callback to add entering
nodes into the DOM.

### onDidLeave(callback)

Receives a function that the custom transition must call after the leave
phase of the transition has completed.

The template engine will typically use this callback to remove the
leaving nodes from the DOM.

Important: the `onWillEnter` callback must always be called before
the `onDidLeave`.  This is because usually the entering nodes will
be replacing the leaving nodes.  If the leaving nodes are removed
before the entering nodes are inserted the position in the DOM can
be lost.

### start()

Instructs the transition to start.  Once `start` has been called
the transition must call the `onWillEnter` and `onWillLeave` supplied
callbacks - either at some point in the future when the transition has
finished naturally, or in response to the `finish` method being called.

### finish()

Instructs the transition to finish, cancelling any pending actions
and immediately completing any pending calls to `onWillEnter` and 
`onDidLeave`.

