import React, { useState } from 'react';
import { Star, Heart, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, cart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const isProductInCart = cart.some(item => item.id === product.id);

    const handleAddToCartClick = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        onAddToCart(product);
    };

    const handleToggleWishlistClick = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        onToggleWishlist(product.id, product);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">NEW</span>}
                    {product.onSale && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">SALE</span>}
                </div>
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={handleToggleWishlistClick}
                        className={`p-2 rounded-full transition-colors cursor-pointer duration-200 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'}`}
                    >
                        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                    <Link to={`/products/${product.id}`} className="p-2 bg-white text-gray-600 hover:bg-indigo-500 hover:text-white rounded-full transition-colors duration-200">
                        <Eye size={16} />
                    </Link>
                </div>
                {!product.inStock && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                    </div>
                )}
            </div>

            {/* ✅ FIX: The entire content section is now a flex column to ensure proper spacing */}
            <div className="p-3 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.categoryName}</span>
                    <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                </div>
                
                {/* ✅ FIX: flex-grow pushes the content below it down, and min-h-[120px] provides space for content below */}
                <div className="flex-grow min-h-[120px]">
                    <Link to={`/products/${product.id}`}>
                        {/* ✅ FIX: Enforced height and line-clamp for consistent sizing */}
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors h-14">{product.name}</h3>
                    </Link>
                    {/* ✅ FIX: Enforced height and line-clamp for consistent sizing */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{product.description}</p>
                </div>

                {/* ✅ FIX: mt-auto pushes this block to the bottom of the card */}
                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                            {product.onSale && <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>}
                        </div>
                    </div>
                    <button
                        onClick={handleAddToCartClick}
                        disabled={!product.inStock || isProductInCart}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${product.inStock ? (isProductInCart ? 'bg-green-600 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105') : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        {isProductInCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;