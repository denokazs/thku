
import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');

        if (!eventId) {
            return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
        }

        const db = await readDb(['attendance', 'users']);
        const attendance = db.attendance || [];
        const users = db.users || [];

        // Filter attendance for this event
        const eventAttendance = attendance.filter((a: any) => a.eventId == eventId);

        // Get user details
        const attendees = eventAttendance.map((a: any) => {
            const user = users.find((u: any) => u.id == a.userId || u.username === a.userId);
            if (!user) return null;

            return {
                id: user.id,
                name: user.name || user.username, // Fallback if name is missing
                email: user.email,
                phone: user.phone,
                studentId: user.studentId
            };
        }).filter(Boolean); // Remove nulls

        return NextResponse.json(attendees);
    } catch (error) {
        console.error('Attendees fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
