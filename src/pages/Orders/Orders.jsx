import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShoppingBag, Package, User, Calendar, DollarSign, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const OrderTableSkeleton = () => (
    <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-300 rounded w-24"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-300 rounded w-16"></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="h-5 bg-gray-200 rounded-full w-20"></div></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const OrderCardSkeleton = () => (
    <div className="animate-pulse p-4 bg-white rounded-lg shadow space-y-4">
        <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
        <div className="flex items-center gap-4 text-sm">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
        <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
        </div>
    </div>
);

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
                <>
                    <OrderTableSkeleton />
                    <div className="md:hidden space-y-4">
                        {Array.from({ length: 5 }).map((_, index) => <OrderCardSkeleton key={index} />)}
                    </div>
                </>
            ) : orders.length > 0 ? (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">${order.totalAmount?.toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status || 'PENDING')}`}>
                                                {order.status || 'PENDING'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {orders.map(order => (
                             <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800">Order #{order.id}</h3>
                                    <p className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${getStatusBadge(order.status || 'PENDING')}`}>
                                        {order.status || 'PENDING'}
                                    </p>
                                </div>
                                <div className="mt-2 text-sm space-y-1">
                                    <div className="flex items-center text-gray-500"><User size={14} className="mr-2" /><span>{order.userName || 'N/A'}</span></div>
                                    <div className="flex items-center text-gray-500"><Calendar size={14} className="mr-2" /><span>{new Date(order.orderDate).toLocaleDateString()}</span></div>
                                    <div className="flex items-center text-gray-700 font-semibold"><DollarSign size={14} className="mr-2" /><span>{order.totalAmount?.toFixed(2)}</span></div>
                                </div>
                                <div className="mt-4 border-t pt-4 space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">Items:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {order.orderItems.map(item => (
                                            <div key={item.productId} className="flex-shrink-0">
                                                <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-lg object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
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