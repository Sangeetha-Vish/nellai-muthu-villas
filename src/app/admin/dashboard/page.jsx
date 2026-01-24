'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/dashboard/stats');
            if (!res.ok) throw new Error('Failed to fetch dashboard stats');
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Today's Orders",
            value: stats?.todayCount ?? '0',
            icon: ShoppingBag,
            description: "Orders placed since midnight",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Pending Pickup",
            value: stats?.pendingCount ?? '0',
            icon: Clock,
            description: "Received or Preparing",
            color: "text-orange-600",
            bg: "bg-orange-50"
        },
        {
            title: "Upcoming Pre-Orders",
            value: stats?.upcomingPreOrders ?? '0',
            icon: Calendar,
            description: "Scheduled for future dates",
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Today's Revenue",
            value: `₹${(stats?.todayRevenue || 0).toLocaleString()}`,
            icon: TrendingUp,
            description: "Completed orders value",
            color: "text-green-600",
            bg: "bg-green-50"
        }
    ];

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Dashboard Summary</h1>
                    <p className="text-[#8B4513]/60 mt-1">Operational clarity for Nella Muthu Vilas</p>
                </div>
                <button
                    onClick={fetchStats}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4AF37]/30 rounded-xl text-sm font-medium text-[#630D16] hover:bg-[#FDFCF0] transition-colors shadow-sm disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Stats
                </button>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm hover:shadow-md transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <h3 className="text-[#8B4513]/60 text-xs font-bold uppercase tracking-wider mb-1">{card.title}</h3>
                        <div className="text-3xl font-serif text-[#3D2B1F] mb-1">
                            {loading && !stats ? (
                                <div className="h-9 w-20 bg-gray-100 animate-pulse rounded" />
                            ) : card.value}
                        </div>
                        <p className="text-[#8B4513]/40 text-xs">{card.description}</p>
                    </div>
                ))}
            </div>

            {/* Management Portal Shortcut */}
            <div className="bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between bg-[#FDFCF0]/30">
                    <h3 className="font-serif text-xl text-[#3D2B1F]">Operational Shortcut</h3>
                    <Link href="/admin/orders" className="text-sm font-bold text-[#630D16] hover:underline">Go to Orders</Link>
                </div>
                <div className="p-12 text-center">
                    <div className="w-20 h-20 bg-[#FDFCF0] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                        <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <p className="text-[#8B4513]/60 max-w-sm mx-auto mb-6">
                        Manage customer requests, update preparation status, and handle pre-orders with heritage precision.
                    </p>
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#630D16] text-[#FDFCF0] rounded-xl font-bold shadow-lg shadow-[#630D16]/20 hover:bg-[#4A0A10] transition-colors"
                    >
                        Start Managing Orders
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Helper component for ArrowRight
function ArrowRight(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    );
}
