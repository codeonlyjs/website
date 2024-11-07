import path from 'node:path';
import url from 'node:url';
import express from 'express';
import { bundleFree } from '@codeonlyjs/bundle-free';
import livereload from 'livereload';
import { convert_toc } from './convert_toc.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export let routes = express.Router();

// Serve static content files
routes.use("/content", express.static(path.join(__dirname, "../content")));

// Generate TOCs from .txt to .json
routes.get(/^\/content\/(?:(.*)\/)?toc$/, async (req, res) => {
    let pathname = req.params[0] ? req.params[0] + "/" : "";
    let toc = await convert_toc(path.join(__dirname, `../content/${pathname}toc.txt`));
    res.json(toc);
});

// 404 anything other /content requests
routes.use("/content/*", (req, res, next) => {
    let err = new Error(`Not Found - ${req.url}`);
    err.status = 404;
    next(err);
});

// Prod or Dev?
if (process.env.NODE_ENV == "production")
{
    console.log("Running as production");

    // Serve bundled client
    routes.use(bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: true
    }));
}
else
{
    console.log("Running as development");

    // Module handling
    routes.use(bundleFree({
        path: path.join(__dirname, "../client"),
        spa: true,
        modules: [ 
            "@codeonlyjs/core",
            "commonmark",
        ],
        replace: [
            { from: "./Main.js", to: "/Main.js" },
        ],
        livereload: true,
    }));

    // Live reload
    let lrs = livereload.createServer({
        extraExts: "md",
    });
    lrs.watch([
        path.join(__dirname, "../client"),
        path.join(__dirname, "../content"),
    ]);
}

