import path from 'node:path';
import url from 'node:url';
import express from 'express';
import { convert_toc } from './convert_toc.js';
import { sessionIsLoggedIn } from './session.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export let routes = express.Router();

// Check logged in
routes.use(sessionIsLoggedIn);

// Serve static content files
routes.use("/", express.static(path.join(__dirname, "../content")));

// Generate TOCs from .txt to .json
let tocMap = new Map();
routes.get(/^\/(?:(.*)\/)?toc$/, async (req, res) => {

    // Get path
    let pathname = req.params[0] ? req.params[0] + "/" : "";

    // Check cache
    let toc = tocMap.get(pathname);
    if (!toc)
    {
        // Create it
        toc = await convert_toc(path.join(__dirname, `../content/${pathname}toc.txt`));

        // Only cache in production
        if (process.env.NODE_ENV == "production")
            tocMap.set(pathname, toc);
    }

    // Send it
    res.json(toc);
});

// 404 anything other /content requests
routes.use("/*", (req, res, next) => {
    let err = new Error(`Not Found - ${req.url}`);
    err.status = 404;
    next(err);
});


