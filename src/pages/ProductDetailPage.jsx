import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; 
import { toast } from 'react-toastify'; 
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ProductDetailPage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth(); // Get auth state
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Failed to fetch product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCartClick = () => {
        if (!isLoggedIn) {
            toast.error("Please log in to add items to your cart.");
            navigate('/login');
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


    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/products')}
                    className="flex items-center gap-2 mb-6 text-gray-600 hover:text-indigo-600 font-semibold transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Products
                </button>

                <div className="bg-white rounded-xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image Section */}
                    <div className="relative aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                        {!product.inStock && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-xl">
                                <span className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
                            </div>
                        )}
                    </div>

                    {/* Product Details Section */}
                    <div className="flex flex-col">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                {/* ✅ FIX: Use categoryName from the DTO */}
                                {product.categoryName && <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{product.categoryName}</span>}
                                <div className="flex items-center space-x-1">
                                    <Star size={18} className="text-yellow-400 fill-current" />
                                    <span className="text-md text-gray-600 font-semibold">{product.rating || 'N/A'}</span>
                                    <span className="text-sm text-gray-500">({product.reviews || '0'} reviews)</span>
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

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mt-auto">
                            <button
                                onClick={handleAddToCartClick}
                                disabled={!product.inStock || isProductInCart}
                                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                    product.inStock
                                        ? (isProductInCart
                                           ? 'bg-green-600 text-white cursor-not-allowed'
                                           : 'bg-indigo-600 hover:bg-indigo-700 text-white transform hover:scale-105')
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isProductInCart ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={handleToggleWishlistClick}
                                className={`p-3 rounded-lg transition-colors duration-200 border-2 ${
                                    isWishlisted
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'bg-white border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'
                                }`}
                            >
                                <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;