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
            categoryID: "C1001",
            images: ["https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030350/Elastica/gyc5p8xk2vyyry6insdm.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739029677/Elastica/l41rnpskad2czgxeb8b8.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030372/Elastica/ajhgaq3wiyffoc28lsgj.png"],
            benefits: [
                {
                    icon: <BadgePercentIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "20% OFF",
                    description: "On all home essentials",
                },
                {
                    icon: <TruckIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "Free Delivery",
                    description: "On orders over $50",
                },
                {
                    icon: <TagIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "Exclusive Deals",
                    description: "Limited-time home offers",
                },
            ],
        },
        sports_fitness: {
            title: "Sports & Fitness",
            categoryID: "C1002",
            images: ["https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030368/Elastica/oi2abtirzbyevwfdfcvd.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030369/Elastica/khwunjtwlz7kvegahdwn.png", "https://res.cloudinary.com/dazuj2ddc/image/upload/v1739030368/Elastica/ucdgmj5p9ftnzejt4ed4.png"],
            benefits: [
                {
                    icon: <BadgePercentIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "30% OFF",
                    description: "On premium fitness equipment",
                },
                {
                    icon: <TruckIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "Next-Day Delivery",
                    description: "On select sports products",
                },
                {
                    icon: <TagIcon className="h-6 w-6 text-[#FFC156]" />,
                    title: "Seasonal Offers",
                    description: "Limited-time exclusive discounts",
                },
            ],
        },
    };

    const categoryKeys = Object.keys(categories);
    const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const selectedCategory = categories[randomCategoryKey];
    const randomImage = selectedCategory.images[Math.floor(Math.random() * selectedCategory.images.length)];

    return (
        <div className={`bg-[#15273e] overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid md:grid-cols-2 gap-0 min-h-[550px]">
                {/* Left Column - Image and Overlay */}
                <div className="relative h-full min-h-[400px] overflow-hidden">
                    <div className="absolute inset-0 border border-[#FFC156]/10 z-10 pointer-events-none"></div>
                    <Image
                        width={800}
                        height={800}
                        src={randomImage}
                        alt={selectedCategory.title || "luxury product"}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#15273e]/90 to-transparent" />
                    <div className="absolute top-1/2 left-12 transform -translate-y-1/2 z-10">
                        <div className="inline-block px-4 py-1 bg-[#FFC156]/10 border border-[#FFC156]/30 rounded-none text-xs uppercase tracking-widest font-medium text-[#FFC156] mb-6">
                            Exclusive Collection
                        </div>
                        <h2 className="text-4xl font-light text-white mb-6 leading-tight tracking-wide">
                            {selectedCategory.title} <br />
                            <span className="text-[#FFC156] font-normal">Premium Selection</span>
                        </h2>
                        <div className="h-px w-16 bg-[#FFC156] mb-6"></div>
                        <p className="text-base text-gray-300 mb-8 max-w-md font-light leading-relaxed">
                            Discover our curated selection of exceptional {selectedCategory.title.toLowerCase()} pieces designed for those with discerning taste.
                        </p>
                    </div>
                </div>

                {/* Right Column - Benefits and CTA */}
                <div className="p-12 md:p-16 flex flex-col justify-center">
                    <div className="space-y-10 mb-16">
                        {selectedCategory.benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className={`transform transition-all duration-500 delay-${index * 200} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
                            >
                                <div className="flex items-center space-x-6 group cursor-pointer">
                                    <div className="flex-shrink-0 w-14 h-14 rounded-none bg-[#FFC156]/5 border border-[#FFC156]/20 flex items-center justify-center transform group-hover:border-[#FFC156]/40 transition-all duration-300">
                                        {benefit.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-[#FFC156] transition-colors">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={`transform transition-all duration-500 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <Link href={`/shop/${selectedCategory.categoryID}`} passHref>
                            <button className="group relative inline-flex items-center justify-center px-10 py-3 text-sm uppercase tracking-widest font-medium text-[#15273e] bg-[#FFC156] overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <span className="relative z-10">Explore Collection</span>
                                <ArrowRightIcon className="ml-2 h-4 w-4 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Promotion;