'use client';

import { useState } from 'react';
import { MapPin, X, CheckCircle } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';

/**
 * Optional popup to request precise GPS location
 * Shows once per session, can be dismissed
 */
export function LocationPermissionPrompt() {
    const [dismissed, setDismissed] = useState(() => {
        // Check if user dismissed this session
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem('location_prompt_dismissed') === 'true';
        }
        return false;
    });

    const { location, loading, requestLocation, permission } = useLocation();

    // Don't show if already granted or dismissed
    if (dismissed || permission === 'granted' || permission === 'denied') {
        return null;
    }

    const handleDismiss = () => {
        setDismissed(true);
        sessionStorage.setItem('location_prompt_dismissed', 'true');
    };

    const handleAllow = async () => {
        const loc = await requestLocation();

        // Send location to backend if granted
        if (loc) {
            sendLocationToBackend(loc);
        }

        handleDismiss();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
            <div className="bg-white rounded-lg shadow-2xl border border-slate-200 p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                            Konumunuzu Paylaşın
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">
                            Daha iyi hizmet için tam konumunuzu öğrenmek ister misiniz?
                            (Opsiyonel)
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={handleAllow}
                                disabled={loading}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {loading ? 'Alınıyor...' : 'İzin Ver'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="px-3 py-2 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-100 transition"
                            >
                                Şimdi Değil
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Send GPS location to backend for logging
 * Also store in sessionStorage for subsequent requests
 */
async function sendLocationToBackend(location: any) {
    try {
        // Store in sessionStorage for future requests
        const gpsData = {
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            address: location.address,
            street: location.street,
            city: location.city,
            postalCode: location.postalCode,
        };

        sessionStorage.setItem('user_gps_location', JSON.stringify(gpsData));

        // Send to backend
        await fetch('/api/user/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-gps-location': JSON.stringify(gpsData), // Include in headers for logging
            },
            body: JSON.stringify(gpsData),
        });

        // Override global fetch to include GPS in all future requests
        if (typeof window !== 'undefined' && !window.__gps_fetch_patched) {
            const originalFetch = window.fetch;
            window.fetch = function (...args: any[]) {
                const [url, options = {}] = args;
                const gpsStored = sessionStorage.getItem('user_gps_location');

                if (gpsStored && typeof url === 'string' && url.startsWith('/api/')) {
                    options.headers = {
                        ...options.headers,
                        'x-gps-location': gpsStored,
                    };
                }

                return originalFetch(url, options);
            };
            (window as any).__gps_fetch_patched = true;
        }
    } catch (error) {
        console.error('[LocationPrompt] Failed to send location:', error);
    }
}

// Extend Window interface for TypeScript
declare global {
    interface Window {
        __gps_fetch_patched?: boolean;
    }
}
