
import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const userId = params.id;

        const db = await readDb();
        const attendance = db.attendance || [];
        const events = db.events || [];
        const users = db.users || [];

        // Resolve user to get both ID and Username
        const targetUser = users.find((u: any) => String(u.id) === String(userId) || u.username === userId);

        const targetIds = new Set<string>();
        if (targetUser) {
            if (targetUser.id) targetIds.add(String(targetUser.id));
            if (targetUser.username) targetIds.add(String(targetUser.username));
        } else {
            // Fallback if user not found (e.g. direct param usage)
            targetIds.add(String(userId));
        }

        // Find events attended by user (matching either ID or Username)
        const userAttendance = attendance.filter((a: any) => targetIds.has(String(a.userId)));

        const userEvents = userAttendance.map((a: any) => {
            const event = events.find((e: any) => e.id == a.eventId); // loose match for ID safety
            return event ? { ...event, joinedAt: a.joinedAt } : null;
        }).filter(Boolean);

        return NextResponse.json(userEvents);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user events' }, { status: 500 });
    }
}
