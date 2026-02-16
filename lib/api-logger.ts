// API Request Logging Utility
// Captures detailed request metadata including IP, geolocation, and user info

import { readDb, writeDb } from './db';
import { NextRequest } from 'next/server';

export interface ApiLogEntry {
    id?: number;
    timestamp: number;
    method: string;
    endpoint: string;
    userId?: string;
    username?: string;
    ipAddress: string;
    userAgent?: string;
    country?: string;
    city?: string;
    region?: string;
    statusCode?: number;
    responseTime?: number;
    requestBody?: string;
    responseError?: string;
}

/**
 * Extract IP address from Next.js request
 * Checks multiple headers in order of preference
 */
export function extractIpAddress(request: NextRequest | Request): string {
    if ('headers' in request && typeof request.headers.get === 'function') {
        // Try multiple headers in order
        const forwardedFor = request.headers.get('x-forwarded-for');
        if (forwardedFor) {
            // x-forwarded-for can contain multiple IPs, get the first one
            return forwardedFor.split(',')[0].trim();
        }

        const realIp = request.headers.get('x-real-ip');
        if (realIp) return realIp;

        const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
        if (cfConnectingIp) return cfConnectingIp;
    }

    // Fallback to localhost
    return '127.0.0.1';
}

/**
 * Fetch geolocation data from IP address
 * Uses ipapi.co free API (no auth required, 1000 requests/day limit)
 */
async function getGeolocation(ip: string): Promise<{ country?: string; city?: string; region?: string }> {
    // Skip geolocation for localhost/private IPs
    if (ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip === '::1') {
        return { country: 'Local', city: 'Local', region: 'Local' };
    }

    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`, {
            headers: { 'User-Agent': 'THK-Logging/1.0' },
            signal: AbortSignal.timeout(2000), // 2 second timeout
        });

        if (!response.ok) {
            console.warn(`[API Logger] Geolocation fetch failed for IP ${ip}: ${response.status}`);
            return {};
        }

        const data = await response.json();
        return {
            country: data.country_name || undefined,
            city: data.city || undefined,
            region: data.region || undefined,
        };
    } catch (error) {
        console.warn(`[API Logger] Geolocation error for IP ${ip}:`, error);
        return {};
    }
}

/**
 * Log an API request to the database
 * NON-BLOCKING: Runs asynchronously to not slow down API responses
 */
export async function logApiRequest(params: {
    request: NextRequest | Request;
    method: string;
    endpoint: string;
    userId?: string;
    username?: string;
    statusCode?: number;
    responseTime?: number;
    requestBody?: any;
    responseError?: string;
}): Promise<void> {
    // Run logging asynchronously in the background
    setImmediate(async () => {
        try {
            const ip = extractIpAddress(params.request);
            const userAgent = 'headers' in params.request
                ? params.request.headers.get('user-agent') || undefined
                : undefined;

            // Fetch geolocation (with timeout)
            const geo = await getGeolocation(ip);

            const logEntry: ApiLogEntry = {
                timestamp: Date.now(),
                method: params.method,
                endpoint: params.endpoint,
                userId: params.userId,
                username: params.username,
                ipAddress: ip,
                userAgent,
                country: geo.country,
                city: geo.city,
                region: geo.region,
                statusCode: params.statusCode,
                responseTime: params.responseTime,
                requestBody: params.requestBody ? JSON.stringify(params.requestBody).substring(0, 5000) : undefined,
                responseError: params.responseError?.substring(0, 1000),
            };

            // Write to database
            const db = await readDb(['apiLogs']);
            if (!db.apiLogs) db.apiLogs = [];

            db.apiLogs.push({
                ...logEntry,
                id: Date.now() + Math.random(), // Temporary ID, will be replaced by DB auto-increment
            });

            await writeDb(db);
        } catch (error) {
            // Silent fail - logging errors shouldn't break the API
            console.error('[API Logger] Failed to log request:', error);
        }
    });
}

/**
 * Wrapper HOC to add logging to API route handlers
 * Usage: export const GET = withLogging(async (request) => { ... }, 'GET', '/api/users');
 */
export function withLogging(
    handler: (request: NextRequest) => Promise<Response>,
    method: string,
    endpoint: string
) {
    return async (request: NextRequest) => {
        const startTime = Date.now();
        let response: Response;
        let error: string | undefined;

        try {
            response = await handler(request);

            // Extract session info if available (optional, may require importing getSession)
            // For now, leaving userId/username undefined - can be added later

            await logApiRequest({
                request,
                method,
                endpoint,
                statusCode: response.status,
                responseTime: Date.now() - startTime,
                responseError: response.status >= 400 ? `HTTP ${response.status}` : undefined,
            });

            return response;
        } catch (err: any) {
            error = err.message || String(err);

            await logApiRequest({
                request,
                method,
                endpoint,
                statusCode: 500,
                responseTime: Date.now() - startTime,
                responseError: error,
            });

            throw err; // Re-throw to maintain normal error handling
        }
    };
}
