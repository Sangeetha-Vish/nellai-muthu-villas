'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useBranch } from '@/contexts/BranchContext';
import { useOrders } from '@/contexts/OrderContext';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MapPin, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { BackButton } from '@/components/ui/BackButton';

import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, totalAmount, clearCart, orderType, preOrderDate, preOrderOccasion } = useCart();
    const { selectedBranch } = useBranch();
    const { addOrder } = useOrders();
    const { user, loading } = useAuth();
    const router = useRouter();

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Initialize state based on Order Type
    useEffect(() => {
        if (orderType === 'IMMEDIATE') {
            const today = new Date().toISOString().split('T')[0];
            setDate(today);
        } else if (orderType === 'PRE_ORDER' && preOrderDate) {
            setDate(preOrderDate);
        }
    }, [orderType, preOrderDate]);

    // Redirect if cart empty (but not if we're currently submitting or just finished)
    useEffect(() => {
        if (items.length === 0 && !isSubmitting) {
            // Add a small delay to ensure we're not just in the middle of a redirect
            const timeout = setTimeout(() => {
                if (items.length === 0) {
                    router.push('/pre-order');
                }
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [items, router, isSubmitting]);

    const getMinTime = () => {
        if (orderType === 'IMMEDIATE') {
            const now = new Date();
            now.setMinutes(now.getMinutes() + 30); // 30 mins buffer
            return now.toTimeString().slice(0, 5);
        }
        return "09:00"; // Shop opening time
    };

    const handleConfirm = async () => {
        setError(null);

        // Validation
        if (!selectedBranch) {
            setError("Please go back and select a pickup branch.");
            return;
        }
        if (!date) {
            setError("Pickup date is missing.");
            return;
        }
        if (!time) {
            setError("Please select a pickup time.");
            return;
        }

        // Validate Time for Immediate Order (Double Check)
        if (orderType === 'IMMEDIATE') {
            const now = new Date();
            const selectedDateTime = new Date(`${date}T${time}`);
            const minTime = new Date(now.getTime() + 20 * 60000); // 20 min tolerance

            if (selectedDateTime < minTime) {
                setError("For immediate orders, please allow at least 30 minutes for preparation.");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const pickupDateTime = new Date(`${date}T${time}`);

            const payload = {
                items: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: Math.round(Number(totalAmount)), // Ensure Integer for Prisma
                branchId: selectedBranch.id,
                pickupTime: pickupDateTime.toISOString(),
                orderType: orderType || 'IMMEDIATE',
                occasion: preOrderOccasion || 'PERSONAL',
                paymentMethod: paymentMethod // Add payment method
            };

            // UPI FLOW: Defer order creation (Requirement)
            if (paymentMethod === 'UPI') {
                const richPayload = {
                    items: items.map(item => ({
                        productId: item.productId,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        weight: item.weight,
                        image: item.image
                    })),
                    totalAmount: Math.round(Number(totalAmount)),
                    branch: selectedBranch,
                    pickupTime: pickupDateTime.toISOString(),
                    orderType: orderType || 'IMMEDIATE',
                    occasion: preOrderOccasion || 'PERSONAL',
                    paymentMethod: paymentMethod,
                    customerName: user?.name || 'Valued Customer',
                    customerEmail: user?.email
                };
                sessionStorage.setItem('pending_order_payload', JSON.stringify(richPayload));
                router.push('/pre-order/upi');
                return;
            }

            // CASH FLOW & LOCAL MVP FLOW: Create order locally
            const orderData = {
                items: items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    weight: item.weight,
                    image: item.image
                })),
                totalAmount: Math.round(Number(totalAmount)),
                branch: selectedBranch,
                pickupTime: pickupDateTime.toISOString(),
                orderType: orderType || 'IMMEDIATE',
                occasion: preOrderOccasion || 'PERSONAL',
                paymentMethod: paymentMethod,
                customerName: user.name || 'Valued Customer',
                customerEmail: user.email
            };

            const savedOrder = addOrder(orderData);
            clearCart();

            // Redirect to success page
            router.push('/order-success');
        } catch (err) {
            console.error(err);
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return null; // Or a spinner
    if (!user) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E6D5C3] text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-[#D4A373]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-[#D4A373]" />
                    </div>
                    <h2 className="text-2xl font-serif text-[#5D4037] mb-2">Sign in to Order</h2>
                    <p className="text-[#8B4513]/60 mb-6">
                        Please sign in to secure your order and track its status.
                    </p>
                    <Link
                        href={`/login?redirect=/pre-order/checkout`}
                        className="block w-full bg-[#D4A373] hover:bg-[#C39265] text-white font-medium py-3 rounded-xl transition-all"
                    >
                        Sign In / Create Account
                    </Link>
                    <Link href="/" className="block mt-4 text-[#D4A373] hover:text-[#C39265] text-sm">
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) return null;

    const isImmediate = orderType === 'IMMEDIATE';

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <BackButton />
                    <h1 className="font-serif text-3xl text-[#630D16] mt-4">
                        {isImmediate ? 'Confirm Immediate Order' : 'Review Pre-Order'}
                    </h1>
                    <p className="font-sans text-[#8B4513] opacity-80">
                        {isImmediate
                            ? 'Review your items and select a pickup time for today.'
                            : `Order for ${new Date(date).toLocaleDateString()} • ${preOrderOccasion || 'Planned'}`
                        }
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column: Details */}
                    <div className="space-y-6">
                        {/* Branch Card */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D4AF37]/30">
                            <h2 className="font-serif text-xl text-[#3D2B1F] mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#630D16]" />
                                Pickup Location
                            </h2>
                            {selectedBranch ? (
                                <div>
                                    <p className="font-medium text-[#630D16]">{selectedBranch.name}</p>
                                    <p className="text-sm text-[#8B4513] opacity-80">{selectedBranch.area}</p>
                                </div>
                            ) : (
                                <p className="text-red-600 text-sm">No branch selected.</p>
                            )}
                        </div>

                        {/* Date & Time Selection */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#D4AF37]/30">
                            <h2 className="font-serif text-xl text-[#3D2B1F] mb-4 flex items-center gap-2">
                                {isImmediate ? <Clock className="w-5 h-5 text-[#630D16]" /> : <Calendar className="w-5 h-5 text-[#630D16]" />}
                                {isImmediate ? 'Pickup Time (Today)' : 'Schedule Pickup'}
                            </h2>

                            <div className="space-y-4">
                                {/* Date Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[#8B4513] mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        disabled
                                        className="w-full p-2 bg-[#F9F7E8] border border-[#D4AF37]/20 rounded text-[#3D2B1F] opacity-70 cursor-not-allowed font-medium"
                                    />
                                    {!isImmediate && (
                                        <p className="text-xs text-[#8B4513] mt-1 italic">
                                            Date selected during setup.
                                        </p>
                                    )}
                                </div>

                                {/* Time Input */}
                                <div>
                                    <label className="block text-sm font-medium text-[#8B4513] mb-1">
                                        Approx. Time {isImmediate && <span className="text-[#630D16] font-bold">*</span>}
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        min={getMinTime()}
                                        onChange={(e) => {
                                            setTime(e.target.value);
                                            setError(null);
                                        }}
                                        className="w-full p-2 bg-white border border-[#D4AF37]/40 rounded text-[#3D2B1F] focus:border-[#630D16] outline-none"
                                    />
                                    {isImmediate ? (
                                        <p className="text-xs text-[#630D16] mt-1 font-medium bg-[#630D16]/5 p-1 rounded inline-block">
                                            Minimum 30 mins required for preparation
                                        </p>
                                    ) : (
                                        <p className="text-xs text-[#8B4513] mt-1 opacity-70">
                                            Shop hours: 9:00 AM - 9:00 PM
                                        </p>
                                    )}
                                </div>
                                {/* Payment Method */}
                                <div className="pt-4 border-t border-[#D4AF37]/20">
                                    <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                        Payment Method
                                    </label>
                                    <div className="space-y-2">
                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-[#630D16] bg-[#630D16]/5' : 'border-[#D4AF37]/30 hover:bg-[#D4AF37]/5'}`}>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'CASH' ? 'border-[#630D16]' : 'border-[#8B4513]/40'}`}>
                                                {paymentMethod === 'CASH' && <div className="w-2 h-2 rounded-full bg-[#630D16]" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="CASH"
                                                checked={paymentMethod === 'CASH'}
                                                onChange={() => setPaymentMethod('CASH')}
                                                className="hidden"
                                            />
                                            <span className="text-[#3D2B1F] font-medium">Cash on Pickup</span>
                                        </label>

                                        <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-[#630D16] bg-[#630D16]/5' : 'border-[#D4AF37]/30 hover:bg-[#D4AF37]/5'}`}>
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'UPI' ? 'border-[#630D16]' : 'border-[#8B4513]/40'}`}>
                                                {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-[#630D16]" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="UPI"
                                                checked={paymentMethod === 'UPI'}
                                                onChange={() => setPaymentMethod('UPI')}
                                                className="hidden"
                                            />
                                            <span className="text-[#3D2B1F] font-medium">UPI / Online (Show QR at Shop)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-[#D4AF37]/50 sticky top-24">
                            <h2 className="font-serif text-xl text-[#3D2B1F] mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[#630D16]" />
                                Order Summary
                            </h2>

                            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-4">
                                {items.map((item) => (
                                    <div key={item.productId} className="flex gap-3 py-3 border-b border-[#D4AF37]/10 last:border-0">
                                        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-[#D4AF37]/20">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#3D2B1F]">{item.name}</h4>
                                            <p className="text-sm text-[#8B4513] opacity-80">{item.weight} x {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-[#630D16]">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-[#D4AF37]/30 pt-4 space-y-2">
                                <div className="flex justify-between text-lg font-bold text-[#630D16]">
                                    <span>Total Amount</span>
                                    <span>₹{totalAmount}</span>
                                </div>
                                <p className="text-xs text-[#8B4513] text-right opacity-70">
                                    Includes all taxes
                                </p>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded flex items-start gap-2 animate-in slide-in-from-top-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting || !selectedBranch}
                                className={`w-full mt-6 py-3 rounded text-[#FDFCF0] font-medium tracking-wide flex items-center justify-center gap-2 transition-all shadow-md
                                    ${isSubmitting || !selectedBranch
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : isImmediate
                                            ? 'bg-[#630D16] hover:bg-[#4A0A10] shadow-[#630D16]/20'
                                            : 'bg-[#D4AF37] hover:bg-[#B59530] shadow-[#D4AF37]/20 !text-[#3D2B1F]'
                                    }`}
                            >
                                {isSubmitting ? 'Processing...' : (
                                    <>
                                        {isImmediate ? 'Confirm & Order' : 'Confirm Pre-Order'}
                                        <ArrowRight className="w-5 h-5 ml-2 inline" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
