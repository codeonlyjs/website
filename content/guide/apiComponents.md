---
title: Components API
description: CodeOnly Components API Reference
---

# Components API

## Component Class {#Component}


Components are the primary building block for constructing CodeOnly
applications. They encapsulate program logic, a DOM template
and an optional a set of CSS styles.

Components can be used either in the templates of other components
or mounted onto the document DOM to appear in a web page.

See also [Component Basics](components).



```ts
class Component extends EventTarget {
    static get domTreeConstructor(): DomTreeConstructor;
    static onProvideDomTreeConstructor(): DomTreeConstructor;
    static onProvideTemplate(): {};
    static get isSingleRoot(): boolean;
    static template: {};
    update(): void;
    invalidate(): void;
    create(): void;
    get created(): boolean;
    get domTree(): DomTree;
    get isSingleRoot(): boolean;
    get rootNode(): Node;
    get rootNodes(): Node[];
    get invalid(): boolean;
    validate(): void;
    set loadError(value: Error | null);
    get loadError(): Error | null;
    get loading(): boolean;
    load(callback: () => Promise<any>, silent?: boolean): Promise<any>;
    destroy(): void;
    onMount(): void;
    onUnmount(): void;
    listen(target: object, event: string, handler?: Function): void;
    unlisten(target: object, event: string, handler?: Function): void;
    get mounted(): boolean;
    setMounted(mounted: boolean): void;
    mount(el: Element | string): void;
    unmount(): void;
}
```

### create() {#Component#create}


Ensures this component's [DomTree](apiLowLevel#DomTree) has been created.

Calling this method does nothing if the DomTree is already created.



```ts
create(): void;
```

### created {#Component#created}


Returns true if this component's [DomTree](apiLowLevel#DomTree) has been created.



```ts
get created(): boolean;
```

### destroy() {#Component#destroy}


Destroys this component's [`DomTree`](apiLowLevel#DomTree) returning it to
the constructed, but non-created state.

A destroyed component can be re-created by remounting it
or by calling its [create](apiComponents#Component#create) method.



```ts
destroy(): void;
```

### domTree {#Component#domTree}


Gets the [`DomTree`](apiLowLevel#DomTree) for this component, creating it if necessary.



```ts
get domTree(): DomTree;
```

### domTreeConstructor (static) {#Component.domTreeConstructor}


Gets the [`DomTreeConstructor`](apiLowLevel#DomTreeConstructor) for this component class.

The DomTreeConstructor is the constructor function used to
create [`DomTree`](apiLowLevel#DomTree) instances for this component class.

The first time this property is accessed, it calls the
static [`onProvideDomTreeConstructor`](apiComponents#Component.onProvideDomTreeConstructor) method to
provide the instance.



```ts
static get domTreeConstructor(): DomTreeConstructor;
```

### invalid {#Component#invalid}


Indicates if this component in invalid.

A component is invalid if it has been invalidated by
a previous call to [`invalidate`](apiComponents#Component#invalidate) and
hasn't yet be updated.



```ts
get invalid(): boolean;
```

### invalidate() {#Component#invalidate}


Invalidates this component, marking it as requiring a DOM update.

Does nothing if the component hasn't yet been created.

This method is bound to the component instance and can be used
directly as the handler for an event listener to invalidate the
component when an event is triggered.



```ts
invalidate(): void;
```

### isSingleRoot (static) {#Component.isSingleRoot}


Returns `true` if every instance of this component class will only
ever have a single root node.



```ts
static get isSingleRoot(): boolean;
```

### isSingleRoot {#Component#isSingleRoot}


Returns true if this component instance is guaranteed to always only
have a single root node.



```ts
get isSingleRoot(): boolean;
```

### listen() {#Component#listen}


Registers an event listener to be automatically added to an object when
when the component is mounted, and removed when unmounted.



```ts
listen(target: object, event: string, handler?: Function): void;
```

* **`target`** Any object that supports addEventListener and removeEventListener

* **`event`** The event to listen to

* **`handler`** The event handler to add.  If not provided, the component's [invalidate](apiComponents#Component#invalidate) method is used.

### load() {#Component#load}


Performs an async data load operation.

The callback function is an async function that performs an async data load.
While in the callback, the [loading](apiComponents#Component#loading) property returns `true`.

If the callback throws an error, it will be captured to the [loadError](apiComponents#Component#loadError)
property.

Before calling and after returning from the callback, the component is
invalidated so visual elements (eg: spinners) can be updated.

If the silent parameter is `true` the [loading](apiComponents#Component#loading) property isn't set and
the component is only invalidated after returning from the callback.



```ts
load(callback: () => Promise<any>, silent?: boolean): Promise<any>;
```

* **`callback`** The callback to perform the load operation

* **`silent`** Whether to perform a silent update

### loadError {#Component#loadError}


Gets the error object thrown during the last call to [`load`](apiComponents#Component#load).



```ts
get loadError(): Error | null;
```


Sets the error object associated with the current call to [`load`](apiComponents#Component#load).



```ts
set loadError(value: Error | null);
```

* **`value`** The new error object

### loading {#Component#loading}


Indicates if the component is currently in an [`load`](apiComponents#Component#load) operation.



```ts
get loading(): boolean;
```

### mount() {#Component#mount}


Mounts this component against an element in the document.



```ts
mount(el: Element | string): void;
```

* **`el`** The element or an element selector that specifies where to mount the component

### mounted {#Component#mounted}


Returns `true` if the component is currently mounted.



```ts
get mounted(): boolean;
```

### onMount() {#Component#onMount}


Notifies a component that is has been mounted.

Override this method to receive the notification.  External
resources should be acquired when the component is mounted.
(eg: adding event listeners to external objects)



```ts
onMount(): void;
```

### onProvideDomTreeConstructor() (static) {#Component.onProvideDomTreeConstructor}


Provides the [`DomTreeConstructor`](apiLowLevel#DomTreeConstructor) to be used by this
component class.

This method is called once per component class and should provide
a constructor function that can create DomTree instances.


```ts
static onProvideDomTreeConstructor(): DomTreeConstructor;
```

### onProvideTemplate() (static) {#Component.onProvideTemplate}


Provides the template to be used by this component class.

This method is called once per component class and should provide
the template to be compiled for this component class.


```ts
static onProvideTemplate(): {};
```

### onUnmount() {#Component#onUnmount}


Notifies a component that is has been unmounted.

Override this method to receive the notification.  External
resources should be released when the component is unmounted.
(eg: removing event listeners from external objects)



```ts
onUnmount(): void;
```

### rootNode {#Component#rootNode}


Returns the single root node of this component (if it is a single
root node component).



```ts
get rootNode(): Node;
```

### rootNodes {#Component#rootNodes}


Returns an array of root DOM nodes for this element, creating them if necessary.



```ts
get rootNodes(): Node[];
```

### setMounted() {#Component#setMounted}


Notifies the object it has been mounted or unmounted



```ts
setMounted(mounted: boolean): void;
```

* **`mounted`** `true` if the object has been mounted, `false` if unmounted

### template (static) {#Component.template}


The template to be used by this component class


```ts
static template: {};
```

### unlisten() {#Component#unlisten}


Removes an event listener previously registered with [listen](apiComponents#Component#listen)



```ts
unlisten(target: object, event: string, handler?: Function): void;
```

* **`target`** Any object that supports addEventListener and removeEventListener

* **`event`** The event being listened to

* **`handler`** The event handler to remove.  If not provided, the component's [invalidate](apiComponents#Component#invalidate) method is used.

### unmount() {#Component#unmount}


Unmounts this component



```ts
unmount(): void;
```

### update() {#Component#update}


Immediately updates this component's DOM elements - even if
the component is not marked as invalid.

Does nothing if the component's DOM elements haven't been created.

If the component has been invalidated, returns it to the valid state.

This method is bound to the component instance and can be used
directly as the handler for an event listener to update the
component when an event is triggered.



```ts
update(): void;
```

### validate() {#Component#validate}


Updates this component if it has been marked as invalid
by a previous call to [`invalidate`](apiComponents#Component#invalidate).



```ts
validate(): void;
```

