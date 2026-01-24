'use client';

import React, { useEffect } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowLeft, History, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderSuccessPage() {
    const { latestOrder } = useOrders();
    const router = useRouter();
    const [hasMounted, setHasMounted] = React.useState(false);

    useEffect(() => {
        setHasMounted(true);
        // If no latest order and some time has passed, redirect home
        const timer = setTimeout(() => {
            if (!latestOrder) {
                router.push('/');
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [latestOrder, router]);

    if (!hasMounted || !latestOrder) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#630D16] mx-auto mb-4"></div>
                    <p className="text-[#8B4513] font-serif">Confirming your order...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-[#E6D5C3] p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-[#F0F7F0] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12 text-[#2E7D32]" />
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl text-[#630D16] mb-4">
                        Thank You for Your Order!
                    </h1>
                    <p className="text-[#8B4513] opacity-80 mb-8 max-w-md mx-auto">
                        Your sweets are being prepared with care at Nella Muthu Vilas. We've received your order and it's confirmed.
                    </p>

                    <div className="bg-[#FDFCF0] rounded-xl border border-[#D4AF37]/20 p-6 text-left mb-8">
                        <div className="flex justify-between items-start mb-4 pb-4 border-b border-[#D4AF37]/10">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-[#8B4513]/60 font-medium font-sans">Order ID</p>
                                <p className="text-[#630D16] font-bold font-mono text-lg">{latestOrder.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider text-[#8B4513]/60 font-medium font-sans">Status</p>
                                <span className="inline-block px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-xs font-bold font-sans">
                                    {latestOrder.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#630D16] mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-[#3D2B1F]">{latestOrder.branch.name}</p>
                                    <p className="text-xs text-[#8B4513] opacity-70">{latestOrder.branch.area}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#630D16] mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-[#3D2B1F]">Pickup Scheduled For</p>
                                    <p className="text-xs text-[#8B4513] opacity-70">
                                        {new Date(latestOrder.pickupTime).toLocaleString([], {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#D4AF37]/10">
                            <h3 className="text-sm font-bold text-[#3D2B1F] mb-3 font-serif">Order Summary</h3>
                            <div className="space-y-3">
                                {latestOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-[#8B4513]">{item.name} <span className="text-xs opacity-60">x {item.quantity}</span></span>
                                        <span className="text-[#3D2B1F] font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-3 border-t border-[#D4AF37]/5 font-bold text-[#630D16]">
                                    <span>Total Paid (via {latestOrder.paymentMethod})</span>
                                    <span>₹{latestOrder.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/orders"
                            className="flex items-center justify-center gap-2 bg-[#630D16] text-[#FDFCF0] px-8 py-3 rounded-xl font-medium hover:bg-[#4A0A10] transition-colors shadow-lg shadow-[#630D16]/20"
                        >
                            <History className="w-4 h-4" />
                            View My Orders
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 bg-[#D4AF37]/10 text-[#630D16] border border-[#D4AF37]/30 px-8 py-3 rounded-xl font-medium hover:bg-[#D4AF37]/20 transition-colors"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Browsing
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[#8B4513]/60 text-sm">
                        A confirmation receipt has also been saved to your account.
                    </p>
                    <Link href="/" className="inline-flex items-center gap-2 text-[#630D16] font-medium mt-4 hover:underline">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
