const User = require('../models/TrendifyUserAuth');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../services/jwtService');
const jwt = require('jsonwebtoken'); // Add this line
const crypto = require('crypto');
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

exports.register = async (req, res) => {
  try {
    const { username, email, phoneNumber, password } = req.body;
    const userExists = await User.findOne({ email, phoneNumber });
    if (userExists) {
      return res.status(400).json({ message: 'User  already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({ username, email, phoneNumber, password: hashedPassword });

    await newUser .save();
    const token = generateToken(newUser ._id);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error registering user:', error); // Log the error
    res.status(500).json({ error: 'Internal server error', details: error.message }); // Include error details
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
    if (!isPasswordValid) {
      console.log('Password comparison failed for user:', email);
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    console.log('Generated Token:', token); // Debug: Ensure token is generated correctly

    // Respond with token
    return res.status(200).json({
      message: 'Login successful, have fun!',
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error); // Debug: Catch any errors in the process
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getUserInfo = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId, 'username email phoneNumber recoveryEmail recoveryPhoneNumber profilePhoto');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: user.password
      
    });
  } catch (error) {
    console.error('Error fetching user information:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




exports.modifyUser = async (req, res) => {
  const {
    username,
    email,
    phoneNumber,
    password
  } = req.body;

  try {
    // Find the user by either email or phone number
    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if they are provided
    if (username) user.username = username;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    // If password is provided, hash it and update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save updated user data
    await user.save();
    return res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error modifying user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Forgot Password Route
exports.forgotPassword = async (req, res) => {
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

      console.log('Generated token:', resetToken);

      // Mail options for Nodemailer
      const mailOptions = {
          from: process.env.EMAIL, // Use environment variable for sender's email
          to: email,
          subject: 'Password Reset Verification Code',
          text: `Dear User,\n\nYou have requested to reset your password. Here is your verification code: ${verificationCode}\n\n` +
              `Your reset token is: ${resetToken}\n\n` +
              `If you did not request this change, please ignore this email.\n\nBest regards,\nThe Support Team`,
      };

      // Send the email
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);

      return res.json({ message: 'Verification code sent successfully.', token: resetToken });

  } catch (error) {
      console.error('Error in forgot password process:', error);
      return res.status(500).json({ message: 'Error in forgot password process.', error: error.message });
  }
};

// Reset Password Route
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword, verificationCode } = req.body;
  console.log("Token received:", token);  // Debugging line


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
};