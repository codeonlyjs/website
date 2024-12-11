---
title: Templates API
description: CodeOnly Templates API Reference
---

# Templates API

## compileTemplate() {#compileTemplate}

Compiles a template into a domTreeConstructor function


```ts
function compileTemplate(rootTemplate: object): DomTreeConstructor;
```

* **`rootTemplate`** The template to be compiled

## html() {#html}

Marks a string as being HTML instead of plain text

Normally strings passed to templates are treated as plain text.  Wrapping
a value in html() indicates the string should be treated as HTML instead.



```ts
function html(html: string | ((...args: any[]) => string)): HtmlString;
```

* **`html`** The HTML value to be wrapped, or a function that returns a string

## input() {#input}

Declares additional settings for input bindings


```ts
function input(options: InputOptions): object;
```

* **`options`** Additional input options

## InputOptions {#InputOptions}


Options for controlling input bindings


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

## transition() {#transition}

Declares addition settings transition directives


```ts
function transition(...options: any[]): {
    (...args: any[]): any;
    withTransition(context: any): any;
};
```

* **`options`** 
