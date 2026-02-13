
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password, confirmPassword } = await request.json();

        if (!token || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Tüm alanları doldurunuz.' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Şifreler eşleşmiyor.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
        }

        const db: any = await readDb(['users']);
        const users = db.users || [];

        // Find user with valid token
        const userIndex = users.findIndex((u: any) =>
            u.resetToken === token &&
            u.resetTokenExpire > Date.now()
        );

        if (userIndex === -1) {
            return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş bağlantı.' }, { status: 400 });
        }

        const user = users[userIndex];
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and clear token
        users[userIndex] = {
            ...user,
            password: hashedPassword,
            resetToken: null,
            resetTokenExpire: null
        };

        await writeDb({ users });

        return NextResponse.json({ success: true, message: 'Şifreniz başarıyla güncellendi.' });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
    }
}
