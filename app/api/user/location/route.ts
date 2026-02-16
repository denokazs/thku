import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

/**
 * POST /api/user/location
 * Store user's precise GPS location
 * Called from client when user grants permission
 */
export async function POST(request: Request) {
    try {
        const session = await getSession();
        const body = await request.json();

        const { latitude, longitude, accuracy, address, street, city, postalCode } = body;

        // Store in session or cookie for subsequent API calls
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('user_gps_location', JSON.stringify({
                latitude,
                longitude,
                accuracy,
                address,
                street,
                city,
                postalCode,
                timestamp: Date.now(),
            }));
        }

        // You can also store in database user preferences table
        // For now, just acknowledge receipt

        console.log('[GPS Location]', {
            user: session?.username,
            address,
            accuracy: `±${accuracy}m`,
        });

        return NextResponse.json({
            success: true,
            message: 'Location saved',
        });
    } catch (error: any) {
        console.error('[User Location API]', error);
        return NextResponse.json({
            error: 'Failed to save location'
        }, { status: 500 });
    }
}
