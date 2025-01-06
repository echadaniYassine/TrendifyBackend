const Feedback = require('../models/Feedback');
const User = require('../models/TrendifyUserAuth'); // Assuming you have the User model

// Get feedback for a user
exports.getUserFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({ userId: req.userId });
    if (!feedback || feedback.length === 0) {
      return res.status(404).json({ message: 'No feedback found' });
    }

    res.json(feedback);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all feedbacks for a specific product
exports.getAllFeedback = async (req, res) => {
  const { productId } = req.params; // Use req.params for path params

  try {
    const feedbacks = await Feedback.find({ productId })
      .populate('userId', 'name email'); // Populate userId field with name and email
    res.json(feedbacks);
  } catch (err) {
    console.error("Error fetching feedbacks:", err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
};

// Submit feedback for a specific product
exports.submitFeedback = async (req, res) => {
  const { productId, text, rating } = req.body;
  const userId = req.userId; // Assuming the user is authenticated

  try {
    const newFeedback = new Feedback({
      productId,
      userId,
      text,
      rating,
      createdAt: Date.now(),
    });

    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};
