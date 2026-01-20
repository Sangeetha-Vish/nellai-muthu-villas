'use client';

import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ui/Card';
import { BranchSelector } from '@/components/BranchSelector';
import { OrderTypeModal } from '@/components/OrderTypeModal';
import { ModeSelectionHero } from '@/components/ModeSelectionHero';
import { PreOrderSetupModal } from '@/components/PreOrderSetupModal';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const [showWelcome, setShowWelcome] = useState(false);
    const [showBranchSelector, setShowBranchSelector] = useState(false);
    const [showPreOrderSetup, setShowPreOrderSetup] = useState(false);

    useEffect(() => {
        // Only show welcome if not seen in this session
        const seen = sessionStorage.getItem('welcome_seen');
        if (!seen) {
            setShowWelcome(true);
        }
    }, []);

    const handleWelcomeComplete = () => {
        sessionStorage.setItem('welcome_seen', 'true');
        setShowWelcome(false);
    };

    // Order Type Modal Logic (Fallback)
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
    const [pendingProduct, setPendingProduct] = useState(null);

    const { addToCart, orderType, setOrderType, preOrderDate } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!showWelcome) {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    setProducts(data);
                    setLoading(false);
                });
        }
    }, [showWelcome]);

    // Scroll to products when mode selected
    const scrollToProducts = () => {
        const el = document.getElementById('product-sections');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const handleModeSelection = (mode) => {
        if (mode === 'IMMEDIATE') {
            setOrderType('IMMEDIATE');
            scrollToProducts();
        } else {
            setShowPreOrderSetup(true);
        }
    };

    const handlePreOrderSetupComplete = () => {
        setShowPreOrderSetup(false);
        scrollToProducts();
    };

    const handleAddToCartRequest = (product) => {
        if (!user) {
            router.push('/login');
            return;
        }

        // Strict Mode Enforcement: If no mode, scroll up to Hero or open Modal
        if (!orderType) {
            setPendingProduct(product);
            setShowOrderTypeModal(true); // Fallback if they scrolled down without choosing
            return;
        }

        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            weight: product.weight,
            image: product.image,
            quantity: 1,
        });
        alert(`${product.name} added to your ${orderType === 'IMMEDIATE' ? 'Immediate Order' : 'Pre-Order Box'}!`);
    };

    const handleOrderTypeSelect = (type) => {
        // Wrapper to handle fallback modal selection
        if (type === 'PRE_ORDER') {
            setShowOrderTypeModal(false);
            setShowPreOrderSetup(true); // Must redirect to setup if chosen here
        } else {
            setOrderType('IMMEDIATE');
            setShowOrderTypeModal(false);
            if (pendingProduct) {
                handleAddToCartRequest(pendingProduct);
                // Calling addToCart directly for safety:
                addToCart({
                    productId: pendingProduct.id,
                    name: pendingProduct.name,
                    price: pendingProduct.price,
                    weight: pendingProduct.weight,
                    image: pendingProduct.image,
                    quantity: 1,
                });
                setPendingProduct(null);
                alert(`${pendingProduct.name} added!`);
            }
        }
    };

    const getSection = (category) => products.filter(p => p.specialCategory === category);

    return (
        <>
            {showWelcome && (
                <WelcomeScreen onComplete={handleWelcomeComplete} />
            )}

            {!showWelcome && (
                <div className="min-h-screen bg-pattern-traditional relative pb-20">
                    <div className="watermark">Nella Muthu Vilas</div>

                    <Header onBranchClick={() => setShowBranchSelector(true)} />

                    {/* New Hero Section */}
                    <ModeSelectionHero
                        onSelectImmediate={() => handleModeSelection('IMMEDIATE')}
                        onSelectPreOrder={() => handleModeSelection('PRE_ORDER')}
                    />

                    {/* Active Mode Indicator Banner (Optional but helpful) */}
                    {orderType && (
                        <div className="sticky top-[72px] md:top-[80px] z-30 bg-[#FDFCF0]/95 backdrop-blur-sm border-y border-[#D4AF37]/30 py-3 shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 text-center flex items-center justify-center gap-3">
                                <span className={`inline-block w-2 h-2 rounded-full ${orderType === 'IMMEDIATE' ? 'bg-[#630D16]' : 'bg-[#D4AF37]'}`}></span>
                                <p className="font-sans text-[#630D16] text-sm md:text-base">
                                    {orderType === 'IMMEDIATE'
                                        ? <span>Ordering for <strong>Immediate Pickup (Today)</strong></span>
                                        : <span>Pre-ordering for <strong>{new Date(preOrderDate).toLocaleDateString()}</strong></span>
                                    }
                                </p>
                                <button
                                    onClick={() => { setOrderType(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="text-xs underline text-[#8B4513] ml-2"
                                >
                                    Change Mode
                                </button>
                            </div>
                        </div>
                    )}

                    <div id="product-sections" className="pt-8">
                        {loading ? (
                            <div className="text-center py-20 text-[#630D16]">Loading our specialties...</div>
                        ) : (
                            <div className={`space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-500 ${!orderType ? 'opacity-50 pointer-events-none filter blur-[1px]' : 'opacity-100'}`}>
                                {/* Visual Hint if mode not selected */}
                                {!orderType && (
                                    <div className="absolute inset-0 z-10 flex items-start justify-center pt-20">
                                        <div className="bg-[#630D16] text-[#FDFCF0] px-6 py-3 rounded-full shadow-xl font-bold animate-bounce">
                                            Please Select a Mode Above to Browse
                                        </div>
                                    </div>
                                )}

                                {/* 1. NMV Special */}
                                <ProductSection
                                    title="Nella Muthu Vilas Special"
                                    subtitle="Signature sweets of the brand"
                                    products={getSection('NMV_SPECIAL')}
                                    onAdd={handleAddToCartRequest}
                                    buttonLabel={orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                                />

                                {/* 2. Top Picks */}
                                <ProductSection
                                    title="Top Picks"
                                    subtitle="Most ordered sweets loved by everyone"
                                    products={getSection('TOP_PICKS')}
                                    onAdd={handleAddToCartRequest}
                                    buttonLabel={orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                                />

                                {/* 3. Festival Favourite */}
                                <ProductSection
                                    title="Festival Favourite"
                                    subtitle="Seasonal delights for your celebrations"
                                    products={getSection('FESTIVAL_FAVOURITE')}
                                    onAdd={handleAddToCartRequest}
                                    buttonLabel={orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                                />

                                {/* 4. Customer Favourite */}
                                <ProductSection
                                    title="Customer Favourite"
                                    subtitle="Highly rated and loved by our community"
                                    products={getSection('CUSTOMER_FAVOURITE')}
                                    onAdd={handleAddToCartRequest}
                                    buttonLabel={orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                                />

                                {/* 5. All-Time Classics */}
                                <ProductSection
                                    title="All-Time Classics"
                                    subtitle="Traditional recipes that never go out of style"
                                    products={getSection('ALL_TIME_CLASSICS')}
                                    onAdd={handleAddToCartRequest}
                                    isGrid
                                    buttonLabel={orderType === 'IMMEDIATE' ? 'Order Now' : 'Add to Box'}
                                />
                            </div>
                        )}
                    </div>

                    <BranchSelector
                        isOpen={showBranchSelector}
                        onClose={() => setShowBranchSelector(false)}
                    />

                    <OrderTypeModal
                        isOpen={showOrderTypeModal}
                        onSelect={handleOrderTypeSelect}
                        onClose={() => setShowOrderTypeModal(false)}
                    />

                    <PreOrderSetupModal
                        isOpen={showPreOrderSetup}
                        onClose={() => setShowPreOrderSetup(false)}
                        onComplete={handlePreOrderSetupComplete}
                    />
                </div>
            )}
        </>
    );
}

// Sub-component for Sections
const ProductSection = ({ title, subtitle, products, onAdd, isGrid = false, buttonLabel }) => {
    if (!products || products.length === 0) return null;
    return (
        <section>
            <div className="mb-6">
                <h2 className="font-serif text-2xl md:text-3xl text-[#630D16]">{title}</h2>
                <p className="font-sans text-[#8B4513] opacity-80 mt-1">{subtitle}</p>
            </div>
            <div className={`grid gap-6 ${isGrid ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {products.map((product) => (
                    <Link href={`/products/${product.id}`} key={product.id} className="block h-full hover:no-underline">
                        <ProductCard
                            name={product.name}
                            description={product.description}
                            image={product.image}
                            price={product.price}
                            weight={product.weight}
                            tradition={product.tradition}
                            available={product.available}
                            tags={product.tags ? product.tags.split(',') : []}
                            buttonLabel={buttonLabel}
                            onAddToBox={() => onAdd(product)}
                        />
                    </Link>
                ))}
            </div>
            <div className="mt-8 border-b border-[#D4AF37]/20"></div>
        </section>
    );
};
