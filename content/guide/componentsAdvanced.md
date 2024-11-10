---
title: "Advanced"
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

A mounted object is always consider "alive" and in use and is the correct indicator
for when a CLObject should acquire and release external resources.


### isSingleRoot

This property is optional, and if present and if it is `true` the object is guaranteed
to always only ever have one root node.

Single root node components can be used more efficently in `foreach` blocks so if an
object is known to have only a single root, this should be supported.

### rootNode

The single root node of an object whose `isSingleRoot` property is true.


## CLObject Constructors

The template compiler can host any object that conforms the CLObject requirements
above, so long as it has a parameterlesss constructor.

If the `type` parameter of a template node is a function it's assumed to be CLObject
constructor.  This is normally used to loaded nested Component objects into a template
but could be used to host other component like objects:

```js
{
    type: MyCLObjectConstructor, /* i:  Pparameterless constructor of a custom CLObject*/
}
```

Also, if the CLObject is known to be a single root node, this should be reported
on the constructor function as a boolean `isSingleRoot` property.  This is requires
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

The `setMounted` method is an internal method used to notify and component
and its template that it has been mounted or unmounted.

When a component's `setMounted` method is called, it calls `onMount()` or
`onUmount()` method to notify the component of the new state.  It then calls
`setMounted()` on the components `domTree` so the notification is reflected
recursively through all `domTree`s.

You can override the `setMounted` method however it's extremely important
that you also call `super.setMounted(mounted)` so all other nested components
receive the notification.  

When overriding `onMount()` and `onUnmount` this isn't required (unless you've
extended another class that expects these notification).




## Custom Templates

Component re-templating is a technique where the template of a component
is modified by the component before it's compiled.

Normally the component compiles the template declared by the static `template` 
property but you can replace that mechanism by overriding one of the following 
methods:

* `onProvideDomTreeConstructor()` - to provide a custom DOM tree constructor function
* `onProvideTemplate()` - to provide an alternative template declaration object

For example, instead of using the component's static `.template` property
directly we can override `onProvideTemplate()` to provide a custom template.

```js
class MyComponent extends Component
{
    // Called by Component to get the template to be compiled
    static onProvideTemplate()
    {
        let modifiedTemplate = {
            // ... whatever ...
        };

        return modifiedTemplate;
    }
}
```

Consider, for example, a dialog class where you want to maintain the same 
frame around every dialog's content, but have different content in the main
body.

eg:

```js
class Dialog extends Component
{
    showModal()
    {
        // `this.domTree` represents the instantiated template
        // - for single-root templates, the root node is
        //   available as this.domTree.rootNode
        // - for multi-root templates, the root nodes are
        //   available as this.domTree.rootNodes

        // Add dialog to the document and show it
        document.body.appendChild(this.domTree.rootNode);
        this.domTree.rootNode.showModal();

        // Remove from document when closed
        this.domTree.rootNode.addEventListener("close", () => {
            this.domTree.rootNode.remove();
        });
    }

    // Override to wrap template in dialog frame
    static onProvideTemplate()
    {
        return {
            type: "dialog",
            class: "dialog",
            id: this.template.id,                   // From the derived class template
            $: {
                type: "form",
                attr_method: "dialog",
                $: [
                    {
                        type: "header",
                        $: this.template.title,     // From the derived class template
                    },
                    {
                        type: "main",
                        $: this.template.content,   // From the derived class template
                    },
                    {
                        type: "footer",
                        $: {
                            type: "button",
                            $: "Close",
                        }
                    },
                ]
            }
        };

    }
}

// Styling common to all dialogs
Style.declare(`
dialog.dialog
{
}
`);
```

Now, we can create a dialog:

```js
class MyDialog extends Dialog
{
    // This template will be "re-templated" by base Dialog
    // to wrap it in <dialog>, <form> etc... before compilation
    static template = {
        title: "My Dialog",
        id: "my-dialog",
        content: {
            type: "p",
            $: "Hello World",
        }
    }
}

// Show dialog
let dlg = new MyDialog();
dlg.showModal();

// Styling specific to this dialog class
Style.declare(`
#my-dialog
{
}
`);
```

Notice how the enclosing `dialog`, `form`, `header`, `main` and `footer` elements
are provided automatically by the base `Dialog` class, but the content of the `header`
and `main` elements is provided by the derived `MyDialog` class

```html
<dialog class="dialog" id="my-dialog">
    <form method="dialog">
        <header>
            My Dialog
        </header>
        <main>
            <p>Hello World</p>
        </main>
        <footer>
            <button>Close</button>
        </footer>
    </form>
</dialog>
```


