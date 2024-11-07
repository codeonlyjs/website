import path from 'node:path';
import url from 'node:url';
import express from 'express';
import { bundleFree } from '@codeonlyjs/bundle-free';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export let routes = express.Router();

// Prod or Dev?
if (process.env.NODE_ENV == "production")
{
    console.log("Running as production");

    // Serve bundled client
    routes.use(bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: true,
        default: "landing.html"
    }));
}
else
{
    console.log("Running as development");

    // Module handling
    routes.use(bundleFree({
        path: path.join(__dirname, "../client"),
        spa: true,
        default: "landing.html",
        modules: [ 
            "@codeonlyjs/core",
        ],
        replace: [
            { from: "./Landing/Main.js", to: "/Landing/Main.js" },
        ],
        livereload: true,
    }));
}

