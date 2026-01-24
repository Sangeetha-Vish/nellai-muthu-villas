'use client';

import React, { useEffect, useState } from 'react';
import { Store, Clock, MapPin, AlertCircle, Power, RefreshCw, Layers } from 'lucide-react';

export default function AdminBranches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchBranches = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/branches');
            if (res.ok) {
                const data = await res.json();
                setBranches(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    const updateStatus = async (branch, updates) => {
        setIsUpdating(true);

        // Optimistic update
        const oldBranches = [...branches];
        setBranches(prev => prev.map(b => b.id === branch.id ? { ...b, ...updates } : b));

        try {
            await fetch('/api/admin/branches', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: branch.id, ...updates }),
            });
        } catch (error) {
            // Revert on error
            setBranches(oldBranches);
        } finally {
            setIsUpdating(false);
        }
    };

    const statusConfig = {
        OPEN: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Open for Orders' },
        BUSY: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High Demand' },
        CLOSED: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Closed' },
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Branch Operations</h1>
                    <p className="text-[#8B4513]/60 mt-1">Control outlet availability and status</p>
                </div>
                <button onClick={fetchBranches} className="p-2 hover:bg-[#630D16]/5 rounded-xl text-[#630D16] border border-[#D4AF37]/20 bg-white">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {branches.map(branch => {
                    const isActive = branch.isActive ?? true;
                    // Default status if missing (for legacy or seeded data without it)
                    const status = branch.status || (isActive ? 'OPEN' : 'CLOSED');

                    return (
                        <div key={branch.id} className={`bg-white rounded-2xl border transition-all overflow-hidden ${isActive ? 'border-[#D4AF37]/20 shadow-sm' : 'border-gray-200 bg-gray-50 opacity-90'}`}>
                            {/* Header Status Bar */}
                            <div className={`h-2 w-full ${isActive ? (status === 'OPEN' ? 'bg-green-500' : status === 'BUSY' ? 'bg-orange-500' : 'bg-red-500') : 'bg-gray-400'}`} />

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl border ${isActive ? 'bg-[#FDFCF0] border-[#D4AF37]/20 text-[#630D16]' : 'bg-gray-100 text-gray-400'}`}>
                                            <Store className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-[#3D2B1F] font-bold">{branch.name}</h3>
                                            <div className="flex items-center gap-1 text-xs text-[#8B4513]/60 mt-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{branch.area}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => updateStatus(branch, { isActive: !isActive, status: !isActive ? 'OPEN' : 'CLOSED' })}
                                        disabled={isUpdating}
                                        className={`p-2 rounded-full transition-colors ${isActive ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                                        title={isActive ? 'Deactivate Branch' : 'Activate Branch'}
                                    >
                                        <Power className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Operational Controls */}
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#FDFCF0]/50 rounded-xl border border-[#D4AF37]/10">
                                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/50 mb-3 tracking-wider">Operational Status</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['OPEN', 'BUSY', 'CLOSED'].map((s) => (
                                                <button
                                                    key={s}
                                                    disabled={!isActive || isUpdating}
                                                    onClick={() => updateStatus(branch, { status: s })}
                                                    className={`py-2 px-1 rounded-lg text-[10px] font-bold border transition-all ${status === s
                                                            ? statusConfig[s].color + ' shadow-sm scale-[1.02]'
                                                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                >
                                                    {statusConfig[s].label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-gray-400">Timings</p>
                                            <p className="text-sm font-medium text-gray-700">{branch.timings}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
