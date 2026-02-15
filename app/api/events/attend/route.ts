
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

// Helper: ensure the attendance table exists (MySQL only)
async function ensureAttendanceTable() {
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';
    if (!useMysql) return; // SQLite tables are assumed to exist

    try {
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'thk_db',
        });

        await pool.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id BIGINT NOT NULL,
                eventId BIGINT DEFAULT NULL,
                userId VARCHAR(255) DEFAULT NULL,
                joinedAt VARCHAR(100) DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY unique_attendance (eventId, userId)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await pool.end();
    } catch (e) {
        console.error('Failed to ensure attendance table:', e);
    }
}

// Run once on cold start
let tableEnsured = false;
async function ensureOnce() {
    if (!tableEnsured) {
        await ensureAttendanceTable();
        tableEnsured = true;
    }
}

export async function POST(request: Request) {
    try {
        await ensureOnce();

        const body = await request.json();
        const { eventId, userId } = body;

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
        }

        const db = await readDb(['attendance', 'events']);
        const attendance = db.attendance || [];
        const events = db.events || [];

        // Check if already attended - use string comparison for safety
        const eventIdStr = String(eventId);
        const userIdStr = String(userId);
        const existing = attendance.find((a: any) => String(a.eventId) === eventIdStr && String(a.userId) === userIdStr);
        if (existing) {
            return NextResponse.json({ error: 'Already attended' }, { status: 400 });
        }

        // Check Capacity
        const event = events.find((e: any) => String(e.id) === eventIdStr);
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
        const eventIndex = events.findIndex((e: any) => String(e.id) === eventIdStr);
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
        await ensureOnce();

        const { searchParams } = new URL(request.url);
        const eventId = searchParams.get('eventId');
        const userId = searchParams.get('userId');

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing params' }, { status: 400 });
        }

        const db = await readDb(['attendance', 'events']);
        const attendance = db.attendance || [];

        // Use string comparison for safety
        const eventIdStr = String(eventId);
        const userIdStr = String(userId);
        const hasJoined = attendance.some((a: any) => String(a.eventId) === eventIdStr && String(a.userId) === userIdStr);

        return NextResponse.json({ hasJoined });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await ensureOnce();

        const body = await request.json();
        const { eventId, userId } = body;

        if (!eventId || !userId) {
            return NextResponse.json({ error: 'Missing eventId or userId' }, { status: 400 });
        }

        const db = await readDb(['attendance', 'events']);
        const attendance = db.attendance || [];
        const events = db.events || [];

        // Use string comparison for safety
        const eventIdStr = String(eventId);
        const userIdStr = String(userId);

        // Find and remove attendance
        const initialLength = attendance.length;
        db.attendance = attendance.filter((a: any) => !(String(a.eventId) === eventIdStr && String(a.userId) === userIdStr));

        if (db.attendance.length === initialLength) {
            return NextResponse.json({ error: 'Attendance not found' }, { status: 404 });
        }

        // Update event attendee count
        const eventIndex = events.findIndex((e: any) => String(e.id) === eventIdStr);
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
