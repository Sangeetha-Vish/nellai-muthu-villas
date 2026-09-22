'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [orderType, setOrderTypeState] = useState(null);
    const [preOrderDate, setPreOrderDate] = useState(null);
    const [preOrderOccasion, setPreOrderOccasion] = useState(null);

    // Hydrate from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        const savedOrderType = localStorage.getItem('orderType');
        const savedPreOrderDate = localStorage.getItem('preOrderDate');
        const savedPreOrderOccasion = localStorage.getItem('preOrderOccasion');

        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        if (savedOrderType) setOrderTypeState(savedOrderType);
        if (savedPreOrderDate) setPreOrderDate(savedPreOrderDate);
        if (savedPreOrderOccasion) setPreOrderOccasion(savedPreOrderOccasion);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));

        if (orderType) localStorage.setItem('orderType', orderType);
        else localStorage.removeItem('orderType');

        if (preOrderDate) localStorage.setItem('preOrderDate', preOrderDate);
        else localStorage.removeItem('preOrderDate');

        if (preOrderOccasion) localStorage.setItem('preOrderOccasion', preOrderOccasion);
        else localStorage.removeItem('preOrderOccasion');

    }, [items, orderType, preOrderDate, preOrderOccasion]);

    const setOrderType = (type) => {
        setOrderTypeState(type);
        if (type === 'IMMEDIATE') {
            // Immediate implies today, no distinct occasion usually needed, but clear pre-order specifics
            setPreOrderDate(null);
            setPreOrderOccasion(null);
        }
    };

    const resetOrderMode = () => {
        setOrderTypeState(null);
        setPreOrderDate(null);
        setPreOrderOccasion(null);
        // Optional: Clear cart on mode reset?
        // setItems([]); 
    };

    const addToCart = (newItem) => {
        setItems(prev => {
            const existing = prev.find(item => item.productId === newItem.productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === newItem.productId
                        ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId) => {
        setItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        // We might want to keep the mode active even after clearing cart, 
        // asking user to "Continue Shopping" or "Finish".
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount, itemCount,
            orderType, setOrderType,
            preOrderDate, setPreOrderDate,
            preOrderOccasion, setPreOrderOccasion,
            resetOrderMode
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
