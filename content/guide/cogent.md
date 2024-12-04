---
title: "Code Generator"
description: "Using the Code Generator Tool to quickly scaffold projects and components"
---
# Cogent

Cogent, the "CodeOnly GENerator Tool" is used to quickly scaffold projects 
and components.

## Installation

Normally installation isn't required, just run using `npx`:

```
npx codeonlyjs/cogent ...
```

Also, it's automatically installed in all CodeOnly generated
projects, so in the project directory, just run

```
npx cogent ...
```

To manually install (use `--save` or `-g` as required)

```
npm install codeonlyjs/cogent
```

## Usage

`cogent` works by generating code using its built-in templates.

To get a list of available templates use the `list` command:

```
$ npx cogent list
component - Generates a new Component
fullstack - Generates a new full-stack project
page - Generates a new Component designed to be used as a page in an SPA
spa - Generates a new Single Page Application (SPA) project
```

To generate a template, use the `new` command, passing the name of the
template to use and the name of the project or item to generate:

```
$ npx codeonlyjs/cogent new spa MyApp
created: MyApp\config.js
created: MyApp\coserv.config.js
created: MyApp\favicon.svg
created: MyApp\Header.js
created: MyApp\HomePage.js
created: MyApp\index.html
created: MyApp\Main.js
created: MyApp\Meta.js
created: MyApp\NotFoundPage.js
created: MyApp\package.json
created: MyApp\readme.md
created: MyApp\vite.config.js
created: MyApp\public\logo.svg
Done
```

For the project templates (`fullstack` and `spa`) the project is
created in a sub-directory with the same name as the project. (ie:
in the above example, notice the files are written to the `./MyApp/`
sub-directory).

For the non-project templates, the files are written to the current
directory.

```
$ npx codeonlyjs/cogent new component SidePanel
created: SidePanel.js
Done
```