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

    // --- START: ADDED CODE FOR PRODUCT CACHING ---
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const fetchProducts = useCallback(async () => {
        // Only show the main loader on the very first fetch when the cache is empty.
        if (products.length === 0) {
            setLoadingProducts(true);
        }
        try {
            // Fetch the first 8-9 products for the homepage view.
            const response = await axios.get(`${API_BASE_URL}/api/products?size=8`);
            if (response.data && response.data.content) {
                setProducts(response.data.content);
            }
        } catch (error) {
            console.error("Failed to fetch products for cache:", error);
            toast.error("Could not load product data.");
        } finally {
            setLoadingProducts(false);
        }
    }, [products.length]); // The dependency ensures this function gets remade if products are ever cleared.

    // Fetch products once on initial app load.
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    // --- END: ADDED CODE FOR PRODUCT CACHING ---


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
            console.error("Error initializing auth state from storage:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
            
            if (roles && roles.includes('ROLE_ADMIN')) {
                navigate('/admin/list');
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast.error(error.response?.data?.message || 'Login failed.');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setCart([]); // Clear cart state on logout
        toast.info("You have been logged out.");
        navigate('/login');
    };

    const signup = async (name, email, password, confirmPassword) => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/signup`, { name, email, password, confirmPassword });
            toast.success("Account created successfully! Please log in.");
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
            toast.error(error.response?.data?.message || 'Signup failed.');
            throw error;
        }
    };

    // Expose the new product state and fetch function through the context provider.
    const value = {
        isLoggedIn, user, loading, cart, setCart, login, logout, signup,
        products, loadingProducts, fetchProducts
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