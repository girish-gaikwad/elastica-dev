// lib/qnaReviewUtils.js
import { toast } from 'react-hot-toast';

/**
 * Fetch questions for a product
 * @param {string} productId - The ID of the product
 * @returns {Promise<Array>} - Array of questions
 */
export const getQuestions = async (productId) => {
  try {
    const response = await fetch(`/api/questions/${productId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch questions');
    }

    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

/**
 * Submit a new question
 * @param {string} productId - The ID of the product
 * @param {string} question - The question text
 * @returns {Promise<Object>} - The newly created question
 */
export const submitQuestion = async (productId, question) => {
  try {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        productId, 
        question 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit question');
    }

    toast.success('Question submitted successfully');
    return data;
  } catch (error) {
    toast.error(error.message || 'Failed to submit question');
    throw error;
  }
};

/**
 * Submit an answer to a question
 * @param {string} questionId - The ID of the question
 * @param {string} answer - The answer text
 * @returns {Promise<Object>} - The updated question with answer
 */
export const submitAnswer = async (questionId, answer) => {
  try {
    const response = await fetch(`/api/answer/${questionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        answer 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit answer');
    }

    toast.success('Answer posted successfully');
    return data;
  } catch (error) {
    toast.error(error.message || 'Failed to submit answer');
    throw error;
  }
};

/**
 * Fetch reviews for a product
 * @param {string} productId - The ID of the product
 * @returns {Promise<Array>} - Array of reviews
 */
export const getReviews = async (productId) => {
  try {
    const response = await fetch(`/api/reviews/${productId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }

    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

/**
 * Submit a new review
 * @param {string} productId - The ID of the product
 * @param {number} rating - The rating (1-5)
 * @param {string} comment - The review comment
 * @returns {Promise<Object>} - The newly created review
 */
export const submitReview = async (productId, rating, comment) => {
  try {
    const response = await fetch(`/api/reviews/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        productId, 
        // userId: "U123", 
        // username: "JohnDoe", 
        rating: Number(rating), 
        comment 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit review');
    }

    toast.success('Review submitted successfully');
    return data;
  } catch (error) {
    toast.error(error.message || 'Failed to submit review');
    throw error;
  }
};

/**
 * Format date to a more readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(date);
};