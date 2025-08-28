import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = getAuthHeaders();
                const response = await axios.get(`${API_BASE_URL}/api/orders`, config);
                const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Failed to fetch order history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-16">Loading your order history...</div>;
    }

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <Package size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">No Orders Found</h2>
                        <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
                        <Link to="/products" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold cursor-pointer hover:bg-indigo-700">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex justify-between items-center border-b pb-4 mb-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">Order #{order.id}</p>
                                        <p className="text-sm text-gray-500">
                                            Date: {new Date(order.orderDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                                </div>
                                <div className="space-y-4">
                                    {order.orderItems.map(item => (
                                        <div key={item.productId} className="flex items-center space-x-4">
                                            <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-lg object-cover" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-700">{item.productName}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;