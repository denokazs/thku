'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { useConfirm } from '@/context/ConfirmContext';
import Link from 'next/link';
import { ArrowLeft, Trash2, Plus, X, ListFilter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNewsPage() {
    const { showConfirm, showAlert } = useConfirm();
    const [news, setNews] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Haber');
    const [date, setDate] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [facultyId, setFacultyId] = useState('eng');
    const [image, setImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const res = await fetch('/api/news');
            if (res.ok) {
                const data = await res.json();
                setNews(data);
            } else {
                // Assuming this is where the showAlert should be, if the fetch was not ok
                // The instruction's snippet for showAlert with "Lütfen tüm alanları doldurun."
                // seems more appropriate for form validation, but placing it as per instruction.
                await showAlert('Haberler yüklenirken bir hata oluştu.', 'danger');
            }
        } catch (error) {
            console.error('Failed to fetch news', error);
            await showAlert('Haberler yüklenirken bir hata oluştu.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newNews = {
            title,
            date,
            category,
            summary,
            content,
            facultyId,
            image
        };

        const res = await fetch('/api/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNews)
        });

        if (res.ok) {
            fetchNews();
            // Reset
            setTitle('');
            setSummary('');
            setContent('');
            setDate('');
            setImage('');
            setIsAdding(false);
        } else {
            await showAlert('Haber eklenirken hata oluştu.', 'danger');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            await showAlert('Lütfen sadece resim dosyası yükleyin.', 'danger');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setImage(data.url);
                await showAlert('Resim başarıyla yüklendi!', 'success');
            } else {
                await showAlert('Resim yüklenirken hata oluştu.', 'danger');
            }
        } catch (error) {
            await showAlert('Resim yüklenirken hata oluştu.', 'danger');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirm({
            title: 'Haber Silme Onayı',
            message: 'Bu haberi silmek istediğinize emin misiniz?',
            type: 'danger'
        });

        if (!isConfirmed) return;
        const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            fetchNews();
        } else {
            await showAlert('Haber silinemedi.', 'danger');
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 relative pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white pt-8 pb-32 px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/admin/content" className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-3xl font-black">Haber Yönetimi</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-24 relative z-10">

                {/* Stats / Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase">Toplam Haber</p>
                            <h2 className="text-3xl font-black text-slate-800">{news.length}</h2>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <ListFilter className="w-6 h-6" />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 md:col-span-2"
                    >
                        <Plus className="w-6 h-6" />
                        <span className="text-xl font-bold">Yeni Haber Ekle</span>
                    </button>
                </div>

                {/* News List */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center h-full p-20 text-slate-400">Yükleniyor...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Tarih</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Başlık</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Fakülte</th>
                                        <th className="p-6 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {news.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-6 text-sm font-medium text-slate-500 whitespace-nowrap">{item.date}</td>
                                            <td className="p-6 max-w-md">
                                                <p className="font-bold text-slate-800 truncate">{item.title}</p>
                                                <p className="text-xs text-slate-400 truncate">{item.summary}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="p-6 text-sm text-slate-500 uppercase font-mono">{item.facultyId}</td>
                                            <td className="p-6 text-right">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {news.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center text-slate-400">
                                                Henüz haber eklenmemiş.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* Add News Modal */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setIsAdding(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-slate-800">Yeni Haber Ekle</h2>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Başlık</label>
                                        <input
                                            required
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Haber başlığı..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Tarih</label>
                                        <input
                                            required
                                            type="text"
                                            value={date}
                                            onChange={e => setDate(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Örn: 22 Ekim 2025"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Kategori</label>
                                        <select
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Haber">Haber</option>
                                            <option value="Etkinlik">Etkinlik</option>
                                            <option value="Duyuru">Duyuru</option>
                                            <option value="Başarı">Başarı</option>
                                            <option value="Akademik">Akademik</option>
                                            <option value="Kariyer">Kariyer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Fakülte ID</label>
                                        <select
                                            value={facultyId}
                                            onChange={e => setFacultyId(e.target.value)}
                                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="air">Hava Ulaştırma (air)</option>
                                            <option value="aero">Havacılık ve Uzay (aero)</option>
                                            <option value="eng">Mühendislik (eng)</option>
                                            <option value="man">İşletme (man)</option>
                                            <option value="genel">Genel</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Özet (Kısa Açıklama)</label>
                                    <textarea
                                        required
                                        value={summary}
                                        onChange={e => setSummary(e.target.value)}
                                        rows={2}
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Listede görünecek kısa özet..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tam İçerik</label>
                                    <textarea
                                        required
                                        value={content}
                                        onChange={e => setContent(e.target.value)}
                                        rows={6}
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                                        placeholder="Haberin detaylı içeriği..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Haber Görseli</label>

                                    {image ? (
                                        <div className="relative">
                                            <img src={image} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                                            <button
                                                type="button"
                                                onClick={() => setImage('')}
                                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Plus className="w-10 h-10 text-slate-400 mb-2" />
                                                <p className="text-sm font-bold text-slate-600">
                                                    {isUploading ? 'Yükleniyor...' : 'Resim Yükle'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">PNG, JPG veya GIF</p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    )}
                                </div>

                                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                    Yayınla
                                </button>
                            </form>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
