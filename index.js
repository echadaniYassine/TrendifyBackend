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
<<<<<<< HEAD
connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/api/Trendify', userRoutes);
app.use('/api/Trendify/Products', routerProduct);
app.use('/api/Trendify/Category', routerCategory);
app.use('/api/Trendify/Admin', routerAdmin);
app.use('/api/Trendify/orders', orderRoutes);
=======
mongoose.connect('mongodb+srv://echadaniyassine:yassine12301@cluster1.s91px.mongodb.net/Cluster1?retryWrites=true&w=majority&appName=Cluster1/auth-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });


app.use(express.json());
// Correct CORS configuration
app.use(cors({
  origin: ["https://my-react-app-six-jet.vercel.app"], // Your frontend's origin
  methods: ["GET", "POST", "PUT", "OPTIONS"], // Ensure OPTIONS is included for preflight
  credentials: true, // Allow credentials (cookies, tokens)
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
}));

>>>>>>> c1ca49056e855a8d2ce85626e5826022167a56b5


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
