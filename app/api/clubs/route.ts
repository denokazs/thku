
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireAuth, requireRole, requireClubAccess, handleAuthError } from '@/lib/auth';
import { validateClub } from '@/lib/validation';
import { withApiLogging } from '@/lib/with-logging';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Wrap GET with logging
export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const includeStats = searchParams.get('includeStats');

        const db = await readDb(['clubs', 'members', 'events']);
        let clubs = db.clubs || [];

        if (category) {
            clubs = clubs.filter((club: any) => club.category === category);
        }

        // Sort by displayOrder (ascending) then by name
        clubs.sort((a: any, b: any) => {
            const orderA = a.displayOrder ?? 9999;
            const orderB = b.displayOrder ?? 9999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

        // Add member counts if requested
        if (includeStats === 'true') {
            clubs = clubs.map((club: any) => ({
                ...club,
                _count: {
                    members: db.members?.filter((m: any) => m.clubId === club.id).length || 0,
                    events: db.events?.filter((e: any) => e.clubId === club.id).length || 0
                }
            }));
        }

        return NextResponse.json(clubs);
    } catch (error: any) {
        try {
            const fs = require('fs');
            fs.appendFileSync('api_debug.log', `[${new Date().toISOString()}] CLUB API ERROR: ${error.message}\n${error.stack}\n`);
        } catch (e) { }
        return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate and sanitize input
        const validation = validateClub(body);
        if (!validation.isValid) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.errors
            }, { status: 400 });
        }

        const sanitizedData = validation.sanitized!;
        const { badges, displayOrder } = body; // Get extra fields even if not in standard validation

        // Check authentication: Accept EITHER admin JWT OR super_admin role
        const { verifyAdminAuth } = await import('@/lib/admin-auth');
        const { getSession } = await import('@/lib/auth');

        const isAdminJWT = await verifyAdminAuth();
        const session = await getSession();
        const isSuperAdmin = session?.role === 'super_admin';

        if (!isAdminJWT && !isSuperAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized. Admin or super_admin access required.' },
                { status: 401 }
            );
        }

        const db = await readDb(['clubs']);
        if (!db.clubs) db.clubs = [];

        // Check if slug already exists
        if (db.clubs.some((c: any) => c.slug === sanitizedData.slug)) {
            return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
        }

        // Create new club with ID
        const newClub = {
            ...sanitizedData,
            id: Date.now(), // Simple ID generation
            badges: badges ? JSON.stringify(badges) : '[]',
            displayOrder: displayOrder || 9999,
            // Ensure complex objects are stringified for SQL
            president: sanitizedData.president ? JSON.stringify(sanitizedData.president) : '{}',
            socialMedia: sanitizedData.socialMedia ? JSON.stringify(sanitizedData.socialMedia) : '{}',
            gallery: sanitizedData.gallery ? JSON.stringify(sanitizedData.gallery) : '[]',
        };

        db.clubs.push(newClub);
        await writeDb(db);

        return NextResponse.json(newClub, { status: 201 });
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        // Validate and sanitize input
        const validation = validateClub(body);
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

        const isAdminJWT = await verifyAdminAuth(); // Legacy Super Admin Token
        const session = await getSession();

        const isSuperAdmin = isAdminJWT || session?.role === 'super_admin';

        // If not super admin, verify club admin access
        if (!isSuperAdmin) {
            await requireClubAccess(sanitizedData.id);
        }

        const db = await readDb(['clubs']); // Await readDb()
        if (!db.clubs) db.clubs = [];

        const index = db.clubs.findIndex((c: any) => c.id === sanitizedData.id);
        if (index === -1) {
            return NextResponse.json({ error: 'Club not found' }, { status: 404 });
        }

        // --- FORTRESS CODE: MASS ASSIGNMENT PROTECTION ---

        // 1. Basic Fields (Allowed for Club Admin)
        const safeUpdate: any = {
            name: sanitizedData.name,
            description: sanitizedData.description,
            longDescription: sanitizedData.longDescription,
            // START FIX: Stringify JSON fields for DB storage
            socialMedia: sanitizedData.socialMedia ? JSON.stringify(sanitizedData.socialMedia) : undefined,
            president: sanitizedData.president ? JSON.stringify(sanitizedData.president) : undefined,
            // END FIX
            email: sanitizedData.email,
            phone: sanitizedData.phone,
            website: sanitizedData.website,
            logo: sanitizedData.logo,
            logoBackground: sanitizedData.logoBackground,
            coverImage: sanitizedData.coverImage,
            headerImage: sanitizedData.headerImage,
            meetingDay: sanitizedData.meetingDay,
            meetingLocation: sanitizedData.meetingLocation,
            gallery: sanitizedData.gallery, // Gallery is usually an array, verify if needs stringify (POST does it)
        };

        // 2. Sensitive Fields (Super Admin ONLY)
        if (isSuperAdmin) {
            if (body.badges !== undefined) safeUpdate.badges = body.badges;
            if (body.displayOrder !== undefined) safeUpdate.displayOrder = Number(body.displayOrder);
            if (body.category !== undefined) safeUpdate.category = body.category;
            if (body.slug !== undefined) safeUpdate.slug = body.slug;
            if (body.isOfficial !== undefined) safeUpdate.isOfficial = body.isOfficial;
        }

        // Remove undefined keys
        Object.keys(safeUpdate).forEach(key => safeUpdate[key] === undefined && delete safeUpdate[key]);

        console.log('PUT /api/clubs - Secure Update:', {
            id: sanitizedData.id,
            role: isSuperAdmin ? 'SUPER_ADMIN' : 'CLUB_ADMIN',
            updatedFields: Object.keys(safeUpdate)
        });

        db.clubs[index] = { ...db.clubs[index], ...safeUpdate };
        await writeDb(db);

        return NextResponse.json(db.clubs[index]);
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        // Check authentication
        const { verifyAdminAuth } = await import('@/lib/admin-auth');
        const { getSession } = await import('@/lib/auth');

        const isAdminJWT = await verifyAdminAuth();
        const session = await getSession();
        const isSuperAdmin = isAdminJWT || session?.role === 'super_admin';

        if (!isSuperAdmin) {
            return NextResponse.json(
                { error: 'Unauthorized. Super admin access required.' },
                { status: 401 }
            );
        }

        if (!id) {
            return NextResponse.json({ error: 'Club ID required' }, { status: 400 });
        }

        const db = await readDb(['clubs']);
        if (!db.clubs) db.clubs = [];

        const clubId = parseInt(id);

        const initialLength = db.clubs.length;
        db.clubs = db.clubs.filter((c: any) => c.id !== clubId);

        if (db.clubs.length === initialLength) {
            return NextResponse.json({ error: 'Club not found' }, { status: 404 });
        }

        await writeDb(db);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 });
    }
}
