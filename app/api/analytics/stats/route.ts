
import { NextResponse } from 'next/server';
import { getSiteStats, getClubStats } from '@/lib/analytics-db';

import { readDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const scope = searchParams.get('scope') || 'global';
        const days = parseInt(searchParams.get('days') || '30');
        let slug = searchParams.get('slug'); // Mutable
        const clubIdParam = searchParams.get('clubId');

        if (scope === 'club') {
            const db = await readDb();
            let club;

            // Resolve Club
            if (clubIdParam) {
                club = db.clubs.find((c: any) => c.id === Number(clubIdParam));
                if (club) slug = club.slug;
            } else if (slug) {
                club = db.clubs.find((c: any) => c.slug === slug);
            }

            if (!club || !slug) {
                return NextResponse.json({ error: 'Club not found or slug/id missing' }, { status: 404 });
            }

            // Fetch Analytics (Views)
            const analyticsStats = getClubStats(slug, days);

            // Fetch Club Data (Members & Events) for Analysis
            // Already have club object from above resolution

            const members = db.members.filter((m: any) => m.clubId === club.id);
            const events = db.events.filter((e: any) => e.clubId === club.id);

            // Process Member Growth (Cumulative)
            const memberGrowth: { date: string, count: number }[] = [];
            const membersByDate: Record<string, number> = {};

            members.forEach((m: any) => {
                // Use joinedAt if available, otherwise created_at, otherwise default to current month
                const timestamp = m.joinedAt || m.created_at || new Date().toISOString();
                const date = timestamp.split('T')[0].substring(0, 7); // YYYY-MM
                membersByDate[date] = (membersByDate[date] || 0) + 1;
            });

            let runningTotal = 0;
            // Get all months sorted
            const sortedMonths = Object.keys(membersByDate).sort();

            if (sortedMonths.length > 0) {
                // If we have data, create a timeline
                const firstMonth = sortedMonths[0]; // e.g., "2022-09"
                const lastMonth = new Date().toISOString().substring(0, 7);

                let current = firstMonth;
                while (current <= lastMonth) {
                    runningTotal += membersByDate[current] || 0;
                    memberGrowth.push({ date: current, count: runningTotal });

                    // Next month
                    const [y, m] = current.split('-').map(Number);
                    const nextDate = new Date(y, m, 1); // Month is 0-indexed in JS Date? Wait, m is 1-12 here.
                    // Actually easier logic:
                    let nextY = m === 12 ? y + 1 : y;
                    let nextM = m === 12 ? 1 : m + 1;
                    current = `${nextY}-${String(nextM).padStart(2, '0')}`;
                }
            }

            // Process Event Stats
            const eventStats = {
                totalEvents: events.length,
                totalAttendees: events.reduce((sum: number, e: any) => sum + (e.attendees || 0), 0),
                avgAttendees: events.length > 0 ? Math.round(events.reduce((sum: number, e: any) => sum + (e.attendees || 0), 0) / events.length) : 0,
                recentEvents: events.slice(0, 5).map((e: any) => ({
                    title: e.title,
                    date: e.date,
                    attendees: e.attendees || 0
                }))
            };

            return NextResponse.json({
                ...analyticsStats,
                memberStats: {
                    totalMembers: members.length > 0 ? members.length : (club.memberCount || 0),
                    growth: memberGrowth
                },
                eventStats
            });
        } else {
            // Global stats (requires admin check ideally, but kept open for internal API usage)
            const stats = getSiteStats(days);
            return NextResponse.json(stats);
        }

    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
