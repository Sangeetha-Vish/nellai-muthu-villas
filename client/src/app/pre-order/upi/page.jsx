'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/Button';

export default function UPIPage() {
    const router = useRouter();
    const { clearCart } = useCart();
    const { addOrder } = useOrders();
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handlePaid = async () => {
        setIsProcessing(true);
        // Retrieve deferred payload
        const payloadStr = sessionStorage.getItem('pending_order_payload');

        if (!payloadStr) {
            alert("No pending order found. redirecting to cart.");
            router.push('/pre-order');
            return;
        }

        try {
            const payload = JSON.parse(payloadStr);

            // Create Order locally
            addOrder(payload);

            // Clear state
            sessionStorage.removeItem('pending_order_payload');

            // Clear Cart
            clearCart();

            // Redirect to success page
            router.push('/order-success');
        } catch (error) {
            console.error(error);
            alert("An error occurred while finishing your order.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCF0]">
            <Header onBranchClick={() => { }} />

            <main className="max-w-md mx-auto px-4 py-8 md:py-12 text-center">
                <BackButton />

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D4AF37]/30 mt-8">
                    <h1 className="font-serif text-2xl text-[#630D16] mb-2">Pay via UPI</h1>
                    <p className="text-[#8B4513] text-sm mb-6">Scan to complete your order</p>

                    {/* Dummy QR Code */}
                    <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg border-2 border-dashed border-[#D4AF37] flex items-center justify-center mb-6 relative overflow-hidden">
                        {/* Placeholder pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
                        <span className="text-xs text-gray-400 font-mono">DUMMY QR CODE</span>
                    </div>

                    <div className="bg-[#F9F7E8] p-4 rounded-lg mb-6 text-left">
                        <p className="text-xs text-[#8B4513] uppercase font-bold mb-1">UPI ID</p>
                        <p className="text-[#3D2B1F] font-mono select-all">nellai@upi</p>
                    </div>

                    <p className="text-sm text-[#8B4513] mb-8 italic">
                        Please show this screen or the payment confirmation message at the counter.
                    </p>

                    <Button
                        onClick={handlePaid}
                        disabled={isProcessing}
                        className="w-full py-4 text-lg shadow-xl shadow-[#630D16]/20 disabled:opacity-50"
                    >
                        {isProcessing ? 'Verifying...' : 'I Have Paid'}
                        {!isProcessing && <CheckCircle2 className="w-5 h-5 ml-2" />}
                    </Button>
                </div>
            </main>
        </div>
    );
}
