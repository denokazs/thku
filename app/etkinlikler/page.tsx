'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, Star } from 'lucide-react';
import Link from 'next/link';

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

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Fetch all events
                const res = await fetch('/api/events');
                if (res.ok) {
                    const data = await res.json();

                    // Fetch clubs to map names/slugs
                    const clubsRes = await fetch('/api/clubs');
                    const clubs = await clubsRes.json();

                    // Enrich events with club info
                    const enrichedEvents = data.map((event: any) => {
                        const club = clubs.find((c: any) => c.id === event.clubId);
                        return {
                            ...event,
                            clubSlug: club?.slug || 'unknown',
                            clubName: club?.name || 'Kulüp'
                        };
                    });

                    setEvents(enrichedEvents);
                }
            } catch (error) {
                console.error('Failed to fetch events', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.clubName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort: Featured first, then by date (soonest first)
    filteredEvents.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
                        Kampüs Etkinlikleri
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Tüm kulüp etkinliklerini buradan takip edebilirsiniz.
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-xl mx-auto mb-12">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Etkinlik veya kulüp ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={event.id}
                            className={`group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border relative ${event.isFeatured
                                ? 'border-yellow-400 ring-4 ring-yellow-500/20 shadow-lg shadow-yellow-500/10 scale-[1.02]'
                                : 'border-slate-200 hover:border-blue-300 hover:shadow-blue-500/10'
                                }`}
                        >
                            {/* Featured Ribbon/Effect */}
                            {event.isFeatured && (
                                <div className="absolute top-0 right-0 z-20 overflow-hidden w-24 h-24 pointer-events-none">
                                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-black py-1 w-32 -rotate-45 translate-x-[28%] translate-y-[45%] text-center shadow-md">
                                        ÖNE ÇIKAN
                                    </div>
                                </div>
                            )}

                            {/* Image */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {(event.coverImage || (event.images && event.images.length > 0)) ? (
                                    <img
                                        src={event.coverImage || event.images![0]}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className={`w-full h-full flex items-center justify-center ${event.isFeatured
                                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50'
                                        : 'bg-gradient-to-br from-blue-50 to-indigo-50'
                                        }`}>
                                        <Calendar className={`w-12 h-12 ${event.isFeatured ? 'text-yellow-400' : 'text-blue-400'}`} />
                                    </div>
                                )}

                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm z-10">
                                    {event.clubName}
                                </div>
                            </div>

                            {/* Content */}
                            <div className={`p-6 ${event.isFeatured
                                ? 'bg-gradient-to-b from-yellow-50/50 to-white'
                                : 'bg-gradient-to-b from-slate-50/30 to-white'
                                }`}>
                                <div className="flex gap-4">
                                    <div className={`text-center px-3 py-1 rounded-lg h-fit border ${event.isFeatured
                                        ? 'bg-yellow-100 border-yellow-200 text-yellow-800'
                                        : 'bg-blue-50 border-blue-100 text-blue-600'
                                        }`}>
                                        <div className="text-xs font-bold uppercase opacity-80">
                                            {new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' })}
                                        </div>
                                        <div className="text-xl font-black">
                                            {new Date(event.date).getDate()}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold text-lg mb-1 transition-colors truncate ${event.isFeatured
                                            ? 'text-slate-900 group-hover:text-yellow-700'
                                            : 'text-slate-800 group-hover:text-blue-600'
                                            }`}>
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/kulupler/${event.clubSlug}/etkinlik/${event.id}`}
                                    className={`block w-full text-center py-2.5 text-sm font-bold rounded-xl transition-all mt-4 ${event.isFeatured
                                        ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20'
                                        }`}
                                >
                                    Detayları İncele
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
