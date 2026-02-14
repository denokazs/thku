
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { generateToken } from '@/lib/tokens';
import { sendMail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'E-posta adresi gereklidir.' }, { status: 400 });
        }

        const db: any = await readDb(['users']);
        const users = db.users || [];

        // Case insensitive lookup
        const userIndex = users.findIndex((u: any) => u.email && u.email.toLowerCase() === email.toLowerCase());

        if (userIndex === -1) {
            console.log('Forgot Password: User not found for email:', email);
            // Security: Don't reveal if email exists
            // Return success even if user not found to prevent enumeration
            return NextResponse.json({ success: true, message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' });
        }

        console.log('Forgot Password: User found, attempting to send email to:', email);

        const user = users[userIndex];
        const resetToken = generateToken();
        // Token expires in 1 hour
        const resetTokenExpire = Date.now() + 3600000;

        // Update user with reset token
        users[userIndex] = {
            ...user,
            resetToken,
            resetTokenExpire
        };

        await writeDb({ users });

        // Generate reset URL
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://thku.com.tr'}/sifremi-yenile?token=${resetToken}`;

        // Send Email
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #cf2e2e; text-align: center;">Şifre Sıfırlama İsteği</h2>
                <p>Merhaba ${user.name || 'Öğrenci'},</p>
                <p>Hesabınız için şifre sıfırlama talebinde bulundunuz.</p>
                <p>Şifrenizi yenilemek için aşağıdaki butona tıklayın:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #cf2e2e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Şifremi Yenile</a>
                </div>
                <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
                <p style="font-size: 12px; color: #666;">Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; text-align: center; color: #999;">THK Üniversitesi Topluluk Sistemi</p>
            </div>
        `;

        const mailResult = await sendMail(user.email, 'Şifre Sıfırlama - THK Üniversitesi Topluluk Sistemi', emailHtml);

        if (!mailResult.success) {
            console.error('Mail Send Failed:', mailResult.error);
            // Re-throw so catch block handles it
            throw mailResult.error || new Error('Mail gönderilemedi.');
        }

        return NextResponse.json({ success: true, message: 'Eğer bu e-posta adresi kayıtlıysa, şifre sıfırlama bağlantısı gönderildi.' });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        // Temporary Debug: Return actual error to client
        return NextResponse.json({
            success: false,
            error: error.message || 'Bir hata oluştu.',
            details: JSON.stringify(error)
        }, { status: 500 });
    }
}
