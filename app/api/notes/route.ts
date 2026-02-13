import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const course = searchParams.get('course'); // Filter by course code
        const db = await readDb();

        let notes = (db.lectureNotes || [])
            .filter((n: any) => n.status === 'approved');

        if (course) {
            notes = notes.filter((n: any) => n.course.toLowerCase().includes(course.toLowerCase()));
        }

        // Sort by newest
        notes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, course, fileUrl } = body;


        if (!title || !fileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        try {
            const url = new URL(fileUrl);
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return NextResponse.json({ error: 'Only HTTP/HTTPS URLs are allowed' }, { status: 400 });
            }
            // Basic localhost blocking (simple SSRF mitigation)
            const hostname = url.hostname.toLowerCase();
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
                return NextResponse.json({ error: 'Internal network URLs are not allowed' }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }


        const db = await readDb();

        const newNote = {
            id: crypto.randomUUID(),
            title,
            course: course ? course.toUpperCase() : 'GENEL',
            fileUrl,
            uploadedBy: session.id.toString(), // Enforce session ID
            uploadedByName: session.name || session.username || 'Öğrenci',
            status: 'pending', // Strict moderation
            createdAt: new Date().toISOString()
        };

        if (!db.lectureNotes) db.lectureNotes = [];

        db.lectureNotes.push(newNote);
        await writeDb(db);

        return NextResponse.json({ success: true, message: 'Note uploaded for approval' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to upload note' }, { status: 500 });
    }
}
