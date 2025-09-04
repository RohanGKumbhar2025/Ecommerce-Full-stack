import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });
    
    // Add state for validation errors
    const [formErrors, setFormErrors] = useState({});

    const { login } = useAuth();
    const [apiError, setApiError] = useState(null); // Renamed for clarity
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!loginForm.email) {
            errors.email = "Email is required.";
        } else if (!emailRegex.test(loginForm.email)) {
            errors.email = "Invalid email format.";
        }
        if (!loginForm.password) {
            errors.password = "Password is required.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Perform client-side validation before submitting
        if (!validateForm()) {
            return;
        }

        setApiError(null);
        setIsSubmitting(true);
        
        try {
            await login(loginForm.email, loginForm.password);
        } catch (err) {
            setApiError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        // Clear API error on change
        if (apiError) setApiError(null);
    };

    const hasFormErrors = Object.keys(formErrors).length > 0;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Sign in to your NexoShop account</p>
                </div>

                {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                        <div className="font-medium">Login Failed</div>
                        <div className="text-sm mt-1">{apiError}</div>
                    </div>
                )}

                <form onSubmit={onLoginSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                id="email"
                                type="email" 
                                name="email"
                                value={loginForm.email} 
                                onChange={handleChange}
                                onBlur={validateForm} // Validate on blur
                                placeholder="Enter your email address" 
                                required 
                                disabled={isSubmitting}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input 
                                    id="password"
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    value={loginForm.password} 
                                    onChange={handleChange}
                                    onBlur={validateForm} // Validate on blur
                                    placeholder="Enter your password" 
                                    required 
                                    disabled={isSubmitting}
                                    className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isSubmitting}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:opacity-50 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || hasFormErrors}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>
                
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Don't have an account? 
                        <Link 
                            to="/signup" 
                            className="font-semibold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors"
                        >
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;