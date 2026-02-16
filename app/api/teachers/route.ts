import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Auto-create teachers table on Railway MySQL
let tableEnsured = false;
async function ensureTeachersTable() {
    if (tableEnsured) return;
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';
    if (!useMysql) { tableEnsured = true; return; }

    try {
        const mysql = require('mysql2/promise');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'thk_db',
        });
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teachers (
                id VARCHAR(255) NOT NULL,
                name VARCHAR(500) NOT NULL,
                department VARCHAR(255) DEFAULT '',
                image VARCHAR(500) DEFAULT '👨‍🏫',
                ratings JSON DEFAULT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                addedBy VARCHAR(255) DEFAULT NULL,
                moderatedAt VARCHAR(100) DEFAULT NULL,
                moderatedBy VARCHAR(255) DEFAULT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        await pool.end();
        tableEnsured = true;
    } catch (e) {
        console.error('Failed to ensure teachers table:', e);
    }
}

export async function GET(request: Request) {
    try {
        await ensureTeachersTable();
        const { searchParams } = new URL(request.url);
        const showAll = searchParams.get('all') === 'true';
        const db = await readDb(['teachers']);

        let teachers = db.teachers || [];

        // For admin: show all. For public: hide pending teachers
        if (showAll) {
            const session = await getSession();
            if (!session || session.role !== 'super_admin') {
                teachers = teachers.filter((t: any) => t.status !== 'pending');
            }
            // Admin sees everything including pending
        } else {
            teachers = teachers.filter((t: any) => t.status !== 'pending');
        }

        // Calculate stats from approved ratings only
        teachers = teachers.map((teacher: any) => {
            const approvedRatings = (teacher.ratings || []).filter((r: any) => r.status === 'approved');
            const totalScore = approvedRatings.reduce((sum: number, r: any) => sum + r.score, 0);
            const average = approvedRatings.length > 0 ? (totalScore / approvedRatings.length).toFixed(1) : 'Yeni';

            return {
                ...teacher,
                ratings: approvedRatings,
                averageRating: average,
                ratingCount: approvedRatings.length
            };
        });

        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await ensureTeachersTable();
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, department, image } = body;

        if (!name || !department) {
            return NextResponse.json({ error: 'Name and Department are required' }, { status: 400 });
        }

        if (image && !image.startsWith('http')) {
            return NextResponse.json({ error: 'Invalid Image URL' }, { status: 400 });
        }

        const db = await readDb(['teachers']);

        const newTeacher = {
            id: crypto.randomUUID(),
            name,
            department,
            image: image || '👨‍🏫',
            ratings: [],
            status: 'pending',
            addedBy: session.id.toString()
        };

        if (!db.teachers) db.teachers = [];

        db.teachers.push(newTeacher);
        await writeDb(db);

        return NextResponse.json({ success: true, teacher: newTeacher }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        await ensureTeachersTable();
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, status, ratingId, ratingStatus } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const db = await readDb(['teachers']);
        const teachers = db.teachers || [];
        const teacherIndex = teachers.findIndex((t: any) => t.id === id);

        if (teacherIndex === -1) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        // Moderate a specific rating
        if (ratingId && ratingStatus) {
            const ratings = teachers[teacherIndex].ratings || [];
            const ratingIndex = ratings.findIndex((r: any) => r.id === ratingId);
            if (ratingIndex !== -1) {
                ratings[ratingIndex].status = ratingStatus;
                ratings[ratingIndex].moderatedAt = new Date().toISOString();
                teachers[teacherIndex].ratings = ratings;
            }
        }

        // Moderate the teacher itself
        if (status) {
            teachers[teacherIndex].status = status;
            teachers[teacherIndex].moderatedAt = new Date().toISOString();
            teachers[teacherIndex].moderatedBy = session.username;
        }

        db.teachers = teachers;
        await writeDb(db);

        return NextResponse.json({ success: true, teacher: teachers[teacherIndex] });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await ensureTeachersTable();
        const session = await getSession();
        if (!session || session.role !== 'super_admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const db = await readDb(['teachers']);
        db.teachers = (db.teachers || []).filter((t: any) => t.id !== id);
        await writeDb(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
    }
}
