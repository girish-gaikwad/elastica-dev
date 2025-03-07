import { formatDate, getReviews, submitReview } from "@/lib/reviewQuestionUtils";
import { useEffect, useState } from "react";

const ReviewSection = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState({1: 0, 2: 0, 3: 0, 4: 0, 5: 0});

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsData = await getReviews(productId);
      setReviews(reviewsData);
      calculateRatingMetrics(reviewsData);
    };
    
    fetchReviews();
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
      const newRev = await submitReview(productId, newReview.rating, newReview.comment);
      const updatedReviews = [newRev, ...reviews];
      setReviews(updatedReviews);
      calculateRatingMetrics(updatedReviews);
      setNewReview({ rating: 5, comment: "" });
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render stars for ratings
  const RatingStars = ({ rating, interactive = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button 
            key={star}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} focus:outline-none transition-all duration-300 transform hover:scale-110`}
            onClick={interactive ? () => setNewReview({ ...newReview, rating: star }) : undefined}
            disabled={!interactive}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill={star <= rating ? "#ffc155" : "none"} 
              viewBox="0 0 24 24" 
              stroke="#ffc155"
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
      <div className="space-y-3 my-4">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center">
            <span className="w-16 text-sm font-medium text-gray-700">{rating} stars</span>
            <div className="w-full mx-2 bg-gray-100 rounded-full h-2.5 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-300 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{width: `${total ? (ratingCounts[rating] / total) * 100 : 0}%`}}
              ></div>
            </div>
            <span className="w-10 text-sm font-medium text-gray-700 text-right">{ratingCounts[rating]}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 border-b border-emerald-200 pb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        Customer Reviews
      </h2>
      
      {/* Rating Summary */}
      <div className="mb-10 bg-gradient-to-r from-emerald-50 to-white p-6 rounded-xl shadow-sm">
        <div className="flex items-start justify-between flex-wrap">
          <div className="mb-4">
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-emerald-600">{averageRating.toFixed(1)}</span>
              <span className="text-lg text-gray-600 ml-2 font-medium">out of 5</span>
            </div>
            <div className="mt-2">
              <RatingStars rating={Math.round(averageRating)} />
            </div>
            <div className="mt-2 text-sm font-medium text-gray-500">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-grow max-w-md">
            <RatingProgressBars />
          </div>
        </div>
      </div>

      {/* Write a Review */}
      <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Write a Review
        </h3>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Your Rating</label>
          <RatingStars rating={newReview.rating} interactive={true} />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2 font-medium">Your Review</label>
          <textarea
            className="w-full p-4 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-300 shadow-sm"
            placeholder="Share your experience with this product..."
            rows="4"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          ></textarea>
        </div>
        
        <button 
          onClick={handleSubmitReview} 
          disabled={isSubmitting || !newReview.comment.trim()} 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            isSubmitting || !newReview.comment.trim() 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg transform hover:-translate-y-1'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>

      {/* Reviews List */}
      <div>
        <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-emerald-50 rounded-xl border border-emerald-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-emerald-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <p className="text-gray-500 mb-2">No reviews yet.</p>
            <p className="text-gray-700 font-medium">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-emerald-100 pb-8 hover:bg-emerald-50 p-4 rounded-lg transition-colors duration-300">
                <div className="flex items-center mb-3">
                  <div className="bg-emerald-100 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-gray-800 font-medium">{r.username}</span>
                    <div className="flex items-center mt-1">
                      <RatingStars rating={r.rating} />
                      <span className="ml-2 text-xs text-gray-500">{formatDate(r.date)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 ml-10 border-l-2 border-emerald-200 pl-4 py-1">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;