---
title: API Reference
---

# @codeonlyjs/core {#module:@codeonlyjs/core}

## anyPendingFrames {#anyPendingFrames}


Check if there are any pending nextFrame callbacks


```ts
function anyPendingFrames(): boolean;
```

## CLObject {#CLObject}

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

### destroy {#CLObject#destroy}

```ts
destroy(): void;
```

### isSingleRoot {#CLObject#isSingleRoot}

```ts
readonly isSingleRoot?: boolean;
```

### rootNode {#CLObject#rootNode}

```ts
readonly rootNode?: Node;
```

### rootNodes {#CLObject#rootNodes}

```ts
get rootNodes(): Node[];
```

### setMounted {#CLObject#setMounted}

```ts
setMounted(mounted: boolean): void;
```

### update {#CLObject#update}

```ts
update(): void;
```

## compileTemplate {#compileTemplate}

Compiles a template into a domTreeConstructor function


```ts
function compileTemplate(rootTemplate: object, compilerOptions: any): DomTreeConstructor;
```

* **`rootTemplate`** The template to be compiled

## Component {#Component}


Components are the primary building block for constructing CodeOnly
applications. They encapsulate program logic, a DOM (aka HTML) template
and an optional a set of CSS styles.

Components can be used either in the templates of other components
or mounted onto the document DOM to appear in a web page.



```ts
class Component extends EventTarget {
    static get domTreeConstructor(): DomTreeConstructor;
    static onProvideDomTreeConstructor(): DomTreeConstructor;
    static onProvideTemplate(): {};
    static get isSingleRoot(): boolean;
    static nextFrameOrder: number;
    static template: {};
    update(): void;
    invalidate(): void;
    create(): void;
    get created(): boolean;
    get domTree(): import("core/TemplateCompiler").DomTree;
    get isSingleRoot(): boolean;
    get rootNode(): Node;
    get rootNodes(): Node[];
    get invalid(): boolean;
    validate(): void;
    set loadError(value: Error);
    get loadError(): Error;
    get loading(): boolean;
    load(callback: () => any, silent?: boolean): any;
    destroy(): void;
    onMount(): void;
    onUnmount(): void;
    listen(target: EventTarget, event: string, handler?: Function): void;
    unlisten(target: EventTarget, event: string, handler?: Function): void;
    get mounted(): boolean;
    setMounted(mounted: any): void;
    mount(el: Element | string): void;
    unmount(): void;
}
```

### create {#Component#create}

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

### destroy {#Component#destroy}

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
get domTree(): import("core/TemplateCompiler").DomTree;
```

### domTreeConstructor {#Component.domTreeConstructor}

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

### invalidate {#Component#invalidate}

Marks this component as requiring a DOM update.

Does nothing if the component hasn't yet been created.

This method is implicitly bound to the component instance
and can be used as an event listener to invalidate the
component when an event is triggered.



```ts
invalidate(): void;
```

### isSingleRoot {#Component.isSingleRoot}

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

### listen {#Component#listen}

Registers an event listener to be added to an object when
automatically when the component is mounted, and removed when
unmounted



```ts
listen(target: EventTarget, event: string, handler?: Function): void;
```

* **`target`** The object dispatching the events

* **`event`** The event to listen for

* **`handler`** The event listener to add/remove.  If not provided, the component's [Component#invalidate](#Component#invalidate) method is used.

### load {#Component#load}

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
set loadError(value: Error);
```

### loading {#Component#loading}

Indicates if the component is currently in an async data [Component#load](#Component#load) operation



```ts
get loading(): boolean;
```

### mount {#Component#mount}

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

### nextFrameOrder {#Component.nextFrameOrder}

```ts
static nextFrameOrder: number;
```

### onMount {#Component#onMount}

Notifies a component that is has been mounted

Override this method to receive the notification.  External
resources (eg: adding event listeners to external objects) should be
acquired when the component is mounted.



```ts
onMount(): void;
```

### onProvideDomTreeConstructor {#Component.onProvideDomTreeConstructor}

Provides the `domTreeConstructor` to be used by this component class.

This method is only called once per component class and should provide
a constructor function that can create `domTree` instances.


```ts
static onProvideDomTreeConstructor(): DomTreeConstructor;
```

### onProvideTemplate {#Component.onProvideTemplate}

Provides the template to be used by this component class.

This method is only called once per component class and should provide
the template to be compiled for this component class


```ts
static onProvideTemplate(): {};
```

### onUnmount {#Component#onUnmount}

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

### setMounted {#Component#setMounted}

```ts
setMounted(mounted: any): void;
```

### template {#Component.template}

The template to be used by this component class 

```ts
static template: {};
```

### unlisten {#Component#unlisten}

Removes an event listener previously registered with [Component#listen](#Component#listen)



```ts
unlisten(target: EventTarget, event: string, handler?: Function): void;
```

* **`target`** The object dispatching the events

* **`event`** The event to listen for

* **`handler`** The event listener to add/remove.  If not
provided, the component's [Component#invalidate](#Component#invalidate) method is used.

### unmount {#Component#unmount}

Unmounts this component



```ts
unmount(): void;
```

### update {#Component#update}

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

### validate {#Component#validate}

Updates this component if it's marked as invalid



```ts
validate(): void;
```

## css {#css}

Declares a CSS style string to be added to the `<head>` block

This function is intended to be used as a template literal tag


```ts
function css(strings: string[], values: string[]): void;
```

* **`strings`** The CSS to be added

* **`values`** The interpolated string values

## DomTree {#DomTree}

```ts
interface DomTree extends CLObject
{
    rebind(): void;
}
```

### rebind {#DomTree#rebind}

```ts
rebind(): void;
```

## DomTreeConstructor {#DomTreeConstructor}

```ts
type DomTreeConstructor = (DomTreeContext: any) => DomTree;
```

## DomTreeContext {#DomTreeContext}

```ts
interface DomTreeContext
{
    get model(): object;
}
```

### model {#DomTreeContext#model}

```ts
get model(): object;
```

## Environment {#Environment}

The base class for all environment types


```ts
class Environment extends EventTarget {
    browser: boolean;
    enterLoading(): void;
    leaveLoading(): void;
    get loading(): boolean;
    load(callback: () => Promise<any>): Promise<any>;
    untilLoaded(): Promise<void>;
}
```

### browser {#Environment#browser}

```ts
browser: boolean;
```

### enterLoading {#Environment#enterLoading}

Notifies the environment that an async load operation is starting


```ts
enterLoading(): void;
```

### leaveLoading {#Environment#leaveLoading}

Notifies the environment that an async load operation has finished


```ts
leaveLoading(): void;
```

### load {#Environment#load}

Runs an async data load operation


```ts
load(callback: () => Promise<any>): Promise<any>;
```

* **`callback`** A callback that performs the data load

### loading {#Environment#loading}

Indicates if there are async data load operations in progress


```ts
get loading(): boolean;
```

### untilLoaded {#Environment#untilLoaded}

Returns a promise that resolves when any pending load operation has finished


```ts
untilLoaded(): Promise<void>;
```

## fetchJsonAsset {#fetchJsonAsset}

Fetches a JSON asset

 In the browser, issues a fetch request for an asset
 On the server, uses fs.readFile to load a local file asset

 The asset path must be absolute (start with a '/') and is
 resolved relative to the project root.



```ts
function fetchJsonAsset(path: string): Promise<object>;
```

* **`path`** The path of the asset to fetch

## fetchTextAsset {#fetchTextAsset}

Fetches a text asset

 In the browser, issues a fetch request for an asset
 On the server, uses fs.readFile to load a local file asset

 The asset path must be absolute (start with a '/') and is
 resolved relative to the project root.



```ts
function fetchTextAsset(path: string): Promise<string>;
```

* **`path`** The path of the asset to fetch

## generateStatic {#generateStatic}

Generates a static generated site (SSG)



```ts
function generateStatic(options: {
    entryFile?: string[];
    entryMain?: string[];
    entryHtml?: string[];
    entryUrls?: string[];
    ext?: string;
    pretty?: boolean;
    outDir?: string;
    baseUrl?: string;
    verbose?: boolean;
    cssUrl?: string;
}): Promise<{
    files: any[];
    elapsed: number;
}>;
```

* **`options`** site generation options

* **`options.entryFile`** The entry .js file (as an array, first found used)

* **`options.entryMain`** The name of the entry point function in the entryFile (as an array, first found used)

* **`options.entryHtml`** The HTML file to use as template for generated files (as an array, first found used)

* **`options.entryUrls`** The URL's to render (will also recursively render all linked URLs)

* **`options.ext`** The extension to append to all generated files (including the period)

* **`options.pretty`** Prettify the generated HTML

* **`options.outDir`** The output directory to write generated files

* **`options.baseUrl`** The base URL used to qualify in-page URLs to an external full URL

* **`options.verbose`** Verbose output

* **`options.cssUrl`** Name of the CSS styles file

## html {#html}

Marks a string as being HTML instead of plain text

Normally strings passed to templates are treated as plain text.  Wrapping
a value in html() indicates the string should be treated as HTML instead.



```ts
function html(html: string | ((...args: any[]) => string)): HtmlString;
```

* **`html`** The HTML value to be wrapped, or a function that returns a string

## htmlEncode {#htmlEncode}

Encodes a string to make it safe for use in HTML


```ts
function htmlEncode(str: string): string;
```

* **`str`** The string to encode

## HtmlString {#HtmlString}

Contains a HTML string


```ts
class HtmlString {
    static areEqual(a: any, b: any): boolean;
    constructor(html: string);
    html: string;
}
```

### areEqual {#HtmlString.areEqual}

```ts
static areEqual(a: any, b: any): boolean;
```

### constructor {#HtmlString#constructor}

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

## input {#input}

Declares additional settings for input bindings


```ts
function input(options: InputOptions): InputHandler;
```

* **`options`** Additional input options

## InputHandler {#InputHandler}

```ts
type InputHandler = object;
```

## InputOptions {#InputOptions}

```ts
type InputOptions = {
    event: string;
    prop?: string;
    target?: string | ((model: object) => string);
    format?: (value: any) => string;
    parse?: (value: string) => any;
    get?: (model: any, context: any) => any;
    set?: (model: any, value: any, context: any) => void;
    on_change?: (model: any, event: Event) => any;
};
```

### event {#InputOptions#event}


The name of the event (usually "change" or "input") to trigger the input binding


```ts
event: string;
```

### format {#InputOptions#format}


Format the property value into a string for display


```ts
format?: (value: any) => string;
```

### get {#InputOptions#get}


Get the value of the property


```ts
get?: (model: any, context: any) => any;
```

### on_change {#InputOptions#on_change}


A callback to be invoked when the property value is changed by the user


```ts
on_change?: (model: any, event: Event) => any;
```

### parse {#InputOptions#parse}


Parse a display string into a property value


```ts
parse?: (value: string) => any;
```

### prop {#InputOptions#prop}


The name of the property on the target object


```ts
prop?: string;
```

### set {#InputOptions#set}


Set the value of the property


```ts
set?: (model: any, value: any, context: any) => void;
```

### target {#InputOptions#target}


The target object providing the binding property


```ts
target?: string | ((model: object) => string);
```

## nextFrame {#nextFrame}


Invokes a callback on the next update cycle



```ts
function nextFrame(callback: () => void, order?: number): void;
```

* **`callback`** The callback to be invoked

* **`order`** The priority of the callback in related to others (lowest first, default 0)

## Notify {#Notify}

```ts
function Notify(): {
    (sourceObject: any, ...args: any[]): void;
    addEventListener: (sourceObject: any, handler: any) => void;
    removeEventListener: (sourceObject: any, handler: any) => void;
};
```

## PageCache {#PageCache}

Implements a simple MRU cache that can be used to cache Page components for route handlers 

```ts
class PageCache {
    constructor(options: {
        max: number;
    });
    get(key: any, factory: (key: any) => any): any;
}
```

### constructor {#PageCache#constructor}

Constructs a new page cache


```ts
constructor(options: {
    max: number;
});
```

* **`options`** Options controlling the cache

* **`options.max`** The maximum number of cache entries to keep

### get {#PageCache#get}

Get a cached object from the cache, or create a new one


```ts
get(key: any, factory: (key: any) => any): any;
```

* **`key`** The key for the page

* **`factory`** A callback to create the page item if not in the cache

## postNextFrame {#postNextFrame}


Invokes a callback after all other nextFrame callbacks have been invoked, or
immediately if there are no pending nextFrame callbacks.


```ts
function postNextFrame(callback: () => void): void;
```

* **`callback`** The callback to invoke

## Route {#Route}

```ts
type Route = {
    url: URL;
    state: any;
    current: boolean;
    handler: RouteHandler;
    viewState?: any;
    page?: any;
    title?: string;
};
```

### current {#Route#current}


True when this is the current route


```ts
current: boolean;
```

### handler {#Route#handler}


The handler associated with this route


```ts
handler: RouteHandler;
```

### page {#Route#page}


The page component for this route


```ts
page?: any;
```

### state {#Route#state}


State associated with the route


```ts
state: any;
```

### title {#Route#title}


The route's page title


```ts
title?: string;
```

### url {#Route#url}


The route's URL


```ts
url: URL;
```

### viewState {#Route#viewState}


The route's view state


```ts
viewState?: any;
```

## RouteHandler {#RouteHandler}

```ts
type RouteHandler = {
    pattern?: string | RegExp;
    match?: (route: Route) => Promise<boolean>;
    mayEnter?: (from: Route, to: Route) => Promise<boolean>;
    mayLeave?: (from: Route, to: Route) => Promise<boolean>;
    didEnter?: (from: Route, to: Route) => boolean;
    didLeave?: (from: Route, to: Route) => boolean;
    cancelEnter?: (from: Route, to: Route) => boolean;
    cancelLeave?: (from: Route, to: Route) => boolean;
    order?: number;
    captureViewState?: (route: Route) => object;
    restoreViewState?: (route: Route, state: object) => void;
};
```

### cancelEnter {#RouteHandler#cancelEnter}


Notifies that a route that could have been entered was cancelled


```ts
cancelEnter?: (from: Route, to: Route) => boolean;
```

### cancelLeave {#RouteHandler#cancelLeave}


Notifies that a route that could have been left was cancelled


```ts
cancelLeave?: (from: Route, to: Route) => boolean;
```

### captureViewState {#RouteHandler#captureViewState}


A callback to capture the view state for this route handler's routes


```ts
captureViewState?: (route: Route) => object;
```

### didEnter {#RouteHandler#didEnter}


Notifies that a route for this handler has been entered


```ts
didEnter?: (from: Route, to: Route) => boolean;
```

### didLeave {#RouteHandler#didLeave}


Notifies that a route for this handler has been left


```ts
didLeave?: (from: Route, to: Route) => boolean;
```

### match {#RouteHandler#match}


A callback to confirm the URL match


```ts
match?: (route: Route) => Promise<boolean>;
```

### mayEnter {#RouteHandler#mayEnter}


Notifies that a route for this handler may be entered


```ts
mayEnter?: (from: Route, to: Route) => Promise<boolean>;
```

### mayLeave {#RouteHandler#mayLeave}


Notifies that a route for this handler may be left


```ts
mayLeave?: (from: Route, to: Route) => Promise<boolean>;
```

### order {#RouteHandler#order}


Order of this route handler when compared to all others (default = 0, lowest first)


```ts
order?: number;
```

### pattern {#RouteHandler#pattern}


A string pattern or regular expression to match URL pathnames to this route handler


```ts
pattern?: string | RegExp;
```

### restoreViewState {#RouteHandler#restoreViewState}


A callback to restore the view state for this route handler's routes


```ts
restoreViewState?: (route: Route, state: object) => void;
```

## Router {#Router}


The Router class - handles URL load requests, creating
route objects using route handlers and firing associated
events


```ts
class Router {
    constructor(handlers: RouteHandler[]);
    start(driver: object): any;
    navigate: any;
    replace: any;
    back: any;
    urlMapper: any;
    internalize(url: URL | string): URL | string;
    externalize(url: URL | string): URL | string;
    get current(): Route;
    get pending(): Route;
    addEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
    removeEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
    register(handlers: RouteHandler | RouteHandler[]): void;
    revoke(predicate: (handler: RouteHandler) => boolean): void;
    captureViewState: (route: Route) => object;
    restoreViewState: (route: Route, state: object) => void;
}
```

### addEventListener {#Router#addEventListener}

Adds an event listener

Available events are:
  - "mayEnter", "mayLeave" (async, cancellable events)
  - "didEnter" and "didLeave" (sync, non-cancellable events)
  - "cancel" (sync, notification only)



```ts
addEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to listen to

* **`handler`** The event handler function

### back {#Router#back}

```ts
back: any;
```

### captureViewState {#Router#captureViewState}

a callback to capture the view state for this route handler's routes


```ts
captureViewState: (route: Route) => object;
```

### constructor {#Router#constructor}

Constructs a new Router instance


```ts
constructor(handlers: RouteHandler[]);
```

* **`handlers`** An array of router handlers to initially register

### current {#Router#current}

The current route object


```ts
get current(): Route;
```

### externalize {#Router#externalize}

Externalizes a URL


```ts
externalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### internalize {#Router#internalize}

Internalizes a URL


```ts
internalize(url: URL | string): URL | string;
```

* **`url`** The URL to internalize

### navigate {#Router#navigate}

```ts
navigate: any;
```

### pending {#Router#pending}

The route currently being navigated to


```ts
get pending(): Route;
```

### register {#Router#register}

Registers one or more route handlers with the router


```ts
register(handlers: RouteHandler | RouteHandler[]): void;
```

* **`handlers`** The handler or handlers to register

### removeEventListener {#Router#removeEventListener}

Removes a previously added event handler



```ts
removeEventListener(event: string, handler: RouterEventAsync | RouterEventSync): void;
```

* **`event`** The event to remove the listener for

* **`handler`** The event handler function to remove

### replace {#Router#replace}

```ts
replace: any;
```

### restoreViewState {#Router#restoreViewState}

a callback to restore the view state for this route handler's routes


```ts
restoreViewState: (route: Route, state: object) => void;
```

### revoke {#Router#revoke}

Revoke previously used handlers by matching to a predicate


```ts
revoke(predicate: (handler: RouteHandler) => boolean): void;
```

* **`predicate`** Callback passed each route handler, return true to remove

### start {#Router#start}

Starts the router, using the specified driver


```ts
start(driver: object): any;
```

* **`driver`** The router driver to use

### urlMapper {#Router#urlMapper}

```ts
urlMapper: any;
```

## setEnvProvider {#setEnvProvider}

Sets an environment provider


```ts
function setEnvProvider(value: () => Environment): void;
```

* **`value`** A callback to provide the current environment object

## SSRWorker {#SSRWorker}

```ts
class SSRWorker {
    init(options: any): Promise<void>;
    stop(): Promise<void>;
    getStyles(): Promise<any>;
    render(url: any, options: any): Promise<any>;
}
```

### getStyles {#SSRWorker#getStyles}

```ts
getStyles(): Promise<any>;
```

### init {#SSRWorker#init}

```ts
init(options: any): Promise<void>;
```

### render {#SSRWorker#render}

```ts
render(url: any, options: any): Promise<any>;
```

### stop {#SSRWorker#stop}

```ts
stop(): Promise<void>;
```

## SSRWorkerThread {#SSRWorkerThread}

```ts
class SSRWorkerThread {
    init(options: any): Promise<any>;
    render(url: any): Promise<any>;
    getStyles(): Promise<any>;
    stop(): Promise<any>;
    invoke(method: any, ...args: any[]): Promise<any>;
}
```

### getStyles {#SSRWorkerThread#getStyles}

```ts
getStyles(): Promise<any>;
```

### init {#SSRWorkerThread#init}

```ts
init(options: any): Promise<any>;
```

### invoke {#SSRWorkerThread#invoke}

```ts
invoke(method: any, ...args: any[]): Promise<any>;
```

### render {#SSRWorkerThread#render}

```ts
render(url: any): Promise<any>;
```

### stop {#SSRWorkerThread#stop}

```ts
stop(): Promise<any>;
```

## Style {#Style}

Utility functions for working with CSS styles


```ts
class Style {
    static declare(css: string): void;
}
```

### declare {#Style.declare}

Declares a CSS style string to be added to the `<head>` block


```ts
static declare(css: string): void;
```

* **`css`** The CSS string to be added

## transition {#transition}

Declares addition settings transition directives


```ts
function transition(options: {
    value: (model: object, context: object) => any;
    mode?: string;
    name?: void;
    classNames?: object;
    duration?: number;
    subtree?: boolean;
}, ...args: any[]): TransitionHandler;
```

* **`options`** * @param {(model:object, context:object) => any} options.value The value callback that triggers the animation when it changes

* **`options.mode`** Transition order - concurrent, enter-leave or leave-enter

* **`options.name`** Transition name - used as prefix to CSS class names, default = "tx"

* **`options.classNames`** A map of class name mappings

* **`options.duration`** The duration of the animation in milliseconds

* **`options.subtree`** Whether to monitor the element's sub-trees for animations

## TransitionCss {#module:TransitionCss}

### defaultClassNames {#module:TransitionCss.defaultClassNames}

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

## TransitionHandler {#TransitionHandler}

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

## TransitionNone {#module:TransitionNone}

### enterNodes {#module:TransitionNone.enterNodes}

```ts
function enterNodes(): void;
```

### finish {#module:TransitionNone.finish}

```ts
function finish(): void;
```

### leaveNodes {#module:TransitionNone.leaveNodes}

```ts
function leaveNodes(): void;
```

### onDidLeave {#module:TransitionNone.onDidLeave}

```ts
function onDidLeave(cb: any): void;
```

### onWillEnter {#module:TransitionNone.onWillEnter}

```ts
function onWillEnter(cb: any): void;
```

### start {#module:TransitionNone.start}

```ts
function start(): void;
```

## UrlMapper {#UrlMapper}

Provides URL internalization and externalization 

```ts
class UrlMapper {
    constructor(options: {
        base: string;
        hash: boolean;
    });
    options: {
        base: string;
        hash: boolean;
    };
    internalize(url: URL): URL;
    externalize(url: URL, asset?: boolean): URL;
}
```

### constructor {#UrlMapper#constructor}

Constructs a new Url Mapper


```ts
constructor(options: {
    base: string;
    hash: boolean;
});
```

* **`options`** Options for how to map URLs

* **`options.base`** The base URL of the external URL

* **`options.hash`** True to use hashed URLs

### externalize {#UrlMapper#externalize}

Externalizes a URL



```ts
externalize(url: URL, asset?: boolean): URL;
```

* **`url`** The URL to externalize

* **`asset`** If true, ignores the hash option (used to externalize asset URLs with base only)

### internalize {#UrlMapper#internalize}

Internalizes a URL



```ts
internalize(url: URL): URL;
```

* **`url`** The URL to internalize

### options {#UrlMapper#options}

```ts
options: {
    base: string;
    hash: boolean;
};
```

## urlPattern {#urlPattern}

Converts a URL pattern string to a regular expression string



```ts
function urlPattern(pattern: string): string;
```

* **`pattern`** The URL pattern to be converted to a regular expression

## viteGenerateStatic {#viteGenerateStatic}

```ts
function viteGenerateStatic(options: any): {
    name: string;
    configResolved: (config: any) => void;
    buildStart: () => Promise<void>;
    closeBundle: () => Promise<void>;
};
```

