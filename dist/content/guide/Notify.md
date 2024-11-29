---
title: "Notify Service"
---
# Notify Service

The Notify service is a simple notification mechanism that can be used to broadcast
event notifications in your application.

`Notify` has been designed primarily for sending object change
notifications, but can also be used as a general event broadcast service.

To use `Notify`, import it and create an instance by calling the `Notify()`
function:

```js
import { Notify } from "@codeonlyjs/core";

// Create an instance
export let notify = Notify()
```

Or, since you usually only ever need one instance, import the
default singleton instance directly:

```js
import { notify } from "@codeonlyjs/core";
```


## Object Change Notifications

`Notify` can be used to send object change notifications.

It has been designed to be non-intrusive - that is, it can send change
notifications for specific object instances without needing to change
the objects themselves, nor affect their lifetime.

For example, `Notify` can be used to send object change
notifications for plain deserialized JSON objects.

To receive notifications, call `notify.addEventListener` specifying the 
object whose notifications you wish to receive.

```js
notify.addEventListener(myObject, () => {
    // notification received
});
```

To send a change notification call the `notify()` function, passing the 
object whose listeners are to be notified:

```js
notify(myObject);
```

The objects tracked by `Notify` are weakly referenced.  If an
object being monitored is garbage collected, any referenced
listeners will also eventually be cleaned up.

Listener callbacks should be removed using `notify.removeEventListener()` 
when notifications for that object are no longer required.  

Typically a component would register event listeners during `onMount` 
and release them during `onUnmount` - either directly or by 
using `Component.listen` (see below).

Calls to `notify()`, `addEventListener()` or `removeEventListener()`
with a falsey value (eg: `null` or `undefined`) for object are ignored.



## Broadcast Events

`Notify` also supports sending non-object associated events by passing
a non-object value (typically a string) as a the object.  This allows
`Notify` to be used as a general event broadcast system:

Sender:

```js
notify("appSettingsChanged");
```

Receiver:

```js
notify.addEventListener("appSettingsChanged", () => {
    // Handle event
});
```

Listeners for non-object events must be manually removed if no 
longer needed.



## Passing Parameters

Any parameters passed to `notify` will be passed on to the event handler
callbacks:

Sender:

```js
notify(myObject, "change");
```

Receiver:

```js
notify.addEventListener(myObject, (action) => {
    if (action == 'change')
    {
    }
})
```


## Use with `Component.listen()`

The Notify API is compatible with the `Component.listen` method:

```js
class MyComponent extends Component
{
    constructor(product)
    {  
        this.product = product;

        // Any events fired on the product object 
        // will invalidate this component
        this.listen(notify, product);
    }
}
```

Or, if the object to be monitored is a property of the component:

```js
class MyComponent extends Component
{
    #product = null
    get product()
    {
        return this.#product;
    }
    set product(value)
    {
        this.unlisten(notify, this.#product);
        this.#product = value;
        this.listen(notify, this.#product);
    }
}
```

Notes:

* The `notify` object itself is passed as the target (since
  it's the object with the `addEventListener`/`removeEventListener` methods)
* The object itself (the `product` object) is passed as the "event"
* The listeners will be automatically added and removed when
  the component is mounted/unmounted.
* In the second example, the old product is `unlisten`ed before the new
  product is `listen`ed to.
* In the second example, a `null` product works fine since `null`
  values are ignored by `Notify`.


