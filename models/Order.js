const mongoose = require('mongoose');

// Order Item Schema to represent a product in the order
const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Ensure 'Product' matches your Product model name
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number },
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TrendifyUser', required: true }, // Reference TrendifyUser
    items: [orderItemSchema], // Embed array of order items
    totalAmount: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    shippingAddresses: [
      {
        addressLine1: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
