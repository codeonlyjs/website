---
title: "Getting Started"
---
# Getting Started

Because there's so many ways to use CodeOnly, the best way to
get started will depend on what you're trying to achieve.

<div class="box-container">

<a class="box" href="#codeonly-lab">

### CodeOnly Lab

Learn the basics by running simple experiments right here in your browser.

</a>

<a class="box" href="#cdn-packages">

### CDN Packages

The easiest way to add CodeOnly to a project, no server required.

</a>

<a class="box" href="#npm-package">

### NPM Package

For use with popular build and bundling tools like
Vite, Rollup, Webpack etc...

</a>

</a>

<a class="box" href="#spa-project">

### SPA Project

Generate a single page app for use with
simple file server or full server.

</a>

<a class="box" href="#full-stack-project">

### Full-Stack Project

A full-stack single page app. Client SPA, server, 
live reload and Docker ready.

</a>

</div>

## CodeOnly Lab

If you just want to experiment with and learn about CodeOnly, the 
<a href="/lab">CodeOnly Lab</a> is the perfect way to get started. 
You can write simple components and experiment with them right in 
your browser.

* The Lab expects a component class called "Main" as the entry point
  to your experiment.

* Save your experiments by clicking the Copy Link button - that'll 
  copy a link to your clipboard that you can use to share your 
  experiments and to reload them later.

* Clicking the "Copy Link" button also places the link in the browser 
  address bar so you can refresh to get back to a previous save point
  or use browser bookmarks to save your experiments.

* The ".html" button will download a .html file containing your 
  experiment.  You'll still need a web connection to run it because it
  gets JavaScript and CSS files from the CodeOnly site, but it's an
  easy way to make a simple web app.

* The Lab only supports a single source code file but you can still 
  create multiple component classes - just put them one after the 
  other. 

## CDN Packages

CDN packages for CodeOnly are available via [jsDelivr](https://www.jsdelivr.com/).

ES6 Library:

* <https://cdn.jsdelivr.net/gh/codeonlyjs/core/dist/codeonly.js>

Minimized ES6 Library:

* <https://cdn.jsdelivr.net/gh/codeonlyjs/core/dist/codeonly.min.js>

The easiest way to use these packages is with an import map:

```html
<script type="importmap">
{
    "imports": {
        "@codeonlyjs/core": "https://cdn.jsdelivr.net/gh/codeonlyjs/core/dist/codeonly.min.js"
    }
}
</script>
```

You can then import from the library using the same `@codeonlyjs/core` package name as the NPM packages:

```html
<script type="module">
import { Component, Style } from "@codeonlyjs/core";
// etc...
</script>
```

## NPM Package

The CodeOnly NPM package is available from github:

```
npm install --save codeonlyjs/core
```

The NPM package can be used with bundling
tools like [Rollup](https://rollupjs.org/) and [Browserify](https://browserify.org/) 
or build servers like [Vite](https://vite.dev/) and [Snowpack](https://www.snowpack.dev/).

<div class="tip">

Consider using a CodeOnly [Full Stack Project](#full-stack-project) as an alternative to a 
development build server.

</div>



## SPA Project

A CodeOnly SPA Project is an easy way to get started on a single page app.

It includes the entry index.html file, a router, home page,
header bar, and Stylish theme with light/dark mode support.

<div class="tip">

An SPA Project requires a file server and won't work by just opening the
index.html from the file system.  The project includes instructions on how
to easily work around this.

</div>

To create a CodeOnly Single Page App project:

1. You'll need NodeJS to run the CLI tool - [get it here](https://nodejs.org/).
2. From a command prompt, enter the following command (replacing 
   "MyNewProject" with the name of your project):

    ```
    npx codeonlyjs/cogent new spa MyNewProject
    ```

This will create a new directory containing everything required for a
client side single page app.

Included in the new project directory will be a readme.md file with information
about the project structure and instructions on how to run it during development and build it for production.



## Full Stack Project

A CodeOnly Full-Stack project is an alternative to using a development build
server (eg: Vite, SnowPack etc...).

Rather than running a both a front-end build server and a back-end web server,
a CodeOnly full-stack project includes a NodeJS/ExpressJS server that does
both. 

This has some nice advantages, especially during development: 

* it serves NPM packages (including the CodeOnly NPM package) directly to 
  the browser without the need for building or bundling
* includes live-reload support - save your file and the browser updates
  immediately
* on Chromium based browsers it supports editing and saving files in the
  debugger
* since there's just one server there's no need for API request proxying 
  from the build server to the back-end server

For production:

* everything is built, bundled and tree-shaken for fast, efficient delivery
* project is configured and ready to run in Docker

Most of this is made possible with our related product [Bundle-free](https://github.com/codeonlyjs/bundle-free).

<div class="tip">

Even if you don't plan to use the full-stack project's web server during 
production, a full-stack project still provides an great development
environment and you can still bundle and deploy to a separate production
server later if necessary.

</div>

A full-stack project includes a front-end single page app client with entry
index.html file, a router, home page, header bar, and Stylish theme 
with light/dark mode support.


To generate a full stack project:

1. You'll need NodeJS to run the CLI tool - [get it here](https://nodejs.org/).
2. From a command prompt, enter the following command (replacing 
   "MyNewProject" with the name of your project):

    ```
    npx codeonlyjs/cogent new fullstack MyNewProject
    ```

This will create a new directory containing the new project files.

Included in the new project directory will be a readme.md file with information
about the project structure and instructions on how to run it during development and build it for production.



## Next Steps

* Learn more about [Components](component)
* Learn more about [Templates](template)
