'use client';

import React from 'react';
import { BranchProvider } from '@/contexts/BranchContext';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }) {
    return (
        <BranchProvider>
            <AuthProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </AuthProvider>
        </BranchProvider>
    );
}
