const Order = require('../models/Order');
const Product = require('../models/Product'); // Assuming you have the Product model
const User = require('../models/TrendifyUserAuth'); // Assuming you have the User model

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body; // userId and items (array of products) should be in the request body

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch product details to calculate totalAmount
    const products = await Product.find({ _id: { $in: items.map(item => item.productId) } });
    if (products.length !== items.length) {
      return res.status(404).json({ message: 'Some products not found' });
    }

    // Add price to each item based on the product details
    const itemsWithPrice = items.map(item => {
      const product = products.find(p => p._id.toString() === item.productId.toString());
      if (product) {
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price // Add price from the product details
        };
      }
      return item; // Fallback, though this shouldn't happen if products are correctly matched
    });

    // Calculate total amount
    const totalAmount = itemsWithPrice.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    // Create new order
    const newOrder = new Order({
      userId,
      items: itemsWithPrice, // Use items with prices
      totalAmount,
      orderStatus: 'Pending',
    });

    // Save the new order
    await newOrder.save();
    
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId','username email').populate('items.productId', 'name price');
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
