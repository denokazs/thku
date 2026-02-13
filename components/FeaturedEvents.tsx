'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Star } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    coverImage?: string;
    images?: string[];
    isFeatured?: boolean;
    clubSlug: string;
    clubName: string;
}

export default function FeaturedEvents() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/events?featured=true&limit=3');
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data);
                }
            } catch (error) {
                console.error('Failed to fetch featured events', error);
            }
        };

        fetchFeatured();
    }, []);

    if (events.length === 0) return null;

    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                        <Star className="w-6 h-6 fill-yellow-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Öne Çıkan Etkinlikler</h2>
                        <p className="text-slate-500">Kaçırmamanız gereken önemli organizasyonlar</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            key={event.id}
                            className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1"
                        >
                            {/* Image or Pattern */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {event.images && event.images.length > 0 ? (
                                    <img
                                        src={event.coverImage || event.images[0]}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <Calendar className="w-12 h-12 text-white/50" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                    {event.clubName}
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex gap-4 mb-4">
                                    <div className="text-center px-3 py-1 bg-blue-50 rounded-lg h-fit">
                                        <div className="text-sm font-bold text-blue-600">
                                            {new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' }).toUpperCase()}
                                        </div>
                                        <div className="text-xl font-black text-slate-800">
                                            {new Date(event.date).getDate()}
                                        </div>
                                    </div>

                                    <div>
                                        <div
                                            className="font-bold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1"
                                            dangerouslySetInnerHTML={{ __html: event.title }}
                                        />
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <MapPin className="w-4 h-4" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/kulupler/${event.clubSlug}/etkinlik/${event.id}`}
                                    className="block w-full text-center py-2.5 bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-600 text-sm font-bold rounded-xl transition-all"
                                >
                                    Detayları İncele
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
