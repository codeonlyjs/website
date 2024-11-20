import path from 'node:path';
import url from 'node:url';
import express from 'express';
import { bundleFree } from '@codeonlyjs/bundle-free';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export let routes = express.Router();

// Prod or Dev?
if (process.env.NODE_ENV == "production")
{
    // Serve bundled client
    routes.use(bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: true,
        default: "landing.html"
    }));
}
else
{
    // Module handling
    routes.use(bundleFree({
        path: path.join(__dirname, "../client"),
        spa: true,
        default: "landing.html",
        modules: [ 
            "@codeonlyjs/core",
            "commonmark",
        ],
        replace: [
            { from: "./Landing/Main.js", to: "/Landing/Main.js" },
        ],
        livereload: true,
        inYaFace: true,
    }));
}

