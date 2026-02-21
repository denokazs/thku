'use client';

import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft, Info, CheckCircle, Users, MessageSquare, ChevronRight, Share2, CalendarPlus, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import ConfirmModal from '@/components/ConfirmModal';

interface EventDetailsClientProps {
    slug: string;
    event: any;
    club: any;
}

export default function EventDetailsClient({ slug, event, club }: EventDetailsClientProps) {
    const { user } = useAuth();
    const router = useRouter();
    const eventDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : null;

    const [hasJoined, setHasJoined] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [attendeeCount, setAttendeeCount] = useState(event.attendees || 0);

    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'info' | 'danger' | 'success' | 'warning';
        confirmText?: string;
        showCancel?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'info',
        showCancel: true
    });

    // Check if user has already joined
    useEffect(() => {
        if (user && event.id) {
            const userId = user.id || user.username;
            if (!userId) {
                console.warn('User ID not available for attendance check');
                return;
            }
            fetch(`/api/events/attend?eventId=${event.id}&userId=${userId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.hasJoined) setHasJoined(true);
                })
                .catch(console.error);
        }
    }, [user, event.id]);

    const handleJoinEvent = async () => {
        if (!user) {
            setConfirmModal({
                isOpen: true,
                title: 'Giriş Yapmalısınız',
                message: 'Etkinliğe katılmak için giriş yapmalısınız. Giriş sayfasına gidilsin mi?',
                confirmText: 'Giriş Yap',
                type: 'info',
                onConfirm: () => router.push('/giris')
            });
            return;
        }

        setIsJoining(true);
        try {
            // If already joined, leave (DELETE)
            // If not joined, join (POST)
            const method = hasJoined ? 'DELETE' : 'POST';

            const res = await fetch('/api/events/attend', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    userId: user.id || user.username
                })
            });

            const data = await res.json();

            if (res.ok) {
                setHasJoined(!hasJoined);
                if (data.attendees !== undefined) {
                    setAttendeeCount(data.attendees);
                } else {
                    // Fallback local update if server returns nothing
                    setAttendeeCount((prev: number) => hasJoined ? Math.max(0, prev - 1) : prev + 1);
                }

                if (!hasJoined) {
                    setConfirmModal({
                        isOpen: true,
                        title: 'Katılım Başarılı 🎉',
                        message: 'Etkinliğe başarıyla kaydoldunuz!',
                        confirmText: 'Tamam',
                        showCancel: false,
                        type: 'success',
                        onConfirm: () => { }
                    });
                }
            } else {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hata',
                    message: data.error || 'Bir hata oluştu.',
                    confirmText: 'Tamam',
                    showCancel: false,
                    type: 'danger',
                    onConfirm: () => { }
                });
            }
        } catch (error) {
            console.error('Join error:', error);
            setConfirmModal({
                isOpen: true,
                title: 'Hata',
                message: 'İşlem sırasında bir hata oluştu.',
                confirmText: 'Tamam',
                showCancel: false,
                type: 'danger',
                onConfirm: () => { }
            });
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Header with Image */}
            <div className="h-[400px] relative bg-slate-900">
                {/* Cover Image or First Gallery Image */}
                {event.coverImage ? (
                    <div className="absolute inset-0">
                        <img src={event.coverImage} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                ) : event.images && event.images.length > 0 ? (
                    <div className="absolute inset-0">
                        <img
                            src={event.images[0]}
                            alt={event.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 opacity-80" />
                )}

                <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Link
                            href={`/kulupler/${slug}`}
                            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors font-bold"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            {club.name} Sayfasına Dön
                        </Link>
                    </motion.div>

                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                            {event.category || 'Etkinlik'}
                        </span>
                        {endDate && new Date() > endDate && (
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                Tamamlandı
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap gap-6 text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-red-400" />
                            <span>{eventDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-400" />
                            <span>{event.time || eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-yellow-400" />
                            <span>{event.location}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                        <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                            <Info className="w-6 h-6 text-blue-600" />
                            Etkinlik Detayları
                        </h2>
                        <div className="prose prose-lg text-slate-600">
                            <p className="whitespace-pre-line leading-relaxed">{event.description}</p>
                        </div>
                    </section>
                    {/* Requirements */}
                    {event.requirements && (
                        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                Katılım Şartları & Gereksinimler
                            </h2>
                            <div className="prose prose-slate whitespace-pre-line text-slate-600">
                                {event.requirements}
                            </div>
                        </section>
                    )}

                    {/* Schedule */}
                    {event.schedule && event.schedule.length > 0 && (
                        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                Etkinlik Akışı
                            </h2>
                            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {event.schedule.map((item: any, idx: number) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className="absolute left-0 top-1.5 w-[35px] h-[35px] bg-white border-2 border-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary z-10 shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            <div className="text-red-600 font-bold text-sm mb-1">{item.time}</div>
                                            <div className="font-bold text-slate-800">{item.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}


                    {/* Event Images Gallery */}
                    {event.images && event.images.length > 0 && (
                        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-purple-600" />
                                Etkinlik Görselleri
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {event.images.map((img: string, idx: number) => (
                                    <div key={idx} className="aspect-video rounded-xl overflow-hidden cursor-pointer group relative">
                                        <img
                                            src={img}
                                            alt={`Etkinlik görseli ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onClick={() => window.open(img, '_blank')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Speakers */}
                    {/* Speakers */}
                    {event.speakers && event.speakers.length > 0 && (
                        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-600" />
                                Konuşmacılar
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {event.speakers.map((speaker: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:border-purple-200 transition-colors group">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-200 bg-white flex-shrink-0 group-hover:border-purple-200 transition-colors">
                                            {speaker.image ? <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎤</div>}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg">{speaker.name}</div>
                                            <div className="text-slate-500 text-sm">{speaker.title}</div>
                                            {speaker.company && <div className="text-slate-400 text-xs mt-1 font-semibold">{speaker.company}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQ */}
                    {event.faq && event.faq.length > 0 && (
                        <section className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                            <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                Sıkça Sorulan Sorular
                            </h2>
                            <div className="space-y-4">
                                {event.faq.map((item: any, idx: number) => (
                                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                                        <details className="group">
                                            <summary className="flex justify-between items-center font-bold p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                                                {item.question}
                                                <span className="transition group-open:rotate-180">
                                                    <ChevronRight className="w-4 h-4" />
                                                </span>
                                            </summary>
                                            <div className="text-slate-600 p-4 pt-0 whitespace-pre-line bg-white leading-relaxed border-t border-slate-100 mt-2">
                                                {item.answer}
                                            </div>
                                        </details>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    {/* Enrollment Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-slate-800">Katılım Durumu</h3>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                {attendeeCount}/{event.capacity === -1 || event.capacity === '-1' ? '∞' : event.capacity}
                            </span>
                        </div>

                        {event.capacity !== -1 && event.capacity !== '-1' && (
                            <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
                                <div
                                    className="bg-green-500 h-3 rounded-full"
                                    style={{ width: `${Math.min(100, (attendeeCount / event.capacity) * 100)}%` }}
                                />
                            </div>
                        )}

                        {event.registrationLink ? (
                            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-600/30 transition-all hover:-translate-y-1 mb-3">
                                Kayıt Ol
                            </a>
                        ) : (
                            <button
                                onClick={handleJoinEvent}
                                disabled={isJoining}
                                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all hover:-translate-y-1 mb-3 ${hasJoined
                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
                                    } disabled:opacity-70 disabled:hover:translate-y-0`}
                            >
                                {isJoining ? 'İşleniyor...' : (hasJoined ? 'Katıldınız ✅' : 'Etkinliğe Katıl')}
                            </button>
                        )}

                        <p className="text-center text-xs text-slate-400 mb-6">
                            {event.capacity === -1 || event.capacity === '-1' ? 'Kontenjan sınırı yoktur.' : 'Kontenjan sınırlıdır.'}
                        </p>

                        {/* Share & Calendar Actions */}
                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: event.title,
                                            text: `${event.title} etkinliği seni bekliyor!`,
                                            url: window.location.href,
                                        });
                                    } else {
                                        navigator.clipboard.writeText(window.location.href);
                                        setConfirmModal({
                                            isOpen: true,
                                            title: 'Link Kopyalandı',
                                            message: 'Etkinlik linki panoya kopyalandı.',
                                            confirmText: 'Tamam',
                                            showCancel: false,
                                            type: 'success',
                                            onConfirm: () => { }
                                        });
                                    }
                                }}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
                            >
                                <Share2 className="w-4 h-4" /> Paylaş
                            </button>
                            <button
                                onClick={() => {
                                    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${eventDate.toISOString().replace(/-|:|\.\d\d\d/g, "")}/${(endDate || new Date(eventDate.getTime() + 3600000)).toISOString().replace(/-|:|\.\d\d\d/g, "")}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
                                    window.open(googleCalendarUrl, '_blank');
                                }}
                                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-sm transition-colors"
                            >
                                <CalendarPlus className="w-4 h-4" /> Takvime Ekle
                            </button>
                        </div>
                    </div>

                    {/* Organizer Card */}
                    <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl shadow-inner">
                            {club.logo && (club.logo.startsWith('/') || club.logo.startsWith('http')) ? (
                                <img src={club.logo} alt={club.name} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <span className="text-3xl">{club.logo || '🎓'}</span>
                            )}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Düzenleyen</div>
                            <div className="font-bold text-blue-950 text-lg">{club.name}</div>
                        </div>
                    </div>

                </motion.div>
            </div>
            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
                showCancel={confirmModal.showCancel}
            />
        </div>
    );
}
