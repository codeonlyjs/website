---
title: "Devlopment Server"
description: CodeOnly's development file server
---

# CodeOnly Development Server

`coserv` is a simple file server intended to be used primarily 
while developing single page apps, or statically generated sites.

In includes:

* Bundle-free - NPM package serving, support for SPA normal file paths
  and prominent in-browser error messages
* LiveReload - automatically refresh the browser when files changed
* Morgan Logging - console logging of requests


## Installation

Normally installation isn't required as it's included in the NPM packages
for CodeOnly generated projects that need it.  

eg: the CodeOnly SPA project uses `coserv` automatically when running
`npm run dev` or `npm run prod`

To manually install (use `--save` or `-g` as required)

```
npm install codeonlyjs/coserv
```

To run:

```
npx coserv
```

To run without installing

```
npx codeonlyjs/coserv
```



## Configuration

`coserv` requires a file named `coserv.config.js` in the current directory.

<div class="tip">

See the `<dir>` command line option to change the current directory at
start up

</div>

The config file should have a default export that defines the configuration
settings to use.


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
3. Either the `development` or `production` branches of the
   configuration (or other branch as specified by NODE_ENV)

<div class="tip">

To see the final merged configuration, use the `--show-config`
command line option.

</div>

## Default Configuration

The following shows the default configuration. You only need
to specify options in your configuration file that differ from
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

  - `options` - the options passed to `livereload.createServer`
  - `watch` - the array passed to `livereload.watch`

* `logging`: See [Morgan](https://www.npmjs.com/package/morgan)


The following `coserv` specific options are also supported:

* `port` - the port to use (can be overridden by `--port`)
* `host` - the host name to use (can be overridden by `--host`)



## Command Line Arguments

The following command line options are supported:

```
      --env:<env>      Set NODE_ENV (typically development|production)
      --dev            Shortcut for --env:development
      --prod           Shortcut for --env:production
  -p, --port:<port>    Set server port
      --host:<host>    Set server host
      --show-config    Log final configuration
  -v, --version        Show version info
  -h, --help           Show this help
      <dir>            Change current working directory
```



## Example Configuration

For a complete example configuration file, see the config 
file used for this site:

<https://github.com/codeonlyjs/website/blob/main/coserv.config.js>