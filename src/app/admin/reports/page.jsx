'use client';

import React, { useEffect, useState } from 'react';
import { IndianRupee, ShoppingBag, TrendingUp, BarChart3, Calendar, RefreshCw, Store, Download } from 'lucide-react';

export default function AdminReports() {
    const [salesData, setSalesData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [branchData, setBranchData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [salesRes, prodRes, branchRes] = await Promise.all([
                fetch(`/api/admin/reports/sales?days=${days}`),
                fetch('/api/admin/reports/products'),
                fetch('/api/admin/reports/branches')
            ]);

            if (salesRes.ok) setSalesData(await salesRes.json());
            if (prodRes.ok) setProductData(await prodRes.json());
            if (branchRes.ok) setBranchData(await branchRes.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [days]);

    const exportToCSV = (data, filename) => {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
        const csvContent = `${headers}\n${rows}`;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Operational Insights</h1>
                    <p className="text-[#8B4513]/60 mt-1">Review sales performance and product popularity</p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => exportToCSV(salesData, 'daily_sales')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#D4AF37]/20 rounded-xl text-xs font-bold text-[#630D16] hover:bg-[#630D16]/5 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Export Sales
                    </button>
                    <div className="flex bg-white border border-[#D4AF37]/20 rounded-xl p-1 shadow-sm">
                        {[7, 30, 90].map(d => (
                            <button
                                key={d}
                                onClick={() => setDays(d)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${days === d
                                    ? 'bg-[#630D16] text-[#FDFCF0]'
                                    : 'text-[#8B4513]/60 hover:bg-[#630D16]/5'
                                    }`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                    <button onClick={fetchData} className="p-2 hover:bg-[#630D16]/5 rounded-xl text-[#630D16] border border-[#D4AF37]/20 bg-white shadow-sm">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-[#630D16]/5 rounded-xl text-[#630D16]">
                        <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/50 tracking-wider">Total Revenue ({days}d)</p>
                        <p className="text-2xl font-serif font-bold text-[#3D2B1F]">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-orange-50 rounded-xl text-orange-600">
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/50 tracking-wider">Total Orders ({days}d)</p>
                        <p className="text-2xl font-serif font-bold text-[#3D2B1F]">{totalOrders}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#D4AF37]/20 shadow-sm flex items-center gap-4">
                    <div className="p-4 bg-green-50 rounded-xl text-green-600">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-[#8B4513]/50 tracking-wider">Avg Order Value</p>
                        <p className="text-2xl font-serif font-bold text-[#3D2B1F]">₹{totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Products */}
                <div className="bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#630D16]" />
                            <h2 className="font-serif text-xl text-[#3D2B1F] font-bold">Top Performing Sweets</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {productData.slice(0, 5).map((prod, i) => (
                                <div key={prod.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#FDFCF0] border border-[#D4AF37]/20 flex items-center justify-center text-xs font-bold text-[#630D16]">
                                            {i + 1}
                                        </div>
                                        <span className="font-medium text-[#3D2B1F]">{prod.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#630D16]">{prod.volume} Sold</p>
                                        <p className="text-[10px] text-[#8B4513]/50">₹{prod.revenue.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            {productData.length === 0 && <p className="text-center text-gray-400 py-8 italic">No data available</p>}
                        </div>
                    </div>
                </div>

                {/* Branch Performance */}
                <div className="bg-white rounded-2xl border border-[#D4AF37]/20 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-[#630D16]" />
                            <h2 className="font-serif text-xl text-[#3D2B1F] font-bold">Outlet Performance</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-6">
                            {branchData.map(branch => {
                                const marketShare = totalRevenue > 0 ? (branch.totalRevenue / totalRevenue) * 100 : 0;
                                return (
                                    <div key={branch.id} className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="font-bold text-[#3D2B1F]">{branch.name}</span>
                                            <span className="text-[#630D16] font-bold">₹{branch.totalRevenue.toLocaleString()}</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#D4AF37] opacity-60 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.max(5, marketShare)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] opacity-60">
                                            <span>{branch.totalOrders} orders completed</span>
                                            <span>{Math.round(marketShare)}% contribution</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {branchData.length === 0 && <p className="text-center text-gray-400 py-8 italic">No branches found</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
