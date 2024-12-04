---
title: "Internals"
description: "Learn about some of CodeOnly's internal workings"
---
# Templates Internals

This section describes some of the internals workings of templates 
and the template compiler.

<div class="tip">

Normally it's not necessary to use the template compiler directly
so this page is really only provided for informational purposes
or if you have a requirement to use the template compiler directly
for some reason.

</div>


## Terminology

The following terms are used when describing how CodeOnly templates work:

* `template` - the JSON-like object (with embedded callbacks) that describes
  a heirarchy of DOM elements.
* `domTreeConstructor` - a function that creates a domTree.
* `domTree` - an object that manages a set of DOM nodes and nested `CLObject`s.
* `template compiler` - takes a `template` and returns a `domTreeConstructor` 
  which when called returns a `domTree`.
* `CLObjects` - component like objects including `Component`s and `domTree`s

<div class="tip">

A "domTree" is a JavaScript object that conforms to the CodeOnly component like
object (`CLObject`) requirements.  It is *not* the actual DOM element tree.

</div>



## Component Like Objects

CodeOnly has a concept of a "component like object".  

These are objects that conform to the minimum set of methods and properties 
that are required to host an object in the document tree.

Classes that extend the `Component` class and `domTree` objects created by 
CodeOnly's template compiler are both "component like objects".

The term `CLObject` is used to refer to a component like object although 
this is not a real object class.

`CLObject`s have the following interface:

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

The `rootNodes` property returns an array containing all the root nodes of a `CLObject`.

This property is required and used by hosts to insert the `CLObject` into the parent DOM node.

If the set of root nodes changes, the `CLObject` must check if its existing root nodes
have a `parentNode` and if so replace the nodes in the parent node at the same position.  It 
should also update the set of nodes returned by `rootNodes`.

A `CLObject`s must always have at least one root node.

### update()

Notifies the `CLObject` to update all DOM elements and nested `CLObject`s that it manages.  

This method should at least update the properties on any nested `CLObject`s.  It is at the
discretion of the `CLObject` whether to recurse into the `update()` method of nested 
`CLObject`s.  By default the `domTree`s created by the template compiler do not recurse but
the `update` property in the template can be use to control this behaviour.


### destroy()

Notifies the `CLObject` that its no longer being used.  

The `CLObject` can use this as a hint to clean up any resources it no longer needs, 
release DOM node references and remove event listeners.

There's no guarantee this method will be called however so this should be treated
as a mechanism to help the JavaScript GC releasing references as soon as they're 
no longer needed.

To reliably determine if a `CLObject` is currently still in use or "alive", use the
`setMounted` method.

### setMounted(mounted)

Notifies the `CLObject` that it has been mounted or unmounted.

* `mounted` - true if the component has been mounted, otherwise false.

The object must pass this on to any nested `CLObject`s it is hosting.  For
components extended from the `Component` class this is handled automatically.

A mounted object is always considered "alive" and in use and is the 
correct indicator for when a `CLObject` should acquire and release external 
resources.


### isSingleRoot

This property is optional, but if present and if `true` the object guarantees
to always only ever have one root node.

Single root node components can be used more efficently in `foreach` blocks so if an
object is known to have only a single root, this should be supported.

### rootNode

The single root node of an object whose `isSingleRoot` property is true.


## `CLObject` Constructors

The template compiler can host any object that conforms the `CLObject` requirements
above, so long as it has a parameterless constructor.

If the `type` parameter of a template node is a function it's assumed to be `CLObject`
constructor.  This is normally used to load nested Component objects into a template
but could be used to host other component like objects:

```js
{
    type: MyCLObjectConstructor, /* i:  Parameterless constructor of a custom CLObject*/
}
```

Also, if the `CLObject` is known to be a single root node, this should be reported
on the constructor function as a boolean `isSingleRoot` property.  This is required
so the template compiler can accurately determine if a component is single rooted
before constructing it.

The following shows the minimal implementation of a custom `CLObject`, implemented
as a JavaScript class:

```js
export class MyCLObjectConstructor
{
    constructor()
    {
        this.domNode = document.createElement("div");
    }

    get rootNodes() { return [ this.domNode ] }
    get rootNode() { return this.domNode; }
    get isSingleRoot() { return true; }
    setMounted(mounted) { }
    update() { }
    destroy() { }

    static isSingleRoot = true;
}
```

The template compiler always constructs nested `CLObject`s using the JavaScript 
`new` operator.


## Template Compilation

Templates are just-in-time "JIT" compiled - that is they're converted to JavaScript 
code at run-time.  A compiled template is simply a function that when called 
returns an object that manages a `domTree`.

A `domTree` is an object that manages a set of DOM nodes and conforms to the CodeOnly
component like object (aka `CLObject`) requirements.

Once the `domTree` has been constructed it can be added the document DOM and updated 
as necessary.

Templates support dynamic values through callback functions - usually
fat arrow "`=>`" callbacks that provide values on demand.  By calling the 
constructed templates `update()` method any changed dynamic values are applied
to the DOM, effectively updating what's shown in the browser.

A compiled template can be instantiated multiple times.  For example the template 
for the items in a list would be compiled once and instantiated multiple times to
create each item in the list.

Compiling and instantiating templates is mostly transparent and done automatically
by the `Component` class, but you can also use the template compiler directly.


### Compiling a Template

To compile a template, call the `compileTemplate` function passing the 
template to compile:

```js
import { compileTemplate } from "@codeonlyjs/core";

// The template to compile
let template = { 
  type: "div", 
  text: c => c.greeting, 
};

// Compile it
let domTreeConstructor = compileTemplate(template);
```

### Calling the `domTreeConstructor`

The `compileTemplate` function returns a `domTreeConstructor` - a function
that when called creates a `domTree`.

The `domTreeConstructor` must be passed a `context` object and the context object
is expected to have a `model` property which is the object that will be called
for dynamic property callbacks:

```js
// Create model instance (this will be called for dynamic properties
// used by the template ie: the greeting property)
let model = {
  greeting: "Hello World",
}

// Construct the DOM tree
let domTree = domTreeConstructor({ model });
```

After calling the `domTreeConstructor` the DOM elements will be created
and bindings to the model will be initialized, but the elements are still
not connected to the document.

### Mounting the `domTree`

Once you've got a `domTree` it can be mounted by adding its root nodes
as children of a parent element:

```js
// Mount domTree
document.getElementById("#mountPoint").append(...domTree.rootNodes);
```

At this point you should also inform the `domTree` that it's been mounted.

```js
domTree.setMounted(true);
```

Note that calls to `setMounted()` must be balanced and shouldn't be 
called multiple times with the same mounted value.

### Updating a domTree

To update a `domTree` when dynamic values have changed call the `domTree`'s
`update` method:

```js
model.greeting = "Goodbye";
domTree.update();
```

### Rebinding a domTree

Sometimes the model associated with a `domTree` needs to be changed.  For example
the `foreach` block uses this to re-purpose the `domTree`s of deleted items for
new items.

To do this, change the `model` property of the `context` and then call `rebind`:

```js
// Switch to a new model object
domTree.context.model = { greeting: "this is the new model" }

// Rebind
domTree.rebind();

// Don't forget to update (if necessary)
domTree.update();
```

Rebinding is necessary to internally update the model object used by the
template itself and to rebind any bound template elements to the new model.

### Unmounting the domTree

To remove a mounted `domTree`, remove it's root nodes from the parent
element and call its `setMounted` method:

```js
domTree.rootNodes.forEach(x => x.remove());
domTree.setMounted(false);
```

If you're finished with the domTree you can also destroy it to release
elements and event handlers immediately:

```js
domTree.destroy();
```



