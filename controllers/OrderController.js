const Order = require('../models/Order');
const Product = require('../models/Product'); // Assuming you have the Product model
const User = require('../models/TrendifyUserAuth'); // Assuming you have the User model
const jwt = require('jsonwebtoken'); // Add this line to import the jsonwebtoken library
const mongoose = require("mongoose")
// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    console.log('Received userId:', userId);
    console.log('Items array received:', items);
    console.log('Shipping address received:', shippingAddress);

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate productIds
    const productIds = items.map(item => new mongoose.Types.ObjectId(item.productId)); // Ensure valid ObjectId
    console.log('Valid productIds:', productIds);

    // Fetch products
    const products = await Product.find({ _id: { $in: productIds } });
    console.log('Products found in database:', products);

    if (products.length !== items.length) {
      return res.status(404).json({ message: 'Some products not found' });
    }

    // Check if any product is sold out
    for (const product of products) {
      const item = items.find(i => i.productId === product._id.toString());
      if (product.soldOut || product.quantity < item.quantity) {
        return res.status(400).json({ message: `${product.name} is sold out or insufficient stock` });
      }
    }

    // Create the order
    const newOrder = new Order({
      userId,
      items,
      shippingAddress,
      totalAmount: items.reduce((acc, item) => {
        const product = products.find(p => p._id.toString() === item.productId);
        return acc + product.price * item.quantity;
      }, 0),
      orderStatus: 'Pending',
      createdAt: new Date(),
    });

    // Save the order
    const savedOrder = await newOrder.save();
    console.log('Order created successfully:', savedOrder);

    // Update user with the new order (this part updates the orders array in the TrendifyUser document)
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id } // Push the saved order ID to the user's orders array
    });

    // Update product stock (if needed)
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Respond with the created order
    res.status(200).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




// Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').populate('items.productId', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fetch a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('userId', 'name email').populate('items.productId', 'name price');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body; // New status (e.g., 'Shipped', 'Delivered')

    if (!['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    ).populate('userId', 'name email').populate('items.productId', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Verify the token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user and populate their orders
    const populatedUser = await User.findById(userId).populate({
      path: 'orders',
      populate: {
        path: 'items.productId',
        select: 'name price description', // Select the fields you want to return
      },
    });

    // Check if the user has any orders
    if (!populatedUser || !populatedUser.orders || populatedUser.orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    // Return the user's orders
    res.status(200).json({ success: true, orders: populatedUser.orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    // Check if the error is related to token verification
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};