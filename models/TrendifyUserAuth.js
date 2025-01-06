const mongoose = require("mongoose");

const TrendifyUserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  shippingAddresses: [
    {
      addressLine1: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
  ],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Reference orders by ID
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verificationCode: Number,
  isAdmin: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrendifyUser", TrendifyUserSchema); // Remove the extra space in the model name
