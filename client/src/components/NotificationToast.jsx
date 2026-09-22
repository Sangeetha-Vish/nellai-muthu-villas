'use client';

import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';

export function NotificationToast({ message, type = 'info', onClose }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for transition
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="bg-[#630D16] text-[#FDFCF0] p-4 rounded-xl shadow-2xl border border-[#D4AF37]/30 flex items-center gap-4 min-w-[300px]">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="flex-1 pr-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] mb-0.5">Order Update</p>
                    <p className="text-sm font-medium leading-tight">{message}</p>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
