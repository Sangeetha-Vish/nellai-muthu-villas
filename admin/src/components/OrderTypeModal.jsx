'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export const OrderTypeModal = ({ isOpen, onSelect, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#FDFCF0] w-full max-w-2xl rounded-lg shadow-2xl border border-[#D4AF37] overflow-hidden"
                >
                    <div className="p-8 text-center border-b border-[#D4AF37]/20 bg-[#FDFCF0]">
                        <h2 className="font-serif text-2xl md:text-3xl text-[#630D16] mb-2">
                            How would you like to place your order?
                        </h2>
                        <p className="font-sans text-[#8B4513]">
                            Please select an option to continue
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#D4AF37]/20">
                        {/* Immediate Order */}
                        <button
                            onClick={() => onSelect('IMMEDIATE')}
                            className="p-8 hover:bg-[#FFEBEB] transition-colors duration-300 text-left group flex flex-col h-full"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#630D16]/10 rounded-full text-[#630D16] group-hover:bg-[#630D16] group-hover:text-[#FDFCF0] transition-colors bg-white shadow-sm">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-xl text-[#3D2B1F]">Immediate Order</h3>
                            </div>
                            <p className="font-sans text-[#5D4037] mb-6 flex-grow">
                                Order now and collect today. Ideal for quick cravings and same-day pickup.
                            </p>
                            <span className="inline-block text-[#630D16] font-medium border-b border-[#630D16] pb-0.5 group-hover:border-transparent transition-all">
                                Select Immediate Order &rarr;
                            </span>
                        </button>

                        {/* Pre-Order */}
                        <button
                            onClick={() => onSelect('PRE_ORDER')}
                            className="p-8 hover:bg-[#FDF6D9] transition-colors duration-300 text-left group flex flex-col h-full"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#D4AF37]/20 rounded-full text-[#8B4513] group-hover:bg-[#D4AF37] group-hover:text-[#FDFCF0] transition-colors bg-white shadow-sm">
                                    <Calendar className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif text-xl text-[#3D2B1F]">Pre-Order (Bulk)</h3>
                            </div>
                            <p className="font-sans text-[#5D4037] mb-6 flex-grow">
                                Planning for a festival or function? Book in advance for bulk preparation.
                            </p>
                            <span className="inline-block text-[#8B4513] font-medium border-b border-[#8B4513] pb-0.5 group-hover:border-transparent transition-all">
                                Select Pre-Order &rarr;
                            </span>
                        </button>
                    </div>

                    <div className="bg-[#F9F7E8] p-4 text-center border-t border-[#D4AF37]/10">
                        <button onClick={onClose} className="text-sm text-[#8B4513] hover:text-[#630D16] hover:underline transition-colors">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
