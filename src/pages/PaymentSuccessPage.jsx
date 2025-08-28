import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        if (!orderId) {
            navigate('/');
            return;
        }

        const fetchOrderDetails = async () => {
            try {
                const config = getAuthHeaders();
                const response = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`, config);
                setOrder(response.data);
            } catch (err) {
                console.error("Failed to fetch order details:", err);
                setError("Could not retrieve order details.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, navigate]);

    useEffect(() => {
        if (order) {
            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/orders');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [order, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Verifying your order...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-gray-600 mt-2">{error || "Could not load order details."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
                {/* Success animation */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
                    <p className="text-emerald-100/80 text-lg mb-2">Your order has been confirmed and is being processed.</p>
                </div>

                {/* Order details card */}
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
                    <h2 className="text-xl font-semibold mb-6 text-center text-white">Order Details</h2>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between py-3 border-b border-white/20">
                            <span className="text-white/70">Order ID</span>
                            <span className="font-mono text-white font-medium">#{order.id}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-white/20">
                            <span className="text-white/70">Date</span>
                            <span className="text-white">{new Date(order.orderDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-white/20">
                            <span className="text-white/70">Payment Status</span>
                            <span className="flex items-center text-emerald-400 font-medium">
                                <CheckCircle size={16} className="mr-1" />
                                Confirmed
                            </span>
                        </div>
                        <div className="flex justify-between py-3 text-lg font-bold">
                            <span className="text-white">Total Paid</span>
                            <span className="text-white">${order.totalAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-8 space-y-3">
                        <button onClick={() => navigate('/orders')} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                            View My Orders
                        </button>
                        <button onClick={() => navigate('/products')} className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-2xl font-medium transition-all duration-300 border border-white/20">
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {/* Additional info */}
                <div className="text-center mt-8 text-white/60 text-sm">
                    <p>Redirecting to your orders in {countdown} seconds...</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;