---
title: Low-level APIsdescription: CodeOnly Low-level APIs Reference---

# HtmlString {#HtmlString}

Contains a HTML string


```ts
class HtmlString {
    static areEqual(a: any, b: any): boolean;
    constructor(html: string);
    html: string;
}
```

## areEqual {#HtmlString.areEqual}

```ts
static areEqual(a: any, b: any): boolean;
```

## constructor {#HtmlString#constructor}

Constructs a new HtmlString object


```ts
constructor(html: string);
```

* **`html`** The HTML string

## html {#HtmlString#html}

The HTML string


```ts
html: string;
```

# Style {#Style}

Utility functions for working with CSS styles


```ts
class Style {
    static declare(css: string): void;
}
```

## declare {#Style.declare}

Declares a CSS style string to be added to the `<head>` block


```ts
static declare(css: string): void;
```

* **`css`** The CSS string to be added

# DomTreeConstructor {#DomTreeConstructor}

```ts
type DomTreeConstructor = (DomTreeContext: any) => DomTree;
```

# TransitionCss {#module:TransitionCss}

## defaultClassNames {#module:TransitionCss.defaultClassNames}

```ts
defaultClassNames: {
           entering: string;
           "enter-start": string;
           "enter-end": string;
           leaving: string;
           "leave-start": string;
           "leave-end": string;
       }
```

# TransitionHandler {#TransitionHandler}

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

## enterNodes {#TransitionHandler#enterNodes}


Registers the nodes that will be transitioned in


```ts
enterNodes: (nodes: Node[]) => void;
```

## finish {#TransitionHandler#finish}


Instructs the TranstitionHandler to cancel any pending transition and complete all callbacks.


```ts
finish: () => void;
```

## leaveNodes {#TransitionHandler#leaveNodes}


Registers the nodes that will be transitioned out


```ts
leaveNodes: (nodes: Node[]) => void;
```

## onDidLeave {#TransitionHandler#onDidLeave}


Registers callback to be invoked when leaving nodes can be removed


```ts
onDidLeave: () => void;
```

## onWillEnter {#TransitionHandler#onWillEnter}


Registers a callback to be invoked when entry nodes should be added


```ts
onWillEnter: () => void;
```

## start {#TransitionHandler#start}


Instructs the TransitionHandler to start the transition


```ts
start: () => void;
```

# TransitionNone {#module:TransitionNone}

## enterNodes {#module:TransitionNone.enterNodes}

```ts
function enterNodes(): void;
```

## finish {#module:TransitionNone.finish}

```ts
function finish(): void;
```

## leaveNodes {#module:TransitionNone.leaveNodes}

```ts
function leaveNodes(): void;
```

## onDidLeave {#module:TransitionNone.onDidLeave}

```ts
function onDidLeave(cb: any): void;
```

## onWillEnter {#module:TransitionNone.onWillEnter}

```ts
function onWillEnter(cb: any): void;
```

## start {#module:TransitionNone.start}

```ts
function start(): void;
```

# InputHandler {#InputHandler}

```ts
type InputHandler = object;
```

# CLObject {#CLObject}

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

## destroy {#CLObject#destroy}

```ts
destroy(): void;
```

## isSingleRoot {#CLObject#isSingleRoot}

```ts
readonly isSingleRoot?: boolean;
```

## rootNode {#CLObject#rootNode}

```ts
readonly rootNode?: Node;
```

## rootNodes {#CLObject#rootNodes}

```ts
get rootNodes(): Node[];
```

## setMounted {#CLObject#setMounted}

```ts
setMounted(mounted: boolean): void;
```

## update {#CLObject#update}

```ts
update(): void;
```

# DomTree {#DomTree}

```ts
interface DomTree extends CLObject
{
    rebind(): void;
}
```

## rebind {#DomTree#rebind}

```ts
rebind(): void;
```

# DomTreeContext {#DomTreeContext}

```ts
interface DomTreeContext
{
    get model(): object;
}
```

## model {#DomTreeContext#model}

```ts
get model(): object;
```

