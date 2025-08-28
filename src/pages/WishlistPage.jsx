import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const WishlistPage = ({ wishlistItems, onAddToCart, onToggleWishlist, cart }) => {
    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Wishlist</h1>
                
                {/* Check if the wishlist has items */}
                {wishlistItems && wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* ✅ FIX: Filter out any invalid items before trying to display them */}
                        {wishlistItems.filter(Boolean).map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={onAddToCart} 
                                onToggleWishlist={onToggleWishlist} 
                                isWishlisted={true} // All items on this page are wishlisted by definition
                                cart={cart}
                            />
                        ))}
                    </div>
                ) : (
                    // Display this message if the wishlist is empty
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
                        <p className="text-gray-500 mt-2">Add items you love to your wishlist to save them for later.</p>
                        <Link 
                            to="/products" 
                            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
                        >
                            Discover Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;