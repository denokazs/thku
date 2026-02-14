
import { NextResponse } from 'next/server';
import { sendMail } from '@/lib/mail';

export async function GET() {
    try {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return NextResponse.json({
                success: false,
                error: 'Missing Environment Variables',
                details: {
                    host: !!process.env.SMTP_HOST,
                    user: !!process.env.SMTP_USER,
                    pass: !!process.env.SMTP_PASS
                }
            }, { status: 500 });
        }

        const result = await sendMail(
            process.env.SMTP_USER || '',
            'Test Email from Vercel',
            '<h1>It Works!</h1><p>Your SMTP configuration is correct.</p>'
        );

        if (result.success) {
            return NextResponse.json({ success: true, message: 'Email sent successfully!' });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
