// package
import { createContext, useContext } from "react";

// ui
import { type ProductDataProps } from "@/components/ui/card/productCard";

const ProductCardContext = createContext<ProductDataProps["data"] | null>(null);

type ProductCardProviderProps = React.PropsWithChildren<ProductDataProps>;

export const ProductCardProvider = ({
  children,
  data,
}: ProductCardProviderProps) => {
  return (
    <ProductCardContext.Provider value={data}>
      {children}
    </ProductCardContext.Provider>
  );
};

export const useProductCardContext = () => {
  const data = useContext(ProductCardContext);
  if (!data) throw new Error("useProductCardContext must be used within a ProductCardProvider");
  return {
    ...data,
  };
};
