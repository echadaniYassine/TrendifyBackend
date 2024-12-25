// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  img: { type: String, required: true },
  subcategories: [String], // Array of subcategory names
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
