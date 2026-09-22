'use client';

import React from 'react';
import Link from 'next/link';
import { X, Home, ShoppingBag, History, MapPin, Phone, Info, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useBranch } from '@/contexts/BranchContext';

export const NavSidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const { selectedBranch } = useBranch();

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-[280px] bg-[#FDFCF0] z-50 shadow-2xl transition-transform duration-300 ease-in-out transform lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#630D16]">
                        <h2 className="font-serif text-xl text-[#FDFCF0]">NMV Heritage</h2>
                        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-[#FDFCF0]">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        <Link
                            href="/"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-[#3D2B1F] transition-colors"
                        >
                            <Home className="w-5 h-5 text-[#630D16]" />
                            <span className="font-medium font-sans">Home</span>
                        </Link>

                        <Link
                            href="/pre-order"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-[#3D2B1F] transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 text-[#630D16]" />
                            <div className="flex-1 flex items-center justify-between">
                                <span className="font-medium font-sans">Menu / Order</span>
                                {itemCount > 0 && (
                                    <span className="bg-[#630D16] text-[#FDFCF0] text-[10px] rounded-full px-2 py-0.5">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                        </Link>

                        <Link
                            href="/orders"
                            onClick={onClose}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#D4AF37]/10 text-[#3D2B1F] transition-colors"
                        >
                            <History className="w-5 h-5 text-[#630D16]" />
                            <span className="font-medium font-sans">My Orders</span>
                        </Link>

                        <div className="pt-4 mt-4 border-t border-[#D4AF37]/10">
                            <p className="px-4 text-[10px] uppercase tracking-widest text-[#8B4513]/50 font-bold mb-2">Our Presence</p>
                            <div className="px-4 py-3 bg-[#D4AF37]/5 rounded-xl">
                                <div className="flex items-center gap-3 text-sm text-[#3D2B1F] mb-1">
                                    <MapPin className="w-4 h-4 text-[#630D16]" />
                                    <span className="font-medium">{selectedBranch?.name || 'Vannarpettai'}</span>
                                </div>
                                <p className="text-xs text-[#8B4513]/70 ml-7">{selectedBranch?.area || 'Tirunelveli'}</p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 space-y-1">
                            <Link href="#" className="flex items-center gap-4 px-4 py-2 text-sm text-[#8B4513]/80 hover:text-[#630D16]">
                                <Phone className="w-4 h-4" />
                                <span>Contact Us</span>
                            </Link>
                            <Link href="#" className="flex items-center gap-4 px-4 py-2 text-sm text-[#8B4513]/80 hover:text-[#630D16]">
                                <Info className="w-4 h-4" />
                                <span>Origins & Legacy</span>
                            </Link>
                        </div>
                    </nav>

                    {/* Footer / User */}
                    <div className="p-6 bg-[#F9F7E8] border-t border-[#D4AF37]/20">
                        {user ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#630D16] flex items-center justify-center text-[#FDFCF0] font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#3D2B1F]">{user.name}</p>
                                        <p className="text-xs text-[#8B4513] opacity-60">Customer since 2024</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { logout(); onClose(); }}
                                    className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                onClick={onClose}
                                className="block w-full py-3 bg-[#630D16] text-[#FDFCF0] rounded-xl text-center font-bold shadow-lg shadow-[#630D16]/20"
                            >
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
