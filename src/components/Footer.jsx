import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/logo.png'; // Make sure the path to your logo is correct

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="container mx-auto py-12 px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img src={logo} alt="NexoShop Logo" className="h-7 w-auto" />
                            <span className="text-xl font-bold text-white">NexoShop</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Your one-stop shop for high-quality electronics, clothing, and more. We are committed to providing the best products and customer service.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Quick Links</h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                            <li><Link to="/products" className="hover:text-blue-500 transition-colors">Products</Link></li>
                            <li><Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start"><MapPin size={16} className="mr-3 mt-1 flex-shrink-0 text-gray-400" /> 123 Commerce St, Pimpri-Chinchwad, India</li>
                            <li className="flex items-center"><Phone size={16} className="mr-3 flex-shrink-0 text-gray-400" /> (123) 456-7890</li>
                            <li className="flex items-center"><Mail size={16} className="mr-3 flex-shrink-0 text-gray-400" /> support@ecomstore.com</li>
                        </ul>
                    </div>
                    
                    {/* Legal Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4 tracking-wider uppercase">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/shipping" className="hover:text-blue-500 transition-colors">Shipping Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} NexoShop. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Instagram size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;