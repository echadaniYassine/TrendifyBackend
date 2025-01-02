const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'yassinechadani113@gmail.com', // Your Gmail address
        pass: 'mqimunubsdwzwbmw', // Your App Password
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Test email sending
transporter.verify((error, success) => {
    if (error) {
        console.error('Error in SMTP configuration:', error);
    } else {
        console.log('SMTP configuration is working:', success);
    }
});

