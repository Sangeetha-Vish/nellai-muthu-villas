'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { checkSession } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // We use a specific admin login API for role enforcement
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Sync the AuthContext state with the new session
            await checkSession();

            router.push('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <h1 className="font-serif text-3xl text-[#630D16] mb-2 tracking-wide">
                        Nella Muthu Vilas
                    </h1>
                    <p className="text-[#8B4513]/60 font-sans uppercase tracking-[0.2em] text-xs font-bold">
                        Digital Back-Office
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-[#630D16]/5 border border-[#D4AF37]/20 p-8 md:p-10">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-[#FDFCF0] rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-[#630D16]" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif text-[#3D2B1F] text-center mb-8">Admin Access</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-1.5 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-[#D4AF37]/30 rounded-xl leading-5 bg-[#FDFCF0]/50 text-[#3D2B1F] placeholder-[#8B4513]/30 focus:outline-none focus:ring-2 focus:ring-[#630D16]/10 focus:border-[#630D16] transition-all"
                                    placeholder="admin@nmv.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-1.5 ml-1">
                                PIN / Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#D4AF37]" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-[#D4AF37]/30 rounded-xl leading-5 bg-[#FDFCF0]/50 text-[#3D2B1F] placeholder-[#8B4513]/30 focus:outline-none focus:ring-2 focus:ring-[#630D16]/10 focus:border-[#630D16] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm animate-in fade-in zoom-in duration-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#630D16]/10 text-base font-bold text-white bg-[#630D16] hover:bg-[#4A0A10] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#630D16] disabled:opacity-50 transition-all active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Enter Back-Office'}
                            {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-[#D4AF37]/10 text-center">
                        <Link href="/" className="text-sm text-[#8B4513] hover:text-[#630D16] transition-colors">
                            Return to Customer Shop
                        </Link>
                    </div>
                </div>

                <p className="mt-8 text-center text-[#8B4513]/40 text-xs font-sans uppercase tracking-widest">
                    Heritage Integrity System v1.0
                </p>
            </div>
        </div>
    );
}
