import nodemailer from "nodemailer";
import { config } from "./config.js";

let transporter;
if (config.server.smpt)
  transporter = nodemailer.createTransport(config.server.smpt);

export function sendMail(email)
{
  if (transporter)
  {
    return transporter.sendMail(email);
  }
  else
  {
    console.error("Warning: sending email disabled");
    return false;
  }
}

/*

async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'Brad Robinson <brad@toptensoftware.com>',
      to: "toptenbrad@gmail.com",
      subject: "Testing 2",
      text: "Testing 2",
      html: "<h1>Testing 2</h1>",
    });
  
    console.log("Message sent: %s", info.messageId);
  }
  
  main().catch(console.error);

*/