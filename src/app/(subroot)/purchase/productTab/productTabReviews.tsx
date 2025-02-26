import { useState, useEffect } from "react";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

  // Fetch Reviews
  useEffect(() => {
    fetch(`/api/reviews/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        calculateRatingMetrics(data);
      })
      .catch(console.error);
  }, [productId]);

  // Calculate average rating and rating distribution
  const calculateRatingMetrics = (reviewData) => {
    if (reviewData.length === 0) return;
    
    // Calculate average
    const sum = reviewData.reduce((total, review) => total + Number(review.rating), 0);
    const avg = sum / reviewData.length;
    setAverageRating(avg);
    
    // Calculate rating counts
    const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    reviewData.forEach(review => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    setRatingCounts(counts);
  };

  // Submit a Review
  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId, 
          userId: "U123", 
          username: "JohnDoe", 
          rating: Number(newReview.rating), 
          comment: newReview.comment 
        }),
      });

      if (res.ok) {
        const newRev = await res.json();
        const updatedReviews = [newRev, ...reviews];
        setReviews(updatedReviews);
        calculateRatingMetrics(updatedReviews);
        setNewReview({ rating: 5, comment: "" });
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Render stars for ratings
  const RatingStars = ({ rating, interactive = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none`}
            onClick={interactive ? () => setNewReview({ ...newReview, rating: star }) : undefined}
            disabled={!interactive}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill={star <= rating ? "#FFD700" : "none"} 
              viewBox="0 0 24 24" 
              stroke="#FFD700"
              strokeWidth={star <= rating ? "0" : "1.5"}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
              />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Render rating progress bars
  const RatingProgressBars = () => {
    const total = reviews.length;
    return (
      <div className="space-y-2 my-4">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center">
            <span className="w-8 text-sm text-gray-600">{rating} star</span>
            <div className="w-full mx-2 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full" 
                style={{width: `${total ? (ratingCounts[rating] / total) * 100 : 0}%`}}
              ></div>
            </div>
            <span className="w-8 text-sm text-gray-600 text-right">{ratingCounts[rating]}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Customer Reviews</h2>
      
      {/* Rating Summary */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap">
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</span>
              <span className="text-lg text-gray-600 ml-1">out of 5</span>
            </div>
            <div className="mt-1">
              <RatingStars rating={Math.round(averageRating)} />
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-grow max-w-md">
            <RatingProgressBars />
          </div>
        </div>
      </div>

      {/* Write a Review */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Write a Review</h3>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <RatingStars rating={newReview.rating} interactive={true} />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Review</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Share your experience with this product..."
            rows="4"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          ></textarea>
        </div>
        
        <button 
          onClick={handleSubmitReview} 
          disabled={isSubmitting || !newReview.comment.trim()} 
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isSubmitting || !newReview.comment.trim() 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-2">No reviews yet.</p>
            <p className="text-gray-600 font-medium">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r._id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <RatingStars rating={r.rating} />
                  <span className="ml-2 text-gray-700 font-medium">{r.username}</span>
                </div>
                <p className="text-gray-800 mb-2">{r.comment}</p>
                <p className="text-gray-500 text-sm">{formatDate(r.date)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;