const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Ensure the secret key is used
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables from .env file

// Create a payment intent
const createPaymentIntent = async (req, res) => {
    try {
      const { amount } = req.body; // Amount in cents (e.g., 5000 = $50.00)
  
      if (!amount) {
        return res.status(400).send({ error: "Amount is required" });
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',  // Set your desired currency
        payment_method_types: ['card'],
      });
  
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error.message);
      res.status(500).send({ error: error.message });
    }
  };

// Confirm and capture payment (Stripe handles most of it automatically)
const capturePayment = async (req, res) => {
  try {
    const { paymentMethodId, paymentIntentId } = req.body;

    if (!paymentIntentId && !paymentMethodId) {
      return res.status(400).send({ error: "Payment Intent ID or Payment Method ID is required" });
    }

    // Confirm the payment
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId || "", {
      payment_method: paymentMethodId,
    });

    if (paymentIntent.status === "succeeded") {
      return res.status(200).send({
        success: true,
        paymentIntent: paymentIntent,
      });
    } else {
      return res.status(400).send({
        error: "Payment not successful. Status: " + paymentIntent.status,
      });
    }
  } catch (error) {
    console.error("Error capturing payment:", error.message);
    res.status(500).send({ error: error.message });
  }
};

// Export the functions
module.exports = {
  createPaymentIntent,
  capturePayment,
};
