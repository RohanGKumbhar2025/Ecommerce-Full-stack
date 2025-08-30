import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    // --- State for Caching and Advanced Fetching ---
    const [products, setProducts] = useState([]); // For HomePage
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [paginatedProducts, setPaginatedProducts] = useState([]); // For ProductsPage
    const [productPageData, setProductPageData] = useState({ totalPages: 0, totalElements: 0 });
    const [loadingPaginatedProducts, setLoadingPaginatedProducts] = useState(true);
    const [lastFetched, setLastFetched] = useState(null); // ✅ For throttling API calls

    // --- Effects for Initializing State from Storage ---
    useEffect(() => {
        // ✅ Persist Products: On initial load, try to get cached data from sessionStorage.
        try {
            const cachedProducts = sessionStorage.getItem("paginatedProducts");
            const cachedMeta = sessionStorage.getItem("productPageData");
            if (cachedProducts && cachedMeta) {
                setPaginatedProducts(JSON.parse(cachedProducts));
                setProductPageData(JSON.parse(cachedMeta));
                setLoadingPaginatedProducts(false); // We have data, so we're not "loading" initially
            }
        } catch (error) {
            console.error("Failed to parse cached product data:", error);
            sessionStorage.removeItem("paginatedProducts");
            sessionStorage.removeItem("productPageData");
        }
    }, []);

    const fetchProducts = useCallback(async () => {
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
    
    // ✅ API Optimization: This function now prevents re-fetching if data is less than 2 minutes old.
    const fetchPaginatedProducts = useCallback(async (params) => {
        if (lastFetched && (Date.now() - lastFetched < 120000)) {
            // If the user is just re-visiting the page, don't re-fetch immediately.
            // The existing (stale) data will be shown instantly.
            return;
        }
        setLoadingPaginatedProducts(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/api/products`, { params });
            const newProducts = response.data.content || [];
            const newPageData = {
                totalPages: response.data.totalPages || 0,
                totalElements: response.data.totalElements || 0,
            };
            setPaginatedProducts(newProducts);
            setProductPageData(newPageData);
            setLastFetched(Date.now()); // Update timestamp
            
            // ✅ Persist Products: Save the new data to sessionStorage.
            sessionStorage.setItem("paginatedProducts", JSON.stringify(newProducts));
            sessionStorage.setItem("productPageData", JSON.stringify(newPageData));
        } catch (error) {
            console.error("Failed to fetch paginated products:", error);
            setPaginatedProducts([]);
        } finally {
            setLoadingPaginatedProducts(false);
        }
    }, [lastFetched]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

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
        } catch (error) {
            console.error("Error initializing auth state:", error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    }, []);

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
    
    const logout = () => {
        localStorage.clear();
        sessionStorage.clear(); // ✅ Clear session cache on logout
        setIsLoggedIn(false);
        setUser(null);
        setCart([]);
        setProducts([]); // Clear product caches
        setPaginatedProducts([]);
        toast.info("You have been logged out.");
        navigate('/login');
    };

    const signup = async (name, email, password, confirmPassword) => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, confirmPassword });
            toast.success("Account created! Please log in.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Signup failed.');
            throw error;
        }
    };

    const value = {
        isLoggedIn, user, loading, cart, setCart, login, logout, signup,
        products, loadingProducts, fetchProducts,
        paginatedProducts, productPageData, loadingPaginatedProducts, fetchPaginatedProducts
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};