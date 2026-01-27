'use client';

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function FeedbackModal({ order, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    rating,
                    comment
                })
            });

            if (res.ok) {
                onSuccess();
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to submit feedback');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/20 transform animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-[#FDFCF0] flex justify-between items-center bg-[#630D16] text-[#FDFCF0]">
                    <div>
                        <h3 className="font-serif text-xl font-bold">Rate Your Tradition</h3>
                        <p className="text-[10px] uppercase tracking-widest opacity-70">Order #{order.publicOrderId}</p>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="text-center">
                        <p className="text-sm font-medium text-[#8B4513] mb-4">How was your experience at {order.branch?.name}?</p>
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    onMouseEnter={() => setHoverRating(s)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(s)}
                                    className="p-1 transition-transform active:scale-95"
                                >
                                    <Star
                                        className={`w-10 h-10 ${(hoverRating || rating) >= s
                                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                                : 'text-gray-200'
                                            } transition-colors`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-[#8B4513]/40 tracking-wider">Your Comments (Optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about the sweets, service, or pickup experience..."
                            className="w-full min-h-[120px] p-4 bg-[#FDFCF0]/30 border border-[#D4AF37]/20 rounded-xl focus:ring-2 focus:ring-[#630D16]/10 outline-none text-sm text-[#3D2B1F] placeholder:text-gray-400 transition-all resize-none"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-lg border border-red-100 animate-in shake-in">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 border-[#D4AF37]/20 text-[#8B4513]"
                        >
                            Skip for Now
                        </Button>
                        <Button
                            disabled={isSubmitting || rating === 0}
                            onClick={handleSubmit}
                            className="flex-1 bg-[#630D16] hover:bg-[#4A0A10] text-white font-bold"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
