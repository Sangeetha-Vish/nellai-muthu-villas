'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WelcomeScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // After 3 seconds, start fade out
        const timer = setTimeout(() => {
            setIsVisible(false);

            // Ensure we call onComplete after the exit animation finishes
            const finishTimer = setTimeout(() => {
                onComplete();
            }, 1600); // matches the exit duration + small buffer

            return () => clearTimeout(finishTimer);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    // animation-complete handled via timers to avoid potential
                    // framer-motion race conditions on some builds
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDFCF0]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                        className="text-center"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl text-[#630D16] tracking-wide">
                            Welcome to
                        </h1>
                        <h2 className="font-serif text-5xl md:text-6xl text-[#630D16] mt-4 tracking-wider">
                            Nellai Muthu Vilas
                        </h2>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
