"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import SectionLayout from "@/layouts/sectionLayout";
import Heading from "../ui/head";
import CatalogSlider from "../ui/slider/catalogSlider";
import { Sparkles, Star } from "lucide-react";

const NewArrival = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sectionType, setSectionType] = useState("new");
    const pathname = usePathname();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const newArrivalsResponse = await fetch("/api/get_newarrival");
                const newArrivalsData = await newArrivalsResponse.json();

                if (newArrivalsData && newArrivalsData.length > 0) {
                    setProducts(newArrivalsData);
                    setSectionType("new");
                } else {
                    const featuredResponse = await fetch("/api/get_featuredProducts");
                    const featuredData = await featuredResponse.json();
                    setProducts(featuredData);
                    setSectionType("featured");
                }
            } catch (err) {
                setError("Unable to retrieve collection. Please refresh or try again later.");
                console.error("Error fetching products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const getSectionTitle = () => {
        if (pathname.startsWith("/purchase/")) {
            return "Curated Selections";
        } else {
            return sectionType === "new" ? "Latest Collection" : "Exclusive Selections";
        }
    };

    if (isLoading) {
        return (
            <SectionLayout className="bg-gradient-to-r from-stone-50 to-neutral-50">
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-800"></div>
                </div>
            </SectionLayout>
        );
    }

    if (error) {
        return (
            <SectionLayout className="bg-gradient-to-r from-stone-50 to-neutral-50">
                <div className="text-center text-green-800 py-12 font-light">{error}</div>
            </SectionLayout>
        );
    }

    return (
        <SectionLayout className=" py-14">
            <div >
                <div className="relative">
                    <div className="absolute -top-2 -left-2 opacity-75">
                        {sectionType === "new" ? (
                            <Sparkles size={20} className="text-green-700" />
                        ) : (
                            <Star size={20} className="text-green-700" />
                        )}
                    </div>
                    <Heading
                        as="h2"
                        intent="base-section"
                        className="text-center md:text-left font-light tracking-wider text-stone-800 pb-2 border-b border-[#22c55e]"
                    >
                        {getSectionTitle()}
                    </Heading>
                </div>
                
                <div className="px-2">
                    <CatalogSlider products={products} />
                </div>
                
               
            </div>
        </SectionLayout>
    );
};

export default NewArrival;