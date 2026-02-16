import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const showAll = searchParams.get('all') === 'true';
        const db = await readDb(['exams']);

        let exams = db.exams || [];

        // Simple filtering
        if (code) {
            exams = exams.filter((e: any) => e.courseCode.toLowerCase().includes(code.toLowerCase()));
        }

        // For admin: show all including pending. For public: hide pending
        if (showAll) {
            const session = await getSession();
            if (!session || session.role !== 'super_admin') {
                // Non-admins can't bypass the filter
                exams = exams.filter((e: any) => e.status !== 'pending');
            }
            // else: admin sees everything
        } else {
            exams = exams.filter((e: any) => e.status !== 'pending');
        }

        // Sort by newest
        exams.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { courseCode, courseName, year, term, fileUrl } = body;

        if (!courseCode || !fileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Basic URL validation
        if (!fileUrl.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const db = await readDb(['exams']);

        const newExam = {
            id: crypto.randomUUID(),
            courseCode: courseCode.toUpperCase(),
            courseName: courseName || '',
            year,
            term,
            fileUrl,
            status: 'pending',
            uploadedBy: session.id.toString(),
            uploadedByName: session.name || session.username || 'Öğrenci',
            createdAt: new Date().toISOString()
        };

        if (!db.exams) db.exams = [];

        db.exams.push(newExam);
        await writeDb(db);

        return NextResponse.json({ success: true, exam: newExam }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add exam' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const db = await readDb(['exams']);
        const exams = db.exams || [];
        const examIndex = exams.findIndex((e: any) => e.id === id);

        if (examIndex === -1) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
        }

        exams[examIndex].status = status;
        exams[examIndex].moderatedAt = new Date().toISOString();
        exams[examIndex].moderatedBy = session.username;

        db.exams = exams;
        await writeDb(db);

        return NextResponse.json({ success: true, exam: exams[examIndex] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const db = await readDb(['exams']);
        db.exams = (db.exams || []).filter((e: any) => e.id !== id);
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
    }
}
