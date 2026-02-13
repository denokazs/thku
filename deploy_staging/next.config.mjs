/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['better-sqlite3'],
    poweredByHeader: false, // Hide "X-Powered-By: Next.js"
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN' // Prevent Clickjacking
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff' // Prevent Mime-Sniffing
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' // Interest-cohort is deprecated, using browsing-topics
                    }
                ]
            }
        ]
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
};

export default nextConfig;
