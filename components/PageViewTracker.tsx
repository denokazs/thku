'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PageViewTracker() {
    const pathname = usePathname();
    const lastPathRef = useRef<string | null>(null);

    useEffect(() => {
        // Prevent duplicate tracking for the same path in strict mode or rapid re-renders
        if (lastPathRef.current === pathname) return;

        lastPathRef.current = pathname;

        const trackView = async () => {
            try {
                await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: pathname,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (err) {
                // Silently fail to not disrupt user experience
                console.error('Analytics tracking failed silently', err);
            }
        };

        // Small timeout to ensure the route change has settled
        const timer = setTimeout(trackView, 500);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null; // Logic only, no UI
}
