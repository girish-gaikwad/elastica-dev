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
            <div className="space-y-4 px-8 py-10 sm:space-y-8 md:space-y-12 lg:pb-24">
                <Heading
                    as="h2"
                    intent="base-section"
                    className="text-center md:text-left"
                >
                    Best Seller
                </Heading>

                <div className="grid grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-8 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard.Root data={product} key={product.id}>
                            <ProductCard.Thumbnail className="relative">
                                <ProductCard.ThumbnailBadge className="absolute top-3 left-3 flex items-center gap-2">
                                    <ProductCard.Badge>{product?.tags?.[2]}</ProductCard.Badge>
                                    <ProductCard.WishlistButton productId={product.id} className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition" />
                                </ProductCard.ThumbnailBadge>

                                <Link href="/purchase/[id]" as={`/purchase/${product.id}`} className="block">
                                    <ProductCard.Image />
                                </Link>
                            </ProductCard.Thumbnail>


                            <ProductCard.Content className="p-4">
                                <Link href={`/purchase/${product.id}`} className="flex  justify-between">
                                    <ProductCard.Name className="text-md font-semibold text-gray-800 truncate" />
                                    <ProductCard.Discount className="text-gray-500 " />
                                </Link>

                                <Link href={`/purchase/${product.id}`} className="flex items-center justify-between mt-1">
                                    <ProductCard.Ratings className='text-[#ffc156]' />
                                    <div className="flex items-center gap-2">
                                        {product?.discount > 0 && (

                                            <ProductCard.MRP />
                                        )}
                                        <ProductCard.Price />
                                    </div>
                                </Link>
                            </ProductCard.Content>
                            <div className="p-2 w-full flex justify-center">

                                <ProductCard.AddToCartButton
                                    className="px-8 text-sm font-semibold text-white bg-[#d97706] hover:shadow-md active:scale-95 transition-all"

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
