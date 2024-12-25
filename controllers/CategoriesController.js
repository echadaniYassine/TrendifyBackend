const Category = require("../models/Categories"); // Import the Product model


  exports.get = async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();
    res.status(200).json(categories); // Send categories as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};