'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, Clock, Calendar } from 'lucide-react';
import { useBranch } from '@/contexts/BranchContext';
import { useCart } from '@/contexts/CartContext';

import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
    onBranchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBranchClick }) => {
    const { selectedBranch } = useBranch();
    const { itemCount, orderType, preOrderDate } = useCart();
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 bg-[#FDFCF0] border-b border-[#D4AF37] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo & Mode Indicator */}
                    <div className="flex items-center gap-4 md:gap-8">
                        <Link href="/" className="flex items-center">
                            <h1 className="font-serif text-2xl md:text-3xl text-[#630D16] tracking-wide">
                                Nella Muthu Vilas
                            </h1>
                        </Link>

                        {/* Mode Indicator (Desktop) */}
                        {orderType && (
                            <div className={`hidden lg:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${orderType === 'IMMEDIATE'
                                    ? 'bg-[#630D16]/10 text-[#630D16] border-[#630D16]/20'
                                    : 'bg-[#D4AF37]/10 text-[#8B4513] border-[#8B4513]/20'
                                }`}>
                                {orderType === 'IMMEDIATE' ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                {orderType === 'IMMEDIATE'
                                    ? "Ordering for Today"
                                    : `Pre-Order: ${new Date(preOrderDate!).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                                }
                            </div>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Branch Selector */}
                        <button
                            onClick={onBranchClick}
                            className="flex items-center gap-2 text-sm md:text-base text-[#630D16] hover:text-[#3D2B1F] transition-colors duration-300"
                        >
                            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="hidden sm:inline font-sans">
                                {selectedBranch ? selectedBranch.name : 'Select Branch'}
                            </span>
                        </button>

                        {/* Auth & Cart */}
                        <div className="flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className="hidden md:inline font-sans text-sm text-[#630D16]">
                                        {user.name}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="text-[#630D16] hover:text-[#3D2B1F]"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-sm font-sans text-[#630D16] hover:text-[#3D2B1F]"
                                >
                                    <User className="w-5 h-5" />
                                    <span className="hidden md:inline">Login</span>
                                </Link>
                            )}

                            <Link href="/pre-order" className="relative p-2 text-[#630D16] hover:text-[#3D2B1F] transition-colors duration-300">
                                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-[#630D16] text-[#FDFCF0] text-xs rounded-full w-5 h-5 flex items-center justify-center font-sans animate-in zoom-in duration-300">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
