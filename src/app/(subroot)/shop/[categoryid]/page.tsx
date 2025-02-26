"use client";

import { ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import SectionLayout from "@/layouts/sectionLayout";
import Text from "@/components/ui/text";
import Heading from "@/components/ui/head";
import { DropdownIcon, SearchIcon } from "@/components/ui/assets/svg";
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CatalogToggle from "@/app/(subroot)/shop/catalogToggle";
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";

// Utils
import { cn } from "@/lib/utils";

// Constants remain the same
const FILTER_OPTIONS = {
  prices: [
    { value: "all", text: "All Price", min: 0, max: 100000 },
    { value: "0-50", text: "₹0.00 - ₹50.00", min: 0, max: 50 },
    { value: "50-200", text: "₹50.00 - ₹200.00", min: 50, max: 200 },
    { value: "200-500", text: "₹200.00 - ₹500.00", min: 200, max: 500 },
    { value: "500+", text: "₹500.00 +", min: 500, max: 100000 },
  ],
  discounts: [
    { value: "all", text: "All Discounts", min: 0, max: 100 },
    { value: "5-20", text: "5% - 20%", min: 5, max: 20 },
    { value: "20-50", text: "20% - 50%", min: 20, max: 50 },
    { value: "50+", text: "50% +", min: 50, max: 100 },
  ],
  sorts: [
    { value: "priceLowToHigh", text: "Price Low to High" },
    { value: "priceHighToLow", text: "Price High to Low" },
    { value: "newest", text: "Newest Products" },
    { value: "name", text: "Name" },
  ],
};

// Styled Components remain the same
const StyledSelectTrigger = ({ children, variant = "default" }) => {
  const styles = {
    default: cn(
      "group h-auto bg-white",
      "rounded-lg",
      "border-2 border-[#6C7275]",
      "p-2 pl-4",
      "font-inter font-semibold",
      "text-sm text-[#141718]",
      "focus:ring-0 focus:ring-offset-0"
    ),
    sortBy: cn(
      "group h-auto bg-white",
      "p-0 gap-1",
      "max-w-[120px] md:max-w-[150px]",
      "justify-start lg:justify-end",
      "border-none outline-none",
      "font-inter font-semibold",
      "text-sm text-[#121212]",
      "focus:ring-0 focus:ring-offset-0"
    ),
  };

  return (
    <SelectTrigger className={styles[variant]}>
      {children}
    </SelectTrigger>
  );
};

const StyledSelectItem = ({ value, children }) => (
  <SelectItem
    value={value}
    className={cn(
      "cursor-pointer rounded-lg p-2",
      "font-inter font-normal",
      "text-sm text-[#6C7275] bg-white",
      "focus:bg-[#F3F5F7] focus:text-[#141718]",
      "data-[state=checked]:font-semibold data-[state=checked]:text-[#141718]"
    )}
  >
    {children}
  </SelectItem>
);

const FilterSelect = ({ label, options, value, onValueChange }) => (
  <div className="w-full space-y-2">
    <Text size="sm" weight={600} color="gray" transform="uppercase">
      {label}
    </Text>
    <Select value={value} onValueChange={onValueChange}>
      <StyledSelectTrigger>
        <SelectValue />
        <SelectIcon asChild>
          <ChevronDown
            color="#6C7275"
            className="h-6 w-6 transition-transform duration-200 group-data-[state=open]:rotate-180"
          />
        </SelectIcon>
      </StyledSelectTrigger>
      <SelectContent className="rounded-xl">
        {options.map((option) => (
          <StyledSelectItem key={option.value} value={option.value}>
            {option.text}
          </StyledSelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default function ShopPage() {
  const params = useParams();
  const router = useRouter();
  const { categoryid: routeCategoryId } = params;
  const isAllCategories = routeCategoryId === "all";

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(routeCategoryId); // Initialize with route param
  const [productList, setProductList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [filterState, setFilterState] = useState({
    price: "all",
    discount: "all",
    sortBy: "priceLowToHigh",
    skip: 0,
    limit: 5
  });

  // Fetch categories
  useEffect(() => {
    if (isAllCategories) {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/get_collections");
          if (!response.ok) {
            throw new Error('Failed to fetch categories');
          }
          const data = await response.json();

          // Format categories for dropdown
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

      fetchCategories();
    }
  }, [isAllCategories]);

  const fetchProducts = async (filters, isLoadMore = false) => {
    setLoading(true);
    setError(null);
    try {
      const priceRange = FILTER_OPTIONS.prices.find(p => p.value === filters.price);
      const discountRange = FILTER_OPTIONS.discounts.find(d => d.value === filters.discount);

      // Use the explicitly passed categoryId or fall back to selectedCategory
      const categoryIdToUse = filters.categoryId !== undefined ?
        filters.categoryId :
        (selectedCategory === "all" ? null : selectedCategory);

      const payload = {
        categoryId: categoryIdToUse,
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        minDiscount: discountRange.min,
        maxDiscount: discountRange.max,
        sortBy: filters.sortBy,
        skip: filters.skip,
        limit: filters.limit
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

      // For pagination: append new products to existing list if loading more
      if (isLoadMore && data.success) {
        setProductList(prevProducts => [...prevProducts, ...data.data.Products]);
      } else if (data.success) {
        // For new filters: replace the product list
        setProductList(data.data.Products);
      }

      setHasMore(data.data.hasMore);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    // Reset skip to 0 for new filters
    const newFilters = { ...filterState, [key]: value, skip: 0 };
    setFilterState(newFilters);
    fetchProducts(newFilters, false);
  };

  const handleCategoryChange = (categoryId) => {
    console.log(categoryId, "category selected");

    // Update the selected category
    setSelectedCategory(categoryId);

    // Fetch products with the new category ID directly
    const newFilters = {
      ...filterState,
      skip: 0,
      categoryId: categoryId === "all" ? null : categoryId  // Explicitly pass categoryId
    };

    setFilterState(newFilters);
    fetchProducts(newFilters, false);

    // Only update URL if we're on the "all" page to maintain the all categories experience
    if (isAllCategories) {
      // This pushes to history without full navigation/reload
      router.push(`/shop/${categoryId}`, { shallow: true });
    }
  };

  const handleLoadMore = () => {
    const newFilters = {
      ...filterState,
      skip: filterState.skip + filterState.limit
    };
    setFilterState(newFilters);
    fetchProducts(newFilters, true);
  };

  // Initialize based on route params
  useEffect(() => {
    // Reset products and filters when route parameter changes
    setProductList([]);
    setSelectedCategory(routeCategoryId);

    setFilterState({
      price: "all",
      discount: "all",
      sortBy: "priceLowToHigh",
      skip: 0,
      limit: 5
    });

    // Initial products fetch with explicit categoryId
    fetchProducts({
      price: "all",
      discount: "all",
      sortBy: "priceLowToHigh",
      skip: 0,
      limit: 5,
      categoryId: routeCategoryId === "all" ? null : routeCategoryId
    }, false);
  }, [routeCategoryId]); // Only depend on URL parameters

  return (
    <SectionLayout>
      <div>
        {/* Hero Section */}
        <div className="relative flex h-[250px] flex-col items-center justify-center gap-4 bg-[#ffc95c] text-center">
          <div className="flex items-center gap-4">
            <Text size="sm" color="gray" weight={500} className="flex items-center gap-1">
              Home <DropdownIcon stroke="#6C7275" className="h-3 w-3 -rotate-90" />
            </Text>
            <Text size="sm" weight={500}>Shop</Text>
          </div>
          <Heading as="h1" intent="shop-page">Shop Page</Heading>
          <Text className="lg:text-lg">
            Welcome to the amazing Recycled Rubber Products.
          </Text>
        </div>

        {/* Search Bar */}
        <div className="my-2 border">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-2 pl-10 border-2 border-[#6C7275] rounded-lg"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                  handleFilterChange('search', e.target.value);
                }
              }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters and Sort Section */}
        <div className={cn(
          "grid gap-8 py-3",
          isAllCategories
            ? "lg:grid-cols-[1fr_1fr_1fr] lg:items-end lg:gap-4"
            : "lg:grid-cols-[2fr_1fr_2fr] lg:items-end lg:gap-4"
        )}>
          <div className={cn(
            "flex flex-col gap-6 md:flex-row lg:items-center lg:gap-4",
            isAllCategories ? "lg:col-span-2" : "lg:col-span-1"
          )}>
            {/* Category dropdown - only show if on "all" route */}
            {isAllCategories && categories.length > 0 && (
              <FilterSelect
                label="category"
                options={categories}
                value={selectedCategory} // Use the state variable
                onValueChange={handleCategoryChange}
              />
            )}

            <FilterSelect
              label="price range"
              options={FILTER_OPTIONS.prices}
              value={filterState.price}
              onValueChange={(value) => handleFilterChange('price', value)}
            />

            <FilterSelect
              label="discount"
              options={FILTER_OPTIONS.discounts}
              value={filterState.discount}
              onValueChange={(value) => handleFilterChange('discount', value)}
            />
          </div>

          <div className="flex items-center justify-between border-y border-[#000] py-2 lg:col-start-3 lg:justify-end lg:gap-8 lg:border-y-0 lg:py-0">
            <Select
              value={filterState.sortBy}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
            >
              <StyledSelectTrigger variant="sortBy">
                <SelectValue placeholder="sort by" />
                <SelectIcon asChild>
                  <ChevronDown
                    color="#121212"
                    className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </SelectIcon>
              </StyledSelectTrigger>
              <SelectContent className="w-[200px] rounded-xl">
                {FILTER_OPTIONS.sorts.map((sort) => (
                  <StyledSelectItem key={sort.value} value={sort.value}>
                    {sort.text}
                  </StyledSelectItem>
                ))}
              </SelectContent>
            </Select>
            <CatalogToggle />
          </div>
        </div>

        {/* Content Section with proper loading and error states */}
        <div className="min-h-[400px]">
          {loading && productList.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Text>Loading products...</Text>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <Text>Error: {error}</Text>
            </div>
          ) : productList.length > 0 ? (
            <CatalogProduct
              products={productList}
              onLoadMore={handleLoadMore}
              hasmore={hasMore}
              loading={loading}
            />
          ) : (
            <div className="flex items-center justify-center py-8">


              {routeCategoryId === "C0000" ? (

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300">
                  <rect width="500" height="200" rx="15" fill="#f3f4f6" />

                  <g id="coming-soon" transform="translate(0, -70)">
                    <rect x="50" y="120" width="400" height="100" rx="10" fill="#e0f2fe" stroke="#60a5fa" stroke-width="2" />

                    <circle cx="100" cy="170" r="20" fill="#60a5fa" opacity="0.7" />
                    <circle cx="400" cy="170" r="20" fill="#60a5fa" opacity="0.7" />

                    <text x="250" y="175" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#1e40af">Coming soon</text>

                    <path d="M120,140 L125,135 L130,140 L125,145 Z" fill="#3b82f6" />
                    <path d="M380,140 L385,135 L390,140 L385,145 Z" fill="#3b82f6" />
                    <path d="M120,200 L125,195 L130,200 L125,205 Z" fill="#3b82f6" />
                    <path d="M380,200 L385,195 L390,200 L385,205 Z" fill="#3b82f6" />
                  </g>

                 
                </svg>
              ) : (

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 300">
                  <rect width="500" height="200" rx="15" fill="#f3f4f6" />

                <g id="no-products" transform="translate(0, -70)">
                <rect x="50" y="120" width="400" height="100" rx="10" fill="#fee2e2" stroke="#f87171" stroke-width="2" />

                <rect x="140" y="145" width="40" height="50" rx="3" fill="none" stroke="#ef4444" stroke-width="2" />
                <path d="M130,145 L150,125 L170,125 L190,145" fill="none" stroke="#ef4444" stroke-width="2" />

                <text x="300" y="175" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="#b91c1c">No products found</text>
              </g>
              </svg>

)}


            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}