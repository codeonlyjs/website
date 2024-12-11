---
title: Components API
description: CodeOnly Components API Reference
---

# Components API

## Component Class {#Component}


Components are the primary building block for constructing CodeOnly
applications. They encapsulate program logic, a DOM (aka HTML) template
and an optional a set of CSS styles.

Components can be used either in the templates of other components
or mounted onto the document DOM to appear in a web page.



```ts
class Component extends EventTarget {
    static get domTreeConstructor(): DomTreeConstructor;
    static onProvideDomTreeConstructor(): import("core/TemplateCompiler").DomTreeConstructor;
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
    get loadError(): Error;
    get loading(): boolean;
    load(callback: () => any, silent?: boolean): any;
    destroy(): void;
    onMount(): void;
    onUnmount(): void;
    listen(target: EventTarget, event: string, handler?: Function): void;
    unlisten(target: EventTarget, event: string, handler?: Function): void;
    get mounted(): boolean;
    setMounted(mounted: boolean): void;
    mount(el: Element | string): void;
    unmount(): void;
}
```

### create() {#Component#create}

Ensures the DOM elements of this component are created.

Calling this method does nothing if the component is already created.



```ts
create(): void;
```

### created {#Component#created}

Returns true if this component's DOM elements have been created



```ts
get created(): boolean;
```

### destroy() {#Component#destroy}

Destroys this components `domTree` returning it to
the constructed but not created state.

A destroyed component can be recreated by remounting it
or by calling its [Component#create](#Component#create) method.



```ts
destroy(): void;
```

### domTree {#Component#domTree}


Gets the `domTree` for this component, creating it if necessary



```ts
get domTree(): DomTree;
```

### domTreeConstructor (static) {#Component.domTreeConstructor}

Gets the `domTreeConstructor` for this component class.

A `domTreeConstructor` is the constructor function used to
create `domTree` instances for this component class.

The first time this property is accessed, it calls the
static `onProvideDomTreeConstructor` method to actually provide the
instance.


```ts
static get domTreeConstructor(): DomTreeConstructor;
```

### invalid {#Component#invalid}

Indicates if this component is currently marked as invalid


```ts
get invalid(): boolean;
```

### invalidate() {#Component#invalidate}

Marks this component as requiring a DOM update.

Does nothing if the component hasn't yet been created.

This method is implicitly bound to the component instance
and can be used as an event listener to invalidate the
component when an event is triggered.



```ts
invalidate(): void;
```

### isSingleRoot (static) {#Component.isSingleRoot}

Indicates if instances of this component class will be guaranteed
to only ever have a single root node



```ts
static get isSingleRoot(): boolean;
```

### isSingleRoot {#Component#isSingleRoot}

Returns true if this component instance has, and will only ever
have a single root node



```ts
get isSingleRoot(): boolean;
```

### listen() {#Component#listen}

Registers an event listener to be added to an object when
automatically when the component is mounted, and removed when
unmounted



```ts
listen(target: EventTarget, event: string, handler?: Function): void;
```

* **`target`** The object dispatching the events

* **`event`** The event to listen for

* **`handler`** The event listener to add/remove.  If not provided, the component's [Component#invalidate](#Component#invalidate) method is used.

### load() {#Component#load}

Performs an async data load operation.

The callback function is typically an async function that performs
a data request.  While in the callback, the [Component#loading](#Component#loading) property
will return `true`.  If the callback throws an error, it will be captured
to the [Component#loadError](#Component#loadError) property.

Before calling and after returning from the callback, the component is
invalidated so visual elements (eg: spinners) can be updated.

If the silent parameter is `true` the `loading` property isn't set and
the component is only invalidated after returning from the callback.



```ts
load(callback: () => any, silent?: boolean): any;
```

* **`callback`** The callback to perform the load operation

* **`silent`** Whether to perform a silent update

### loadError {#Component#loadError}

Gets the error object (if any) that was thrown during the last async data [Component#load](#Component#load) operation.



```ts
get loadError(): Error;
```


Sets the error object associated with the current async data [Component#load](#Component#load) operation.


```ts
set loadError(value: Error | null);
```

* **`value`** The new error object

### loading {#Component#loading}

Indicates if the component is currently in an async data [Component#load](#Component#load) operation



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

Indicates if the component is current mounted.



```ts
get mounted(): boolean;
```

### onMount() {#Component#onMount}

Notifies a component that is has been mounted

Override this method to receive the notification.  External
resources (eg: adding event listeners to external objects) should be
acquired when the component is mounted.



```ts
onMount(): void;
```

### onProvideDomTreeConstructor() (static) {#Component.onProvideDomTreeConstructor}

Provides the `domTreeConstructor` to be used by this component class.

This method is only called once per component class and should provide
a constructor function that can create `domTree` instances.


```ts
static onProvideDomTreeConstructor(): import("core/TemplateCompiler").DomTreeConstructor;
```

### onProvideTemplate() (static) {#Component.onProvideTemplate}

Provides the template to be used by this component class.

This method is only called once per component class and should provide
the template to be compiled for this component class


```ts
static onProvideTemplate(): {};
```

### onUnmount() {#Component#onUnmount}

Notifies a component that is has been mounted

Override this method to receive the notification.  External
resources (eg: removing event listeners from external objects) should be
released when the component is unmounted.



```ts
onUnmount(): void;
```

### rootNode {#Component#rootNode}

Returns the single root node of this component (if it is a single
root node component)



```ts
get rootNode(): Node;
```

### rootNodes {#Component#rootNodes}

Returns the root nodes of this element



```ts
get rootNodes(): Node[];
```

### setMounted() {#Component#setMounted}


Notifies the object is has been mounted or unmounted


```ts
setMounted(mounted: boolean): void;
```

* **`mounted`** True when the object has been mounted, false when unmounted

### template (static) {#Component.template}

The template to be used by this component class 

```ts
static template: {};
```

### unlisten() {#Component#unlisten}

Removes an event listener previously registered with [Component#listen](#Component#listen)



```ts
unlisten(target: EventTarget, event: string, handler?: Function): void;
```

* **`target`** The object dispatching the events

* **`event`** The event to listen for

* **`handler`** The event listener to add/remove.  If not
provided, the component's [Component#invalidate](#Component#invalidate) method is used.

### unmount() {#Component#unmount}

Unmounts this component



```ts
unmount(): void;
```

### update() {#Component#update}

Immediately updates this component's DOM elements - even if
the component is not marked as invalid.

Does nothing if the component's DOM elements haven't been created.

If the component is marked as invalid, returns it to the valid state.

This method is implicitly bound to the component instance
and can be used as an event listener to update the
component when an event is triggered.



```ts
update(): void;
```

### validate() {#Component#validate}

Updates this component if it's marked as invalid



```ts
validate(): void;
```

