'use server';

import { readDb, writeDb } from '@/lib/db';
import { Comment } from '@/types';

// Helper to get comments from DB
async function getCommentsDB() {
    const db = await readDb(['comments']);
    return Array.isArray(db.comments) ? db.comments : [];
}

export async function getCommentsAction(confessionId?: number): Promise<Comment[]> {
    const comments = await getCommentsDB();
    if (confessionId !== undefined) {
        return comments.filter((c: Comment) => c.confessionId === confessionId);
    }
    return comments;
}

export async function addCommentAction(
    confessionId: number,
    text: string,
    user: string,
    parentCommentId?: number
): Promise<Comment> {
    const db: any = await readDb(['comments']);
    if (!db.comments) db.comments = [];

    const newComment: Comment = {
        id: Date.now(),
        confessionId,
        parentCommentId,
        text,
        user,
        likes: 0,
        status: 'pending',
        timestamp: Date.now(),
    };

    db.comments.unshift(newComment);
    await writeDb(db);

    return newComment;
}

export async function updateCommentStatusAction(
    id: number,
    status: Comment['status']
): Promise<void> {
    const db: any = await readDb(['comments']);
    if (!db.comments) return;

    db.comments = db.comments.map((c: Comment) => c.id === id ? { ...c, status } : c);
    await writeDb(db);
}

export async function toggleCommentLikeAction(
    id: number,
    increment: number
): Promise<void> {
    const db: any = await readDb(['comments']);
    if (!db.comments) return;

    db.comments = db.comments.map((c: Comment) =>
        c.id === id ? { ...c, likes: Math.max(0, c.likes + increment) } : c
    );
    await writeDb(db);
}
