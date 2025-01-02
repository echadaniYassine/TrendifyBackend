const mongoose = require('mongoose');
const Category = require("../models/Categories");
const CategoriesData = require("../data/ProductsData")
// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};
// Insert categories into the database
const insertCategories = async () => {
  try { 
    await connectDB();
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('Categories already exist in the database. Skipping insertion.');
      return;
    }
    await Category.insertMany(CategoriesData);
    console.log('Categories inserted successfully!');
  } catch (error) {
    console.error('Failed to insert categories:', error);
  }
};
insertCategories();
module.exports = connectDB;

