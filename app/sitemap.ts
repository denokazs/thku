import { MetadataRoute } from 'next'
import { CLUBS_DATA } from '@/app/kulupler/clubsData'

const BASE_URL = 'https://thku.com.tr'

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date()

    const staticRoutes: MetadataRoute.Sitemap = [
        // Ana sayfa
        { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        // İçerik sayfaları
        { url: `${BASE_URL}/haberler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/etkinlikler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/kara-kutu`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/kulupler`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/hocalar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/yemekhane`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/academic-calendar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/campus`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/cikmis-sorular`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/ders-notlari`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
        // Kullanıcı hesabı
        { url: `${BASE_URL}/giris`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/kayit`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/sifremi-unuttum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/kulupler/giris`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ]

    // Her kulübün sayfası — CLUBS_DATA'dan otomatik olarak üretilir
    const clubRoutes: MetadataRoute.Sitemap = CLUBS_DATA
        .filter(club => club.isActive && club.slug)
        .map(club => ({
            url: `${BASE_URL}/kulupler/${club.slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.75,
        }))

    return [...staticRoutes, ...clubRoutes]
}
