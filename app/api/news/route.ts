
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const db = await readDb(['news']);
    // Sort by date descending (assuming string date format might need better parsing, but simple string sort works if ISO, otherwise relying on insertion order or ID)
    const news = (db.news || []).sort((a: any, b: any) => b.id - a.id);
    return NextResponse.json(news);
}

// Create new news item
export async function POST(request: Request) {
    try {
        // SECURITY: Verify user authentication and role
        const { verifyJWT } = await import('@/lib/jwt');
        const { cookies } = await import('next/headers');

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_session')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const newItem = await request.json();

        if (!newItem.title || !newItem.date || !newItem.summary) {
            return NextResponse.json({ error: 'Missing required fields (title, date, summary)' }, { status: 400 });
        }

        const db = await readDb();
        const newsItem = { ...newItem, id: Date.now() };
        db.news.push(newsItem);
        await writeDb(db);

        return NextResponse.json(newsItem, { status: 201 });
    } catch (error) {
        console.error('Error creating news item:', error);
        return NextResponse.json({ error: 'Failed to create news item' }, { status: 500 });
    }
}

// Delete news item
export async function DELETE(request: Request) {
    try {
        // SECURITY: Verify user authentication and role
        const { verifyJWT } = await import('@/lib/jwt');
        const { cookies } = await import('next/headers');

        const cookieStore = await cookies();
        const token = cookieStore.get('auth_session')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized. Please login.' },
                { status: 401 }
            );
        }

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json(
                { error: 'Unauthorized. Super Admin access required.' },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get('id') || '0');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const db = await readDb();
        const index = db.news.findIndex((item: any) => item.id === id);

        if (index === -1) {
            return NextResponse.json({ error: 'News item not found' }, { status: 404 });
        }

        db.news.splice(index, 1);
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting news item:', error);
        return NextResponse.json({ error: 'Failed to delete news item' }, { status: 500 });
    }
}
