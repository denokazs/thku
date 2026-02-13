'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FACULTIES } from '@/data/faculties';
import { useStore } from '@/context/StoreContext';

import { Calendar, ChevronRight, Globe, Layers, MapPin, Phone, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NewsImage = ({ src, alt, category }: { src?: string, alt: string, category: string }) => {
    const [imgError, setImgError] = useState(false);

    if (!src || imgError) {
        return (
            <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Calendar className="w-12 h-12 opacity-20" />
                </div>
                <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                    {category}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full relative">
            <img
                src={src}
                alt={alt}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                {category}
            </div>
        </div>
    );
};

export default function FacultyPage() {
    // useParams returns string or string[], ensuring id is handled correctly
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const [expandedNews, setExpandedNews] = useState<number | null>(null);

    const { allNews } = useStore();

    // Filter news from the central store for this specific faculty
    const faculty = FACULTIES.find(f => f.id === id);
    const news = allNews.filter(n => n.facultyId === id);

    const toggleNews = (newsId: number) => {
        setExpandedNews(expandedNews === newsId ? null : newsId);
    };

    if (!faculty) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-300 mb-4">404</h1>
                    <p className="text-slate-500 font-bold mb-8">Fakülte bulunamadı.</p>
                    <Link href="/" className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50">


            {/* Hero Header */}
            <div className="bg-[#00205B] pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/#faculties" className="inline-flex items-center text-blue-200 hover:text-white mb-6 text-sm font-bold transition-colors">
                        <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                        Tüm Fakülteler
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                        {faculty.name}
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl font-light leading-relaxed">
                        {faculty.description}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content: News & Departments */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Departments Section */}
                        <section>
                            <h2 className="text-2xl font-black text-blue-950 mb-6 flex items-center gap-2">
                                <Layers className="w-6 h-6 text-red-600" />
                                Bölümler ve Programlar
                            </h2>
                            <div className="grid gap-4">
                                {faculty.departments.map((dept, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                                        <h3 className="text-lg font-bold text-[#00205B] mb-2 group-hover:text-blue-600 transition-colors">
                                            {dept.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {dept.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* News Feed */}
                        <section>
                            <h2 className="text-2xl font-black text-blue-950 mb-6 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-red-600" />
                                Haberler
                            </h2>

                            {news.length > 0 ? (
                                <div className="space-y-6">
                                    {news.map((item) => (
                                        <div
                                            key={item.id}
                                            className={`bg-white rounded-2xl border border-slate-100 shadow-sm transition-all overflow-hidden ${expandedNews === item.id ? 'ring-2 ring-blue-100' : ''}`}
                                        >
                                            {/* Image and Date/Category */}
                                            <div className="relative">
                                                {/* Date Badge */}
                                                <div className="absolute top-4 left-4 z-10">
                                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold shadow-md text-blue-950 flex flex-col items-center">
                                                        <span className="text-xl">{item.date.split(' ')[0]}</span>
                                                        <span className="uppercase text-[10px]">{item.date.split(' ')[1]}</span>
                                                    </div>
                                                </div>

                                                {/* Image Area */}
                                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                                    <NewsImage
                                                        src={item.image}
                                                        alt={item.title}
                                                        category={item.category}
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                                                onClick={() => toggleNews(item.id)}
                                            >
                                                <h4 className="text-xl font-bold text-slate-800 mb-2">
                                                    {item.title}
                                                </h4>
                                                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                                                    {item.summary}
                                                </p>

                                                <button className="text-xs font-bold text-red-600 flex items-center gap-1 group">
                                                    {expandedNews === item.id ? 'Daralt' : 'Devamını Oku'}
                                                    {expandedNews === item.id ? (
                                                        <ChevronUp className="w-3 h-3" />
                                                    ) : (
                                                        <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
                                                    )}
                                                </button>
                                            </div>


                                            <AnimatePresence>
                                                {expandedNews === item.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-slate-50 border-t border-slate-100"
                                                    >
                                                        <div className="p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                                                            {item.content || item.summary}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 bg-slate-100 rounded-2xl text-center text-slate-500">
                                    Henüz güncel bir duyuru bulunmamaktadır.
                                </div>
                            )}
                        </section>

                    </div>

                    {/* Sidebar: Contact & Info */}
                    <aside className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-600 sticky top-24">
                            <h3 className="text-lg font-bold text-blue-950 mb-6">İletişim Bilgileri</h3>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-slate-600">
                                        <strong>Türkkuşu Kampüsü</strong><br />
                                        Bahçekapı Mahallesi, Okul Sokak No: 11<br />
                                        06790 Etimesgut / ANKARA
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="w-5 h-5 text-slate-400" />
                                    <p className="text-slate-600">444 84 58</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-blue-950 mb-3">Hızlı Linkler</h4>
                                <ul className="space-y-2 text-sm text-slate-500">
                                    <li className="hover:text-red-600 cursor-pointer transition-colors">• Akademik Kadro</li>
                                    <li className="hover:text-red-600 cursor-pointer transition-colors">• Ders Programları</li>
                                    <li className="hover:text-red-600 cursor-pointer transition-colors">• Sınav Takvimi</li>
                                    <li className="hover:text-red-600 cursor-pointer transition-colors">• Öğrenci İşleri</li>
                                </ul>
                            </div>
                        </div>
                    </aside>

                </div >
            </div >

        </main >
    );
}
