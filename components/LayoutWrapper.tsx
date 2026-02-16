'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { LocationPermissionPrompt } from './LocationPermissionPrompt';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Check if path is the GENERAL admin path OR the CLUB admin path
    const isAdminPath = pathname?.startsWith('/admin') || pathname?.includes('/yonetim');

    if (isAdminPath) {
        return <>{children}</>;
    }

    return (
        <>
            <header role="banner">
                <Navbar />
            </header>
            <main role="main" className="min-h-screen pt-20">
                {children}
            </main>
            <footer role="contentinfo">
                <Footer />
            </footer>
            {/* GPS Location Tracking - Optional, dismissable */}
            <LocationPermissionPrompt />
        </>
    );
}
