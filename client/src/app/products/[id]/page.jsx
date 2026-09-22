'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { Button } from '@/components/ui/Button';
import { Clock } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { apiFetch } from '@/services/api';

export default function ProductDetailsPage() {
    const params = useParams();
    const { addToCart, orderType } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('/api/products')
            .then(res => res.json())
            .then(data => {
                const found = data.find((p) => p.id === params.id);
                setProduct(found);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [params.id]);

    const handleAdd = () => {
        if (product) {
            addToCart({
                productId: product.id,
                name: product.name,
                price: product.price,
                weight: product.weight,
                image: product.image,
                quantity: 1,
            });
            alert('Added to cart!');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#630D16]">Loading sweet details...</div>;
    if (!product) return <div className="min-h-screen flex items-center justify-center text-red-600">Product not found</div>;

    return (
        <div className="min-h-screen bg-[#FDFCF0] pb-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <BackButton />

                <div className="mt-8 grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Section */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/20 bg-white">
                            <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="object-cover w-full h-full"
                            />
                        {product.specialCategory === 'NMV_SPECIAL' && (
                            <div className="absolute top-4 left-4 bg-[#630D16] text-[#FDFCF0] px-4 py-1 text-sm font-serif tracking-wider rounded-full shadow-lg">
                                Signature Selection
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="font-serif text-4xl md:text-5xl text-[#630D16] mb-4">{product.name}</h1>
                            <p className="font-sans text-lg text-[#8B4513] opacity-80 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex gap-4 items-center">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 text-[#8B4513] rounded-full text-sm font-medium">
                                <Clock className="w-4 h-4" /> Prepared Fresh
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 text-[#8B4513] rounded-full text-sm font-medium">
                                {product.weight} Pack
                            </span>
                        </div>

                        <div className="border-t border-b border-[#D4AF37]/20 py-6">
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-serif text-[#630D16]">₹{product.price}</span>
                                <span className="text-sm text-[#8B4513] mb-1 opacity-70">/ {product.weight}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button onClick={handleAdd} className="flex-1 py-4 text-lg shadow-xl shadow-[#630D16]/20 bg-[#630D16] hover:bg-[#4A0A10]">
                                {orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                            </Button>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-[#D4AF37]/20 shadow-sm">
                            <h3 className="font-serif text-lg text-[#3D2B1F] mb-2">Tradition & Quality</h3>
                            <p className="text-sm text-[#8B4513] opacity-70">
                                Prepared using {product.tradition || 'traditional'} methods. We use only premium ingredients like pure ghee and farm-fresh milk.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
