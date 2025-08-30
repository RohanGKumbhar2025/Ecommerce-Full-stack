import React, { useState } from 'react';
import { Heart, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

// Skeleton component for a better loading experience
const WishlistItemSkeleton = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
        <div className="relative aspect-square w-full bg-gray-200"></div>
        <div className="p-3 flex flex-col flex-grow">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="mt-auto pt-4">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="h-10 bg-gray-300 rounded-lg w-full"></div>
            </div>
        </div>
    </div>
);

const WishlistPage = ({ onAddToCart, onToggleWishlist, cart, pendingOperations, pendingWishlistOperations }) => {
    // Get wishlist data and the function to refresh it from the context
    const { wishlistItems, fetchUserData } = useAuth();
    const [refreshing, setRefreshing] = useState(false);

    // This function re-fetches all user data (including cart and wishlist with fresh stock)
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
        toast.success("Wishlist has been updated!");
    };

    return (
        <div className="bg-gray-50 py-12 min-h-screen animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Wishlist</h1>
                    {wishlistItems.length > 0 && (
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                            {refreshing ? 'Refreshing...' : 'Refresh Stock'}
                        </button>
                    )}
                </div>
                
                {wishlistItems && wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAddToCart={onAddToCart} 
                                onToggleWishlist={onToggleWishlist} 
                                isWishlisted={true} // All items on this page are part of the wishlist
                                cart={cart}
                                pendingOperations={pendingOperations}
                                pendingWishlistOperations={pendingWishlistOperations}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
                        <p className="text-gray-500 mt-2">Add items you love to your wishlist to save them for later.</p>
                        <Link 
                            to="/products" 
                            className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700"
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