import React, { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const CartPage = ({ cart = [], onUpdateQuantity, onRemoveFromCart, setCart }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError]         = useState(null);
    const navigate = useNavigate();

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError(null);
        try {
            const config = getAuthHeaders();
            // 1. Create the order, which will be associated with the logged-in user on the backend
            const response = await axios.post(`${API_BASE_URL}/api/checkout`, {}, config);
            const newOrder = response.data;
            
            // 2. Redirect to the loading page, passing the new order and cart details
            navigate('/redirecting-to-payment', { 
                state: { 
                    order: newOrder, 
                    totalAmount: cartTotal,
                    cartItems: cart
                } 
            });
        } catch (err) {
            console.error("Checkout failed:", err);
            setError("An error occurred during checkout. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
                {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
                        <p className="text-gray-500 mt-2">Start shopping to add items to your cart.</p>
                        <Link to="/products" className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* Cart items list */}
                        <div className="space-y-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                        <div>
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center border rounded-lg">
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50">-</button>
                                            <span className="px-3">{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                                        </div>
                                        <p className="font-semibold w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => onRemoveFromCart(item.id)} className="text-gray-400 hover:text-red-500"><X size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Checkout section */}
                        <div className="mt-8 border-t pt-6">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total:</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
                            <button onClick={handleCheckout} disabled={isProcessing} className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-colors ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
                                {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;