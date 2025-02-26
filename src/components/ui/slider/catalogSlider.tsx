"use client";

// package
import { useState } from "react";
import { useKeenSlider } from "keen-slider/react";

// ui
import * as ProductCard from "@/components/ui/card/productCard";

// data
import products from "@/data/product.json";

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
      spacing: 8,
      perView: 2,
    },
    mode: "snap",
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 3,
          spacing: 16,
        },
        mode: "free-snap",
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4,
          spacing: 16,
        },
        mode: "free-snap",
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 5,
          spacing: 16,
        },
        mode: "free-snap",
      },
    },
    renderMode: "performance",
  });

  return (
    <div className="relative">
      {loaded && instanceRef.current && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition duration-300 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            <ChevronLeft className="h-6 w-6 text-emerald-600" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition duration-300 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-white"
          >
            <ChevronRight className="h-6 w-6 text-emerald-600" />
          </button>
        </>
      )}
      <div ref={slideRef} className="keen-slider">
        {products.map((product) => (
          <div key={product.id} className="keen-slider__slide">
            <ProductCard.Root data={product}>
              <ProductCard.Thumbnail className="relative">
                <ProductCard.ThumbnailBadge className="absolute top-3 left-3 flex items-center gap-2">
                  <ProductCard.Badge>{product?.tags?.[2]}</ProductCard.Badge>
                  <ProductCard.WishlistButton className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition" />
                </ProductCard.ThumbnailBadge>

                <Link href="/purchase/[id]" as={`/purchase/${product.id}`} className="block">
                  <ProductCard.Image />
                </Link>
              </ProductCard.Thumbnail>


              <ProductCard.Content className="p-4">
                <Link href={`/purchase/${product.id}`} className="flex  justify-between">
                  <ProductCard.Name className="text-lg font-semibold text-gray-800 truncate" />
                  <ProductCard.Discount className="text-gray-500 " />
                </Link>

                <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mt-1">
                  <ProductCard.Ratings />
                  <div className="flex items-center gap-2">

                    <ProductCard.MRP />
                    <ProductCard.Price />
                  </div>
                </Link>
              </ProductCard.Content>
              <div className="p-2 w-full flex justify-center">

                <ProductCard.AddToCartButton
                  className="px-8"
                  onClick={() => {
                    fetch("/api/cart", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ productId: product.id }),
                    });
                  }}
                />
              </div>

            </ProductCard.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
