"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, BadgePercentIcon, TagIcon, TruckIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Promotion = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const categories = {
        home_garden: {
            title: "Home & Garden",
            categoryID:"C1001",
            images: ["https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030350/Elastica/gyc5p8xk2vyyry6insdm.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739029677/Elastica/l41rnpskad2czgxeb8b8.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030372/Elastica/ajhgaq3wiyffoc28lsgj.png"],
            benefits: [
                {
                    icon: <BadgePercentIcon className="h-8 w-8 text-emerald-500" />,
                    title: "20% OFF",
                    description: "On all home essentials",
                },
                {
                    icon: <TruckIcon className="h-8 w-8 text-purple-500" />,
                    title: "Free Delivery",
                    description: "On orders over $50",
                },
                {
                    icon: <TagIcon className="h-8 w-8 text-pink-500" />,
                    title: "Exclusive Deals",
                    description: "Limited-time home offers",
                },
            ],
        },
        sports_fitness: {
            title: "Sports & Fitness",
            categoryID:"C1002",
            images: ["https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030368/Elastica/oi2abtirzbyevwfdfcvd.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030369/Elastica/khwunjtwlz7kvegahdwn.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030368/Elastica/ucdgmj5p9ftnzejt4ed4.png"],
            benefits: [
                {
                    icon: <BadgePercentIcon className="h-8 w-8 text-emerald-500" />,
                    title: "30% OFF",
                    description: "On gardening tools",
                },
                {
                    icon: <TruckIcon className="h-8 w-8 text-purple-500" />,
                    title: "Next-Day Delivery",
                    description: "On select garden products",
                },
                {
                    icon: <TagIcon className="h-8 w-8 text-pink-500" />,
                    title: "Seasonal Offers",
                    description: "Limited-time gardening discounts",
                },
            ],
        },
    };

    const categoryKeys = Object.keys(categories);
    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const selectedCategory = categories[randomCategoryKey];
    const randomImage = selectedCategory.images[Math.floor(Math.random() * selectedCategory.images.length)];

    return (
        <div className={`bg-gradient-to-br from-slate-900 to-slate-800  overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-0 h-[500px]">
                {/* Left Column - Image and Overlay */}
                <div className="relative h-full min-h-[400px] overflow-hidden">
                    <Image
                        width={400}
                        height={400}
                        src={randomImage}
                        alt={selectedCategory.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
                    <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-10">
                        <div className="inline-block px-4 py-1 bg-emerald-500 rounded-full text-sm font-medium text-white mb-4">
                            Limited Time Offer
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                            {selectedCategory.title} <br />
                            <span className="text-emerald-400">Super Sale</span>
                        </h2>
                        <p className="text-lg text-slate-200 mb-8 max-w-md">
                            Discover extraordinary deals on premium {selectedCategory.title.toLowerCase()} products
                        </p>
                    </div>
                </div>

                {/* Right Column - Benefits and CTA */}
                <div className="p-8 md:p-12">
                    <div className="space-y-8 mb-12">
                        {selectedCategory.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className={`transform transition-all duration-500 delay-${index * 200} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                            >
                                <div className="flex items-center space-x-6 group cursor-pointer">
                                    <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-slate-400 group-hover:text-slate-300 transition-colors">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`text-center transform transition-all duration-500 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <button className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white bg-emerald-500 rounded-full overflow-hidden transition-all duration-300 hover:bg-emerald-600">
                            <Link href={`/shop/${selectedCategory.categoryID}`} passHref>
                                <span className="relative z-10">Shop Now</span>
                            </Link>
                            <ArrowRightIcon className="ml-2 h-5 w-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotion;