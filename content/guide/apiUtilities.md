---
title: Utilities
description: CodeOnly Utilities Reference
---

# Utilities

## anyPendingFrames() {#anyPendingFrames}


Check if there are any pending nextFrame callbacks


```ts
function anyPendingFrames(): boolean;
```

## css() {#css}

Declares a CSS style string to be added to the `<head>` block

This function is intended to be used as a template literal tag


```ts
function css(strings: string[], values: string[]): void;
```

* **`strings`** The CSS to be added

* **`values`** The interpolated string values

## fetchJsonAsset() {#fetchJsonAsset}


Fetches a JSON asset.

In the browser, issues a fetch request for an asset
On the server, uses fs.readFile to load a local file asset.

The asset path must be absolute (start with a '/') and is
resolved relative to the project root.



```ts
function fetchJsonAsset(path: string): Promise<object>;
```

* **`path`** The path of the asset to fetch

## fetchTextAsset() {#fetchTextAsset}


Fetches a text asset.

In the browser, issues a fetch request for an asset
On the server, uses fs.readFile to load a local file asset.

The asset path must be absolute (start with a '/') and is
resolved relative to the project root.



```ts
function fetchTextAsset(path: string): Promise<string>;
```

* **`path`** The path of the asset to fetch

## htmlEncode() {#htmlEncode}


Encodes a string to make it safe for use in HTML.



```ts
function htmlEncode(str: string): string;
```

* **`str`** The string to encode

## INotify {#INotify}


Interface to a notify service instance.


```ts
type INotify =
{
    (sourceObject: any, ...args: any[]): void;
    addEventListener: (sourceObject: any, handler: any) => void;
    removeEventListener: (sourceObject: any, handler: any) => void;
}
```

### (call signature)


Fires a notification.



```ts
(sourceObject: any, ...args: any[]): void;
```

* **`sourceObject`** The event source object or value

* **`args`** Optional arguments to pass to the event handlers

### addEventListener {#INotify#addEventListener}


Adds an event listener to the notify service.



```ts
addEventListener: (sourceObject: any, handler: any) => void;
```

* **`sourceObject`** The event source object or value

* **`handler`** The event handler

### removeEventListener {#INotify#removeEventListener}


Removes previously registered event listener from the notify service.



```ts
removeEventListener: (sourceObject: any, handler: any) => void;
```

* **`sourceObject`** The event source object or value

* **`handler`** The event handler

## nextFrame() {#nextFrame}


Invokes a callback on the next update cycle.



```ts
function nextFrame(callback: () => void, order?: number): void;
```

* **`callback`** The callback to be invoked.

* **`order`** The priority of the callback in related to others (lowest first, default 0).

## notify {#notify}


Default [Notify](apiUtilities#Notify) Instance


```ts
let notify: INotify;
```

## Notify() {#Notify}


Creates a new notify service instance.

Usuauly notify instances don't need to be created and the
default [notify](apiUtilities#notify) instance can be used directly.



```ts
function Notify(): INotify;
```

## postNextFrame() {#postNextFrame}


Invokes a callback after all other nextFrame callbacks have been invoked, or
immediately if there are no pending nextFrame callbacks.


```ts
function postNextFrame(callback: () => void): void;
```

* **`callback`** The callback to invoke

## urlPattern() {#urlPattern}


Converts a URL pattern string to a regular expression string.



```ts
function urlPattern(pattern: string): string;
```

* **`pattern`** The URL pattern to be converted to a regular expression

