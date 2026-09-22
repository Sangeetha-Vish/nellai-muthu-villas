'use client';

import React, { useState } from 'react';

export default function ImageWithFallback({ src, alt, className, style, sizes }) {
    const [current, setCurrent] = useState(src || '/images/placeholder_classy.svg');

    return (
        <img
            src={current}
            alt={alt}
            className={className}
            style={style}
            sizes={sizes}
            onError={() => setCurrent('/images/placeholder_classy.svg')}
        />
    );
}
