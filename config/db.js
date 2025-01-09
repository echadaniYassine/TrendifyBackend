const mongoose = require('mongoose');
const insertData = require('./insertData')
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
insertData();

module.exports = connectDB;
