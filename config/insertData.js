const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Categories');
const ProductsData = require('../data/ProductsData'); // Correct path for Products data
const CategoriesData = require('../data/CategoriesData'); // Correct path for Categories data

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

const insertData = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Insert Categories
    const existingCategories = await Category.find();
    if (existingCategories.length === 0) {
      await Category.insertMany(CategoriesData);
      console.log('Categories inserted successfully!');
    } else {
      console.log('Categories already exist. Skipping insertion.');
    }

    // Insert Products
    const existingProducts = await Product.find();
    if (existingProducts.length === 0) {
      await Product.insertMany(ProductsData);
      console.log('Products inserted successfully!');
    } else {
      console.log('Products already exist. Skipping insertion.');
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Call the function only when this file is run directly
if (require.main === module) {
  insertData();
}

module.exports = insertData;
