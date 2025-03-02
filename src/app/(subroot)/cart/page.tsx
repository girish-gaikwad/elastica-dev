"use client";
import { getCart, removeFromCart, updateCartItem } from '@/lib/cartWishlistUtils';
import { ArrowLeft, Loader2, MessageCircle, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [savings, setSavings] = useState(0);
  
  // Configure your WhatsApp number here
  const whatsappNumber = "7598315432"; // Replace with your actual WhatsApp number

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    setLoading(true);
    try {
      const cartData = await getCart();
      setCart(cartData);

      if (cartData.length > 0) {
        // Get product details for each cart item
        const productIds = cartData.map(item => item.productId);
        const response = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds }),
        });

        if (!response.ok) throw new Error('Failed to fetch product details');
        
        const { products: productsData } = await response.json();
        setProducts(productsData);

        // Calculate totals
        calculateTotals(cartData, productsData);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
      toast.error('Failed to load cart data');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (cartItems, productsData) => {
    let subtotalAmount = 0;
    let savingsAmount = 0;

    cartItems.forEach(cartItem => {
      const product = productsData.find(p => p.id === cartItem.productId);
      if (product) {
        subtotalAmount += product.finalPrice * cartItem.quantity;
        savingsAmount += (product.mrp - product.finalPrice) * cartItem.quantity;
      }
    });

    setSubtotal(subtotalAmount);
    setSavings(savingsAmount);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(productId);

    try {
      const updatedCart = await updateCartItem(productId, newQuantity);
      setCart(updatedCart);
      
      // Update the totals without fetching everything again
      const updatedProduct = products.find(p => p.id === productId);
      if (updatedProduct) {
        const oldQuantity = cart.find(item => item.productId === productId)?.quantity || 0;
        const quantityDiff = newQuantity - oldQuantity;
        
        setSubtotal(prev => prev + (updatedProduct.finalPrice * quantityDiff));
        setSavings(prev => prev + ((updatedProduct.mrp - updatedProduct.finalPrice) * quantityDiff));
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdating(productId);
    try {
      await removeFromCart(productId);
      
      // Update local state
      const removedProduct = products.find(p => p.id === productId);
      const removedQuantity = cart.find(item => item.productId === productId)?.quantity || 0;
      
      if (removedProduct && removedQuantity) {
        setSubtotal(prev => prev - (removedProduct.finalPrice * removedQuantity));
        setSavings(prev => prev - ((removedProduct.mrp - removedProduct.finalPrice) * removedQuantity));
      }
      
      setCart(cart.filter(item => item.productId !== productId));
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item');
    } finally {
      setUpdating(null);
    }
  };

  const formatCartDataForWhatsApp = () => {
    if (cart.length === 0) return "No items in cart";

    let message = "📋 *My Cart Enquiry* 📋\n\n";
    
    // Add item details
    cart.forEach((cartItem, index) => {
      const product = products.find(p => p.id === cartItem.productId);
      if (product) {
        message += `*${index + 1}. ${product.name}*\n`;
        message += `   Brand: ${product.brand}\n`;
        message += `   Price: ₹${product.finalPrice} ${product.discount > 0 ? `(${product.discount}% OFF from ₹${product.mrp})` : ''}\n`;
        message += `   Quantity: ${cartItem.quantity}\n`;
        message += `   Subtotal: ₹${(product.finalPrice * cartItem.quantity).toFixed(2)}\n\n`;
      }
    });
    
    // Add order summary
    message += "📊 *Order Summary* 📊\n";
    message += `Items: ${cart.reduce((acc, item) => acc + item.quantity, 0)}\n`;
    message += `Subtotal: ₹${subtotal.toFixed(2)}\n`;
    message += `Savings: ₹${savings.toFixed(2)}\n`;
    message += `Total: ₹${subtotal.toFixed(2)}\n\n`;
    
    message += "I'd like to inquire about these items. Please let me know about availability and delivery options.";
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppEnquiry = () => {
    const formattedMessage = formatCartDataForWhatsApp();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp with your cart details');
  };

  const CartItemSkeleton = () => (
    <div className="flex p-6 border-b border-gray-200 animate-pulse">
      <div className="w-28 h-28 bg-gray-200 rounded-lg"></div>
      <div className="ml-6 flex-grow">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="w-32 h-10 bg-gray-200 rounded-full"></div>
    </div>
  );

  const getProductForCartItem = (cartItem) => {
    return products.find(product => product.id === cartItem.productId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md py-5 sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-gray-800 hover:text-[#ffc155] transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="font-medium">Continue Shopping</span>
            </Link>
            <div className="flex items-center space-x-8">
              <Link href="/cart" className="font-medium text-[#ffc155] border-b-2 border-[#ffc155] pb-1">
                Shopping Bag
              </Link>
              <Link href="/wishlist" className="font-medium text-gray-600 hover:text-[#ffc155] transition-colors">
                Favorites
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 border-b border-gray-100 pb-4">Your Collection</h1>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg">
            {[1, 2, 3].map(i => <CartItemSkeleton key={i} />)}
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-50 flex items-center justify-center rounded-full mb-6 border border-gray-100">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-3">Your collection is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">It looks like you haven't added any items to your collection yet.</p>
            <Link 
              href="/categories" 
              className="bg-[#ffc155] hover:bg-[#e6ad4c] text-white px-8 py-3 rounded-full font-medium transition-colors inline-block shadow-md hover:shadow-lg"
            >
              Discover Luxury Items
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {cart.map(cartItem => {
                  const product = getProductForCartItem(cartItem);
                  if (!product) return null;
                  
                  return (
                    <div 
                      key={cartItem.productId} 
                      className="flex flex-col sm:flex-row p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="w-full sm:w-28 h-28 flex-shrink-0 mb-4 sm:mb-0">
                        <div className="relative h-full w-full">
                          <Image 
                            src={product.images[0]?.url || "/api/placeholder/100/100"} 
                            alt={product.name||"Product Image"}
                            className="object-cover rounded-lg shadow-sm"
                            width={112}
                            height={112}
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow px-0 sm:px-6">
                        <Link href={`/purchase/${product.id}`}>
                          <h3 className="font-medium text-gray-800 hover:text-[#ffc155] transition-colors text-lg">{product.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-500 mt-2">Brand: <span className="font-medium">{product.brand}</span></p>
                        <div className="mt-3">
                          {product.discount > 0 ? (
                            <div className="flex items-center">
                              <span className="font-bold text-gray-800 text-lg">₹{product.finalPrice}</span>
                              <span className="text-gray-400 line-through text-sm ml-3">₹{product.mrp}</span>
                              <span className="ml-3 bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                                {product.discount}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-800 text-lg">₹{product.mrp}</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex flex-col sm:items-end mt-4 sm:mt-0 gap-4">
                        <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shadow-sm">
                          <button 
                            onClick={() => handleQuantityChange(cartItem.productId, cartItem.quantity - 1)}
                            disabled={updating === cartItem.productId || cartItem.quantity <= 1}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 min-w-[40px] text-black text-center font-medium">{cartItem.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(cartItem.productId, cartItem.quantity + 1)}
                            disabled={updating === cartItem.productId}
                            className="px-3 py-2 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(cartItem.productId)}
                          disabled={updating === cartItem.productId}
                          className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center transition-colors"
                        >
                          {updating === cartItem.productId ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-800">Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Total Savings</span>
                    <span className="font-medium">-₹{savings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Premium Shipping</span>
                    <span className="font-medium text-green-600">COMPLIMENTARY</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-800 border-t border-gray-100 pt-6 mt-6">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* WhatsApp Enquiry Button */}
                <button 
                  className="w-full bg-[#ffc155] hover:bg-[#e6ad4c] text-white py-4 rounded-full font-medium mt-8 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                  onClick={handleWhatsAppEnquiry}
                  disabled={cart.length === 0}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Enquire via WhatsApp
                </button>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-600 text-center">Request availability, delivery options, and special offers for your selected items</p>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Link href="/" className="text-[#ffc155] hover:text-[#e6ad4c] font-medium flex items-center transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;