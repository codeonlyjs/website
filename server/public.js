import { randomInt } from 'node:crypto';
import express from 'express';
import { db, SQL } from "./db.js";
import { sessionLogout, sessionLogin } from "./session.js";
import { sendMail } from './email.js';
import { config } from "./config.js";

export let routes = express.Router();

routes.get("/", (req, res, next) => {
    if (res.locals.session_user)
        return next();

    res.render("index");
});

routes.get("/login", (req, res) => {
    if (res.locals.session_user)
        return res.redirect("/");

    res.render("login");
});

async function loginOrRegister(req, res)
{
    let isRegister = req.path.endsWith("/register");

    // Find user
    let user = db.get(SQL.select("*")
                        .from("Users")
                        .where("email = ? COLLATE NOCASE", req.body.email)
                        );

    if (!user && isRegister)
    {
        db.insert("Users", {
            email: req.body.email,
        });
        res.render("/thanks");
        return;
    }
    
    if (user)
    {
        // Allocate a one time password
        let otp = "";
        for (let i=0; i<6; i++)
        {
            otp +=  String.fromCharCode('0'.charCodeAt(0) + randomInt(10));
        }

        console.log("OTP:", otp);

        // Store it
        db.insert("OTP", {
            user_id: user.id,
            created: Date.now(),
            otp: otp,
        });

        let info = await sendMail({
            from: config.server.emailSender,
            to: user.email,
            subject: `Your one-time password for ${config.siteName}`,
            text: `Your one-time password is ${otp}`,
            html: `
<p>Your one-time password is: <strong>${otp}</strong></p>
<p>This password will only work once and will expire in 10 minutes.</p>
            `,
        });


        // Prompt for OTP
        res.render("otp", {
            email: user.email,
        });
    }
    else
    {
        res.render("login", { error: "Unknown User" });
    }
}


routes.post("/login", loginOrRegister);
routes.post("/register", loginOrRegister);

routes.post("/otp", (req, res) => {

    let user = sessionLogin(res, req.body.email, req.body.otp);
    if (user == null)
    {
        // Prompt for OTP
        res.render("otp", {
            email: req.body.email,
            error: "Incorrect Password",
        });
        return 
    }

    // redirect
    res.redirect("/");
});

// Logout
routes.get("/logout", (req, res) => {

    if (req.cookies.session)
        sessionLogout(res, req.cookies.session);
    res.redirect("/");

});

