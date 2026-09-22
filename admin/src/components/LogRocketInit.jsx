"use client";

import { useEffect } from 'react';
import LogRocket from 'logrocket';

export function LogRocketInit() {
    useEffect(() => {
        const LOGROCKET_ID = process.env.NEXT_PUBLIC_LOGROCKET_ID;
        if (process.env.NODE_ENV === 'production' && LOGROCKET_ID) {
            LogRocket.init(LOGROCKET_ID, {
                shouldMaskAllInputs: true,
                dom: {
                    inputSanitizer: true,
                },
            });
        }
    }, []);

    return null;
}
