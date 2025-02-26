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
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <SectionLayout>
            <div className="space-y-8 px-4 py-16 sm:px-8 md:space-y-12">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                    <Heading as="h2" intent="base-section" className="text-3xl font-bold">
                        Shop Collection
                    </Heading>
                    <Link
                        href="/shop/all"
                        className="group flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary"
                    >
                        View All Collections
                        <ArrowRightIcon
                            stroke="currentColor"
                            className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:h-[600px]">
                    {categories.map((category, index) => (
                        <Link
                            key={category._id}
                            href={category.categoryId === 'C0000' ? '/coming-soon' : `/shop/${category.categoryId}`}
                            className={`group relative overflow-hidden rounded-lg bg-gray-100 transition-transform hover:scale-[1.02] ${index === 0 ? 'sm:row-span-2' : ''
                                }`}
                        >
                            <div className="absolute inset-0 border-2">
                                <Image
                                    src={category.image.url}
                                    alt={category.image.altText || category.name}
                                    width={800}
                                    height={1000}
                                    className="h-full w-full object-cover rounded-lg  transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <div className="relative flex h-full min-h-[280px] flex-col justify-end p-6 text-white">
                                <Heading as="h3" intent="collection-card">
                                    {category.name}
                                </Heading>

                                <div className="mt-4 flex items-center gap-2 font-bold underline text-emerald-500">
                                    <span>Explore Collection</span>
                                    <ArrowRightIcon
                                        stroke="currentColor"
                                        className="h-4 w-4 transition-transform group-hover:translate-x-2"
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