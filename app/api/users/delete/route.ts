
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireRole } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        await requireRole(['super_admin']);

        const body = await request.json();
        const { id } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = await readDb();

        // Prevent deleting super admin (id 1 or username 'admin')
        const userToDelete = (db.users || []).find((u: any) => String(u.id) === String(id));

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (String(userToDelete.id) === '1' || userToDelete.username === 'admin' || userToDelete.role === 'super_admin') {
            if (userToDelete.username === 'admin') {
                return NextResponse.json({ error: 'Cannot delete the main super administrator' }, { status: 403 });
            }
        }

        const newUsers = (db.users || []).filter((u: any) => String(u.id) !== String(id));
        db.users = newUsers;
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('POST /api/users/delete Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            details: error.stack
        }, { status: 500 });
    }
}
