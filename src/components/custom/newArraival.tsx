"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Correct import for App Router
import SectionLayout from "@/layouts/sectionLayout";
import Heading from "../ui/head";
import CatalogSlider from "../ui/slider/catalogSlider";

const NewArrival = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sectionType, setSectionType] = useState("new"); // 'new' or 'featured'
    const pathname = usePathname(); // Get current route

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                // First try to fetch new arrivals
                const newArrivalsResponse = await fetch("/api/get_newarrival");
                const newArrivalsData = await newArrivalsResponse.json();

                if (newArrivalsData && newArrivalsData.length > 0) {
                    setProducts(newArrivalsData);
                    setSectionType("new");
                } else {
                    // If no new arrivals, fetch featured products
                    const featuredResponse = await fetch("/api/get_featuredProducts");
                    const featuredData = await featuredResponse.json();
                    setProducts(featuredData);
                    setSectionType("featured");
                }
            } catch (err) {
                setError("Failed to fetch products. Please try again later.");
                console.error("Error fetching products:", err);
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
            <div className="space-y-6">
                <Heading
                    as="h2"
                    intent="base-section"
                    className="text-center pt-3 md:text-left"
                >
                    {pathname.startsWith("/purchase/") ? "You might like" : sectionType === "new" ? "New Arrivals" : "Featured Products"}
                </Heading>
                <CatalogSlider products={products} />
            </div>
        </SectionLayout>
    );
};

export default NewArrival;
