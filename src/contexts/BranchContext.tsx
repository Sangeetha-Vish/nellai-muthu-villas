'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Branch {
    id: string;
    name: string;
    location: string;
    area: string;
    timings: string;
    distance?: string;
}

interface BranchContextType {
    branches: Branch[];
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch | null) => void;
    setBranch: (branch: Branch | null) => void; // alias used across components
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export const BranchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

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

    const setBranch = (branch: Branch | null) => {
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
