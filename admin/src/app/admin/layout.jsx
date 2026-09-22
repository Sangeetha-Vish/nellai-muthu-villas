'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, ShoppingBag, Store, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && !loading) {
            const isAdmin = user && ['OWNER', 'BRANCH_MANAGER'].includes(user.role);
            if (!isAdmin) {
                if (pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
            } else if (pathname === '/admin/login') {
                router.push('/admin/dashboard');
            }
        }
    }, [user, loading, pathname, router, isMounted]);

    if (!isMounted || loading) {
        return (
            <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#630D16] animate-spin" />
            </div>
        );
    }

    // Don't show sidebar for login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isAdmin = user && ['OWNER', 'BRANCH_MANAGER'].includes(user.role);
    if (!isAdmin) {
        return null; // Will redirect via useEffect
    }

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
        { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
        { name: 'Products', icon: Store, href: '/admin/products' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#630D16] text-[#FDFCF0] hidden lg:flex flex-col fixed inset-y-0 shadow-2xl z-50">
                <div className="p-8 border-b border-[#FDFCF0]/10">
                    <h1 className="font-serif text-2xl tracking-wide">Back-Office</h1>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mt-1">Nella Muthu Vilas</p>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${pathname === item.href
                                    ? 'bg-[#FDFCF0] text-[#630D16] font-bold shadow-lg shadow-black/10'
                                    : 'hover:bg-white/10 text-[#FDFCF0]/80'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-sans">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-6 bg-black/10 border-t border-[#FDFCF0]/10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#630D16] font-bold border-2 border-[#FDFCF0]/20 flex-shrink-0">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-[10px] opacity-60 uppercase tracking-tighter truncate">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors border border-white/10"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-[#630D16] text-[#FDFCF0] px-6 flex items-center justify-between sticky top-0 z-40 shadow-md">
                    <h1 className="font-serif text-xl">NMV Back-Office</h1>
                    <button onClick={logout} className="p-2 hover:bg-white/10 rounded-lg">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>

                <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
