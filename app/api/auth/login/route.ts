
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/jwt';
import { apiWrapper } from '@/lib/api-wrapper';
import { readDb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';

export const POST = apiWrapper(async (request: Request) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // 1. Rate Limit
    const limiter = rateLimit(ip, { limit: 5, windowMs: 60 * 1000 });
    if (!limiter.success) {
        return NextResponse.json(
            { success: false, message: 'Too many login attempts.' },
            { status: 429 }
        );
    }

    // 2. Parse Body
    const body = await request.json();
    const { username, password } = body;

    // 3. Honeytoken Check (Simplified)
    const HONEYTOKENS = ['super_admin', 'root', 'admin123', 'sysadmin'];
    if (HONEYTOKENS.includes(username)) {
        logAudit({
            action: 'HONEYTOKEN_TRIGGERED',
            actor: { ip },
            severity: 'CRITICAL',
            target: username,
            details: { message: 'Attacker fell into the honeytoken trap.' }
        });
        await new Promise(r => setTimeout(r, 2000));
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // 4. DB Lookup
    const db: any = await readDb();
    const users = db.users || [];

    const normalizedInput = username.toLowerCase();
    console.log('[LOGIN DEBUG] Attempting login for:', normalizedInput);

    const user = users.find((u: any) =>
        (u.username && u.username.toLowerCase() === normalizedInput) ||
        (u.email && u.email.toLowerCase() === normalizedInput) ||
        (u.studentId && u.studentId.toLowerCase() === normalizedInput)
    );

    if (!user) {
        console.log('[LOGIN DEBUG] User not found in DB');
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // 5. Password Check
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('[LOGIN DEBUG] User found. Password match:', passwordMatch);

    if (!passwordMatch) {
        console.log('[LOGIN DEBUG] Password mismatch');
        return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // 6. Success - Generate Token
    const sessionPayload = {
        id: user.id,
        username: user.username,
        role: user.role,
        clubId: user.clubId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        department: user.department
    };

    const token = await signJWT(sessionPayload);
    const response = NextResponse.json({ success: true, user: sessionPayload });

    // 7. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
});
