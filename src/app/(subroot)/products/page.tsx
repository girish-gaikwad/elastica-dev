"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, ShoppingCart, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('featured');

    // Constants
    const PRODUCT_LIMIT = 5; // Number of products to show in hero section

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products for each category when categories are loaded
    useEffect(() => {
        if (categories.length > 0) {
            // Skip the "All Categories" option
            categories.slice(1).forEach(category => {
                fetchProductsForCategory(category.value);
            });
        }
    }, [categories]);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/get_collections");
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();

            // Format categories for display
            const formattedCategories = data.map(category => ({
                value: category.categoryId,
                text: category.name
            }));

            // Add "All Categories" option
            formattedCategories.unshift({ value: "all", text: "All Categories" });

            setCategories(formattedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProductsForCategory = async (categoryId) => {
        if (categoryId === "all") return;

        setLoading(true);
        try {
            const payload = {
                categoryId,
                skip: 0,
                limit: PRODUCT_LIMIT
            };

            const response = await fetch("/api/get_productsCt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const data = await response.json();

            if (data.success) {
                setCategoryProducts(prev => ({
                    ...prev,
                    [categoryId]: {
                        products: data.data.Products,
                        hasMore: data.data.hasMore
                    }
                }));
            }
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const loadMoreProducts = async (categoryId) => {
        setLoading(true);
        try {
            const currentProducts = categoryProducts[categoryId]?.products || [];

            const payload = {
                categoryId,
                skip: currentProducts.length,
                limit: PRODUCT_LIMIT * 2 // Load more products for expanded view
            };

            const response = await fetch("/api/get_productsCt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch more products');
            }

            const data = await response.json();

            if (data.success) {
                setCategoryProducts(prev => ({
                    ...prev,
                    [categoryId]: {
                        products: [...currentProducts, ...data.data.Products],
                        hasMore: data.data.hasMore
                    }
                }));
            }
        } catch (error) {
            console.error(`Error loading more products for category ${categoryId}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategoryExpansion = (categoryId) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(categoryId);
            if (categoryProducts[categoryId]?.products?.length <= PRODUCT_LIMIT) {
                loadMoreProducts(categoryId);
            }
        }
    };

    const getFilteredProducts = (products) => {
        if (!products) return [];

        // First filter by search query
        let filtered = products;
        if (searchQuery.trim() !== '') {
            filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Then sort based on active filter
        switch (activeFilter) {
            case 'price-low':
                return [...filtered].sort((a, b) =>
                    (a.discountedPrice || a.price) - (b.discountedPrice || b.price)
                );
            case 'price-high':
                return [...filtered].sort((a, b) =>
                    (b.discountedPrice || b.price) - (a.discountedPrice || a.price)
                );
            case 'discount':
                return [...filtered].sort((a, b) =>
                    (b.discountPercentage || 0) - (a.discountPercentage || 0)
                );
            case 'featured':
            default:
                return filtered;
        }
    };

    const Skeleton = () => (
        <div className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="p-3">
                <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded mt-2 w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded-full mt-2"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-amber-400 to-amber-300 py-8 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
                            <p className="text-gray-700 mt-2">Discover our curated collection of premium products</p>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-4 md:mt-0 max-w-md w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent shadow-sm"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Categories Navigation */}
            <div className="bg-white py-4 sticky top-0 z-10 shadow-sm border-b border-gray-200">
                <div className=" mx-auto px-4">
                    <div className="overflow-x-auto">
                        <div className="flex space-x-2 pb-2">
                            {categories.map(category => (
                                <a
                                    key={category.value}
                                    href={`#category-${category.value}`}
                                    className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap 
                    ${category.value === "all" ? 'hidden' : ''}
                    ${expandedCategory === category.value
                                            ? 'bg-amber-400 text-gray-800 shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                                        }`}
                                >
                                    {category.text}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Category Sections */}
            <div className=" mx-auto px-4 py-8">
                {categories.slice(1).map(category => (
                    <section
                        key={category.value}
                        id={`category-${category.value}`}
                        className="mb-16 bg-white rounded-lg shadow-sm p-6 border border-gray-100"
                    >
                        {/* Category Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">{category.text}</h2>

                            <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 w-full sm:w-auto gap-2 sm:gap-4">
                                <button
                                    onClick={() => toggleCategoryExpansion(category.value)}
                                    className="text-amber-500 hover:text-amber-600 font-medium flex items-center justify-center sm:justify-start bg-amber-50 px-4 py-2 rounded-full text-sm"
                                >
                                    {expandedCategory === category.value ? 'Show Less' : 'See All'}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </button>
                                <Link href={`/shop/${category.value}`}
                                    className="text-blue-500 hover:text-blue-600 font-medium flex items-center justify-center sm:justify-start bg-blue-50 px-4 py-2 rounded-full text-sm"
                                >
                                    View All
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Loading state */}
                        {loading && !categoryProducts[category.value] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Products Grid */}
                        {categoryProducts[category.value] && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                    {(expandedCategory === category.value
                                        ? getFilteredProducts(categoryProducts[category.value].products)
                                        : getFilteredProducts(categoryProducts[category.value].products).slice(0, PRODUCT_LIMIT)
                                    ).map(product => (
                                        <div key={product.id} className="bg-white rounded-lg overflow-hidden border shadow-md border-gray-100 hover:shadow-xl transition-shadow group">
                                            <div className="h-48 bg-gray-50 relative overflow-hidden">
                                                <Link href={`/purchase/${product.id}`}>
                                                <Image
                                                    width={300}
                                                    height={200}
                                                    src={product.images[0].url || "/api/placeholder/300/200"}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                </Link>
                                                {product.discount > 0 && (
                                                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-md font-bold text-xs">
                                                        {product.discount}% OFF
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <Link href={`/purchase/${product.id}`}>
                                                <div className="min-h-12">
                                                    <h3 className="font-medium text-gray-800 line-clamp-2 hover:text-amber-500 transition-colors">{product.name}</h3>
                                                </div>
                                                <div className="mt-3 flex justify-between items-end">
                                                    <div>
                                                        {product.discount > 0 ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-800">${product.finalPrice}</span>
                                                                <span className="text-gray-500 line-through text-xs">${product.mrp}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-gray-800">₹
                                                                {product.mrp}</span>
                                                        )}
                                                    </div>
                                                    <button className="flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-gray-800 p-2 rounded-full transition-colors">
                                                        <ShoppingCart className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                </Link>
                                                <button className="mt-3 w-full bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* No results */}
                                {getFilteredProducts(categoryProducts[category.value].products).length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">No products found matching your search.</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-2 text-amber-500 hover:text-amber-600 font-medium"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}

                                {/* Load More Button (only in expanded view) */}
                                {expandedCategory === category.value &&
                                    categoryProducts[category.value].hasMore &&
                                    getFilteredProducts(categoryProducts[category.value].products).length > 0 && (
                                        <div className="mt-8 text-center">
                                            <button
                                                onClick={() => loadMoreProducts(category.value)}
                                                disabled={loading}
                                                className="bg-white border-2 border-amber-400 hover:bg-amber-50 text-gray-800 font-medium px-6 py-2 rounded-full transition-colors disabled:opacity-50 flex items-center mx-auto"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500 mr-2"></div>
                                                        Loading...
                                                    </>
                                                ) : 'Load More Products'}
                                            </button>
                                        </div>
                                    )}
                            </>
                        )}
                    </section>
                ))}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-sm text-gray-400">
                    <p>© 2025 Your Store Name. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default CategoriesPage;