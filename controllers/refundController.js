const Refund = require('../models/Refund'); // Import your Refund model
const Order = require('../models/Order'); // Import your Order model

// Initiate a refund
exports.initiateRefund = async (req, res) => {
  const { orderId, refundAmount } = req.body;
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if refund amount is valid
    if (refundAmount > order.totalAmount) {
      return res.status(400).json({ message: 'Refund amount exceeds order total' });
    }

    // Create a new refund record
    const refund = new Refund({
      orderId,
      refundAmount,
      status: 'Pending', // Pending status by default
    });

    await refund.save();
    return res.status(201).json(refund);
  } catch (err) {
    console.error('Error initiating refund:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Process a refund (can include external API calls for payment processing)
exports.processRefund = async (req, res) => {
  const { refundId } = req.params;
  try {
    const refund = await Refund.findById(refundId);
    if (!refund) {
      return res.status(404).json({ message: 'Refund not found' });
    }

    // Simulate external refund processing logic (e.g., through a payment gateway)
    refund.status = 'Processed'; // Update status to processed
    await refund.save();

    return res.status(200).json(refund);
  } catch (err) {
    console.error('Error processing refund:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
