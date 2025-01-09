const express = require('express');
const userRoutes = require('./routes/TrendifyAuthRoutes');
const routerProduct = require('./routes/productsRoutes');
const routerCategory = require('./routes/CategoriesRoutes');
const routerAdmin = require('./routes/admin/adminRoutes');
const orderRouter = require('./routes/OrderRoutes');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require("./config/db");
const paymentRoutes = require('./routes/paymentRoutes');
const cookieParser = require('cookie-parser');
const feedbackRoutes = require('./routes/feedbackRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;

// Connect to MongoDB (use only one method)
connectDB();

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); // For parsing cookies

// Enable CORS (consider removing this if defined in `vercel.json`)
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow cookies and credentials
}));

// Define your routes
app.use('/api/Trendify', userRoutes);
app.use('/api/Trendify/Products', routerProduct);
app.use('/api/Trendify/Category', routerCategory);
app.use('/api/Trendify/Admin', routerAdmin);
app.use('/api/Trendify/orders', orderRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/Trendify/feedback', feedbackRoutes);

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
