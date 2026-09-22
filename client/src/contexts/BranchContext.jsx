'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/services/api';

const BranchContext = createContext(undefined);

export const BranchProvider = ({ children }) => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Fetch branches and validate selection
    useEffect(() => {
        (async () => {
            try {
                const res = await apiFetch('/api/branches');
                if (res.ok) {
                    const data = await res.json();
                    setBranches(data);

                    // Validate existing selection
                    const saved = localStorage.getItem('selectedBranch');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            const valid = data.find(b => b.id === parsed.id);
                            if (valid) {
                                setSelectedBranch(valid); // update with fresh data
                            } else {
                                setSelectedBranch(null); // stale ID
                            }
                        } catch (e) {
                            setSelectedBranch(null);
                        }
                    }
                } else {
                    console.error('Failed to fetch branches', await res.text());
                }
            } catch (err) {
                console.error('Error fetching branches', err);
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedBranch) {
            localStorage.setItem('selectedBranch', JSON.stringify(selectedBranch));
        } else {
            localStorage.removeItem('selectedBranch');
        }
    }, [selectedBranch]);

    const setBranch = (branch) => {
        setSelectedBranch(branch);
    };

    return (
        <BranchContext.Provider value={{ branches, selectedBranch, setSelectedBranch, setBranch }}>
            {children}
        </BranchContext.Provider>
    );
};

export const useBranch = () => {
    const context = useContext(BranchContext);
    if (context === undefined) {
        throw new Error('useBranch must be used within a BranchProvider');
    }
    return context;
};
