---
title: Low-level APIs
description: CodeOnly Low-level APIs Reference
---

# Low-level APIs

## CLObject {#CLObject}


Component Like Object.  Minimumm requirement for any
object to be hosted by a template


```ts
interface CLObject 
{
    get rootNodes(): Node[];
    update(): void;
    destroy(): void;
    setMounted(mounted: boolean): void;
    readonly isSingleRoot?: boolean;
    readonly rootNode?: Node;
}
```

### destroy() {#CLObject#destroy}


Notifies the object it can release held resources


```ts
destroy(): void;
```

### isSingleRoot {#CLObject#isSingleRoot}


If present and if true, indicates this object will
only ever have a single root node


```ts
readonly isSingleRoot?: boolean;
```

### rootNode {#CLObject#rootNode}


Returns the root node (if isSingleRoot is true)


```ts
readonly rootNode?: Node;
```

### rootNodes {#CLObject#rootNodes}


Gets the root nodes of this object


```ts
get rootNodes(): Node[];
```

### setMounted() {#CLObject#setMounted}


Notifies the object is has been mounted or unmounted


```ts
setMounted(mounted: boolean): void;
```

* **`mounted`** True when the object has been mounted, false when unmounted

### update() {#CLObject#update}


Instructs the object to update its DOM


```ts
update(): void;
```

## DomTree {#DomTree}


Implemented by all objects that manage a DOM tree.


```ts
interface DomTree extends CLObject
{
    rebind(): void;
}
```

### rebind() {#DomTree#rebind}


Instructs the DomTree that the model property of
the DomTree's context object has changed and that
it should rebind to the new instance


```ts
rebind(): void;
```

## DomTreeConstructor {#DomTreeConstructor}


A function that creates a DomTree


```ts
type DomTreeConstructor = (DomTreeContext: any) => DomTree;
```

## DomTreeContext {#DomTreeContext}


Context object for DomTrees.


```ts
interface DomTreeContext
{
    get model(): object;
}
```

### model {#DomTreeContext#model}


The context's model object


```ts
get model(): object;
```

## HtmlString Class {#HtmlString}

Contains a HTML string


```ts
class HtmlString {
    static areEqual(a: any, b: any): boolean;
    constructor(html: string);
    html: string;
}
```

### areEqual() (static) {#HtmlString.areEqual}


Compares two values and returns true if they
are both HtmlString instances and both have the
same inner `html` value.


```ts
static areEqual(a: any, b: any): boolean;
```

* **`a`** The first value to compare

* **`b`** The second value to compare

### constructor() {#HtmlString#constructor}

Constructs a new HtmlString object


```ts
constructor(html: string);
```

* **`html`** The HTML string

### html {#HtmlString#html}

The HTML string


```ts
html: string;
```

## Style Class {#Style}

Utility functions for working with CSS styles


```ts
class Style {
    static declare(css: string): void;
}
```

### declare() (static) {#Style.declare}

Declares a CSS style string to be added to the `<head>` block


```ts
static declare(css: string): void;
```

* **`css`** The CSS string to be added

## TransitionHandler {#TransitionHandler}


Implemented by objects that handle transitions


```ts
type TransitionHandler = {
    enterNodes: (nodes: Node[]) => void;
    leaveNodes: (nodes: Node[]) => void;
    onWillEnter: () => void;
    onDidLeave: () => void;
    start: () => void;
    finish: () => void;
};
```

### enterNodes {#TransitionHandler#enterNodes}


Registers the nodes that will be transitioned in


```ts
enterNodes: (nodes: Node[]) => void;
```

### finish {#TransitionHandler#finish}


Instructs the TranstitionHandler to cancel any pending transition and complete all callbacks.


```ts
finish: () => void;
```

### leaveNodes {#TransitionHandler#leaveNodes}


Registers the nodes that will be transitioned out


```ts
leaveNodes: (nodes: Node[]) => void;
```

### onDidLeave {#TransitionHandler#onDidLeave}


Registers callback to be invoked when leaving nodes can be removed


```ts
onDidLeave: () => void;
```

### onWillEnter {#TransitionHandler#onWillEnter}


Registers a callback to be invoked when entry nodes should be added


```ts
onWillEnter: () => void;
```

### start {#TransitionHandler#start}


Instructs the TransitionHandler to start the transition


```ts
start: () => void;
```

