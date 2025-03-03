'use client';

import React, { useEffect, useState } from 'react';
import SectionLayout from '@/layouts/sectionLayout';
import Heading from '../ui/head';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon } from '../ui/assets/svg';

const Collection = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('/api/get_collections');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-64 sm:h-96 items-center justify-center">
                <div className="h-8 w-8 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-[#FFC156] border-t-transparent shadow-lg"></div>
            </div>
        );
    }

    return (
        <SectionLayout>
            <div className="px-4 py-4 sm:px-6 md:px-12 md:py-5 lg:space-y-16 space-y-8">
                <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
                    <div className="text-center md:text-left">
                        <div className="mb-2 h-1 w-12 sm:w-16 bg-[#FFC156] mx-auto md:mx-0"></div>
                        <Heading 
                            as="h2" 
                            intent="base-section" 
                            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
                        >
                            Curated Collections
                        </Heading>
                        <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-md">
                            Discover our exquisite selection of premium products
                        </p>
                    </div>
                    
                    <Link
                        href="/shop/all"
                        className="group flex items-center gap-2 text-xs sm:text-sm font-medium uppercase tracking-wider text-gray-800 transition-colors hover:text-[#FFC156]"
                    >
                        View All Collections
                        <ArrowRightIcon
                            stroke="currentColor"
                            className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:h-[650px]">
                    {categories.map((category, index) => (
                        <Link
                            key={category._id}
                            href={category.categoryId === 'C0000' ? '/coming-soon' : `/shop/${category.categoryId}`}
                            className={`group relative overflow-hidden rounded-none transition-all duration-500 hover:shadow-2xl ${
                                index === 0 ? 'sm:row-span-2' : ''
                            }`}
                        >
                            <div className="absolute inset-0 border border-[#FFC156]/20">
                                <div className="relative h-full w-full">
                                    <Image
                                        src={category.image.url}
                                        alt={category.image.altText || category.name || "luxury product"}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority={index === 0}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 border-[#FFC156]"></div>
                            </div>

                            <div className="relative flex h-full min-h-[220px] xs:min-h-[260px] sm:min-h-[280px] md:min-h-[320px] flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
                                <Heading 
                                    as="h3" 
                                    intent="collection-card"
                                    className="text-xl sm:text-2xl md:text-3xl font-light tracking-wide"
                                >
                                    <span className="block text-xs sm:text-sm uppercase tracking-widest text-[#FFC156] mb-1 sm:mb-2">
                                        Collection
                                    </span>
                                    {category.name}
                                </Heading>

                                <div className="mt-3 sm:mt-4 md:mt-6 flex items-center gap-1 sm:gap-2 font-medium text-[#FFC156] group-hover:translate-x-2 transition-transform duration-300">
                                    <span className="uppercase tracking-wider text-xs sm:text-sm">Discover</span>
                                    <ArrowRightIcon
                                        stroke="currentColor"
                                        className="h-3 w-3 sm:h-4 sm:w-4"
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </SectionLayout>
    );
};

export default Collection;