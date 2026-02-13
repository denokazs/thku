
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { readDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    // Simple hardcoded secret for emergency access
    if (key !== 'deniz_kurtar_bizi_123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db: any = await readDb();
    const users = db.users || [];
    const email = 'kazmacideniz@gmail.com';

    const user = users.find((u: any) => u.email === email);

    if (!user) {
        // DEBUG: List all users to see who is actually in there
        const allUsers = users.map((u: any) => ({ email: u.email, id: u.id, role: u.role }));
        return NextResponse.json({
            error: 'Target user not found',
            availableUsers: allUsers,
            count: users.length,
            dbHost: process.env.DB_HOST // Verify we are hitting the right DB
        }, { status: 404 });
    }

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

    const cookieStore = await cookies();
    cookieStore.set('auth_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
    });

    // Redirect to homepage
    return NextResponse.redirect(new URL('/kulupler', request.url));
}
