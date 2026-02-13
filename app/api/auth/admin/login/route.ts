import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminToken, setAdminCookie } from '@/lib/admin-auth';
import { rateLimit } from '@/lib/rate-limit';
import { signJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Check rate limit (5 attempts per 15 minutes)
        const limiter = rateLimit(ip, { limit: 5, windowMs: 15 * 60 * 1000 });
        if (!limiter.success) {
            return NextResponse.json(
                { error: 'Too many login attempts. Please try again later.' },
                { status: 429 }
            );
        }

        // Verify password
        const isValid = await verifyAdminPassword(password);

        if (!isValid) {
            return NextResponse.json(
                {
                    error: 'Invalid password',
                    remaining: limiter.remaining
                },
                { status: 401 }
            );
        }

        // Password is correct
        // rateLimit(ip) auto-increments, so we don't manually reset here in this simple implementation,
        // or we just accept that successful logins also count towards the "attempts" rate limit (which is fine for brute force protection).
        // If we want to reset, we'd need to extend lib/rate-limit.ts. For now, valid login passes through.

        // Create Admin JWT token (Legacy)
        const token = await createAdminToken();
        await setAdminCookie(token);

        // BRIDGE: Create standard User Session Token
        // Fetch real super_admin from DB
        const { readDb } = await import('@/lib/db');
        const db = await readDb();
        const adminUser = db.users.find((u: any) => u.username === 'admin' || u.role === 'super_admin');

        let sessionPayload;
        if (adminUser) {
            sessionPayload = {
                id: adminUser.id,
                username: adminUser.username,
                role: adminUser.role,
                name: adminUser.name || 'System Admin',
                email: adminUser.email,
                phone: adminUser.phone,
                clubId: adminUser.clubId
            };
        } else {
            // Fallback if no admin in DB (should not happen if seeded)
            sessionPayload = {
                id: 1,
                username: 'admin',
                role: 'super_admin',
                name: 'System Admin'
            };
        }

        const standardToken = await signJWT(sessionPayload);
        const cookieStore = await cookies();
        cookieStore.set('auth_session', standardToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax', // Relaxed for redirect/navigation
            path: '/', // CRITICAL: Ensure cookie is available everywhere!
            maxAge: 60 * 60 * 24 * 7 // 7 days match
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Authentication successful'
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
