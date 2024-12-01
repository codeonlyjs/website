---
title: "Devlopment Server"
---

# CodeOnly Development Server

`coserv` is a simple file server intended to be used primarily 
while developing single page apps, or statically generated sites.

In includes Bundle-free and LiveReload.

## Configuration

To use `coserv`, create a file name `coserv.config.js` in the 
root directory of the project, with a default export that is the
configuration to use:

```js
const config = {
    port: 3000,
    development: {
        bundleFree: {
            // Bundle free options here
        },
        livereload: {
            options:
            {
                // Live reload options here
            }
            watch: 
            [
                // Folders to watch here
            ]
        }
    },
    production: {
        // Production options here (same as development)
    }
};

export default config;
```

The final configuration is determined by deeply merging:

1. `coserv`'s built-in default configuration
2. The root level from the configuration options
3. Either the `development` or `production` options

## Default Configuration

The following shows the default configuration and you only need
to specify options in your configuratino file that differ from
these:

```js
{
    port: 3000,
    host: null,
    development: 
    {
        logging: "dev",
        bundleFree: {
            path: ".",
            spa: true,
            node_modules: "./node_modules",
            inYaFace: true,
        },
        livereload: {
            options: {
            },
            watch: [
                ".",
            ]
        }
    },
    production: 
    {
        logging: "combined",
        bundleFree: {
            path: "./dist",
            spa: true,
        }
    }
}
```


## Settings

Most of the settings in the configuration file match exactly those
expected by the respective modules:

* `bundleFree`: See [Bundle-free](bundle-free)
* `livereload`: See [Live Reload](https://www.npmjs.com/package/livereload)
* `logging`: See [Morgan](https://www.npmjs.com/package/morgan)

The following options are also supported:

* `port` - the port to use
* `host` - the host name to use



## Command Line Arguments

Most settings are configured using the config file, but you can select
which configuration to use from the command line:

* `npx coserv development` - run in development mode
* `npx coserv production` - run production mode
* `npx coserv NODE_ENV=other` - run in some other mode

Note, if you have `coserv` installed as an NPM package in your project
(as configured by the default SPA project template) you can run
coserv with:

`npx coserv`

You can also run coserv without installing it using:

`npx codeonlyjs/coserv`



## Example Configuration

For a complete example configuration file, this is the config we use 
while developing this site:

<https://github.com/codeonlyjs/website/blob/main/coserv.config.js>