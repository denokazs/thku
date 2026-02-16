'use client';

import { useState, useEffect } from 'react';
import {
    requestPreciseLocation,
    checkLocationPermission,
    getCachedLocation,
    cacheLocation,
    type PreciseLocation
} from '@/lib/client-location';

export function useLocation() {
    const [location, setLocation] = useState<PreciseLocation | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

    // Check permission on mount
    useEffect(() => {
        checkLocationPermission().then(setPermission);

        // Try to load cached location
        const cached = getCachedLocation();
        if (cached) {
            setLocation(cached);
        }
    }, []);

    const requestLocation = async () => {
        setLoading(true);
        setError(null);

        try {
            const loc = await requestPreciseLocation();

            if (loc) {
                setLocation(loc);
                setPermission('granted');
                cacheLocation(loc);
            } else {
                setError('Location access denied');
                setPermission('denied');
            }
        } catch (err) {
            setError('Failed to get location');
            console.error('[useLocation]', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        location,
        loading,
        error,
        permission,
        requestLocation,
    };
}
