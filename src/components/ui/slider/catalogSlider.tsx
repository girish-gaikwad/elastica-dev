"use client";

// package
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";

// ui
import * as ProductCard from "@/components/ui/card/productCard";

// css
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CatalogSlider({ products }) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [slideRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      spacing: 16,
      perView: 2,
    },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 24,
        },
        mode: "free-snap",
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 24,
        },
        mode: "free-snap",
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 5,
          spacing: 24,
        },
        mode: "free-snap",
      },
    },
    renderMode: "performance",
  });

  return (
    <div className="relative py-8 px-2">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f0f8ff]/30 via-white to-[#ffc156]/10 pointer-events-none" />
      
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white border border-[#ffc156]/20 shadow-lg transition-all duration-300 hover:border-[#ffc156]/40 hover:bg-[#ffc156]/5 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-[#2c405e]" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - 1
            }
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white border border-[#ffc156]/20 shadow-lg transition-all duration-300 hover:border-[#ffc156]/40 hover:bg-[#ffc156]/5 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-[#2c405e]" />
          </button>
        </>
      )}
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-[#ffc156]/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/3 bg-gradient-to-r from-transparent via-[#ffc156]/40 to-transparent" />
      
      <div ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide ">
            <div className="h-full transform transition-transform duration-300 hover:translate-y-[-4px]">
              <ProductCard.Root data={product}>
                <ProductCard.Thumbnail className="relative">
                  <ProductCard.ThumbnailBadge className="absolute top-4 left-4 flex items-center gap-2">
                    {product?.tags?.[2] && (
                      <ProductCard.Badge intent="exclusive">{product.tags[2]}</ProductCard.Badge>
                    )}
                    <ProductCard.WishlistButton productId={product.id} />
                  </ProductCard.ThumbnailBadge>
                  
                  <Link href="/purchase/[id]" as={`/purchase/${product.id}`} className="block h-full">
                    <ProductCard.Image />
                  </Link>
                </ProductCard.Thumbnail>

                <ProductCard.Content>
                  <Link href={`/purchase/${product.id}`} className="flex justify-between items-center mb-1">
                    <ProductCard.Name className="text-md font-serif" />
                    {product?.discount >0 && (
                      
                    <ProductCard.Discount />
                    )}
                  </Link>

                  <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mb-3">
                    <ProductCard.Ratings />
                    <div className="flex items-center gap-2">
                    {product?.discount >0 && (
                      <ProductCard.MRP />
                    )}
                      <ProductCard.Price />
                    </div>
                  </Link>
                  
                  <ProductCard.AddToCartButton className="mt-2" />
                </ProductCard.Content>
              </ProductCard.Root>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide indicator dots */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? "w-6 bg-[#ffc156]" 
                  : "bg-[#2c405e]/20 hover:bg-[#2c405e]/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}