'use client';

import { useStore } from '@/context/StoreContext';
import { Megaphone, Bell, AlertCircle, Info, Calendar, GraduationCap, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PRIORITY_CONFIG = {
    low: { label: 'Düşük', color: '#3B82F6', bgColor: 'bg-blue-500', textColor: 'text-blue-600' },
    medium: { label: 'Orta', color: '#F59E0B', bgColor: 'bg-yellow-500', textColor: 'text-yellow-600' },
    high: { label: 'Yüksek', color: '#F97316', bgColor: 'bg-orange-500', textColor: 'text-orange-600' },
    urgent: { label: 'Acil', color: '#EF4444', bgColor: 'bg-red-500', textColor: 'text-red-600' }
};

const ICON_MAP: Record<string, any> = {
    megaphone: Megaphone,
    bell: Bell,
    alert: AlertCircle,
    info: Info,
    calendar: Calendar,
    graduation: GraduationCap
};

export default function NewsSlider() {
    const { announcements } = useStore();
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

    const getIconComponent = (iconName?: string) => {
        return ICON_MAP[iconName || 'bell'] || Bell;
    };

    // Filter active announcements only
    const activeAnnouncements = announcements.filter(a => a.isActive !== false);

    return (
        <>
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-red-600 font-bold tracking-widest uppercase text-sm mb-2">Haberler ve Etkinlikler</h2>
                            <h3 className="text-3xl font-bold text-blue-950">Güncel Uçuş Planı</h3>
                        </div>
                        <Link
                            href="/haberler"
                            className="hidden md:block border border-blue-900 text-blue-900 px-6 py-2 rounded-full hover:bg-blue-900 hover:text-white transition-colors text-sm font-bold"
                        >
                            Tüm Haber Arşivi
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {activeAnnouncements.map((news) => {
                            const priorityConfig = PRIORITY_CONFIG[news.priority || 'medium'];
                            const IconComponent = getIconComponent(news.icon);

                            return (
                                <div
                                    key={news.id}
                                    onClick={() => setSelectedAnnouncement(news)}
                                    className="bg-white rounded-3xl shadow-xl flex flex-col sm:flex-row overflow-hidden group hover:shadow-2xl transition-all duration-300 border border-gray-100 relative cursor-pointer"
                                >
                                    {/* Priority Badge */}
                                    <div className={`absolute top-4 right-4 ${priorityConfig.bgColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase z-10 shadow-lg`}>
                                        {priorityConfig.label}
                                    </div>

                                    {/* Left: Date/Info */}
                                    <div className="bg-blue-950 text-white p-6 justify-between flex flex-col sm:w-1/3 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full -mr-10 -mt-10"></div>
                                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-red-600/20 rounded-tr-full -ml-8 -mb-8"></div>

                                        <div className="relative z-10">
                                            <span className="text-4xl font-black block">{news.date.split(' ')[0]}</span>
                                            <span className="text-lg font-light uppercase tracking-widest block">{news.date.split(' ')[1]}</span>
                                            <span className="text-xs font-bold opacity-60 block mt-1">{news.date.split(' ')[2] || ''}</span>
                                        </div>
                                        <div className="relative z-10 mt-4 sm:mt-0">
                                            <span className="text-xs opacity-70 block uppercase">Kategori</span>
                                            <span className="font-bold text-red-400">{news.category}</span>
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                        {/* Perforation Line Visual */}
                                        <div className="absolute left-0 top-0 bottom-0 w-0 border-l-2 border-dashed border-gray-300 hidden sm:block"></div>
                                        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-slate-50 rounded-full hidden sm:block"></div>

                                        <div>
                                            <div className="flex items-start gap-3 mb-3">
                                                <div
                                                    className="p-2 rounded-lg bg-white border border-slate-200 flex-shrink-0"
                                                    style={{ color: news.color || priorityConfig.color }}
                                                >
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4
                                                        className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-2"
                                                        dangerouslySetInnerHTML={{ __html: news.title }}
                                                    />
                                                    {news.description ? (
                                                        <div
                                                            className="text-gray-500 text-sm line-clamp-2"
                                                            dangerouslySetInnerHTML={{ __html: news.description }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="text-gray-500 text-sm line-clamp-2"
                                                            dangerouslySetInnerHTML={{ __html: `THK Üniversitesi ${news.category.toLowerCase()} bülteni kapsamında yayınlanan detaylı bilgilendirme.` }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                                            <div className="text-xs text-gray-400">
                                                <span>Ref: THK-{String(news.id).slice(-4)}/024</span>
                                            </div>
                                            <div className="text-xs font-bold text-blue-600">
                                                Detaylar →
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

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
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                                Daha Fazla Bilgi
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
        </>
    );
}
