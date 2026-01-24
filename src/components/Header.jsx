import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, MapPin, Clock, Calendar, User, LogOut, Menu, Home, ClipboardList } from 'lucide-react';
import { useBranch } from '@/contexts/BranchContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { NavSidebar } from './NavSidebar';

export const Header = ({ onBranchClick }) => {
    const { selectedBranch } = useBranch();
    const { itemCount, orderType, preOrderDate } = useCart();
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#FDFCF0] border-b border-[#D4AF37] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Mobile Menu & Logo */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 -ml-2 text-[#630D16] hover:bg-[#630D16]/5 rounded-lg transition-colors"
                            >
                                <Menu className="w-6 h-6" />
                            </button>
                            <Link href="/" className="flex items-center">
                                <h1 className="font-serif text-xl md:text-2xl lg:text-3xl text-[#630D16] tracking-wide whitespace-nowrap">
                                    Nella Muthu Vilas
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-[#8B4513] hover:text-[#630D16] transition-colors">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <Link href="/pre-order" className="flex items-center gap-2 text-sm font-medium text-[#8B4513] hover:text-[#630D16] transition-colors">
                                <ShoppingBag className="w-4 h-4" />
                                Menu
                            </Link>
                            {orderType && (
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${orderType === 'IMMEDIATE'
                                    ? 'bg-[#630D16]/10 text-[#630D16] border-[#630D16]/20'
                                    : 'bg-[#D4AF37]/10 text-[#8B4513] border-[#8B4513]/20'
                                    }`}>
                                    {orderType === 'IMMEDIATE' ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                    {orderType === 'IMMEDIATE'
                                        ? "Today"
                                        : `${new Date(preOrderDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                                    }
                                </div>
                            )}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
                            {/* Branch Selector (Desktop/Tablet) */}
                            <button
                                onClick={onBranchClick}
                                className="hidden sm:flex items-center gap-2 text-sm text-[#630D16] hover:text-[#3D2B1F] bg-[#D4AF37]/5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 transition-all duration-300"
                            >
                                <MapPin className="w-4 h-4" />
                                <span className="font-sans font-medium">
                                    {selectedBranch ? selectedBranch.name : 'Select Branch'}
                                </span>
                            </button>

                            {/* Order History (Replacing "My Order") */}
                            <Link
                                href="/orders"
                                className="flex items-center gap-2 text-sm font-medium text-[#630D16] hover:text-[#3D2B1F] py-2 px-3 rounded-lg hover:bg-[#630D16]/5 transition-all group"
                            >
                                <ClipboardList className="w-5 h-5" />
                                <span className="hidden md:inline font-sans">Order History</span>
                            </Link>

                            {/* Cart Icon (Dedicated) */}
                            <Link
                                href="/cart"
                                className="relative p-2 text-[#630D16] hover:bg-[#630D16]/5 rounded-lg transition-colors duration-300"
                                aria-label="View Cart"
                            >
                                <ShoppingBag className="w-6 h-6" />
                                {itemCount > 0 && (
                                    <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-[#630D16] text-[#FDFCF0] text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-sans font-bold shadow-sm border border-[#FDFCF0]">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Auth Section */}
                            <div className="flex items-center gap-2 md:gap-4 pl-2 border-l border-[#D4AF37]/30">
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        {['OWNER', 'BRANCH_MANAGER'].includes(user.role) && (
                                            <Link
                                                href="/admin/dashboard"
                                                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#630D16] text-[#FDFCF0] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#4A0A10] transition-colors shadow-sm"
                                            >
                                                Back-Office
                                            </Link>
                                        )}
                                        <div className="flex items-center gap-2 font-sans text-sm text-[#630D16] group cursor-default">
                                            <div className="w-8 h-8 rounded-full bg-[#630D16]/10 flex items-center justify-center transition-colors">
                                                <User className="w-4 h-4 text-[#630D16]" />
                                            </div>
                                            <span className="font-medium hidden sm:inline">{user.name}</span>
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="p-2 text-[#630D16] hover:bg-red-50 rounded-lg transition-colors"
                                            title="Logout"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="flex items-center gap-2 text-sm font-sans font-medium text-[#630D16] hover:text-[#3D2B1F]"
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="hidden sm:inline">Login</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <NavSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};
