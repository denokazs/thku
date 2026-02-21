'use server';

import { readDb, writeDb } from '@/lib/db';
import { Confession } from '@/types';

// Helper to get confessions from DB
async function getConfessionsDB() {
    const db = await readDb(['confessions']);
    return Array.isArray(db.confessions) ? db.confessions : [];
}

export async function getConfessionsAction(): Promise<Confession[]> {
    return await getConfessionsDB();
}

export async function addConfessionAction(
    text: string,
    user: string,
    type: Confession['type'],
    options?: {
        tags?: string[];
        authorAvatar?: string;
        authorCodeName?: string;
        mediaUrl?: string;
    }
): Promise<Confession> {
    const db: any = await readDb(['confessions']);
    if (!db.confessions) db.confessions = [];

    const newConfession: Confession = {
        id: Date.now(),
        text,
        user,
        type,
        likes: 0,
        dislikes: 0,
        status: 'pending',
        timestamp: Date.now(),
        ...(options?.tags && { tags: options.tags }),
        ...(options?.authorAvatar && { authorAvatar: options.authorAvatar }),
        ...(options?.authorCodeName && { authorCodeName: options.authorCodeName }),
        ...(options?.mediaUrl && { mediaUrl: options.mediaUrl })
    };

    // Add to beginning
    db.confessions.unshift(newConfession);
    await writeDb(db);

    return newConfession;
}

export async function updateConfessionStatusAction(id: number, status: Confession['status']): Promise<void> {
    const db: any = await readDb(['confessions']);
    if (!db.confessions) return;

    db.confessions = db.confessions.map((c: Confession) => c.id === id ? { ...c, status } : c);
    await writeDb(db);
}

export async function updateConfessionVotesAction(id: number, likeDelta: number, dislikeDelta: number): Promise<void> {
    const db: any = await readDb(['confessions']);
    if (!db.confessions) return;

    db.confessions = db.confessions.map((c: Confession) => {
        if (c.id === id) {
            return {
                ...c,
                likes: Math.max(0, (c.likes || 0) + likeDelta),
                dislikes: Math.max(0, (c.dislikes || 0) + dislikeDelta)
            };
        }
        return c;
    });

    await writeDb(db);
}
