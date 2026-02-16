import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET() {
    try {
        const db = await readDb();
        const settings = db.settings?.popup || {
            enabled: false,
            title: "",
            description: "",
            ctaText: "",
            ctaUrl: "",
            imageUrl: "",
            icon: "🎉",
            backgroundColor: "#ffffff",
            textColor: "#1e293b",
            buttonColor: "#3b82f6",
            buttonTextColor: "#ffffff",
            overlayDarkness: 0.7,
            size: "medium",
            delaySeconds: 5,
            reappearHours: 48,
            animation: "scale"
        };
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch popup settings' }, { status: 500 });
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
        db.settings.popup = body;

        await writeDb(db);
        return NextResponse.json({ success: true, popup: body });
    } catch (error) {
        console.error('Error saving popup settings:', error);
        return NextResponse.json({ error: 'Failed to update popup settings' }, { status: 500 });
    }
}
