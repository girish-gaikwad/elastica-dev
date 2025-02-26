import mongoose from 'mongoose';

const RatingSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    ref: 'Product' // Reference to the product model
  },
  userId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5  // Maximum rating value
  },
  review: {
    type: String,
    trim: true // Removes extra spaces
  },
  createdAt: {
    type: Date,
    default: Date.now // Auto-assign current timestamp
  }
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', RatingSchema);
export default Rating;
