import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
    try {
        const db = await readDb();
        const teachers = (db.teachers || [])
            .filter((t: any) => t.status !== 'pending') // Filter out pending teachers
            .map((teacher: any) => {
                // Calculate stats from approved ratings only
                const approvedRatings = (teacher.ratings || []).filter((r: any) => r.status === 'approved');
                const totalScore = approvedRatings.reduce((sum: number, r: any) => sum + r.score, 0);
                const average = approvedRatings.length > 0 ? (totalScore / approvedRatings.length).toFixed(1) : 'Yeni';

                return {
                    ...teacher,
                    ratings: approvedRatings, // Only return approved comments
                    averageRating: average,
                    ratingCount: approvedRatings.length
                };
            });

        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
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
        const { name, department, image } = body;

        if (!name || !department) {
            return NextResponse.json({ error: 'Name and Department are required' }, { status: 400 });
        }

        // Validate image URL if provided
        if (image && !image.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid Image URL' }, { status: 400 });
        }

        const db = await readDb();

        const newTeacher = {
            id: crypto.randomUUID(),
            name,
            department,
            image: image || '👨‍🏫',
            ratings: [],
            status: 'pending', // Always pending initially, requiring admin approval
            addedBy: session.id.toString() // Enforce session ID
        };

        if (!db.teachers) db.teachers = [];

        db.teachers.push(newTeacher);
        await writeDb(db);

        return NextResponse.json({ success: true, teacher: newTeacher }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
