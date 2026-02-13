export default function StructuredData() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'EducationalOrganization',
        name: 'THK Üniversitesi',
        alternateName: 'Türk Hava Kurumu Üniversitesi',
        url: 'https://thku.com.tr',
        logo: 'https://thku.com.tr/logo.png',
        description: "Türkiye'nin Havacılık ve Uzay Bilimleri Merkezi",
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Ankara',
            addressCountry: 'TR'
        },
        sameAs: [
            'https://www.facebook.com/thkuniv',
            'https://twitter.com/thkuniv',
            'https://www.instagram.com/thkuniv'
        ]
    }

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'THK Üniversitesi Sky Portal',
        url: 'https://thku.com.tr',
        potentialAction: {
            '@type': 'SearchAction',
            target: 'https://thku.com.tr/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema)
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema)
                }}
            />
        </>
    )
}
