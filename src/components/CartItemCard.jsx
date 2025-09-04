import React from 'react';
import { Loader2, X } from 'lucide-react';

const CartItemCard = ({ item, pendingOperations, onUpdateQuantity, onRemoveFromCart }) => {
    const isPending = pendingOperations.has(item.productId);

    // 🔹 Move repetitive button styles into a constant
    const buttonClass = "px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50";

    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4 w-full sm:w-auto mb-4 sm:mb-0">
                {/* 🔹 Add alt text fallback for accessibility */}
                <img src={item.imageUrl} alt={item.name || "Product image"} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <div className="flex items-center border rounded-lg overflow-hidden">
                    <button 
                        onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} 
                        disabled={item.quantity <= 1 || isPending} 
                        className={buttonClass}
                    >
                        {isPending && item.quantity -1 < item.quantity ? <Loader2 size={16} className="animate-spin" /> : "-"}
                    </button>
                    <span className="px-3 text-gray-800 font-medium">{item.quantity}</span>
                    <button 
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} 
                        disabled={isPending}
                        className={buttonClass}
                    >
                        {isPending && item.quantity + 1 > item.quantity ? <Loader2 size={16} className="animate-spin" /> : "+"}
                    </button>
                </div>
                <p className="font-bold w-20 text-right text-gray-800">${(item.price * item.quantity).toFixed(2)}</p>
                <button 
                    onClick={() => onRemoveFromCart(item.productId)} 
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    aria-label={`Remove ${item.name}`}
                >
                    {isPending ? <Loader2 size={20} className="animate-spin" /> : <X size={20} />}
                </button>
            </div>
        </div>
    );
};

export default CartItemCard;