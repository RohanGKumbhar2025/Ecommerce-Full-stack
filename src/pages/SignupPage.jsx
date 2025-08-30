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
    
    const { signup } = useAuth();
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        if (error) setError(null);
    };

    const onSignupSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        setError(null);
        setIsSubmitting(true);

        if (signupForm.password !== signupForm.confirmPassword) {
            setError("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        if (signupForm.password.length < 6) {
            setError("Password must be at least 6 characters long!");
            setIsSubmitting(false);
            return;
        }

        try {
            await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.confirmPassword);
            // Navigation is now handled by the signup function in AuthContext
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join NexoShop and start shopping!</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
                        <div className="font-medium">Signup Failed</div>
                        <div className="text-sm mt-1">{error}</div>
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
                                placeholder="Enter your full name" 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50" 
                            />
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
                                placeholder="Enter your email address" 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50" 
                            />
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
                                placeholder="Create a strong password" 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50" 
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
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
                                placeholder="Confirm your password" 
                                required 
                                disabled={isSubmitting}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50" 
                            />
                        </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
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