import { Buffer } from 'buffer';

// Magic Byte Signatures
const SIGNATURES: Record<string, string> = {
    'FFD8FF': 'image/jpeg',
    '89504E47': 'image/png',
    '47494638': 'image/gif',
    '52494646': 'image/webp', // WEBP starts with RIFF...WEBP but we check RIFF first
    '25504446': 'application/pdf',
    'D0CF11E0': 'application/msword', // .doc
    '504B0304': 'application/zip',    // .docx, .xlsx (Zip-based)
};

export async function verifyMagicBytes(buffer: Buffer, originalExtension: string): Promise<{ isValid: boolean; detectedMime?: string }> {
    const hex = buffer.toString('hex', 0, 4).toUpperCase();

    // Check for exact matches
    for (const [sig, mime] of Object.entries(SIGNATURES)) {
        if (hex.startsWith(sig)) {
            // Special handling for Zip-based office documents
            if (mime === 'application/zip') {
                if (['.docx', '.xlsx', '.pptx'].includes(originalExtension.toLowerCase())) {
                    return { isValid: true, detectedMime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
                }
            }
            return { isValid: true, detectedMime: mime };
        }
    }

    // Special check for WEBP (RIFF...WEBP)
    // RIFF is 52 49 46 46 (bytes 0-3)
    // WEBP is 57 45 42 50 (bytes 8-11)
    if (hex === '52494646') {
        const subType = buffer.toString('hex', 8, 12).toUpperCase();
        if (subType === '57454250') {
            return { isValid: true, detectedMime: 'image/webp' };
        }
    }

    return { isValid: false };
}

export function sanitizeFilename(filename: string): string {
    // Remove potentially dangerous characters and replace spaces
    const name = filename.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
    const ext = name.split('.').pop();
    const basename = name.substring(0, name.lastIndexOf('.'));

    // Ensure random prefix to prevent overwrites
    return `${basename}-${Date.now().toString(36)}${ext ? '.' + ext : ''}`;
}
