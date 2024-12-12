---
title: Templates API
description: CodeOnly Templates API Reference
---

# Templates API

## $ {#$}


Entry point into the fluent template builder API

The API to the fluent object is dynamic and can't be documented
as a typical API interface.

See the (Fluent Templates](templateFluent) for how to use this API.



```ts
let $: any;
```

## compileTemplate() {#compileTemplate}


Compiles a template into a [DomTreeConstructor](apiLowLevel#DomTreeConstructor) function.

Usually templates are automatically compiled by Components and this
function isn't used directly.   For more information, see
[Template Internals](templateInternals).



```ts
function compileTemplate(rootTemplate: object): DomTreeConstructor;
```

* **`rootTemplate`** The template to be compiled

## html() {#html}


Marks a string as being raw HTML instead of plain text

Normally strings passed to templates are treated as plain text.  Wrapping
a value by calling this function indicates the string should be treated as
raw HTML instead.

See [Text and HTML](templateText) for more information.



```ts
function html(html: string | ((...args: any[]) => string)): HtmlString;
```

* **`html`** The HTML value to be wrapped, or a function that returns a string

## input() {#input}


Declares additional settings for bi-direction input field binding.

See [`InputOptions`](apiTemplates#InputOptions) for available options.

See [Input Bindings](templateInput) for more information.



```ts
function input(options: InputOptions): object;
```

* **`options`** Additional input options

## InputOptions {#InputOptions}


Options for controlling input bindings.

If the [`get`](apiTemplates#InputOptions#get) and [`set`](apiTemplates#InputOptions#set) handlers are specified
they override both [`target`](apiTemplates#InputOptions#target) and [`prop`](apiTemplates#InputOptions#prop) which are no
longer used.


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


The name of the event (usually "change" or "input") to trigger the input binding.  If not specified, "input" is used.


```ts
event: string;
```

### format {#InputOptions#format}


Format the property value into a string for display.


```ts
format?: (value: any) => string;
```

### get {#InputOptions#get}


Get the value of the property.


```ts
get?: (model: any, context: any) => any;
```

### on_change {#InputOptions#on_change}


A callback to be invoked when the property value is changed by the user.


```ts
on_change?: (model: any, event: Event) => any;
```

### parse {#InputOptions#parse}


Parse a display string into a property value.


```ts
parse?: (value: string) => any;
```

### prop {#InputOptions#prop}


The name of the property on the target object.


```ts
prop?: string;
```

### set {#InputOptions#set}


Set the value of the property.


```ts
set?: (model: any, value: any, context: any) => void;
```

### target {#InputOptions#target}


The target object providing the binding property.  If not specified, the template's [`model`](apiLowLevel#DomTreeContext#model) object is used.


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
## TransitionOptions {#TransitionOptions}


Options for controlling behaviour of transitions.

See [Transition Options](templateTransitions#transition-options) for more information.


```ts
type TransitionOptions = {
    value: (model: object, context: object) => any;
    mode?: string;
    name?: void;
    classNames?: object;
    duration?: number;
    subtree?: boolean;
};
```

### classNames {#TransitionOptions#classNames}


A map of class name mappings.


```ts
classNames?: object;
```

### duration {#TransitionOptions#duration}


The duration of the animation in milliseconds.


```ts
duration?: number;
```

### mode {#TransitionOptions#mode}


Transition order - "concurrent", "enter-leave" or "leave-enter"


```ts
mode?: string;
```

### name {#TransitionOptions#name}


Transition name - used as prefix to CSS class names, default = "tx"


```ts
name?: void;
```

### subtree {#TransitionOptions#subtree}


Whether to monitor the element's sub-trees for animations.


```ts
subtree?: boolean;
```

### value {#TransitionOptions#value}


The value callback that triggers the animation when it changes


```ts
value: (model: object, context: object) => any;
```

