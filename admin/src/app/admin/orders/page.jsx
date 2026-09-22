'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, User, MapPin, Package, RefreshCw } from 'lucide-react';
import { apiFetch } from '@/services/api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ type: 'IMMEDIATE', status: 'ALL' });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let url = `/api/admin/orders?type=${filter.type}`;
            if (filter.status !== 'ALL') url += `&status=${filter.status}`;

            const res = await apiFetch(url);
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        setIsUpdating(true);
        try {
            const res = await apiFetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Update local list
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
                // Update selected order if it's the one that changed
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const statusColors = {
        RECEIVED: 'bg-blue-100 text-blue-700 border-blue-200',
        PREPARING: 'bg-orange-100 text-orange-700 border-orange-200',
        READY_FOR_PICKUP: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        COMPLETED: 'bg-green-100 text-green-700 border-green-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <div className="space-y-8 h-[calc(100vh-160px)] flex flex-col">
            {/* Header & Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Order Management</h1>
                    <div className="flex items-center gap-2 mt-1 text-[#8B4513]/60">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-sans font-medium">{orders.length} total orders found</span>
                        <button onClick={fetchOrders} className="ml-2 p-1 hover:bg-[#630D16]/5 rounded text-[#630D16]">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[#D4AF37]/20 ring-1 ring-[#D4AF37]/5">
                    <button
                        onClick={() => { setFilter({ ...filter, type: 'IMMEDIATE' }); setSelectedOrder(null); }}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all ${filter.type === 'IMMEDIATE'
                                ? 'bg-[#630D16] text-[#FDFCF0] shadow-md'
                                : 'text-[#8B4513]/60 hover:text-[#630D16]'
                            }`}
                    >
                        Immediate
                    </button>
                    <button
                        onClick={() => { setFilter({ ...filter, type: 'PRE_ORDER' }); setSelectedOrder(null); }}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all ${filter.type === 'PRE_ORDER'
                                ? 'bg-[#630D16] text-[#FDFCF0] shadow-md'
                                : 'text-[#8B4513]/60 hover:text-[#630D16]'
                            }`}
                    >
                        Pre-Orders
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden min-h-0">
                {/* List View */}
                <div className="w-full lg:w-2/5 flex flex-col space-y-3 overflow-y-auto pr-2 custom-scrollbar lg:bg-white/30 lg:p-2 lg:rounded-2xl">
                    {loading && orders.length === 0 ? (
                        Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-28 bg-white/50 rounded-2xl animate-pulse border border-[#D4AF37]/10" />
                        ))
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#D4AF37]/30">
                            <ShoppingBag className="w-12 h-12 text-[#D4AF37]/40 mx-auto mb-4" />
                            <p className="text-[#8B4513]/60 font-sans">No {filter.type.toLowerCase().replace('_', ' ')} orders found.</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <button
                                key={order.id}
                                onClick={() => setSelectedOrder(order)}
                                className={`text-left p-5 rounded-2xl border transition-all ${selectedOrder?.id === order.id
                                        ? 'bg-white border-[#630D16]/40 shadow-lg shadow-[#630D16]/5 ring-1 ring-[#630D16]/20'
                                        : 'bg-white border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:shadow-md hover:bg-white/80'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-mono text-[10px] font-bold text-[#630D16] bg-[#630D16]/5 px-2 py-1 rounded">
                                        #{order.publicOrderId}
                                    </span>
                                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                                        {order.status.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <h3 className="font-bold text-[#3D2B1F] truncate group-hover:text-[#630D16]">{order.user?.name || 'Valued Customer'}</h3>
                                <div className="flex items-center gap-4 mt-3 text-[11px] text-[#8B4513]/60 font-medium">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                                        <span>{new Date(order.pickupTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-3.5 h-3.5 text-[#D4AF37]/70" />
                                        <span>{order.items?.length || 0} items</span>
                                    </div>
                                    <div className="ml-auto font-bold text-[#630D16] text-[13px]">₹{order.totalAmount}</div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Detail View */}
                <div className="hidden lg:block lg:flex-1 bg-white rounded-2xl border border-[#D4AF37]/20 shadow-xl overflow-hidden shadow-black/5 flex flex-col min-h-0">
                    {selectedOrder ? (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Detail Header */}
                            <div className="p-8 border-b border-[#D4AF37]/10 bg-[#FDFCF0]/40 flex-shrink-0">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-[#D4AF37] px-2 py-0.5 rounded-sm">
                                                {selectedOrder.orderType === 'IMMEDIATE' ? 'Immediate Pickup' : 'Pre-Order Planned'}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-serif text-[#630D16] leading-none">{selectedOrder.publicOrderId}</h2>
                                    </div>
                                    <div className={`px-5 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-widest ${statusColors[selectedOrder.status]}`}>
                                        {selectedOrder.status.replace(/_/g, ' ')}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl border border-[#D4AF37]/20 text-[#630D16] shadow-sm">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#8B4513]/50 font-bold uppercase tracking-wider mb-1">Customer Details</p>
                                            <p className="font-bold text-[#3D2B1F] text-base leading-tight">{selectedOrder.user?.name}</p>
                                            <p className="text-xs text-[#8B4513]/70 font-sans mt-0.5">{selectedOrder.user?.phone || 'No Phone Number'}</p>
                                            <p className="text-[11px] text-[#8B4513]/50 italic">{selectedOrder.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl border border-[#D4AF37]/20 text-[#630D16] shadow-sm">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#8B4513]/50 font-bold uppercase tracking-wider mb-1">Pickup Information</p>
                                            <p className="font-bold text-[#3D2B1F] text-base leading-tight">{selectedOrder.branch?.name}</p>
                                            <p className="text-xs text-[#8B4513]/70 font-sans mt-0.5">{selectedOrder.branch?.area}</p>
                                            <p className="text-[11px] font-bold text-[#630D16] mt-1 bg-[#630D16]/5 px-2 py-0.5 rounded inline-block">
                                                {new Date(selectedOrder.pickupTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scrollable Items Section */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                {/* Status Actions */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-4 bg-[#630D16] rounded-full" />
                                        <h4 className="text-[11px] uppercase tracking-widest text-[#8B4513]/70 font-bold">Execution Management</h4>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {Object.keys(statusColors).map((status) => (
                                            <button
                                                key={status}
                                                disabled={isUpdating}
                                                onClick={() => updateStatus(selectedOrder.id, status)}
                                                className={`px-4 py-3 rounded-xl text-[11px] font-bold border transition-all shadow-sm ${selectedOrder.status === status
                                                        ? 'bg-[#630D16] text-white border-[#630D16] shadow-md scale-[1.02]'
                                                        : 'bg-white text-[#8B4513] border-[#D4AF37]/30 hover:border-[#630D16] hover:bg-[#630D16]/5'
                                                    } disabled:opacity-50`}
                                            >
                                                {status.replace(/_/g, ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Items Table-style */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-1 h-4 bg-[#630D16] rounded-full" />
                                        <h4 className="text-[11px] uppercase tracking-widest text-[#8B4513]/70 font-bold">Order Breakdown</h4>
                                    </div>
                                    <div className="space-y-0.5">
                                        {selectedOrder.items?.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-[#FDFCF0]/30 hover:bg-[#FDFCF0]/60 transition-colors">
                                                <div className="w-14 h-14 rounded-lg bg-white border border-[#D4AF37]/10 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                                                    <img src={item.product?.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-[#3D2B1F] text-sm truncate">{item.product?.name}</p>
                                                    <p className="text-[10px] uppercase font-bold text-[#8B4513]/40 tracking-wider">
                                                        {item.product?.weight} × {item.quantity} units
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#630D16] text-base">₹{item.price * item.quantity}</p>
                                                    <p className="text-[10px] text-[#8B4513]/50">₹{item.price} / Unit</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Detail Footer */}
                            <div className="p-8 border-t border-[#D4AF37]/10 bg-[#FDFCF0]/30 flex-shrink-0 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] text-[#8B4513]/50 font-bold uppercase tracking-widest mb-2">Audit Information</p>
                                    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap text-[10px] text-[#8B4513]/70">
                                        <span className="flex items-center gap-1">Method: <span className="font-bold text-[#3D2B1F]">{selectedOrder.paymentMethod}</span></span>
                                        <span className="flex items-center gap-1">Created: <span className="font-bold text-[#3D2B1F]">{new Date(selectedOrder.createdAt).toLocaleString()}</span></span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-[#8B4513]/50 uppercase font-black tracking-widest mb-1">Total Receivable</p>
                                    <p className="text-4xl font-serif text-[#630D16] leading-none">₹{selectedOrder.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-white to-[#FDFCF0]/10">
                            <div className="w-24 h-24 bg-[#FDFCF0] rounded-full flex items-center justify-center mb-6 border border-[#D4AF37]/20 shadow-inner">
                                <ShoppingBag className="w-10 h-10 text-[#D4AF37]/50" />
                            </div>
                            <p className="font-serif text-2xl text-[#3D2B1F]/60">Back-Office Ready</p>
                            <p className="text-sm text-[#8B4513]/40 mt-2 max-w-xs mx-auto">Select a customer request from the left list to begin preparation and management.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
