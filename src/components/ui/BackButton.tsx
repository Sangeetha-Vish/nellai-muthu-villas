'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
    className?: string;
    label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ className = "", label = "Back" }) => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className={`flex items-center gap-2 text-[#630D16] hover:text-[#8B4513] transition-colors font-sans mb-4 ${className}`}
        >
            <div className="p-2 border border-[#630D16]/20 rounded-full hover:bg-[#630D16]/5 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </div>
            {label && <span className="font-medium text-sm lg:text-base">{label}</span>}
        </button>
    );
};
