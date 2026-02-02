'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext(undefined);

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [latestOrder, setLatestOrder] = useState(null);

    // Initial hydration from localStorage
    useEffect(() => {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            try {
                const parsedOrders = JSON.parse(savedOrders);
                setOrders(parsedOrders);
                if (parsedOrders.length > 0) {
                    // Orders are stored newest first in this implementation or we sort them
                    setLatestOrder(parsedOrders[0]);
                }
            } catch (e) {
                console.error("Failed to parse orders from localStorage", e);
            }
        }
    }, []);

    const addOrder = (orderData) => {
        // If the server already provided a full order object (with ID, OTP etc)
        // we use it directly. Otherwise we generate a fallback local ID.
        let newOrder;

        if (orderData.id || orderData.publicOrderId) {
            newOrder = {
                ...orderData,
                createdAt: orderData.createdAt || new Date().toISOString(),
            };
        } else {
            const orderId = `NMV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            newOrder = {
                ...orderData,
                id: orderId,
                status: 'CONFIRMED',
                createdAt: new Date().toISOString(),
            };
        }

        setOrders(prev => {
            const updatedOrders = [newOrder, ...prev];
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });

        setLatestOrder(newOrder);
        return newOrder;
    };

    const getOrders = () => orders;

    const getLatestOrder = () => latestOrder;

    return (
        <OrderContext.Provider value={{
            orders,
            latestOrder,
            addOrder,
            getOrders,
            getLatestOrder
        }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
}
