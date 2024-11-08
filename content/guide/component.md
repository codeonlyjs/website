---
title: "API"
subtitle: "A simple, lightweight, code-only front-end Web framework."
projectTitle: CodeOnly
---
# Component API



## domConstructor (static)

Returns a function to construct the DOM template for this component.

<div class="tip">

The first time this property is accessed it calls [`onProvideDomConstructor()`](#onprovidedomconstructor-static)
to get the constructor function for the component's template.

</div>



## create()

Creates the DOM elements for this component.

Redundant if already called



## destroy()

Destroys the underlying DOM template elements effectively  removing 
all event handlers and releasing all DOM element references.

This method reverts the component to the "constructed" state that can
be re-created explicitly by calling `create()` or implicitly by
re-mounting the component.



## dom

Returns the instantiated DOM template of the component, creating
it if necessary.



## getCompiledTemplate() (static)

Gets the compiled template for this component class



## invalidate()

Marks the component as needing a DOM update.

<div info="tip">

The `invalidate` method is bound to the component instance
so it can be passed directly to functions to add/remove event listeners.

</div>



## async load(callback)

Performs and async data load:

1. sets the `loading` property to true 
2. clears the `loadError` property
3. calls the `invalidate` method to mark the component for update
4. dispatches a `loading` event
5. calls and `await`s the supplied callback
6. catches and stores any thrown errors to the `loadError` property
7. calls the `invalidate` method again
8. dispatches a `loaded` event

Parameters:

* `callback` - an async callback method to perform the actual data load

Returns:

* A promise for the value returned by the callback.



## loadError

Returns any exceptions thrown during the `load()` call.

Setting this property also invalidates the component.



## loading

A read-only property that returns true during a call to `load()`.



## loading (event)

Raised when the `load()` method is called.



## loaded (event)

Raised when the `load()` method is about to exit.



## mount(elementOrSelector)

Mounts the component into a specified DOM element.

Parameters:

* `elementOrSelector` - either a DOM element reference, or a document element 
  selector string.

The `mount()` method should only be used to mount top-level elements.  Mounting
of components in other components should be left to the framework.



## onMount()

Override this method to be notified when the component has been mounted.

You should use `onMount()` and `onUnmount()` to acquire and release external
resources.  In particular you should use this method when adding event listeners
to external objects otherwise the component may be kept alive by dangling 
references to the component held by event sources.

## onProvideDomConstructor() (static)

Compiles the component's template as returned by [`onProvideTemplate()`](#onprovidetemplate-static).

<div class="tip">

Override this function to provide a custom DOM constructor.

</div>



## onProvideTemplate() (static)

Provides the template declaration for this component by returning `this.template`

<div class="tip">

Override this method to provide a custom template.  See 
[Component Re-templateing](componentsAdvanced#component-re-templating).

</div>



## onUnmount()

Override this method to be notified when the component has been unmounted.



## template (static)

The template declaration object for this component.

The default returns an empty `{}` template.

Nearly every component should override this property.



## update()

Immediately updates the DOM elements of this component and
marks the component as not invalid.

<div info="tip">

The `update` method is bound to the component instance
so it can be passed directly to functions to add/remove event listeners.

</div>



## unmount()

Unmounts a previously mounted component.



## validate()

Updates the component's DOM, if it's marked as invalid by 
a previous call to `invalidate()`.



## Next Steps

* Learn more about [Templates](templates)


