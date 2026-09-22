import React from 'react';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef(
    ({ variant = 'solid', className, children, ...props }, ref) => {
        const baseStyles = 'px-6 py-3 rounded-sm font-sans font-normal transition-all duration-300 ease-out';

        const variantStyles = {
            solid: 'bg-[#630D16] text-[#FDFCF0] hover:bg-[#4A0A10] border border-[#630D16]',
            outline: 'bg-transparent text-[#630D16] border border-[#630D16] hover:bg-[#630D16] hover:text-[#FDFCF0]',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variantStyles[variant], className)}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
