'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, PartyPopper, Users, Gift } from 'lucide-react';
import { useBranch } from '@/contexts/BranchContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from './ui/Button';

export const PreOrderSetupModal = ({ isOpen, onClose, onComplete }) => {
    const { branches, selectedBranch, setBranch } = useBranch();
    const { setPreOrderDate, setPreOrderOccasion, setOrderType } = useCart();

    const [date, setDate] = useState('');
    const [occasion, setOccasion] = useState('PERSONAL');
    const [error, setError] = useState(null);

    // Date Restrictions
    const getMinDate = () => {
        const today = new Date();
        today.setDate(today.getDate() + 1); // Tomorrow
        return today.toISOString().split('T')[0];
    };
    const getMaxDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 60); // 2 months ahead
        return d.toISOString().split('T')[0]; // Max future date
    };

    const handleConfirm = () => {
        if (!date) {
            setError("Please select a date for your order.");
            return;
        }
        if (!selectedBranch) {
            setError("Please select a pickup branch.");
            return;
        }

        setPreOrderDate(date);
        setPreOrderOccasion(occasion);
        setOrderType('PRE_ORDER');
        onComplete();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#FDFCF0] w-full max-w-lg rounded-lg shadow-2xl border border-[#D4AF37] overflow-hidden"
                >
                    <div className="p-6 bg-[#630D16] text-[#FDFCF0] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/pattern.png')]"></div>
                        <Calendar className="w-10 h-10 mx-auto mb-3 text-[#D4AF37]" />
                        <h2 className="font-serif text-2xl font-medium tracking-wide">Plan Your Order</h2>
                        <p className="font-sans text-sm opacity-80 mt-1">Select details for your upcoming occasion</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* 1. Occasion Type */}
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-3 uppercase tracking-wider">Occasion Type</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'PERSONAL', icon: Gift, label: 'Personal' },
                                    { id: 'FUNCTION', icon: Users, label: 'Function' },
                                    { id: 'FESTIVAL', icon: PartyPopper, label: 'Festival' }
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setOccasion(type.id)}
                                        className={`p-3 rounded-md border flex flex-col items-center gap-2 transition-all duration-200 ${occasion === type.id
                                            ? 'bg-[#630D16] text-[#FDFCF0] border-[#630D16] shadow-md'
                                            : 'bg-white text-[#3D2B1F] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                                            }`}
                                    >
                                        <type.icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{type.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-2 uppercase tracking-wider">Required Date</label>
                            <input
                                type="date"
                                min={getMinDate()}
                                max={getMaxDate()}
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                    setError(null);
                                }}
                                className="w-full p-3 bg-white border border-[#D4AF37]/40 rounded-md text-[#3D2B1F] focus:border-[#630D16] focus:ring-1 focus:ring-[#630D16] outline-none transition-colors"
                            />
                            <p className="text-xs text-[#8B4513] mt-2 opacity-70 italic">
                                * Minimum 1 day notice required for bulk preparation.
                            </p>
                        </div>

                        {/* 3. Branch Selection */}
                        <div>
                            <label className="block text-sm font-medium text-[#8B4513] mb-2 uppercase tracking-wider">Pickup Branch</label>
                            <div className="space-y-2">
                                {branches.map((branch) => (
                                    <button
                                        key={branch.id}
                                        onClick={() => {
                                            setBranch(branch);
                                            setError(null);
                                        }}
                                        className={`w-full p-3 flex items-start text-left gap-3 rounded-md border transition-all ${selectedBranch?.id === branch.id
                                            ? 'bg-[#F9F7E8] border-[#630D16] ring-1 ring-[#630D16]/20'
                                            : 'bg-white border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                                            }`}
                                    >
                                        <MapPin className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selectedBranch?.id === branch.id ? 'text-[#630D16]' : 'text-[#D4AF37]'
                                            }`} />
                                        <div>
                                            <div className="font-medium text-[#3D2B1F]">{branch.name}</div>
                                            <div className="text-xs text-[#8B4513] opacity-80">{branch.area}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-[#F9F7E8] border-t border-[#D4AF37]/20 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-[#8B4513] hover:text-[#630D16] font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <Button onClick={handleConfirm} className="shadow-lg shadow-[#630D16]/20">
                            Start Booking
                        </Button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
