
import { NextResponse } from 'next/server';
import { logPageView } from '@/lib/analytics-db';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { path, timestamp } = body;

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        // Get IP
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1'; // Prioritize first IP in standard forwarded header
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Parse User Agent (Simple Regex)
        const getDeviceType = (ua: string) => {
            if (/mobile/i.test(ua)) return 'Mobile';
            if (/tablet/i.test(ua)) return 'Tablet';
            return 'Desktop';
        };

        const getBrowser = (ua: string) => {
            if (/chrome/i.test(ua)) return 'Chrome';
            if (/firefox/i.test(ua)) return 'Firefox';
            if (/safari/i.test(ua)) return 'Safari';
            if (/edge/i.test(ua)) return 'Edge';
            return 'Other';
        };

        const getOS = (ua: string) => {
            if (/windows/i.test(ua)) return 'Windows';
            if (/mac/i.test(ua)) return 'MacOS';
            if (/linux/i.test(ua)) return 'Linux';
            if (/android/i.test(ua)) return 'Android';
            if (/ios/i.test(ua)) return 'iOS';
            return 'Other';
        };

        const device = {
            type: getDeviceType(userAgent),
            browser: getBrowser(userAgent),
            os: getOS(userAgent)
        };

        // Geo Lookup (Simple Mock/Placeholder for now as we don't have an external API key)
        // In a real app, use MaxMind or ip-api.com
        const geo = {
            country: 'Unknown',
            city: 'Unknown'
        };

        // Try to verify if it's localhost
        if (ip === '127.0.0.1' || ip === '::1') {
            geo.country = 'Local';
            geo.city = 'Localhost';
        }

        // Create a daily unique session hash
        const dateStr = new Date().toISOString().split('T')[0];
        const rawString = `${ip}-${userAgent}-${dateStr}`;
        const sessionId = crypto.createHash('sha256').update(rawString).digest('hex').substring(0, 12);

        // Determine if this is a club page view
        let clubSlug = null;
        if (path.startsWith('/kulupler/') && path.split('/').length > 2) {
            clubSlug = path.split('/')[2];
        }

        logPageView({
            id: crypto.randomUUID(),
            path,
            clubSlug,
            timestamp: timestamp || new Date().toISOString(),
            sessionId,
            ip,
            device,
            geo
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics tracking error:', error);
        return NextResponse.json({ error: 'Tracking failed' }, { status: 500 });
    }
}
