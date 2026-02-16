import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// MAPPINGS: cafeteriaMenu matches 'cafeteria_menu' table, with 'date' as key.
// readDb returns an OBJECT: { "2023-10-27": { date: "...", ... } }

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const db = await readDb(['cafeteriaMenu']);

    // Convert object to array for filtering/sorting
    const menuObj = db.cafeteriaMenu || {};
    const menus: any[] = Object.values(menuObj);

    if (date) {
        // Find specifically for date
        const menu = menus.find((m: any) => m.date === date);
        return NextResponse.json(menu || null);
    }

    // Default: return all upcoming menus
    const today = new Date().toISOString().split('T')[0];
    // Filter and sort
    const upcomingMenus = menus
        .filter((m: any) => m.date >= today)
        .sort((a: any, b: any) => a.date.localeCompare(b.date));

    return NextResponse.json(upcomingMenus);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = await readDb(['cafeteriaMenu']);

        if (!body.date) {
            return NextResponse.json({ error: 'Date is required' }, { status: 400 });
        }

        if (!db.cafeteriaMenu) db.cafeteriaMenu = {};

        // Use date as key (MAPPINGS definition: type: 'object', key: 'date')
        db.cafeteriaMenu[body.date] = body;

        await writeDb(db);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Dining POST Error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date'); // Use date as ID
    const id = searchParams.get('id'); // Fallback if frontend sends ID

    // If schema uses date as PK, we should prefer date. 
    // If frontend sends ID, we might have a problem if we don't know the date.
    // But cafeteria_menu table PK is `date`.

    if (!date && !id) return NextResponse.json({ error: 'Date or ID required' }, { status: 400 });

    const db = await readDb(['cafeteriaMenu']);
    if (!db.cafeteriaMenu) db.cafeteriaMenu = {};

    if (date) {
        delete db.cafeteriaMenu[date];
    } else if (id) {
        // If we only have ID (legacy compatibility), we have to search.
        // But schema doesn't have ID column? 
        // Let's assume frontend sends date or we can't delete. 
        // Actually, previous code generated `id: Date.now()`.
        // If schema doesn't persist it, it's lost.
        // So we MUST rely on date.

        // Try to find by ID if it exists in JSON?
        // If checking memory object, we can find by property.
        const keyToDelete = Object.keys(db.cafeteriaMenu).find(k => db.cafeteriaMenu[k].id == id);
        if (keyToDelete) {
            delete db.cafeteriaMenu[keyToDelete];
        } else {
            return NextResponse.json({ error: 'Menu not found by ID' }, { status: 404 });
        }
    }

    await writeDb(db);
    return NextResponse.json({ success: true });
}
