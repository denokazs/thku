export default function EventSchema({ event }: { event: any }) {
    if (!event) return null;

    const eventSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        description: event.description,
        startDate: event.date,
        location: {
            '@type': 'Place',
            name: event.location || 'THK Üniversitesi Kampüsü',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Ankara',
                addressCountry: 'TR'
            }
        },
        image: event.coverImage || event.images?.[0],
        organizer: {
            '@type': 'Organization',
            name: event.organizerName || 'THK Üniversitesi',
            url: 'https://thku.com.tr'
        },
        ...(event.price && {
            offers: {
                '@type': 'Offer',
                price: event.price,
                priceCurrency: 'TRY',
                availability: event.capacity ? 'https://schema.org/InStock' : 'https://schema.org/LimitedAvailability'
            }
        })
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(eventSchema)
            }}
        />
    )
}
