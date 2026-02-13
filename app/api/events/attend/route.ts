
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventId, userId } = body;

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
        }

        const db = await readDb();
        const attendance = db.attendance || [];
        const events = db.events || [];

        // Check if already attended
        const existing = attendance.find((a: any) => a.eventId === eventId && a.userId === userId);
        if (existing) {
            return NextResponse.json({ error: 'Already attended' }, { status: 400 });
        }

        // Check Capacity
        const event = events.find((e: any) => e.id === eventId);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Handle string/number capacity and -1 for unlimited
        const capacity = parseInt(String(event.capacity || '-1'));
        if (capacity !== -1 && (event.attendees || 0) >= capacity) {
            return NextResponse.json({ error: 'Etkinlik kontenjanı dolmuştur.' }, { status: 400 });
        }

        // Add attendance record
        const newAttendance = {
            id: Date.now(),
            eventId,
            userId,
            joinedAt: new Date().toISOString()
        };

        // Initialize attendance array if not exists
        if (!db.attendance) db.attendance = [];
        db.attendance.push(newAttendance);

        // Update event attendee count
        const eventIndex = events.findIndex((e: any) => e.id === eventId);
        let currentAttendees = 0;
        if (eventIndex !== -1) {
            events[eventIndex].attendees = (events[eventIndex].attendees || 0) + 1;
            currentAttendees = events[eventIndex].attendees;
        }

        await writeDb(db);

        return NextResponse.json({ success: true, attendance: newAttendance, attendees: currentAttendees });

    } catch (error) {
        console.error('Attendance error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');
        const userId = searchParams.get('userId');

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 });
        }

        const db = await readDb();
        const attendance = db.attendance || [];

        const hasJoined = attendance.some((a: any) => a.eventId == eventId && a.userId == userId); // loose match for IDs

        return NextResponse.json({ hasJoined });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { eventId, userId } = body;

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
        }

        const db = await readDb();
        const attendance = db.attendance || [];
        const events = db.events || [];

        // Find and remove attendance
        const initialLength = attendance.length;
        db.attendance = attendance.filter((a: any) => !(a.eventId == eventId && a.userId == userId));

        if (db.attendance.length === initialLength) {
            return NextResponse.json({ error: 'Attendance not found' }, { status: 404 });
        }

        // Update event attendee count
        const eventIndex = events.findIndex((e: any) => e.id == eventId);
        let currentAttendees = 0;
        if (eventIndex !== -1) {
            events[eventIndex].attendees = Math.max(0, (events[eventIndex].attendees || 0) - 1);
            currentAttendees = events[eventIndex].attendees;
        }

        await writeDb(db);

        return NextResponse.json({ success: true, attendees: currentAttendees });

    } catch (error) {
        console.error('Unjoin error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
