"use client";

// packages
import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { MinusIcon, PlusIcon } from "lucide-react";

// layouts
import SectionLayout from "@/layouts/sectionLayout";

// lib
import { formatCurrency } from "@/lib/utils";

// ui
import { StarIcon, WishlistIcon } from "@/components/ui/assets/svg";
import Button from "@/components/ui/button";
import ProductSlider from "@/components/ui/slider/productSlider";
import ProductTab from "@/app/(subroot)/purchase/productTab";
import ProductVariant from "@/app/(subroot)/purchase/productVariant";
import ProductRecommendation from "@/app/(subroot)/purchase/productRecommendation";
import BestSeller from "@/components/custom/bestSeller";
import NewArraival from "@/components/custom/newArraival";

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/get_individual/${productId}`
        );

        if (res.status === 404) {
          return notFound();
        }

        const data = await res.json();
        setProduct(data);
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

  if (loading) {
    return (
      <SectionLayout>
        <div className="mx-auto p-8 flex justify-center items-center h-[50vh]">
          <p>Loading product...</p>
        </div>
      </SectionLayout>
    );
  }

  if (!product) {
    return (
      <SectionLayout>
        <div className="mx-auto p-8 flex justify-center items-center h-[50vh]">
          <p>Product not found</p>
        </div>
      </SectionLayout>
    );
  }

  return (
    <SectionLayout>
      <div className="mx-auto space-y-6 p-8 lg:space-y-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(min-content,_400px)_1fr_280px]">
          <div className="relative h-full w-full">
            <ProductSlider images={product.product.images} />
          </div>

          <div className="mx-auto max-w-[420px] md:max-w-[520px] lg:max-w-none">
            <div className="space-y-4 border-b border-[#E8ECEF] pb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.floor(Number(product.averageRating)) }).map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5" fill="#FFD700" />
                  ))}

                  {Number(product.averageRating) % 1 !== 0 && (
                    <div className="relative w-4 h-4 overflow-hidden">
                      <StarIcon className="h-5 w-5 absolute left-0" fill="#FFD700" />
                      <div
                        className="absolute top-0 left-0 bg-white"
                        style={{ width: `${(1 - (Number(product.averageRating) % 1)) * 16}px`, height: "100%" }}
                      />
                    </div>
                  )}

                  <span className="text-xs text-gray-500">({product.totalRatings})</span>
                </div>

                <span className="font-inter text-xs font-normal text-[#141718]">
                  {product.reviews} Reviews
                </span>
              </div>

              <h1 className="font-poppins text-[40px] font-medium text-[#141718]">
                {product.product.name}
              </h1>

              {product.product.stock <= 10 && (
                <div className="bg-[#F5F5F5] rounded-lg p-2 flex items-center justify-center">
                  <p className="font-inter text-sm font-normal text-[#141718]">
                    <span className="font-semibold">Only {product.product.stock} left</span> in stock
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p
                  className={`font-inter text-base font-normal text-[#6C7275] ${!showMore ? "line-clamp-3" : ""
                    }`}
                >
                  {product.product.description}
                </p>

                <button
                  type="button"
                  className="font-inter text-sm font-normal text-[#141718]"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? "Show less" : "Show more"}
                </button>
              </div>

              <p className="font-poppins text-[28px] font-medium text-[#141718]">
                <span className="align-middle">
                  {formatCurrency(product.product.finalPrice)}
                </span>
                <span className="ml-3 align-middle text-xl text-[#6C7275] line-through decoration-2">
                  {formatCurrency(product.product.mrp)}
                </span>
                <span className="ml-3 align-middle text-xl text-emerald-500">
                  -{product.product.discount}%
                </span>
              </p>
            </div>

            <div className="space-y-3 border-b border-[#E8ECEF] py-6">
              <p className="font-inter text-base font-normal text-[#343839]">
                Tags
              </p>
              <div className="flex gap-2">
                {product.product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-[#F3F5F7] text-[#141718] text-sm font-inter font-normal rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <p className="font-inter text-base font-semibold text-[#6C7275]">
                  Measurements
                </p>
                <p className="font-inter text-xl font-normal text-[#141718]">
                  {product.product.dimensions}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-b border-[#E8ECEF] py-6 lg:hidden">
              <div className="flex h-10 gap-2 lg:h-[52px]">
                <div className="flex h-full w-1/2 items-center justify-between rounded bg-[#F5F5F5] px-2 md:w-3/5 lg:px-4">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <MinusIcon
                      stroke="#141718"
                      className="h-4 w-4 lg:h-5 lg:w-6"
                    />
                  </button>
                  <span className="font-inter text-sm font-semibold text-[#141718] lg:text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.product.stock}
                    className={quantity >= product.product.stock ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <PlusIcon
                      stroke="#141718"
                      className="h-4 w-4 lg:h-5 lg:w-6"
                    />
                  </button>
                </div>

                <Button
                  variant="ghost"
                  width="full"
                  className="flex h-full items-center justify-center gap-2 rounded border border-[#141718]"
                >
                  <WishlistIcon
                    stroke="#141718"
                    className="h-4 w-4 lg:h-6 lg:w-6"
                  />
                  <span className="font-inter text-sm font-medium text-[#141718] lg:text-base">
                    Wishlist
                  </span>
                </Button>
              </div>

              <Button
                width="full"
                fontSize="sm"
                className="h-10 rounded lg:h-[52px] lg:text-base"
                disabled={product.product.stock === 0}
              >
                {product.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 font-inter text-xs lg:grid-cols-[140px_1fr] lg:text-sm">
              <dt className="text-[#6C7275]">Brand</dt>
              <dd className="text-[#141718]">{product.product.brand}</dd>
              <dt className="text-[#6C7275]">CATEGORY ID</dt>
              <dd className="text-[#141718]">{product.product.categoryId}</dd>
              <dt className="text-[#6C7275]">Weight</dt>
              <dd className="text-[#141718]">{product.product.weight}</dd>
            </dl>
          </div>

          <div className="hidden h-fit flex-col gap-8 rounded border border-[#E8ECEF] p-4 lg:flex">
            <div className="space-y-2">
              <p className="font-poppins font-semibold text-[#141718]">
                Set quantity
              </p>
              <div className="flex items-end justify-between">
                <p className="font-inter text-sm text-[#6C7275]">Subtotal</p>
                <div className="space-y-1 text-right">
                  <p className="font-inter text-sm text-[#6C7275] line-through">
                    {formatCurrency(product.product.mrp * quantity)}
                  </p>
                  <p className="font-poppins text-xl font-semibold text-[#141718]">
                    {formatCurrency(calculateSubtotal())}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 items-center justify-between rounded bg-[#F5F5F5] px-2 lg:px-4">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className={quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <MinusIcon stroke="#141718" className="h-4 w-4 lg:h-5 lg:w-6" />
                </button>
                <span className="font-inter text-sm font-semibold text-[#141718]">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.product.stock}
                  className={quantity >= product.product.stock ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <PlusIcon stroke="#141718" className="h-4 w-4 lg:h-5 lg:w-6" />
                </button>
              </div>
              <Button
                variant="ghost"
                width="full"
                className="flex h-10 items-center justify-center gap-2 rounded border border-[#141718]"
              >
                <WishlistIcon stroke="#141718" className="h-4 w-4" />
                <span className="font-inter text-sm font-medium text-[#141718]">
                  Wishlist
                </span>
              </Button>
              <Button
                width="full"
                fontSize="sm"
                className="h-10 rounded"
                disabled={product.product.stock === 0}
              >
                {product.product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>

        <ProductTab technicalDetails={product.product.technicalDetails} description={product.product.description} id={product.product.id}  />
        
        {/* <ProductRecommendation categoryId={product.product.categoryId} /> */}
        {/* <BestSeller /> */}
        <NewArraival />


      </div>
    </SectionLayout>
  );
}