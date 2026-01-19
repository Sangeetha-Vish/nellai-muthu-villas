'use client';

import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ConfirmationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // In a real app, you might fetch order details using ID
    const orderId = searchParams.get('orderId');
    const orderType = searchParams.get('type') || 'IMMEDIATE';

    const isImmediate = orderType === 'IMMEDIATE';

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 bg-[url('/pattern.png')]"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white max-w-lg w-full rounded-lg shadow-2xl p-8 md:p-12 text-center border border-[#D4AF37]/20 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        className="w-20 h-20 bg-[#630D16]/10 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle2 className="w-10 h-10 text-[#630D16]" />
                    </motion.div>
                </div>

                <h1 className="font-serif text-3xl text-[#630D16] mb-2">
                    {isImmediate ? 'Order Confirmed!' : 'Pre-Order Booked!'}
                </h1>

                <p className="font-sans text-[#8B4513] mb-8">
                    {isImmediate
                        ? 'Your sweets are being prepared. Track status below.'
                        : 'Your planned order has been successfully scheduled.'
                    }
                </p>

                {/* Tracking Status Section */}
                <div className="bg-[#F9F7E8] p-6 rounded-md border border-[#D4AF37]/20 mb-8 text-left space-y-6">
                    <div className="flex justify-between border-b border-[#D4AF37]/10 pb-2">
                        <span className="text-sm text-[#8B4513] opacity-70">Order ID</span>
                        <span className="font-medium text-[#3D2B1F] font-mono">{orderId || 'NMV-8821'}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#630D16]">
                            <span>Confirmed</span>
                            <span>Preparing</span>
                            <span className="opacity-50">Ready</span>
                        </div>
                        <div className="h-2 bg-[#D4AF37]/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "66%" }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-[#630D16]"
                            />
                        </div>
                        <p className="text-xs text-center text-[#8B4513] italic animate-pulse">
                            Kitchen is preparing your order...
                        </p>
                    </div>
                </div>

                <Button
                    onClick={() => router.push('/')}
                    className="w-full bg-[#630D16] text-[#FDFCF0] shadow-lg shadow-[#630D16]/20 py-3"
                >
                    Back to Home <Home className="w-4 h-4 ml-2" />
                </Button>
            </motion.div>
        </div>
    );
}
