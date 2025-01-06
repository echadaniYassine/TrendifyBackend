const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categoryName: { type: String, required: true }, // Use String instead of ObjectId for simplicity
  subcategory: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  featured: { type: Boolean, default: false },
  soldOut: { type: Boolean, default: false },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
