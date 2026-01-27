'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Store, Clock, AlertCircle, RefreshCw, Filter } from 'lucide-react';

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ branchId: 'ALL', minRating: '' });
    const [branches, setBranches] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [feedbackRes, branchRes] = await Promise.all([
                fetch(`/api/admin/feedback?branchId=${filter.branchId}&minRating=${filter.minRating}`),
                fetch('/api/admin/branches')
            ]);

            if (feedbackRes.ok) {
                const data = await feedbackRes.json();
                setFeedbacks(data.feedbacks);
                setStats(data.stats);
            }
            if (branchRes.ok) setBranches(await branchRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filter.branchId, filter.minRating]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Customer Voice</h1>
                    <p className="text-[#8B4513]/60 mt-1">Review ratings and feedback from the community</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <select
                        value={filter.branchId}
                        onChange={(e) => setFilter({ ...filter, branchId: e.target.value })}
                        className="px-4 py-2 bg-white border border-[#D4AF37]/20 rounded-xl text-xs font-bold text-[#8B4513] outline-none shadow-sm transition-all"
                    >
                        <option value="ALL">All Branches</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>

                    <select
                        value={filter.minRating}
                        onChange={(e) => setFilter({ ...filter, minRating: e.target.value })}
                        className="px-4 py-2 bg-white border border-[#D4AF37]/20 rounded-xl text-xs font-bold text-[#8B4513] outline-none shadow-sm"
                    >
                        <option value="">Any Rating</option>
                        <option value="4">4+ Stars</option>
                        <option value="1">1-2 Stars (Priority)</option>
                    </select>

                    <button
                        onClick={fetchData}
                        className="p-2 bg-white border border-[#D4AF37]/20 rounded-xl text-[#630D16] hover:bg-[#630D16]/5 transition-all shadow-sm"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#630D16]/5 rounded-2xl flex items-center justify-center text-[#630D16]">
                        <Star className="w-8 h-8 fill-[#D4AF37] text-[#D4AF37]" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/40 tracking-widest">Average Rating</p>
                        <p className="text-3xl font-serif text-[#3D2B1F]">
                            {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                            <span className="text-sm font-sans text-gray-400 ml-1">/ 5.0</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/40 tracking-widest">Total Reviews</p>
                        <p className="text-3xl font-serif text-[#3D2B1F]">{stats?.totalFeedback || 0}</p>
                    </div>
                </div>

                {feedbacks.some(f => f.rating <= 2) && (
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4 border-l-[6px] border-l-red-500">
                        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-red-500 tracking-widest">Attention Required</p>
                            <p className="text-sm font-bold text-red-700">Low ratings detected</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                {feedbacks.map((f) => (
                    <div
                        key={f.id}
                        className={`bg-white rounded-2xl border transition-all ${f.rating <= 2
                                ? 'border-red-200 shadow-lg shadow-red-500/5 bg-red-50/10'
                                : 'border-[#D4AF37]/20 shadow-sm hover:shadow-md'
                            } overflow-hidden`}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#630D16] text-[#FDFCF0] flex items-center justify-center font-bold">
                                        {f.user.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#3D2B1F]">{f.user.name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < f.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-[#8B4513]/40 font-bold">• {new Date(f.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#630D16] bg-[#630D16]/5 px-2 py-1 rounded-full border border-[#630D16]/10">
                                        <Store className="w-3 h-3" />
                                        {f.order.branch.name}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1 font-mono">#{f.order.publicOrderId}</p>
                                </div>
                            </div>

                            <div className="bg-[#FDFCF0]/50 p-4 rounded-xl border border-[#D4AF37]/10 relative">
                                <MessageSquare className="absolute -top-3 -right-3 w-8 h-8 text-[#D4AF37]/10 rotate-12" />
                                <p className="text-sm text-[#3D2B1F] leading-relaxed italic">
                                    "{f.comment || 'No written comment provided.'}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {feedbacks.length === 0 && !loading && (
                    <div className="lg:col-span-2 py-20 bg-white rounded-3xl border border-dashed border-[#D4AF37]/30 text-center">
                        <MessageSquare className="w-16 h-16 text-[#D4AF37]/20 mx-auto mb-4" />
                        <p className="text-[#8B4513]/40 font-serif text-xl italic">Waiting for the community's voice...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
