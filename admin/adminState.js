const Product = require('../models/Product'); // Assuming you have a Product model
const User = require('../models/TrendifyUserAuth');
const Order = require("../models/Order")

exports.get = async (req, res) => {
  try {
    // Fetch total number of products
    const totalProducts = await Product.countDocuments();

    // Fetch total number of users
    const totalUsers = await User.countDocuments();

    // Fetch total number of orders
    const totalOrders = await Order.countDocuments();

    // Fetch total revenue from orders
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Return the stats as a JSON response
    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      revenue,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
  };

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users
      res.json(users); // Send the list of users as a JSON response
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };
  exports.getUserById = async (req, res) => {
    const { id } = req.params; // Extract the userId from the route parameter
    try {
      const user = await User.findById(id); // Fetch user by ID
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); // Return the user data
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  };
  exports.deleteUser = async (req, res) => {
    const { id } = req.params; // Extract the userId from the route parameter
    try {
      const user = await User.findByIdAndDelete(id); // Delete user by ID
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };
  exports.updateUser = async (req, res) => {
    const { id } = req.params; // Extract the userId from the route parameter
    const updatedData = req.body; // Get the updated data from the request body
  
    try {
      const user = await User.findByIdAndUpdate(id, updatedData, { new: true }); // Update the user and return the updated user
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); // Return the updated user data
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  };
        