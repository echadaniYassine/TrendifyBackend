const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  categoryName: { type: String, required: true },
  subcategory: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  featured: { type: Boolean, default: false },
  soldOut: { type: Boolean, default: false }  

});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
