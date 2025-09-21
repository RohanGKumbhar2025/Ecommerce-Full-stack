import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowRight, Loader2, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

// Enhanced Loading Skeleton with animation
const CategoryCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
        <div className="relative">
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="p-6">
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-300 rounded w-2/3"></div>
                <div className="h-5 w-5 bg-gray-300 rounded"></div>
            </div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
);

// Enhanced Category Card Component
const CategoryCard = ({ category, onClick, isLoading }) => (
    <div
        onClick={() => !isLoading && onClick(category.id, category.name)}
        className={`group bg-white rounded-xl shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-500 overflow-hidden ${
            isLoading ? 'pointer-events-none opacity-50' : ''
        }`}
    >
        <div className="relative aspect-[4/3] overflow-hidden">
            <img 
                src={category.imageUrl} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
            
            {/* Floating badge for new/featured categories */}
            {category.isFeatured && (
                <div className="absolute top-4 left-4">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Sparkles size={12} />
                        Featured
                    </span>
                </div>
            )}
            
            {/* Product count badge */}
            {category.productCount > 0 && (
                <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {category.productCount} items
                    </span>
                </div>
            )}
            
            {/* Category name overlay */}
            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-bold drop-shadow-lg group-hover:text-yellow-300 transition-colors">
                    {category.name}
                </h3>
            </div>
        </div>
        
        <div className="p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {category.name}
                    </h2>
                    {category.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>
                <ArrowRight 
                    className="text-gray-400 group-hover:text-indigo-600 transition-all duration-300 group-hover:translate-x-1" 
                    size={20} 
                />
            </div>
        </div>
        
        {/* Loading overlay */}
        {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={24} />
            </div>
        )}
    </div>
);

// Main Categories Page Component
const CategoriesPage = () => {
    const navigate = useNavigate();
    const { categories, loadingCategories, fetchCategories, setSelectedGlobalCategory } = useAuth();
    const [loadingCategoryId, setLoadingCategoryId] = useState(null);

    // Fetch categories on component mount
    useEffect(() => {
        if (categories.length === 0 && !loadingCategories) {
            fetchCategories();
        }
    }, [categories.length, loadingCategories, fetchCategories]);

    // Enhanced category click handler with loading state
    const handleCategoryClick = async (categoryId, categoryName) => {
        try {
            setLoadingCategoryId(categoryId);
            
            // Show immediate user feedback
            toast.info(`Loading ${categoryName} products...`, {
                icon: <Loader2 className="animate-spin" />,
                autoClose: 2000,
            });

            // Set global category selection
            setSelectedGlobalCategory(categoryId);
            
            // Navigate with category parameter
            navigate(`/products?category=${categoryId}&name=${encodeURIComponent(categoryName)}`);
            
        } catch (error) {
            console.error('Error navigating to category:', error);
            toast.error('Failed to load category. Please try again.');
        } finally {
            // Reset loading state after navigation
            setTimeout(() => setLoadingCategoryId(null), 1000);
        }
    };

    // Error state
    if (!loadingCategories && categories.length === 0) {
        return (
            <div className="bg-gray-50 py-16 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Categories Available</h2>
                        <p className="text-gray-600 mb-6">We're working on adding categories. Please check back later.</p>
                        <button
                            onClick={() => fetchCategories()}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Retry Loading Categories
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <Tag size={16} />
                        Shop by Category
                    </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Explore Our Categories
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover amazing products across our carefully curated categories. 
                        From electronics to fashion, find exactly what you're looking for.
                    </p>
                    
                    {/* Stats bar */}
                    <div className="flex justify-center items-center gap-8 mt-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            {categories.length} Categories Available
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            Updated Daily
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                            Fast Loading
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                {loadingCategories && categories.length === 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <CategoryCardSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {categories.map((category) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    onClick={handleCategoryClick}
                                    isLoading={loadingCategoryId === category.id}
                                />
                            ))}
                        </div>
                        
                        {/* Footer CTA */}
                        <div className="text-center mt-16">
                            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    Can't find what you're looking for?
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Browse all our products or use our powerful search to find exactly what you need.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate('/products')}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                    >
                                        Browse All Products
                                    </button>
                                    <button
                                        onClick={() => navigate('/products?search=true')}
                                        className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
                                    >
                                        Advanced Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                {/* Loading overlay for the entire page */}
                {loadingCategories && categories.length > 0 && (
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
                            <Loader2 className="animate-spin text-indigo-600" size={24} />
                            <span className="text-gray-700 font-medium">Refreshing categories...</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;