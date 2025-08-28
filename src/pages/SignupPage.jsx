// src/pages/SignupPage.jsx (Updated)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const SignupPage = () => {
    const [signupForm, setSignupForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const onSignupSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (signupForm.password !== signupForm.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            await signup(signupForm.name, signupForm.email, signupForm.password, signupForm.confirmPassword);
            setSuccessMessage("Account created successfully! Redirecting...");
            setTimeout(() => {
                navigate('/'); // Navigate to home on successful signup
            }, 2000); 
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create Account</h2>
                
                {successMessage && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
                        {successMessage}
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={onSignupSubmit} className="space-y-6">
                    <input 
                        type="text" 
                        name="name"
                        value={signupForm.name} 
                        onChange={handleChange} 
                        placeholder="Full Name" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <input 
                        type="email" 
                        name="email"
                        value={signupForm.email} 
                        onChange={handleChange} 
                        placeholder="Email Address" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <input 
                        type="password" 
                        name="password"
                        value={signupForm.password} 
                        onChange={handleChange} 
                        placeholder="Password" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <input 
                        type="password" 
                        name="confirmPassword"
                        value={signupForm.confirmPassword} 
                        onChange={handleChange} 
                        placeholder="Confirm Password" 
                        required 
                        className="w-full p-3 border rounded-lg" 
                    />
                    <button 
                        type="submit" 
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Sign Up
                    </button>
                </form>
                
                <p className="text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;