'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useBranch } from '@/contexts/BranchContext';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';

export default function PreOrderPage() {
    const { items, removeFromCart, updateQuantity, totalAmount, itemCount } = useCart();
    const { selectedBranch } = useBranch();
    const router = useRouter();

    const handleProceed = () => {
        router.push('/pre-order/checkout');
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0]">
            {/* Note: Header used here if not in Layout */}
            <Header onBranchClick={() => { }} />

            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                <BackButton label="Continue Shopping" />

                <h1 className="font-serif text-3xl md:text-4xl text-[#630D16] mb-8">
                    Your Cart
                </h1>

                {items.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-[#D4AF37]/30 rounded-lg bg-white/50">
                        <ShoppingBag className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 opacity-70" />
                        <h2 className="font-serif text-2xl text-[#630D16] mb-2">Your cart is empty</h2>
                        <p className="font-sans text-[#3D2B1F] text-opacity-80 text-lg mb-8">
                            Looks like you haven't added any sweets yet.
                        </p>
                        <Link href="/">
                            <Button className="inline-flex items-center gap-2">
                                Browse Sweets
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {items.map((item) => (
                                <div key={item.productId} className="flex gap-4 p-4 bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg border border-[#E5E5E5]">
                                    <div className="relative w-24 h-24 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-serif text-lg text-[#630D16] leading-tight mb-1">{item.name}</h3>
                                                <p className="text-sm text-[#8B4513]">{item.weight}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center border border-[#D4AF37] rounded-md text-sm bg-[#FDFCF0]">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-[#D4AF37]/10 transition-colors text-[#630D16] font-bold"
                                                >-</button>
                                                <span className="px-2 font-medium text-[#3D2B1F] min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-[#D4AF37]/10 transition-colors text-[#630D16] font-bold"
                                                >+</button>
                                            </div>
                                            <span className="font-serif text-lg text-[#3D2B1F]">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 shadow-md rounded-lg border border-[#D4AF37]/20 sticky top-24">
                                <h3 className="font-serif text-xl text-[#630D16] mb-4 pb-2 border-b border-[#D4AF37]/20">Order Summary</h3>

                                {selectedBranch && (
                                    <div className="mb-6 p-4 bg-[#FFC6C4]/10 border border-[#D4AF37]/30 rounded-md text-sm">
                                        <p className="font-bold text-[#630D16] uppercase tracking-wide text-xs mb-1">Pickup From</p>
                                        <p className="text-[#3D2B1F] font-medium text-base">{selectedBranch.name}</p>
                                        <p className="text-sm text-[#8B4513] opacity-80 mt-1">{selectedBranch.area}</p>
                                    </div>
                                )}

                                <div className="space-y-3 mb-6 text-[#3D2B1F] font-sans">
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-80">Total Items</span>
                                        <span className="font-medium">{itemCount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="opacity-80">Subtotal</span>
                                        <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t border-dashed border-[#D4AF37] pt-3 flex justify-between items-baseline">
                                        <span className="font-bold text-lg text-[#630D16]">Total</span>
                                        <span className="font-serif text-2xl text-[#630D16]">₹{totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Button onClick={handleProceed} className="w-full py-3 flex justify-center items-center gap-2 shadow-lg shadow-[#630D16]/20">
                                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
