import React, { useState, useEffect } from "react";
import { Search, Grid, List, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import ProductListItem from "../components/ProductListItem";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ============================
   Skeletons
   ============================ */
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full animate-pulse">
    <div className="relative aspect-square w-full bg-gray-200"></div>
    <div className="p-3 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="flex-grow min-h-[120px]">
        <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      </div>
      <div className="mt-auto">
        <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
      </div>
    </div>
  </div>
);

const ProductListItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row animate-pulse">
    <div className="md:w-1/3 w-full h-64 md:h-auto bg-gray-200"></div>
    <div className="p-6 md:w-2/3 flex flex-col justify-between w-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="h-7 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
      <div className="mt-4 pt-4 flex items-center justify-between">
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-12 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

/* ============================
   Pagination
   ============================ */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
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
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronLeft size={16} />
      </button>
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              currentPage === page
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-4 py-2 text-gray-500">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white border text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

/* ============================
   Products Page
   ============================ */
const ProductsPage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
  const { products, productPageData, loadingProducts, fetchProducts } = useAuth();
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

  /* ----------------- Fetch Categories ----------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/categories`);
        setCategories(response.data);
      } catch (error) {
        toast.error("Failed to fetch categories.");
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  /* ----------------- Fetch Products ----------------- */
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

    toast.dismiss(); // Remove old notifications
    toast.info("Please wait, products are loading...", { autoClose: 1500 });

    const debounceTimer = setTimeout(() => {
      fetchProducts(params)
        .then(() => {
          if (products.length > 0) {
            toast.success(`${products.length} products loaded!`);
          } else {
            toast.warn("No products found. Try adjusting filters.");
          }
        })
        .catch(() => {
          toast.error("Error loading products.");
        });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, sortOrder, searchTerm, selectedCategory, priceRange, showNew, showSale, fetchProducts]);

  const displayedProducts = showWishlist ? products.filter((p) => wishlistIds.has(p.id)) : products;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= productPageData.totalPages) {
      setCurrentPage(newPage);
      toast.info(`Page ${newPage} loading...`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showSkeletons = loadingProducts && products.length === 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header & Search */}
        <div className="bg-white rounded-lg shadow-sm py-2 px-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">Our Products</h1>
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white px-4 py-2.5 rounded-lg shadow-sm">
              <span className="text-gray-600 font-medium text-sm">
                Showing {products.length} of {productPageData.totalElements} results
              </span>
              <div className="flex items-center gap-3 mt-2 md:mt-0">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid" ? "bg-indigo-600 text-white shadow" : "text-gray-600"
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list" ? "bg-indigo-600 text-white shadow" : "text-gray-600"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative min-h-[600px]">
              {loadingProducts && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                  <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                </div>
              )}

              {showSkeletons ? (
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {Array.from({ length: 9 }).map((_, i) =>
                    viewMode === "grid" ? <ProductCardSkeleton key={i} /> : <ProductListItemSkeleton key={i} />
                  )}
                </div>
              ) : displayedProducts.length > 0 ? (
                <div className={`transition-opacity duration-300 ${loadingProducts ? "opacity-50" : "opacity-100"}`}>
                  <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {displayedProducts.map((product) =>
                      viewMode === "grid" ? (
                        <ProductCard
                          key={product.id}
                          {...{ product, onAddToCart, onToggleWishlist, isWishlisted: wishlistIds.has(product.id), cart }}
                        />
                      ) : (
                        <ProductListItem
                          key={product.id}
                          {...{ product, onAddToCart, onToggleWishlist, isWishlisted: wishlistIds.has(product.id), cart }}
                        />
                      )
                    )}
                  </div>
                  <Pagination currentPage={currentPage} totalPages={productPageData.totalPages} onPageChange={handlePageChange} />
                </div>
              ) : (
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-700">No Products Found</h2>
                  <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
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
