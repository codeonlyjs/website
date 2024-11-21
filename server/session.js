import { db, SQL } from "./db.js";
import { v4 as uuidv4 } from 'uuid';

let session_id_map = new Map();

// Get the user associated with a session
function getSessionUser(session_id)
{
    // Check if user already loaded
    let session_user = session_id_map.get(session_id);
    if (session_user !== undefined)
        return session_user;

    // Lookup database
    session_user = db.get(SQL.select("users.*").from("Sessions")
                            .leftJoin("users").on("sessions.user_id = users.id")
                            .where("sessions.id = ?", session_id));

    // Store 
    session_id_map.set(session_id, session_user);
    return session_user;
}

// Login a user
export function sessionLogin(res, email, otp)
{
    // Delete OTP codes older than 10 minutes
    db.run("DELETE FROM OTP WHERE created < ?", Date.now - 1000 * 60 * 10);

    // Find the user
    let user = db.get(SQL.select("users.*").from("OTP")
                .leftJoin("Users").on("otp.user_id == users.id")
                .where("users.email = ? and otp.otp = ?", email, otp));
    if (user == null)
        return null;

    // Delete the one time password
    db.delete("OTP", { user_id: user.id, otp: otp });

    // Allocate session id
    let session_id = uuidv4();

    // Store in cache
    session_id_map.set(session_id, user);

    // Create session
    db.insert("Sessions", {
        id: session_id,
        created: Date.now(),
        user_id: user.id,
    });

    // Store in cookie
    res.cookie("session", session_id, {
        httpOnly: true,
        sameSite: true,
        expires: new Date(Date.now() + (14 * (1000 * 60 * 60 * 24))),
        secure: process.env.NODE_ENV === 'production',
    });

    // Return session
    return user;
}

// Logout a user
export function sessionLogout(res, session_id)
{
    // Delete from cache
    session_id_map.delete(res.locals.session_id);

    db.delete("Sessions", { id: res.locals.session_id });

    // Delete cookie
    res.clearCookie("session");
}



// Middleware to get session user and store on response object
export function sessionMiddleware(req, res, next)
{
    let session_id = req.cookies.session;
    if (session_id)
    {
        res.locals.session_user = getSessionUser(session_id);
        res.locals.session_id = session_id;
        if (res.locals.session_user)
        {
            // Refresh cookie
            res.cookie("session", session_id, {
                httpOnly: true,
                sameSite: "Lax",
                expires: new Date(Date.now() + (14 * (1000 * 60 * 60 * 24))),
                secure: process.env.NODE_ENV === 'production',
            });
        }
    }
    next();
}

// Middleware to check logged in
export function sessionIsLoggedIn(req, res, next)
{
    if (!res.locals.session_user)
        res.redirect("/login");
    else
        next();
}

// Middleware to check logged in as admin
export function sessionIsAdmin(req, res, next)
{
    if (!res.locals.session_user)
        res.redirect("/login");
    if (!res.locals.session_user.admin)
        throw new HttpError(401, "Permission Denied");
    else
        next();
}

