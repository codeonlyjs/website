import path from 'node:path';
import url from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import logger from "morgan";
import { bundleFree } from '@codeonlyjs/bundle-free';
import livereload from 'livereload';
import { sessionMiddleware, sessionLogout } from './session.js';
import { routes as apiRoutes } from "./api.js";
import { routes as contentRoutes } from "./content.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Setup app
let app = express(); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware);

// Enable logging
if (app.get('env') === 'production')
    app.use(logger('combined'));
else
    app.use(logger('dev', { stream: { write: (m) => console.log(m.trimEnd()) } } ));

// Static files
app.use("/", express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", apiRoutes);
app.use("/content", contentRoutes);

app.use((req, res, next) => {
    next();
});

// Logout
app.get("/logout", (req, res, next) => {
    sessionLogout(res);
    return res.redirect("/");
});

function resolveDefault(req, res)
{
    if (res.locals.session_user)
        return "index.html";
    else
        return "landing.html";
}


// Prod or Dev?
if (process.env.NODE_ENV == "production")
{
    console.log("Running as production");

    // Serve bundled client
    app.use(bundleFree({
        path: path.join(__dirname, "../client/dist"),
        spa: true,
        default: resolveDefault,
        node_modules: path.join(__dirname, "../node_modules"),
    }));
}
else
{
    console.log("Running as development");

    // Module handling
    app.use(bundleFree({
        path: path.join(__dirname, "../client"),
        spa: true,
        default: resolveDefault,
        node_modules: path.join(__dirname, "../node_modules"),
        modules: [ 
            "@codeonlyjs/core",
            "commonmark",
        ],
        replace: [
            { from: "./Main.js", to: "/Main.js" },
        ],
        livereload: true,
        inYaFace: true,
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


