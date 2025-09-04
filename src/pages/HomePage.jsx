import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Shield, Truck, Award, ArrowRight, ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Static data for the page
const testimonials = [
  { id: 1, name: "Sarah J.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80", rating: 5, comment: "Absolutely love the quality and the speed of delivery. My new favorite place to shop online!" },
  { id: 2, name: "Michael B.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80", rating: 5, comment: "The best customer service I have ever experienced. They went above and beyond to help me." },
  { id: 3, name: "Emily R.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80", rating: 5, comment: "Found exactly what I was looking for at a great price. The whole process was seamless and easy." }
];

// Skeleton loader
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
    <div className="relative aspect-square w-full bg-gray-200 animate-pulse"></div>
    <div className="p-3 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
      </div>
      <div className="flex-grow min-h-[120px]">
        <div className="h-6 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-full mt-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="h-8 bg-gray-300 rounded w-1/3 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-300 rounded-lg w-full animate-pulse"></div>
      </div>
    </div>
  </div>
);

const HomePage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
  const { products, loadingProducts, fetchProducts } = useAuth();

  // States
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Responsive products per slide
  const getProductsToShow = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  const [productsToShow, setProductsToShow] = useState(getProductsToShow());

  useEffect(() => {
    const handleResize = () => setProductsToShow(getProductsToShow());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(products.length / productsToShow);

  // Auto testimonial change
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  const showSkeletons = loadingProducts && products.length === 0;

  // Carousel navigation
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const startIndex = currentSlide * productsToShow;
  const displayedProducts = useMemo(() => {
    return products.slice(startIndex, startIndex + productsToShow);
  }, [products, startIndex, productsToShow]);

  // Newsletter handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    // Simple validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    toast.success(`Thank you for subscribing with ${email}!`, { position: "top-center" });
    e.target.reset();
  };

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
              alt="Stylish woman shopping"
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

      {/* Featured Products Carousel */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600 mt-2">Check out our most popular and trending products</p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden">
              {showSkeletons ? (
                Array.from({ length: 4 }).map((_, index) => <ProductCardSkeleton key={index} />)
              ) : (
                displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlistIds.has(product.id)}
                    cart={cart}
                  />
                ))
              )}
            </div>

            {/* Carousel Navigation */}
            <button
              onClick={goToPrevSlide}
              disabled={currentSlide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNextSlide}
              disabled={currentSlide >= totalSlides - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
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

      {/* Customer Testimonials */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
            <p className="text-gray-600 mt-2">Real reviews from our amazing customers.</p>
          </div>
          <div className="relative max-w-3xl mx-auto" aria-live="polite">
            <div className="overflow-hidden relative h-48">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 font-medium mb-4">
                      "{testimonial.comment}"
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={testimonial.avatar}
                        alt={`Photo of ${testimonial.name}`}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-indigo-700">
        <div className="container mx-auto px-6 py-16 text-center text-white">
          <ShoppingBag size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Stay in the Loop</h2>
          <p className="mt-2 mb-6 max-w-xl mx-auto">
            Subscribe to get the latest updates on new arrivals, special offers, and exclusive deals.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex">
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="flex-grow p-3 rounded-l-lg text-gray-800 focus:outline-none"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-black"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;