import { notFound } from 'next/navigation';
import { readDb } from '@/lib/db';
import EventDetailsClient from './EventDetailsClient';

export default async function EventDetailsPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
    const { slug, id } = await params;

    let event = null;
    let club = null;

    try {
        const db = await readDb();
        event = db.events.find((e: any) => e.id.toString() === id);
        club = db.clubs.find((c: any) => c.slug === slug);
    } catch (e) {
        console.error("DB Read Error", e);
    }

    if (!event || !club) {
        return notFound();
    }

    return <EventDetailsClient slug={slug} event={event} club={club} />;
}
