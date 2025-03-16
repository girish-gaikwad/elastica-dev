"use client";
import { ArrowRight, ChevronRight, Edit, Package, Search, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('featured');
  const [loadingCartItems, setLoadingCartItems] = useState({});
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Add states for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(false);

  // Constants
  const PRODUCT_LIMIT = 30; // Number of products to show in hero section

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
      const response = await fetch("/api/admin/getcollection");
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

  // Function to handle delete button click
  const handleDeleteProduct = (productId) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
  };

  // Function to confirm deletion
  const confirmDelete = async () => {
    if (!productToDelete) return;

    console.log(productToDelete, "car")
    setDeletingProduct(true);
    try {
      const response = await fetch("/api/admin/delete_product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: productToDelete }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      const data = await response.json();

      if (data.success) {
        toast.success('Product deleted successfully');
        // Remove the product from all categories
        const updatedCategoryProducts = { ...categoryProducts };
        Object.keys(updatedCategoryProducts).forEach(categoryId => {
          const category = updatedCategoryProducts[categoryId];
          if (category.products) {
            updatedCategoryProducts[categoryId] = {
              ...category,
              products: category.products.filter(product => product.id !== productToDelete)
            };
          }
        });
        setCategoryProducts(updatedCategoryProducts);
      } else {
        throw new Error(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message||'Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(false);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  // Function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Categories Navigation */}
      <div className="sticky top-0 z-10 bg-white border-y shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
          {/* Search Bar */}
          <div className="w-full flex items-center justify-center mb-4">
            <div className="relative w-full max-w-3xl">
              <input
                type="text"
                placeholder="Search for luxury items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#22c55e] shadow-sm text-gray-800 placeholder-gray-400 transition-all"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="overflow-x-auto pb-1">
            <div className="flex space-x-3">
              {categories.map(category => (
                <a
                  key={category.value}
                  href={`#category-${category.value}`}
                  className={`px-5 py-2.5 rounded-full font-medium transition-colors whitespace-nowrap text-sm
                    ${category.value === "all" ? 'hidden' : ''}
                    ${expandedCategory === category.value
                      ? 'bg-[#22c55e] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-[#22c55e] hover:text-white'
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {categories.slice(1).map(category => (
          <section
            key={category.value}
            id={`category-${category.value}`}
            className="mb-20 bg-white rounded-xl shadow-lg p-8 border border-gray-100"
          >
            {/* Category Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.text}</h2>
                <p className="text-gray-500 mt-1 text-sm">Premium selection</p>
              </div>

              <button
                onClick={() => toggleCategoryExpansion(category.value)}
                className="mt-4 sm:mt-0 font-medium flex items-center justify-center text-white bg-[#22c55e] hover:bg-[#1e9c4a] px-5 py-2.5 rounded-full text-sm shadow-sm transition-all"
              >
                {expandedCategory === category.value ? 'Show Less' : 'See All'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {(expandedCategory === category.value
                    ? getFilteredProducts(categoryProducts[category.value].products)
                    : getFilteredProducts(categoryProducts[category.value].products).slice(0, PRODUCT_LIMIT)
                  ).map(product => (
                    <div
                      key={product.id}
                      className="bg-white relative rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
                      onMouseEnter={() => setHoveredProduct(product.id)}
                      onMouseLeave={() => setHoveredProduct(null)}
                    >
                      {/* Delete Button */}
                      <button
                        className="absolute z-40 top-2 right-2 bg-white text-red-600 rounded-full p-1 hover:bg-gray-100 transition-colors"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <XIcon className="h-5 w-5 text-red-500" />
                      </button>

                      {/* Product Image */}
                      <div className="h-64 bg-gray-50 relative overflow-hidden">
                        <Image
                          width={500}
                          height={500}
                          src={product.images[0]?.url || "/api/placeholder/500/500"}
                          alt={product.name || "luxury product"}
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />

                        {/* Discount Ribbon */}
                        {product.discount > 0 && (
                          <div className="absolute top-0 left-0 bg-[#22c55e] text-white py-1 px-3 font-medium text-xs shadow-md clip-path-ribbon">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-6">
                        <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-[#22c55e] transition-colors">
                          {product.name}
                        </h3>

                        {/* Price */}
                        <div className="mt-4">
                          {product.discount > 0 ? (
                            <div className="flex items-baseline space-x-2">
                              <span className="font-bold text-gray-900 text-lg">₹{product.finalPrice}</span>
                              <span className="text-gray-400 line-through text-sm">₹{product.mrp}</span>
                            </div>
                          ) : (
                            <span className="font-bold text-gray-900 text-lg">₹{product.mrp}</span>
                          )}
                        </div>

                        {/* Edit Button */}
                        <Link href={`/admin/individual/${product.id}`}>
                          <button className="mt-4 w-full text-white bg-[#22c55e] hover:bg-[#1e9c4a] focus:ring-4 focus:ring-[#1e9c4a] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center">
                            <Edit className="h-5 w-5" />
                            <span className="ml-2">Edit</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {getFilteredProducts(categoryProducts[category.value].products).length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 mb-3">No products found matching your search.</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-[#22c55e] text-white rounded-full font-medium text-sm hover:bg-[#1e9c4a] transition-colors"
                    >
                      Clear search
                    </button>
                  </div>
                )}

                {/* Load More Button */}
                {expandedCategory === category.value &&
                  categoryProducts[category.value].hasMore &&
                  getFilteredProducts(categoryProducts[category.value].products).length > 0 && (
                    <div className="mt-12 text-center">
                      <button
                        onClick={() => loadMoreProducts(category.value)}
                        disabled={loading}
                        className="bg-white border-2 border-[#22c55e] hover:bg-[#22c55e] hover:text-white text-gray-900 font-medium px-8 py-3 rounded-full transition-colors disabled:opacity-50 flex items-center mx-auto group"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#22c55e] mr-2"></div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Product</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={deletingProduct}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                disabled={deletingProduct}
              >
                {deletingProduct ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;