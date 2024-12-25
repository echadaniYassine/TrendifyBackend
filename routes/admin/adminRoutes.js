//Routes/authRoutes.js
const express = require('express');
const adminState = require('../../admin/adminState');
const routerAdmin = express.Router();

routerAdmin.get('/stats', adminState.get);
routerAdmin.get('/getUsers',adminState.getAllUsers); // Get all users
routerAdmin.get('/getUser/:id',adminState.getUserById); // Get user by ID
routerAdmin.delete('/deleteUser/:id',adminState.deleteUser); // Delete user by ID
routerAdmin.put('/updateUser/:id',adminState.updateUser); // Update user by ID

module.exports = routerAdmin;
