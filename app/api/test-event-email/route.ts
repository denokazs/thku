import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { sendMail } from '@/lib/mail';
import { getNewEventEmailTemplate } from '@/lib/email-templates';

export async function GET() {
    try {
        const db = await readDb(['clubs', 'members', 'events']);

        // Find GDG club
        const club = db.clubs?.find((c: any) => c.name.toLowerCase().includes('gdg'));
        if (!club) return NextResponse.json({ error: 'GDG club not found in DB.' }, { status: 404 });

        const newEvent = {
            id: Date.now(),
            clubId: club.id,
            title: "TEST: Geleceğin Teknolojileri Zirvesi",
            description: "Bu GDG on Campus UTAA tarafından oluşturulmuş bir test etkinliğidir. Sistem e-postalarının doğru iletilip iletilmediğini kontrol etmek amacıyla oluşturulmuştur.",
            date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
            location: "Kırmızı Salon (Test)",
            image: club.logo || "https://thku.com.tr/images/placeholder.jpg",
            isFeatured: false,
            requirements: []
        };

        // Save mock event
        if (!db.events) db.events = [];
        db.events.push(newEvent);
        await writeDb(db);

        // Fetch approved members
        const clubMembers = db.members?.filter((m: any) => m.clubId === club.id && m.status === 'approved') || [];
        const emails = clubMembers.map((m: any) => m.email).filter(Boolean);

        let emailResult = null;
        if (emails.length > 0) {
            const emailHtml = getNewEventEmailTemplate(newEvent, club);
            const subject = `Yeni Etkinlik: ${newEvent.title} - ${club.name}`;

            // Note: sendMail usually logs output console
            emailResult = await sendMail(emails.join(','), subject, emailHtml);
        }

        return NextResponse.json({
            success: true,
            clubName: club.name,
            eventTitle: newEvent.title,
            membersFound: clubMembers.length,
            emailsTargeted: emails,
            emailStatus: emailResult
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
