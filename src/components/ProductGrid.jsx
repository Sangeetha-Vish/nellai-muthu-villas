'use client';

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ui/Card';
import Link from 'next/link';

export const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-[#630D16] font-sans">Loading our sweets...</div>
            </div>
        );
    }

    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="font-serif text-3xl md:text-4xl text-[#630D16] text-center mb-12">
                    Our Traditional Sweets
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.map((product) => (
                        <Link href={`/products/${product.id}`} key={product.id} className="block h-full">
                            <ProductCard
                                name={product.name}
                                description={product.description}
                                image={product.image}
                                price={product.price}
                                weight={product.weight}
                                tradition={product.tradition || undefined}
                                available={product.available}
                                onAddToBox={() => { }} // Placeholder as it's handled in Detail or could be added here
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
