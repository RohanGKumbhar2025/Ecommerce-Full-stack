// src/components/Navbar.jsx
import React from 'react';
import { ShoppingCart, Heart, User, LogOut, Menu, Package } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png' // Fixed path - assuming logo is in src/assets/

const Navbar = ({ cartCount, wishlistCount, isMenuOpen, setIsMenuOpen }) => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeLinkStyle = {
    color: '#4f46e5', // indigo-600
    fontWeight: '600',
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <img src={logo} alt="NexoShop Logo" className="h-8 w-auto" />
            <span>NexoShop</span>
          </Link>
        
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>

        <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
          <NavLink to="/" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-indigo-600 transition-colors">Home</NavLink>
          <NavLink to="/products" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-indigo-600 transition-colors">Products</NavLink>
          
          {/* ✅ NEW "ABOUT US" and "CONTACT" LINKS ADDED */}
          <NavLink to="/about" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-indigo-600 transition-colors">About Us</NavLink>
          <NavLink to="/contact" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-indigo-600 transition-colors">Contact</NavLink>
          
          {user?.roles?.includes('ROLE_ADMIN') && (
            <NavLink to="/admin/list" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="hover:text-indigo-600 transition-colors">Admin Panel</NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/wishlist" title="My Wishlist" className="relative p-2 text-gray-500 hover:text-red-500 transition-colors">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link to="/cart" title="Shopping Cart" className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" title="My Orders" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <Package size={22} />
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <span className="text-gray-700 font-medium">Hi, {user?.name}</span>
              <button onClick={handleLogout} title="Logout" className="p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <LogOut size={22} />
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-2 font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;