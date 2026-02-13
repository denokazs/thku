'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FileText, Search, Plus, ArrowLeft, Loader2, Download, GraduationCap, MessageSquare, FileArchive, Upload, Share2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '@/components/ConfirmModal';

export default function NotesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Upload Modal
    const [showUpload, setShowUpload] = useState(false);
    const [formData, setFormData] = useState({ title: '', course: '', fileUrl: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                router.push('/giris?redirect=/ders-notlari');
            } else {
                fetchNotes();
            }
        }
    }, [user, authLoading, router]);

    const fetchNotes = async () => {
        try {
            const res = await fetch('/api/notes');
            if (res.ok) setNotes(await res.json());
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    uploadedBy: user.id.toString(),
                    uploadedByName: user.name || user.username
                })
            });

            if (res.ok) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Not Gönderildi 📝',
                    message: 'Ders notunuz moderasyon onayına gönderildi. Paylaşımınız için teşekkürler!',
                    type: 'success',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
                setShowUpload(false);
                setFormData({ title: '', course: '', fileUrl: '' });
            } else {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hata',
                    message: 'Yükleme başarısız.',
                    type: 'danger',
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

    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.course.toLowerCase().includes(search.toLowerCase())
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
                                <FileText className="w-7 h-7 text-green-600" />
                                Ders Notları
                            </h1>
                        </div>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-500/30 transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5" /> Not Paylaş
                        </button>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 sticky top-24 z-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Ders kodu veya not başlığı ara..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-green-500 transition-colors font-medium"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredNotes.map(note => (
                                <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-green-300 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600 font-bold text-lg border border-green-100">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold text-slate-600">{note.course}</span>
                                            </div>
                                            <div className="font-bold text-slate-800 text-lg">{note.title}</div>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                                                <span>Yükleyen: {note.uploadedByName}</span>
                                                <span>•</span>
                                                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const shareText = `THKÜ Ders Notu: ${note.course} - ${note.title}\n\nİndir: ${note.fileUrl}`;
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: 'THKÜ Ders Notu',
                                                        text: shareText,
                                                        url: note.fileUrl
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
                                            href={note.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-slate-50 text-slate-600 hover:bg-green-600 hover:text-white rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-green-500/20"
                                            title="İndir"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {filteredNotes.length === 0 && (
                                <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
                                    {search ? 'Sonuç bulunamadı.' : 'Henüz not paylaşılmamış.'}
                                </div>
                            )}
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

                            <Link href="/hocalar" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Hoca Değerlendirmeleri</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUpload && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUpload(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 z-10"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-green-600" />
                                Not Paylaş
                            </h3>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Ders Kodu</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.course}
                                        onChange={e => setFormData({ ...formData, course: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500 uppercase"
                                        placeholder="CENG101"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500"
                                        placeholder="Vize Notları..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">Dosya Linki (Drive/PDF)</label>
                                    <input
                                        type="url"
                                        required
                                        value={formData.fileUrl}
                                        onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-green-500"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUpload(false)}
                                        className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Paylaş
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
