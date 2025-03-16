"use client";

import { WishlistIcon } from "@/components/ui/assets/svg";
import * as ProductCard from "@/components/ui/card/customcard";
import { addToCart, addToWishlist } from "@/lib/cartWishlistUtils";
import { cn } from "@/lib/utils";
import { useProductDetail } from "@/stores/zustand";
import Link from "next/link";

const CatalogProduct = ({
  products = [],
  onLoadMore,
  hasmore,
  loading = false
}) => {
  const showDetail = useProductDetail((state) => state.showDetail);

  // Helper function to calculate discount percentage
  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Helper to determine if product is new (within last 30 days)
  const isNewProduct = (createdAt) => {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate >= thirtyDaysAgo;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#22c55e]"></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
        <p className="text-gray-700 text-base sm:text-lg font-light italic px-4 text-center">No products available at this moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 py-8 sm:py-12 md:py-16 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 sm:gap-x-3 sm:gap-y-5 md:gap-x-4 md:gap-y-6 lg:gap-x-6 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        )}
      >
        {products.map((product) => (
          <ProductCard.Root
            key={product._id || product.id}
            data={product}
            className={cn(
              "group transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-transparent hover:border-[#22c55e]",
              showDetail ? "sm:grid sm:grid-cols-2 sm:place-items-center" : undefined
            )}
          >
            {/* product card thumbnail */}
            <ProductCard.Thumbnail className="relative overflow-hidden bg-[#f9f6f0] aspect-square">
              {/* badge */}
              <ProductCard.ThumbnailBadge className="flex justify-between w-full p-2 sm:p-3">
                <div className="space-y-1">
                  {isNewProduct(product.createdAt) && (
                    <ProductCard.Badge className="bg-[#22c55e] text-white font-medium tracking-wide px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm">new</ProductCard.Badge>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <ProductCard.Badge intent="discount" className="bg-black text-white font-medium tracking-wide px-2 py-0.5 text-xs sm:px-3 sm:py-1 sm:text-sm">
                      {calculateDiscount(product.originalPrice, product.price)}% off
                    </ProductCard.Badge>
                  )}
                </div>

                {!showDetail && <ProductCard.WishlistButton productId={ product.id} className="text-gray-800 hover:text-[#22c55e] transition-colors h-6 w-6 sm:h-7 sm:w-7" />}
              </ProductCard.ThumbnailBadge>

              {/* image */}
              <Link href={`/purchase/${product.id}`} className="block overflow-hidden h-full w-full">
                <ProductCard.Image
                  src={product.images?.[0]?.url}
                  alt={product.name || "luxury product"}
                  className="transition-transform duration-700 group-hover:scale-105 h-full w-full object-cover"
                />
              </Link>
            </ProductCard.Thumbnail>

            {/* product card content */}
            <ProductCard.Content className="p-3 sm:p-4 md:p-5 lg:p-6 bg-white">
              <Link href={`/purchase/${product.id}`}>
                <ProductCard.Ratings value={product.rating || 0} className="text-[#22c55e] text-sm sm:text-base" />
                <div className="flex items-center justify-between gap-1 mt-1.5 sm:mt-2">
                  <ProductCard.Name className="font-serif text-gray-900 tracking-wide text-sm sm:text-base truncate">{product.name}</ProductCard.Name>
                
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
                  {product?.discount > 0 && (
                    <ProductCard.MRP className="text-gray-500 text-xs sm:text-sm" />
                  )}
                  <ProductCard.Price
                    price={product.price}
                    originalPrice={product.originalPrice}
                    currency={product.currency || "USD"}
                    className="text-[#333] font-medium text-sm sm:text-base"
                  />
                </div>
              </Link>

              {showDetail && (
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 lg:space-y-6 border-t border-gray-100 mt-3 sm:mt-4">
                  <Link href={`/purchase/${product.id}`}>
                    <ProductCard.Description className="line-clamp-3 text-xs sm:text-sm text-gray-600 italic">
                      {product.description}
                    </ProductCard.Description>
                  </Link>

                  <div className="flex flex-col gap-2 sm:gap-3">
                    <ProductCard.Button
                      variant="ghost"
                      width="full"
                      fontSize="sm"
                      onClick={() => addToWishlist(product.id)}
                      className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base border border-gray-200 hover:border-[#22c55e] hover:text-[#22c55e] transition-colors py-2 sm:py-2.5 lg:py-3"
                      >
                      <WishlistIcon fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5" />
                      Add to Wishlist
                    </ProductCard.Button>
                    
                  <ProductCard.AddToCartButton productId={ product.id}  />

                  </div>
                </div>
              )}
            </ProductCard.Content>
          </ProductCard.Root>
        ))}
      </div>

      {hasmore && (
        <div className="flex justify-center pt-4 sm:pt-6">
          <button
            className="rounded-full border-2 border-[#22c55e] px-6 sm:px-8 md:px-12 py-2 sm:py-2.5 font-serif text-sm sm:text-base font-medium text-[#333] hover:bg-[#22c55e] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogProduct;