import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/jwt';

export async function GET() {
    try {
        // STRICT AUTH: Require super_admin session cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'super_admin') {
            return NextResponse.json({ error: 'Forbidden - Super Admin only' }, { status: 403 });
        }

        let mysql;
        try {
            mysql = require('mysql2/promise');
        } catch (e) {
            return NextResponse.json({ error: 'MySQL driver not available' }, { status: 500 });
        }

        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'thk_db',
        });

        // DYNAMIC TABLE FETCHING: Get all tables from the database
        // This ensures that even if new tables are added later, they are automatically included in the backup.
        const [tableRows] = await pool.query('SHOW TABLES');
        const tables = (tableRows as any[]).map(row => Object.values(row)[0] as string);


        const backup: any = { timestamp: new Date().toISOString(), tables: {} };

        for (const table of tables) {
            try {
                const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
                backup.tables[table] = { count: rows.length, data: rows };
            } catch (err: any) {
                backup.tables[table] = { error: err.message, count: 0, data: [] };
            }
        }

        await pool.end();

        return new NextResponse(JSON.stringify(backup, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="thku_backup_${new Date().toISOString().slice(0, 10)}.json"`,
            },
        });

    } catch (error: any) {
        console.error('Backup error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
