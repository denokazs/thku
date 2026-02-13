/**
 * Simple In-Memory Rate Limiter
 * Uses a Map to store request counts per IP/Token.
 * Note: In a distributed system (Vercel/AWS Lambda), use Redis (Upstash/KV) instead.
 */

type RateLimitStore = Map<string, { count: number; resetsAt: number }>;

const store: RateLimitStore = new Map();

interface RateLimitConfig {
    limit: number;    // Max requests
    windowMs: number; // Time window in milliseconds
}

/**
 * Check if the request exceeds the rate limit.
 * @param key Unique identifier (IP address, User ID, etc.)
 * @param config Rate limit configuration
 * @returns Object containing success status and headers
 */
export function rateLimit(key: string, config: RateLimitConfig = { limit: 60, windowMs: 60 * 1000 }) {
    const now = Date.now();
    const record = store.get(key);

    // Clean up expired records (lazy cleanup)
    if (record && now > record.resetsAt) {
        store.delete(key);
    }

    if (!store.has(key)) {
        store.set(key, { count: 1, resetsAt: now + config.windowMs });
        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - 1,
            reset: now + config.windowMs
        };
    }

    const current = store.get(key)!;

    if (current.count >= config.limit) {
        return {
            success: false,
            limit: config.limit,
            remaining: 0,
            reset: current.resetsAt
        };
    }

    current.count++;
    return {
        success: true,
        limit: config.limit,
        remaining: config.limit - current.count,
        reset: current.resetsAt
    };
}
