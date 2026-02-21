import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { requireClubAccess, handleAuthError, getSession } from '@/lib/auth';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { sendMail } from '@/lib/mail';
import { getEventAnnouncementTemplate } from '@/lib/email-templates';

// Ensure this route is evaluated dynamically, especially since it sends emails
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { eventId, subject, message } = body;

        // Basic validation
        if (!eventId || !subject || !message) {
            return NextResponse.json({ error: 'Etkinlik ID, Başlık ve Mesaj alanları zorunludur' }, { status: 400 });
        }

        const db = await readDb(['events', 'clubs', 'attendance', 'users']);

        // 1. Locate the event
        const event = db.events?.find((e: any) => e.id === parseInt(eventId));
        if (!event) {
            return NextResponse.json({ error: 'Etkinlik bulunamadı' }, { status: 404 });
        }

        // 2. Authorization Check
        // Only Super Admins and the specific Club Admin can email attendees of this event.
        const isAdminJWT = await verifyAdminAuth();
        const session = await getSession();
        const isSuperAdmin = isAdminJWT || session?.role === 'super_admin';

        if (!isSuperAdmin) {
            await requireClubAccess(event.clubId); // Throws auth error if not admin of this club
        }

        // 3. Get Event Club Details
        const club = db.clubs?.find((c: any) => c.id === event.clubId);
        if (!club) {
            return NextResponse.json({ error: 'Etkinliğe ait kulüp bulunamadı' }, { status: 404 });
        }

        // 4. Fetch Approved Attendees
        // Attendees are stored in the `attendance` table mapping eventId to userId
        const eventAttendance = db.attendance?.filter((a: any) => a.eventId == eventId) || [];

        const attendeeEmails = eventAttendance.map((a: any) => {
            const user = db.users?.find((u: any) => u.id == a.userId || u.username === a.userId);
            return user ? user.email : null;
        }).filter(Boolean);

        // De-duplicate emails just in case
        const uniqueEmails = [...new Set(attendeeEmails)] as string[];

        if (uniqueEmails.length === 0) {
            return NextResponse.json({ error: 'Bu etkinliğe kayıtlı katılımcı bulunmuyor.' }, { status: 400 });
        }

        // 5. Generate and Send Email
        const htmlContent = getEventAnnouncementTemplate(event, club, subject, message);

        // Vercel Serverless MUST await this dispatch
        try {
            await sendMail(attendeeEmails.join(','), subject, htmlContent);
        } catch (mailError) {
            console.error("Mail Dispatch Failed:", mailError);
            return NextResponse.json({ error: 'E-postalar gönderilirken bir hata oluştu.' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `${attendeeEmails.length} katılımcıya e-posta başarıyla gönderildi.`
        });

    } catch (error: any) {
        return handleAuthError(error);
    }
}
