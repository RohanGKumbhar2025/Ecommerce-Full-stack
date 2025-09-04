import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Zap,
  Shield,
  Truck,
  Award,
  ArrowRight,
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

// =======================
// Static Data
// =======================
const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    rating: 5,
    comment:
      "Absolutely love the quality and the speed of delivery. My new favorite place to shop online!",
  },
  {
    id: 2,
    name: "Michael B.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    rating: 5,
    comment:
      "The best customer service I have ever experienced. They went above and beyond to help me.",
  },
  {
    id: 3,
    name: "Emily R.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    rating: 5,
    comment:
      "Found exactly what I was looking for at a great price. The whole process was seamless and easy.",
  },
];

const features = [
  {
    icon: <Truck className="text-indigo-600" size={32} />,
    title: "Free & Fast Shipping",
    description: "On all orders over $50",
  },
  {
    icon: <Shield className="text-indigo-600" size={32} />,
    title: "Secure Payments",
    description: "100% secure transactions",
  },
  {
    icon: <Award className="text-indigo-600" size={32} />,
    title: "Quality Guarantee",
    description: "Authentic, high-quality products",
  },
  {
    icon: <Zap className="text-indigo-600" size={32} />,
    title: "24/7 Fast Support",
    description: "Always here to help you",
  },
];

// =======================
// Skeleton Loader
// =======================
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col animate-pulse">
    <div className="relative aspect-square w-full bg-gray-200"></div>
    <div className="p-3 flex flex-col flex-grow">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="mt-auto h-10 bg-gray-300 rounded-lg w-full"></div>
    </div>
  </div>
);

// =======================
// HomePage Component
// =======================
const HomePage = ({ onAddToCart, onToggleWishlist, wishlistIds = new Set(), cart }) => {
  const { products, loadingProducts, fetchProducts } = useAuth();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [productsToShow, setProductsToShow] = useState(getProductsToShow());

  // Responsive calculation
  function getProductsToShow() {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  }

  // Debounced resize listener
  useEffect(() => {
    let timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => setProductsToShow(getProductsToShow()), 150);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(products.length / productsToShow);

  // Autoplay for products
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  // Autoplay for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products once
  useEffect(() => {
    if (products.length === 0) fetchProducts();
  }, [fetchProducts, products.length]);

  const showSkeletons = loadingProducts && products.length === 0;

  // Carousel navigation
  const goToNextSlide = useCallback(
    () => setCurrentSlide((prev) => (prev + 1) % totalSlides),
    [totalSlides]
  );
  const goToPrevSlide = useCallback(
    () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides),
    [totalSlides]
  );

  const startIndex = currentSlide * productsToShow;
  const displayedProducts = useMemo(
    () => products.slice(startIndex, startIndex + productsToShow),
    [products, startIndex, productsToShow]
  );

  // Newsletter handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success(`Thank you for subscribing with ${email}!`, {
      position: "top-center",
    });
    e.target.reset();
  };

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-50 to-indigo-100 overflow-hidden">
        <div className="container mx-auto px-6 py-24 md:py-32 grid md:grid-cols-2 gap-8 items-center">
          <header className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Find Your Style, <br />
              <span className="text-indigo-600">Define Your Look.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
              Discover amazing products with unbeatable prices and exceptional
              quality, curated just for you.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-transform duration-200 transform hover:scale-105 shadow-lg"
              >
                Shop Now <ArrowRight size={20} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-transform duration-200 transform hover:scale-105"
              >
                Explore Categories
              </Link>
            </div>
          </header>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1170&q=80"
              alt="Stylish woman shopping"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="flex items-start p-6 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="flex-shrink-0 mr-4">{feature.icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mt-1">{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Products Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-600 mt-2">
              Check out our most popular and trending products
            </p>
          </div>

          <div className="relative">
            <div
              role="list"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 overflow-hidden"
            >
              {showSkeletons
                ? Array.from({ length: 4 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : displayedProducts.map((product) => (
                    <div role="listitem" key={product.id}>
                      <ProductCard
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlistIds.has(product.id)}
                        cart={cart}
                      />
                    </div>
                  ))}
            </div>

            {/* Carousel Navigation */}
            <button
              onClick={goToPrevSlide}
              disabled={currentSlide === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goToNextSlide}
              disabled={currentSlide >= totalSlides - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white text-gray-600 shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dot Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === currentSlide ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
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
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 mb-12">
            Real reviews from our amazing customers.
          </p>

          <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden relative h-56" aria-live="polite">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    i === currentTestimonial ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="flex flex-col items-center text-center px-4">
                    <div className="flex mb-4">
                      {[...Array(t.rating)].map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 font-medium mb-4">
                      “{t.comment}”
                    </blockquote>
                    <div className="flex items-center">
                      <img
                        src={t.avatar}
                        alt={`Photo of ${t.name}`}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <p className="font-semibold text-gray-800">{t.name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={() =>
                setCurrentTestimonial(
                  (prev) => (prev - 1 + testimonials.length) % testimonials.length
                )
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() =>
                setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>

            {/* Link */}
            <div className="mt-10">
              <Link
                to="/reviews"
                className="text-indigo-600 font-medium hover:underline"
              >
                See All Reviews
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <footer className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold">Stay in the Loop</h2>
          <p className="mt-2 mb-6 max-w-xl mx-auto">
            Subscribe to get the latest updates on new arrivals, special offers,
            and exclusive deals.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="max-w-md mx-auto flex"
          >
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
          <p className="text-sm text-gray-200 mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
