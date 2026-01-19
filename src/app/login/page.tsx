'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isRegister ? 'register' : 'login',
                    email,
                    password,
                    name: isRegister ? name : undefined,
                    phone: isRegister ? phone : undefined
                }),
            });

            const data = await res.json();

            if (data.success) {
                // Redirect back to checkout or home
                // Ideally we check a "callbackUrl" param, but for now default to pre-order checkout
                router.push('/pre-order/checkout');
                router.refresh();
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/">
                    <h2 className="text-center font-serif text-3xl font-bold text-[#630D16]">
                        Nella Muthu Vilas
                    </h2>
                </Link>
                <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-[#3D2B1F]">
                    {isRegister ? 'Create an account' : 'Sign in to continue'}
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-[#D4AF37]/30">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {isRegister && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-[#3D2B1F]">Full Name</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#630D16] focus:ring-[#630D16] sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#3D2B1F]">Phone Number</label>
                                    <div className="mt-1">
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#630D16] focus:ring-[#630D16] sm:text-sm p-2 border"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#3D2B1F]">Email address</label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#630D16] focus:ring-[#630D16] sm:text-sm p-2 border"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#3D2B1F]">Password</label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#630D16] focus:ring-[#630D16] sm:text-sm p-2 border"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4"
                            >
                                {loading ? 'Processing...' : (isRegister ? 'Register' : 'Sign in')}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white px-2 text-gray-500">Or</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setIsRegister(!isRegister)}
                                className="text-sm font-medium text-[#630D16] hover:text-[#4A0A10]"
                            >
                                {isRegister ? 'Already have an account? Sign in' : 'New here? Create an account'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
