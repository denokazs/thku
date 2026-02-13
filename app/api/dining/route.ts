import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const db = await readDb();

    if (date) {
        // Find specifically for date
        const menu = (db.dining_menus || []).find((m: any) => m.date === date);
        return NextResponse.json(menu || null);
    }

    // Default: return all upcoming menus
    const today = new Date().toISOString().split('T')[0];
    const menus = (db.dining_menus || []).filter((m: any) => m.date >= today).sort((a: any, b: any) => a.date.localeCompare(b.date));
    return NextResponse.json(menus);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await readDb();

        const existingIndex = (db.dining_menus || []).findIndex((m: any) => m.date === body.date);

        if (existingIndex > -1) {
            // Overwrite if exists for this date
            db.dining_menus[existingIndex] = { ...body, id: db.dining_menus[existingIndex].id };
        } else {
            // Create new
            const newMenu = { id: Date.now(), ...body };
            db.dining_menus = [...(db.dining_menus || []), newMenu];
        }

        await writeDb(db);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = await readDb();
    db.dining_menus = (db.dining_menus || []).filter((m: any) => m.id !== Number(id));
    await writeDb(db);
    return NextResponse.json({ success: true });
}
