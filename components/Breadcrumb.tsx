import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Ana Sayfa',
                item: 'https://thku.com.tr'
            },
            ...items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 2,
                name: item.label,
                ...(item.href && { item: `https://thku.com.tr${item.href}` })
            }))
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema)
                }}
            />
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
                            aria-label="Ana Sayfa"
                        >
                            <Home className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </li>
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
                            {item.href && index < items.length - 1 ? (
                                <Link
                                    href={item.href}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-900 font-medium" aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
}
