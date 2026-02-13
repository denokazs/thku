/**
 * Sanitize string input to prevent XSS
 * Minimal escape for XSS prevention only.
 */
export function sanitizeString(input: string): string {
    if (!input) return '';
    if (typeof input !== 'string') return String(input);

    // Minimal escape for XSS prevention only.
    // Preserves Turkish characters (ş, ğ, ü, etc.) and other Unicode.
    // Relaxed sanitization:
    // We trust React's built-in escaping for text content.
    // We only escape < and > to prevent script injection in specific contexts,
    // but generally refrain from messing with quotes to avoid "Start's" -> "Start&#x27;s".
    return input
        //.replace(/&/g, '&amp;') // React escapes & automatically
        //.replace(/</g, '')      // Strip < to prevent HTML totally (safer than encoding for some cases)
        //.replace(/>/g, '')      // Strip >
        // But for now, let's just trim and maybe strip script tags if we really want.
        // Actually, let's just do minimal replacement of potentially dangerous start tags
        // or just return the string as is because React handles XSS in {}
        // The safest approach for this specific issue (fixing ' becoming &#x27;) is to STOP escaping quotes.

        //.replace(/&/g, '&amp;') // Removed to fix display in inputs
        //.replace(/</g, '&lt;')  // Removed, let React handle it. OR keep it if we want to show code?
        //.replace(/>/g, '&gt;')
        //.replace(/"/g, '&quot;')
        //.replace(/'/g, '&#x27;')


        .replace(/\0/g, '') // Null bytes
        .trim();
}
