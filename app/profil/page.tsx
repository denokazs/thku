'use client';

import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Clock, LogOut, Loader2, AlertCircle, Award, Users, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLUBS_DATA } from '../kulupler/clubsData';

export default function ProfilePage() {
    const { user, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'clubs' | 'events'>('profile');

    // Data States
    const [events, setEvents] = useState<any[]>([]);
    const [myClubs, setMyClubs] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/giris');
            return;
        }

        fetchData();
    }, [user, authLoading, router]);

    const fetchData = async () => {
        if (!user) return;
        setLoadingData(true);
        try {
            // Fetch Events
            const eventsRes = await fetch(`/api/users/${user.id || user.username}/events`);
            if (eventsRes.ok) {
                const data = await eventsRes.json();
                setEvents(Array.isArray(data) ? data : []);
            }

            // Fetch Clubs
            const idToUse = user.studentId || user.username; // Fallback to username for non-student users
            const clubsRes = await fetch(`/api/members?studentId=${idToUse}&email=${user.email}`);
            if (clubsRes.ok) {
                const membersData = await clubsRes.json();
                // Merge member data with static club data
                const enrichedClubs = membersData.map((member: any) => {
                    const clubInfo = CLUBS_DATA.find(c => c.id === member.clubId);
                    return { ...member, clubInfo };
                }).filter((item: any) => item.clubInfo); // Filter out if club not found
                setMyClubs(enrichedClubs);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoadingData(false);
        }
    };

    const { showConfirm, showAlert } = useConfirm();

    const handleUnjoinEvent = async (eventId: number) => {
        const isConfirmed = await showConfirm({
            title: 'Ayrılma Onayı',
            message: 'Bu etkinlikten ayrılmak istediğinize emin misiniz? Kontenjan sınırlıysa tekrar katılamayabilirsiniz.',
            type: 'warning',
            confirmText: 'Ayrıl',
            cancelText: 'Vazgeç'
        });

        if (!isConfirmed) return;

        try {
            const res = await fetch('/api/events/attend', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId,
                    userId: user?.id || user?.username
                })
            });

            if (res.ok) {
                setEvents(events.filter(e => e.id !== eventId));
                setNotification({ type: 'success', message: 'Etkinlikten ayrıldınız.' });
                setTimeout(() => setNotification(null), 3000);
            } else {
                setNotification({ type: 'error', message: 'İşlem başarısız.' });
            }
        } catch (error) {
            setNotification({ type: 'error', message: 'Bir hata oluştu.' });
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            </div>
        );
    }

    if (!user) return null;

    const upcomingEvents = events.filter(e => !new Date(e.date).getTime() || new Date(e.date) >= new Date());
    const pastEvents = events.filter(e => new Date(e.date) < new Date());

    const tabs = [
        { id: 'profile', label: 'Profilim', icon: <Award className="w-4 h-4" /> },
        { id: 'clubs', label: 'Kulüplerim', icon: <Users className="w-4 h-4" />, count: myClubs.length },
        { id: 'events', label: 'Etkinliklerim', icon: <Calendar className="w-4 h-4" />, count: upcomingEvents.length }
    ];

    return (
        <div className="min-h-screen bg-slate-950 pt-32 pb-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-20 right-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, x: '-50%' }}
                            animate={{ opacity: 1, y: 20, x: '-50%' }}
                            exit={{ opacity: 0, y: -20, x: '-50%' }}
                            className={`fixed top-4 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold border ${notification.type === 'success'
                                ? 'bg-green-500/10 border-green-500/30 text-green-400 backdrop-blur-md'
                                : 'bg-red-500/10 border-red-500/30 text-red-400 backdrop-blur-md'
                                }`}
                        >
                            {notification.message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Profile Header */}
                <div className="glass-dark border border-slate-800 rounded-3xl overflow-hidden mb-8 relative group">
                    <div className="h-40 bg-gradient-to-r from-red-900 via-slate-900 to-black relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                    </div>

                    <div className="px-8 pb-8 flex flex-col md:flex-row items-end gap-6 -mt-12 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-32 h-32 bg-slate-900 rounded-2xl p-1 shadow-2xl skew-y-0 md:-skew-y-2 transform border-4 border-slate-800 relative z-10"
                        >
                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center text-5xl">
                                👤
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-slate-900"></div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-left pt-14 md:pt-0">
                            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{user.name || user.username}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-sm font-medium text-slate-400">
                                <span className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">{user.department || 'Bölüm Bilgisi Yok'}</span>
                                <span className="bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700 uppercase">{(user.role === 'super_admin' || user.role === 'club_admin') ? '🔥 Admin' : '🎓 Öğrenci'}</span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="group flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white px-6 py-3 rounded-xl font-bold transition-all border border-red-500/20"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden md:inline">Çıkış Yap</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Navigation Sidebar */}
                    <div className="space-y-4">
                        <div className="glass-dark border border-slate-800 p-2 rounded-2xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all mb-1 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {tab.icon}
                                        {tab.label}
                                    </div>
                                    {tab.count !== undefined && (
                                        <span className={`text-xs px-2 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Quick Stats or Info */}
                        <div className="glass-dark border border-slate-800 p-6 rounded-2xl">
                            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">Öğrenci Kartı</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-slate-600 text-xs font-bold">Öğrenci No</label>
                                    <div className="text-white font-mono text-lg tracking-widest">{user.studentId || '---'}</div>
                                </div>
                                <div className="h-px bg-slate-800"></div>
                                <div>
                                    <label className="text-slate-600 text-xs font-bold">E-posta</label>
                                    <div className="text-slate-300 text-sm truncate">{user.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-6"
                                >
                                    <div className="glass-dark border border-slate-800 rounded-2xl p-8">
                                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                            <Award className="w-6 h-6 text-yellow-500" />
                                            Kişisel Bilgiler
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Telefon</label>
                                                <div className="text-white font-medium">{user.phone || 'Girilmemiş'}</div>
                                            </div>
                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                                <label className="block text-slate-500 text-xs font-bold uppercase mb-1">Kayıt Tarihi</label>
                                                <div className="text-white font-medium">Bahar 2026</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'clubs' && (
                                <motion.div
                                    key="clubs"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <h2 className="text-2xl font-black text-white mb-6">Üye Olduğum Kulüpler</h2>

                                    {loadingData ? (
                                        <div className="text-slate-500">Yükleniyor...</div>
                                    ) : myClubs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {myClubs.map((membership) => (
                                                <Link href={`/kulupler/${membership.clubInfo.slug}`} key={membership.id}>
                                                    <div className="glass-dark border border-slate-800 p-6 rounded-2xl hover:border-red-500/50 transition-all group flex items-start gap-4">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center text-3xl shadow-lg border border-slate-700 group-hover:scale-110 transition-transform">
                                                            {membership.clubInfo.logo}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start">
                                                                <h3 className="text-white font-bold text-lg group-hover:text-red-400 transition-colors">{membership.clubInfo.name}</h3>
                                                                {membership.status === 'pending' ? (
                                                                    <span className="bg-yellow-500/10 text-yellow-500 text-xs font-bold px-2 py-1 rounded-md border border-yellow-500/20">Onay Bekliyor</span>
                                                                ) : (
                                                                    <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded-md border border-green-500/20">Üye</span>
                                                                )}
                                                            </div>
                                                            <p className="text-slate-500 text-sm mt-1">{membership.department}</p>
                                                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                                                                <Clock className="w-3 h-3" />
                                                                <span>Başvuru: {new Date(membership.id).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="glass-dark border border-slate-800 p-8 rounded-2xl text-center">
                                            <div className="text-4xl mb-4">😶</div>
                                            <h3 className="text-xl font-bold text-white mb-2">Henüz Bir Kulübe Üye Değilsin</h3>
                                            <p className="text-slate-400 mb-6">İlgi alanlarına uygun kulüpleri keşfetmeye başla!</p>
                                            <Link href="/kulupler" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                                                Kulüpleri İncele <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'events' && (
                                <motion.div
                                    key="events"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-6 h-6 text-green-500" /> Aktif Başvurularım & Etkinlikler
                                        </h2>
                                        {loadingData ? (
                                            <div className="text-slate-500">Yükleniyor...</div>
                                        ) : upcomingEvents.length > 0 ? (
                                            <div className="space-y-4">
                                                {upcomingEvents.map(event => (
                                                    <div key={event.id} className="glass-dark border border-slate-800 p-5 rounded-2xl hover:border-slate-600 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                                        <div>
                                                            <div className="text-xs font-bold text-red-500 uppercase mb-1">{event.category}</div>
                                                            <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mt-2">
                                                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-500" /> {new Date(event.date).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-500" /> {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-500" /> {event.location}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleUnjoinEvent(event.id)}
                                                            className="self-end md:self-center bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl font-bold text-sm transition-colors border border-red-500/20 opacity-0 group-hover:opacity-100"
                                                        >
                                                            Vazgeç
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="glass-dark border border-slate-800 p-6 rounded-2xl text-center text-slate-500">
                                                Yaklaşan bir etkinlik bulunmuyor.
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-bold text-slate-500 mb-4 flex items-center gap-2">
                                            <Clock className="w-5 h-5" /> Geçmiş Etkinlikler
                                        </h2>
                                        {pastEvents.length > 0 ? (
                                            <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                                                {pastEvents.map(event => (
                                                    <div key={event.id} className="glass-dark border border-slate-800 p-5 rounded-2xl">
                                                        <h3 className="font-bold text-slate-300">{event.title}</h3>
                                                        <div className="text-sm text-slate-500 mt-1">
                                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-slate-600 text-sm">Geçmiş etkinlik yok.</div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
