import { verifyAdminAuth } from './admin-auth';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect API routes that require admin authentication
 * Usage: Wrap your API handler with this function
 */
export async function withAdminAuth(
    handler: (req: Request) => Promise<NextResponse>,
    request: Request
): Promise<NextResponse> {
    const isAuthenticated = await verifyAdminAuth();

    if (!isAuthenticated) {
        return NextResponse.json(
            { error: 'Unauthorized. Admin authentication required.' },
            { status: 401 }
        );
    }

    return handler(request);
}
