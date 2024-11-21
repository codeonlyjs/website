---
title: "Update Semantics"
---
# Update Semantics

This page describes how compiled templates apply updates.

When a template is updated, all dynamic settings (ie: template properties
using a callback) in the template's DOM are updated.  


## Changed Value Checks

The template maintains a copy of the last assigned value for any dynamic
property.  When updating a template, if the property value hasn't changed,
the property isn't re-assigned to the target element or component.

This improves performance particularly when updating the DOM.

For properties of Component elements nested in the template this means:

* Your component instance won't receive a property set accessor call unless 
  the property value actually changes.

* Changing the instance of an object reference property - even if all the 
  object's properties are the same will trigger a property assignment to 
  the component.

* Assigning new object reference to a component property with mostly the
  same object properties will often reduce to a fairly efficent operation
  since the component's internal template will do property value change
  detection itself.



## Deep Component Updates

By default, when a template is updated any embedded components will
have changed dynamic properties applied, but the component's `update()`
method is not called - it's left to the component to detect property
changes an update or invalidate itself.

This behaviour can be changed with the `update` property in the parent
template, which can have one of the following values:

* A callback - the template will call the function and if it returns
  a truthy value, the component will be updated.
* The string "auto" - the component will be updated if any of its 
  dynamic properties changed in value.
* Any other truthy value - the component will always be updated
* A falsey value - the component will never be updated

eg: Always update:

```js
template = {
    type: MyComponent,

    // update MyComponent when this template updates
    update: true,           
};
```

eg: Conditionally update:

```js
template = { 
    type: MyComponent,

    // update MyComponent if c.shouldUpdate is true
    update: c => c.shouldUpdate
}
```

eg: Automatically update:

```js
template = { 
    type: MyComponent,

    // update MyComponent only if any of the 
    // dynamic properties below changed
    update: "auto"

    prop1: c => c.prop1,
    prop2: c => c.prop2,
    prop3: c => c.prop3,
}
```



## More Information

See the following sections for more information about the update semantics of
other directives:

* [`if` Update Semantics](templateIf#update-semantics)
* [`foreach` Update Semantics](templateForEach#update-semantics)
