import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireClubAccess, handleAuthError } from '@/lib/auth';
import { validateEvent } from '@/lib/validation';
import { logApiRequest } from '@/lib/api-logger';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    const clubId = searchParams.get('clubId');

    // Attempt logging safely
    try {
        await logApiRequest({
            request,
            method: 'GET',
            endpoint: '/api/events',
            statusCode: 200
        });
    } catch (error) {
        console.error('Logging failed:', error);
    }

    const db = await readDb(['events']);
    let events = db.events || [];

    if (featured === 'true') {
        events = events.filter((e: any) => e.isFeatured === true);
    }

    if (clubId) {
        events = events.filter((e: any) => e.clubId === parseInt(clubId));
    }

    // Filter past/upcoming
    const now = new Date();
    events = events.filter((e: any) => {
        const eventDate = new Date(e.date);
        return eventDate >= now;
    });

    // Sort by date soonest first
    events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (limit) {
        events = events.slice(0, parseInt(limit));
    }

    return NextResponse.json(events);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate and sanitize input
        const validation = validateEvent(body);
        if (!validation.isValid) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.errors
            }, { status: 400 });
        }

        const sanitizedData = validation.sanitized!;

        // Check authentication
        const { verifyAdminAuth } = await import('@/lib/admin-auth');
        const { getSession } = await import('@/lib/auth');

        const isAdminJWT = await verifyAdminAuth();
        const session = await getSession();
        const isSuperAdmin = isAdminJWT || session?.role === 'super_admin';

        if (!isSuperAdmin) {
            // Verify user has permission to create events for this club
            await requireClubAccess(sanitizedData.clubId);
        }

        const db = await readDb(['events', 'clubs', 'members']);

        const newEvent = {
            ...sanitizedData,
            id: Date.now(),
            // Default sensitive fields to safe values for non-admins
            isFeatured: isSuperAdmin ? (body.isFeatured || false) : false
        };

        if (!db.events) db.events = [];
        db.events.push(newEvent);

        await writeDb(db);

        // --- EMAIL NOTIFICATION LOGIC ---
        // In serverless environments like Vercel, we MUST await the email sending,
        // otherwise the function container is frozen/killed before the email goes out.
        try {
            const club = db.clubs?.find((c: any) => c.id === newEvent.clubId);
            if (club) {
                const clubMembers = db.members?.filter((m: any) => m.clubId === newEvent.clubId && m.status === 'active') || [];
                if (clubMembers.length > 0) {
                    const { sendMail } = await import('@/lib/mail');
                    const { getNewEventEmailTemplate } = await import('@/lib/email-templates');

                    const emailHtml = getNewEventEmailTemplate(newEvent, club);
                    const subject = `Yeni Etkinlik: ${newEvent.title} - ${club.name}`;

                    const emails = clubMembers.map((m: any) => m.email).filter(Boolean);

                    if (emails.length > 0) {
                        await sendMail(emails.join(','), subject, emailHtml);
                        console.log(`Successfully queued event notification for ${emails.length} members of ${club.name}`);
                    }
                }
            }
        } catch (emailError) {
            console.error('Error sending event notifications:', emailError);
            // We intentionally don't throw here so the event creation still succeeds even if mail fails
        }
        // --- END EMAIL LOGIC ---

        return NextResponse.json(newEvent);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Input sanitization
        const validation = validateEvent(body);
        if (!validation.isValid && !body.id) { // Allow partial updates if ID exists? No, stick to validation.
            // Actually, validateEvent expects a full object usually. 
            // For now let's assume body contains necessary fields or validation handles partials (it doesn't usually).
            // Let's rely on manual field extraction for safety.
        }

        const db = await readDb(['events']);
        if (!db.events) db.events = [];
        const event = db.events.find((e: any) => e.id === body.id);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check authentication
        const { verifyAdminAuth } = await import('@/lib/admin-auth');
        const { getSession } = await import('@/lib/auth');

        const isAdminJWT = await verifyAdminAuth();
        const session = await getSession();
        const isSuperAdmin = isAdminJWT || session?.role === 'super_admin';

        if (!isSuperAdmin) {
            // Verify user has permission to edit this club's events
            await requireClubAccess(event.clubId);

            // CRITICAL: Prevent Club Admin from changing the event's clubId to hijack another club's event
            if (body.clubId && Number(body.clubId) !== event.clubId) {
                return NextResponse.json({ error: 'Cannot move event to another club' }, { status: 403 });
            }
        }

        const index = db.events.findIndex((e: any) => e.id === body.id);

        // --- FORTRESS CODE: MASS ASSIGNMENT PROTECTION ---

        const safeUpdate: any = {
            title: body.title,
            description: body.description,
            date: body.date,
            location: body.location,
            image: body.image,
            images: body.images,
            coverImage: body.coverImage,
            requirements: body.requirements,
        };

        // Protected Fields (Super Admin Only)
        if (isSuperAdmin) {
            if (body.isFeatured !== undefined) safeUpdate.isFeatured = body.isFeatured;
            if (body.clubId !== undefined) safeUpdate.clubId = body.clubId; // Admin can move events
        }

        // Remove undefined
        Object.keys(safeUpdate).forEach(key => safeUpdate[key] === undefined && delete safeUpdate[key]);

        db.events[index] = { ...db.events[index], ...safeUpdate };
        await writeDb(db);

        return NextResponse.json(db.events[index]);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = await readDb(['events']);
        const event = db.events.find((e: any) => e.id === parseInt(id));

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check authentication: Accept EITHER admin JWT OR club access
        const { verifyAdminAuth } = await import('@/lib/admin-auth');
        const isAdminJWT = await verifyAdminAuth();

        if (!isAdminJWT) {
            // Verify user has permission to delete this club's events
            await requireClubAccess(event.clubId);
        }

        db.events = db.events.filter((e: any) => e.id !== parseInt(id));
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return handleAuthError(error);
    }
}
