import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { verifyMagicBytes, sanitizeFilename } from '@/lib/file-security';
import sharp from 'sharp';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { rateLimit } from '@/lib/rate-limit';
import path from 'path';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];

export async function POST(request: Request) {
    try {
        // Rate Limit: 10 uploads per minute per IP to prevent DoS
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const limiter = rateLimit(ip, { limit: 10, windowMs: 60 * 1000 });

        if (!limiter.success) {
            return NextResponse.json({ error: 'Upload limit exceeded. Please wait.' }, { status: 429 });
        }

        // Require authentication for uploads
        await requireAuth();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file received' }, { status: 400 });
        }

        // 1. Basic Extension Validation
        const ext = path.extname(file.name).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return NextResponse.json({ error: 'Invalid file extension' }, { status: 400 });
        }

        // 2. Buffer & Magic Byte Verification (Forensic Analysis)
        const arrayBuffer = await file.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer as any);

        const forensicCheck = await verifyMagicBytes(buffer, ext);
        if (!forensicCheck.isValid) {
            console.error(`Security Alert: File signature mismatch. Ext: ${ext}, Header: ${buffer.toString('hex', 0, 4)}`);
            return NextResponse.json({ error: 'Security Violation: File content does not match extension.' }, { status: 403 });
        }

        // 3. Image Sanitization (Privacy Shield)
        if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(forensicCheck.detectedMime || '')) {
            try {
                // Re-process image: resize and strip metadata
                buffer = await sharp(buffer)
                    .rotate() // Auto-rotate based on EXIF before stripping
                    .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
                    .toBuffer();
            } catch (err) {
                console.error('Image processing failed:', err);
                return NextResponse.json({ error: 'Image file is corrupt or malicious.' }, { status: 422 });
            }
        }

        // 4. Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(buffer, 'thku_uploads');

        console.log(`Cloudinary Upload Success: ${uploadResult.secure_url}`);

        return NextResponse.json({ url: uploadResult.secure_url });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed: ' + (error as Error).message }, { status: 500 });
    }
}
