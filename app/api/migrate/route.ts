
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const JSON_PATH = path.join(process.cwd(), 'data', 'db-export.json');

        if (!fs.existsSync(JSON_PATH)) {
            return NextResponse.json({ error: 'Export file not found' }, { status: 404 });
        }

        const dbConfig = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        };

        // Read data
        const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
        const data = JSON.parse(rawData);

        // Connect to DB
        const conn = await mysql.createConnection(dbConfig);
        const results: Record<string, any> = {};

        try {
            await conn.beginTransaction();

            // Create tables first (simplified schema for key tables)
            // Note: In a real scenario, we might want a full schema file, 
            // but here we assume tables might exist or we insert leniently.
            //Ideally, we should run the CREATE TABLE statements here if they don't exist.

            // Allow larger packets for base64 images
            await conn.query('SET GLOBAL max_allowed_packet=67108864');

            for (const tableName of Object.keys(data)) {
                const rows = data[tableName];
                if (!Array.isArray(rows) || rows.length === 0) continue;

                // Simple auto-create table logic based on first row (very basic, for migration only)
                // In production, better to use the proper schema migration script logic
                // But since we can't run scripts easily, let's try to just INSERT

                // Get columns from DB
                try {
                    const [columns]: any = await conn.query(`SHOW COLUMNS FROM ${tableName}`);
                    const dbCols = columns.map((c: any) => c.Field);

                    // Prepare insert
                    const placeholders = dbCols.map(() => '?').join(', ');
                    const sql = `INSERT INTO ${tableName} (${dbCols.join(', ')}) VALUES (${placeholders})`; // Use IGNORE to skip duplicates

                    let count = 0;
                    for (const row of rows) {
                        const values = dbCols.map((col: string) => {
                            let val = row[col];
                            if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
                            if (typeof val === 'boolean') val = val ? 1 : 0;
                            return val;
                        });

                        try {
                            await conn.execute(sql, values);
                            count++;
                        } catch (e: any) {
                            // Ignore duplicate entry errors
                            if (e.code !== 'ER_DUP_ENTRY') {
                                console.error(`Error inserting into ${tableName}:`, e.message);
                            }
                        }
                    }
                    results[tableName] = count;
                } catch (e: any) {
                    results[tableName] = `Error: ${e.message}`;
                }
            }

            await conn.commit();
            return NextResponse.json({ success: true, results });

        } catch (err: any) {
            await conn.rollback();
            return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
        } finally {
            await conn.end();
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
