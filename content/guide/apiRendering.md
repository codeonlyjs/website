---
title: Rendering API
description: CodeOnly Rendering API Reference
---

# Rendering API

## generateStatic() {#generateStatic}

Generates a static generated site (SSG)



```ts
function generateStatic(options: GenerateStaticOptions): Promise<{
    files: any[];
    elapsed: number;
}>;
```

* **`options`** site generation options

## GenerateStaticOptions {#GenerateStaticOptions}


Options for generating static sites


```ts
type GenerateStaticOptions = {
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
};
```

### baseUrl {#GenerateStaticOptions#baseUrl}


The base URL used to qualify in-page URLs to an external full URL


```ts
baseUrl?: string;
```

### cssUrl {#GenerateStaticOptions#cssUrl}


Name of the CSS styles file


```ts
cssUrl?: string;
```

### entryFile {#GenerateStaticOptions#entryFile}


The entry .js file (as an array, first found used)


```ts
entryFile?: string[];
```

### entryHtml {#GenerateStaticOptions#entryHtml}


The HTML file to use as template for generated files (as an array, first found used)


```ts
entryHtml?: string[];
```

### entryMain {#GenerateStaticOptions#entryMain}


The name of the entry point function in the entryFile (as an array, first found used)


```ts
entryMain?: string[];
```

### entryUrls {#GenerateStaticOptions#entryUrls}


The URL's to render (will also recursively render all linked URLs)


```ts
entryUrls?: string[];
```

### ext {#GenerateStaticOptions#ext}


The extension to append to all generated files (including the period)


```ts
ext?: string;
```

### outDir {#GenerateStaticOptions#outDir}


The output directory to write generated files


```ts
outDir?: string;
```

### pretty {#GenerateStaticOptions#pretty}


Prettify the generated HTML


```ts
pretty?: boolean;
```

### verbose {#GenerateStaticOptions#verbose}


Verbose output


```ts
verbose?: boolean;
```

## SSRResult {#SSRResult}


The results of an SSRWorker/SSRWorkerThread render operation.

In addition to the `content` property, this object includes
any properties from the `ssr` property of the route object to
which the URL was matched.  This can be used to return additional
information such as HTTP status codes from the rendering process.


```ts
type SSRResult = {
    content: string;
};
```

### content {#SSRResult#content}


The rendered HTML


```ts
content: string;
```

## SSRWorker Class {#SSRWorker}


Implements page rendering for SSG and/or SSR


```ts
class SSRWorker {
    init(options: {
        entryFile: string;
        entryMain: string;
        entryHtml: string;
        cssUrl?: string;
    }): Promise<void>;
    stop(): Promise<void>;
    getStyles(): Promise<string>;
    render(url: string, options: any): SSRResult;
}
```

### getStyles() {#SSRWorker#getStyles}


Gets the declared CSS styles


```ts
getStyles(): Promise<string>;
```

### init() {#SSRWorker#init}


Initializes the SSR worker


```ts
init(options: {
    entryFile: string;
    entryMain: string;
    entryHtml: string;
    cssUrl?: string;
}): Promise<void>;
```

* **`options`** Options

* **`options.entryFile`** The main entry .js file

* **`options.entryMain`** The name of the main function in the entry file

* **`options.entryHtml`** An HTML string into which mounted components will be written

* **`options.cssUrl`** A URL to use in-place of directly inserting CSS declarations

### render() {#SSRWorker#render}


Renders a page


```ts
render(url: string, options: any): SSRResult;
```

* **`url`** URL of the page to render

* **`options`** Additional options to be made available via `coenv`

### stop() {#SSRWorker#stop}


Stops the worker.


```ts
stop(): Promise<void>;
```

## SSRWorkerThread Class {#SSRWorkerThread}


Runs an SSRWorker in a Node worker thread for
application isolation


```ts
class SSRWorkerThread {
    init(options: {
        entryFile: string;
        entryMain: string;
        entryHtml: string;
        cssUrl?: string;
    }): Promise<void>;
    render(url: string): SSRResult;
    getStyles(): Promise<string>;
    stop(): Promise<any>;
}
```

### getStyles() {#SSRWorkerThread#getStyles}


Gets the declared CSS styles


```ts
getStyles(): Promise<string>;
```

### init() {#SSRWorkerThread#init}


Initializes the SSR worker


```ts
init(options: {
    entryFile: string;
    entryMain: string;
    entryHtml: string;
    cssUrl?: string;
}): Promise<void>;
```

* **`options`** Options

* **`options.entryFile`** The main entry .js file

* **`options.entryMain`** The name of the main function in the entry file

* **`options.entryHtml`** An HTML string into which mounted components will be written

* **`options.cssUrl`** A URL to use in-place of directly inserting CSS declarations

### render() {#SSRWorkerThread#render}


Renders a page


```ts
render(url: string): SSRResult;
```

* **`url`** URL of the page to render

### stop() {#SSRWorkerThread#stop}


Stops the worker.


```ts
stop(): Promise<any>;
```

## viteGenerateStatic() {#viteGenerateStatic}


Vite Plugin to generate static sites.


```ts
function viteGenerateStatic(options: GenerateStaticOptions): {
    name: string;
    configResolved: (config: any) => void;
    buildStart: () => Promise<void>;
    closeBundle: () => Promise<void>;
};
```

* **`options`** options used for static page generation

