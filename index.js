const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./User');
const crypto = require('crypto')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT_ONE || 4002;

console.log('Server starting...');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/auth-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });


app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'yassinechadani113@gmail.com', // Your Gmail address
    pass: 'thurwsxohxrpsrjx', // Your App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});



const JWT_SECRET = process.env.JWT_SECRET;


app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({
      message: "Login successful, have fun!",
      token: token
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/auth/modify', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.username = username;
    user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();
    return res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error modifying user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password Route
app.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a random verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Generate a secure token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Set the verification code and expiration time in the user document
    user.verificationCode = verificationCode;
    user.resetPasswordToken = resetToken; // Use crypto for generating the token
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save(); // Save changes to the database

    // Mail options for Nodemailer
    const mailOptions = {
      from: process.env.EMAIL, // Use environment variable
      to: email,
      subject: 'Password Reset Verification Code',
      text: `Dear User,\n\nYou have requested to reset your password. Here is your verification code: ${verificationCode}\n\n` +
            `Your reset token is: ${user.resetPasswordToken}\n\n` +
            `If you did not request this change, please ignore this email.\n\nBest regards,\nThe Support Team`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return res.json({ message: 'Verification code sent successfully.' });

  } catch (error) {
    console.error('Error in forgot password process:', error);
    return res.status(500).json({ message: 'Error in forgot password process.', error: error.message });
  }
});

// Reset Password Route
app.post('/auth/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword, verificationCode } = req.body;

  try {
    // Find the user by the reset token and check if the token is still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token hasn't expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Check if the provided verification code matches the one stored in the user's document
    if (user.verificationCode !== Number(verificationCode)) { // Convert verificationCode to number
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset token, expiration, and verification code
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.verificationCode = undefined;

    // Save the updated user document
    await user.save();
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/auth/user-info/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email }, 'username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    console.error('Error fetching user information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});