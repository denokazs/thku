import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teacherId, userId, score, comment } = body;

        if (!teacherId || !userId || !score) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await readDb();
        const teacher = db.teachers?.find((t: any) => t.id === teacherId);

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        if (!teacher.ratings) teacher.ratings = [];

        // Check if user already rated
        const existingRating = teacher.ratings.find((r: any) => r.userId === userId);
        if (existingRating) {
            return NextResponse.json({ error: 'You have already rated this teacher' }, { status: 409 });
        }

        const newRating = {
            id: crypto.randomUUID(),
            userId,
            score: Number(score),
            comment: comment || '',
            status: 'pending', // Strict moderation
            createdAt: new Date().toISOString()
        };

        teacher.ratings.push(newRating);
        await writeDb(db);

        return NextResponse.json({ success: true, message: 'Rating submitted for approval' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
    }
}
