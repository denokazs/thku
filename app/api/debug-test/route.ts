
import { NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    const report: any = {
        env: {
            NODE_ENV: process.env.NODE_ENV,
            DB_TYPE: process.env.DB_TYPE,
            DB_HOST: process.env.DB_HOST,
            DB_USER: process.env.DB_USER,
            // Don't leak password
            DB_PASS_SET: !!process.env.DB_PASS,
        },
        drivers: {
            mysql2: false,
            better_sqlite3: false
        },
        dbTest: {
            success: false,
            error: null,
            clubCount: 0
        }
    };

    // Check drivers
    try { require('mysql2/promise'); report.drivers.mysql2 = true; } catch (e) { }
    try { require('better-sqlite3'); report.drivers.better_sqlite3 = true; } catch (e) { }

    // Test DB Read
    try {
        const db = await readDb(['clubs']);
        report.dbTest.success = true;
        report.dbTest.clubCount = db.clubs ? db.clubs.length : 0;
        report.dbTest.firstClub = db.clubs && db.clubs.length > 0 ? db.clubs[0].slug : null;
    } catch (error: any) {
        report.dbTest.error = error.message;
        report.dbTest.stack = error.stack;
    }

    return NextResponse.json(report);
}
