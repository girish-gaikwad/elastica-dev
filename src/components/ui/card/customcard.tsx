"use client";

// package
import React, { useEffect, useState } from "react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import { VariantProps, cva } from "class-variance-authority";

// ui
import ButtonPrimitive, { ButtonProps } from "@/components/ui/button";
import Text, { TextProps } from "@/components/ui/text";
import { StarIcon, WishlistIcon } from "@/components/ui/assets/svg";

// lib
import { cn, formatCurrency, formatRating } from "@/lib/utils";

// hooks
import {
  ProductCardProvider,
  useProductCardContext,
} from "@/hooks/productCardContext";
import { addToCart, addToWishlist, getWishlist, removeFromWishlist } from "@/lib/cartWishlistUtils";

export type ProductDataProps = {
  data: {
    id: number;
    image: {
      url: string;
      alt: string;
    };
    name: string;
    rating: number;
    price: number;
    description: string;
  };
};

interface RootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ProductDataProps {}

const Root: React.FC<RootProps> = ({ data, className, children, ...props }) => {
  return (
    <ProductCardProvider data={data}>
      <div className={cn("grid grid-cols-1 gap-3", className)} {...props}>
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
        "group relative flex h-[308px] w-full flex-col justify-between overflow-hidden bg-[#F3F5F7] p-3.5",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ThumbnailBadge: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="z-10 flex items-start justify-between">{children}</div>
  );
};

type BadgeVariants = VariantProps<typeof badgeVariants>;

const badgeVariants = cva(
  "w-fit rounded px-3.5 py-1 font-inter text-base font-bold uppercase",
  {
    variants: {
      intent: {
        default: "bg-white text-black",
        discount: "bg-[#38CB89] text-[#FEFEFE]",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  },
);

interface BadgeProps
  extends BadgeVariants,
    React.HTMLAttributes<HTMLDivElement> {}

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

type WishlistButtonProps = React.HTMLAttributes<HTMLButtonElement>;

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
        "shadow-[rgba(15, 15, 15, 0.12)] flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-opacity duration-100 ease-out group-hover:opacity-100",
        className,
      )}
      onClick={handleWishlistToggle}
      disabled={isLoading}

      {...props}
    >
      <WishlistIcon className="h-5 w-5" />
    </button>
  );
};

type AddToCartButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  productId: string | number;
  quantity?: number;
};

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  className,
  productId,
  quantity = 1,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent triggering card click
    if (!productId) return;
    setIsLoading(true);
    try {
      await addToCart(productId.toString(), quantity);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className={cn(
        "w-full bg-gradient-to-r from-[#22c55e] to-[#22c55e] text-[#2c405e] border-none px-6 py-3 text-sm font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#22c55e]/20 active:scale-98 font-serif",
        isLoading ? "opacity-80 cursor-not-allowed" : "",
        className,
      )}
      onClick={handleAddToCart}
      disabled={isLoading}
      {...props}
    >
      <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
    </button>
  );
};

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <ButtonPrimitive {...props}>{children}</ButtonPrimitive>;
};

type ImageProps = Omit<NextImageProps, "url" | "alt">;

const Image: React.FC<ImageProps> = ({
  width = 231,
  height = 308,
  className,
  src,
  alt,
  ...props
}) => {
  // const { image } = useProductCardContext();

  return (
    <NextImage
      src={src}
      width={width}
      height={height}
      alt={alt ||"elasticaProduct"}
      className={cn(
        "absolute left-0 top-0 z-0 h-full w-full object-cover",
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
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
};

type RatingsProps = {
  className?: string;
  value: number
};

const Ratings: React.FC<RatingsProps> = ({ className,value }) => {
  // const { rating } = useProductCardContext();

  if (value == 0) {
    return (
      <Text size="sm" color="gray" className={className}>
        No ratings yet
      </Text>
    );
  }
  return (
    <div className="flex gap-0.5">
      {formatRating(value).map((value) => (
        <StarIcon key={value} className={cn("h-4 w-4", className)} />
      ))}
    </div>
  );
};

type NameProps = Omit<TextProps, "children">;

const Name: React.FC<NameProps> = ({ className, ...props }) => {
  const { name } = useProductCardContext();

  return (
    <Text
      weight={600}
      color="black/800"
      className={cn("line-clamp-1", className)}
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
      size="sm"
      weight={600}
      color="black/800"
      className={cn("line-clamp-1", className)}
      {...props}
    >
      {formatCurrency(finalPrice)}
    </Text>
  );
};

type MRPProps = Omit<TextProps, "children">;

const MRP: React.FC<MRPProps> = ({ className, ...props }) => {
  const { mrp } = useProductCardContext();

  if (!mrp) return null;

  return (
    <Text
      size="xs"
      weight={600}
      color="gray"
      className={cn("line-through", className)}
      {...props}
    >
      {formatCurrency(mrp)}
    </Text>
  );
};

type DescriptionProps = Omit<TextProps, "children">;

const Description: React.FC<DescriptionProps> = ({ className, ...props }) => {
  const { description } = useProductCardContext();

  return (
    <Text
      size="xs"
      weight={400}
      color="gray"
      className={cn(className)}
      {...props}
    >
      {description}
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
  MRP,
  AddToCartButton
};
