import React, { useState, useEffect } from "react";
import { Search, Grid, List, Loader2 } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import ProductListItem from "../components/ProductListItem";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ============================
   Skeletons
   ============================ */
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
    <div className="relative aspect-square w-full bg-gray-200 animate-pulse"></div>
    <div className="p-3 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="flex-grow min-h-[120px]">
        <div className="h-6 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-gray-300 rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const ProductListItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
    <div className="md:w-1/3 w-full h-64 md:h-auto bg-gray-200 animate-pulse"></div>
    <div className="p-6 md:w-2/3 flex flex-col justify-between w-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="h-7 bg-gray-300 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 flex items-center justify-between">
        <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        <div className="h-12 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  </div>
);

/* ============================
   Pagination
   ============================ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        aria-label="Go to previous page"
    >
        <ChevronLeft size={16} />
    </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === number
              ? "bg-indigo-600 text-white font-semibold shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border"
          }`}
          aria-label={`Page ${number}`}
        >
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
};

/* ============================
   Products Page
   ============================ */
const ProductsPage = ({
  onAddToCart,
  onToggleWishlist,
  wishlistIds = new Set(),
  cart,
}) => {
  const {
    paginatedProducts,
    productPageData,
    loadingPaginatedProducts,
    fetchPaginatedProducts,
  } = useAuth();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOrder, setSortOrder] = useState("rating-desc");
  const [showNew, setShowNew] = useState(false);
  const [showSale, setShowSale] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  /* Fetch categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  /* Fetch products on filter change */
  useEffect(() => {
    const params = {
      page: currentPage - 1,
      size: 9,
      sort: sortOrder,
      ...(searchTerm && { searchTerm }),
      ...(selectedCategory && { categoryId: selectedCategory }),
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      ...(showNew && { isNew: true }),
      ...(showSale && { onSale: true }),
    };
    const debounceTimer = setTimeout(() => fetchPaginatedProducts(params), 300);
    return () => clearTimeout(debounceTimer);
  }, [
    currentPage,
    sortOrder,
    searchTerm,
    selectedCategory,
    priceRange,
    showNew,
    showSale,
    fetchPaginatedProducts,
  ]);

  const displayedProducts = showWishlist
    ? paginatedProducts.filter((p) => wishlistIds.has(p.id))
    : paginatedProducts;

  const showSkeletons =
    loadingPaginatedProducts && paginatedProducts.length === 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm py-2 px-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Our Products</h1>
            <div className="relative flex-1 max-w-md w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
                aria-label="Search products"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <FilterSidebar
              {...{
                categories,
                selectedCategory,
                onCategorySelect: setSelectedCategory,
                priceRange,
                setPriceRange,
                sortOrder,
                setSortOrder,
                showNew,
                setShowNew,
                showSale,
                setShowSale,
                showWishlist,
                setShowWishlist,
              }}
            />
          </div>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white px-4 py-2.5 rounded-lg shadow-sm">
              <span className="text-gray-600 font-medium text-sm">
                Showing {displayedProducts.length} of{" "}
                {productPageData.totalElements} results
              </span>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <div className="flex bg-gray-100 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="relative">
              {loadingPaginatedProducts && paginatedProducts.length > 0 && (
                <div
                  className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
                  role="status"
                  aria-label="Loading products"
                >
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                </div>
              )}

              {showSkeletons ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {Array.from({ length: 9 }).map((_, i) =>
                    viewMode === "grid" ? (
                      <ProductCardSkeleton key={i} />
                    ) : (
                      <ProductListItemSkeleton key={i} />
                    )
                  )}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div
                  className={`transition-opacity duration-300 ${
                    loadingPaginatedProducts ? "opacity-50" : "opacity-100"
                  }`}
                >
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {displayedProducts.map((product) =>
                      viewMode === "grid" ? (
                        <ProductCard
                          key={product.id}
                          {...{
                            product,
                            onAddToCart,
                            onToggleWishlist,
                            isWishlisted: wishlistIds.has(product.id),
                            cart,
                          }}
                        />
                      ) : (
                        <ProductListItem
                          key={product.id}
                          {...{
                            product,
                            onAddToCart,
                            onToggleWishlist,
                            isWishlisted: wishlistIds.has(product.id),
                            cart,
                          }}
                        />
                      )
                    )}
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={productPageData.totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-700">
                    {showWishlist ? "No Wishlist Items Found" : "No Products Found"}
                  </h2>
                  <p className="text-gray-500">
                    {showWishlist
                      ? "Your wishlist is empty. Start adding products you love!"
                      : "Try adjusting your filters to find what you're looking for."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
