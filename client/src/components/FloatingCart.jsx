'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const FloatingCart = () => {
    const { itemCount } = useCart();
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        // Only show if cart has items and we are NOT on the cart page itself
        const isCartPage = pathname === '/pre-order' || pathname === '/cart';
        if (itemCount > 0 && !isCartPage) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [itemCount, pathname]);

    if (!hasMounted || !isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link
                href="/cart"
                className="group relative flex items-center justify-center w-16 h-16 bg-[#FDFCF0] border-2 border-[#D4AF37]/40 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] transition-all duration-300 active:scale-95"
            >
                {/* Trolley Icon */}
                <ShoppingBag className="w-7 h-7 text-[#630D16] group-hover:scale-110 transition-transform duration-300" />

                {/* Badge */}
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#630D16] text-[11px] font-bold text-[#FDFCF0] shadow-md border-2 border-[#FDFCF0]">
                    {itemCount}
                </span>

                {/* Subtle Tooltip Label (Desktop only) */}
                <span className="absolute right-full mr-3 px-3 py-1.5 bg-[#FDFCF0] border border-[#D4AF37]/30 text-[#630D16] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap hidden lg:block shadow-sm">
                    View My Order
                </span>
            </Link>
        </div>
    );
};
