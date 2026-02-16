import { NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { requireRole } from '@/lib/auth';

/**
 * GET /api/admin/logs
 * Fetch API logs with pagination and filtering
 * Requires: super_admin role
 */
export async function GET(request: Request) {
    try {
        // Only super admins can view logs
        await requireRole(['super_admin']);

        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Filters
        const userId = searchParams.get('userId');
        const ip = searchParams.get('ip');
        const endpoint = searchParams.get('endpoint');
        const method = searchParams.get('method');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Read logs from database
        const db = await readDb(['apiLogs']);
        let logs = db.apiLogs || [];

        // Apply filters
        if (userId) {
            logs = logs.filter((log: any) => log.userId === userId);
        }
        if (ip) {
            logs = logs.filter((log: any) => log.ipAddress?.includes(ip));
        }
        if (endpoint) {
            logs = logs.filter((log: any) => log.endpoint?.toLowerCase().includes(endpoint.toLowerCase()));
        }
        if (method) {
            logs = logs.filter((log: any) => log.method === method.toUpperCase());
        }
        if (startDate) {
            const start = new Date(startDate).getTime();
            logs = logs.filter((log: any) => log.timestamp >= start);
        }
        if (endDate) {
            const end = new Date(endDate).getTime();
            logs = logs.filter((log: any) => log.timestamp <= end);
        }

        // Sort by timestamp descending (newest first)
        logs.sort((a: any, b: any) => b.timestamp - a.timestamp);

        // Pagination
        const total = logs.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedLogs = logs.slice(startIndex, endIndex);

        return NextResponse.json({
            logs: paginatedLogs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        console.error('[Admin Logs API] Error:', error);

        if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json({
            error: 'Failed to fetch logs',
            details: error.message
        }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/logs
 * Clear old logs (optional cleanup feature)
 * Requires: super_admin role
 */
export async function DELETE(request: Request) {
    try {
        await requireRole(['super_admin']);

        const { searchParams } = new URL(request.url);
        const olderThan = searchParams.get('olderThan'); // Timestamp

        if (!olderThan) {
            return NextResponse.json({ error: 'olderThan parameter required' }, { status: 400 });
        }

        const cutoffTime = parseInt(olderThan);
        const db = await readDb(['apiLogs']);

        if (!db.apiLogs) db.apiLogs = [];

        const originalCount = db.apiLogs.length;
        db.apiLogs = db.apiLogs.filter((log: any) => log.timestamp > cutoffTime);
        const deletedCount = originalCount - db.apiLogs.length;

        await writeDb(db);

        return NextResponse.json({
            success: true,
            deletedCount,
            remainingCount: db.apiLogs.length
        });
    } catch (error: any) {
        console.error('[Admin Logs API] Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete logs' }, { status: 500 });
    }
}
