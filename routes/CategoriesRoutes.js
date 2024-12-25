//Routes/authRoutes.js
const express = require('express');
const CategoryController = require('../controllers/CategoriesController');

const routerCategory = express.Router();

routerCategory.get('/getCategories', CategoryController.get);

module.exports = routerCategory;
