import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thku.com.tr'),
  title: {
    default: 'THK Üniversitesi | Sky Portal - Havacılık Kampüsü',
    template: '%s | THK Üniversitesi'
  },
  description: "Türk Hava Kurumu Üniversitesi resmi öğrenci portalı. Kampüs haberleri, etkinlikler, kulüp aktiviteleri ve daha fazlası. Göklere yükselin!",
  keywords: ['THK Üniversitesi', 'Havacılık', 'Uzay Bilimleri', 'Türkkuşu', 'Ankara Üniversite', 'Kampüs', 'Etkinlikler', 'Kulüpler'],
  authors: [{ name: 'THK Üniversitesi' }],
  creator: 'THK Üniversitesi',
  publisher: 'THK Üniversitesi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://thku.com.tr',
    siteName: 'THK Üniversitesi',
    title: 'THK Üniversitesi | Sky Portal',
    description: "Türkiye'nin Havacılık ve Uzay Bilimleri Merkezi",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'THK Üniversitesi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THK Üniversitesi | Sky Portal',
    description: "Türkiye'nin Havacılık ve Uzay Bilimleri Merkezi",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

import { StoreProvider } from "@/context/StoreContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import GlobalError from "@/components/GlobalError";
import LayoutWrapper from "@/components/LayoutWrapper";
import PageViewTracker from "@/components/PageViewTracker";
import StructuredData from "@/components/StructuredData";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://i.ytimg.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <GlobalError>
          <AuthProvider>
            <StoreProvider>
              <ConfirmProvider>
                <PageViewTracker />
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </ConfirmProvider>
            </StoreProvider>
          </AuthProvider>
        </GlobalError>
      </body>
    </html>
  );
}
