const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/TrendifyAuthRoutes');
const routerProduct = require('./routes/productsRoutes');
const routerCategory = require('./routes/CategoriesRoutes');
const routerAdmin = require('./routes/admin/adminRoutes');
const orderRoutes = require('./routes/OrderRoutes'); // Path to your routes file

const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB =require("./config/db")
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4002;
console.log('Server starting...');

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});