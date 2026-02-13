
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const db = await readDb();
        const settings = db.settings?.footer || {
            // Default fallback if DB is empty
            brand: { title: "THK ÜNİVERSİTESİ", description: "Türkiye'nin Havacılık ve Uzay Bilimleri Merkezi." },
            columns: [],
            socials: {},
            copyright: "© 2026 THK Üniversitesi"
        };
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAdmin = await verifyAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const db = await readDb();

        if (!db.settings) db.settings = {};
        db.settings.footer = body;

        await writeDb(db);

        return NextResponse.json(body);
    } catch (error) {
        console.error('Failed to update footer settings', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }
}
