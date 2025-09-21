import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import CartItemCard from '../components/CartItemCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utility function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const CartPage = () => {
  const { cart, setCart } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pendingOperations, setPendingOperations] = useState(new Set());

  // Memoize cart total for performance optimization
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Handle updating item quantity in cart
  const handleUpdateQuantity = useCallback(
    async (productId, newQuantity) => {
      if (newQuantity < 1 || pendingOperations.has(productId)) return;

      setPendingOperations((prev) => new Set(prev).add(productId));
      const originalCart = [...cart];

      // Optimistically update cart
      setCart(cart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      ));

      try {
        const config = getAuthHeaders();
        const payload = { productId, quantity: newQuantity, isWishlisted: false };
        await axios.post(`${API_BASE_URL}/api/cart`, payload, config);
      } catch (err) {
        toast.error('Failed to update cart. Reverting.');
        setCart(originalCart);
      } finally {
        setPendingOperations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    },
    [cart, pendingOperations, setCart]
  );

  // Handle removing item from cart
  const handleRemoveFromCart = useCallback(
    async (productId) => {
      if (pendingOperations.has(productId)) return;

      setPendingOperations((prev) => new Set(prev).add(productId));
      const originalCart = [...cart];

      // Optimistically update cart
      setCart(cart.filter((item) => item.productId !== productId));

      try {
        const config = getAuthHeaders();
        await axios.delete(`${API_BASE_URL}/api/cart/${productId}`, config);
        toast.success('Item removed from cart.');
      } catch (err) {
        toast.error('Failed to remove item. Reverting.');
        setCart(originalCart);
      } finally {
        setPendingOperations((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      }
    },
    [cart, pendingOperations, setCart]
  );

  // Handle checkout process
  const handleCheckout = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const config = getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/api/checkout`, {}, config);
      const newOrder = response.data;

      navigate('/redirecting-to-payment', {
        state: {
          order: newOrder,
          totalAmount: cartTotal,
          cartItems: cart,
        },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred during checkout. Please try again.';
      console.error('Checkout failed:', err);
      setError(errorMessage);
      setIsProcessing(false);
    }
  }, [cart, cartTotal, navigate]);

  return (
    <div className="bg-gray-100 py-8 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8" aria-live="polite">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Your Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Start shopping to add items to your cart.</p>
            <Link
              to="/products?sort=rating-desc"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Discover Popular Products
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-3/4 space-y-4">
              {cart.map((item) => (
                <CartItemCard
                  key={item.productId}
                  item={item}
                  pendingOperations={pendingOperations}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
            {/* Order Summary */}
            <div className="lg:w-1/4 bg-white rounded-lg shadow-md p-6 sticky top-20 h-fit">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
              <div className="flex justify-between items-center text-lg font-semibold mb-6">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
              <button
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                  isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;