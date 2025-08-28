import React, { useState, useEffect } from 'react';
import { Zap, Shield, Truck, Award, ArrowRight, ShoppingBag, Star } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Data for New Sections ---
const testimonials = [
    { id: 1, name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80", rating: 5, comment: "Absolutely love the quality and the speed of delivery. My new favorite place to shop online!" },
    { id: 2, name: "Michael B.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80", rating: 5, comment: "The best customer service I have ever experienced. They went above and beyond to help me." },
    { id: 3, name: "Emily R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80", rating: 5, comment: "Found exactly what I was looking for at a great price. The whole process was seamless and easy." }
];

// --- HomePage Component ---
const HomePage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/products`);
                // ✅ FIX: Access the 'content' array from the paginated response
                if (response.data && response.data.content) {
                    setProducts(response.data.content.slice(0, 8));
                } else if (Array.isArray(response.data)) {
                    // Fallback if API returns direct array
                    setProducts(response.data.slice(0, 8));
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Effect for testimonial slider
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000); // Change testimonial every 5 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="text-center py-16">Loading products...</div>;
    }

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gray-50 overflow-hidden">
                 <div className="container mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Find Your Style, <br />
                            <span className="text-indigo-600">Define Your Look.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                            Discover amazing products with unbeatable prices and exceptional quality, curated just for you.
                        </p>
                        <Link
                            to="/products"
                            className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105 shadow-lg"
                        >
                            Shop Now <ArrowRight size={20} />
                        </Link>
                    </div>
                     <div className="hidden md:block">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1170&q=80"
                            alt="E-commerce model"
                            className="rounded-xl shadow-2xl"
                        />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <Truck className="text-indigo-600" size={32} />, title: "Free & Fast Shipping", description: "On all orders over $50" },
                            { icon: <Shield className="text-indigo-600" size={32} />, title: "Secure Payments", description: "100% secure transactions" },
                            { icon: <Award className="text-indigo-600" size={32} />, title: "Quality Guarantee", description: "Authentic, high-quality products" },
                            { icon: <Zap className="text-indigo-600" size={32} />, title: "24/7 Fast Support", description: "Always here to help you" }
                        ].map((feature, index) => (
                            <div key={index} className="flex items-start p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                                <div className="flex-shrink-0 mr-4">{feature.icon}</div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-600 mt-1">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Featured Products */}
            <div className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                        <p className="text-gray-600 mt-2">Check out our most popular and trending products</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                                isWishlisted={wishlistIds.has(product.id)}
                                cart={cart}
                            />
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link
                            to="/products"
                            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 transform hover:scale-105 inline-block"
                        >
                            View All Products
                        </Link>
                    </div>
                </div>
            </div>

            {/* Customer Testimonials Section */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
                        <p className="text-gray-600 mt-2">Real reviews from our amazing customers.</p>
                    </div>
                    <div className="relative max-w-3xl mx-auto">
                        <div className="overflow-hidden relative h-48">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={testimonial.id}
                                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="flex mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                                        </div>
                                        <blockquote className="text-xl text-gray-700 font-medium mb-4">"{testimonial.comment}"</blockquote>
                                        <div className="flex items-center">
                                            <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-indigo-700">
                <div className="container mx-auto px-6 py-16 text-center text-white">
                    <ShoppingBag size={48} className="mx-auto mb-4" />
                    <h2 className="text-3xl font-bold">Stay in the Loop</h2>
                    <p className="mt-2 mb-6 max-w-xl mx-auto">Subscribe to get the latest updates on new arrivals, special offers, and exclusive deals.</p>
                    <form className="max-w-md mx-auto flex">
                        <input type="email" placeholder="Enter your email" className="flex-grow p-3 rounded-l-lg text-gray-800 focus:outline-none" />
                        <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-black">Subscribe</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// ✅ FIXED: Added missing export statement
export default HomePage;