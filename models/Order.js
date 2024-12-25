const mongoose = require('mongoose');
const TrendifyUser  = require('./TrendifyUserAuth'); // Adjust the path accordingly
const Product = require("./Product")
// Order Item Schema to represent a product in the order
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrendifyUser ', required: true },
    username: { type: String, ref: 'TrendifyUser', required: true },  // Corrected to String
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;