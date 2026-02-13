
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireRole, getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
    try {
        // Only super_admin or club_admin can view users list
        await requireRole(['super_admin', 'club_admin']);

        const db = await readDb();
        const { searchParams } = new URL(request.url);
        const clubId = searchParams.get('clubId');

        // Sanitize output (remove passwords)
        const safeUsers = (db.users || []).map(({ password, ...u }: any) => u);

        if (clubId) {
            return NextResponse.json(safeUsers.filter((u: any) => u.clubId === Number(clubId)));
        }

        return NextResponse.json(safeUsers);
    } catch (error: any) {
        console.error('GET /api/users - Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Error', stack: error.stack }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await requireRole(['super_admin']);

        const body = await request.json();
        const db = await readDb();

        if (db.users.find((u: any) => u.username === body.username)) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
        }

        if (body.password && body.password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
        }

        // Hash password for manually created user
        const hashedPassword = await bcrypt.hash(body.password, 10);

        const newUser = {
            id: Date.now(),
            ...body,
            password: hashedPassword
        };

        db.users = [...(db.users || []), newUser];
        await writeDb(db);

        const { password, ...safeUser } = newUser;
        return NextResponse.json(safeUser);
    } catch (error) {
        return NextResponse.json({ error: 'Unauthorized or Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await requireRole(['super_admin']);

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = await readDb();

        // Prevent deleting super admin (id 1 or username 'admin')
        const userToDelete = (db.users || []).find((u: any) => String(u.id) === String(id));

        if (!userToDelete) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (userToDelete.id == 1 || userToDelete.username === 'admin' || userToDelete.role === 'super_admin') {
            // Check if there is another super admin before allowing delete? 
            // Ideally simply block deleting the main admin.
            if (userToDelete.username === 'admin') {
                return NextResponse.json({ error: 'Cannot delete the main super administrator' }, { status: 403 });
            }
        }

        const newUsers = (db.users || []).filter((u: any) => String(u.id) !== String(id));
        db.users = newUsers;
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE /api/users Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error',
            details: error.stack
        }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();

        // Only allow update if super_admin OR updating self
        if (session.role !== 'super_admin' && session.id !== body.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const db = await readDb();
        const index = db.users.findIndex((u: any) => u.id === body.id);

        if (index === -1) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Update, but prevent changing username to existing one
        if (body.username && body.username !== db.users[index].username) {
            if (db.users.find((u: any) => u.username === body.username)) {
                return NextResponse.json({ error: 'Username taken' }, { status: 400 });
            }
        }

        // Handle password update securely
        let updatedFields = { ...body };
        if (body.password) {
            if (body.password.length < 8) {
                return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
            }
            updatedFields.password = await bcrypt.hash(body.password, 10);
        } else {
            // Remove password field if it's empty/undefined to prevent overwriting with null
            delete updatedFields.password;
        }

        // Prevent role escalation by non-admins
        if (session.role !== 'super_admin') {
            delete updatedFields.role;
        }

        db.users[index] = { ...db.users[index], ...updatedFields };
        await writeDb(db);

        const { password, ...safeUser } = db.users[index];
        return NextResponse.json(safeUser);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
