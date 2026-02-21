import { MetadataRoute } from 'next'
import { readDb } from '@/lib/db'
import { CLUBS_DATA } from '@/app/kulupler/clubsData'

const BASE_URL = 'https://thku.com.tr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    // DB'den kulüpleri çek
    let dbSlugs: string[] = []
    try {
        const db = await readDb(['clubs'])
        dbSlugs = (db.clubs || [])
            .filter((c: any) => c.slug)
            .map((c: any) => c.slug as string)
    } catch {
        // DB erişilemezse static data'ya fall back
    }

    // Static + DB birleştir, unique yap
    const staticSlugs = CLUBS_DATA.filter(c => c.slug).map(c => c.slug)
    const allSlugs = [...new Set([...staticSlugs, ...dbSlugs])]

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${BASE_URL}/haberler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/etkinlikler`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/kara-kutu`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
        { url: `${BASE_URL}/forum`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/kulupler`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/hocalar`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${BASE_URL}/yemekhane`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${BASE_URL}/academic-calendar`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/campus`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${BASE_URL}/cikmis-sorular`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/ders-notlari`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/giris`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/kayit`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
        { url: `${BASE_URL}/sifremi-unuttum`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/sifremi-yenile`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${BASE_URL}/profil`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
        { url: `${BASE_URL}/kulupler/giris`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    ]

    const clubRoutes: MetadataRoute.Sitemap = allSlugs.map(slug => ({
        url: `${BASE_URL}/kulupler/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
    }))

    return [...staticRoutes, ...clubRoutes]
}
