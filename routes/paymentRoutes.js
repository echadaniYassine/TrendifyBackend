const express = require("express");
const router = express.Router();
const stripeController = require("../services/StripePayment");
const paypalController = require("../services/PayPalPayment");

// Stripe Payment Routes
router.post("/stripe/create-payment-intent", stripeController.createPaymentIntent);
router.post("/stripe/capture-payment", stripeController.capturePayment);

// PayPal Payment Routes
router.post("/paypal/create-order", paypalController.createOrder);
router.post("/paypal/capture-order", paypalController.captureOrder);

module.exports = router;
