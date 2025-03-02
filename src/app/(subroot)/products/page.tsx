"use client";
import { addToCart } from '@/lib/cartWishlistUtils';
import { cn } from '@/lib/utils';
import { ChevronRight, Search, ShoppingCart, Heart, Eye, ArrowRight, Star, Package } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('featured');
    const [loadingCartItems, setLoadingCartItems] = useState({});
    const [hoveredProduct, setHoveredProduct] = useState(null);

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
            <div className="h-64 bg-gray-100 rounded-lg"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-100 rounded mt-2 w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded mt-2 w-1/2"></div>
                <div className="h-6 bg-gray-100 rounded mt-2"></div>
            </div>
        </div>
    );

    // Fixed function - per-product loading state
    const handleAddToCart = async (productId) => {
        if (!productId) return;

        setLoadingCartItems(prev => ({ ...prev, [productId]: true }));
        try {
            await addToCart(productId.toString(), 1);
        } catch (error) {
            console.error("Add to cart failed:", error);
        } finally {
            setLoadingCartItems(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#ffc155] to-amber-300 py-14 shadow-lg">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">Collections</h1>
                            <p className="text-gray-800 mt-2 text-lg font-light">Discover our curated selection of premium products</p>
                        </div>

                        {/* Search Bar */}
                        <div className="mt-6 md:mt-0 max-w-md w-full">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for luxury items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-3 pl-12 pr-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-[#ffc155] shadow-md text-gray-800"
                                />
                                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

          

            {/* Categories Navigation */}
            <div className="bg-white py-4 sticky top-0 z-10 shadow-md border-b border-gray-200">
                <div className="container mx-auto px-6">
                    <div className="overflow-x-auto">
                        <div className="flex space-x-3 pb-2">
                            {categories.map(category => (
                                <a
                                    key={category.value}
                                    href={`#category-${category.value}`}
                                    className={`px-5 py-2.5 rounded-full font-medium transition-colors whitespace-nowrap text-sm
                    ${category.value === "all" ? 'hidden' : ''}
                    ${expandedCategory === category.value
                                            ? 'bg-[#ffc155] text-gray-900 shadow-sm'
                                            : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
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
            <div className=" mx-auto px-6 py-12">
                {categories.slice(1).map(category => (
                    <section
                        key={category.value}
                        id={`category-${category.value}`}
                        className="mb-20 bg-white rounded-xl shadow-md p-8 border border-gray-100"
                    >
                        {/* Category Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{category.text}</h2>
                                <p className="text-gray-500 mt-1 text-sm">Premium selection</p>
                            </div>

                            <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 w-full sm:w-auto gap-3 sm:gap-4">
                                <button
                                    onClick={() => toggleCategoryExpansion(category.value)}
                                    className="text-gray-900 font-medium flex items-center justify-center sm:justify-start bg-[#ffc155] hover:bg-[#ffb84d] px-5 py-2.5 rounded-full text-sm shadow-sm transition-all"
                                >
                                    {expandedCategory === category.value ? 'Show Less' : 'See All'}
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </button>
                                <Link 
                                    href={`/shop/${category.value}`}
                                    className="text-gray-700 font-medium flex items-center justify-center sm:justify-start bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full text-sm shadow-sm transition-all"
                                >
                                    View All
                                    <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Loading state */}
                        {loading && !categoryProducts[category.value] && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Products Grid */}
                        {categoryProducts[category.value] && (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                                    {(expandedCategory === category.value
                                        ? getFilteredProducts(categoryProducts[category.value].products)
                                        : getFilteredProducts(categoryProducts[category.value].products).slice(0, PRODUCT_LIMIT)
                                    ).map(product => (
                                        <div 
                                            key={product.id} 
                                            className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-1"
                                            onMouseEnter={() => setHoveredProduct(product.id)}
                                            onMouseLeave={() => setHoveredProduct(null)}
                                        >
                                            <div className="h-64 bg-gray-50 relative overflow-hidden">
                                                <Link href={`/purchase/${product.id}`}>
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        src={product.images[0].url || "/api/placeholder/500/500"}
                                                        alt={product.name || "luxury product"}
                                                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                                                    />
                                                </Link>
                                                
                                                {/* Elegant ribbon for discount */}
                                                {product.discount > 0 && (
                                                    <div className="absolute top-0 left-0 bg-[#ffc155] text-gray-900 py-1 px-3 font-medium text-xs shadow-md clip-path-ribbon">
                                                        {product.discount}% OFF
                                                    </div>
                                                )}
                                                
                                                {/* Quick action buttons - animated on hover */}
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 transition-all duration-500 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                                    <div className="flex items-center space-x-1 bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-800 shadow-md">
                                                        <Package className="h-4 w-4 text-[#ffc155]" />
                                                        <span>Only {product.stock} left</span>
                                                    </div>
                                                    
                                                </div>
                                                
                                                {/* Luxury badge overlay */}
                                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                                            </div>
                                            
                                            <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                                                <Link href={`/purchase/${product.id}`}>
                                                    <div className="min-h-12 mb-2">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-[#ffc155] transition-colors group-hover:text-[#ffc155]">{product.name}</h3>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Animated line separator */}
                                                    <div className="w-full h-px bg-gray-200 my-3 relative overflow-hidden">
                                                        <div className={`absolute top-0 left-0 h-px bg-[#ffc155] transition-all duration-1000 ease-in-out ${hoveredProduct === product.id ? 'w-full' : 'w-0'}`}></div>
                                                    </div>
                                                    
                                                    <div className="flex flex-col">
                                                        {product.discount > 0 ? (
                                                            <div className="flex items-baseline space-x-2 mb-4">
                                                                <span className="font-bold text-gray-900 text-lg">₹{product.finalPrice}</span>
                                                                <span className="text-gray-400 line-through text-sm">₹{product.mrp}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-gray-900 text-lg mb-4">₹{product.mrp}</span>
                                                        )}
                                                    </div>
                                                </Link>
                                                
                                                {/* Animated add to cart button */}
                                                <button 
                                                    disabled={loadingCartItems[product.id]}
                                                    onClick={() => handleAddToCart(product.id)} 
                                                    className={cn(
                                                        "w-full group-hover:bg-[#ffc155] group-hover:text-gray-900 bg-gray-900 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center overflow-hidden relative",
                                                        loadingCartItems[product.id] ? "opacity-70 cursor-not-allowed" : ""
                                                    )}
                                                >
                                                    {loadingCartItems[product.id] ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="transition-transform duration-300 group-hover:translate-x-1">Add to Cart</span>
                                                            <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300 transform group-hover:translate-x-1" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* No results */}
                                {getFilteredProducts(categoryProducts[category.value].products).length === 0 && (
                                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500 mb-3">No products found matching your search.</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="px-4 py-2 bg-[#ffc155] text-gray-900 rounded-full font-medium text-sm hover:bg-[#ffb84d] transition-colors"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}

                                {/* Load More Button (only in expanded view) */}
                                {expandedCategory === category.value &&
                                    categoryProducts[category.value].hasMore &&
                                    getFilteredProducts(categoryProducts[category.value].products).length > 0 && (
                                        <div className="mt-12 text-center">
                                            <button
                                                onClick={() => loadMoreProducts(category.value)}
                                                disabled={loading}
                                                className="bg-white border-2 border-[#ffc155] hover:bg-[#fff8ec] text-gray-900 font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 flex items-center mx-auto group"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#ffc155] mr-2"></div>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Load More Products</span>
                                                        <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                            </>
                        )}
                    </section>
                ))}
            </div>

            {/* Add custom CSS for ribbon clipping */}
            <style jsx global>{`
                .clip-path-ribbon {
                    clip-path: polygon(0 0, 100% 0, 90% 100%, 0 100%);
                }
            `}</style>

          
        </div>
    );
};

export default CategoriesPage;