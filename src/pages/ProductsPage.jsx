import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Grid, List } from 'lucide-react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import ProductListItem from '../components/ProductListItem';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === number
                            ? 'bg-indigo-600 text-white font-semibold shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {number}
                </button>
            ))}
        </div>
    );
};

const ProductsPage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortOrder, setSortOrder] = useState('rating-desc');
    const [showNew, setShowNew] = useState(false);
    const [showSale, setShowSale] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const [allFetchedProducts, setAllFetchedProducts] = useState([]);

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

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    page: currentPage - 1,
                    size: 9,
                    sort: sortOrder,
                    searchTerm: searchTerm || null,
                    categoryId: selectedCategory || null,
                    minPrice: priceRange[0],
                    maxPrice: priceRange[1],
                    isNew: showNew ? true : null,
                    onSale: showSale ? true : null,
                };
                const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
                const fetchedProducts = response.data.content;
                setAllFetchedProducts(fetchedProducts);
                setProducts(fetchedProducts);
                setTotalPages(response.data.totalPages);
                setTotalElements(response.data.totalElements);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        const debounceTimer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(debounceTimer);
    }, [currentPage, sortOrder, searchTerm, selectedCategory, priceRange, showNew, showSale]);

    useEffect(() => {
        if (showWishlist) {
            const wishlistedProducts = allFetchedProducts.filter(p => wishlistIds.has(p.id));
            setProducts(wishlistedProducts);
        } else {
            setProducts(allFetchedProducts);
        }
    }, [showWishlist, allFetchedProducts, wishlistIds]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-lg shadow-sm py-2 px-4 mb-4">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold text-gray-800">Our Products</h1>
                            <p className="text-gray-500 text-xs">Discover amazing products</p>
                        </div>
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onCategorySelect={setSelectedCategory}
                            priceRange={priceRange}
                            setPriceRange={setPriceRange}
                            sortOrder={sortOrder}
                            setSortOrder={setSortOrder}
                            showNew={showNew}
                            setShowNew={setShowNew}
                            showSale={showSale}
                            setShowSale={setShowSale}
                            showWishlist={showWishlist}
                            setShowWishlist={setShowWishlist}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-4 bg-white px-4 py-2.5 rounded-lg shadow-sm">
                            <span className="text-gray-600 font-medium text-sm">
                                Showing {products.length} of {totalElements} results
                            </span>
                            <div className="flex items-center gap-3 mt-2 md:mt-0">
                                <div className="flex bg-gray-100 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 transition-colors duration-200 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                        aria-label="Grid View"
                                    >
                                        <Grid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 transition-colors duration-200 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                                        aria-label="List View"
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {products.length > 0 ? (
                            <div>
                                <div className={
                                    viewMode === 'grid'
                                        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr"
                                        : "space-y-4"
                                }>
                                    {products.map(product => (
                                        viewMode === 'grid' ? (
                                            <div key={product.id} className="h-full">
                                                <ProductCard
                                                    product={product}
                                                    onAddToCart={onAddToCart}
                                                    onToggleWishlist={onToggleWishlist}
                                                    isWishlisted={wishlistIds.has(product.id)}
                                                    cart={cart}
                                                />
                                            </div>
                                        ) : (
                                            <ProductListItem
                                                key={product.id}
                                                product={product}
                                                onAddToCart={onAddToCart}
                                                onToggleWishlist={onToggleWishlist}
                                                isWishlisted={wishlistIds.has(product.id)}
                                                cart={cart}
                                            />
                                        )
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                                <div className="max-w-md mx-auto">
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">No Products Found</h2>
                                    <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;