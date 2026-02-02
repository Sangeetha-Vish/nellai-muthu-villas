'use client';

import React, { useState } from 'react';
import { useOrders } from '@/contexts/OrderContext';
import { ShoppingBag, ChevronDown, ChevronUp, Calendar, MapPin, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrderHistoryPage() {
    const { orders } = useOrders();
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [hasMounted, setHasMounted] = React.useState(false);

    React.useEffect(() => {
        setHasMounted(true);
    }, []);

    const toggleExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (!hasMounted) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#630D16]"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-[#E6D5C3] text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="w-10 h-10 text-[#D4AF37]" />
                    </div>
                    <h2 className="text-2xl font-serif text-[#630D16] mb-4">No Orders Yet</h2>
                    <p className="text-[#8B4513]/60 mb-8">
                        Your order history will appear here once you place your first order.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-[#630D16] text-[#FDFCF0] px-8 py-3 rounded-xl font-medium hover:bg-[#4A0A10] transition-colors"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-serif text-3xl text-[#630D16]">My Order History</h1>
                        <p className="text-[#8B4513] opacity-60">View and track your sweet traditions</p>
                    </div>
                    <Link href="/" className="inline-flex items-center gap-2 text-[#630D16] font-medium hover:underline">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-[#E6D5C3] overflow-hidden">
                            {/* Order Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-wrap gap-4 items-center justify-between"
                                onClick={() => toggleExpand(order.id)}
                            >
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-[#FDFCF0] rounded-lg border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-6 h-6 text-[#630D16]" />
                                    </div>
                                    <div>
                                        <p className="font-mono text-sm font-bold text-[#630D16]">
                                            {order.publicOrderId || order.simpleId || order.id}
                                        </p>
                                        <p className="text-xs text-[#8B4513] opacity-60">
                                            {new Date(order.createdAt).toLocaleDateString([], { dateStyle: 'long' })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="hidden md:block">
                                        <p className="text-[10px] uppercase tracking-widest text-[#8B4513]/60 font-bold mb-1">Items</p>
                                        <p className="text-sm font-medium text-[#3D2B1F]">{order.items.length} Sweets</p>
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] uppercase tracking-widest text-[#8B4513]/60 font-bold mb-1">Total</p>
                                        <p className="text-sm font-bold text-[#630D16]">₹{order.totalAmount}</p>
                                    </div>
                                    <div>
                                        <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-[10px] font-bold uppercase">
                                            {order.status}
                                        </span>
                                    </div>
                                    {expandedOrder === order.id ? <ChevronUp className="w-5 h-5 text-[#8B4513]" /> : <ChevronDown className="w-5 h-5 text-[#8B4513]" />}
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedOrder === order.id && (
                                <div className="px-6 pb-6 pt-2 border-t border-[#FDFCF0] animate-in slide-in-from-top-2 duration-200">
                                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin className="w-4 h-4 text-[#630D16] mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-[#3D2B1F]">Pickup Location</p>
                                                    <p className="text-xs text-[#8B4513]">{order.branch.name}, {order.branch.area}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Calendar className="w-4 h-4 text-[#630D16] mt-0.5" />
                                                <div>
                                                    <p className="text-xs font-bold text-[#3D2B1F]">Pickup Time</p>
                                                    <p className="text-xs text-[#8B4513]">
                                                        {new Date(order.pickupTime).toLocaleString([], {
                                                            dateStyle: 'medium',
                                                            timeStyle: 'short'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-[#FDFCF0]/50 p-4 rounded-lg border border-[#D4AF37]/10">
                                            <p className="text-xs font-bold text-[#3D2B1F] mb-1">Customer Info</p>
                                            <p className="text-xs text-[#8B4513]">{order.customerName}</p>
                                            <p className="text-[10px] text-[#8B4513]/60">{order.customerEmail}</p>
                                            <p className="text-xs text-[#630D16] mt-2 font-medium">Payment: {order.paymentMethod}</p>

                                            {order.paymentMethod === 'CASH' && order.otp && (
                                                <div className="mt-3 p-2 bg-[#630D16]/5 border border-[#630D16]/20 rounded-lg text-center">
                                                    <p className="text-[10px] uppercase text-[#8B4513]/60 font-bold mb-1">Pickup OTP</p>
                                                    <p className="text-xl font-bold tracking-widest text-[#630D16] font-mono">{order.otp}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-[#3D2B1F] uppercase tracking-wider">Ordered Items</p>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="relative w-12 h-12 rounded border border-[#D4AF37]/20 overflow-hidden flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-[#3D2B1F]">{item.name}</p>
                                                    <p className="text-[10px] text-[#8B4513] opacity-60">{item.weight} x {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-bold text-[#630D16]">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
