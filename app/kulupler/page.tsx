import { readDb } from '@/lib/db';
import KuluplerClient from './KuluplerClient';


async function getData() {
    try {
        const db = await readDb(['clubs', 'members', 'events']);
        const clubs = (db.clubs || []).sort((a: any, b: any) => {
            const orderA = a.displayOrder ?? 9999;
            const orderB = b.displayOrder ?? 9999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

        return {
            clubs: clubs.map((club: any) => ({
                ...club,
                memberCount: (db.members || []).filter((m: any) => m.clubId === club.id).length
            })),
            events: (db.events || []).map((event: any) => ({
                ...event,
                clubSlug: clubs.find((c: any) => c.id === event.clubId)?.slug || 'robotics'
            }))
        };
    } catch (error) {
        console.error('Failed to read DB:', error);
        return { clubs: [], events: [] };
    }
}

export const dynamic = 'force-dynamic'; // Since it reads local file that changes

export default async function KuluplerPage() {
    const { clubs, events } = await getData();

    return <KuluplerClient clubs={clubs} events={events} />;
}
