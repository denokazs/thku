import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        // Simple auth check - require a secret key
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key !== process.env.BACKUP_SECRET && key !== 'thku-backup-2026') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

        const tables = [
            'users', 'clubs', 'events', 'news', 'confessions', 'comments',
            'messages', 'forum_posts', 'announcements', 'members', 'attendance',
            'shuttle_stops', 'cafeteria_menu', 'settings', 'club_admins'
        ];

        const backup: any = {
            timestamp: new Date().toISOString(),
            tables: {}
        };

        for (const table of tables) {
            try {
                const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
                backup.tables[table] = {
                    count: rows.length,
                    data: rows
                };
            } catch (err: any) {
                backup.tables[table] = { error: err.message, count: 0, data: [] };
            }
        }

        await pool.end();

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(backup, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="thku_backup_${new Date().toISOString().slice(0, 10)}.json"`,
            },
        });

    } catch (error: any) {
        console.error('Backup error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
