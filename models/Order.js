const mongoose = require('mongoose');

// Order Item Schema to represent a product in the order
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product model
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }, // Price at the time of order
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    items: [orderItemSchema], // Array of products in the order
    totalAmount: { type: Number, required: true }, // Total amount for the order
    orderStatus: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    }, // Status of the order
    createdAt: { type: Date, default: Date.now }, // Date the order was placed
    updatedAt: { type: Date, default: Date.now }, // Date the order was last updated
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields
);

// Create the Order model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
