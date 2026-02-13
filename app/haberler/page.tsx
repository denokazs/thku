'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Calendar, ChevronRight, Search, Filter, Newspaper, Megaphone, Bell, AlertCircle, Info, GraduationCap, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Helper to get faculty name from ID (simple mapping, could be dynamic)
const getFacultyName = (id?: string) => {
    switch (id) {
        case 'air': return 'Hava Ulaştırma';
        case 'aero': return 'Havacılık ve Uzay';
        case 'eng': return 'Mühendislik';
        case 'man': return 'İşletme';
        default: return 'Genel';
    }
};

const CATEGORIES = ['Tümü', 'Haber', 'Etkinlik', 'Duyuru', 'Başarı', 'Akademik', 'Kariyer', 'Uluslararası'];

const PRIORITY_CONFIG = {
    low: { label: 'Düşük', color: '#3B82F6', bgColor: 'bg-blue-500' },
    medium: { label: 'Orta', color: '#F59E0B', bgColor: 'bg-yellow-500' },
    high: { label: 'Yüksek', color: '#F97316', bgColor: 'bg-orange-500' },
    urgent: { label: 'Acil', color: '#EF4444', bgColor: 'bg-red-500' }
};

const ICON_MAP: Record<string, any> = {
    megaphone: Megaphone,
    bell: Bell,
    alert: AlertCircle,
    info: Info,
    calendar: Calendar,
    graduation: GraduationCap
};

// Resilient Image Component
const ImageWithFallback = ({ src, alt, facultyName }: { src?: string, alt: string, facultyName: string }) => {
    const [imgError, setImgError] = useState(false);

    if (!src || imgError) {
        return (
            <>
                <div className="absolute inset-0 flex items-center justify-center text-slate-300 bg-slate-100">
                    <Newspaper className="w-12 h-12 opacity-50" />
                </div>
                <div className="absolute top-4 left-4">
                    <span className="bg-blue-900/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm shadow-md">
                        {facultyName}
                    </span>
                </div>
            </>
        );
    }

    return (
        <>
            <img
                src={src}
                alt={alt}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4">
                <span className="bg-blue-900/90 text-white text-[10px] uppercase font-bold px-2 py-1 rounded backdrop-blur-sm shadow-md">
                    {facultyName}
                </span>
            </div>
        </>
    );
};

export default function AllNewsPage() {
    const { allNews, announcements } = useStore();
    const [selectedCategory, setSelectedCategory] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedNews, setExpandedNews] = useState<number | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

    const filteredNews = allNews.filter(item => {
        const matchesCategory = selectedCategory === 'Tümü' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const activeAnnouncements = announcements.filter(a => a.isActive !== false);

    const toggleNews = (id: number) => {
        setExpandedNews(expandedNews === id ? null : id);
    };

    const getIconComponent = (iconName?: string) => {
        return ICON_MAP[iconName || 'bell'] || Bell;
    };

    return (
        <main className="min-h-screen bg-slate-50">

            {/* Header */}
            <div className="bg-[#00205B] pt-32 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        Haberler ve Duyurular
                    </h1>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                        THK Üniversitesi kampüsünden en güncel haberler, akademik başarılar ve yaklaşan etkinlikler.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Announcements Section */}
                {activeAnnouncements.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                <Megaphone className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800">Önemli Duyurular</h2>
                                <p className="text-slate-500 text-sm">Kaçırmamanız gereken önemli bilgilendirmeler</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {activeAnnouncements.slice(0, 6).map((announcement) => {
                                const priorityConfig = PRIORITY_CONFIG[announcement.priority || 'medium'];
                                const IconComponent = getIconComponent(announcement.icon);

                                return (
                                    <motion.div
                                        key={announcement.id}
                                        onClick={() => setSelectedAnnouncement(announcement)}
                                        className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-xl transition-all group relative cursor-pointer"
                                    >
                                        {/* Priority Badge */}
                                        <div className={`absolute top-3 right-3 ${priorityConfig.bgColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>
                                            {priorityConfig.label}
                                        </div>

                                        <div className="flex items-start gap-3 mb-3">
                                            <div
                                                className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex-shrink-0"
                                                style={{ color: announcement.color || priorityConfig.color }}
                                            >
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1 pr-12">{announcement.title}</h3>
                                                <p className="text-xs text-slate-500">{announcement.date}</p>
                                            </div>
                                        </div>

                                        {announcement.description && (
                                            <p className="text-xs text-slate-600 mb-3 line-clamp-2">{announcement.description}</p>
                                        )}

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded">
                                                {announcement.category}
                                            </span>
                                            <span className="text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                                                Detaylar →
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                    ? 'bg-red-600 text-white shadow-md'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-blue-900 border border-slate-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Haber ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                        />
                    </div>
                </div>

                {/* News Grid */}
                {filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group"
                            >
                                {/* Image Placeholder (or actual image if we had one) */}
                                <div className="h-48 bg-slate-100 relative overflow-hidden">
                                    <ImageWithFallback
                                        src={item.image}
                                        alt={item.title}
                                        facultyName={getFacultyName(item.facultyId)}
                                    />
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-3 mb-3 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {item.date}
                                        </div>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-red-500 uppercase">{item.category}</span>
                                    </div>

                                    <h3
                                        className="text-lg font-bold text-slate-800 mb-3 group-hover:text-blue-900 leading-tight"
                                        dangerouslySetInnerHTML={{ __html: item.title }}
                                    />

                                    <div
                                        className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: item.summary }}
                                    />

                                    <div className="mt-auto pt-4 border-t border-slate-50">
                                        <button
                                            onClick={() => toggleNews(item.id)}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                        >
                                            {expandedNews === item.id ? 'Kapat' : 'Haberi Oku'}
                                            <ChevronRight className={`w-4 h-4 transition-transform ${expandedNews === item.id ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedNews === item.id && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="bg-blue-50/50 border-t border-blue-100 overflow-hidden"
                                        >
                                            <div
                                                className="p-6 text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none prose-p:mb-4 prose-img:rounded-xl prose-img:shadow-md"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <Filter className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Sonuç Bulunamadı</h3>
                        <p className="text-slate-500">Açıkça aramanızla eşleşen haber bulunamadı.</p>
                        <button
                            onClick={() => { setSelectedCategory('Tümü'); setSearchQuery(''); }}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>

            {/* Announcement Detail Modal */}
            <AnimatePresence>
                {selectedAnnouncement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setSelectedAnnouncement(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {(() => {
                                const priorityConfig = PRIORITY_CONFIG[selectedAnnouncement.priority as keyof typeof PRIORITY_CONFIG || 'medium'];
                                const IconComponent = getIconComponent(selectedAnnouncement.icon);

                                return (
                                    <>
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div
                                                    className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                                                    style={{ color: selectedAnnouncement.color || priorityConfig.color }}
                                                >
                                                    <IconComponent className="w-8 h-8" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`${priorityConfig.bgColor} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
                                                            {priorityConfig.label}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                                            {selectedAnnouncement.category}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                                                        {selectedAnnouncement.title}
                                                    </h2>
                                                    <p className="text-sm text-slate-500">{selectedAnnouncement.date}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedAnnouncement(null)}
                                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                            >
                                                <X className="w-5 h-5 text-slate-400" />
                                            </button>
                                        </div>

                                        {selectedAnnouncement.description && (
                                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                                <p className="text-slate-700 leading-relaxed">
                                                    {selectedAnnouncement.description}
                                                </p>
                                            </div>
                                        )}

                                        {selectedAnnouncement.url && (
                                            <a
                                                href={selectedAnnouncement.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                Daha Fazla Bilgi →
                                            </a>
                                        )}

                                        <div className="mt-6 pt-6 border-t border-slate-200 text-xs text-slate-400 text-center">
                                            Ref: THK-{String(selectedAnnouncement.id).slice(-4)}/024
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
