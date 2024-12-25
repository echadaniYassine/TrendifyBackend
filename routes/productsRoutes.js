//Routes/authRoutes.js
const express = require('express');
const ProductController = require('../controllers/productController');

const routerProduct = express.Router();

routerProduct.get('/getAllProducts', ProductController.get);
routerProduct.get('/product/:id', ProductController.getById );
routerProduct.put('/updateProduct/:id', ProductController.put);
routerProduct.delete('/deleteProduct/:id', ProductController.delete);
routerProduct.patch('/patchProduct/:id', ProductController.patch);
routerProduct.post('/addProduct', ProductController.post);

module.exports = routerProduct;
