const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
  img: { type: String, required: true },
  subcategories: { type: [String], default: [] },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
