'use client';

import React from 'react';
import { BranchProvider } from '@/contexts/BranchContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

import { OrderProvider } from '@/contexts/OrderContext';

export function Providers({ children }) {
    return (
        <LocationProvider>
            <BranchProvider>
                <AuthProvider>
                    <OrderProvider>
                        <CartProvider>
                            {children}
                        </CartProvider>
                    </OrderProvider>
                </AuthProvider>
            </BranchProvider>
        </LocationProvider>
    );
}
