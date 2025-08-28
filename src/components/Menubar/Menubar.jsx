// src/components/Menubar/Menubar.jsx (Corrected)
import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';

const Menubar = ({ toggleSidebar, theme, toggleTheme }) => {
    return (
        <nav className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* This button toggles the sidebar visibility on mobile */}
                    <button className="md:hidden text-gray-600" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Menubar;