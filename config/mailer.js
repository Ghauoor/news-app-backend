import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a transporter using Mailtrap's SMTP settings
const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

// Function to send mail
export const sendMail = async (toMail, subject, body) => {
    try {
        const info = await transporter.sendMail({
            from: `"Sender Name" <${process.env.FROM_EMAIL}>`, // sender address
            to: toMail, // list of receivers
            subject: subject, // Subject line
            html: body, // HTML body content
        });
        console.log('Email sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

