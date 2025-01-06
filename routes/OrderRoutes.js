const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/OrderController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new order
orderRouter.post('/createOrder',authMiddleware, orderController.createOrder);

// Route to fetch all orders
orderRouter.get('/getAllOrders', orderController.getAllOrders);

// Route to fetch an order by ID
orderRouter.get('/getOrderById/:orderId', orderController.getOrderById);

// Route to update order status
orderRouter.patch('/updateOrderStatus/:orderId/status', orderController.updateOrderStatus);

orderRouter.get('/getUserOrders',authMiddleware, orderController.getUserOrders);


module.exports = orderRouter;
