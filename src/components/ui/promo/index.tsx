"use client";

// package
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ui
import { ArrowRightIcon, CloseIcon, DiscountIcon } from "@/components/ui/assets/svg";

// hooks
import { useRootContext } from "@/hooks/rootContext";

// lib
import { cn } from "@/lib/utils";

export default function PromoSection() {
  const router = useRouter();
  const isRootPage = useRootContext();
  const [showPromo, setShowPromo] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Handle initial fade-in and automatic disappearance after 10 seconds
  useEffect(() => {
    // Fade in animation when component mounts
    const fadeInTimer = setTimeout(() => {
      const element = document.getElementById("promo-content");
      if (element) {
        element.classList.add("opacity-100");
        element.classList.remove("opacity-0");
      }
    }, 300);

    // Auto disappear after 10 seconds
    const disappearTimer = setTimeout(() => {
      handleFadeOut();
    }, 10000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(disappearTimer);
    };
  }, []);

  // Handle fade out animation before removing from DOM
  const handleFadeOut = () => {
    // First fade out
    setIsVisible(false);
    
    // Then remove from DOM after animation completes
    setTimeout(() => {
      setShowPromo(false);
    }, 500); // Match this with the transition duration
  };

  const handlePromoClick = () => {
    router.push("/shop/all");
  };

  return (
    <div
      className={cn(
        isRootPage ? "bg-[#0A0A0A]" : "bg-gradient-to-r from-[#F8F9FA] to-[#F3F5F7]",
        !showPromo && "hidden",
        "transition-all duration-300"
      )}
    >
      <div 
        className={cn(
          "relative mx-auto flex max-w-[1440px] justify-center px-8 py-3",
          !isVisible && "opacity-0 transform -translate-y-2",
          "transition-all duration-500 ease-in-out"
        )}
      >
        {/* promo content */}
        <div 
          id="promo-content"
          className={cn(
            "flex cursor-pointer gap-6 opacity-0 transition-opacity duration-500",
            "rounded-full px-4 py-2"
          )}
          onClick={handlePromoClick}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              isRootPage ? "bg-[#FFAB00]" : "bg-[#377DFF]"
            )}>
              <DiscountIcon
                fill="#FFFFFF"
                className="h-4 w-4 md:h-5 md:w-5"
              />
            </div>

            <p
              className={cn(
                "flex items-center gap-3 font-inter text-xs font-semibold md:text-sm lg:text-base",
                isRootPage ? "text-[#FEFEFE]" : "text-[#141718]"
              )}
            >
              <span className="tracking-wide">30% OFF STOREWIDE — LIMITED TIME</span>
              <span
                className={cn(
                  "hidden items-center gap-1 border-b font-medium md:flex",
                  isRootPage
                    ? "border-[#FFAB00] text-[#FFAB00]"
                    : "border-[#377DFF] text-[#377DFF]"
                )}
              >
                SHOP NOW
                <ArrowRightIcon
                  className="h-5 w-5"
                  stroke={cn(isRootPage ? "#FFAB00" : "#377DFF")}
                />
              </span>
            </p>
          </div>
        </div>

        {/* close button (all sizes) */}
        <div className="absolute bottom-0 right-8 flex h-full items-center">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleFadeOut();
            }}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full",
              isRootPage ? "bg-[#1A1A1A]" : "bg-[#E5E7EB]"
            )}
          >
            <CloseIcon 
              className="h-3 w-3" 
              fill={isRootPage ? "#FEFEFE" : "#343839"} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}