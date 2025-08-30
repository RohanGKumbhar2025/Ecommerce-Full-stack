import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify'; 

// Skeleton component for a better loading experience
const ProductDetailSkeleton = () => (
    <div className="bg-gray-50 py-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-6 w-32 bg-gray-300 rounded mb-6 animate-pulse"></div>
            <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="relative aspect-square bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="flex flex-col space-y-4">
                    <div className="h-10 w-full bg-gray-300 rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-12 w-32 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex space-x-4 mt-auto">
                        <div className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
                        <div className="h-12 w-12 bg-gray-300 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ProductDetailPage = ({ 
    onAddToCart, 
    onToggleWishlist, 
    wishlistIds = new Set(), 
    cart,
    pendingOperations = new Set(),
    pendingWishlistOperations = new Set()
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, getProductDetails } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const productData = await getProductDetails(id);
            setProduct(productData);
            setLoading(false);
        };
        
        if (id) {
            fetchProduct();
        }
    }, [id, getProductDetails]);

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl text-gray-700">Product not found.</h1>
            </div>
        );
    }

    const isWishlisted = wishlistIds.has(product.id);
    const isProductInCart = cart.some(item => item.id === product.id);
    const isPendingCart = pendingOperations.has(product.id);
    const isPendingWishlist = pendingWishlistOperations.has(product.id);

    const handleAddToCartClick = () => {
        if (!isLoggedIn) return toast.error("Please log in to add items.");
        if (isPendingCart) return;
        onAddToCart(product);
    };

    const handleToggleWishlistClick = () => {
        if (!isLoggedIn) return toast.error("Please log in to manage your wishlist.");
        if (isPendingWishlist) return;
        onToggleWishlist(product.id, product);
    };

    return (
        <div className="bg-gray-50 py-12 min-h-screen animate-fade-in">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 font-semibold">
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                        {!product.inStock && ( <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-xl"><span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">Out of Stock</span></div> )}
                    </div>

                    <div className="flex flex-col">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{product.categoryName}</span>
                                <div className="flex items-center space-x-1">
                                    <Star size={18} className="text-yellow-400 fill-current" />
                                    <span className="text-md font-semibold">{product.rating}</span>
                                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 my-4">{product.name}</h1>
                            <p className="text-gray-600 text-base mb-6 leading-relaxed">{product.description}</p>
                            
                            <div className="flex items-baseline space-x-3 mb-6">
                                <span className="text-4xl font-bold text-gray-800">${product.price.toFixed(2)}</span>
                                {product.onSale && product.originalPrice && (
                                    <span className="text-xl text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-auto">
                            <button onClick={handleAddToCartClick} disabled={!product.inStock || isProductInCart || isPendingCart} className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed ${product.inStock ? (isProductInCart ? 'bg-green-600 text-white' : (isPendingCart ? 'bg-indigo-400 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white')) : 'bg-gray-300 text-gray-500'}`}>
                                {isPendingCart ? <><Loader2 size={20} className="animate-spin" /> Adding...</> : (isProductInCart ? 'Added to Cart' : 'Add to Cart')}
                            </button>
                            <button onClick={handleToggleWishlistClick} disabled={isPendingWishlist} className={`p-3 rounded-lg border-2 transition-colors disabled:opacity-50 ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'}`}>
                                {isPendingWishlist ? <Loader2 size={24} className="animate-spin" /> : <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;