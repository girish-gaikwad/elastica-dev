"use client";

// package
import { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if we're in a mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount
    checkMobile();
    
    // Check on resize
    window.addEventListener("resize", checkMobile);
    
    // Clean up
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [slideRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
    slides: {
      spacing: 12, // Reduced spacing for mobile
      perView: 1.2, // Show partial next slide on mobile
    },
    mode: "snap",
    breakpoints: {
      "(min-width: 480px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
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
    <div className="relative py-6 sm:py-8 px-2 sm:px-4">
      {/* Background gradient effect - mobile optimized */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#f0f8ff]/30 via-white to-[#ffc156]/10 pointer-events-none" />
      
      {loaded && instanceRef.current && !isMobile && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="absolute left-2 sm:left-4 top-1/2 z-10 flex h-8 w-8 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white border border-[#ffc156]/20 shadow-lg transition-all duration-300 hover:border-[#ffc156]/40 hover:bg-[#ffc156]/5 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6 text-[#2c405e]" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - 1
            }
            className="absolute right-2 sm:right-4 top-1/2 z-10 flex h-8 w-8 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white border border-[#ffc156]/20 shadow-lg transition-all duration-300 hover:border-[#ffc156]/40 hover:bg-[#ffc156]/5 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6 text-[#2c405e]" />
          </button>
        </>
      )}
      
      {/* Decorative elements - mobile optimized */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 sm:w-1/3 bg-gradient-to-r from-transparent via-[#ffc156]/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2 sm:w-1/3 bg-gradient-to-r from-transparent via-[#ffc156]/40 to-transparent" />
      
      <div ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <div className="h-full transform transition-transform duration-300 hover:translate-y-[-4px]">
              <ProductCard.Root data={product}>
                <ProductCard.Thumbnail className="relative">
                  <ProductCard.ThumbnailBadge className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-1 sm:gap-2">
                    {product?.tags?.[2] && (
                      <ProductCard.Badge intent="exclusive" className="text-xs sm:text-sm">{product.tags[2]}</ProductCard.Badge>
                    )}
                    <ProductCard.WishlistButton productId={product.id} />
                  </ProductCard.ThumbnailBadge>
                  
                  <Link href="/purchase/[id]" as={`/purchase/${product.id}`} className="block h-full">
                    <ProductCard.Image />
                  </Link>
                </ProductCard.Thumbnail>

                <ProductCard.Content className="p-2 sm:p-3">
                  <Link href={`/purchase/${product.id}`} className="flex justify-between items-center mb-1">
                    <ProductCard.Name className="text-sm sm:text-md font-serif line-clamp-1" />
                    {product?.discount > 0 && (
                      <ProductCard.Discount className="text-xs sm:text-sm" />
                    )}
                  </Link>

                  <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mb-2 sm:mb-3">
                    <ProductCard.Ratings className="scale-90 sm:scale-100 origin-left" />
                    <div className="flex items-center gap-1 sm:gap-2">
                      {product?.discount > 0 && (
                        <ProductCard.MRP className="text-xs sm:text-sm" />
                      )}
                      <ProductCard.Price className="text-sm sm:text-base" />
                    </div>
                  </Link>
                  
                  <ProductCard.AddToCartButton className="mt-1 sm:mt-2 w-full text-sm sm:text-base py-1 sm:py-2" />
                </ProductCard.Content>
              </ProductCard.Root>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide indicator dots - mobile optimized */}
      {loaded && instanceRef.current && (
        <div className="flex justify-center mt-3 sm:mt-6 space-x-1 sm:space-x-2">
          {[...Array(Math.min(instanceRef.current.track.details.slides.length, 10)).keys()].map((idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx 
                  ? "w-4 sm:w-6 bg-[#ffc156]" 
                  : "w-1.5 sm:w-2 bg-[#2c405e]/20 hover:bg-[#2c405e]/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
          {instanceRef.current.track.details.slides.length > 10 && (
            <span className="text-xs text-gray-400 ml-1">...</span>
          )}
        </div>
      )}
    </div>
  );
}