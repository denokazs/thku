import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET() {
    try {
        const db = await readDb();
        const settings = db.settings?.banner || {
            enabled: false,
            title: "",
            description: "",
            ctaText: "",
            ctaUrl: "",
            icon: "📢",
            imageUrl: "",
            imageLink: "",
            backgroundColor: "#3b82f6",
            textColor: "#ffffff",
            buttonColor: "#1e40af",
            buttonTextColor: "#ffffff",
            position: "top",
            dismissible: true,
            reappearHours: 24,
            animation: "slide"
        };
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch banner settings' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const isAdmin = await verifyAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        console.log('Saving banner settings:', body);
        const db = await readDb();

        if (!db.settings) db.settings = {};
        db.settings.banner = body;

        await writeDb(db);
        console.log('Banner settings saved successfully');
        return NextResponse.json({ success: true, banner: body });
    } catch (error) {
        console.error('Error saving banner settings:', error);
        return NextResponse.json({ error: 'Failed to update banner settings' }, { status: 500 });
    }
}
