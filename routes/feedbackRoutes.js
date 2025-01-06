const express = require('express');
const { submitFeedback, getUserFeedback, getAllFeedback } = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware for verifying token

const router = express.Router();

// Route for submitting feedback
router.post('/submit-feedback', authMiddleware, submitFeedback);

// Route for getting feedback by user
router.get('/get-feedbacks-user', authMiddleware, getUserFeedback);

// Route for getting all feedback for a product
router.get('/get-all-feedbackes/:productId', authMiddleware, getAllFeedback); // Corrected to use path parameter :productId

module.exports = router;
