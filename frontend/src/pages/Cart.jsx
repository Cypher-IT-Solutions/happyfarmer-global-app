import { createOrder } from '../services/api';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            showToast("Please sign in to complete your order.", "warning");
            navigate("/login");
            return;
        }

        if (cartItems.length === 0) return;

        setIsCheckingOut(true);

        try {
            // Group items by farmer
            const ordersByFarmer = {};

            cartItems.forEach(item => {
                const farmerId = item.farmerId || item.farmer?.id;

                if (!farmerId) {
                    console.error("Item missing farmerId:", item);
                    return;
                }

                if (!ordersByFarmer[farmerId]) {
                    ordersByFarmer[farmerId] = [];
                }
                ordersByFarmer[farmerId].push({
                    productId: item.id,
                    quantity: item.quantity
                });
            });

            const farmerIds = Object.keys(ordersByFarmer).filter(id => id !== "undefined" && id !== "null");

            if (farmerIds.length === 0) {
                showToast("Error: Some items in your cart are missing farmer information.", "error");
                setIsCheckingOut(false);
                return;
            }

            // Send order for each farmer group
            const promises = farmerIds.map(farmerId => {
                const payload = {
                    farmerId: farmerId,
                    items: ordersByFarmer[farmerId],
                    deliveryAddress: "123 Main St, Springfield", // Hardcoded for MVP
                    isDelivery: true
                };
                return createOrder(payload);
            });

            await Promise.all(promises);

            showToast("Orders placed successfully!");
            clearCart();
            navigate("/my-orders");
        } catch (error) {
            console.error("Checkout failed:", error);
            const errorMsg = error.response?.data?.message || "Check console for details.";
            showToast(`Failed to place order: ${errorMsg}`, "error");
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-extrabold text-earth-900">Your cart is empty</h2>
                <p className="mt-4 text-earth-600">Looks like you haven't added any fresh goods yet.</p>
                <div className="mt-6">
                    <Link to="/farmers" className="text-brand-DEFAULT hover:text-brand-dark font-medium">
                        Browse Farmers &rarr;
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <li key={item.id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-2xl">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>
                                            {item.category === 'FRUIT' ? '🍎' :
                                                item.category === 'VEGETABLE' ? '🥦' :
                                                    item.category === 'DAIRY' ? '🥛' : '📦'}
                                        </span>
                                    )}
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.unit}</p>
                                    <p className="text-sm font-medium text-gray-900">${item.price}</p>
                                    <p className="text-xs text-gray-400 font-bold">Farmer: {item.farmerName || item.farmer?.name || 'Unknown'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    >-</button>
                                    <span className="px-2 py-1 text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                                    >+</button>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between items-center">
                    <div className="text-base font-medium text-gray-900">
                        Total: <span className="text-xl font-bold">${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="space-x-4">
                        <button
                            onClick={clearCart}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="bg-primary-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow hover:shadow-lg disabled:opacity-50"
                        >
                            {isCheckingOut ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
