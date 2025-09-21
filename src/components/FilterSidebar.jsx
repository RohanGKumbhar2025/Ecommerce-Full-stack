import React from 'react';

import {
  SlidersHorizontal,
  List,
  Percent,
  Sparkles,
  Heart,
  Trash2,
  Package
} from 'lucide-react';

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onCategorySelect,
  priceRange = [0, 1000],
  setPriceRange,
  sortOrder = 'rating-desc',
  setSortOrder,
  showNew = false,
  setShowNew,
  showSale = false,
  setShowSale,
  showWishlist = false,
  setShowWishlist,
  onClearAll,
  isMobile = false
}) => {
  const handlePriceChange = (e) => {
    const newMax = Number(e.target.value);
    setPriceRange([priceRange[0], newMax]);
  };

  const handleMinPriceChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin <= priceRange[1]) {
      setPriceRange([newMin, priceRange[1]]);
    }
  };

  const clearFilters = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      // Fallback individual clearing
      onCategorySelect && onCategorySelect(null);
      setPriceRange && setPriceRange([0, 1000]);
      setSortOrder && setSortOrder('rating-desc');
      setShowNew && setShowNew(false);
      setShowSale && setShowSale(false);
      setShowWishlist && setShowWishlist(false);
    }
  };

  const hasActiveFilters = selectedCategory || showNew || showSale || showWishlist ||
    priceRange[0] > 0 || priceRange[1] < 1000 || sortOrder !== 'rating-desc';

  // Category Loading Skeleton
  const CategorySkeleton = () => (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-100 rounded-lg"></div>
      ))}
    </div>
  );

  const baseClasses = isMobile
    ? "bg-white h-full flex flex-col"
    : "bg-white rounded-xl shadow-lg sticky top-24 h-fit max-h-[calc(100vh-8rem)] flex flex-col";

  return (
    <div className={baseClasses}>
      {/* Header */}
      <div className={`p-6 border-b border-gray-200 ${isMobile ? 'px-4 py-3' : ''}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <SlidersHorizontal size={20}/>
            Filters
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-full transition-colors"
            >
              <Trash2 size={14} />
              {isMobile ? 'Clear' : 'Clear All'}
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <div className="mt-2 text-sm text-gray-500">
            {[
              selectedCategory && 'Category',
              showNew && 'New',
              showSale && 'Sale',
              showWishlist && 'Wishlist',
              (priceRange[0] > 0 || priceRange[1] < 1000) && 'Price',
              sortOrder !== 'rating-desc' && 'Sort'
            ].filter(Boolean).join(', ')} active
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className={`space-y-8 ${isMobile ? 'p-4' : 'p-6'}`}>
          {/* Quick Filters */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <Sparkles size={16} />
              Quick Filters
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => setShowNew(!showNew)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                  showNew
                    ? 'border-green-500 bg-green-50 text-green-700 shadow-sm'
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-600'
                }`}
              >
                <div className={`p-1 rounded ${showNew ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">New Products</div>
                  <div className="text-sm opacity-75">Latest arrivals</div>
                </div>
                {showNew && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button
                onClick={() => setShowSale(!showSale)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                  showSale
                    ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-600'
                }`}
              >
                <div className={`p-1 rounded ${showSale ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>
                  <Percent size={16} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">On Sale</div>
                  <div className="text-sm opacity-75">Discounted items</div>
                </div>
                {showSale && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </button>
              
              <button
                onClick={() => setShowWishlist(!showWishlist)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                  showWishlist
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-sm'
                    : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50 text-gray-600'
                }`}
              >
                <div className={`p-1 rounded ${showWishlist ? 'bg-red-500 text-white' : 'bg-gray-200'}`}>
                  <Heart size={16} fill={showWishlist ? 'currentColor' : 'none'} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">My Wishlist</div>
                  <div className="text-sm opacity-75">Saved favorites</div>
                </div>
                {showWishlist && (
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <List size={16} />
              Categories
              {categories.length > 0 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {categories.length}
                </span>
              )}
            </h4>
            
            {categories.length === 0 ? (
              <CategorySkeleton />
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <button
                  onClick={() => onCategorySelect(null)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    !selectedCategory
                      ? 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 shadow-sm'
                      : 'hover:bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={16} className={!selectedCategory ? 'text-indigo-600' : 'text-gray-400'} />
                    <span className="font-medium">All Categories</span>
                  </div>
                  {!selectedCategory && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategorySelect(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 shadow-sm'
                        : 'hover:bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedCategory === category.id ? 'bg-indigo-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="font-medium text-left">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.productCount > 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {category.productCount}
                        </span>
                      )}
                      {selectedCategory === category.id && (
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Price Range Slider */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded"></div>
              Price Range
            </h4>
            <div className="space-y-4">
              {/* Min Price Input */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Minimum Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={handleMinPriceChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              
              {/* Max Price Slider */}
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Maximum Price</label>
                <input
                  type="range"
                  min={priceRange[0]}
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  style={{
                    background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${(priceRange[0]/1000)*100}%, #4f46e5 ${(priceRange[0]/1000)*100}%, #4f46e5 ${(priceRange[1]/1000)*100}%, #e5e7eb ${(priceRange[1]/1000)*100}%, #e5e7eb 100%)`
                  }}
                />
              </div>
              
              {/* Price Display */}
              <div className="flex items-center justify-between text-sm">
                <div className="bg-gray-100 px-3 py-2 rounded-lg font-semibold text-gray-700">
                  ${priceRange[0]}
                </div>
                <div className="text-gray-400">to</div>
                <div className="bg-indigo-100 px-3 py-2 rounded-lg font-semibold text-indigo-700">
                  ${priceRange[1]}
                </div>
              </div>
              
              {/* Quick price buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Under $50', value: [0, 50] },
                  { label: '$50-$100', value: [50, 100] },
                  { label: '$100-$500', value: [100, 500] },
                  { label: '$500+', value: [500, 1000] }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setPriceRange(preset.value)}
                    className={`p-2 rounded-md border transition-colors ${
                      priceRange[0] === preset.value[0] && priceRange[1] === preset.value[1]
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Sort Order */}
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded"></div>
              Sort By
            </h4>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full cursor-pointer px-4 py-3 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="rating-desc">⭐ Highest Rated</option>
              <option value="rating-asc">⭐ Lowest Rated</option>
              <option value="price-asc">💰 Price: Low to High</option>
              <option value="price-desc">💰 Price: High to Low</option>
              <option value="name-asc">📝 Name: A to Z</option>
              <option value="name-desc">📝 Name: Z to A</option>
              <option value="newest">🆕 Newest First</option>
              <option value="popularity">🔥 Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer - Clear All Button */}
      {!isMobile && hasActiveFilters && (
        <div className="border-t p-6">
          <button
            onClick={clearFilters}
            className="w-full py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
          >
            <Trash2 size={16} />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;