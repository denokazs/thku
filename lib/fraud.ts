import crypto from 'crypto';

// Mock GeoIP Database (In production, use MaxMind or similar)
// Simulating locations for testing "Impossible Travel"
const MOCK_GEO_DB: Record<string, { lat: number; lon: number; city: string }> = {
    '127.0.0.1': { lat: 39.9334, lon: 32.8597, city: 'Ankara' }, // Localhost
    '88.255.44.1': { lat: 41.0082, lon: 28.9784, city: 'Istanbul' }, // Example IP
    '142.250.187.174': { lat: 40.7128, lon: -74.0060, city: 'New York' }, // Example IP
};

interface GeoParams {
    lat: number;
    lon: number;
}

/**
 * Calculate Haversine Distance between two points (in km)
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * Check for Impossible Travel (Superman Attack)
 * @param currentIp New Login IP
 * @param lastIp Previous Login IP
 * @param lastLoginTime Previous Login Timestamp (ISO String)
 */
export async function checkImpossibleTravel(currentIp: string, lastIp: string, lastLoginTime: string) {
    if (!lastIp || !lastLoginTime) return { suspicious: false, reason: null };
    if (currentIp === lastIp) return { suspicious: false, reason: null };

    const currentGeo = MOCK_GEO_DB[currentIp] || { lat: 39.9334, lon: 32.8597, city: 'Unknown' }; // Default to Ankara
    const lastGeo = MOCK_GEO_DB[lastIp] || { lat: 39.9334, lon: 32.8597, city: 'Unknown' };

    const distance = getDistanceFromLatLonInKm(currentGeo.lat, currentGeo.lon, lastGeo.lat, lastGeo.lon);

    const now = new Date();
    const last = new Date(lastLoginTime);
    const timeDeltaHours = (now.getTime() - last.getTime()) / (1000 * 60 * 60);

    if (timeDeltaHours === 0) return { suspicious: true, reason: 'Instant travel detected' };

    const velocity = distance / timeDeltaHours;

    // Threshold: 800 km/h (Plane speed safe margin)
    if (velocity > 1000) {
        return {
            suspicious: true,
            reason: `Impossible Travel: Moved ${distance.toFixed(0)}km in ${timeDeltaHours.toFixed(2)}h (${velocity.toFixed(0)} km/h)`
        };
    }

    return { suspicious: false, velocity };
}

/**
 * Generate Device Fingerprint
 * Hash of User-Agent + Accept-Language + etc.
 */
export function generateDeviceFingerprint(headers: Headers): string {
    const userAgent = headers.get('user-agent') || '';
    const acceptLanguage = headers.get('accept-language') || '';
    // In a real app, you'd get screen res / timezone from client-side JS and send in body
    // For now, we rely on headers.

    return crypto.createHash('sha256').update(`${userAgent}|${acceptLanguage}`).digest('hex');
}
