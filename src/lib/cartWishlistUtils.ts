// lib/cartWishlistUtils.js
import { toast } from 'react-hot-toast';

/**
 * Add a product to the user's wishlist
 * @param {string} productId - The ID of the product to add
 * @returns {Promise<Array<string>>} - The updated wishlist
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await fetch('/api/users/wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to wishlist');
    }

    toast.success('Added to wishlist');
    return data.wishlist;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      toast.error('Please login to add to wishlist');
    } else {
      toast.error(error.message || 'Failed to add to wishlist');
    }
    throw error;
  }
};

/**
 * Remove a product from the user's wishlist
 * @param {string} productId - The ID of the product to remove
 * @returns {Promise<Array<string>>} - The updated wishlist
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await fetch('/api/users/wishlist', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove from wishlist');
    }

    toast.success('Removed from wishlist');
    return data.wishlist;
  } catch (error) {
    toast.error(error.message || 'Failed to remove from wishlist');
    throw error;
  }
};

/**
 * Get the user's wishlist
 * @returns {Promise<Array<string>>} - The user's wishlist
 */
export const getWishlist = async () => {
  try {
    const response = await fetch('/api/users/wishlist');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get wishlist');
    }

    return data.wishlist;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

/**
 * Add a product to the user's cart
 * @param {string} productId - The ID of the product to add
 * @param {number} quantity - The quantity to add
 * @returns {Promise<Array>} - The updated cart
 */
export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await fetch('/api/users/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to cart');
    }

    toast.success('Added to cart');
    return data.cart;
  } catch (error) {
    if (error.message === 'Unauthorized') {
      toast.error('Please login to add to cart');
    } else {
      toast.error(error.message || 'Failed to add to cart');
    }
    throw error;
  }
};

/**
 * Update the quantity of a product in the cart
 * @param {string} productId - The ID of the product to update
 * @param {number} quantity - The new quantity
 * @returns {Promise<Array>} - The updated cart
 */
export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await fetch('/api/users/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update cart');
    }

    toast.success(quantity > 0 ? 'Cart updated' : 'Item removed from cart');
    return data.cart;
  } catch (error) {
    toast.error(error.message || 'Failed to update cart');
    throw error;
  }
};

/**
 * Remove a product from the cart
 * @param {string} productId - The ID of the product to remove
 * @returns {Promise<Array>} - The updated cart
 */
export const removeFromCart = async (productId) => {
  try {
    const response = await fetch('/api/users/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove from cart');
    }

    toast.success('Removed from cart');
    return data.cart;
  } catch (error) {
    toast.error(error.message || 'Failed to remove from cart');
    throw error;
  }
};

/**
 * Get the user's cart
 * @returns {Promise<Array>} - The user's cart
 */
export const getCart = async () => {
  try {
    const response = await fetch('/api/users/cart');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get cart');
    }

    return data.cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};