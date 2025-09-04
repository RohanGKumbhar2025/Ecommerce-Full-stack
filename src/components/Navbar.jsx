import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const getNavClass = ({ isActive }) => 
    `transition-colors ${isActive ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-indigo-600"}`;

const Navbar = ({ cartCount, wishlistCount }) => {
    const { isLoggedIn, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMenuOpen]);

    const handleLogout = () => {
        setIsMenuOpen(false);
        logout();
    };
    
    const handleLinkClick = () => setIsMenuOpen(false);

    return (
        <>
            <header className={`bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex justify-between items-center transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
                        
                        <Link to="/" onClick={handleLinkClick} className="flex items-center gap-2 text-2xl font-bold text-gray-800" aria-label="NexoShop Home">
                            <img src={logo} alt="NexoShop Logo" className="h-8 w-auto" loading="lazy" />
                            <span className="hidden sm:inline">NexoShop</span>
                        </Link>
                        
                        <DesktopNav user={user} />

                        <DesktopIcons isLoggedIn={isLoggedIn} user={user} handleLogout={handleLogout} cartCount={cartCount} wishlistCount={wishlistCount} />

                        <button className="md:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>
            
            <MobileMenu 
                isOpen={isMenuOpen} 
                setIsOpen={setIsMenuOpen}
                isLoggedIn={isLoggedIn}
                user={user}
                handleLogout={handleLogout}
                handleLinkClick={handleLinkClick}
                cartCount={cartCount}
                wishlistCount={wishlistCount}
            />
        </>
    );
};

const DesktopNav = ({ user }) => (
    <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
        <NavLink to="/" className={getNavClass}>Home</NavLink>
        <NavLink to="/products" className={getNavClass}>Products</NavLink>
        <NavLink to="/about" className={getNavClass}>About</NavLink>
        <NavLink to="/contact" className={getNavClass}>Contact</NavLink>
        {user?.roles?.includes('ROLE_ADMIN') && (
            <NavLink to="/admin/list" className={getNavClass}>Admin</NavLink>
        )}
    </nav>
);

const DesktopIcons = ({ isLoggedIn, user, handleLogout, cartCount, wishlistCount }) => (
    <div className="hidden md:flex items-center gap-3">
        {isLoggedIn ? (
            <>
                <Link to="/wishlist" aria-label={`View Wishlist (${wishlistCount} items)`} className="relative p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Heart size={22} />
                    {wishlistCount > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">{wishlistCount}</span>}
                </Link>
                <Link to="/cart" aria-label={`View Cart (${cartCount} items)`} className="relative p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                    <ShoppingCart size={22} />
                    {cartCount > 0 && <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">{cartCount}</span>}
                </Link>
                <Link to="/orders" aria-label="View My Orders" className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"><Package size={22} /></Link>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">Welcome back</p>
                    </div>
                </div>
                <button onClick={handleLogout} aria-label="Logout" className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><LogOut size={22} /></button>
            </>
        ) : (
            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg">
                <User size={20} />
                <span>Login / Sign Up</span>
            </Link>
        )}
    </div>
);

const sheetVariants = {
    hidden: { y: '100%' },
    visible: { y: '0%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '100%', transition: { duration: 0.2 } },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const MobileMenu = ({ isOpen, setIsOpen, isLoggedIn, user, handleLogout, handleLinkClick, cartCount, wishlistCount }) => {
    const getMobileNavClass = ({ isActive }) => 
        `block px-4 py-3 rounded-lg font-medium ${isActive ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-700'}`;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        aria-hidden="true"
                    />
                    <motion.div
                        variants={sheetVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed bottom-0 left-0 right-0 w-full bg-white rounded-t-2xl shadow-2xl max-h-[85vh] z-50 flex flex-col"
                    >
                        <div className="flex-shrink-0 p-4 border-b flex items-center justify-between">
                            <span className="font-bold text-lg text-gray-800">Menu</span>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full" aria-label="Close menu">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {isLoggedIn && (
                            <div className="flex-shrink-0 p-4 bg-gray-50 border-b flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user?.name}</p>
                                    <p className="text-sm text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        )}
                        
                        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                            <NavLink to="/" onClick={handleLinkClick} className={getMobileNavClass}>Home</NavLink>
                            <NavLink to="/products" onClick={handleLinkClick} className={getMobileNavClass}>Products</NavLink>
                            <NavLink to="/about" onClick={handleLinkClick} className={getMobileNavClass}>About</NavLink>
                            <NavLink to="/contact" onClick={handleLinkClick} className={getMobileNavClass}>Contact</NavLink>
                            {user?.roles?.includes('ROLE_ADMIN') && <NavLink to="/admin/list" onClick={handleLinkClick} className={getMobileNavClass}>Admin</NavLink>}
                            
                            <div className="pt-2 my-2 border-t"></div>
                            
                            {isLoggedIn ? (
                                <>
                                    <Link to="/wishlist" onClick={handleLinkClick} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700">
                                        <span className="flex items-center gap-3"><Heart size={20} /> Wishlist</span>
                                        {wishlistCount > 0 && <span className="bg-red-100 text-red-700 text-sm font-semibold px-2 py-1 rounded-full">{wishlistCount}</span>}
                                    </Link>
                                    <Link to="/cart" onClick={handleLinkClick} className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700">
                                        <span className="flex items-center gap-3"><ShoppingCart size={20} /> Cart</span>
                                        {cartCount > 0 && <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-2 py-1 rounded-full">{cartCount}</span>}
                                    </Link>
                                    <Link to="/orders" onClick={handleLinkClick} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"><Package size={20} /> My Orders</Link>
                                </>
                            ) : (
                                <Link to="/login" onClick={handleLinkClick} className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700">
                                    <User size={20} /> Login / Sign Up
                                </Link>
                            )}
                        </nav>
                        
                        {isLoggedIn && (
                            <div className="flex-shrink-0 p-4 border-t">
                                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium">
                                    <LogOut size={20} /> Logout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Navbar;