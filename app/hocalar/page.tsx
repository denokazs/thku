'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { GraduationCap, Search, Star, MessageSquare, FileText, ArrowLeft, Loader2, Send, FileArchive, Plus } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

export default function TeachersPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Rating Modal
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [ratingScore, setRatingScore] = useState(5);
    const [ratingComment, setRatingComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Teacher Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({ name: '', department: '', image: '' });

    // Alert Modal
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'danger',
        onConfirm: () => { }
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/giris?redirect=/hocalar');
            } else {
                fetchTeachers();
            }
        }
    }, [user, authLoading, router]);

    const fetchTeachers = async () => {
        try {
            const res = await fetch('/api/teachers');
            if (res.ok) setTeachers(await res.json());
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...addFormData,
                    userId: user.id.toString()
                })
            });

            if (res.ok) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hoca Ekleme İsteği Alındı 🎓',
                    message: 'Eklediğiniz hoca moderasyon onayına gönderildi. Teşekkürler!',
                    type: 'success',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
                setShowAddModal(false);
                setAddFormData({ name: '', department: '', image: '' });
                // We don't fetchTeachers() here because the new one is pending and won't show up yet.
            } else {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hata',
                    message: 'İşlem başarısız.',
                    type: 'warning',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                title: 'Hata',
                message: 'Sunucu hatası oluştu.',
                type: 'danger',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRateSubmit = async () => {
        if (!selectedTeacher || !user) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/teachers/rate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId: selectedTeacher.id,
                    userId: user.id.toString(),
                    score: ratingScore,
                    comment: ratingComment
                })
            });

            const data = await res.json();

            if (res.ok) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Değerlendirme Alındı 🎉',
                    message: 'Değerlendirmeniz başarıyla moderasyon onayına gönderildi. Teşekkürler!',
                    type: 'success',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
                setSelectedTeacher(null);
                setRatingComment('');
                setRatingScore(5);
            } else {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hata',
                    message: data.error || 'İşlem başarısız.',
                    type: 'warning',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
            }
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                title: 'Hata',
                message: 'Sunucu hatası oluştu.',
                type: 'danger',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.department.toLowerCase().includes(search.toLowerCase())
    );

    // Check if current user has an *approved* rating visible
    const hasRated = (teacher: any) => {
        if (!user) return false;
        return teacher.ratings?.some((r: any) => r.userId === user.id.toString());
    };

    if (authLoading || (!user && loading)) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 max-w-6xl">

                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link href="/forum" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500">
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                <GraduationCap className="w-7 h-7 text-purple-600" />
                                Hoca Değerlendirmeleri
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Hoca Ekle
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-24 z-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Hoca adı veya bölüm ara..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-purple-500 transition-colors font-medium"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredTeachers.map(teacher => (
                                <div key={teacher.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl overflow-hidden border border-slate-100 shadow-inner">
                                                {teacher.image && teacher.image.length > 5 ? (
                                                    <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{teacher.image || '👨‍🏫'}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-lg">{teacher.name}</h3>
                                                <div className="text-slate-500 text-sm font-medium mb-2">{teacher.department}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-0.5 rounded-lg font-black text-sm shadow-sm shadow-yellow-500/20">
                                                        <Star className="w-3 h-3 fill-white" />
                                                        {teacher.averageRating}
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-medium">({teacher.ratingCount} değerlendirme)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedTeacher(teacher)}
                                            disabled={hasRated(teacher)}
                                            className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                                        >
                                            {hasRated(teacher) ? 'Değerlendirildi' : 'Değerlendir'}
                                        </button>
                                    </div>

                                    {/* Recent Approved Reviews Preview */}
                                    {teacher.ratings && teacher.ratings.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-slate-50 space-y-3">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Son Yorumlar</div>
                                            {teacher.ratings.slice(0, 2).map((r: any) => (
                                                <div key={r.id} className="bg-slate-50 p-3 rounded-lg text-sm text-slate-600 italic border border-slate-100">
                                                    "{r.comment}"
                                                    <div className="mt-1 flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < r.score ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="font-bold text-slate-800 mb-4">Hızlı Erişim 🚀</h2>
                        <nav className="space-y-2">
                            <Link href="/forum" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Forum</span>
                            </Link>

                            <Link href="/cikmis-sorular" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <FileArchive className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Çıkmış Sınavlar</span>
                            </Link>

                            <Link href="/ders-notlari" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Ders Notları</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Add Teacher Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-purple-600" />
                                Hoca Ekle
                            </h3>

                            <form onSubmit={handleCreateTeacher} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Ad Soyad Unvan</label>
                                    <input
                                        type="text"
                                        required
                                        value={addFormData.name}
                                        onChange={e => setAddFormData({ ...addFormData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                        placeholder="Dr. Öğr. Üyesi..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Bölüm</label>
                                    <input
                                        type="text"
                                        required
                                        value={addFormData.department}
                                        onChange={e => setAddFormData({ ...addFormData, department: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                        placeholder="Bilgisayar Mühendisliği"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Fotoğraf URL (Opsiyonel)</label>
                                    <input
                                        type="url"
                                        value={addFormData.image}
                                        onChange={e => setAddFormData({ ...addFormData, image: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4" />}
                                        Ekle
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Rating Modal */}
            <AnimatePresence>
                {selectedTeacher && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTeacher(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{selectedTeacher.name}</h3>
                            <p className="text-slate-500 text-sm mb-6">Değerlendirmeniz anonim olarak paylaşılacaktır.</p>

                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setRatingScore(star)}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${star <= ratingScore ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={ratingComment}
                                onChange={(e) => setRatingComment(e.target.value)}
                                placeholder="Görüşleriniz... (Minimum 10 karakter)"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px] outline-none focus:border-purple-500 mb-4 text-sm"
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedTeacher(null)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleRateSubmit}
                                    disabled={!ratingComment || ratingComment.length < 10 || isSubmitting}
                                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-4 h-4" />}
                                    Gönder
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                showCancel={false}
                confirmText="Tamam"
            />
        </div>
    );
}
