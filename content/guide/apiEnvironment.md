---
title: Environment API
description: CodeOnly Environment API Reference
---

# Environment API

## Environment Class {#Environment}

The base class for all environment types


```ts
class Environment extends EventTarget {
    browser: boolean;
    ssr: boolean;
    enterLoading(): void;
    leaveLoading(): void;
    get loading(): boolean;
    load(callback: () => Promise<any>): Promise<any>;
    untilLoaded(): Promise<void>;
}
```

### browser {#Environment#browser}


True when running in browser environment


```ts
browser: boolean;
```

### enterLoading() {#Environment#enterLoading}

Notifies the environment that an async load operation is starting


```ts
enterLoading(): void;
```

### leaveLoading() {#Environment#leaveLoading}

Notifies the environment that an async load operation has finished


```ts
leaveLoading(): void;
```

### load() {#Environment#load}

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

### ssr {#Environment#ssr}


True when running in a rendering environment


```ts
ssr: boolean;
```

### untilLoaded() {#Environment#untilLoaded}

Returns a promise that resolves when any pending load operation has finished


```ts
untilLoaded(): Promise<void>;
```

## setEnvProvider() {#setEnvProvider}

Sets an environment provider


```ts
function setEnvProvider(value: () => Environment): void;
```

* **`value`** A callback to provide the current environment object

