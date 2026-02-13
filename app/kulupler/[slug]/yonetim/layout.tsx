'use client';

export default function ClubAdminLayout({ children }: { children: React.ReactNode }) {
    // Club admin pages have their own complete layout
    // No Navbar/Footer should be shown
    return <>{children}</>;
}
