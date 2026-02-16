import { NextResponse } from 'next/server';
import { runMigrations, checkMigrations } from '@/lib/migrations';
import { requireRole } from '@/lib/auth';

/**
 * POST /api/admin/migrate
 * Run database migrations manually
 * Requires: super_admin role
 */
export async function POST() {
    try {
        // Only super admins can run migrations
        await requireRole(['super_admin']);

        console.log('[Admin Migrate] Running migrations...');
        const result = await runMigrations();

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: result.message,
                tables: result.tables,
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error,
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('[Admin Migrate] Error:', error);

        if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json({
            success: false,
            error: error.message || 'Migration failed',
        }, { status: 500 });
    }
}

/**
 * GET /api/admin/migrate
 * Check migration status
 * Requires: super_admin role
 */
export async function GET() {
    try {
        await requireRole(['super_admin']);

        const status = await checkMigrations();

        return NextResponse.json({
            migrationsNeeded: status.needed,
            missingTables: status.missing,
            error: status.error,
        });
    } catch (error: any) {
        console.error('[Admin Migrate] Check error:', error);

        if (error.message?.includes('Unauthorized') || error.message?.includes('Forbidden')) {
            return NextResponse.json({ error: error.message }, { status: 403 });
        }

        return NextResponse.json({
            error: error.message || 'Failed to check migrations',
        }, { status: 500 });
    }
}
