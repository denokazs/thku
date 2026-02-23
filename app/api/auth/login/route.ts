
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/jwt';
import { apiWrapper } from '@/lib/api-wrapper';
import { readDb } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { logAudit } from '@/lib/audit';
import { logApiRequest } from '@/lib/api-logger';

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
    const { username, password, turnstileToken } = body;

    // 3. Turnstile CAPTCHA Check
    // const { validateTurnstile } = await import('@/lib/turnstile');
    // const captcha = await validateTurnstile(turnstileToken);

    // Validate only if configured (optional for login if rate limit is tight)
    // if (process.env.TURNSTILE_SECRET_KEY && !captcha.success) {
    //     return NextResponse.json({ success: false, message: captcha.error }, { status: 400 });
    // }

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
    const db: any = await readDb(['users']);
    const users = db.users || [];

    const normalizedInput = username.trim().toLowerCase();


    const user = users.find((u: any) =>
        (u.username && u.username.toLowerCase() === normalizedInput) ||
        (u.email && u.email.toLowerCase() === normalizedInput) ||
        (u.studentId && u.studentId.toLowerCase() === normalizedInput)
    );

    if (!user) {
        return NextResponse.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' }, { status: 401 });
    }

    // 5. Password Check
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return NextResponse.json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.' }, { status: 401 });
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

    // 7. Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    // Log successful login
    await logApiRequest({
        request,
        method: 'POST',
        endpoint: '/api/auth/login',
        userId: user.id,
        username: user.username,
        statusCode: 200,
    });

    return NextResponse.json({ success: true, user: sessionPayload });
});
