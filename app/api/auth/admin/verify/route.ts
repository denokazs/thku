import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';

export async function GET() {
    try {
        const isAuthenticated = await verifyAdminAuth();

        return NextResponse.json(
            {
                isAuthenticated,
                isAdmin: isAuthenticated
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json(
            {
                isAuthenticated: false,
                isAdmin: false
            },
            { status: 200 }
        );
    }
}
