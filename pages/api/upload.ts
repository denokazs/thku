import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '@/lib/jwt';
import { verifyMagicBytes } from '@/lib/file-security';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { rateLimit } from '@/lib/rate-limit';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Disable Next.js body parser to allow formidable to handle the file stream
export const config = {
    api: {
        bodyParser: false,
    },
};

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Rate Limit
        const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';
        const limiter = rateLimit(ip, { limit: 10, windowMs: 60 * 1000 });

        if (!limiter.success) {
            return res.status(429).json({ error: 'Upload limit exceeded. Please wait.' });
        }

        // 2. Authentication
        const token = req.cookies.auth_session;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Missing session' });
        }

        const session = await verifyJWT(token);
        if (!session) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        // 3. Parse File with Formidable
        const form = formidable({
            maxFileSize: 10 * 1024 * 1024, // 10MB limit
            keepExtensions: true,
        });

        const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        // Check if file exists
        const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

        if (!uploadedFile) {
            return res.status(400).json({ error: 'No file received' });
        }

        // 4. Basic Extension Validation
        const originalFilename = uploadedFile.originalFilename || 'unknown';
        const ext = path.extname(originalFilename).toLowerCase();

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return res.status(400).json({ error: 'Invalid file extension' });
        }

        // Read file buffer
        const buffer = fs.readFileSync(uploadedFile.filepath);

        // 5. Forensic Analysis
        const forensicCheck = await verifyMagicBytes(buffer, ext);
        if (!forensicCheck.isValid) {
            console.error(`Security Alert: File signature mismatch. Ext: ${ext}, Header: ${buffer.toString('hex', 0, 4)}`);
            return res.status(403).json({ error: 'Security Violation: File content does not match extension.' });
        }

        // 6. Image Sanitization (Privacy Shield)
        let processedBuffer = buffer;
        if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(forensicCheck.detectedMime || '')) {
            try {
                processedBuffer = await sharp(buffer)
                    .rotate()
                    .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
                    .toBuffer();
            } catch (err) {
                console.error('Image processing failed:', err);
                return res.status(422).json({ error: 'Image file is corrupt or malicious.' });
            }
        }

        // 7. Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(processedBuffer, 'thku_uploads');

        console.log(`Cloudinary Upload Success: ${uploadResult.secure_url}`);

        // Cleanup temp file
        try {
            fs.unlinkSync(uploadedFile.filepath);
        } catch (e) {
            console.warn('Failed to cleanup temp file', e);
        }

        return res.status(200).json({ url: uploadResult.secure_url });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: 'Upload failed: ' + (error as Error).message });
    }
}
