'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader, Phone } from 'lucide-react';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signup } = useAuth();
    const router = useRouter();

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await signup(formData);
            router.push('/');
        } catch (err) {
            setError(err.message || 'Unable to create account. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF8F5] px-4 py-12">
            <div className="w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-2xl font-serif text-[#5D4037]">Nella Muthu Vilas</h1>
                    </Link>
                    <h2 className="mt-4 text-3xl font-light text-[#8B4513]">Join Our Family</h2>
                    <p className="mt-2 text-[#8B4513]/60">Experience the tradition of authentic sweets</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#E6D5C3] p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#5D4037] ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6D5C3] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] outline-none transition-all placeholder:text-[#8B4513]/20 text-[#5D4037]"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#5D4037] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6D5C3] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] outline-none transition-all placeholder:text-[#8B4513]/20 text-[#5D4037]"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#5D4037] ml-1">Phone Number (Optional)</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6D5C3] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] outline-none transition-all placeholder:text-[#8B4513]/20 text-[#5D4037]"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#5D4037] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B4513]/40 w-5 h-5" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E6D5C3] focus:border-[#D4A373] focus:ring-1 focus:ring-[#D4A373] outline-none transition-all placeholder:text-[#8B4513]/20 text-[#5D4037]"
                                    placeholder="••••••••"
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#D4A373] hover:bg-[#C39265] text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {isSubmitting ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-[#8B4513]/60">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#D4A373] hover:text-[#C39265] font-medium transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
