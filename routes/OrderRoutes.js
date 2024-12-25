const express = require('express');
const Orderrouter = express.Router();
const orderController = require('../controllers/OrderController');

// Route to create a new order
Orderrouter.post('/createOrder', orderController.createOrder);

// Route to fetch all orders
Orderrouter.get('/getAllOrders', orderController.getAllOrders);

// Route to fetch an order by ID
Orderrouter.get('/getOrderById/:orderId', orderController.getOrderById);

// Route to update order status
Orderrouter.patch('/updateOrderStatus/:orderId/status', orderController.updateOrderStatus);

module.exports = Orderrouter;
