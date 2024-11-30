---
title: "Static Site Generation (SSG)"
---

# Static Site Generation

Static Site Generation (SSG) is very similar to server side rendering
except the entire site is pre-rendered up-front instead of on a request
by request basis.

Many of the terms and concepts used in server-side rendering also apply
to static site generation - so please read about 
[server-side rendering](renderSSR) before continuing.



## Developing the Site

Unlike most other static site generators that use a series of file 
structure conventions and command line tools to generate the site, 
with CodeOnly you develop your site just like a regular CodeOnly 
single page app.

You create components, pages and setup
a router to handle navigation between those pages.  You then run, 
test and debug the site just like any other single page app.

Once your site is ready for deployment, the `generateStatic` function
can be used to render the entire site.  Alternatively, you can 
use CodeOnly's static site generator plugin for Vite to render the site 
automatically as part of the build process.



## The `generateStatic` Function

Static site generation is implemented by the function `generateStatic`.

```js
import { generateStatic } from "@codeonlyjs/core";

// Generate static site
await generateStatic({
    // Options here
});
```

The available options are:

* `entryFile` - same as for SSG
* `entryMain` - same as for SSG
* `entryHtml` - same as for SSG, but as a filename (not a HTML string)
* `entryUrls` - the internal URLs of the site to render
* `ext` - a file extension to append to all generated pages
* `pretty` - `true` for prettified HTML output
* `outDir` - base output directory where generated files will be written
* `baseUrl` - base URL used to construct URL objects passed to the router
* `verbose` - display more output
* `cssUrl` - path to CSS file to contain collected `css` styles

All of the options are optional, with the following defaults:

```js
options = {
    entryFile: [ "main-ssg.js", "main-ssr.js", "Main.js", ],
    entryMain: [ "main-ssg", "main-ssr", "main" ],
    entryHtml: [ "dist/index.html", "index-ssg.html", "index.ssr.html", "index.html" ],
    entryUrls: [ "/" ],
    ext: ".html",
    pretty: true,
    outDir: "./dist",
    baseUrl: "http://localhost/",
    verbose: false,
    cssUrl: "/assets/styles-[unique].css",
}
```

Note: 

* The `entryFile`, `entryMain` and `entryHtml` options can be an array where the
  first that exists will be used.
* The `entryUrls` property is an array but you only need list the entry point 
  URLs - any linked pages will be recursively rendered.  If you have content 
  that needs to be rendered but isn't linked from else where in the site, 
  list them here.
* The `baseUrl` is used to construct the URL objects passed to the router.  If 
  your site uses the full URL to construct links or display messages, this should
  be set to the final public URL where the site will be hosted.
* The `cssUrl` is the path where all collected `css` declarations will be written.
  The `[unique]` placeholder will be filled in with a hash value unique to build.



## Vite Plugin

CodeOnly includes a Vite plugin that can be used to automatically render the site
after the main `index.html` and scripts are bundled.

The following is an example `vite.config.js` file that shows how it's used (in
fact this is the Vite config we use to build this site).  

* The third-party plugin `viteStaticCopy` is used to copy other static 
  resources to the output folder.
* The options passed to `viteStaticGenerate` are the same as above.
* The `outDir` setting doesn't need to be specified as the plugin picks 
  this up from the Vite build configuration.
* The `prebuild` option is an optional script file that will be `import`ed
  at the start of the build.  It can be used to pre-process data before the
  build runs.  eg: build a JSON meta data file for a static blog, or in this 
  case we use it to generate the table of contents file for the documentation.


```js
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteStaticGenerate } from "@codeonlyjs/core";

// Vite config
export default defineConfig({
  base: "/",
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: './dist',
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'public/*', dest: './public/' },
        { src: 'content/*', dest: './content/' },
      ],
    }),
    viteStaticGenerate({
      prebuild: "./prebuild.js",
      entryFile: "./main-ssr.js",
      entryMain: "main",
      entryHtml: "./dist/index.html",
      entryUrls: [ "/" ],
      pretty: true,
    }),
  ]
})
```


## Static Site or SPA?

When using static site generation there's two ways the final
application can be delivered:

* A fully static, HTML only site
* A statically served, single page application

To understand these two approaches, let's consider a simple
statically generated blog site where the blog posts are
written as markdown files with "front-matter" describing
meta data about the page.  This is a fairly common approach
with SSG.

In order to build the static site, we need to enumerate all the
files, extracting the front matter which we'll use to render
the various parts of the site.

Once the site is generated this however, there's the question of 
whether the scripts are still needed client side?  ie: Are the 
scripts used for interactivity, or are they purely being used
as a way to generate the HTML content?

This is where there are two main choices:

1. One approach is to just deploy the generated HTML as a fully static
   site where navigation between pages is normal browser page request
   navigation.

2. A second approach is for the site to remain a single page app with a
   client side router. and navigation makes `fetch` requests for the markdown 
   of any pages visited and updates the DOM directly.

There are pros and cons to both:

* Single page app navigation is typically faster and can better maintain
  the state of surrounding content like a scrollable table of contents.
* Single page apps generally place less load on the server.
* SSR and SSG single page apps can be more difficult to maintain as the
  code and any libraries used need to work on both client and server.
* Both approaches are easy to deploy only requiring a simple file server.
* Both approaches can deliver good search engine indexing, SEO and social
  media meta information.
  
To deliver as a single page app, there's nothing further to do - the approach
described above works this way as is.

To deliver as straight HTML without the CodeOnly scripts all that's required
is to remove the startup code from the `index.html` file that's used as the
`entryHtml` file.

For example, create an `index-dev.html` that used during development and 
runs the site as a single page app:

`index-dev.html`

```html
<html>
<body>
    <!-- This is where the Main component will be mounted --> 
    <div id="main"></div>
    
    <script type="module">  
        // Call "main" method to mount the component
        import { main } from "/main.js";
        main();
    </script>
</body>
</html>
```

When generating the site, use a copy of the file with the startup
script removed:

`index.html`

```html
<html>
<body>
    <!-- This is where the Main component will be mounted --> 
    <div id="main"></div>
</body>
</html>
```

This works because with SSG, the entry point script file and function
name is passed to the `generateStatic` function directly and the 
`index.html` is just a template into which the rendered content is
injected.


## Deployment

There are may ways to deploy a statically generated site and any
simple file server should be able to handle the requirements, but 
might require some minimal configuration:

1. The server needs to serve `index.html` as the default file
   for a directory.
2. The server needs to be able to append `.html` to URL requests
   that don't include and extension.

For example, if you're using nginx, you'll need a configuration
that includes a section like this:

```txt
    location / {
        index index.html;
        try_files $uri $uri/ $uri.html =404;
    }
```

## Deploying to GitHub Pages

A popular and easy way to deploy a static site is with 
[GitHub Pages](https://docs.github.com/en/pages), using
[GitHub Actions](https://docs.github.com/en/actions) to publish the site.

To help get you started, here's a publish action that builds
the site and publishes it to GitHub pages each time a push is made.

`.github/workflows/publish.yml`

```yaml
name: Publish Site

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org/
      - run: npm ci
      - run: npm run build

      - name: Upload static files as artifact
        id: deployment
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  # Deployment job
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write 
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```