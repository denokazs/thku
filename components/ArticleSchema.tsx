export default function ArticleSchema({ article }: { article: any }) {
    if (!article) return null;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.summary || article.description,
        datePublished: article.date,
        dateModified: article.updatedAt || article.date,
        author: {
            '@type': 'Organization',
            name: 'THK Üniversitesi'
        },
        publisher: {
            '@type': 'Organization',
            name: 'THK Üniversitesi',
            logo: {
                '@type': 'ImageObject',
                url: 'https://thku.com.tr/logo.png'
            }
        },
        image: article.image || '/og-image.jpg',
        articleSection: article.category || 'Haberler'
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(articleSchema)
            }}
        />
    )
}
