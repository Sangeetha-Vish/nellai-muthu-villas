'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader, Package, MapPin, Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/ui/BackButton';

export default function MyOrdersPage() {
    const { user, loading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    if (loading) return null;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFCF0]">
                <p>Please log in to view orders.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <BackButton />
                    <h1 className="font-serif text-3xl text-[#630D16] mt-4">My Orders</h1>
                    <p className="text-[#8B4513] opacity-80">Track your past and upcoming orders</p>
                </div>

                {isLoadingOrders ? (
                    <div className="flex justify-center py-12">
                        <Loader className="w-8 h-8 text-[#D4A373] animate-spin" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl border border-[#E6D5C3] text-center">
                        <div className="w-16 h-16 bg-[#FDF8F5] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-[#D4A373]" />
                        </div>
                        <h3 className="text-xl font-medium text-[#5D4037] mb-2">No orders yet</h3>
                        <p className="text-[#8B4513]/60 mb-6">Start your tradition with us today.</p>
                        <Link href="/" className="inline-block bg-[#D4A373] text-white px-6 py-2 rounded-lg hover:bg-[#C39265]">
                            Browse Sweets
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-colors shadow-sm">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-[#630D16] bg-[#F9F7E8] px-2 py-1 rounded">
                                                {order.publicOrderId || order.simpleId}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#8B4513]/60 uppercase tracking-tight">
                                                {order.paymentMethod === 'UPI' ? 'UPI' : 'Cash'}
                                            </span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border 
                                                ${order.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    order.status === 'PENDING_PAYMENT' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        order.status === 'READY' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-[#5D4037]">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-[#D4A373]" />
                                                {new Date(order.pickupTime).toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-[#D4A373]" />
                                                {order.branch.name}
                                            </div>
                                        </div>

                                        <div className="text-sm text-[#8B4513]/80">
                                            {order.items.map(item => (
                                                <span key={item.id} className="mr-3">
                                                    {item.product.name} ({item.quantity})
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between">
                                        <span className="font-serif text-xl text-[#630D16]">₹{order.totalAmount}</span>
                                        {/* Optional: Add View Details button */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
