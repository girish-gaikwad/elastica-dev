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
            <div className="flex h-96 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFC156] border-t-transparent shadow-lg"></div>
            </div>
        );
    }

    return (
        <SectionLayout>
            <div className=" px-6 py-5 sm:px-12 md:space-y-16">
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    <div className="text-center md:text-left">
                        <div className="mb-2 h-1 w-16 bg-[#FFC156] md:mx-0 mx-auto"></div>
                        <Heading as="h2" intent="base-section" className="text-4xl font-bold tracking-tight">
                            Curated Collections
                        </Heading>
                        <p className="mt-2 text-gray-600 max-w-md">Discover our exquisite selection of premium products</p>
                    </div>
                    <Link
                        href="/shop/all"
                        className="group flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-gray-800 transition-colors hover:text-[#FFC156]"
                    >
                        View All Collections
                        <ArrowRightIcon
                            stroke="currentColor"
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:h-[650px]">
                    {categories.map((category, index) => (
                        <Link
                            key={category._id}
                            href={category.categoryId === 'C0000' ? '/coming-soon' : `/shop/${category.categoryId}`}
                            className={`group relative overflow-hidden rounded-none transition-all duration-500 hover:shadow-2xl ${
                                index === 0 ? 'sm:row-span-2' : ''
                            }`}
                        >
                            <div className="absolute inset-0 border border-[#FFC156]/20">
                                <Image
                                    src={category.image.url}
                                    alt={category.image.altText || category.name || "luxury product"}
                                    width={800}
                                    height={1000}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 border-2 border-[#FFC156]"></div>
                            </div>

                            <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8 text-white">
                                <Heading 
                                    as="h3" 
                                    intent="collection-card"
                                    className="text-3xl font-light tracking-wide"
                                >
                                    <span className="block text-sm uppercase tracking-widest text-[#FFC156] mb-2">Collection</span>
                                    {category.name}
                                </Heading>

                                <div className="mt-6 flex items-center gap-2 font-medium text-[#FFC156] group-hover:translate-x-2 transition-transform duration-300">
                                    <span className="uppercase tracking-wider text-sm">Discover</span>
                                    <ArrowRightIcon
                                        stroke="currentColor"
                                        className="h-4 w-4"
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