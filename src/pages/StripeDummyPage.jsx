import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ArrowLeft, Smartphone, University, Shield, Star, Zap, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const StripeDummyPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { setCart } = useAuth();

    // Use the actual order data passed from the previous page
    const { order, totalAmount, cartItems = [] } = location.state || {};

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!order) {
            toast.error("Order information is missing. Returning to cart.");
            navigate('/cart');
            return;
        }
        setIsProcessing(true);
        try {
            const config = getAuthHeaders();
            // 1. Confirm payment with the backend.
            await axios.post(`${API_BASE_URL}/api/payment/confirm/${order.id}`, {}, config);
            
            // 2. Clear the frontend cart state AFTER successful confirmation.
            setCart([]);
            
            // 3. Navigate to the dynamic success page.
            navigate(`/payment-success/${order.id}`);

        } catch (error) {
            console.error("Payment confirmation failed:", error);
            toast.error("Payment failed. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-40 left-40 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
            </div>

            <div className="relative z-10 w-full max-w-6xl mx-auto py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
                    <p className="text-blue-100/80">Your payment is protected with 256-bit SSL encryption</p>
                </div>

                {/* Main payment card */}
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">
                        {/* Left Side: Payment Form */}
                        <div className="lg:col-span-3 p-8">
                            <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                            
                            {/* Payment method tabs */}
                            <div className="flex border-b border-white/20 mb-8">
                                <TabButton icon={<CreditCard />} text="Card" active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} />
                                <TabButton icon={<Smartphone />} text="UPI" active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} />
                                <TabButton icon={<University />} text="Net Banking" active={paymentMethod === 'netbanking'} onClick={() => setPaymentMethod('netbanking')} />
                            </div>

                            <form onSubmit={handlePayment} className="space-y-6">
                                {paymentMethod === 'card' && <ModernCardForm />}
                                {paymentMethod === 'upi' && <ModernUpiForm />}
                                {paymentMethod === 'netbanking' && <ModernNetBankingForm />}

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-white transition-all duration-300 transform ${
                                        isProcessing 
                                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed scale-95' 
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Processing Payment...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={20} />
                                            <span>Pay Securely ${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Security badges */}
                            <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-white/20">
                                <div className="flex items-center space-x-2 text-white/70">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">SSL Secure</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white/70">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-sm">256-bit Encryption</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Order Summary */}
                        <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm border-l border-white/20 p-8">
                            <h3 className="text-xl font-bold text-white border-b border-white/20 pb-4 mb-6">Order Summary</h3>
                            
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-white/20" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-white text-sm">{item.name}</p>
                                            <p className="text-white/60 text-xs">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-white text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/20 pt-4 space-y-3">
                                <div className="flex justify-between text-white/70">
                                    <span>Subtotal</span>
                                    <span>${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="flex justify-between text-white/70">
                                    <span>Shipping</span>
                                    <span className="text-green-400 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between font-bold text-white text-xl pt-2 border-t border-white/20">
                                    <span>Total</span>
                                    <span>${totalAmount ? totalAmount.toFixed(2) : '0.00'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <button onClick={() => navigate('/cart')} className="text-white/70 hover:text-white flex items-center justify-center mx-auto mt-6 transition-colors">
                    <ArrowLeft size={16} className="mr-2" />
                    Return to Cart
                </button>
            </div>
        </div>
    );
};

// Helper Components (no changes needed here)
const TabButton = ({ icon, text, active, onClick }) => ( <button type="button" onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 p-4 border-b-2 transition-all duration-300 ${active ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-transparent text-white/60 hover:text-white/80 hover:bg-white/5'}`}> {icon} <span className="font-medium">{text}</span> </button> );
const ModernCardForm = () => ( <div className="space-y-6"> <div className="grid grid-cols-1 gap-6"> <div> <label className="block text-sm font-medium text-white/80 mb-2">Card Number</label> <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" /> </div> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-medium text-white/80 mb-2">Expiry Date</label> <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" /> </div> <div> <label className="block text-sm font-medium text-white/80 mb-2">CVC</label> <input type="text" placeholder="123" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" /> </div> </div> <div> <label className="block text-sm font-medium text-white/80 mb-2">Cardholder Name</label> <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" /> </div> </div> );
const ModernUpiForm = () => ( <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/20"> <p className="text-white font-semibold mb-6">Pay with your favorite UPI app</p> <div className="flex justify-center items-center gap-6 mb-6"> <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"> <span className="text-xs font-bold text-blue-600">GPay</span> </div> <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"> <span className="text-xs font-bold text-white">PhonePe</span> </div> <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"> <span className="text-xs font-bold text-white">Paytm</span> </div> </div> <input type="text" placeholder="Enter your UPI ID" className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm" /> </div> );
const ModernNetBankingForm = () => ( <div className="space-y-4"> <p className="text-white/70 text-sm">Select your bank for Net Banking payment</p> <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"> <option value="" className="bg-gray-800">Choose your bank...</option> <option value="sbi" className="bg-gray-800">State Bank of India</option> <option value="hdfc" className="bg-gray-800">HDFC Bank</option> <option value="icici" className="bg-gray-800">ICICI Bank</option> <option value="axis" className="bg-gray-800">Axis Bank</option> <option value="kotak" className="bg-gray-800">Kotak Mahindra Bank</option> </select> </div> );

export default StripeDummyPage;