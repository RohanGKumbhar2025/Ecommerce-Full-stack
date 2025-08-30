import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShoppingBag, Package, User, Calendar, DollarSign } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// --- START: SKELETON COMPONENT ---
const OrderSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1 w-full">
                <div className="flex items-center gap-3">
                    <div className="bg-gray-200 p-2 rounded-full h-10 w-10"></div>
                    <div>
                        <div className="h-5 bg-gray-300 rounded w-32 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                    </div>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
            </div>
        </div>
    </div>
);
// --- END: SKELETON COMPONENT ---

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/api/admin/orders`, getAuthHeaders());
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } catch (error) {
                toast.error('Failed to fetch orders.');
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">Review and manage all customer orders.</p>
                </div>
            </div>
      
            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, index) => <OrderSkeleton key={index} />)}
                </div>
            ) : orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-100 p-2 rounded-full"><Package size={20} className="text-indigo-600" /></div>
                                        <div>
                                            <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                                            <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${getStatusBadge(order.status || 'PENDING')}`}>
                                                {order.status || 'PENDING'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                        <div className="flex items-center text-gray-500"><User size={14} className="mr-2" /><span>{order.userName || 'N/A'}</span></div>
                                        <div className="flex items-center text-gray-500"><Calendar size={14} className="mr-2" /><span>{new Date(order.orderDate).toLocaleDateString()}</span></div>
                                        <div className="flex items-center text-gray-700 font-semibold"><DollarSign size={14} className="mr-2" /><span>{order.totalAmount?.toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-16 border-2 border-dashed border-gray-300 rounded-lg">
                    <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800">No orders found.</h3>
                    <p className="mt-1 text-gray-500">When customers place orders, they will appear here.</p>
                </div>
            )}
        </div>
    );
};

export default Orders;