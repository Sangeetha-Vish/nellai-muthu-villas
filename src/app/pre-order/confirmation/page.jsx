'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [orderDetails, setOrderDetails] = React.useState(null);

    React.useEffect(() => {
        const stored = sessionStorage.getItem('last_order_details');
        if (stored) {
            setOrderDetails(JSON.parse(stored));
            // Security: Clear OTP from storage after reading it once
            // This satisfies "Refresh page -> OTP hidden"
            sessionStorage.removeItem('last_order_details');
        }
    }, []);

    const orderId = searchParams.get('orderId');
    const orderType = searchParams.get('type') || 'IMMEDIATE';

    const isImmediate = orderType === 'IMMEDIATE';

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4 relative">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl p-8 md:p-12 text-center border border-[#D4AF37]/20 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-[#630D16]/5 rounded-full flex items-center justify-center border border-[#630D16]/10">
                        <CheckCircle2 className="w-8 h-8 text-[#630D16]" />
                    </div>
                </div>

                <h1 className="font-serif text-3xl text-[#630D16] mb-2 font-bold tracking-tight">
                    {isImmediate ? 'Order Confirmed' : 'Pre-Order Confirmed'}
                </h1>

                <p className="font-sans text-[#8B4513] mb-8 text-sm opacity-90">
                    {isImmediate
                        ? 'Your heritage sweets are being prepared for pickup.'
                        : 'Your tradition has been scheduled for pickup.'
                    }
                </p>

                {/* Secure Details Section */}
                <div className="bg-[#F9F7E8] p-6 rounded-xl border border-[#D4AF37]/30 mb-8 text-left space-y-4">
                    <div className="flex justify-between items-center border-b border-[#D4AF37]/20 pb-2">
                        <span className="text-xs text-[#8B4513] uppercase font-bold tracking-widest opacity-60">Order Reference</span>
                        <span className="font-bold text-[#630D16] font-mono text-lg">{orderDetails?.publicOrderId || '---'}</span>
                    </div>

                    {orderDetails?.otp && (
                        <div className="py-4 text-center">
                            <p className="text-[10px] text-[#8B4513] uppercase font-bold tracking-widest mb-2 opacity-60">Pickup OTP</p>
                            <div className="bg-white py-3 px-6 rounded-lg border-2 border-[#D4AF37]/20 inline-block">
                                <p className="text-4xl font-bold tracking-[0.4em] text-[#630D16] pl-[0.4em]">{orderDetails.otp}</p>
                            </div>
                            <p className="text-[11px] text-[#8B4513] mt-3 font-medium">Please show this at the counter for verification</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#D4AF37]/20">
                        <div>
                            <p className="text-[10px] text-[#8B4513] uppercase font-bold opacity-60">Payment Method</p>
                            <p className="text-sm font-bold text-[#3D2B1F]">
                                {orderDetails?.paymentMethod === 'UPI' ? 'UPI / Online' : 'Cash on Pickup'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] text-[#8B4513] uppercase font-bold opacity-60">Pickup Type</p>
                            <p className="text-sm font-bold text-[#3D2B1F]">{isImmediate ? 'Immediate' : 'Pre-Order'}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Button
                        onClick={() => router.push('/')}
                        className="w-full bg-[#630D16] hover:bg-[#4A0A10] text-[#FDFCF0] shadow-md py-4 rounded-xl font-bold tracking-wide"
                    >
                        Back to Home
                    </Button>
                    <button
                        onClick={() => router.push('/account/orders')}
                        className="text-sm text-[#8B4513] hover:text-[#630D16] font-medium transition-colors"
                    >
                        View My Orders
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <div className="w-12 h-12 bg-[#630D16] rounded-full animate-bounce"></div>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}
