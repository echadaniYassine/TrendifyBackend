const paypal = require("paypal-rest-sdk");

// Configure PayPal SDK
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // 'sandbox' for testing, 'live' for production/
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET,
});

// Create a PayPal payment (order)
function createOrder(req, res) {
  const { amount } = req.body;

  if (!amount) {
    return res.status(400).send({ error: "Amount is required" });
  }

  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    transactions: [
      {
        amount: {
          total: amount.toFixed(2), // Ensure amount is in proper decimal format (e.g., "50.00")
          currency: "USD",
        },
        description: "Payment for your order",
      },
    ],
    redirect_urls: {
      return_url: `${process.env.PAYPAL_RETURN_URL}/api/payments/paypal-success`, // Your success URL
      cancel_url: `${process.env.PAYPAL_CANCEL_URL}/api/payments/paypal-cancel`, // Your cancel URL
    },
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("Error creating PayPal order:", error);
      res.status(500).send({ error: error.response });
    } else {
      const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
      if (approvalUrl) {
        res.status(200).send({ approvalUrl: approvalUrl.href });
      } else {
        res.status(500).send({ error: "Approval URL not found" });
      }
    }
  });
}

// Capture PayPal payment
function captureOrder(req, res) {
  const { paymentID, payerID } = req.body;

  if (!paymentID || !payerID) {
    return res.status(400).send({ error: "Payment ID and Payer ID are required" });
  }

  const execute_payment_json = {
    payer_id: payerID,
  };

  paypal.payment.execute(paymentID, execute_payment_json, (error, payment) => {
    if (error) {
      console.error("Error capturing PayPal payment:", error.response);
      res.status(500).send({ error: error.response });
    } else {
      res.status(200).send({
        success: true,
        paymentDetails: payment,
      });
    }
  });
}

// Export the PayPal functions
module.exports = {
  createOrder,
  captureOrder,
};
