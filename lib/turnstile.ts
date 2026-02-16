import { NextRequest, NextResponse } from 'next/server';

/**
 * Verify Cloudflare Turnstile token
 * @param token The Turnstile token from the frontend
 * @returns Object with success status
 */
export async function validateTurnstile(token: string) {
    if (!token) {
        return { success: false, error: 'CAPTCHA token eksik' };
    }

    // Use Test Secret Key to match the frontend Test Site Key
    // TODO: Revert to process.env.TURNSTILE_SECRET_KEY for production
    const secretKey = '1x00000000000000000000AA';

    // If key is not configured, skip verification (dev mode or misconfig)
    if (!secretKey) {
        console.warn('[Turnstile] SECRET KEY not found. Skipping verification.');
        return { success: true };
    }

    try {
        const formData = new FormData();
        formData.append('secret', secretKey);
        formData.append('response', token);

        const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();

        if (outcome.success) {
            return { success: true };
        } else {
            console.error('[Turnstile] Verification failed:', outcome['error-codes']);
            return { success: false, error: 'CAPTCHA doğrulaması başarısız' };
        }
    } catch (err) {
        console.error('[Turnstile] Error:', err);
        return { success: false, error: 'CAPTCHA sunucu hatası' };
    }
}
