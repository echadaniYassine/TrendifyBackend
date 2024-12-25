const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/TrendifyAuthRoutes');
const routerProduct = require('./routes/productsRoutes');
const routerCategory = require('./routes/CategoriesRoutes');
const routerAdmin = require('./routes/admin/adminRoutes');
const orderRoutes = require('./routes/OrderRoutes'); 
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const mongoose = require('mongoose'); // Required for Mongoose connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;
console.log('Server starting...');

// Connect to MongoDB (use only one method)
connectDB();

// CORS configuration
app.use(cors({
  origin: ["https://my-react-app-six-jet.vercel.app"], // Your frontend's origin
  methods: ["GET", "POST", "PUT", "OPTIONS"], 
  credentials: true, // Allow credentials (cookies, tokens)
  allowedHeaders: ["Content-Type", "Authorization"], 
}));

// Security middleware
app.use(helmet());
app.use(express.json());

// Define your routes
app.use('/api/Trendify', userRoutes);
app.use('/api/Trendify/Products', routerProduct);
app.use('/api/Trendify/Category', routerCategory);
app.use('/api/Trendify/Admin', routerAdmin);
app.use('/api/Trendify/orders', orderRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
