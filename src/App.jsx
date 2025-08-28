import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Components & Pages
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
import StripeDummyPage from './pages/StripeDummyPage';
import PaymentRedirectingPage from './pages/PaymentRedirectingPage';
import AdminLayout from './layout/AdminLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import ScrollToTop from './components/ScrollToTop';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Helper Components ---
const PrivateRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <div className="text-center py-16">Loading...</div>;
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
    const { isLoggedIn, user, loading } = useAuth();
    if (loading) return <div className="text-center py-16">Loading...</div>;
    const isAdmin = user && user.roles && user.roles.includes('ROLE_ADMIN');
    return isLoggedIn && isAdmin ? children : <Navigate to="/" replace />;
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- Main App Content ---
function AppContent() {
    const { isLoggedIn, cart, setCart, user } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const location = useLocation();
    const isFullScreenPage = location.pathname === '/payment' ||
        location.pathname.startsWith('/payment-success') ||
        location.pathname === '/redirecting-to-payment';
    const isAdminPage = location.pathname.startsWith('/admin');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) {
                setCart([]);
                setWishlist([]);
                setWishlistIds(new Set());
                return;
            }
            try {
                const config = getAuthHeaders();
                const [cartResponse, wishlistResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/cart`, config),
                    axios.get(`${API_BASE_URL}/api/cart/wishlist`, config)
                ]);

                // ✅ FIX: Verify the API response is an array before using .map()
                // This prevents crashes if the API returns an error object.
                const formattedCart = Array.isArray(cartResponse.data)
                    ? cartResponse.data.map(item => ({
                        id: item.productId,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        price: item.price,
                        quantity: item.quantity,
                    }))
                    : [];

                const formattedWishlist = Array.isArray(wishlistResponse.data)
                    ? wishlistResponse.data.map(item => ({
                        id: item.productId,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        price: item.price,
                        quantity: item.quantity,
                    }))
                    : [];

                setCart(formattedCart);
                setWishlist(formattedWishlist);
                setWishlistIds(new Set(formattedWishlist.map(item => item.id)));

            } catch (error) {
                console.error("Failed to fetch user data:", error);
                // ✅ FIX: Clear state on error to avoid showing stale data.
                setCart([]);
                setWishlist([]);
                setWishlistIds(new Set());
            }
        };
        fetchUserData();
    }, [isLoggedIn, setCart]);

    // --- Event Handlers ---
    const updateItem = async (productId, quantity, isWishlisted) => {
        if (!isLoggedIn) {
            toast.error("Please log in to perform this action.");
            return false;
        }
        try {
            await axios.post(`${API_BASE_URL}/api/cart`, { productId, quantity, isWishlisted }, getAuthHeaders());
            return true;
        } catch (error) {
            toast.error("Could not update item. Please try again.");
            return false;
        }
    };

    const handleAddToCart = async (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        if (await updateItem(product.id, newQuantity, false)) {
            setCart(prev => existingItem ? prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item) : [...prev, { ...product, quantity: 1 }]);
            toast.success(`${product.name} added to cart!`);
        }
    };

    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) {
            await handleRemoveFromCart(productId);
            return;
        }
        if (await updateItem(productId, newQuantity, false)) {
            setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, getAuthHeaders());
            setCart(prev => prev.filter(item => item.id !== productId));
            toast.info("Item removed from cart.");
        } catch (error) {
            toast.error("Failed to remove item.");
        }
    };

    const handleToggleWishlist = async (productId, product) => {
        const isCurrentlyWishlisted = wishlistIds.has(productId);
        // For wishlist, we also need to handle moving it from cart if it exists there
        const cartItem = cart.find(item => item.id === productId);
        const quantity = cartItem ? cartItem.quantity : 1;

        if (await updateItem(productId, quantity, !isCurrentlyWishlisted)) {
            if (isCurrentlyWishlisted) {
                setWishlist(prev => prev.filter(item => item.id !== productId));
                setWishlistIds(prev => { const newSet = new Set(prev); newSet.delete(productId); return newSet; });
                toast.info(`${product.name} removed from wishlist.`);
            } else {
                setWishlist(prev => [...prev, { ...product, id: productId }]);
                setWishlistIds(prev => new Set(prev).add(productId));
                toast.success(`${product.name} added to wishlist!`);
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {!isFullScreenPage && !isAdminPage && <Navbar cartCount={cart.length} wishlistCount={wishlist.length} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />}

            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} />} />
                    <Route path="/products" element={<ProductsPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} />} />
                    <Route path="/products/:id" element={<ProductDetailPage onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlistIds={wishlistIds} cart={cart} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/redirecting-to-payment" element={<PrivateRoute><PaymentRedirectingPage /></PrivateRoute>} />
                    <Route path="/payment" element={<PrivateRoute><StripeDummyPage /></PrivateRoute>} />
                    <Route path="/payment-success/:orderId" element={<PrivateRoute><PaymentSuccessPage /></PrivateRoute>} />
                    <Route path="/wishlist" element={<PrivateRoute><WishlistPage wishlistItems={wishlist} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} cart={cart} /></PrivateRoute>} />
                    <Route path="/cart" element={<PrivateRoute><CartPage cart={cart} onUpdateQuantity={handleUpdateQuantity} onRemoveFromCart={handleRemoveFromCart} setCart={setCart} /></PrivateRoute>} />
                    <Route path="/orders" element={<PrivateRoute><OrderHistoryPage /></PrivateRoute>} />

                    <Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>} />
                </Routes>
            </main>

            {!isFullScreenPage && !isAdminPage && <Footer />}
        </div>
    );
}

// --- Root App Component ---
export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <ScrollToTop />
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}