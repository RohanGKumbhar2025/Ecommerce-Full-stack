import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all necessary components and pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import WishlistPage from './pages/WishlistPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminLayout from './layout/AdminLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentRedirectingPage from './pages/PaymentRedirectingPage';
import StripeDummyPage from './pages/StripeDummyPage';
import ScrollToTop from './components/ScrollToTop';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get authorization headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- Helper Components for Routing ---
const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <div className="text-center py-16">Loading...</div>;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, loading } = useAuth();
    if (loading) return <div className="text-center py-16">Loading...</div>;
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');
    return isLoggedIn && isAdmin ? children : <Navigate to="/" replace />;
};

// --- Main App Logic Component ---
function AppContent() {
    const { isLoggedIn, cart, setCart, wishlistItems, setWishlistItems, wishlistIds, setWishlistIds, fetchUserData } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [pendingOperations, setPendingOperations] = useState(new Set());
    const location = useLocation();

    // Fetch user-specific data when login state changes
    useEffect(() => {
        if (isLoggedIn) {
            fetchUserData();
        }
    }, [isLoggedIn, fetchUserData]);

    // --- Optimistic Update Handlers for a Faster User Experience ---

    const handleAddToCart = async (product) => {
        if (!isLoggedIn) return toast.error("Please log in to add items to your cart.");
        if (pendingOperations.has(product.id)) return;

        setPendingOperations(prev => new Set(prev).add(product.id));
        const originalCart = [...cart];
        const existingItem = cart.find(item => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        
        // Optimistically update the UI immediately
        const newCart = existingItem
            ? cart.map(item => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
            : [...cart, { ...product, quantity: 1, id: product.id }];
        setCart(newCart);
        toast.success(`${product.name} added to cart!`);

        // Send the request to the backend in the background
        try {
            await axios.post(`${API_BASE_URL}/api/cart`, { productId: product.id, quantity: newQuantity, isWishlisted: false }, getAuthHeaders());
        } catch (error) {
            toast.error("Failed to add to cart. Reverting.");
            setCart(originalCart); // Rollback UI on failure
        } finally {
            setPendingOperations(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
            });
        }
    };
    
    const handleToggleWishlist = async (productId, product) => {
        if (!isLoggedIn) return toast.error("Please log in to manage your wishlist.");
        if (pendingOperations.has(productId)) return;

        setPendingOperations(prev => new Set(prev).add(productId));
        const originalWishlist = [...wishlistItems];
        const originalIds = new Set(wishlistIds);
        const isCurrentlyWishlisted = wishlistIds.has(productId);

        // Optimistically update UI
        if (isCurrentlyWishlisted) {
            setWishlistItems(wishlistItems.filter(item => item.id !== productId));
            setWishlistIds(prev => { const newSet = new Set(prev); newSet.delete(productId); return newSet; });
            toast.info(`${product.name} removed from wishlist.`);
        } else {
            setWishlistItems([...wishlistItems, { ...product, id: productId }]);
            setWishlistIds(prev => new Set(prev).add(productId));
            toast.success(`${product.name} added to wishlist!`);
        }

        // Send request to the backend
        try {
            const cartItem = cart.find(item => item.id === productId);
            const quantity = cartItem ? cartItem.quantity : 1;
            await axios.post(`${API_BASE_URL}/api/cart`, { productId, quantity, isWishlisted: !isCurrentlyWishlisted }, getAuthHeaders());
        } catch (error) {
            toast.error("Failed to update wishlist. Reverting.");
            setWishlistItems(originalWishlist); // Rollback on failure
            setWishlistIds(originalIds);
        } finally {
            setPendingOperations(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    // You would create similar optimistic handlers for updateQuantity and removeFromCart here
    const handleUpdateQuantity = async (productId, newQuantity) => { /* ... optimistic logic ... */ };
    const handleRemoveFromCart = async (productId) => { /* ... optimistic logic ... */ };

    const isFullScreenPage = location.pathname.includes('/payment');
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            {!isFullScreenPage && !isAdminPage && <Navbar cartCount={cart.length} wishlistCount={wishlistItems.length} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/" element={<HomePage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} pendingOperations={pendingOperations} />} />
                    <Route path="/products" element={<ProductsPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} pendingOperations={pendingOperations} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} pendingOperations={pendingOperations} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    
                    {/* Private Routes */}
                    <Route path="/wishlist" element={<PrivateRoute><WishlistPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} cart={cart} pendingOperations={pendingOperations} /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} setCart={setCart} /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />
                    <Route path="/redirecting-to-payment" element={<PrivateRoute><PaymentRedirectingPage /></PrivateRoute>} />
                    <Route path="/payment" element={<PrivateRoute><StripeDummyPage /></PrivateRoute>} />
                    <Route path="/payment-success/:orderId" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />

                    {/* Admin Routes */}
                    <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
                </Routes>
            </main>
            {!isFullScreenPage && !isAdminPage && <Footer />}
        </div>
    );
}

// --- Root Component ---
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}