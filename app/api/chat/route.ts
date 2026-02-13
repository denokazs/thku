import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { guardPrompt, SYSTEM_PROMPT_HARDENING } from '@/lib/ai-guard';

export async function POST(request: Request) {
    // 1. Denial of Wallet (DoW) Protection w/ Rate Limiting
    // Identify user by IP (x-forwarded-for in production)
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Strict limit: 5 requests per minute for AI to save costs
    const limiter = rateLimit(ip, { limit: 5, windowMs: 60 * 1000 });

    if (!limiter.success) {
        return NextResponse.json(
            { error: 'Too many requests. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': Math.ceil((limiter.reset - Date.now()) / 1000).toString() }
            }
        );
    }

    try {
        const body = await request.json();
        const { prompt } = body;

        // 2. Prompt Injection Defense
        const guard = guardPrompt(prompt);
        if (!guard.isValid) {
            console.warn(`[AI-GUARD] Blocked malicious prompt from ${ip}: ${guard.violation}`);
            return NextResponse.json({ error: 'Your request was blocked by security filters.' }, { status: 400 });
        }

        // 3. (Simulated) Safe AI Interaction
        // In a real scenario, you would send `SYSTEM_PROMPT_HARDENING + prompt` to the LLM.

        console.log(`[AI-GUARD] Safe prompt processed: "${prompt}"`);

        // Mock response
        return NextResponse.json({
            role: 'assistant',
            content: `[SECURE MODE] I understand you are asking about: "${prompt}". As a secure AI for THK University, I can confirm this prompt passed all security checks.`,
            security_log: {
                rate_limit_remaining: limiter.remaining,
                jailbreak_detected: false
            }
        });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
