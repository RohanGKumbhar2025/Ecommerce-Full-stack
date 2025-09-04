import React from 'react';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductListItem = ({ product, onAddToCart, onToggleWishlist, isWishlisted, cart }) => {
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
            <div className="md:w-1/3 relative">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 md:h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            NEW
                        </span>
                    )}
                    {product.onSale && (
                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            SALE
                        </span>
                    )}
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                        to={`/products/${product.id}`}
                        className="p-2 bg-white bg-opacity-90 backdrop-blur-sm text-gray-700 hover:bg-indigo-500 hover:text-white rounded-full transition-all duration-200 shadow-lg"
                    >
                        <Eye size={16} />
                    </Link>
                </div>

                {!product.inStock && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.categoryName}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-700 font-medium">{product.rating}</span>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                        </div>
                    </div>

                    <Link to={`/products/${product.id}`}>
                        <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl font-bold text-gray-800">
                                ${product.price.toFixed(2)}
                            </span>
                            {product.onSale && (
                                <div className="flex flex-col">
                                    <span className="text-lg text-gray-500 line-through">
                                        ${product.originalPrice.toFixed(2)}
                                    </span>
                                    <span className="text-sm text-green-600 font-semibold">
                                        Save ${(product.originalPrice - product.price).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleToggleWishlistClick}
                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                isWishlisted
                                    ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white shadow-sm'
                            }`}
                        >
                            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>

                        <button
                            onClick={handleAddToCartClick}
                            disabled={!product.inStock || isProductInCart}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 ${
                                product.inStock
                                    ? (isProductInCart
                                        ? 'bg-green-600 text-white cursor-not-allowed shadow-lg'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105')
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <ShoppingCart size={18} />
                            <span>
                                {!product.inStock
                                    ? 'Out of Stock'
                                    : isProductInCart
                                        ? 'In Cart'
                                        : 'Add to Cart'
                                }
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductListItem;