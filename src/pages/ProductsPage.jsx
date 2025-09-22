import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Grid,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import ProductListItem from "../components/ProductListItem";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// --- (Skeleton and other components remain the same) ---

/* ============================
   Loading Skeletons
   ============================ */
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full animate-pulse">
    <div className="relative aspect-square w-full bg-gray-200"></div>
    <div className="p-4 flex flex-col flex-grow space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex-grow space-y-2">
        <div className="h-6 bg-gray-300 rounded w-full"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

const ProductListItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="md:w-1/3 w-full h-64 md:h-48 bg-gray-200"></div>
    <div className="p-6 md:w-2/3 flex flex-col justify-between w-full space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-7 bg-gray-300 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-12 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

/* ============================
   Pagination Component
   ============================ */
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    const half = Math.floor(maxPagesToShow / 2);
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= half + 1) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - half) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - (maxPagesToShow - 2); i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      <div className="flex justify-center items-center space-x-1 flex-wrap gap-y-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="flex items-center px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline ml-1">Previous</span>
        </button>
        
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg transition-all text-sm font-medium disabled:cursor-not-allowed ${
                currentPage === page
                  ? "bg-indigo-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 border hover:border-indigo-300"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 py-2 text-gray-500">
              ...
            </span>
          )
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="flex items-center px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
        >
          <span className="hidden sm:inline mr-1">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

/* ============================
   Error Component
   ============================ */
const ErrorState = ({ onRetry, message = "Failed to load products" }) => (
  <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
    <div className="mb-4">
      <AlertCircle className="mx-auto h-16 w-16 text-red-400" />
    </div>
    <h2 className="text-xl font-semibold text-gray-700 mb-2">
      Connection Problem
    </h2>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      {message}
    </p>
    <button
      onClick={onRetry}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
    >
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
);

/* ============================
   Mobile Filter Modal
   ============================ */
const MobileFilterModal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-0">
          {children}
        </div>
      </div>
    </div>
  );
};


/* ============================
   Main Products Page Component
   ============================ */
const ProductsPage = ({ 
  onAddToCart, 
  onToggleWishlist, 
  wishlistIds = new Set(), 
  cart = [],
  pendingOperations = new Set()
}) => {
  const {
    products,
    productPageData,
    loadingProducts,
    fetchProducts,
    categories,
    fetchCategories
  } = useAuth();
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || "grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [error, setError] = useState(null);
  
  // ✅ FIX: State is now derived directly from URL search params for reliability
  const searchTerm = searchParams.get('search') || "";
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const selectedCategory = searchParams.get('category') ? Number(searchParams.get('category')) : null;
  const priceRange = [
    parseInt(searchParams.get('minPrice')) || 0,
    parseInt(searchParams.get('maxPrice')) || 1000
  ];
  const sortOrder = searchParams.get('sort') || "rating-desc";
  const showNew = searchParams.get('new') === 'true';
  const showSale = searchParams.get('sale') === 'true';
  const showWishlist = searchParams.get('wishlist') === 'true';

  // Get category name for display
  const selectedCategoryName = useMemo(() => {
    if (!selectedCategory || !categories.length) return null;
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || searchParams.get('name') || 'Selected Category';
  }, [selectedCategory, categories, searchParams]);

  // Update URL params
  const updateURLParams = useCallback((newValues) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Set page to 1 for any filter change
    if (Object.keys(newValues).some(k => k !== 'page')) {
      newParams.set('page', '1');
    }

    Object.entries(newValues).forEach(([key, value]) => {
      if (value === null || value === "" || value === false) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  // Save view mode preference
  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  // Fetch categories if not available
  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
  }, [categories.length, fetchCategories]);

  // ✅ CRITICAL FIX: The main useEffect hook now correctly depends on `searchParams`.
  // This ensures it re-runs and fetches new data every time the URL changes.
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      
      const params = {
        page: (parseInt(searchParams.get('page')) || 1) - 1,
        size: 9,
        sort: searchParams.get('sort') || "rating-desc",
        searchTerm: searchParams.get('search') || undefined,
        categoryId: searchParams.get('category') || undefined,
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        isNew: searchParams.get('new') === 'true' || undefined,
        onSale: searchParams.get('sale') === 'true' || undefined,
      };

      // Remove undefined keys
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

      const result = await fetchProducts(params);
      
      if (!result.success) {
        setError(result.error || 'Failed to load products');
      }
    };

    fetchData();
  }, [searchParams, fetchProducts]); // ✅ FIX: Added `searchParams` to dependency array.

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    if (newPage > 0 && newPage <= productPageData.totalPages) {
      updateURLParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [productPageData.totalPages, updateURLParams]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setError(null);
    setSearchParams(new URLSearchParams(), { replace: true });
    toast.info("All filters cleared!");
  }, [setSearchParams]);

  // Get displayed products
  const displayedProducts = useMemo(() => {
    if (showWishlist) {
      return products.filter(product => wishlistIds.has(product.id));
    }
    return products;
  }, [products, showWishlist, wishlistIds]);

  const isInitialLoading = loadingProducts && products.length === 0;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">            
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm py-4 px-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {selectedCategoryName ? selectedCategoryName : 'All Products'}
                </h1>
                {selectedCategoryName && (
                  <button
                    onClick={() => updateURLParams({ category: null, name: null })}
                    className="text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-full transition-colors"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>
              
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  defaultValue={searchTerm} // Use defaultValue for uncontrolled input with debounce
                  onChange={(e) => {
                    const newSearchTerm = e.target.value;
                    // Debounced update
                    const timer = setTimeout(() => {
                      updateURLParams({ search: newSearchTerm });
                    }, 500);
                    return () => clearTimeout(timer);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => updateURLParams({ search: "" })}
                    className="text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            
            {/* Mobile filter button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Filter size={18} />
              Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={(id) => updateURLParams({ category: id })}
              priceRange={priceRange}
              setPriceRange={(range) => updateURLParams({ minPrice: range[0], maxPrice: range[1] })}
              sortOrder={sortOrder}
              setSortOrder={(sort) => updateURLParams({ sort })}
              showNew={showNew}
              setShowNew={(val) => updateURLParams({ new: val })}
              showSale={showSale}
              setShowSale={(val) => updateURLParams({ sale: val })}
              showWishlist={showWishlist}
              setShowWishlist={(val) => updateURLParams({ wishlist: val })}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Mobile Filter Modal */}
          <MobileFilterModal
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          >
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={(id) => {
                updateURLParams({ category: id });
                setIsMobileFilterOpen(false);
              }}
              priceRange={priceRange}
              setPriceRange={(range) => updateURLParams({ minPrice: range[0], maxPrice: range[1] })}
              sortOrder={sortOrder}
              setSortOrder={(sort) => updateURLParams({ sort })}
              showNew={showNew}
              setShowNew={(val) => updateURLParams({ new: val })}
              showSale={showSale}
              setShowSale={(val) => updateURLParams({ sale: val })}
              showWishlist={showWishlist}
              setShowWishlist={(val) => updateURLParams({ wishlist: val })}
              onClearAll={() => {
                clearAllFilters();
                setIsMobileFilterOpen(false);
              }}
              isMobile={true}
            />
          </MobileFilterModal>


          {/* Products Content */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white px-6 py-4 rounded-xl shadow-sm">
              <div className="mb-3 sm:mb-0">
                <span className="text-gray-600 font-medium">
                  {loadingProducts ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Loading...
                    </span>
                  ) : (
                    <>
                      Showing <span className="font-bold text-indigo-600">{displayedProducts.length}</span> of{" "}
                      <span className="font-bold text-indigo-600">{productPageData.totalElements}</span> results
                    </>
                  )}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    title="Grid View"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    title="List View"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Display */}
            <div className="relative min-h-[600px]">
              {/* Loading overlay */}
              {loadingProducts && !isInitialLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
                  <div className="bg-white rounded-lg p-6 shadow-xl flex items-center gap-3">
                    <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                    <span className="text-gray-700 font-medium">Loading products...</span>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !loadingProducts ? (
                <ErrorState
                  message={error}
                  onRetry={clearAllFilters}
                />
              ) : isInitialLoading ? (
                /* Initial Loading Skeletons */
                <div className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-6"
                }>
                  {Array.from({ length: 9 }).map((_, i) =>
                    viewMode === "grid" ? (
                      <ProductCardSkeleton key={i} />
                    ) : (
                      <ProductListItemSkeleton key={i} />
                    )
                  )}
                </div>
              ) : displayedProducts.length > 0 ? (
                /* Products Display */
                <div className={`transition-opacity duration-300 ${
                  loadingProducts ? "opacity-50" : "opacity-100"
                }`}>
                  <div className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-6"
                  }>
                    {displayedProducts.map((product) =>
                      viewMode === "grid" ? (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={onAddToCart}
                          onToggleWishlist={onToggleWishlist}
                          isWishlisted={wishlistIds.has(product.id)}
                          cart={cart}
                          isPending={pendingOperations.has(product.id)}
                        />
                      ) : (
                        <ProductListItem
                          key={product.id}
                          product={product}
                          onAddToCart={onAddToCart}
                          onToggleWishlist={onToggleWishlist}
                          isWishlisted={wishlistIds.has(product.id)}
                          cart={cart}
                          isPending={pendingOperations.has(product.id)}
                        />
                      )
                    )}
                  </div>
                  
                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={productPageData.totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loadingProducts}
                  />
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm">
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
                    <Search size={96} className="mx-auto" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Products Found</h2>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {showWishlist ? (
                      "Your wishlist is empty. Start adding products you love!"
                    ) : (
                      "We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
                    )}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {!showWishlist && (
                      <button
                        onClick={clearAllFilters}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                    <button
                      onClick={() => navigate('/categories')}
                      className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Browse Categories
                    </button>
                  </div>
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