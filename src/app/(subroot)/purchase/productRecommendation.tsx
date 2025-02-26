// "use client";

// import { useState, useEffect } from "react";

// // ui
// import * as ProductCard from "@/components/ui/card/productCard";
// import Link from "next/link";

// const ProductRecommendation = ({ categoryId }) => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       try {
//         const payload = {
//           categoryId: categoryId,
//           limit: 10,
//         };

//         const response = await fetch("/api/get_productsCt", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });

//         if (!response.ok) {
//           throw new Error(`Error: ${response.status}`);
//         }

//         const data = await response.json();
//         setProducts(data);
//         setError(null);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//         setError("Failed to load product recommendations");
//         // Fallback to empty array if there's an error
//         setProducts([]);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [categoryId]);

//   if (isLoading) {
//     return (
//       <div className="space-y-10 lg:space-y-12">
//         <h2 className="font-poppins text-[28px] font-medium text-[#141718]">
//           You might also like
//         </h2>
//         <div className="flex items-center justify-center py-12">
//           <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="space-y-10 lg:space-y-12">
//         <h2 className="font-poppins text-[28px] font-medium text-[#141718]">
//           You might also like
//         </h2>
//         <div className="rounded-lg bg-red-50 p-4 text-red-800">
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="space-y-10 lg:space-y-12">
//         <h2 className="font-poppins text-[28px] font-medium text-[#141718]">
//           You might also like
//         </h2>
//         <div className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
//           No product recommendations available at this time.
//         </div>
//       </div>
//     );
//   }

//   console.log(products.data.Products, "car")
//   return (
//     <div className="space-y-10 lg:space-y-12">
//       <h2 className="font-poppins text-[28px] font-medium text-[#141718]">
//         You might also like
//       </h2>

//       <div className="flex flex-nowrap gap-4 overflow-x-scroll pb-10 scrollbar scrollbar-track-[#E8ECEF] scrollbar-thumb-[#343839] scrollbar-track-rounded-full scrollbar-thumb-rounded-full scrollbar-h-2 lg:pb-12">
//       {products.data.Products.map((product) => (
//                         <ProductCard.Root data={product} key={product.id}>
//                             <ProductCard.Thumbnail className="relative">
//                                 <ProductCard.ThumbnailBadge className="absolute top-3 left-3 flex items-center gap-2">
//                                     <ProductCard.Badge>{product?.tags?.[2]}</ProductCard.Badge>
//                                     <ProductCard.WishlistButton className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition" />
//                                 </ProductCard.ThumbnailBadge>

//                                 <Link href="/purchase/[id]" as={`/purchase/${product.id}`} className="block">
//                                     {/* <ProductCard.Image /> */}
//                                 </Link>
//                             </ProductCard.Thumbnail>


//                             <ProductCard.Content className="p-4">
//                                 <Link href={`/purchase/${product.id}`} className="flex  justify-between">
//                                     <ProductCard.Name className="text-lg font-semibold text-gray-800 truncate" />
//                                     <ProductCard.Discount className="text-gray-500 " />
//                                 </Link>

//                                 <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mt-1">
//                                     <div className="flex items-center justify-between  w-full gap-2">

//                                         <ProductCard.MRP />
//                                         <ProductCard.Price />
//                                     </div>
//                                 </Link>
//                             </ProductCard.Content>
//                             <div className="p-2 w-full flex justify-center">

//                                 <ProductCard.AddToCartButton
//                                     className="px-8"
//                                     onClick={() => {
//                                         fetch("/api/cart", {
//                                             method: "POST",
//                                             headers: {
//                                                 "Content-Type": "application/json",
//                                             },
//                                             body: JSON.stringify({ productId: product.id }),
//                                         });
//                                     }}
//                                 />
//                             </div>

//                         </ProductCard.Root>
//                     ))}
//       </div>
//     </div>
//   );
// };

// export default ProductRecommendation;

