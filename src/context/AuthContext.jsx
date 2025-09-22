import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nexoshoppinge.onrender.com';

console.log('API Base URL:', API_BASE_URL);

// Configure axios for slow backend servers
axios.defaults.timeout = 60000; // 60 seconds for slow servers
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Simple retry utility for failed requests
const retryRequest = async (requestFn, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await requestFn();
        } catch (error) {
            lastError = error;
            
            const shouldRetry =
                error.code === 'ECONNABORTED' ||
                error.code === 'ERR_NETWORK' ||
                (error.response && error.response.status >= 500);
            
            if (attempt === maxRetries || !shouldRetry) {
                break;
            }
            
            // Wait before retry with exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError;
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Core state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // App data
    const [cart, setCart] = useState([]);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [productPageData, setProductPageData] = useState({ totalPages: 0, totalElements: 0 });
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [selectedGlobalCategory, setSelectedGlobalCategory] = useState(null);

    // Simple caching
    const [productCache, setProductCache] = useState(new Map());
    const [pageCache, setPageCache] = useState(new Map());

    // Initialize from localStorage
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            
            if (token && storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error initializing auth state:', error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        if (loadingCategories || categories.length > 0) return { success: true, data: categories };
        
        setLoadingCategories(true);
        try {
            const response = await retryRequest(() =>
                axios.get(`${API_BASE_URL}/api/categories`, { timeout: 45000 })
            );
            const categoriesData = response.data || [];
            setCategories(categoriesData);
            return { success: true, data: categoriesData };
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load categories';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoadingCategories(false);
        }
    }, [categories.length, loadingCategories]); // ✅ FIX: Dependencies were sufficient here, but good practice to check all.

    // Fetch products with caching
    const fetchProducts = useCallback(async (params = { page: 0, size: 9 }) => {
        const cacheKey = JSON.stringify(params);
        
        // Check cache first
        if (pageCache.has(cacheKey)) {
            const cached = pageCache.get(cacheKey);
            const isExpired = Date.now() - cached.timestamp > 10 * 60 * 1000; // 10 minutes
            
            if (!isExpired) {
                setProducts(cached.data.content || []);
                setProductPageData({
                    totalPages: cached.data.totalPages || 0,
                    totalElements: cached.data.totalElements || 0,
                });
                return { success: true, data: cached.data, fromCache: true };
            }
        }

        setLoadingProducts(true);

        try {
            const response = await retryRequest(() =>
                axios.get(`${API_BASE_URL}/api/products`, {
                    params,
                    timeout: 45000
                })
            );

            const data = response.data;
            const products = data.content || [];
            
            setProducts(products);
            setProductPageData({
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0,
            });

            // Cache the result
            const newCache = new Map(pageCache);
            newCache.set(cacheKey, { data, timestamp: Date.now() });
            
            // Limit cache size
            if (newCache.size > 20) {
                const oldestKey = Array.from(newCache.keys())[0];
                newCache.delete(oldestKey);
            }
            
            setPageCache(newCache);

            return { success: true, data };

        } catch (error) {
            console.error('Failed to fetch products:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
            
            // Try cache as fallback
            if (pageCache.has(cacheKey)) {
                const cached = pageCache.get(cacheKey);
                setProducts(cached.data.content || []);
                setProductPageData({
                    totalPages: cached.data.totalPages || 0,
                    totalElements: cached.data.totalElements || 0,
                });
                toast.warn('Using cached results due to connection issues');
                return { success: true, data: cached.data, fromCache: true };
            }
            
            setProducts([]);
            setProductPageData({ totalPages: 0, totalElements: 0 });
            return { success: false, error: errorMessage };
        } finally {
            setLoadingProducts(false);
        }
    // ✅ FIX: Added all external state and setters to the dependency array
    }, [pageCache, setProducts, setProductPageData, setPageCache]);

    // Get product details with caching
    const getProductDetails = useCallback(async (productId) => {
        const cacheKey = productId.toString();
        
        // Check cache
        if (productCache.has(cacheKey)) {
            const cached = productCache.get(cacheKey);
            const isExpired = Date.now() - cached.timestamp > 15 * 60 * 1000; // 15 minutes
            
            if (!isExpired) {
                return cached.data; // Return the actual product data, not wrapped in success object
            }
        }

        try {
            const response = await retryRequest(() =>
                axios.get(`${API_BASE_URL}/api/products/${productId}`, { timeout: 30000 })
            );

            const productData = response.data;

            // Cache the result
            const newCache = new Map(productCache);
            newCache.set(cacheKey, { data: productData, timestamp: Date.now() });
            
            // Limit cache size
            if (newCache.size > 50) {
                const oldestKey = Array.from(newCache.keys())[0];
                newCache.delete(oldestKey);
            }
            
            setProductCache(newCache);

            return productData; // Return the actual product data directly
        } catch (error) {
            console.error(`Failed to fetch product ${productId}:`, error);
            
            // Fallback to cache
            if (productCache.has(cacheKey)) {
                const cached = productCache.get(cacheKey);
                toast.warn('Using cached product data due to connection issues');
                return cached.data;
            }
            
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load product details';
            toast.error(errorMessage);
            return null; // Return null on error
        }
    // ✅ FIX: Added all external state and setters to the dependency array
    }, [productCache, setProductCache]);

    // Fetch user data (cart and wishlist)
    const fetchUserData = useCallback(async () => {
        if (!isLoggedIn) {
            setCart([]);
            setWishlistItems([]);
            setWishlistIds(new Set());
            return { success: true };
        }

        const token = localStorage.getItem('token');
        const config = {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 30000
        };

        try {
            // Fetch cart and wishlist in parallel
            const [cartResponse, wishlistResponse] = await Promise.allSettled([
                retryRequest(() => axios.get(`${API_BASE_URL}/api/cart`, config)),
                retryRequest(() => axios.get(`${API_BASE_URL}/api/cart/wishlist`, config))
            ]);

            // Handle cart
            if (cartResponse.status === 'fulfilled') {
                const cartItems = Array.isArray(cartResponse.value.data) ? cartResponse.value.data : [];
                setCart(cartItems.map(item => ({ ...item, id: item.productId || item.id })));
            } else {
                console.error('Failed to fetch cart:', cartResponse.reason);
                setCart([]);
            }

            // Handle wishlist
            if (wishlistResponse.status === 'fulfilled') {
                const wishlistItems = Array.isArray(wishlistResponse.value.data) ? wishlistResponse.value.data : [];
                setWishlistItems(wishlistItems);
                // Force re-render by creating new Set
                const newWishlistIds = new Set(wishlistItems.map(item => item.id));
                setWishlistIds(newWishlistIds);
            } else {
                console.error('Failed to fetch wishlist:', wishlistResponse.reason);
                setWishlistItems([]);
                setWishlistIds(new Set());
            }

            return { success: true };

        } catch (error) {
            console.error('Failed to fetch user data:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to sync user data';
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    // ✅ FIX: Added all external state and setters to the dependency array
    }, [isLoggedIn, setCart, setWishlistItems, setWishlistIds]);

    // Auth functions
    const login = async (email, password) => {
        try {
            const response = await retryRequest(() =>
                axios.post(`${API_BASE_URL}/api/auth/login`, { email, password }, { timeout: 30000 })
            );

            const { token, id, name, roles } = response.data;
            const userData = { id, email, name, roles };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setIsLoggedIn(true);
            setUser(userData);

            toast.success(`Welcome back, ${name}!`);

            if (roles?.includes('ROLE_ADMIN')) {
                navigate('/admin/list');
            } else {
                navigate('/');
            }

            // Fetch user data after login
            setTimeout(() => fetchUserData(), 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
            throw error;
        }
    };

    const signup = async (name, email, password, confirmPassword) => {
        try {
            const response = await retryRequest(() =>
                axios.post(`${API_BASE_URL}/api/auth/signup`, {
                    name, email, password, confirmPassword
                }, { timeout: 30000 })
            );

            const { token, id, roles } = response.data;
            const userData = { id, email, name, roles };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            setIsLoggedIn(true);
            setUser(userData);

            toast.success(`Welcome, ${name}!`);

            if (roles?.includes('ROLE_ADMIN')) {
                navigate('/admin/list');
            } else {
                navigate('/');
            }

            // Fetch user data after signup
            setTimeout(() => fetchUserData(), 1000);

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
            toast.error(errorMessage);
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        setCart([]);
        setWishlistItems([]);
        setWishlistIds(new Set());
        setProducts([]);
        setCategories([]);
        setSelectedGlobalCategory(null);
        setProductCache(new Map());
        setPageCache(new Map());
        
        toast.info('You have been logged out');
        navigate('/login');
    };

    // Initialize categories on app start
    useEffect(() => {
        if (!loading && categories.length === 0) {
            setTimeout(() => fetchCategories(), 1000);
        }
    }, [loading, categories.length, fetchCategories]);

    const value = {
        // Auth state
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        signup,
        
        // Cart and wishlist
        cart,
        setCart,
        wishlistItems,
        setWishlistItems,
        wishlistIds,
        setWishlistIds,
        fetchUserData,
        
        // Products
        products,
        loadingProducts,
        fetchProducts,
        productPageData,
        getProductDetails,
        
        // Categories
        categories,
        loadingCategories,
        fetchCategories,
        selectedGlobalCategory,
        setSelectedGlobalCategory
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};