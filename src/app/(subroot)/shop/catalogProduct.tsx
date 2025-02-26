"use client";

import { WishlistIcon } from "@/components/ui/assets/svg";
import * as ProductCard from "@/components/ui/card/customcard";
import { useProductDetail } from "@/stores/zustand";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CatalogProduct = ({
  products = [],
  onLoadMore,
  hasmore,
  loading = false
}) => {
  const showDetail = useProductDetail((state) => state.showDetail);

  console.log(products, "djawh")
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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-20 pt-8 lg:space-y-20">
      <div
        className={cn(
          "grid gap-x-2 gap-y-4 lg:gap-x-4 lg:gap-y-8",
          showDetail
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        )}
      >
        {products.map((product) => (
          <ProductCard.Root
            key={product._id || product.id}
            data={product}
            className={
              showDetail ? "sm:grid-cols-2 sm:place-items-center" : undefined
            }
          >
            {/* product card thumbnail */}
            <ProductCard.Thumbnail>
              {/* badge */}
              <ProductCard.ThumbnailBadge>
                <div className="space-y-1.5">
                  {isNewProduct(product.createdAt) && (
                    <ProductCard.Badge>new</ProductCard.Badge>
                  )}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <ProductCard.Badge intent="discount">
                      {calculateDiscount(product.originalPrice, product.price)}% off
                    </ProductCard.Badge>
                  )}
                </div>

                {!showDetail && <ProductCard.WishlistButton />}
              </ProductCard.ThumbnailBadge>

              {/* image */}
              <Link href={`/purchase/${product.id}`}>

                <ProductCard.Image
                  src={product.images?.[0].url}
                  alt={product.name}
                /></Link>
            </ProductCard.Thumbnail>

            {/* product card content */}
            <ProductCard.Content className="md:p-6">
              <Link href={`/purchase/${product.id}`}>

                <ProductCard.Ratings value={product.rating || 0} />
                <div className="flex items-center justify-between gap-1">
                  <ProductCard.Name>{product.name}</ProductCard.Name>
                  <button
                    className={`flex items-center justify-center p-1.5 md:hidden ${!showDetail && "hidden"
                      }`}
                  >
                    <WishlistIcon className="h-7 w-7" />
                  </button>
                </div>
                <div className="flex items-center  gap-2">
                  <ProductCard.MRP />
                  <ProductCard.Price
                    price={product.price}
                    originalPrice={product.originalPrice}
                    currency={product.currency || "USD"}
                  />
                </div>
              </Link>

              {showDetail && (
                <div className="space-y-4 pt-1 lg:space-y-6">
                  <Link href={`/purchase/${product.id}`}>

                    <ProductCard.Description className="line-clamp-3 md:text-sm">
                      {product.description}
                    </ProductCard.Description>
                  </Link>

                  <div className="flex flex-col gap-2">
                    <ProductCard.Button
                      variant="ghost"
                      width="full"
                      fontSize="sm"
                      className="flex items-center justify-center gap-1 lg:text-base"
                    >
                      <WishlistIcon fill="#141718" className="h-5 w-5" />
                      Wishlist
                    </ProductCard.Button>
                    <ProductCard.Button
                      width="full"
                      fontSize="sm"
                      className="lg:text-base hover:cursor-pointer"
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
        <div className="flex justify-center">
          <button
            className="rounded-full border border-[#141718] px-10 py-1.5 font-inter text-base font-medium text-[#141718] hover:bg-[#141718] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Show more"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogProduct;