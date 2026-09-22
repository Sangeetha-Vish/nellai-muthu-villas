'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export function useLocation() {
    return useContext(LocationContext);
}

export function LocationProvider({ children }) {
    const [userLocation, setUserLocation] = useState(null); // { lat, lng }
    const [permissionStatus, setPermissionStatus] = useState('prompt'); // granted, denied, prompt
    const [nearestBranch, setNearestBranch] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    // Haversine formula to calculate distance in km
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180);
    };

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setPermissionStatus('granted');
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setPermissionStatus('denied');
                setLocationError(error.message);
                setIsLocating(false);
            }
        );
    };

    // Auto-request implementation (optional - can be triggered by UI)
    // useEffect(() => {
    //     requestLocation(); 
    // }, []);

    const findNearestBranch = (branches) => {
        if (!userLocation || !branches || branches.length === 0) return null;

        let nearest = null;
        let minDistance = Infinity;

        branches.forEach(branch => {
            if (branch.latitude && branch.longitude) {
                const dist = calculateDistance(userLocation.lat, userLocation.lng, branch.latitude, branch.longitude);
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = { ...branch, calculatedDistance: dist.toFixed(1) + ' km' };
                }
            }
        });

        setNearestBranch(nearest);
        return nearest;
    };

    const value = {
        userLocation,
        permissionStatus,
        locationError,
        isLocating,
        nearestBranch,
        requestLocation,
        calculateDistance,
        findNearestBranch
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
}
