"use client";

import React from "react";
import { default as NextImage, ImageProps as NextImageProps } from "next/image";
import { VariantProps, cva } from "class-variance-authority";
import { ShoppingCart } from "lucide-react";

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
          "group relative w-full max-w-sm rounded-lg border bg-white shadow-sm transition-all hover:shadow-md",
          className
        )}
        {...props}
      >
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
        "relative h-[300px] overflow-hidden rounded-t-lg bg-gray-50",
        className,
      )}
    >
      {children}
    </div>
  );
};

const ThumbnailBadge: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
      {children}
    </div>
  );
};

const badgeVariants = cva(
  "w-fit rounded px-3.5 py-1 font-inter text-sm uppercase tracking-wide",
  {
    variants: {
      intent: {
        default: "bg-white/90 text-black border border-black/10",
        discount: "bg-emerald-500 text-white font-medium",
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

type WishlistButtonProps = React.HTMLAttributes<HTMLButtonElement>;

const WishlistButton: React.FC<WishlistButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "absolute right-3 top-3 rounded-full bg-white p-2 opacity-0 shadow-md transition-opacity duration-200 ease-out group-hover:opacity-100 hover:bg-gray-50",
        className,
      )}
      {...props}
    >
      <WishlistIcon className="h-5 w-5 text-gray-600" />
    </button>
  );
};

const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <ButtonPrimitive
      className={cn(
        "flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800",
        className
      )}
      {...props}
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
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
      alt={image.alt}
      fill
      className={cn(
        "object-cover object-center transition-transform duration-300 group-hover:scale-105",
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
    <div className={cn("p-4 space-y-2", className)} {...props}>
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
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex gap-0.5">
        {formatRating(ratings).map((rating, index) => (
          <StarIcon
            key={index}
            className={cn(
              "h-5 w-5"
            )}
          />
        ))}
      </div>
      <Text size="sm" color="gray">
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
      size="lg"
      weight={700}
      color="black/800"
      className={cn("line-clamp-1", className)}
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
      size="sm"
      weight={600}
      color="red"
      className={cn("bg-red/10 px-2 py-1 rounded-md", className)}
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
      color="gray"
      className={cn("line-clamp-2", className)}
      {...props}
    >
      {description}
    </Text>
  );
};

type AddToCartButtonProps = Omit<ButtonProps, "children">;

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ className, ...props }) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition-all hover:border-gray-600 hover:bg-gray-900 hover:text-white active:scale-95",
        className
      )}
      aria-label="Add to cart"
      {...props}
    >
      <span>Add to Cart</span>
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
      weight={600}
      color="gray"
      className={cn("line-through", className)}
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