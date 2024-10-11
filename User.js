// User.js (updated schema)
const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationCode: Number, // Store verification code as a number
  created_at: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("user", UserSchema);
