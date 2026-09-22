'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin } from 'lucide-react';
import { BranchCard } from '@/components/ui/Card';
import { useBranch } from '@/contexts/BranchContext';
import { useLocation } from '@/contexts/LocationContext';
import { apiFetch } from '@/services/api';

export const BranchSelector = ({ isOpen, onClose }) => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setSelectedBranch } = useBranch();
    const { requestLocation, isLocating, permissionStatus } = useLocation(); // Use hook

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await apiFetch('/api/branches');
                const data = await response.json();
                setBranches(data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchBranches();
        }
    }, [isOpen]);

    const handleBranchSelect = (branch) => {
        setSelectedBranch(branch);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/30 z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#FDFCF0] rounded-sm shadow-2xl z-50 max-h-[80vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]">
                            <h2 className="font-serif text-2xl md:text-3xl text-[#630D16]">
                                Choose Your Branch
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 text-[#630D16] hover:text-[#3D2B1F] transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                            {/* Gentle Note */}
                            <div className="mb-6 p-4 bg-[#FDFCF0] border-l-4 border-[#D4AF37]">
                                <p className="font-sans text-sm text-[#3D2B1F] opacity-80">
                                    You may browse our sweets without selecting a branch. Choose a branch for availability and pickup details.
                                </p>
                            </div>

                            {/* Smart Suggestion (UI Only) */}
                            <div className="mb-6 p-4 border border-[#D4AF37] rounded-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-[#630D16]" />
                                    <h3 className="font-serif text-lg text-[#630D16]">
                                        Find Nearest Branch
                                    </h3>
                                </div>
                                <p className="font-sans text-sm text-[#3D2B1F] mb-3">
                                    We can suggest the nearest branch for you.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={requestLocation}
                                        disabled={isLocating || permissionStatus === 'denied'}
                                        className="px-4 py-2 bg-[#630D16] text-[#FDFCF0] rounded-sm font-sans text-sm transition-all duration-300 hover:bg-[#4A0A10] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLocating ? 'Locating...' : 'Allow Location'}
                                    </button>
                                    <button className="px-4 py-2 bg-transparent border border-[#630D16] text-[#630D16] rounded-sm font-sans text-sm transition-all duration-300 hover:bg-[#630D16] hover:text-[#FDFCF0]">
                                        Choose Manually
                                    </button>
                                </div>
                            </div>

                            {/* Branch List */}
                            <div>
                                <h3 className="font-serif text-xl text-[#630D16] mb-4">
                                    All Branches
                                </h3>

                                {loading ? (
                                    <div className="text-center py-8 text-[#630D16] font-sans">
                                        Loading branches...
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {branches.map((branch) => (
                                            <BranchCard
                                                key={branch.id}
                                                name={branch.name}
                                                location={branch.location}
                                                area={branch.area}
                                                timings={branch.timings}
                                                distance={branch.distance}
                                                onSelect={() => handleBranchSelect(branch)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
