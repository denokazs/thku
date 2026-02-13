
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAuth, requireClubAccess, handleAuthError } from '@/lib/auth';
import { validateMember } from '@/lib/validation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get('clubId');

    const db = await readDb();
    let members = db.members;

    if (clubId) {
        members = members.filter((m: any) => m.clubId == clubId);
    }

    const studentId = searchParams.get('studentId');
    const email = searchParams.get('email');

    if (studentId || email) {
        members = members.filter((m: any) =>
            (studentId && m.studentId === studentId) ||
            (email && m.email === email)
        );
    }

    return NextResponse.json(members);
}

export async function POST(request: Request) {
    try {
        // Require authentication for joining clubs
        const session = await requireAuth();
        const body = await request.json();

        // Validate and sanitize input
        const validation = validateMember(body);
        if (!validation.isValid) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.errors
            }, { status: 400 });
        }

        const sanitizedData = validation.sanitized!;

        // Regular users can only create membership for themselves
        if (session.role !== 'super_admin' && session.role !== 'club_admin') {
            if (sanitizedData.email !== session.email && sanitizedData.studentId !== session.studentId) {
                return NextResponse.json({
                    error: 'You can only register yourself'
                }, { status: 403 });
            }
        }

        const db = await readDb();

        const existingMember = db.members.find((m: any) =>
            m.clubId === sanitizedData.clubId &&
            (m.studentId === sanitizedData.studentId || m.email === sanitizedData.email)
        );

        if (existingMember) {
            return NextResponse.json({ error: 'User is already a member or has a pending request.' }, { status: 409 });
        }

        const newMember = {
            ...sanitizedData,
            joinDate: sanitizedData.joinedAt, // Map frontend 'joinedAt' to DB 'joinDate'
            id: Date.now(),
            status: 'pending' // Enforce pending status for new registrations
        };
        db.members.push(newMember);

        await writeDb(db);
        return NextResponse.json(newMember);
    } catch (error: any) {
        console.error('POST /api/members Error:', error);
        return handleAuthError(error);
    }
}


export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = await readDb();

        const member = db.members.find((m: any) => m.id == body.id);
        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        // Require club access to update members
        await requireClubAccess(member.clubId);

        const memberIndex = db.members.findIndex((m: any) => m.id == body.id);
        db.members[memberIndex] = { ...db.members[memberIndex], ...body };
        await writeDb(db);

        return NextResponse.json(db.members[memberIndex]);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = await readDb();
        const member = db.members.find((m: any) => m.id == id);

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        // Require club access to delete members
        await requireClubAccess(member.clubId);

        db.members = db.members.filter((m: any) => m.id != id);
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return handleAuthError(error);
    }
}
