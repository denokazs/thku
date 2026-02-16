import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';


export async function GET() {
    try {
        const db = await readDb(['forumPosts']);
        // Filter only approved posts for the public feed
        const approvedPosts = (db.forumPosts || [])
            .filter((post: any) => post.status === 'approved')
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(approvedPosts);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

import { getSession } from '@/lib/auth';
import { sanitizeString } from '@/lib/sanitize';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
    try {
        // 1. Rate Check (2 posts per hour)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const limiter = rateLimit(ip + '_forum_post', { limit: 2, windowMs: 60 * 60 * 1000 });

        if (!limiter.success) {
            return NextResponse.json({ error: 'Çok fazla konu açtınız. Lütfen biraz bekleyiniz.' }, { status: 429 });
        }

        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, image, category } = body;

        if (!content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await readDb(['forumPosts']);

        const newPost = {
            id: crypto.randomUUID(),
            userId: session.id.toString(),
            authorName: sanitizeString(session.name || session.username || 'Anonymous'),
            authorAvatar: '👤', // Default avatar
            content: sanitizeString(content), // Prevent XSS
            image: image || '',
            likes: [],
            comments: [],
            category: category ? sanitizeString(category) : 'General',
            status: 'pending', // Strict moderation: always pending first
            createdAt: new Date().toISOString()
        };

        if (!db.forumPosts) {
            db.forumPosts = [];
        }

        db.forumPosts.push(newPost);
        await writeDb(db);

        return NextResponse.json({ success: true, message: 'Post submitted for approval' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
    }
}
