"use client";

import { ChevronDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Components
import CatalogProduct from "@/app/(subroot)/shop/catalogProduct";
import CatalogToggle from "@/app/(subroot)/shop/catalogToggle";
import { DropdownIcon, SearchIcon } from "@/components/ui/assets/svg";
import Heading from "@/components/ui/head";
import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Text from "@/components/ui/text";
import SectionLayout from "@/layouts/sectionLayout";

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

// Enhanced Styled Components
const StyledSelectTrigger = ({ children, variant = "default" }) => {
  const styles = {
    default: cn(
      "group h-auto bg-white",
      "rounded-lg",
      "border border-[#E8E8E8] hover:border-[#22c55e]",
      "p-3 pl-4",
      "font-inter font-medium",
      "text-sm text-[#141718]",
      "shadow-sm",
      "transition-all duration-200",
      "focus:ring-1 focus:ring-[#22c55e] focus:ring-offset-0"
    ),
    sortBy: cn(
      "group h-auto bg-white",
      "p-0 gap-1",
      "max-w-[120px] md:max-w-[150px]",
      "justify-start lg:justify-end",
      "border-none outline-none",
      "font-inter font-medium",
      "text-sm text-[#121212]",
      "transition-all duration-200",
      "hover:text-[#22c55e]",
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
      "cursor-pointer rounded-lg p-3",
      "font-inter font-normal",
      "text-sm text-[#6C7275] bg-white",
      "focus:bg-[#22c55e]/50 focus:text-[#141718]",
      "hover:bg-[#22c55e] hover:text-[#22c55e]",
      "transition-all duration-150",
      "data-[state=checked]:bg-emerald-50 data-[state=checked]:font-medium data-[state=checked]:text-[#22c55e]"
    )}
  >
    {children}
  </SelectItem>
);

const FilterSelect = ({ label, options, value, onValueChange }) => (
  <div className="w-full space-y-2">
    <Text size="sm" weight={600} color="gray" transform="uppercase" className="tracking-wider">
      {label}
    </Text>
    <Select value={value} onValueChange={onValueChange}>
      <StyledSelectTrigger>
        <SelectValue />
        <SelectIcon asChild>
          <ChevronDown
            color="#6C7275"
            className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-[#22c55e]"
          />
        </SelectIcon>
      </StyledSelectTrigger>
      <SelectContent className="rounded-xl border bg-white border-[#E8E8E8] p-1 shadow-lg">
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
  const [selectedCategory, setSelectedCategory] = useState(routeCategoryId);
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
        {/* Enhanced Hero Section */}
        <div className="relative flex h-[320px] flex-col items-center justify-center gap-6 bg-gradient-to-r from-[#22c55e] to-[#22c55e] text-center">
          <div className="absolute inset-0 bg-[url('/patterns/subtle-dots.png')] opacity-10"></div>
          <div className="relative z-10 flex items-center gap-4">
            <Text size="sm" color="gray/900" weight={500} className="flex items-center gap-1 text-[#5A5A5A]">
              Home <DropdownIcon stroke="#5A5A5A" className="h-3 w-3 -rotate-90" />
            </Text>
            <Text size="sm" weight={600} className="text-[#141718]">Shop</Text>
          </div>
          <div className="relative">
            <Heading as="h1" className="text-4xl md:text-5xl font-serif text-[#fff]">
              Premium Collection
            </Heading>
            <div className="absolute -bottom-3 left-1/2 h-[3px] w-20 -translate-x-1/2 bg-[#141718] opacity-30"></div>
          </div>
          <Text className="relative z-10 max-w-md px-4 text-lg text-[#212121] md:text-xl">
            Sustainable luxury through recycled rubber products for modern living.
          </Text>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mx-auto my-8 max-w-3xl px-4">
          <div className="relative drop-shadow-lg">
            <input
              type="text"
              placeholder="Search our collection..."
              className="w-full rounded-xl border border-[#E8E8E8] bg-white p-4 pl-12 text-[#141718] placeholder-[#9CA3AF] transition-all duration-200 focus:border-[#22c55e] focus:outline-none focus:ring-1 focus:ring-[#22c55e]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.length >= 3 || e.target.value.length === 0) {
                  handleFilterChange('search', e.target.value);
                }
              }}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-5 w-5 text-[#9CA3AF]" />
            </div>
          </div>
        </div>

        {/* Enhanced Filters Section with subtle card */}
        <div className="mx-auto mb-10 mt-4 max-w-6xl rounded-xl bg-white px-6 py-8 shadow-sm">
          <div className={cn(
            "grid gap-8",
            isAllCategories
              ? "lg:grid-cols-[1fr_1fr_1fr] lg:items-end lg:gap-6"
              : "lg:grid-cols-[2fr_1fr_2fr] lg:items-end lg:gap-6"
          )}>
            <div className={cn(
              "flex flex-col gap-6 md:flex-row lg:items-center lg:gap-6",
              isAllCategories ? "lg:col-span-2" : "lg:col-span-1"
            )}>
              {/* Category dropdown - only show if on "all" route */}
              {isAllCategories && categories.length > 0 && (
                <FilterSelect
                  label="category"
                  options={categories}
                  value={selectedCategory}
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

            <div className="flex items-center justify-between border-y border-[#F1F1F1] py-4 lg:col-start-3 lg:justify-end lg:gap-8 lg:border-y-0 lg:py-0">
              <div className="flex items-center gap-3">
                <Text size="xs" weight={500} className="text-[#6C7275]">
                  SORT BY:
                </Text>
                <Select
                  value={filterState.sortBy}
                  onValueChange={(value) => handleFilterChange('sortBy', value)}
                >
                  <StyledSelectTrigger variant="sortBy">
                    <SelectValue placeholder="sort by" />
                    <SelectIcon asChild>
                      <ChevronDown
                        color="#121212"
                        className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180 group-hover:text-[#22c55e]"
                      />
                    </SelectIcon>
                  </StyledSelectTrigger>
                  <SelectContent className="w-[200px] rounded-xl border bg-white border-[#E8E8E8] p-1 shadow-lg">
                    {FILTER_OPTIONS.sorts.map((sort) => (
                      <StyledSelectItem key={sort.value} value={sort.value}>
                        {sort.text}
                      </StyledSelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CatalogToggle />
            </div>
          </div>
        </div>

        {/* Enhanced Content Section with proper loading and error states */}
        <div className="min-h-[400px] px-4">
          {loading && productList.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22c55e] border-t-transparent"></div>
              <Text className="text-[#6C7275]">Loading exquisite products...</Text>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-red-50 p-8 py-16 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <Text weight={500}>Error: {error}</Text>
              <Text size="sm" className="max-w-md text-center opacity-80">
                We apologize for the inconvenience. Please try again later.
              </Text>
            </div>
          ) : productList.length > 0 ? (
            <CatalogProduct
              products={productList}
              onLoadMore={handleLoadMore}
              hasmore={hasMore}
              loading={loading}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              {routeCategoryId === "C0000" ? (
                // Enhanced Coming Soon
                <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-emerald-50 p-12 text-center shadow-sm">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-[#22c55e] opacity-20"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <Text size="2xl" weight={600} family="serif" className="text-[#141718]">
                    Coming Soon
                  </Text>
                  <Text className="max-w-md text-[#6C7275]">
                    We&apos;re crafting something exceptional. Stay tuned for our latest premium collection.
                  </Text>
                  <div className="mt-2 h-1 w-16 rounded-full bg-[#22c55e] opacity-60"></div>
                </div>
              ) : (
                // Enhanced No Products
                <div className="flex flex-col items-center justify-center gap-6 rounded-xl bg-gray-50 p-12 text-center shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#6C7275" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                  <Text size="2xl" weight={500} family="serif" className="text-[#141718]">
                    No Products Found
                  </Text>
                  <Text className="max-w-md text-[#6C7275]">
                    We couldn&apos;t find any products matching your criteria. Try adjusting your filters or explore our other collections.
                  </Text>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SectionLayout>
  );
}