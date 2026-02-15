
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { readDb } from '@/lib/db';

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');

    if (!sessionCookie) {
        return NextResponse.json({ user: null });
    }

    try {
        const payload = await verifyJWT(sessionCookie.value);

        if (!payload) {
            return NextResponse.json({ user: null });
        }

        // Fetch fresh user data from DB to ensure we have latest fields (like studentId)
        const db = await readDb(['users']);
        const user = db.users.find((u: any) => u.id === payload.id);

        if (!user) {
            return NextResponse.json({ user: null });
        }

        // Sanitize password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeUser } = user;

        return NextResponse.json({ user: safeUser });
    } catch {
        return NextResponse.json({ user: null });
    }
}
