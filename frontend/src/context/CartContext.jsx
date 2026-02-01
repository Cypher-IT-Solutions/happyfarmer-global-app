import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import * as api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const prevUserRef = useRef(null);

    // Helper to get local storage key
    const getGuestKey = () => 'happyfarmer_cart_guest';

    // Initial Load & Migration Logic
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                try {
                    setLoading(true);
                    // 1. Fetch Guest Cart for potential migration
                    const guestData = localStorage.getItem(getGuestKey());
                    const guestItems = guestData ? JSON.parse(guestData) : [];

                    // 2. Fetch Server Cart
                    const serverItems = await api.getCart();

                    // 3. Migration: If guest items exist, sync them to the server
                    if (guestItems.length > 0) {
                        console.log("Migrating guest items to user account...");
                        for (const item of guestItems) {
                            await api.addToCartDB(item.productId || item.id, item.quantity);
                        }
                        // Clear guest cart after migration
                        localStorage.removeItem(getGuestKey());
                        // Refetch merged cart
                        const mergedItems = await api.getCart();
                        setCartItems(mergedItems);
                    } else {
                        setCartItems(serverItems);
                    }
                } catch (err) {
                    console.error("Failed to sync cart with server:", err);
                } finally {
                    setLoading(false);
                }
            } else {
                // Not logged in: Load from guest storage
                const savedCart = localStorage.getItem(getGuestKey());
                setCartItems(savedCart ? JSON.parse(savedCart) : []);
            }
        };

        loadCart();
        prevUserRef.current = user;
    }, [user]);

    // Save Guest Cart (Only when NOT logged in)
    useEffect(() => {
        if (!user) {
            localStorage.setItem(getGuestKey(), JSON.stringify(cartItems));
        }
    }, [cartItems, user]);

    const addToCart = async (product, quantity = 1) => {
        const productId = product.productId || product.id;

        // Optimistic UI update
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => (item.productId || item.id) === productId);
            if (existingItem) {
                return prevItems.map(item =>
                    (item.productId || item.id) === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prevItems, { ...product, productId, quantity }];
        });

        if (user) {
            try {
                await api.addToCartDB(productId, quantity);
            } catch (err) {
                console.error("Server sync failed (add):", err);
                showToast("Failed to sync cart with server", "error");
            }
        }
        showToast(`${product.name} added to cart!`);
    };

    const removeFromCart = async (productId) => {
        // Optimistic UI update
        setCartItems(prevItems => prevItems.filter(item => (item.productId || item.id) !== productId));

        if (user) {
            try {
                await api.removeFromCartDB(productId);
            } catch (err) {
                console.error("Server sync failed (remove):", err);
            }
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }

        // Optimistic UI update
        setCartItems(prevItems =>
            prevItems.map(item =>
                (item.productId || item.id) === productId ? { ...item, quantity } : item
            )
        );

        if (user) {
            try {
                await api.updateCartQuantityDB(productId, quantity);
            } catch (err) {
                console.error("Server sync failed (update):", err);
            }
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        if (user) {
            try {
                await api.clearCartDB();
            } catch (err) {
                console.error("Server sync failed (clear):", err);
            }
        } else {
            localStorage.removeItem(getGuestKey());
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};
