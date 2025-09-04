import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlusSquare, ListOrdered, ShoppingBag, Home, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSwipeable } from 'react-swipeable';

const Sidebar = ({ isOpen, onClose, onOpen }) => {
    const { user, logout } = useAuth();

    const handleLinkClick = () => {
        if (window.innerWidth <= 768) {
            onClose();
        }
    };

    const activeLinkClass = "bg-indigo-100 text-indigo-700 font-semibold";
    const inactiveLinkClass = "hover:bg-gray-100 text-gray-700";

    const handlers = useSwipeable({
        onSwipedRight: () => onOpen(),
        onSwipedLeft: () => onClose(),
        preventScrollOnSwipe: true,
        trackTouch: true
    });

    return (
        <div {...handlers} className="touch-pan-y">
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden cursor-pointer"
                    onClick={onClose}
                ></div>
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-[250px] bg-white border-r border-gray-200 shadow-lg z-50
                transition-transform duration-300 ease-in-out transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-gray-50 border">
                        <Shield size={32} className="text-indigo-600" />
                        <div>
                            <span className="font-bold text-lg text-gray-800">Admin Panel</span>
                            <p className="text-sm text-gray-500">{user?.name || 'Administrator'}</p>
                        </div>
                    </div>
                    
                    <div className="border-b border-gray-200 mb-2"></div>

                    <nav className="flex-grow flex flex-col mt-4 space-y-2">
                        <NavLink
                            to="/admin/add"
                            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${isActive ? activeLinkClass : inactiveLinkClass}`}
                            onClick={handleLinkClick}
                        >
                            <PlusSquare size={20} /> <span>Add Product</span>
                        </NavLink>
                        <NavLink
                            to="/admin/list"
                            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${isActive ? activeLinkClass : inactiveLinkClass}`}
                            onClick={handleLinkClick}
                        >
                            <ListOrdered size={20} /> <span>List Products</span>
                        </NavLink>
                        <NavLink
                            to="/admin/orders"
                            className={({ isActive }) => `flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${isActive ? activeLinkClass : inactiveLinkClass}`}
                            onClick={handleLinkClick}
                        >
                            <ShoppingBag size={20} /> <span>Orders</span>
                        </NavLink>
                    </nav>

                    <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
                        <NavLink
                            to="/"
                            className="flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700 cursor-pointer"
                            onClick={handleLinkClick}
                        >
                            <Home size={20} /> <span>Back to Store</span>
                        </NavLink>
                         <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-red-100 text-red-700 cursor-pointer"
                        >
                            <LogOut size={20} /> <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;