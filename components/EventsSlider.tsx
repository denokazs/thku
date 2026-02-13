'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

interface Event {
    id: number;
    clubId: number;
    clubName: string;
    clubSlug?: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    location: string;
    coverImage?: string;
    images: string[];
    category: string;
}

export default function EventsSlider({ events }: { events: Event[] }) {
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        // Filter and sort events
        const now = new Date();
        const future = events
            .filter(e => new Date(e.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setUpcomingEvents(future);
    }, [events]);

    useEffect(() => {
        if (sliderRef.current) {
            setWidth(sliderRef.current.scrollWidth - sliderRef.current.offsetWidth);
        }
    }, [upcomingEvents]);

    if (upcomingEvents.length === 0) return null;

    return (
        <div className="mb-16">
            <div className="flex items-center gap-3 mb-6 px-2">
                <div className="bg-yellow-500/20 p-2 rounded-lg border border-yellow-500/50">
                    <Calendar className="w-6 h-6 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-black text-white">Gelecek Etkinlikler</h2>
                <div className="ml-auto flex gap-2">
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                        {upcomingEvents.length} Etkinlik
                    </span>
                </div>
            </div>

            <motion.div ref={sliderRef} className="cursor-grab active:cursor-grabbing overflow-hidden">
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    className="flex gap-6 pb-8"
                >
                    {upcomingEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const isToday = new Date().toDateString() === eventDate.toDateString();

                        return (
                            <motion.div
                                key={event.id}
                                className="min-w-[300px] md:min-w-[350px] relative group"
                            >
                                <div className="glass-dark border border-slate-700/50 rounded-2xl overflow-hidden h-full flex flex-col hover:border-yellow-500/50 transition-colors duration-300">
                                    {/* Image or Pattern Header */}
                                    <div className="h-32 bg-slate-800 relative overflow-hidden">
                                        {event.coverImage ? (
                                            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : event.images && event.images.length > 0 ? (
                                            <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-6">
                                                <div className="text-4xl opacity-20">📅</div>
                                            </div>
                                        )}

                                        {/* Date Badge */}
                                        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 px-3 py-1.5 rounded-lg text-center min-w-[60px]">
                                            <div className="text-xs text-slate-400 font-bold uppercase">{eventDate.toLocaleDateString('tr-TR', { month: 'short' })}</div>
                                            <div className="text-xl font-black text-white">{eventDate.getDate()}</div>
                                        </div>

                                        {isToday && (
                                            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg animate-pulse">
                                                BUGÜN
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="text-xs font-black text-yellow-500 mb-1 uppercase tracking-wide">
                                            {event.clubName}
                                        </div>
                                        <h3
                                            className="text-lg font-bold text-white mb-2 line-clamp-2"
                                            title={event.title}
                                            dangerouslySetInnerHTML={{ __html: event.title }}
                                        />

                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400 text-xs">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/kulupler/${event.clubSlug || 'robotics'}/etkinlik/${event.id}`}
                                            className="mt-4 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white pt-4 border-t border-slate-700/50"
                                        >
                                            Detayları İncele
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>
        </div>
    );
}
