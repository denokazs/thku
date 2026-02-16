import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Auto-create lecture_notes table on Railway MySQL
let tableEnsured = false;
async function ensureNotesTable() {
    if (tableEnsured) return;
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';
    if (!useMysql) { tableEnsured = true; return; }

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
            CREATE TABLE IF NOT EXISTS lecture_notes (
                id VARCHAR(255) NOT NULL,
                title VARCHAR(500) NOT NULL,
                course VARCHAR(50) DEFAULT 'GENEL',
                fileUrl TEXT DEFAULT NULL,
                uploadedBy VARCHAR(255) DEFAULT NULL,
                uploadedByName VARCHAR(255) DEFAULT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                moderatedAt VARCHAR(100) DEFAULT NULL,
                moderatedBy VARCHAR(255) DEFAULT NULL,
                createdAt VARCHAR(100) DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await pool.end();
        tableEnsured = true;
    } catch (e) {
        console.error('Failed to ensure lecture_notes table:', e);
    }
}

export async function GET(request: Request) {
    try {
        await ensureNotesTable();
        const { searchParams } = new URL(request.url);
        const course = searchParams.get('course');
        const showAll = searchParams.get('all') === 'true';
        const db = await readDb(['lectureNotes']);

        let notes = db.lectureNotes || [];

        if (course) {
            notes = notes.filter((n: any) => (n.course || '').toLowerCase().includes(course.toLowerCase()));
        }

        // For admin: show all including pending. For public: only approved
        if (showAll) {
            const session = await getSession();
            if (!session || session.role !== 'super_admin') {
                notes = notes.filter((n: any) => n.status === 'approved');
            }
        } else {
            notes = notes.filter((n: any) => n.status === 'approved');
        }

        notes.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(notes);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureNotesTable();
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
            const hostname = url.hostname.toLowerCase();
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
                return NextResponse.json({ error: 'Internal network URLs are not allowed' }, { status: 400 });
            }
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        const db = await readDb(['lectureNotes']);

        const newNote = {
            id: crypto.randomUUID(),
            title,
            course: course ? course.toUpperCase() : 'GENEL',
            fileUrl,
            uploadedBy: session.id.toString(),
            uploadedByName: session.name || session.username || 'Öğrenci',
            status: 'pending',
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

export async function PUT(request: Request) {
    try {
        await ensureNotesTable();
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const db = await readDb(['lectureNotes']);
        const notes = db.lectureNotes || [];
        const noteIndex = notes.findIndex((n: any) => n.id === id);

        if (noteIndex === -1) {
            return NextResponse.json({ error: 'Note not found' }, { status: 404 });
        }

        notes[noteIndex].status = status;
        notes[noteIndex].moderatedAt = new Date().toISOString();
        notes[noteIndex].moderatedBy = session.username;

        db.lectureNotes = notes;
        await writeDb(db);

        return NextResponse.json({ success: true, note: notes[noteIndex] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await ensureNotesTable();
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const db = await readDb(['lectureNotes']);
        db.lectureNotes = (db.lectureNotes || []).filter((n: any) => n.id !== id);
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
    }
}
