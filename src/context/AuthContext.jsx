import React, { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        // This effect runs only once to check for a token in local storage
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
            // Clear corrupted data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } finally {
            // This is critical: mark the initial check as complete
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
            // Redirect to login for a cleaner flow after signup
            navigate('/login');
        } catch (error) {
            console.error('Signup failed:', error);
            toast.error(error.response?.data?.message || 'Signup failed.');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, cart, setCart, login, logout, signup }}>
            {/* ✅ FIX: Don't render any part of the app until the initial auth check is complete */}
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