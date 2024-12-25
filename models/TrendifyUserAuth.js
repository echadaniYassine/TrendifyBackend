const mongoose = require("mongoose");

const TrendifyUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationCode: Number,
  isAdmin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrendifyUser ", TrendifyUserSchema);
