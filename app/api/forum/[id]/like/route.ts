import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

import { getSession } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const userId = session.id.toString();

        const db = await readDb();
        const post = db.forumPosts?.find((p: any) => p.id === id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Initialize likes if not exists
        if (!post.likes) post.likes = [];

        const index = post.likes.indexOf(userId);
        if (index === -1) {
            // Like
            post.likes.push(userId);
        } else {
            // Unlike
            post.likes.splice(index, 1);
        }

        await writeDb(db);

        return NextResponse.json({
            success: true,
            liked: index === -1,
            likesCount: post.likes.length
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update like' }, { status: 500 });
    }
}
