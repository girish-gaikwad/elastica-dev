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
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ffc155]"></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-24">
        <p className="text-gray-700 text-lg font-light italic">No products available at this moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-20 pt-8 lg:space-y-24">
      <div
        className={cn(
          "grid gap-x-4 gap-y-6 lg:gap-x-6 lg:gap-y-10",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4",
        )}
      >
        {products.map((product) => (
          <ProductCard.Root
            key={product._id || product.id}
            data={product}
            className={cn(
              "group transition-all duration-300 hover:shadow-lg rounded-lg overflow-hidden border border-transparent hover:border-[#ffc15540]",
              showDetail ? "sm:grid-cols-2 sm:place-items-center" : undefined
            )}
          >
            {/* product card thumbnail */}
            <ProductCard.Thumbnail className="relative overflow-hidden bg-[#f9f6f0]">
              {/* badge */}
              <ProductCard.ThumbnailBadge>
                <div className="space-y-1.5">
                  {isNewProduct(product.createdAt) && (
                    <ProductCard.Badge className="bg-[#ffc155] text-white font-medium tracking-wide px-3 py-1">new</ProductCard.Badge>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <ProductCard.Badge intent="discount" className="bg-black text-white font-medium tracking-wide px-3 py-1">
                      {calculateDiscount(product.originalPrice, product.price)}% off
                    </ProductCard.Badge>
                  )}
                </div>

                {!showDetail && <ProductCard.WishlistButton className="text-gray-800 hover:text-[#ffc155] transition-colors" />}
              </ProductCard.ThumbnailBadge>

              {/* image */}
              <Link href={`/purchase/${product.id}`} className="block overflow-hidden">
                <ProductCard.Image
                  src={product.images?.[0].url}
                  alt={product.name || "luxury product"}
                  className="transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
            </ProductCard.Thumbnail>

            {/* product card content */}
            <ProductCard.Content className="p-4 md:p-6 bg-white">
              <Link href={`/purchase/${product.id}`}>
                <ProductCard.Ratings value={product.rating || 0} className="text-[#ffc155]" />
                <div className="flex items-center justify-between gap-1 mt-2">
                  <ProductCard.Name className="font-serif text-gray-900 tracking-wide">{product.name}</ProductCard.Name>
                  <button
                    className={`flex items-center justify-center p-1.5 md:hidden ${!showDetail && "hidden"}`}
                  >
                    <WishlistIcon className="h-7 w-7 text-gray-800 hover:text-[#ffc155] transition-colors" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {product?.discount>0 &&(

                  <ProductCard.MRP className="text-gray-500" />
                  )}
                  <ProductCard.Price
                    price={product.price}
                    originalPrice={product.originalPrice}
                    currency={product.currency || "USD"}
                    className="text-[#333] font-medium"
                  />
                </div>
              </Link>

              {showDetail && (
                <div className="space-y-5 pt-4 lg:space-y-6 border-t border-gray-100 mt-4">
                  <Link href={`/purchase/${product.id}`}>
                    <ProductCard.Description className="line-clamp-3 md:text-sm text-gray-600 italic">
                      {product.description}
                    </ProductCard.Description>
                  </Link>

                  <div className="flex flex-col gap-3">
                    <ProductCard.Button
                      variant="ghost"
                      width="full"
                      fontSize="sm"
                      onClick={() => addToWishlist(product.id)}
                      className="flex items-center justify-center gap-2 lg:text-base border border-gray-200 hover:border-[#ffc155] hover:text-[#ffc155] transition-colors py-3"
                    >
                      <WishlistIcon fill="currentColor" className="h-5 w-5" />
                      Add to Wishlist
                    </ProductCard.Button>
                    <ProductCard.Button
                      width="full"
                      fontSize="sm"
                      onClick={() => addToCart(product.id)}
                      className="lg:text-base bg-[#ffc155] text-white hover:bg-[#e5ad4d] transition-colors py-3 hover:cursor-pointer"
                      disabled={!product.inStock}
                    >
                      {product.stock ? "Add to cart" : "Out of stock"}
                    </ProductCard.Button>
                  </div>
                </div>
              )}
            </ProductCard.Content>
          </ProductCard.Root>
        ))}
      </div>

      {hasmore && (
        <div className="flex justify-center pt-6">
          <button
            className="rounded-full border-2 border-[#ffc155] px-12 py-2.5 font-serif text-base font-medium text-[#333] hover:bg-[#ffc155] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed tracking-wide"
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