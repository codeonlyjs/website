---
title: "API"
---
# Component API

## Component Class

### domTreeConstructor (static)

Returns a function to construct the DOM tree for this component.

<div class="tip">

The first time this property is accessed it calls [`onProvideDomTreeConstructor()`](#onprovidedomtreeconstructor-static)
to get the constructor function for the component's template.

</div>



### create()

Creates the DOM tree for this component.

Redundant if already called



### created

Returns `true` if the components `domTree` has been created.



### destroy()

Destroys the underlying DOM tree elements effectively  removing 
all event handlers and releasing all DOM element references.

This method reverts the component to the "constructed" state that can
be re-created explicitly by calling `create()` or implicitly by
re-mounting the component.



### domTree

Returns the instantiated DOM tree of the component, creating
it if necessary.



### getCompiledTemplate() (static)

Gets the compiled template for this component class



### invalidate()

Marks the component as needing a DOM update.

<div info="tip">

The `invalidate` method is bound to the component instance
so it can be passed directly to functions to add/remove event listeners.

</div>

### listen(target, event, handler)

Registers an event listener to be added/remove on an external object
as this component is mounted/unmounted.

* The target object must support `addEventListener` and `removeEventListener`
  methods
* If either the `target` or `event` parameter is `null` or `undefined` the
  call is ignored and this method doesn't nothing.
* If the `handler` parameter is `null` or `undefined` the component's own
  `invalidate` method is used.

To remove a registered event listener, use the `unlisten` method.

This example shows how to automatically register/unregister listeners
on a target object when the component is mounted/unmounted.  Since no
handler is passed to `listen`/`unlisten` the component's own
`invalidate()` method will be used, effectively invalidating the
component whenever the event is triggered.

```js
class PhotoCell extends Component
{
    #photo = null;
    set photo(value)
    {
        // Stop listening to the old photo object 
        // (ignored if old photo is null)
        this.unlisten(this.#photo, "changed");

        // Store new photo
        this.#photo = photo;

        // Start listening to the new photo object
        // (ignored if new photo is null)
        this.listen(this.#photo, "changed");
    }
}
```



### async load(callback, silent)

Performs and async data load:

In non-silent mode (`silent` not specified, or falsey), the load method 
performs the following:

1. sets the `loading` property to true 
2. clears the `loadError` property
3. calls the `invalidate` method to mark the component for update
4. dispatches a `loading` event
5. calls and `await`s the supplied callback
6. catches and stores any thrown errors to the `loadError` property
7. calls the `invalidate` method again
8. dispatches a `loaded` event

In silent mode:

1. calls and `await`s the supplied callback
2. calls the `invalidate` method to mark the component for update

The silent mode is useful for silent data refreshes where the UI provides
no feedback (no spinner).  Usually `silent` would be set to `false` for initial
data load, and `true` for subsequent data refreshes.

Parameters:

* `callback` - an async callback method to perform the actual data load
* `silent` - an optional value, that when truthy causes a silent data load

Returns:

* A promise for the value returned by the callback.



### loadError

Returns any exceptions thrown during the `load()` call.

Setting this property also invalidates the component.



### loading

A read-only property that returns true during a call to `load()`.



### loading (event)

Raised when the `load()` method is called.



### loaded (event)

Raised when the `load()` method is about to exit.



### mount(elementOrSelector)

Mounts the component into a specified DOM element.

Parameters:

* `elementOrSelector` - either a DOM element reference, or a document element 
  selector string.

The `mount()` method should only be used to mount top-level elements.  Mounting
of components in other components should be left to the framework.


### mounted

Returns true if the component is currently mounted.



### onMount()

Override this method to be notified when the component has been mounted.

You should use `onMount()` and `onUnmount()` to acquire and release external
resources.  In particular you should use this method when adding event listeners
to external objects otherwise the component may be kept alive by dangling 
references to the component held by event sources.

### onProvideDomTreeConstructor() (static)

Compiles the component's template as returned by [`onProvideTemplate()`](#onprovidetemplate-static).

<div class="tip">

Override this function to provide a custom DOM tree constructor.

</div>



### onProvideTemplate() (static)

Provides the template declaration for this component by returning `this.template`

<div class="tip">

Override this method to provide a custom template.  See 
[Component Re-templateing](componentsAdvanced#component-re-templating).

</div>



### onUnmount()

Override this method to be notified when the component has been unmounted.



### template (static)

The template declaration object for this component.

The default returns an empty `{}` template.

Nearly every component should override this property.



### unlisten(target, event, handler)

De-registeres an event listener previously registered with the `listen` method.

* If either the `target` or `event` parameter is `null` or `undefined` the
  call is ignored and this method doesn't nothing.
* If the `handler` parameter is `null` or `undefined` the component's own
  `invalidate` method is used.

See the `listen` method for an example.

### unmount()

Unmounts a previously mounted component.


### update()

Immediately updates the DOM elements of this component and
marks the component as not invalid.

<div info="tip">

The `update` method is bound to the component instance
so it can be passed directly to functions to add/remove event listeners.

</div>




### validate()

Updates the component's DOM, if it's marked as invalid by 
a previous call to `invalidate()`.



## Next Steps

* Learn more about [Templates](templates)


