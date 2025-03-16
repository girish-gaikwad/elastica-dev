"use client";

// packages
import { MessageCircleIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// lib
import { addToCart, addToWishlist, getWishlist, removeFromWishlist } from "@/lib/cartWishlistUtils";

// ui
import ProductTab from "@/app/(subroot)/purchase/productTab";
import NewArraival from "@/components/custom/newArraival";
import { StarIcon, WishlistIcon } from "@/components/ui/assets/svg";
import Button from "@/components/ui/button";
import ProductSlider from "@/components/ui/slider/productSlider";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);

  // WhatsApp phone number - replace with your actual WhatsApp number
  const whatsappNumber = "7598315432";

  // Luxurious theme colors
  const primaryColor = "#22c55e"; // Golden base color
  const accentColor = "#15803d"; // Darker gold for contrast
  const textDark = "#1A1A1A"; // Near black for text
  const textLight = "#6B6B6B"; // Light gray for secondary text
  const bgLight = "#ecfdf5"; // Cream/ivory background
  const bgDark = "#2D2D2D"; // Dark background for contrast elements

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `/api/get_individual/${productId}`
        );

        if (res.status === 404) {
          return notFound();
        }

        const data = await res.json();
        setProduct(data);
        // Set the first color as the default selected color if colors exist
        if (data.product.colors && data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlist = await getWishlist();
        setIsInWishlist(wishlist.includes(productId));
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      }
    };

    if (productId) {
      checkWishlist();
    }
  }, [productId]);

  const incrementQuantity = () => {
    if (product && quantity < product.product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Calculate subtotal based on quantity and product price
  const calculateSubtotal = () => {
    if (!product) return 0;
    return product.product.finalPrice * quantity;
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!productId) return;

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId);
        setIsInWishlist(false);
      } else {
        await addToWishlist(productId);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Handle add to cart with the selected color
  const handleAddToCart = async () => {
    if (!productId || product.product.stock === 0) return;
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    setCartLoading(true);
    try {
      await addToCart(productId, quantity, selectedColor);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setCartLoading(false);
    }
  };

  // Format product details for WhatsApp message
  const formatProductDetails = () => {
    if (!product) return "";

    return `
*Product Enquiry*
Name: ${product.product.name}
productID:${product.product.id}
Price:₹ ${product.product.finalPrice}
Brand: ${product.product.brand}
${selectedColor ? `Selected Color: ${selectedColor.name}` : ''}
Category: ${product.product.categoryId}
Quantity: ${quantity}
Subtotal:₹ ${calculateSubtotal()}
Stock: ${product.product.stock} units available
Dimensions: ${product.product.dimensions}
Weight: ${product.product.weight}\n
Hey i am enquiring about this product "Iam intrested"
`;
  };

  // Handle enquiry button click
  const handleEnquiry = () => {
    if (!product) return;

    const productDetails = formatProductDetails();
    const encodedMessage = encodeURIComponent(productDetails);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  // Calculate savings amount
  const calculateSavings = () => {
    if (!product) return 0;
    return (product.product.mrp - product.product.finalPrice) * quantity;
  };

  if (loading) {
    return (
      <SectionLayout>
        <div className="mx-auto p-8 flex h-screen justify-center items-center " style={{ background: bgLight }}>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 rounded-full animate-spin" style={{ borderColor: `${primaryColor} transparent transparent transparent` }}></div>
            <p className="mt-4 font-medium" style={{ color: accentColor }}>Loading Product details...</p>
          </div>
        </div>
      </SectionLayout>
    );
  }

  if (!product) {
    return (
      <SectionLayout>
        <div className="mx-auto p-8 flex justify-center items-center h-[50vh]" style={{ background: bgLight }}>
          <div className="text-center p-8 rounded-lg shadow-lg" style={{ background: 'white', borderLeft: `4px solid ${primaryColor}` }}>
            <p className="text-xl font-semibold" style={{ color: textDark }}>Product not found</p>
            <p className="mt-2" style={{ color: textLight }}>The luxury item you're looking for is currently unavailable.</p>
          </div>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <div className="mx-auto space-y-8 p-8 lg:space-y-16" style={{ background: bgLight }}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(min-content,_400px)_1fr_280px]">
          {/* Product Image Slider - Added sticky positioning */}
          <div className="relative lg:sticky lg:top-20 h-[70vh] max-h-screen w-full rounded-xl overflow-hidden shadow-lg" style={{ border: `1px solid ${primaryColor}` }} >
            <ProductSlider images={product.product.images} />
          </div>

          {/* Product Details */}
          <div className="mx-auto max-w-[420px] md:max-w-[520px] lg:max-w-none">
            <div className="space-y-4 border-b pb-6" style={{ borderColor: primaryColor }}>
              {/* Brand Highlight */}
              <div className="inline-block px-3 py-1 rounded-full mb-2" style={{ background: `${primaryColor}20`, color: accentColor }}>
                <span className="font-medium text-sm">{product.product.brand}</span>
              </div>

              {/* Ratings */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(Number(product.averageRating)) }).map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" fill={primaryColor} />
                  ))}

                  {Number(product.averageRating) % 1 !== 0 && (
                    <div className="relative w-5 h-5 overflow-hidden">
                      <StarIcon className="h-5 w-5 absolute left-0" fill={primaryColor} />
                      <div
                        className="absolute top-0 right-0 bg-white"
                        style={{ width: `${(1 - (Number(product.averageRating) % 1)) * 20}px`, height: "100%" }}
                      />
                    </div>
                  )}

                  <span className="text-xs" style={{ color: textLight }}>({product.totalRatings})</span>
                </div>

                <span className="font-inter text-xs font-normal" style={{ color: textLight }}>
                  {product.reviews} Reviews
                </span>
              </div>

              {/* Product Name */}
              <h1 className="font-poppins text-4xl font-medium tracking-tight" style={{ color: textDark }}>
                {product.product.name}
              </h1>

              {/* Stock Alert */}
              {product.product.stock <= 10 && (
                <div className="rounded-lg p-3 flex items-center" style={{ background: `${primaryColor}20` }}>
                  <p className="font-inter text-sm" style={{ color: accentColor }}>
                    <span className="font-semibold">Only {product.product.stock} left</span> in stock
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2 mt-4">
                <p
                  className={`font-inter text-base ${!showMore ? "line-clamp-3" : ""}`}
                  style={{ color: textLight }}
                >
                  {product.product.description}
                </p>

                <button
                  type="button"
                  className="font-inter text-sm font-medium"
                  style={{ color: accentColor }}
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              </div>

              {/* Price Display */}
              <div className="mt-6 p-4 rounded-lg" style={{ background: `${primaryColor}10` }}>
                <p className="font-poppins text-3xl font-medium" style={{ color: textDark }}>
      
                  <span className="flex flex-col items-start text-lg font-semibold text-gray-800">
                    {product.product.name.toLowerCase().includes('dumbell') ||
                      product.product.name.toLowerCase().includes('squat wedge') ? (
                      <div className="flex gap-4 items-center">
                        <span className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-3 py-1 rounded-md">
                          ₹{product.product.finalPrice.toLocaleString()} <span className="text-sm">(Single)</span>
                        </span>
                        <span className="text-red-500 font-bold">
                          ₹{(product.product.finalPrice * 2).toLocaleString()} <span className="text-sm">(Pair)</span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl">
                        ₹{(product.product.finalPrice * quantity).toLocaleString()}
                      </span>
                    )}
                  </span>

                  {product.product.discount > 0 &&
                    (<>
                      <span className="ml-3 align-middle text-lg line-through decoration-2" style={{ color: textLight }}>
                        ₹{product.product.mrp.toLocaleString()}
                      </span>
                      <span className="ml-3 align-middle text-lg" style={{ color: '#2E7D32' }}>
                        -{product.product.discount}%
                      </span>
                    </>
                    )
                  }
                </p>
                {product.product.discount > 0 && (
                  <p className="text-sm mt-1" style={{ color: '#2E7D32' }}>
                    You save: ₹{calculateSavings().toLocaleString()}
                  </p>
                )}
              </div>

              {/* Color Variants - Enhanced with selection functionality */}
              <div className="space-y-6 py-6">
                <p className="font-inter text-base font-medium" style={{ color: accentColor }}>
                  Choose Color
                  {selectedColor && <span className="ml-2 text-sm" style={{ color: textLight }}>Selected: {selectedColor.name}</span>}
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.product.colors.map((color) => (
                    <div
                      key={color.id || color.name}
                      className={`h-12 w-12 rounded-full cursor-pointer p-0.5 transition-all duration-200 ease-in-out flex items-center justify-center`}
                      style={{
                        border: selectedColor && (selectedColor.id === color.id || selectedColor.name === color.name)
                          ? `3px solid ${accentColor}`
                          : '2px solid #E8E8E8',
                        transform: selectedColor && (selectedColor.id === color.id || selectedColor.name === color.name)
                          ? 'scale(1.1)'
                          : 'scale(1)'
                      }}
                      onClick={() => handleColorSelect(color)}
                    >
                      <div
                        className="h-full w-full rounded-full"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      ></div>
                    </div>
                  ))}
                </div>
                {!selectedColor && (
                  <p className="text-sm italic" style={{ color: '#d32f2f' }}>Please select a color</p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3 border-b py-6" style={{ borderColor: primaryColor }}>
              <p className="font-inter text-base font-medium" style={{ color: accentColor }}>
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {product.product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm font-inter font-normal rounded-full"
                    style={{ background: `${primaryColor}30`, color: accentColor }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Measurements */}
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <p className="font-inter text-base font-semibold" style={{ color: accentColor }}>
                  Measurements
                </p>
                <p className="font-inter text-xl font-normal" style={{ color: textDark }}>
                  {product.product.dimensions}
                </p>
              </div>
            </div>

            {/* Mobile Buttons */}
            <div className="space-y-4 border-b py-6 lg:hidden" style={{ borderColor: primaryColor }}>
              <div className="flex h-12 gap-2">
                <div className="flex h-full w-1/2 items-center justify-between rounded-lg px-2 md:w-3/5" style={{ background: `${primaryColor}20` }}>
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`rounded-full w-8 h-8 flex items-center justify-center ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ background: quantity <= 1 ? '#E0E0E0' : primaryColor }}
                  >
                    <MinusIcon
                      stroke={quantity <= 1 ? '#999' : 'white'}
                      className="h-4 w-4"
                    />
                  </button>
                  <span className="font-inter text-lg font-semibold" style={{ color: textDark }}>
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.product.stock}
                    className={`rounded-full w-8 h-8 flex items-center justify-center ${quantity >= product.product.stock ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ background: quantity >= product.product.stock ? '#E0E0E0' : primaryColor }}
                  >
                    <PlusIcon
                      stroke={quantity >= product.product.stock ? '#999' : 'white'}
                      className="h-4 w-4"
                    />
                  </button>
                </div>

                <button
                  className={`flex h-full w-1/2 items-center justify-center gap-2 rounded-lg border ${isInWishlist ? 'border-2' : 'border'}`}
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  style={{
                    borderColor: accentColor,
                    background: isInWishlist ? `${primaryColor}20` : 'transparent'
                  }}
                >
                  <WishlistIcon
                    stroke={accentColor}
                    fill={isInWishlist ? accentColor : "none"}
                    className="h-5 w-5"
                  />
                  <span className="font-inter text-sm font-medium" style={{ color: accentColor }}>
                    {wishlistLoading ? "Loading..." : isInWishlist ? "Remove" : "Wishlist"}
                  </span>
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                className="w-full h-12 rounded-lg flex items-center justify-center gap-2"
                disabled={product.product.stock === 0 || cartLoading || !selectedColor}
                onClick={handleAddToCart}
                style={{
                  background: product.product.stock === 0 || !selectedColor ? '#E0E0E0' : primaryColor,
                  color: product.product.stock === 0 || !selectedColor ? textLight : 'white'
                }}
              >
                <ShoppingBagIcon className="h-5 w-5" />
                <span className="font-inter text-base font-medium">
                  {product.product.stock === 0
                    ? "Out of Stock"
                    : !selectedColor
                      ? "Select a Color"
                      : cartLoading
                        ? "Adding..."
                        : "Add to Cart"}
                </span>
              </button>

              {/* Mobile Enquiry Button */}
              <button
                className="w-full h-12 rounded-lg flex items-center justify-center gap-2 border"
                onClick={handleEnquiry}
                style={{ background: `${bgLight}`, borderColor: '#2E7D32', color: '#2E7D32' }}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircleIcon className="h-5 w-5" />
                  <span className="font-inter text-base font-medium">Enquire via WhatsApp</span>
                </div>
              </button>
            </div>

            {/* Product Specifications */}
            <div className="mt-6 p-6 rounded-lg" style={{ background: `${primaryColor}10` }}>
              <h3 className="font-poppins text-lg font-semibold mb-4" style={{ color: accentColor }}>Product Specifications</h3>
              <dl className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-3 font-inter text-sm lg:grid-cols-[140px_1fr] lg:text-base">
                <dt style={{ color: textLight }}>Brand</dt>
                <dd style={{ color: textDark }} className="font-medium">{product.product.brand}</dd>
                <dt style={{ color: textLight }}>Category</dt>
                <dd style={{ color: textDark }} className="font-medium">{product.product.categoryId}</dd>
                <dt style={{ color: textLight }}>Weight</dt>
                <dd style={{ color: textDark }} className="font-medium">{product.product.weight}</dd>
                <dt style={{ color: textLight }}>Dimensions</dt>
                <dd style={{ color: textDark }} className="font-medium">{product.product.dimensions}</dd>
                {selectedColor && (
                  <>
                    <dt style={{ color: textLight }}>Color</dt>
                    <dd style={{ color: textDark }} className="font-medium">{selectedColor.name}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>

          {/* Right Side Cart Panel - Added sticky positioning */}
          <div className="hidden h-fit flex-col gap-8 rounded-xl border p-6 lg:flex lg:sticky lg:top-20" style={{ borderColor: primaryColor, background: 'white' }}>
            <div className="space-y-4">
              <div className="text-center pb-3 border-b" style={{ borderColor: `${primaryColor}50` }}>
                <h3 className="font-poppins text-xl font-semibold" style={{ color: accentColor }}>Order Summary</h3>
              </div>

              <div className="space-y-4">
                <p className="font-poppins font-medium" style={{ color: textDark }}>
                  Quantity
                </p>
                <div className="flex h-12 items-center justify-between rounded-lg px-4" style={{ background: `${primaryColor}20` }}>
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`rounded-full w-8 h-8 flex items-center justify-center ${quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ background: quantity <= 1 ? '#E0E0E0' : primaryColor }}
                  >
                    <MinusIcon
                      stroke={quantity <= 1 ? '#999' : 'white'}
                      className="h-4 w-4"
                    />
                  </button>
                  <span className="font-inter text-lg font-semibold" style={{ color: textDark }}>
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.product.stock}
                    className={`rounded-full w-8 h-8 flex items-center justify-center ${quantity >= product.product.stock ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{ background: quantity >= product.product.stock ? '#E0E0E0' : primaryColor }}
                  >
                    <PlusIcon
                      stroke={quantity >= product.product.stock ? '#999' : 'white'}
                      className="h-4 w-4"
                    />
                  </button>
                </div>

                {/* Selected Color Display */}
                {product.product.colors && product.product.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="font-poppins font-medium mb-2" style={{ color: textDark }}>
                      Selected Color
                    </p>
                    <div className="flex items-center gap-3">
                      {selectedColor ? (
                        <>
                          <div
                            className="h-8 w-8 rounded-full border"
                            style={{ backgroundColor: selectedColor.hex, borderColor: '#E8E8E8' }}
                          ></div>
                          <span style={{ color: textDark }}>{selectedColor.name}</span>
                        </>
                      ) : (
                        <span className="text-sm" style={{ color: '#d32f2f' }}>Please select a color</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <p className="font-inter text-sm" style={{ color: textLight }}>Price ({quantity} {quantity > 1 ? 'items' : 'item'})</p>
                    <p className="font-inter text-sm line-through" style={{ color: textLight }}>
                      ₹{(product.product.mrp * quantity).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-inter text-sm" style={{ color: textLight }}>Discount</p>
                    <p className="font-inter text-sm" style={{ color: '#2E7D32' }}>
                      -₹{calculateSavings().toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: `${primaryColor}30` }}>
                    <p className="font-inter font-medium" style={{ color: textDark }}>Subtotal</p>
                    <p className="font-poppins text-xl font-semibold" style={{ color: textDark }}>
                      ₹{calculateSubtotal().toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  className="w-full h-12 rounded-lg flex items-center justify-center gap-2"
                  disabled={product.product.stock === 0 || cartLoading || !selectedColor}
                  onClick={handleAddToCart}
                  style={{
                    background: product.product.stock === 0 || !selectedColor ? '#E0E0E0' : primaryColor,
                    color: product.product.stock === 0 || !selectedColor ? textLight : 'white'
                  }}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  <span className="font-inter text-base font-medium">
                    {product.product.stock === 0
                      ? "Out of Stock"
                      : !selectedColor
                        ? "Select a Color"
                        : cartLoading
                          ? "Adding..."
                          : "Add to Cart"}
                  </span>
                </button>

                <button
                  className="w-full h-12 rounded-lg flex items-center justify-center gap-2 border"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  style={{
                    borderColor: accentColor,
                    background: isInWishlist ? `${primaryColor}20` : 'transparent'
                  }}
                >
                  <WishlistIcon
                    stroke={accentColor}
                    fill={isInWishlist ? "#2E7D32" : "none"}
                    className="h-5 w-5"
                  />
                  <span className="font-inter text-base font-medium" style={{ color: isInWishlist ? "#2E7D32" : "#121212" }}>
                    {wishlistLoading ? "Loading..." : isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                  </span>
                </button>

                {/* Desktop Enquiry Button */}
                <button
                  className="w-full h-12 rounded-lg flex items-center justify-center gap-2 border mt-2"
                  onClick={handleEnquiry}
                  style={{ background: `${bgLight}`, borderColor: '#2E7D32', color: '#2E7D32' }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircleIcon className="h-5 w-5" />
                    <span className="font-inter text-base font-medium">Enquire via WhatsApp</span>
                  </div>
                </button>
              </div>

              {/* Secure transaction message */}
              <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg" style={{ background: `${primaryColor}10` }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={accentColor}>
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium" style={{ color: accentColor }}>Secure transaction</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs styling */}
        <div className="rounded-xl overflow-hidden shadow-md" style={{ border: `1px solid ${primaryColor}30` }}>
          <ProductTab
            technicalDetails={product.product.technicalDetails}
            description={product.product.description}
            id={product.product.id}
          />
        </div>

        {/* Related Products */}
        <div className="mt-16 ">
          <div className="mb-8 text-center">
            <h2 className="font-poppins text-3xl font-semibold" style={{ color: textDark }}>
              You May Also Like
            </h2>
            <div className="w-20 h-1 mx-auto mt-2" style={{ background: primaryColor }}></div>
          </div>
          <NewArraival />
        </div>
      </div>
    </SectionLayout>
  );
}