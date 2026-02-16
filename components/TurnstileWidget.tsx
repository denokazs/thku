'use client';

import { useEffect, useState, useRef } from 'react';

interface TurnstileProps {
    siteKey?: string;
    onVerify: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

declare global {
    interface Window {
        turnstile: any;
        turnstileLoaded: () => void;
    }
}

export function TurnstileWidget({ siteKey = '0x4AAAAAACeEaGW4lT7fsQsn', onVerify, onError, onExpire }: TurnstileProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Default testing key if none provided: 1x00000000000000000000AA
    // Using a placeholder real-looking key for now, replace with env var in production

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if script is already present
        const scriptId = 'cloudflare-turnstile-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=turnstileLoaded';
            script.id = scriptId;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            window.turnstileLoaded = () => {
                setIsLoaded(true);
            };
        } else {
            if (window.turnstile) setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (isLoaded && containerRef.current && window.turnstile) {
            window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                callback: (token: string) => onVerify(token),
                'error-callback': () => onError?.(),
                'expired-callback': () => onExpire?.(),
            });
        }
    }, [isLoaded, siteKey]);

    return (
        <div className="w-full flex justify-center my-4" style={{ minHeight: '65px' }}>
            <div ref={containerRef} />
        </div>
    );
}
