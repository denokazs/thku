'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FileArchive, Search, FileText, ArrowLeft, Loader2, Download, GraduationCap, MessageSquare, Plus, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

export default function ExamsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Exam Modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [addFormData, setAddFormData] = useState({
        courseCode: '',
        courseName: '',
        year: new Date().getFullYear().toString(),
        term: 'Güz',
        fileUrl: ''
    });

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'success' as 'success' | 'warning' | 'danger',
        onConfirm: () => { }
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/giris?redirect=/cikmis-sorular');
            } else {
                fetchExams();
            }
        }
    }, [user, authLoading, router]);

    const fetchExams = async () => {
        try {
            const res = await fetch('/api/exams');
            if (res.ok) setExams(await res.json());
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateExam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...addFormData,
                    uploadedBy: user.id.toString(),
                    uploadedByName: user.name || 'Öğrenci'
                })
            });

            if (res.ok) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Sınav Yükleme İsteği Alındı 📤',
                    message: 'Yüklediğiniz sınav moderasyon onayına gönderildi. Teşekkürler!',
                    type: 'success',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
                setShowAddModal(false);
                setAddFormData({
                    courseCode: '',
                    courseName: '',
                    year: new Date().getFullYear().toString(),
                    term: 'Güz',
                    fileUrl: ''
                });
            } else {
                const data = await res.json();
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

    const filteredExams = exams.filter(e =>
        e.courseCode.toLowerCase().includes(search.toLowerCase()) ||
        e.courseName.toLowerCase().includes(search.toLowerCase())
    );

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
                                <FileArchive className="w-7 h-7 text-blue-600" />
                                Çıkmış Sınavlar Arşivi
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Çıkmış Sınav Ekle
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-24 z-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Ders kodu (örn: CENG101) veya adı ara..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors font-medium"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : filteredExams.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                            {search ? 'Aramanızla eşleşen sınav bulunamadı.' : 'Henüz yüklenmiş sınav yok.'}
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredExams.map(exam => (
                                <div key={exam.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                            PDF
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-lg">{exam.courseCode}</div>
                                            <div className="text-slate-500 text-sm font-medium">{exam.courseName}</div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold">{exam.year} {exam.term}</span>
                                                <span>•</span>
                                                <span>{new Date(exam.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const shareText = `THKÜ Çıkmış Sınav: ${exam.courseCode} - ${exam.year} ${exam.term}\n\nİndir: ${exam.fileUrl}`;
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: 'THKÜ Çıkmış Sınav',
                                                        text: shareText,
                                                        url: exam.fileUrl
                                                    });
                                                } else {
                                                    navigator.clipboard.writeText(shareText);
                                                    alert('Bağlantı kopyalandı!');
                                                }
                                            }}
                                            className="p-3 bg-slate-50 text-slate-600 hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-blue-500/10"
                                            title="Paylaş"
                                        >
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                        <a
                                            href={exam.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-blue-500/20"
                                            title="İndir"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
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

                            <Link href="/hocalar" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Hoca Değerlendirmeleri</span>
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

            {/* Add Exam Modal */}
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
                                <Plus className="w-5 h-5 text-blue-600" />
                                Sınav Ekle
                            </h3>

                            <form onSubmit={handleCreateExam} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-1">Ders Kodu</label>
                                        <input
                                            type="text"
                                            required
                                            value={addFormData.courseCode}
                                            onChange={e => setAddFormData({ ...addFormData, courseCode: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                            placeholder="CENG101"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 mb-1">Yıl</label>
                                        <input
                                            type="number"
                                            required
                                            value={addFormData.year}
                                            onChange={e => setAddFormData({ ...addFormData, year: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                            placeholder="2024"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Ders Adı (Opsiyonel)</label>
                                    <input
                                        type="text"
                                        value={addFormData.courseName}
                                        onChange={e => setAddFormData({ ...addFormData, courseName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                        placeholder="Introduction to Programming"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Dönem</label>
                                    <select
                                        value={addFormData.term}
                                        onChange={e => setAddFormData({ ...addFormData, term: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                    >
                                        <option value="Güz">Güz</option>
                                        <option value="Bahar">Bahar</option>
                                        <option value="Yaz">Yaz</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Dosya URL (PDF/Link)</label>
                                    <input
                                        type="url"
                                        required
                                        value={addFormData.fileUrl}
                                        onChange={e => setAddFormData({ ...addFormData, fileUrl: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                        placeholder="https://drive.google.com/..."
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
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
            />
        </div>
    );
}
