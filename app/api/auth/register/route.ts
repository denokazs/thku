import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { logApiRequest } from '@/lib/api-logger';
import { rateLimit } from '@/lib/rate-limit';
import { validateTurnstile } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        // 1. Rate Limit (3 registrations per hour per IP)
        const limiter = rateLimit(ip + '_register', { limit: 3, windowMs: 60 * 60 * 1000 });
        if (!limiter.success) {
            await logApiRequest({
                request,
                method: 'POST',
                endpoint: '/api/auth/register',
                statusCode: 429,
                responseError: 'Rate limit exceeded',
            });
            return NextResponse.json({ error: 'Çok fazla kayıt denemesi. Lütfen 1 saat sonra tekrar deneyiniz.' }, { status: 429 });
        }

        const body = await request.json();
        const { name, studentId, department, email, phone, password, confirmPassword, turnstileToken } = body;

        // 2. Validate Turnstile CAPTCHA
        const turnstile = await validateTurnstile(turnstileToken);
        if (!turnstile.success) {
            return NextResponse.json({ error: turnstile.error }, { status: 400 });
        }


        console.log('[Register] Attempt:', { name, studentId, email });

        // Basic validation
        if (!name || !studentId || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Tüm alanları doldurunuz.' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Şifreler eşleşmiyor.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
        }

        // Optimize: Only read users table
        const db = await readDb(['users']);
        const users = db.users || [];

        // Check duplicates
        if (users.find((u: any) => u.email === email)) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 400 });
        }
        if (users.find((u: any) => u.studentId === studentId)) {
            return NextResponse.json({ error: 'Bu öğrenci numarası zaten kayıtlı.' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: crypto.randomUUID(), // Use UUID string to match varchar(255) schema
            username: studentId.toLowerCase(), // Use studentId as default username
            name,
            studentId: studentId.toLowerCase(),
            department,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'student',
            createdAt: new Date().toISOString()
        };

        if (!db.users) db.users = [];
        db.users.push(newUser);

        // Write only users table (since db only has users key)
        await writeDb(db);

        console.log('[Register] Success:', newUser.id);

        // Log API request (async, non-blocking)
        await logApiRequest({
            request,
            method: 'POST',
            endpoint: '/api/auth/register',
            userId: newUser.id,
            username: newUser.username,
            statusCode: 200,
            requestBody: { name, studentId, email }, // Don't log password
        });

        // Sanitize return
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        console.error('Registration error:', error);

        // Log failed attempt
        await logApiRequest({
            request,
            method: 'POST',
            endpoint: '/api/auth/register',
            statusCode: 500,
            responseError: String(error),
        });

        return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
    }
}
