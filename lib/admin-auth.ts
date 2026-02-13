import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// Use jose library for Edge runtime compatibility
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production-min-32-chars'
);

const COOKIE_NAME = 'admin-token';

export interface AdminSession {
    isAdmin: boolean;
    iat: number;
    exp: number;
}

/**
 * Verifies admin password against environment variable hash
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
    const hashedPassword = process.env.ADMIN_PASSWORD_HASH;

    // Fallback for development - compare plain text password
    if (!hashedPassword) {
        console.warn('ADMIN_PASSWORD_HASH not set! Using fallback password check.');
        const fallbackPassword = process.env.ADMIN_PASSWORD || 'admin123';
        return password === fallbackPassword;
    }

    return bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a JWT token for admin authentication
 */
export async function createAdminToken(): Promise<string> {
    const token = await new SignJWT({ isAdmin: true })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // Token expires in 7 days
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verifies a JWT token and returns the payload
 */
export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
    try {
        const verified = await jwtVerify(token, JWT_SECRET);
        return verified.payload as unknown as AdminSession;
    } catch (error) {
        return null;
    }
}

/**
 * Sets the admin authentication cookie
 */
export async function setAdminCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Removes the admin authentication cookie
 */
export async function removeAdminCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Gets the admin token from cookies
 */
export async function getAdminToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    return cookie?.value || null;
}

/**
 * Verifies if the current request is from an authenticated admin
 */
export async function verifyAdminAuth(): Promise<boolean> {
    const token = await getAdminToken();
    if (!token) return false;

    const session = await verifyAdminToken(token);
    return session?.isAdmin === true;
}

/**
 * Helper to generate password hash (for setup only)
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}
