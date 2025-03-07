"use client";
import SectionLayout from '@/layouts/sectionLayout'
import React, { useEffect, useState } from 'react'
import Heading from '../ui/head'
import * as ProductCard from "@/components/ui/card/productCard";
import Link from 'next/link';

function BestSeller() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);

                // If no new arrivals, fetch featured products
                const featuredResponse = await fetch('/api/get_featuredProducts');
                const featuredData = await featuredResponse.json();
                setProducts(featuredData);

            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error('Error fetching products:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (isLoading) {
        return (
            <SectionLayout>
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout>
                <div className="text-center text-red-600 py-8">{error}</div>
            </SectionLayout>
        );
    }

    return (
        <SectionLayout>
            <div className="space-y-4 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10  lg:pb-16 xl:pb-24">
                <Heading
                    as="h2"
                    intent="base-section"
                    className="text-center md:text-left text-xl sm:text-2xl md:text-3xl"
                >
                    Best Seller
                </Heading>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
                    {products.map((product) => (
                        <ProductCard.Root data={product} key={product.id} className="flex flex-col h-full transition-transform hover:scale-102">
                            <ProductCard.Thumbnail className="relative overflow-hidden">
                                <ProductCard.ThumbnailBadge className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 sm:gap-2 z-10">
                                    {product?.tags?.[2] && (
                                        <ProductCard.Badge className="text-xs sm:text-sm">{product?.tags?.[2]}</ProductCard.Badge>
                                    )}
                                    <ProductCard.WishlistButton 
                                        productId={product.id} 
                                        className="p-1.5 sm:p-2 bg-white/90 rounded-full shadow hover:bg-white transition" 
                                    />
                                </ProductCard.ThumbnailBadge>

                                <Link href={`/purchase/${product.id}`} className="block aspect-square">
                                    <ProductCard.Image className="h-full w-full object-cover transition-transform hover:scale-105" />
                                </Link>
                            </ProductCard.Thumbnail>

                            <ProductCard.Content className="p-2 sm:p-3 md:p-4 flex-grow">
                                <Link href={`/purchase/${product.id}`} className="flex justify-between items-start">
                                    <ProductCard.Name className="text-sm sm:text-md font-semibold text-gray-800 truncate flex-1 mr-2" />
                                    <ProductCard.Discount className="text-xs sm:text-sm text-gray-500 whitespace-nowrap" />
                                </Link>

                                <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mt-1 sm:mt-2">
                                    <ProductCard.Ratings className="text-[#22c55e] text-xs sm:text-sm flex-shrink-0" />
                                    <div className="flex items-center gap-1 sm:gap-2 ml-1">
                                        {product?.discount > 0 && (
                                            <ProductCard.MRP className="text-xs sm:text-sm" />
                                        )}
                                        <ProductCard.Price className="text-sm sm:text-base font-medium" />
                                    </div>
                                </Link>
                            </ProductCard.Content>
                            
                            <div className="p-2 w-full flex justify-center mt-auto">
                                <ProductCard.AddToCartButton
                                    className="w-full sm:w-auto sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-[#22c55e] hover:bg-[#3ead46] hover:shadow-md active:scale-95 transition-all rounded-sm sm:rounded"
                                />
                            </div>
                        </ProductCard.Root>
                    ))}
                </div>
            </div>
        </SectionLayout>
    )
}

export default BestSeller