import { randomInt } from 'node:crypto';
import express from 'express';
import { db, SQL } from "./db.js";
import { sessionLogout, sessionLogin } from "./session.js";
import { sendMail } from './email.js';
import { config } from "./config.js";

export let routes = express.Router();

async function loginOrRegister(req, res)
{
    let isRegister = req.path.endsWith("/register");

    // Find user
    let user = db.get(SQL.select("*")
                        .from("Users")
                        .where("email = ? COLLATE NOCASE", req.body.email)
                        );

    if (isRegister)
    {
        if (!user)
        {
            db.insert("Users", {
                email: req.body.email,
            });
            return res.json({ message: "Thanks, we'll be in touch!" });
        }
        if (!user.access)
            return res.json({ message: "Thanks, we haven't forgetten - we'll be in touch!" });
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

        return res.json({
            message: "We've emailed you a one-time password.",
        });
    }
    else
    {
        res.status(401).json({ 
            message: "Unknown User" 
        });
    }
}


routes.post("/login", loginOrRegister);
routes.post("/register", loginOrRegister);


routes.post("/otp", (req, res) => {

    let user = sessionLogin(res, req.body.email, req.body.otp);
    if (user == null)
    {
        return res.status(401).json({
            email: req.body.email,
            error: "Incorrect Password",
        });
    }
    else
    {
        return res.json({
            redirect: "/"
        })
    }
});

// Logout
routes.get("/logout", (req, res) => {

    if (req.cookies.session)
        sessionLogout(res, req.cookies.session);
    return res.json({
        redirect: "/"
    });
});

