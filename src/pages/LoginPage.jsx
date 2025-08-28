// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    // 💡 Manage the login form state locally
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await login(loginForm.email, loginForm.password);
            // 💡 Navigate to the home page or another protected route on successful login
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form onSubmit={onLoginSubmit} className="space-y-6">
                    <input 
                        type="email" 
                        name="email"
                        value={loginForm.email} 
                        onChange={handleChange}
                        placeholder="Email Address" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <input 
                        type="password" 
                        name="password"
                        value={loginForm.password} 
                        onChange={handleChange}
                        placeholder="Password" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <button type="submit" className="w-full py-3 bg-indigo-600 cursor-pointer text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">Log In</button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;