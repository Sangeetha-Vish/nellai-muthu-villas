'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const BranchContext = createContext(undefined);

export const BranchProvider = ({ children }) => {
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Load saved selection
    useEffect(() => {
        const saved = localStorage.getItem('selectedBranch');
        if (saved) {
            try {
                setSelectedBranch(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse saved branch', e);
            }
        }

        // Fetch branches from API
        (async () => {
            try {
                const res = await fetch('/api/branches');
                if (res.ok) {
                    const data = await res.json();
                    setBranches(data);
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
