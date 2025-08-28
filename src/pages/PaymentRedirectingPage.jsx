import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentRedirectingPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Safely get state from the previous page
    const { order, totalAmount, cartItems } = location.state || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            if (order && totalAmount && cartItems) {
                // Forward all state to the payment page
                navigate('/payment', { 
                    state: { 
                        order, 
                        totalAmount,
                        cartItems
                    } 
                });
            } else {
                // If data is missing, go back to cart to prevent errors
                console.error("Cannot redirect to payment, order data is missing.");
                navigate('/cart');
            }
        }, 3000); // 3-second redirect delay

        return () => clearTimeout(timer);
    }, [navigate, order, totalAmount, cartItems]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">
            <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." className="w-24 h-24" />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Preparing Your Payment</h1>
            <p className="text-gray-600 mt-2">Redirecting to our secure payment processor, please wait...</p>
        </div>
    );
};

export default PaymentRedirectingPage;