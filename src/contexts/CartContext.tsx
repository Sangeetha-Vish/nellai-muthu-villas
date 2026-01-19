'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    weight: string;
    image: string;
}

export type OrderType = 'IMMEDIATE' | 'PRE_ORDER' | null;
export type PreOrderOccasion = 'FESTIVAL' | 'FUNCTION' | 'PERSONAL' | null;

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalAmount: number;
    itemCount: number;

    // Order Mode State
    orderType: OrderType;
    setOrderType: (type: OrderType) => void;

    // Pre-Order Specifics
    preOrderDate: string | null;
    setPreOrderDate: (date: string | null) => void;
    preOrderOccasion: PreOrderOccasion;
    setPreOrderOccasion: (occasion: PreOrderOccasion) => void;

    // Actions
    resetOrderMode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [orderType, setOrderTypeState] = useState<OrderType>(null);
    const [preOrderDate, setPreOrderDate] = useState<string | null>(null);
    const [preOrderOccasion, setPreOrderOccasion] = useState<PreOrderOccasion>(null);

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
        if (savedOrderType) setOrderTypeState(savedOrderType as OrderType);
        if (savedPreOrderDate) setPreOrderDate(savedPreOrderDate);
        if (savedPreOrderOccasion) setPreOrderOccasion(savedPreOrderOccasion as PreOrderOccasion);
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

    const setOrderType = (type: OrderType) => {
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

    const addToCart = (newItem: CartItem) => {
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

    const removeFromCart = (productId: string) => {
        setItems(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId: string, quantity: number) => {
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
