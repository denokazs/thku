import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAuth, requireClubAccess, handleAuthError, getSession } from '@/lib/auth';
import { validateMessage } from '@/lib/validation';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clubId = searchParams.get('clubId');
        const userId = searchParams.get('userId');
        const id = searchParams.get('id');

        const db = await readDb();
        let messages = db.messages || [];

        // Single message lookup by ID
        if (id) {
            const message = messages.find((m: any) => m.id === parseInt(id));

            // Ensure user can only view their own message or admin viewing club messages
            if (message) {
                const session = await requireAuth();
                const canView =
                    message.userId == session.id ||
                    message.userId == session.username ||
                    (session.role === 'super_admin') ||
                    (session.role === 'club_admin' && session.clubId === message.clubId);

                if (!canView) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
                }

                return NextResponse.json(message);
            }
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // List messages - filter by clubId AND/OR userId
        if (clubId && userId) {
            // When both provided: user viewing their own messages for a specific club
            messages = messages.filter((m: any) =>
                m.clubId === parseInt(clubId) &&
                (m.userId == userId) // User can only see their own messages
            );
        } else if (clubId) {
            // Only clubId: Admin viewing all club messages (requires auth)
            const session = await requireAuth();
            const canViewAll =
                session.role === 'super_admin' ||
                (session.role === 'club_admin' && session.clubId === parseInt(clubId));

            if (!canViewAll) {
                return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
            }

            messages = messages.filter((m: any) => m.clubId === parseInt(clubId));
        } else if (userId) {
            // Only userId: User viewing all their messages across all clubs
            const session = await requireAuth();

            // User can only view their own messages
            if (String(session.id) !== userId && session.username !== userId) {
                return NextResponse.json({ error: 'Forbidden - Can only view own messages' }, { status: 403 });
            }

            messages = messages.filter((m: any) => m.userId == userId);
        } else {
            return NextResponse.json({ error: 'Missing filter (clubId or userId required)' }, { status: 400 });
        }

        // Sort by Date Descending
        messages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(messages);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function POST(request: Request) {
    try {
        // Require authentication to send messages
        const session = await requireAuth();
        const body = await request.json();

        // Validate and sanitize input
        const validation = validateMessage(body);
        if (!validation.isValid) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.errors
            }, { status: 400 });
        }

        const sanitizedData = validation.sanitized!;

        const db = await readDb();

        if (!db.messages) db.messages = [];

        const newMessage = {
            id: Date.now(),
            clubId: sanitizedData.clubId,
            userId: sanitizedData.userId || session.id,
            senderName: sanitizedData.senderName || session.name || session.username,
            subject: sanitizedData.subject,
            topic: sanitizedData.topic || 'Genel',
            content: sanitizedData.content,
            createdAt: new Date().toISOString(),
            status: 'sent', // 'sent', 'read', 'in_progress', 'resolved', 'closed'
            priority: 'medium', // 'low', 'medium', 'high'
            internalNotes: [], // Array of { note: string, date: string, admin: string }
            readAt: null,
            answeredAt: null,
            response: null
        };

        db.messages.push(newMessage);
        await writeDb(db);

        return NextResponse.json(newMessage);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const db = await readDb();

        if (!db.messages) return NextResponse.json({ error: 'No messages found' }, { status: 404 });

        const currentMsg = db.messages.find((m: any) => m.id === body.id);
        if (!currentMsg) return NextResponse.json({ error: 'Message not found' }, { status: 404 });

        // Require club access to modify messages (admin operations)
        await requireClubAccess(currentMsg.clubId);

        const index = db.messages.findIndex((m: any) => m.id === body.id);
        const updates: any = {};

        // Status Update
        if (body.status) updates.status = body.status;

        // Priority Update
        if (body.priority) updates.priority = body.priority;

        // Internal Note Add
        if (body.newNote) {
            const session = await requireAuth();
            const checkoutNotes = currentMsg.internalNotes || [];
            updates.internalNotes = [...checkoutNotes, {
                note: body.newNote,
                date: new Date().toISOString(),
                admin: session.name || session.username
            }];
        }

        // Reply Logic
        if (body.response) {
            updates.response = body.response;
            updates.status = 'resolved'; // Auto-resolve on reply
            updates.answeredAt = new Date().toISOString();
        }

        // Mark Read Logic
        if (body.read === true && currentMsg.status === 'sent') {
            updates.status = 'read';
            updates.readAt = new Date().toISOString();
        }

        db.messages[index] = { ...currentMsg, ...updates };
        await writeDb(db);

        return NextResponse.json(db.messages[index]);
    } catch (error: any) {
        return handleAuthError(error);
    }
}
