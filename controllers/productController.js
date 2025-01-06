const Product = require("../models/Product"); // Import the Product model
const mongoose = require("mongoose");

exports.get = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from MongoDB
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message || error });
  }
};

exports.getById = async (req, res) => {
  const { id } = req.params; // Extract the product ID from the URL

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const product = await Product.findById(id); // Find the product by _id
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error: error.message });
  }
};

exports.post = async (req, res) => {
  const { categoryName, subcategory, name, price, img, description, featured } = req.body;

  try {
    // Create a new product
    const newProduct = new Product({
      categoryName,
      subcategory,
      name,
      price,
      img,
      description,
      featured,
    });

    // Save the new product to the database
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

exports.put = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  const updatedData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true }); // Use _id
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const result = await Product.findByIdAndDelete(id); // Use _id
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
};

exports.patch = async (req, res) => {
  const { id } = req.params;

  // Check if the id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    const product = await Product.findByIdAndUpdate(
      id, // Use _id
      { soldOut: true }, // Set soldOut to true
      { new: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product); // Return the updated product
  } catch (error) {
    console.error("Error:", error); // Log the full error object
    res.status(500).json({ message: "Failed to mark product as sold out", error: error.message });
  }
};
