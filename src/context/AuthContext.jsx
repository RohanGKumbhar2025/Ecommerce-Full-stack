import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Core Auth State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // App-Wide State
    const [cart, setCart] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());

    // --- Your Existing Functionality (Preserved) ---
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const [productPageData, setProductPageData] = useState({ totalPages: 0, totalElements: 0 });
    const [loadingPaginatedProducts, setLoadingPaginatedProducts] = useState(true);
    const [productCache, setProductCache] = useState(new Map());

    // Initialize state from storage
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const storedUser = JSON.parse(localStorage.getItem('user'));
                if (storedUser) {
                    setUser(storedUser);
                    setIsLoggedIn(true);
                }
            }
            const cachedProductCache = sessionStorage.getItem("productCache");
            if (cachedProductCache) {
                setProductCache(new Map(JSON.parse(cachedProductCache)));
            }
        } catch (error) {
            console.error("Error initializing state from storage:", error);
            localStorage.clear();
            sessionStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    // Your function to get product details with caching
    const getProductDetails = useCallback(async (productId) => {
        if (productCache.has(productId)) {
            const cached = productCache.get(productId);
            if (Date.now() - cached.timestamp < 300000) { // 5-minute cache TTL
                return cached.data;
            }
        }
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
            const newCache = new Map(productCache);
            newCache.set(productId, { data, timestamp: Date.now() });
            setProductCache(newCache);
            sessionStorage.setItem("productCache", JSON.stringify([...newCache]));
            return data;
        } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            return null;
        }
    }, [productCache]);

    // Your function to fetch user data (cart and wishlist)
    const fetchUserData = useCallback(async () => {
        if (!isLoggedIn) {
            setCart([]);
            setWishlistItems([]);
            setWishlistIds(new Set());
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
            const [cartRes, wishlistRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/cart`, config),
                axios.get(`${API_BASE_URL}/api/cart/wishlist`, config),
            ]);

            const cartItems = Array.isArray(cartRes.data) ? cartRes.data : [];
            const rawWishlistItems = Array.isArray(wishlistRes.data) ? wishlistRes.data : [];

            const enrichedWishlistItems = await Promise.all(
                rawWishlistItems.map(async (item) => {
                    const freshProduct = await getProductDetails(item.productId);
                    return freshProduct ? { ...freshProduct, id: freshProduct.id } : null;
                })
            );

            setCart(cartItems.map(item => ({ ...item, id: item.productId })));
            const validWishlistItems = enrichedWishlistItems.filter(Boolean);
            setWishlistItems(validWishlistItems);
            setWishlistIds(new Set(validWishlistItems.map(item => item.id)));

        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }, [isLoggedIn, getProductDetails]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
            const { token, id, name, roles } = response.data;
            const userData = { id, email, name, roles };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoggedIn(true);
            setUser(userData);
            toast.success(`Welcome back, ${name}!`);
            if (roles?.includes('ROLE_ADMIN')) navigate('/admin/list');
            else navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
            throw error;
        }
    };

    // ✅ FIXED: Auto-login after signup is now correctly implemented
    const signup = async (name, email, password, confirmPassword) => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, confirmPassword });
            toast.success("Account created successfully! Logging you in...");
            await login(email, password); // This will handle setting state and navigation
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed.');
            throw error;
        }
    };
    
    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        setCart([]);
        setWishlistItems([]);
        setWishlistIds(new Set());
        setProductCache(new Map()); // Clear cache on logout
        toast.info("You have been logged out.");
        navigate('/login');
    };
    
    // --- Preserving Your Other Functions ---
    const fetchProducts = useCallback(async () => {
        // Your implementation from the provided code...
        if (products.length === 0) setLoadingProducts(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products?size=8`);
            if (response.data?.content) setProducts(response.data.content);
        } catch (error) {
            console.error("Failed to fetch products for cache:", error);
        } finally {
            setLoadingProducts(false);
        }
    }, [products.length]);

    const fetchPaginatedProducts = useCallback(async (params) => {
        // Your implementation from the provided code...
        setLoadingPaginatedProducts(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
            setPaginatedProducts(response.data.content || []);
            setProductPageData({
                totalPages: response.data.totalPages || 0,
                totalElements: response.data.totalElements || 0,
            });
        } catch (error) {
            console.error("Failed to fetch paginated products:", error);
            setPaginatedProducts([]);
        } finally {
            setLoadingPaginatedProducts(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const value = {
        isLoggedIn, user, loading, cart, setCart, login, logout, signup,
        products, loadingProducts, fetchProducts,
        paginatedProducts, productPageData, loadingPaginatedProducts, fetchPaginatedProducts,
        wishlistItems, setWishlistItems, wishlistIds, setWishlistIds,
        getProductDetails, fetchUserData
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);