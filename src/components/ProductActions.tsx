'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useBranch } from '@/contexts/BranchContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { OrderTypeModal } from '@/components/OrderTypeModal';

interface ProductActionsProps {
    product: {
        id: string;
        name: string;
        price: number;
        weight: string;
        image: string;
        available: boolean;
    };
}


export const ProductActions: React.FC<ProductActionsProps> = ({ product }) => {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, orderType, setOrderType } = useCart();
    const { selectedBranch } = useBranch();
    const router = useRouter();
    const [isAdded, setIsAdded] = useState(false);

    // Modal State
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);

    const { user } = useAuth();

    const handleIncrement = () => setQuantity(q => q + 1);
    const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));

    const handleAddToCartClick = () => {
        // 1. Check Auth (Enforced by Brand Rules)
        if (!user) {
            router.push('/login');
            return;
        }

        // 2. Check Order Type (The Entry Gate)
        if (!orderType) {
            setShowOrderTypeModal(true);
            return;
        }

        performAddToCart();
    };

    const performAddToCart = () => {
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            weight: product.weight,
            image: product.image,
            quantity: quantity,
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const handleOrderTypeSelect = (type: 'IMMEDIATE' | 'PRE_ORDER') => {
        setOrderType(type);
        setShowOrderTypeModal(false);
        performAddToCart();
    };

    if (!product.available) {
        return <div className="text-red-600 font-sans">Currently Unavailable</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <span className="font-sans text-[#3D2B1F] text-lg">Quantity:</span>
                <div className="flex items-center border border-[#D4AF37] rounded-sm">
                    <button
                        onClick={handleDecrement}
                        className="p-2 hover:bg-[#FDFCF0] text-[#630D16]"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-sans font-medium text-[#3D2B1F]">
                        {quantity}
                    </span>
                    <button
                        onClick={handleIncrement}
                        className="p-2 hover:bg-[#FDFCF0] text-[#630D16]"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    onClick={handleAddToCartClick}
                    className="w-full flex items-center justify-center gap-2 py-3 text-lg"
                >
                    <ShoppingBag className="w-5 h-5" />
                    {isAdded
                        ? (orderType === 'IMMEDIATE' ? "Added to Box" : "Added to Pre-order")
                        : (orderType === 'IMMEDIATE' ? "Add to Order (Today)" : "Add to Pre-order")
                    }
                </Button>

                {!selectedBranch && (
                    <p className="text-sm text-[#8B4513] text-center font-sans">
                        Please select a branch to continue
                    </p>
                )}
                {selectedBranch && (
                    <p className="text-sm text-[#4A6741] text-center font-sans">
                        Available at {selectedBranch.name}
                    </p>
                )}
            </div>

            <OrderTypeModal
                isOpen={showOrderTypeModal}
                onSelect={handleOrderTypeSelect}
                onClose={() => setShowOrderTypeModal(false)}
            />
        </div>
    );
};
