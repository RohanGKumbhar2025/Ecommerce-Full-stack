import React, { useState } from 'react';
import { Star, Heart, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({
    product,
    onAddToCart,
    onToggleWishlist,
    isWishlisted,
    cart,
    pendingOperations = new Set(),
    pendingWishlistOperations = new Set()
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const { isLoggedIn } = useAuth();

    if (!product) return null; // A failsafe to prevent rendering with no data

    const isProductInCart = cart.some(item => item.id === product.id);
    const isPendingCart = pendingOperations.has(product.id);
    const isPendingWishlist = pendingWishlistOperations.has(product.id);

    const handleAddToCartClick = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        if (isPendingCart) return;
        onAddToCart(product);
    };

    const handleToggleWishlistClick = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        if (isPendingWishlist) return;
        onToggleWishlist(product.id, product);
    };

    return (
        <div
            className="group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <Link to={`/products/${product.id}`}>
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-110"
                    />
                </Link>

                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    {product.isNew && <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">NEW</span>}
                    {product.onSale && <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">SALE</span>}
                </div>

                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <button
                        onClick={handleToggleWishlistClick}
                        disabled={isPendingWishlist}
                        className={`p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isWishlisted
                                ? 'bg-red-500 text-white'
                                : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                        }`}
                    >
                        {isPendingWishlist ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                        )}
                    </button>
                    <Link to={`/products/${product.id}`} className="p-2 bg-white text-gray-600 hover:bg-indigo-500 hover:text-white rounded-full">
                        <Eye size={16} />
                    </Link>
                </div>

                {!product.inStock && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">{product.categoryName}</span>
                    <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                </div>

                <Link to={`/products/${product.id}`} className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors h-14">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-gray-800">${product.price?.toFixed(2)}</span>
                        {product.onSale && product.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCartClick}
                        disabled={!product.inStock || isProductInCart || isPendingCart}
                        className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
                            product.inStock
                                ? (isProductInCart
                                    ? 'bg-green-600 text-white'
                                    : (isPendingCart
                                        ? 'bg-indigo-400 text-white'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    )
                                )
                                : 'bg-gray-300 text-gray-500'
                        }`}
                    >
                        {isPendingCart ? (
                            <><Loader2 size={16} className="animate-spin" /> Adding...</>
                        ) : (
                            isProductInCart ? 'In Cart' : 'Add to Cart'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;