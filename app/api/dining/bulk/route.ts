import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const menus = await request.json();

        if (!Array.isArray(menus)) {
            return NextResponse.json({ error: 'Input must be an array' }, { status: 400 });
        }

        const db = await readDb();
        const existingMenus = db.dining_menus || [];

        // Map for quick lookup by date
        const menuMap = new Map();
        existingMenus.forEach((m: any) => menuMap.set(m.date, m));

        // Merge new menus
        menus.forEach((newMenu: any) => {
            if (newMenu.date) {
                // If ID exists, keep it, otherwise generate new one or keep existing one if updating
                const existing = menuMap.get(newMenu.date);
                const id = existing ? existing.id : Date.now() + Math.random();

                menuMap.set(newMenu.date, { ...newMenu, id });
            }
        });

        // Convert back to array
        db.dining_menus = Array.from(menuMap.values()).sort((a: any, b: any) => a.date.localeCompare(b.date));

        await writeDb(db);
        return NextResponse.json({ success: true, count: menus.length });
    } catch (error) {
        console.error('Bulk import failed:', error);
        return NextResponse.json({ error: 'Failed to import' }, { status: 500 });
    }
}
