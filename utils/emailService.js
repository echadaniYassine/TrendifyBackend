const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL, // Your Gmail address from environment variable
        pass: process.env.EMAIL_PASSWORD, // Your App Password from environment variable
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Export the transporter
module.exports = transporter;