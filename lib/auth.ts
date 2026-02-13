import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJWT } from './jwt';

export interface Session {
    id: number;
    username: string;
    role: 'super_admin' | 'club_admin' | 'user' | 'student';
    clubId?: number;
    name?: string;
    email?: string;
    studentId?: string;
    department?: string;
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<Session | null> {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get('auth_session');

        if (!sessionCookie?.value) return null;

        // Verify signed JWT
        const payload = await verifyJWT(sessionCookie.value);

        if (!payload) return null;

        return payload as unknown as Session;
    } catch (error) {
        console.error('getSession - Error parsing session:', error);
        return null;
    }
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<Session> {
    const session = await getSession();

    if (!session) {
        // Debug why it failed
        const { cookies } = require('next/headers');
        const cookieStore = await cookies();
        const hasCookie = cookieStore.get('auth_session');

        if (!hasCookie) {
            throw new Error('UNAUTHORIZED: Missing Cookie (Browser did not send auth_session)');
        }

        throw new Error('UNAUTHORIZED: Invalid Token (Cookie sent but JWT verification failed)');
    }

    return session;
}

/**
 * Require specific role(s) - throws error if role doesn't match
 */
export async function requireRole(allowedRoles: string[]): Promise<Session> {
    const session = await requireAuth();

    if (!allowedRoles.includes(session.role)) {
        throw new Error('FORBIDDEN');
    }

    return session;
}

/**
 * Require access to a specific club
 * - Super admins can access all clubs
 * - Club admins can only access their assigned club
 * - Others are denied
 */
export async function requireClubAccess(clubId: number): Promise<Session> {
    const session = await requireAuth();

    // Super admin can access all clubs
    if (session.role === 'super_admin') {
        return session;
    }

    // Club admin must match clubId
    if (session.role === 'club_admin' && session.clubId == clubId) {
        return session;
    }

    throw new Error('FORBIDDEN');
}

/**
 * Handle authentication errors and return appropriate response
 */
export function handleAuthError(error: any): NextResponse {
    if (error.message === 'UNAUTHORIZED') {
        return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
        );
    }

    if (error.message === 'FORBIDDEN') {
        return NextResponse.json(
            { error: 'You do not have permission to perform this action' },
            { status: 403 }
        );
    }

    console.error('Auth error:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
}
