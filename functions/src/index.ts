/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_PASSWORD'
    }
});

// HTTP function to send email with attachment
exports.sendEmail = functions.https.onRequest((req: { body: { to: any; pdfUrl: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    const mailOptions = {
        from: 'gokulsaran29@gmail.com ',
        to: req.body.to,
        subject: 'Email with Attachment',
        text: 'Here is your attachment.',
        attachments: [
            {
                filename: 'example.pdf',
                path: req.body.pdfUrl // URL of the PDF generated in Angular
            }
        ]
    };

    transporter.sendMail(mailOptions, (error: any, info: { response: string; }) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
