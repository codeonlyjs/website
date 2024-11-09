import path from 'node:path';
import url from 'node:url';
import express from 'express';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import logger from "morgan";
import { sessionMiddleware, sessionLogout } from './session.js';
import { routes as apiRoutes } from "./api.js";
import { routes as landingRoutes } from "./landing.js";
import { routes as mainSiteRoutes } from "./mainsite.js";

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

app.use((req, res, next) => {
    next();
});

// Logout
app.get("/logout", (req, res, next) => {
    sessionLogout(res);
    return res.redirect("/");
});

app.use(function (req, res, next) {
    if (!res.locals.session_user)
        return landingRoutes(req, res, next);
    else
        return mainSiteRoutes(req, res, next);
});

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


