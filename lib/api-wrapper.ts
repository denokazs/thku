import { NextResponse } from 'next/server';
import { logAudit } from '@/lib/audit';

type RouteHandler = (request: Request, context?: any) => Promise<NextResponse>;

export function apiWrapper(handler: RouteHandler) {
    return async (request: Request, context?: any) => {
        try {
            return await handler(request, context);
        } catch (error: any) {
            // Generate a unique Error ID for tracking
            const errorId = crypto.randomUUID();
            const ip = request.headers.get('x-forwarded-for') || 'unknown';
            const path = new URL(request.url).pathname;

            // 1. Log the full sensitive error internally (Audit Log)
            console.error(`[API_ERROR] ID: ${errorId} | Path: ${path} | IP: ${ip}`, error);

            logAudit({
                action: 'API_ERROR',
                actor: { ip },
                severity: 'WARNING',
                target: path,
                details: {
                    errorId,
                    message: error.message,
                    stack: error.stack
                }
            });

            // 2. Return a generic, safe error to the user
            // DEBUG MODE: Return actual error
            return NextResponse.json(
                {
                    success: false,
                    message: `DEBUG ERROR: ${error.message}`,
                    stack: error.stack,
                    errorId // Reference ID for support
                },
                { status: 500 }
            );
        }
    };
}
