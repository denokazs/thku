
import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, studentId, department, email, phone, password, confirmPassword } = body;

        // Basic validation
        if (!name || !studentId || !email || !password || !confirmPassword) {
            return NextResponse.json({ error: 'Tüm alanları doldurunuz.' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Şifreler eşleşmiyor.' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Şifre en az 8 karakter olmalıdır.' }, { status: 400 });
        }

        const db = await readDb();
        const users = db.users || [];

        // Check duplicates
        if (users.find((u: any) => u.email === email)) {
            return NextResponse.json({ error: 'Bu e-posta adresi zaten kayıtlı.' }, { status: 400 });
        }
        if (users.find((u: any) => u.studentId === studentId)) {
            return NextResponse.json({ error: 'Bu öğrenci numarası zaten kayıtlı.' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = {
            id: Date.now(),
            username: studentId.toLowerCase(), // Use studentId as default username
            name,
            studentId: studentId.toLowerCase(),
            department,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            role: 'student',
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        await writeDb(db);

        // Sanitize return (remove password)
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
    }
}
