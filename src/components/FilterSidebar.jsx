import React from 'react';
import { SlidersHorizontal, List, Percent, Sparkles, Heart } from 'lucide-react';

// ✅ FIX: Set a default value for categories prop to an empty array.
// This is the most robust way to prevent the '.map is not a function' error.
const FilterSidebar = ({
    categories = [], 
    selectedCategory,
    onCategorySelect,
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
}) => {
    
    const handlePriceChange = (e) => {
        setPriceRange([0, Number(e.target.value)]);
    };

    const clearFilters = () => {
        onCategorySelect(null);
        setPriceRange([0, 1000]);
        setSortOrder('rating-desc');
        setShowNew(false);
        setShowSale(false);
        setShowWishlist(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg sticky top-24 h-fit max-h-[calc(100vh-8rem)] flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><SlidersHorizontal size={20}/> Filters</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Quick Filters */}
                <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Quick Filters</h4>
                    <div className="space-y-3">
                        <button onClick={() => setShowNew(!showNew)} className={`filter-button ${showNew ? 'active' : ''}`}>
                            <Sparkles size={16} /> New Products
                        </button>
                        <button onClick={() => setShowSale(!showSale)} className={`filter-button ${showSale ? 'active orange' : ''}`}>
                            <Percent size={16} /> On Sale
                        </button>
                        <button onClick={() => setShowWishlist(!showWishlist)} className={`filter-button ${showWishlist ? 'active red' : ''}`}>
                            <Heart size={16} /> My Wishlist
                        </button>
                    </div>
                </div>
                
                {/* Categories */}
                <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Categories</h4>
                    <div className="space-y-2">
                        <button onClick={() => onCategorySelect(null)} className={`category-button ${!selectedCategory ? 'active' : ''}`}>
                            <span>All Categories</span>
                        </button>
                        {/* ✅ FIX: The check ensures we only map if categories is a valid array */}
                        {Array.isArray(categories) && categories.map((category) => (
                            <button key={category.id} onClick={() => onCategorySelect(category.id)} className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}>
                                <span>{category.name}</span>
                                {/* Assuming you might add product counts to your category data later */}
                                {category.productCount > 0 && <span className="count-badge">{category.productCount}</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range Slider */}
                <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Price Range</h4>
                    <div className="space-y-4">
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="text-center font-medium text-gray-600">
                            Up to <span className="font-bold text-indigo-600">${priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Sort Order */}
                <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-700 mb-4">Sort By</h4>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full cursor-pointer px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium"
                    >
                        <option value="rating-desc">⭐ Highest Rated</option>
                        <option value="price-asc">💰 Price: Low to High</option>
                        <option value="price-desc">💰 Price: High to Low</option>
                        <option value="name-asc">📝 Name: A to Z</option>
                        <option value="name-desc">📝 Name: Z to A</option>
                    </select>
                </div>

                <div className="border-t pt-6">
                    <button onClick={clearFilters} className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg">
                        Clear All Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;