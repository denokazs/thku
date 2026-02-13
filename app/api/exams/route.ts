import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const db = await readDb();

        let exams = db.exams || [];

        // Simple filtering
        if (code) {
            exams = exams.filter((e: any) => e.courseCode.toLowerCase().includes(code.toLowerCase()));
        }

        // Filter out pending
        exams = exams.filter((e: any) => e.status !== 'pending');

        // Sort by newest
        exams.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
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
        const { courseCode, courseName, year, term, fileUrl } = body;

        if (!courseCode || !fileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Basic URL validation
        if (!fileUrl.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        const db = await readDb();

        const newExam = {
            id: crypto.randomUUID(),
            courseCode: courseCode.toUpperCase(),
            courseName: courseName || '',
            year,
            term,
            fileUrl,
            status: 'pending',
            uploadedBy: session.id.toString(), // Enforce session ID
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
