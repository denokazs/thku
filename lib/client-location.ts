// Client-Side GPS Location Tracking
// Requests user permission and gets precise coordinates + address

export interface PreciseLocation {
    latitude: number;
    longitude: number;
    accuracy: number; // meters
    address?: string;
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}

/**
 * Request user's precise GPS location
 * Requires user permission (browser will show popup)
 */
export async function requestPreciseLocation(): Promise<PreciseLocation | null> {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn('[GPS] Geolocation not supported');
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                // Get address from coordinates (reverse geocoding)
                const address = await reverseGeocode(latitude, longitude);

                resolve({
                    latitude,
                    longitude,
                    accuracy,
                    ...address,
                });
            },
            (error) => {
                console.warn('[GPS] Permission denied or error:', error.message);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}

/**
 * Reverse geocode coordinates to get street address
 * Uses Nominatim (OpenStreetMap) - free, no API key needed
 */
async function reverseGeocode(lat: number, lon: number): Promise<{
    address?: string;
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
            {
                headers: {
                    'User-Agent': 'THK-University-App/1.0',
                },
            }
        );

        if (!response.ok) {
            console.warn('[Geocoding] Failed:', response.status);
            return {};
        }

        const data = await response.json();
        const addr = data.address || {};

        return {
            address: data.display_name,
            street: addr.road || addr.street || addr.neighbourhood,
            city: addr.city || addr.town || addr.village,
            country: addr.country,
            postalCode: addr.postcode,
        };
    } catch (error) {
        console.error('[Geocoding] Error:', error);
        return {};
    }
}

/**
 * Check if user has already granted location permission
 */
export async function checkLocationPermission(): Promise<'granted' | 'denied' | 'prompt'> {
    if (!navigator.permissions) {
        return 'prompt'; // Assume we need to ask
    }

    try {
        const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        return result.state;
    } catch {
        return 'prompt';
    }
}

/**
 * Store location in localStorage for future requests
 * Expires after 1 hour
 */
export function cacheLocation(location: PreciseLocation): void {
    const cache = {
        location,
        timestamp: Date.now(),
    };
    localStorage.setItem('user_location_cache', JSON.stringify(cache));
}

/**
 * Get cached location if available and not expired
 */
export function getCachedLocation(): PreciseLocation | null {
    try {
        const cached = localStorage.getItem('user_location_cache');
        if (!cached) return null;

        const { location, timestamp } = JSON.parse(cached);
        const oneHour = 60 * 60 * 1000;

        // Return cached if less than 1 hour old
        if (Date.now() - timestamp < oneHour) {
            return location;
        }

        // Expired, clear cache
        localStorage.removeItem('user_location_cache');
        return null;
    } catch {
        return null;
    }
}
