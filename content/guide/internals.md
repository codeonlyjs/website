---
title: "Internals",
description: Information on the internal workings of CodeOnly templates
---

# Advanced Component Topics


## Component Like Objects

CodeOnly has a concept of a "component like object".  

These are objects that conform to the minimum set of methods and properties 
that are required to host an object in the document tree.

Classes that extend the `Component` class and `domTree` objects created by 
CodeOnly's template compiler are both "component like objects".

The term `CLObject` is used to refer to a component like object although 
this is not a real object class.

CLObjects have the following interface:

```js
{
    rootNodes: [ Node ]

    update: () => {}
    destroy: () => {}
    setMounted: (mounted) => {}

    isSingleRoot: true or false
    rootNode: Node
}
```

### rootNodes

The `rootNodes` property returns an array containing all the root nodes of a CLObject.

This property is required and used by hosts to insert the CLObject into the parent DOM node.

If the set of root nodes changes, the CLObject must check if its existing root nodes
have a `parentNode` and if so replace the nodes in the parent node at the same position.  It 
should also update the set of nodes returned by `rootNodes`.

A CLObjects must always have at least one root node.

### update()

Notifies the CLObject to update all DOM elements and nested CLObjects that it manages.  

This method should at least update the properties on any nested CLObjects.  It is at the
discretion of the CLObject whether to recurse into the `update()` method of nested 
CLObjects.  By default the `domTree`s created by the template compiler do not recurse but
the `update` property in the template can be use to control this behaviour.


### destroy()

Notifies the CLObject that its no longer being used.  

The CLObject can use this as a hint to clean up any resources it no longer needs, 
release DOM node references and remove event listeners.

There's no guarantee this method will be called however so this should be treated
as a mechanism to help the JavaScript GC releasing references as soon as they're 
no longer needed.

To reliably determine if a CLObject is currently still in use or "alive", use the
`setMounted` method.

### setMounted(mounted)

Notifies the CLObject that it has been mounted or unmounted.

* `mounted` - true if the component has been mounted, otherwise false.

The object must pass this on to any nested CLObjects it is hosting.  For
components extended from the `Component` class this is handled automatically.

A mounted object is always considered "alive" and in use and is the 
correct indicator for when a CLObject should acquire and release external 
resources.


### isSingleRoot

This property is optional, but if present and if `true` the object guarantees
to always only ever have one root node.

Single root node components can be used more efficently in `foreach` blocks so if an
object is known to have only a single root, this should be supported.

### rootNode

The single root node of an object whose `isSingleRoot` property is true.


## CLObject Constructors

The template compiler can host any object that conforms the CLObject requirements
above, so long as it has a parameterlesss constructor.

If the `type` parameter of a template node is a function it's assumed to be CLObject
constructor.  This is normally used to load nested Component objects into a template
but could be used to host other component like objects:

```js
{
    type: MyCLObjectConstructor, /* i:  Parameterless constructor of a custom CLObject*/
}
```

Also, if the CLObject is known to be a single root node, this should be reported
on the constructor function as a boolean `isSingleRoot` property.  This is required
so the template compiler can accurately determine if a component is single rooted
before constructing it.

The following shows the minimal implementation of a custom CLObject, implemented
as a JavaScript class:

```js
export class MYCLObjectConstructor
{
    constructor()
    {
        this.domNode = document.createElement("div");
    }

    get rootNodes() { return [rootNode] }
    get rootNode() { return this.domNode; }
    setMounted(mounted) { }
    update() { }
    destroy() { }

    static isSingleRoot = true;
}
```

The template compiler always constructs nested CLObjects using the JavaScript 
`new` operator.


## The domTree Property

A component's `domTree` is the object responsible for managing the DOM
elements associated with the component.

The `domTree` is usually the object created by a compiled template
and has methods to update the tree, get the root node of the tree etc...

The `domTree` is created on demand when the component is first mounted, but
can be manually created by calling the component's `create()` method.

When a component is destroyed, its `domTree` is released, and the component
reverts from a "created" state to a "constructed" state.  Remounting the
component, or calling its `create()` method again will create a new `domTree`.



## The setMounted Method

The `setMounted` method is an internal method used to notify a component
and its template that it has been mounted or unmounted.

When a component's `setMounted` method is called, it calls `onMount()` or
`onUmount()` method to notify the component of the new state.  It then calls
`setMounted()` on the component's `domTree` so the notification is reflected
recursively through all `domTree`s.

You can override the `setMounted` method however it's extremely important
that you also call `super.setMounted(mounted)` so all other nested components
receive the notification.  

When overriding `onMount()` and `onUnmount()` calling `super.onMount()` and 
`super.onUnmount()` isn't required (unless you're extending another class 
that expects these notification).



