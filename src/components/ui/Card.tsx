// @/components/ui/Card.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface ProductCardProps {
    name: string;
    description: string;
    image: string;
    price: number;
    weight: string;
    tradition?: string;
    available: boolean;
    tags?: string[];
    buttonLabel?: string;
    onAddToBox: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    name,
    description,
    image,
    price,
    weight,
    tradition,
    available,
    tags,
    buttonLabel,
    onAddToBox,
}) => {
    return (
        <div className="bg-[#FDFCF0] border border-[#D4AF37] rounded-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group h-full flex flex-col">
            {/* Image */}
            <div className="relative h-64 bg-gray-100 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                        try {
                            // Fallback to real image if specific one missing
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder_real.jpg';
                        } catch (err) {
                            // ignore
                        }
                    }}
                />

                {/* Tags Overlay */}
                {tags && tags.length > 0 && (
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[80%]">
                        {tags.map((tag, i) => (
                            <span key={i} className="bg-[#FDFCF0]/90 text-[#630D16] text-[10px] uppercase tracking-wider px-2 py-1 font-sans font-medium border border-[#D4AF37]/30 shadow-sm backdrop-blur-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-serif text-xl text-[#630D16] mb-2 group-hover:text-[#8B4513] transition-colors">{name}</h3>

                    {tradition && (
                        <p className="font-sans text-xs text-[#8B4513] italic mb-2 border-l-2 border-[#D4AF37] pl-3">
                            {tradition}
                        </p>
                    )}

                    <p className="font-sans text-sm text-[#3D2B1F] opacity-80 mb-4 line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between border-t border-[#D4AF37]/20 pt-4">
                        <div>
                            <span className="font-serif text-2xl text-[#630D16]">
                                ₹{price}
                            </span>
                            <span className="font-sans text-sm text-[#3D2B1F] opacity-70 ml-2">
                                / {weight}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.preventDefault(); // Prevent link navigation if wrapped in Link
                            e.stopPropagation();
                            if (available) onAddToBox();
                        }}
                        disabled={!available}
                        className={`w-full py-2 font-sans text-sm uppercase tracking-wide transition-colors duration-300 border border-[#630D16] 
                            ${available
                                ? 'text-[#630D16] hover:bg-[#630D16] hover:text-[#FDFCF0]'
                                : 'text-gray-400 border-gray-300 cursor-not-allowed'
                            }`}
                    >
                        {available ? (buttonLabel || 'Add to Order') : 'Unavailable'}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface BranchCardProps {
    name: string;
    location: string;
    area: string;
    timings: string;
    distance?: string;
    onSelect: () => void;
}

export const BranchCard: React.FC<BranchCardProps> = ({
    name,
    location,
    area,
    timings,
    distance,
    onSelect,
}) => {
    return (
        <div
            onClick={onSelect}
            className="p-4 border border-[#D4AF37] rounded-sm hover:bg-[#630D16] hover:text-[#FDFCF0] transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-serif text-lg text-[#630D16] group-hover:text-[#FDFCF0]">
                    {name}
                </h4>
                {distance && (
                    <span className="font-sans text-sm text-[#3D2B1F] opacity-70 group-hover:text-[#FDFCF0]">
                        {distance}
                    </span>
                )}
            </div>
            <p className="font-sans text-sm text-[#3D2B1F] opacity-80 group-hover:text-[#FDFCF0] mb-2">
                {location}
            </p>
            <p className="font-sans text-sm text-[#630D16] group-hover:text-[#FDFCF0]">
                {timings}
            </p>
        </div>
    );
};