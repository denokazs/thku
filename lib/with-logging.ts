// Simple wrapper to add logging to existing API routes
// Usage: Wrap API handler functions with this to auto-log requests

import { NextRequest, NextResponse } from 'next/server';
import { logApiRequest } from './api-logger';

/**
 * Higher-order function to wrap API routes with automatic logging
 * Makes it easy to add logging to existing routes without modifying them
 */
export function withApiLogging(
    handler: (req: NextRequest) => Promise<NextResponse>,
    endpoint: string
) {
    return async (req: NextRequest) => {
        const startTime = Date.now();

        try {
            const response = await handler(req);

            // Log after successful response
            logApiRequest({
                request: req,
                method: req.method,
                endpoint,
                statusCode: response.status,
                responseTime: Date.now() - startTime,
            }).catch(err => console.error('[Logging Error]', err)); // Silent fail

            return response;
        } catch (error: any) {
            // Log error response
            logApiRequest({
                request: req,
                method: req.method,
                endpoint,
                statusCode: 500,
                responseTime: Date.now() - startTime,
                responseError: error.message || String(error),
            }).catch(err => console.error('[Logging Error]', err));

            throw error; // Re-throw to maintain normal error flow
        }
    };
}
