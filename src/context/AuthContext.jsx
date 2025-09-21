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

    // Consolidated Product State
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [productPageData, setProductPageData] = useState({ totalPages: 0, totalElements: 0 });
    
    // --- Caching States ---
    const [productDetailCache, setProductDetailCache] = useState(new Map());
    const [pageCache, setPageCache] = useState(new Map());


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
            const cachedDetails = sessionStorage.getItem("productDetailCache");
            if (cachedDetails) {
                setProductDetailCache(new Map(JSON.parse(cachedDetails)));
            }
            const cachedPages = sessionStorage.getItem("pageCache");
            if (cachedPages) {
                setPageCache(new Map(JSON.parse(cachedPages)));
            }
        } catch (error) {
            console.error("Error initializing state from storage:", error);
            localStorage.clear();
            sessionStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    const getProductDetails = useCallback(async (productId) => {
        const cacheKey = productId.toString();
        if (productDetailCache.has(cacheKey)) {
            const cached = productDetailCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5-minute cache TTL
                return cached.data;
            }
        }
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/products/${productId}`);
            const newCache = new Map(productDetailCache);
            newCache.set(cacheKey, { data, timestamp: Date.now() });
            setProductDetailCache(newCache);
            sessionStorage.setItem("productDetailCache", JSON.stringify([...newCache]));
            return data;
        } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            return null;
        }
    }, [productDetailCache]);

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

    const signup = async (name, email, password, confirmPassword) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, confirmPassword });
            const { token, id, roles } = response.data;
            const userData = { id, email, name, roles };
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setIsLoggedIn(true);
            setUser(userData);
            toast.success(`Welcome, ${name}!`);
            if (roles?.includes('ROLE_ADMIN')) navigate('/admin/list');
            else navigate('/');
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
        setProductDetailCache(new Map());
        setPageCache(new Map()); // Clear page cache on logout
        toast.info("You have been logged out.");
        navigate('/login');
    };
    
    const fetchProducts = useCallback(async (params = { page: 0, size: 9 }) => {
        const cacheKey = JSON.stringify(params);

        if (pageCache.has(cacheKey)) {
            const cached = pageCache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5-minute cache TTL
                setProducts(cached.data.content);
                setProductPageData({
                    totalPages: cached.data.totalPages,
                    totalElements: cached.data.totalElements,
                });
                setLoadingProducts(false);
                return;
            }
        }

        setLoadingProducts(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
            const data = response.data;
            if (data?.content) {
                setProducts(data.content);
                setProductPageData({
                    totalPages: data.totalPages || 0,
                    totalElements: data.totalElements || 0,
                });

                const newCache = new Map(pageCache);
                newCache.set(cacheKey, { data, timestamp: Date.now() });
                setPageCache(newCache);
                sessionStorage.setItem("pageCache", JSON.stringify([...newCache]));
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    }, [pageCache]);

    useEffect(() => {
        // This initial fetch is primarily for the home page's featured products.
        // The ProductsPage will trigger its own fetches with its specific parameters.
        if (products.length === 0) {
            fetchProducts({ page: 0, size: 8, sort: 'rating-desc' });
        }
    }, [fetchProducts, products.length]);

    const value = {
        isLoggedIn, user, loading, cart, setCart, login, logout, signup,
        products, loadingProducts, fetchProducts,
        productPageData,
        wishlistItems, setWishlistItems, wishlistIds, setWishlistIds,
        getProductDetails, fetchUserData
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);