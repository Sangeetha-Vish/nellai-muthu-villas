'use client';

import React, { useEffect, useState } from 'react';
import { Store, Search, Edit2, Tag, Power, AlertCircle, RefreshCw, Save, Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Add Item State
    const [isAdding, setIsAdding] = useState(false);
    const [addForm, setAddForm] = useState({
        name: '',
        description: '',
        price: '',
        image: '/images/mysore-pak.jpg', // Default or placeholder
        weight: '500g',
        tradition: '',
        available: true,
        specialCategory: '',
        tags: ''
    });
    const [isCreating, setIsCreating] = useState(false);

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

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...addForm,
                    price: parseInt(addForm.price)
                }),
            });

            if (res.ok) {
                const newProduct = await res.json();
                setProducts([newProduct, ...products]);
                setIsAdding(false);
                setAddForm({
                    name: '',
                    description: '',
                    price: '',
                    image: '/images/mysore-pak.jpg',
                    weight: '500g',
                    tradition: '',
                    available: true,
                    specialCategory: '',
                    tags: ''
                });
                // Optional: Show success toast
            } else {
                const err = await res.json();
                alert(`Error: ${err.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to create product');
        } finally {
            setIsCreating(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-3xl text-[#3D2B1F]">Product Catalogue</h1>
                    <p className="text-[#8B4513]/60 mt-1">Manage availability, pricing, and tags</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 bg-[#630D16] text-[#FDFCF0] px-4 py-2 rounded-xl font-bold hover:bg-[#4A0A10] transition-colors shadow-lg shadow-[#630D16]/20"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </button>

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
                        className={`bg-white rounded-2xl border transition-all overflow-hidden group flex flex-col ${product.available
                            ? 'border-[#D4AF37]/20 shadow-sm hover:shadow-md'
                            : 'border-gray-200 opacity-75 bg-gray-50'
                            }`}
                    >
                        {/* Image Area */}
                        <div className="relative h-48 bg-gray-100">
                            <img
                                src={product.image || '/images/placeholder.jpg'}
                                onError={(e) => { e.target.src = '/images/placeholder.jpg' }}
                                alt={product.name}
                                className={`w-full h-full object-cover transition-opacity ${product.available ? '' : 'grayscale'}`}
                            />
                            {!product.available && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                                    <span className="bg-white/90 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                                        Unavailable
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex-1 flex flex-col">
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
                            <div className="flex-1 space-y-2">
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
                                    <div className="flex flex-col gap-2 h-full">
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

                                        <div className="mt-auto pt-4 flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="flex-1 py-2 border border-[#D4AF37]/20 rounded-xl text-xs font-bold text-[#630D16] hover:bg-[#630D16]/5 flex items-center justify-center gap-1 transition-colors"
                                            >
                                                <Edit2 className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm(`Are you sure you want to ${product.available ? 'DISABLE' : 'ENABLE'} this item?`)) {
                                                        toggleAvailability(product);
                                                    }
                                                }}
                                                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors ${product.available
                                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                                    }`}
                                            >
                                                <Power className="w-3 h-3" />
                                                {product.available ? 'Disable' : 'Enable'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Item Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-[#FDFCF0] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#630D16] px-6 py-4 flex items-center justify-between">
                            <h2 className="text-[#FDFCF0] font-serif text-xl">Add New Item</h2>
                            <button onClick={() => setIsAdding(false)} className="text-[#FDFCF0]/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={addForm.name}
                                        onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                                        className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 font-serif text-[#3D2B1F]"
                                        placeholder="e.g. Mysore Pak"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Price (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={addForm.price}
                                            onChange={e => setAddForm({ ...addForm, price: e.target.value })}
                                            className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 text-[#630D16] font-bold"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Weight/Qty</label>
                                        <input
                                            required
                                            type="text"
                                            value={addForm.weight}
                                            onChange={e => setAddForm({ ...addForm, weight: e.target.value })}
                                            className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20"
                                            placeholder="e.g. 500g"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={addForm.description}
                                        onChange={e => setAddForm({ ...addForm, description: e.target.value })}
                                        className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 resize-none"
                                        placeholder="Describe the taste and texture..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1 flex items-center gap-2">
                                        Image URL
                                        <span className="text-[10px] font-normal normal-case opacity-60">(Use local path or URL)</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                                            <input
                                                required
                                                type="text"
                                                value={addForm.image}
                                                onChange={e => setAddForm({ ...addForm, image: e.target.value })}
                                                className="w-full pl-10 pr-4 py-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 text-xs"
                                                placeholder="/images/..."
                                            />
                                        </div>
                                    </div>
                                    {/* Image Preview */}
                                    {addForm.image && (
                                        <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={addForm.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = '/images/placeholder.svg'; e.target.style.opacity = 0.5; }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Tradition/Story</label>
                                    <input
                                        type="text"
                                        value={addForm.tradition}
                                        onChange={e => setAddForm({ ...addForm, tradition: e.target.value })}
                                        className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 text-sm"
                                        placeholder="e.g. Prepared using the authentic recipe..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Special Category</label>
                                        <select
                                            value={addForm.specialCategory}
                                            onChange={e => setAddForm({ ...addForm, specialCategory: e.target.value })}
                                            className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 text-sm"
                                        >
                                            <option value="">None</option>
                                            <option value="NMV_SPECIAL">NMV Special</option>
                                            <option value="FESTIVAL_FAVOURITE">Festival Favourite</option>
                                            <option value="CUSTOMER_FAVOURITE">Customer Favourite</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-[#8B4513]/60 mb-1">Tags (Comma sep.)</label>
                                        <input
                                            type="text"
                                            value={addForm.tags}
                                            onChange={e => setAddForm({ ...addForm, tags: e.target.value })}
                                            className="w-full p-2.5 border border-[#D4AF37]/30 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#630D16]/20 text-sm"
                                            placeholder="Pure Ghee, Sweet"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-3 bg-[#630D16] text-[#FDFCF0] font-bold rounded-xl hover:bg-[#4A0A10] transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5" />
                                            Create Item
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
