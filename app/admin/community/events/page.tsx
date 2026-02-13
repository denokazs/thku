'use client';

import { useState, useEffect } from 'react';
import { Search, Rocket, Calendar, MapPin, Users, Star } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    clubId: number;
    attendees: number;
    isFeatured: boolean;
}

interface Club {
    id: number;
    name: string;
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [eventsRes, clubsRes] = await Promise.all([
                fetch('/api/events'),
                fetch('/api/clubs')
            ]);

            if (eventsRes.ok && clubsRes.ok) {
                const eventsData = await eventsRes.json();
                const clubsData = await clubsRes.json();
                setEvents(eventsData);
                setClubs(clubsData);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleFeatured = async (event: Event) => {
        setProcessingId(event.id);
        try {
            const res = await fetch('/api/events', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: event.id,
                    isFeatured: !event.isFeatured
                })
            });

            if (res.ok) {
                setEvents(prev => prev.map(e =>
                    e.id === event.id ? { ...e, isFeatured: !e.isFeatured } : e
                ));
            }
        } catch (error) {
            console.error('Failed to toggle featured status', error);
        } finally {
            setProcessingId(null);
        }
    };

    const getClubName = (clubId: number) => {
        return clubs.find(c => c.id === clubId)?.name || 'Bilinmeyen Kulüp';
    };

    const filteredEvents = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getClubName(e.clubId).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Etkinlik Yönetimi</h1>
                    <p className="text-slate-500">Etkinlikleri düzenle ve öne çıkanları belirle</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Etkinlik veya kulüp ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600">Etkinlik</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Kulüp</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Konum & Tarih</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-center">Öne Çıkar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-slate-900">{event.title}</div>
                                    <div className="text-xs text-slate-500 max-w-xs line-clamp-1">{event.description}</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                            {getClubName(event.clubId)}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col gap-1 text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(event.date).toLocaleDateString('tr-TR')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {event.location}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => toggleFeatured(event)}
                                        disabled={processingId === event.id}
                                        className={`
                                            p-2 rounded-lg transition-all
                                            ${event.isFeatured
                                                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                                            }
                                            ${processingId === event.id ? 'opacity-50 cursor-wait' : ''}
                                        `}
                                        title={event.isFeatured ? "Öne Çıkarılanlardan Kaldır" : "Öne Çıkar"}
                                    >
                                        <Star className={`w-5 h-5 ${event.isFeatured ? 'fill-current' : ''}`} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredEvents.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                        Arama kriterlerinize uygun etkinlik bulunamadı.
                    </div>
                )}
            </div>
        </div>
    );
}
