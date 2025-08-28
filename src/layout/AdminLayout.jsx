// src/layout/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate , Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Menubar from '../components/Menubar/Menubar';
import AddProduct from '../pages/AddProduct/AddProduct';
import ListProducts from '../pages/ListProducts/ListProducts';
import Orders from '../pages/Orders/Orders';
import { ToastContainer } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';
import EditProduct from '../pages/EditProduct/EditProduct';

const AdminLayout = () => {
    const { user } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        const handleResize = () => {
            setSidebarOpen(window.innerWidth > 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ Secure the layout by checking for the admin role
    const isAdmin = user?.roles?.includes('ROLE_ADMIN');

    if (!isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                <ShieldAlert size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
                <Link to="/" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Go to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'md:ml-[250px]' : 'ml-0'}`}>
                <ToastContainer position="top-right" autoClose={3000} theme={theme} />
                <Menubar 
                    toggleSidebar={toggleSidebar} 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                />
                <main className="p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="add" element={<AddProduct />} />
                        <Route path="list" element={<ListProducts />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="edit/:productId" element={<EditProduct />} />
                        <Route path="/" element={<Navigate to="list" replace />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;