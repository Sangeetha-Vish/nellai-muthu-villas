'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight } from 'lucide-react';

interface ModeSelectionHeroProps {
    onSelectImmediate: () => void;
    onSelectPreOrder: () => void;
}

export const ModeSelectionHero: React.FC<ModeSelectionHeroProps> = ({ onSelectImmediate, onSelectPreOrder }) => {
    return (
        <div className="relative py-12 md:py-20 px-4">
            <div className="max-w-6xl mx-auto text-center mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-3xl md:text-5xl text-[#630D16] mb-4"
                >
                    One Shop. Two Intentions.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-sans text-[#8B4513] text-lg max-w-2xl mx-auto"
                >
                    Experience the taste of Tirunelveli. Order fresh for now, or plan ahead for your celebrations.
                </motion.p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 md:gap-12">
                {/* Immediate Order Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={onSelectImmediate}
                    className="group cursor-pointer relative bg-white rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#630D16] to-[#D4AF37]"></div>
                    <div className="p-8 md:p-10 flex flex-col h-full items-center text-center">
                        <div className="w-16 h-16 bg-[#630D16]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#630D16] transition-colors duration-500">
                            <Clock className="w-8 h-8 text-[#630D16] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#3D2B1F] mb-3 group-hover:text-[#630D16] transition-colors">Immediate Order</h3>
                        <p className="font-sans text-[#8B4513] opacity-80 mb-8 flex-grow">
                            "Order Now · Pay · Collect"
                            <br />
                            <span className="text-sm mt-2 block">Freshly prepared for today’s pickup.</span>
                        </p>
                        <span className="inline-flex items-center gap-2 text-[#630D16] font-bold uppercase tracking-wider text-sm border-b-2 border-[#630D16]/20 pb-1 group-hover:border-[#630D16] transition-all">
                            Order for Today <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </motion.div>

                {/* Pre-Order Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={onSelectPreOrder}
                    className="group cursor-pointer relative bg-white rounded-xl shadow-lg border border-[#D4AF37]/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#8B4513]"></div>
                    <div className="p-8 md:p-10 flex flex-col h-full items-center text-center">
                        <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4AF37] transition-colors duration-500">
                            <Calendar className="w-8 h-8 text-[#8B4513] group-hover:text-white transition-colors duration-500" />
                        </div>
                        <h3 className="font-serif text-2xl text-[#3D2B1F] mb-3 group-hover:text-[#8B4513] transition-colors">Plan Ahead (Bulk)</h3>
                        <p className="font-sans text-[#8B4513] opacity-80 mb-8 flex-grow">
                            "Function · Festival · Family"
                            <br />
                            <span className="text-sm mt-2 block">Planned with care for your special day.</span>
                        </p>
                        <span className="inline-flex items-center gap-2 text-[#8B4513] font-bold uppercase tracking-wider text-sm border-b-2 border-[#8B4513]/20 pb-1 group-hover:border-[#8B4513] transition-all">
                            Schedule Order <ArrowRight className="w-4 h-4" />
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
