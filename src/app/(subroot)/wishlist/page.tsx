"use client";
import { addToCart, getWishlist, removeFromWishlist } from '@/lib/cartWishlistUtils';
import { ArrowLeft, Heart, Loader2, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const fetchWishlistData = async () => {
    setLoading(true);
    try {
      const wishlistIds = await getWishlist();
      setWishlist(wishlistIds);

      if (wishlistIds.length > 0) {
        // Get product details for each wishlist item
        const response = await fetch('/api/products/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: wishlistIds }),
        });

        if (!response.ok) throw new Error('Failed to fetch product details');
        
        const { products: productsData } = await response.json();
        setProducts(productsData);
      }
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      toast.error('Failed to load wishlist data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'remove' }));
    try {
      await removeFromWishlist(productId);
      setWishlist(wishlist.filter(id => id !== productId));
      setProducts(products.filter(product => product.id !== productId));
      toast.success('Item removed from favorites');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: null }));
    }
  };

  const handleAddToCart = async (productId) => {
    setActionLoading(prev => ({ ...prev, [productId]: 'cart' }));
    try {
      await addToCart(productId, 1);
      toast.success('Added to shopping bag');
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: null }));
    }
  };

  const WishlistItemSkeleton = () => (
    <div className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="h-60 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-5 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded mt-4 mb-3"></div>
        <div className="h-10 bg-gray-200 rounded-full mt-4"></div>
      </div>
    </div>
  );

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
              <Link href="/cart" className="font-medium text-gray-600 hover:text-[#ffc155] transition-colors">
                Shopping Bag
              </Link>
              <Link href="/wishlist" className="font-medium text-[#ffc155] border-b-2 border-[#ffc155] pb-1">
                Favorites
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-10 border-b border-gray-100 pb-4">Your Favorites</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => <WishlistItemSkeleton key={i} />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-50 flex items-center justify-center rounded-full mb-6 border border-gray-100">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-medium text-gray-800 mb-3">Your favorites collection is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Items you save to favorites will be displayed here for easy access.</p>
            <Link 
              href="/categories" 
              className="bg-[#ffc155] hover:bg-[#e6ad4c] text-white px-8 py-3 rounded-full font-medium transition-colors inline-block shadow-md hover:shadow-lg"
            >
              Discover Luxury Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <Link href={`/purchase/${product.id}`}>
                    <div className="h-44 overflow-hidden">
                      <Image 
                        src={product.images[0]?.url || "/api/placeholder/400/320"} 
                        alt={product.name || "Product Image"}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                        width={400}
                        height={320}
                      />
                    </div>
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    disabled={actionLoading[product.id] === 'remove'}
                    className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm text-red-500 rounded-full hover:bg-white hover:text-red-600 transition-colors shadow-md"
                    aria-label="Remove from favorites"
                  >
                    {actionLoading[product.id] === 'remove' ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                  </button>
                  {product.discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-medium text-xs shadow-md">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <Link href={`/purchase/${product.id}`}>
                    <h3 className="font-medium text-gray-800 text-lg line-clamp-2 group-hover:text-[#ffc155] transition-colors min-h-[3.5rem]">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-2">Brand: <span className="font-medium">{product.brand}</span></p>
                  <div className="mt-3">
                    {product.discount > 0 ? (
                      <div className="flex items-center">
                        <span className="font-bold text-gray-800 text-lg">₹{product.finalPrice}</span>
                        <span className="text-gray-400 line-through text-sm ml-3">₹{product.mrp}</span>
                      </div>
                    ) : (
                      <span className="font-bold text-gray-800 text-lg">₹{product.mrp}</span>
                    )}
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product.id)}
                    disabled={actionLoading[product.id] === 'cart'}
                    className="w-full mt-5 bg-[#ffc155] hover:bg-[#e6ad4c] text-white py-3 rounded-full font-medium transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    {actionLoading[product.id] === 'cart' ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Shopping Bag
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;