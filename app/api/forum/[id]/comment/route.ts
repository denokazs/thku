import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

import { getSession } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params; // Post ID
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await readDb();
        const post = db.forumPosts?.find((p: any) => p.id === id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Initialize comments if not exists
        if (!post.comments) post.comments = [];

        const newComment = {
            id: crypto.randomUUID(),
            userId: session.id.toString(),
            author: session.name || session.username || 'Anonymous',
            text,
            createdAt: new Date().toISOString()
        };

        post.comments.push(newComment);
        await writeDb(db);

        return NextResponse.json({
            success: true,
            comment: newComment,
            commentsCount: post.comments.length
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
    }
}
