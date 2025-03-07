"use client";

import React, { useEffect, useState } from "react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import { VariantProps, cva } from "class-variance-authority";
import { ShoppingCart, Heart } from "lucide-react";

// ui
import ButtonPrimitive, { ButtonProps } from "@/components/ui/button";
import Text, { TextProps } from "@/components/ui/text";
import { StarIcon, WishlistIcon } from "@/components/ui/assets/svg";

// lib
import { cn, formatCurrency, formatRating } from "@/lib/utils";
import { addToWishlist, removeFromWishlist, addToCart, getWishlist } from "@/lib/cartWishlistUtils";

// hooks
import {
  ProductCardProvider,
  useProductCardContext,
} from "@/hooks/productCardContext";

export type ProductDataProps = {
  data: {
    id: number;
    image: {
      url: string;
      alt: string;
    };
    name: string;
    ratings: number;
    price: number;
    description: string;
  };
};

interface RootProps
  extends React.HTMLAttributes<HTMLDivElement>,
  ProductDataProps { }

const Root: React.FC<RootProps> = ({ data, className, children, ...props }) => {
  return (
    <ProductCardProvider data={data}>
      <div
        className={cn(
          "group relative w-full max-w-sm overflow-hidden rounded-xl border border-[#22c55e]/30 bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#22c55e]/10 hover:translate-y-[-4px]",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8f9ff] to-white opacity-50 pointer-events-none" />
        {children}
      </div>
    </ProductCardProvider>
  );
};

type ThumbnailProps = React.PropsWithChildren<{ className?: string }>;

const Thumbnail: React.FC<ThumbnailProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "relative h-[320px] overflow-hidden bg-[#f0f8ff]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-[#e0f2ff]/30 to-transparent pointer-events-none z-10" />
      {children}
    </div>
  );
};

const ThumbnailBadge: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
      {children}
    </div>
  );
};

const badgeVariants = cva(
  "w-fit rounded-md px-3.5 py-1.5 font-inter text-xs uppercase tracking-wider font-semibold",
  {
    variants: {
      intent: {
        default: "bg-white/95 text-[#2c405e] border border-[#22c55e]/20 shadow-sm backdrop-blur-sm",
        discount: "bg-gradient-to-r from-[#22c55e] to-[#22c55e] text-[#2c405e]",
        new: "bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#2c405e]",
        exclusive: "bg-gradient-to-r from-[#2c405e] to-[#15273e] text-[#22c55e]",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  },
);

interface BadgeProps
  extends BadgeVariants,
  React.HTMLAttributes<HTMLDivElement> { }

const Badge: React.FC<BadgeProps> = ({
  intent,
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ intent, className }))} {...props}>
      {children}
    </div>
  );
};

type WishlistButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  productId: string | number;
};

const WishlistButton: React.FC<WishlistButtonProps> = ({
  className,
  productId,
  ...props
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const wishlist = await getWishlist();
        setIsInWishlist(wishlist.includes(productId));
      } catch (error) {
        console.error("Failed to check wishlist:", error);
      }
    };

    checkWishlist();
  }, [productId]);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Prevent triggering card click
    
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  return (
    <button
      className={cn(
        "absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2.5 shadow-md backdrop-blur-sm transition-all duration-300 ease-out opacity-0 group-hover:opacity-100 hover:bg-white border border-[#22c55e]/20 hover:border-[#22c55e]/40 hover:shadow-lg",
        isLoading ? "cursor-not-allowed" : "hover:scale-110 active:scale-95",
        isInWishlist ? "bg-[#22c55e]/10" : "",
        className,
      )}
      onClick={handleWishlistToggle}
      disabled={isLoading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      {...props}
    >
      <Heart 
        className={cn(
          "h-5 w-5 transition-colors",
          isInWishlist ? "fill-[#22c55e] text-[#22c55e]" : "text-[#2c405e]"
        )}
      />
    </button>
  );
};

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <ButtonPrimitive
      className={cn(
        "flex items-center justify-center rounded-lg bg-[#2c405e] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#15273e] hover:shadow-md active:scale-95",
        className
      )}
      {...props}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {children}
    </ButtonPrimitive>
  );
};

type ImageProps = Omit<NextImageProps, "url" | "alt">;

const Image: React.FC<ImageProps> = ({ className, ...props }) => {
  const { image } = useProductCardContext();

  return (
    <NextImage
      src={image.url}
      alt={image.alt || "luxury product"}
      fill
      className={cn(
        "object-cover object-center transition-transform duration-500 group-hover:scale-105",
        className,
      )}
      {...props}
    />
  );
};

const Content: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("px-6 py-5 space-y-3 relative", className)} {...props}>
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent"></div>
      {children}
    </div>
  );
};

type RatingsProps = {
  className?: string;
};

const Ratings: React.FC<RatingsProps> = ({ className }) => {
  const { ratings } = useProductCardContext();

  if (ratings == 0) {
    return (
      <Text size="sm" color="gray" className={className}>
        No ratings yet
      </Text>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex gap-0.5">
        {formatRating(ratings).map((rating, index) => (
          <StarIcon
            key={index}
            className={cn(
              "h-4 w-4 text-[#22c55e]"
            )}
          />
        ))}
      </div>
      <Text size="xs" weight={500} color="gray/600">
        ({ratings})
      </Text>
    </div>
  );
};

type NameProps = Omit<TextProps, "children">;

const Name: React.FC<NameProps> = ({ className, ...props }) => {
  const { name } = useProductCardContext();

  return (
    <Text
      size="lg"
      weight={600}
      color="black/900"
      className={cn("line-clamp-1 font-serif text-[#2c405e]", className)}
      {...props}
    >
      {name}
    </Text>
  );
};

type PriceProps = Omit<TextProps, "children">;

const Price: React.FC<PriceProps> = ({ className, ...props }) => {
  const { finalPrice } = useProductCardContext();

  return (
    <Text
      size="lg"
      weight={700}
      color="black/900"
      className={cn("line-clamp-1 text-[#2c405e]", className)}
      {...props}
    >
      {formatCurrency(finalPrice)}
    </Text>
  );
};

type DiscountProps = Omit<TextProps, "children">;

const Discount: React.FC<DiscountProps> = ({ className, ...props }) => {
  const { discount } = useProductCardContext();

  if (!discount) return null;

  return (
    <Text
      size="xs"
      weight={700}
      color="[#2c405e]"
      className={cn("bg-[#22c55e] px-2.5 py-1 rounded-md inline-block", className)}
      {...props}
    >
      -{discount}%
    </Text>
  );
};

type DescriptionProps = Omit<TextProps, "children">;

const Description: React.FC<DescriptionProps> = ({ className, ...props }) => {
  const { description } = useProductCardContext();

  return (
    <Text
      size="sm"
      weight={400}
      color="gray/600"
      className={cn("line-clamp-2", className)}
      {...props}
    >
      {description}
    </Text>
  );
};

type AddToCartButtonProps = Omit<ButtonProps, "children"> & {
  productId?: string | number;
  quantity?: number;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  className, 
  productId,
  quantity = 1,
  ...props 
}) => {
  const context = useProductCardContext();
  const [isLoading, setIsLoading] = useState(false);
  
  // If productId is not explicitly provided, use the one from context
  const id = productId || context.id;

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent triggering card click
    
    if (!id) return;
    
    setIsLoading(true);
    try {
      await addToCart(id.toString(), quantity);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={cn(
        "w-full bg-gradient-to-r from-[#22c55e] to-[#22c55e] text-[#2c405e] border-none px-6 py-3 text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#22c55e]/20 active:scale-98 font-serif",
        isLoading ? "opacity-80 cursor-not-allowed" : "",
        className
      )}
      aria-label="Add to cart"
      onClick={handleAddToCart}
      disabled={isLoading}
      {...props}
    >
      <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
    </Button>
  );
};

type MRPProps = Omit<TextProps, "children">;

const MRP: React.FC<MRPProps> = ({ className, ...props }) => {
  const { mrp } = useProductCardContext();

  if (!mrp) return null;

  return (
    <Text
      size="xs"
      weight={500}
      color="gray/500"
      className={cn("line-through text-gray-500", className)}
      {...props}
    >
      {formatCurrency(mrp)}
    </Text>
  );
};

export {
  Root,
  Thumbnail,
  ThumbnailBadge,
  Badge,
  WishlistButton,
  Image,
  Button,
  Content,
  Ratings,
  Name,
  Price,
  Description,
  AddToCartButton,
  Discount,
  MRP,
};