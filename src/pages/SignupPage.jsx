import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const SignupPage = () => {
    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    // Add state for validation errors
    const [formErrors, setFormErrors] = useState({});

    const { signup } = useAuth();
    const [apiError, setApiError] = useState(null); // Renamed for clarity
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!signupForm.name) {
            errors.name = "Full name is required.";
        }
        if (!signupForm.email) {
            errors.email = "Email address is required.";
        } else if (!emailRegex.test(signupForm.email)) {
            errors.email = "Invalid email format.";
        }
        if (!signupForm.password) {
            errors.password = "Password is required.";
        } else if (signupForm.password.length < 6) {
            errors.password = "Password must be at least 6 characters long.";
        }
        if (signupForm.password !== signupForm.confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        // Clear API error on change
        if (apiError) setApiError(null);
    };

    const onSignupSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;

        // Perform client-side validation before submitting
        if (!validateForm()) {
            return;
        }

        setApiError(null);
        setIsSubmitting(true);

        try {
            await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.confirmPassword);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setApiError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasFormErrors = Object.keys(formErrors).length > 0;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join NexoShop and start shopping!</p>
                </div>
                
                {apiError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                        <div className="font-medium">Signup Failed</div>
                        <div className="text-sm mt-1">{apiError}</div>
                    </div>
                )}

                <form onSubmit={onSignupSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input 
                                id="name"
                                type="text" 
                                name="name"
                                value={signupForm.name} 
                                onChange={handleChange} 
                                onBlur={validateForm} // Validate on blur
                                placeholder="Enter your full name" 
                                required 
                                disabled={isSubmitting}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input 
                                id="email"
                                type="email" 
                                name="email"
                                value={signupForm.email} 
                                onChange={handleChange} 
                                onBlur={validateForm} // Validate on blur
                                placeholder="Enter your email address" 
                                required 
                                disabled={isSubmitting}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input 
                                id="password"
                                type="password" 
                                name="password"
                                value={signupForm.password} 
                                onChange={handleChange} 
                                onBlur={validateForm} // Validate on blur
                                placeholder="Create a strong password" 
                                required 
                                disabled={isSubmitting}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                            {formErrors.password && <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input 
                                id="confirmPassword"
                                type="password" 
                                name="confirmPassword"
                                value={signupForm.confirmPassword} 
                                onChange={handleChange} 
                                onBlur={validateForm} // Validate on blur
                                placeholder="Confirm your password" 
                                required 
                                disabled={isSubmitting}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50 ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} 
                            />
                            {formErrors.confirmPassword && <p className="mt-1 text-xs text-red-500">{formErrors.confirmPassword}</p>}
                        </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting || hasFormErrors}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>
                
                <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                        Already have an account? 
                        <Link 
                            to="/login" 
                            className="font-semibold text-indigo-600 hover:text-indigo-700 ml-1 transition-colors"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;