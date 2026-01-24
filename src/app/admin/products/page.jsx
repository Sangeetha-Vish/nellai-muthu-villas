'use client';

import React, { useEffect, useState } from 'react';
import { Store, Search, Edit2, Tag, Power, AlertCircle, RefreshCw, Save } from 'lucide-react';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditForm({
            price: product.price,
            tags: product.tags || '',
            specialCategory: product.specialCategory || ''
        });
    };

    const handleSave = async (id) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...editForm,
                    price: parseInt(editForm.price)
                }),
            });

            if (res.ok) {
                const updated = await res.json();
                setProducts(prev => prev.map(p => p.id === id ? updated : p));
                setEditingId(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleAvailability = async (product) => {
        // Optimistic update
        const newVal = !product.available;
        setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: newVal } : p));

        try {
            await fetch('/api/admin/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: product.id, available: newVal }),
            });
        } catch (error) {
            // Revert on error
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, available: !newVal } : p));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Product Catalogue</h1>
                    <p className="text-[#8B4513]/60 mt-1">Manage availability, pricing, and tags</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                        <input
                            type="text"
                            placeholder="Search sweets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 transition-all w-64"
                        />
                    </div>
                    <button onClick={fetchProducts} className="p-2 hover:bg-[#630D16]/5 rounded-xl text-[#630D16] border border-[#D4AF37]/20 bg-white">
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <div
                        key={product.id}
                        className={`bg-white rounded-2xl border transition-all overflow-hidden group ${product.available
                                ? 'border-[#D4AF37]/20 shadow-sm hover:shadow-md'
                                : 'border-gray-200 opacity-75 bg-gray-50'
                            }`}
                    >
                        {/* Image & Status Area */}
                        <div className="relative h-48 bg-gray-100">
                            <img src={product.image} alt={product.name} className={`w-full h-full object-cover transition-opacity ${product.available ? '' : 'grayscale'}`} />

                            {/* Availability Toggle */}
                            <button
                                onClick={() => toggleAvailability(product)}
                                className={`absolute top-4 right-4 p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${product.available
                                        ? 'bg-green-100/90 text-green-700 hover:scale-110'
                                        : 'bg-red-100/90 text-red-700 hover:scale-110'
                                    }`}
                                title={product.available ? "Mark as Unavailable" : "Mark as Available"}
                            >
                                <Power className="w-4 h-4" />
                            </button>

                            {!product.available && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                    <span className="bg-white/90 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                        Unavailable
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-serif text-lg text-[#3D2B1F] font-bold">{product.name}</h3>
                                {editingId === product.id ? (
                                    <div className="flex items-center gap-1">
                                        <input
                                            type="number"
                                            value={editForm.price}
                                            onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                            className="w-16 px-1 py-0.5 text-right border border-[#D4AF37] rounded text-sm font-bold text-[#630D16]"
                                        />
                                    </div>
                                ) : (
                                    <span className="font-serif text-lg text-[#630D16]">₹{product.price}</span>
                                )}
                            </div>

                            <p className="text-xs text-[#8B4513]/60 line-clamp-2 mb-4 h-8">{product.description}</p>

                            {/* Tags Section */}
                            <div className="space-y-2">
                                {editingId === product.id ? (
                                    <div className="space-y-2 animate-in fade-in zoom-in duration-200">
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[#8B4513]/50">Special Category</label>
                                            <select
                                                value={editForm.specialCategory}
                                                onChange={(e) => setEditForm({ ...editForm, specialCategory: e.target.value })}
                                                className="w-full text-xs p-1.5 border border-[#D4AF37]/30 rounded bg-[#FDFCF0]"
                                            >
                                                <option value="">None</option>
                                                <option value="NMV_SPECIAL">NMV Special</option>
                                                <option value="FESTIVAL_FAVOURITE">Festival Favourite</option>
                                                <option value="CUSTOMER_FAVOURITE">Customer Favourite</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase font-bold text-[#8B4513]/50">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={editForm.tags}
                                                onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                                className="w-full text-xs p-1.5 border border-[#D4AF37]/30 rounded bg-[#FDFCF0]"
                                                placeholder="Pure Ghee, Spicy..."
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleSave(product.id)}
                                                disabled={isSaving}
                                                className="flex-1 bg-[#630D16] text-[#FDFCF0] py-1.5 rounded-lg text-xs font-bold hover:bg-[#4A0A10]"
                                            >
                                                {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 bg-gray-100 text-gray-600 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-wrap gap-1">
                                            {product.specialCategory && (
                                                <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#8B4513] text-[10px] font-bold uppercase rounded-full border border-[#D4AF37]/20">
                                                    {product.specialCategory.replace('_', ' ')}
                                                </span>
                                            )}
                                            {product.tags && product.tags.split(',').map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="w-full mt-2 py-1.5 border border-[#D4AF37]/20 rounded-lg text-xs font-bold text-[#630D16] hover:bg-[#630D16]/5 flex items-center justify-center gap-1 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                            Quick Edit
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
