import path from 'node:path';
import url from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { bundleFree } from '@codeonlyjs/bundle-free';
import moe from '@toptensoftware/moe-js';
import livereload from 'livereload';
import logger from "morgan";
import { convert_toc } from './convert_toc.js';
import { sessionMiddleware, sessionIsLoggedIn } from './session.js';
import { config } from "./config.js";
import { routes as publicRoutes } from "./public.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Setup app
let app = express(); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware);
app.engine('moe', moe.express(app));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'moe');
app.use((req,res,next) =>  {
    res.locals.config = config;
    next();
});

// Enable logging
if (app.get('env') === 'production')
    app.use(logger('combined'));
else
    app.use(logger('dev', { stream: { write: (m) => console.log(m.trimEnd()) } } ));

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

// Public routes
app.use(publicRoutes);

// Everything from here on requires logged in user
app.use(sessionIsLoggedIn);

// Serve static content files
app.use("/content", express.static(path.join(__dirname, "../content")));

// Generate TOCs from .txt to .json
app.get(/^\/content\/(?:(.*)\/)?toc$/, async (req, res) => {
    let pathname = req.params[0] ? req.params[0] + "/" : "";
    let toc = await convert_toc(path.join(__dirname, `../content/${pathname}toc.txt`));
    res.json(toc);
});

// 404 anything other /content requests
app.use("/content/*", (req, res, next) => {
    let err = new Error(`Not Found - ${req.url}`);
    err.status = 404;
    next(err);
});

// Prod or Dev?
if (process.env.NODE_ENV == "production")
{
    console.log("Running as production");

    // Serve bundled client
    app.use(bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: true
    }));
}
else
{
    console.log("Running as development");

    // Module handling
    app.use(bundleFree({
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
        extraExts: "page",
    });
    lrs.watch([
        path.join(__dirname, "../client"),
        path.join(__dirname, "../content"),
    ]);
}

// Not found
app.use((req, res, next) => {
    let err = new Error(`Not Found - ${req.url}`);
    err.status = 404;
    next(err);
});

// Start server
let server = app.listen(3000, null, function () {
    console.log(`Server running on [${server.address().address}]:${server.address().port} (${server.address().family})`);
});


