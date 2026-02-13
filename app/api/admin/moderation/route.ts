import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET(request: Request) {
    try {
        const isAdmin = await verifyAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'pending';

        const db = await readDb();

        // Aggregation
        const posts = (db.forumPosts || [])
            .filter((p: any) => p.status === status)
            .map((p: any) => ({ ...p, type: 'post' }));

        const notes = (db.lectureNotes || [])
            .filter((n: any) => n.status === status)
            .map((n: any) => ({ ...n, type: 'note' }));

        const teachers = (db.teachers || [])
            .filter((t: any) => t.status === status)
            .map((t: any) => ({ ...t, type: 'teacher' }));

        const exams = (db.exams || [])
            .filter((e: any) => e.status === status)
            .map((e: any) => ({ ...e, type: 'exam' }));

        const ratings: any[] = [];
        (db.teachers || []).forEach((t: any) => {
            (t.ratings || []).forEach((r: any) => {
                if (r.status === status) {
                    ratings.push({ ...r, teacherName: t.name, teacherId: t.id, type: 'rating' });
                }
            });
        });

        // For approved posts, we might want to also return comments if needed, 
        // but for now let's keep it simple at the item level.

        return NextResponse.json({
            posts,
            notes,
            ratings,
            teachers,
            exams
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch moderation queue' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const isAdmin = await verifyAdminAuth();
        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, id, action, teacherId } = body; // action: 'approve' | 'reject' | 'delete'

        if (!type || !id || !action) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const db = await readDb();
        let found = false;

        if (type === 'post') {
            const post = db.forumPosts?.find((p: any) => p.id === id);
            if (post) {
                if (action === 'approve') post.status = 'approved';
                else if (action === 'reject' || action === 'delete') db.forumPosts = db.forumPosts.filter((p: any) => p.id !== id);
                else post.status = action === 'approve' ? 'approved' : 'rejected'; // Fallback
                found = true;
            }
        } else if (type === 'note') {
            const note = db.lectureNotes?.find((n: any) => n.id === id);
            if (note) {
                if (action === 'delete') db.lectureNotes = db.lectureNotes.filter((n: any) => n.id !== id);
                else note.status = action === 'approve' ? 'approved' : 'rejected';
                found = true;
            }
        } else if (type === 'exam') {
            const exam = db.exams?.find((e: any) => e.id === id);
            if (exam) {
                if (action === 'delete') db.exams = db.exams.filter((e: any) => e.id !== id);
                else exam.status = action === 'approve' ? 'approved' : 'rejected';
                found = true;
            }
        } else if (type === 'rating') {
            const teacher = db.teachers?.find((t: any) => t.id === teacherId);
            if (teacher) {
                const rating = teacher.ratings?.find((r: any) => r.id === id);
                if (rating) {
                    if (action === 'delete') teacher.ratings = teacher.ratings.filter((r: any) => r.id !== id);
                    else rating.status = action === 'approve' ? 'approved' : 'rejected';
                    found = true;
                }
            }
        } else if (type === 'teacher') {
            const teacher = db.teachers?.find((t: any) => t.id === id);
            if (teacher) {
                if (action === 'delete') db.teachers = db.teachers.filter((t: any) => t.id !== id);
                else {
                    teacher.status = action === 'approve' ? 'approved' : 'rejected';
                    if (action === 'reject') {
                        db.teachers = db.teachers.filter((t: any) => t.id !== id);
                    }
                }
                found = true;
            }
        }

        if (!found) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        await writeDb(db);
        return NextResponse.json({ success: true, message: `Item ${action}d` });
    } catch (error) {
        return NextResponse.json({ error: 'Moderation action failed' }, { status: 500 });
    }
}
