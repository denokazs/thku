'use client';

import { useState, useEffect } from 'react';
import { FileArchive, Upload, Loader2, CheckCircle, Search, Clock, XCircle, Trash2 } from 'lucide-react';

export default function ExamsManagerPage() {
    const [exams, setExams] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        courseCode: '',
        courseName: '',
        year: new Date().getFullYear(),
        term: 'Güz',
        fileUrl: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');

    const fetchExams = async () => {
        const res = await fetch('/api/exams?all=true');
        if (res.ok) {
            setExams(await res.json());
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/exams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Sınav başarıyla eklendi!');
                setFormData({
                    courseCode: '',
                    courseName: '',
                    year: new Date().getFullYear(),
                    term: 'Güz',
                    fileUrl: ''
                });
                fetchExams();
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModerate = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/exams', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                fetchExams();
            } else {
                alert('İşlem başarısız');
            }
        } catch (error) {
            alert('Hata oluştu');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu sınavı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchExams();
            } else {
                alert('Silme başarısız');
            }
        } catch (error) {
            alert('Hata oluştu');
        }
    };

    const filteredExams = exams.filter(e => {
        const matchSearch = (e.courseCode?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (e.courseName?.toLowerCase() || '').includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || e.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const pendingCount = exams.filter(e => e.status === 'pending').length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <FileArchive className="w-8 h-8 text-blue-600" />
                    Çıkmış Sorular Yönetimi
                </h1>
                {pendingCount > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                        ⏳ {pendingCount} Onay Bekliyor
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Upload Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-500" /> Yeni Sınav Yükle
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Ders Kodu</label>
                            <input
                                type="text"
                                required
                                value={formData.courseCode}
                                onChange={e => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500 uppercase"
                                placeholder="CENG101"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Ders Adı</label>
                            <input
                                type="text"
                                required
                                value={formData.courseName}
                                onChange={e => setFormData({ ...formData, courseName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                placeholder="Programlamaya Giriş"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Yıl</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.year}
                                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-500 mb-1">Dönem</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                    value={formData.term}
                                    onChange={e => setFormData({ ...formData, term: e.target.value })}
                                >
                                    <option>Güz</option>
                                    <option>Bahar</option>
                                    <option>Yaz</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Dosya Linki (PDF/Drive)</label>
                            <input
                                type="url"
                                required
                                value={formData.fileUrl}
                                onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-blue-500"
                                placeholder="https://..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                            Yükle
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 flex-1">
                            <Search className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Ders kodu veya adı ara..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent outline-none flex-1"
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'pending', 'approved'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterStatus === s
                                        ? s === 'pending' ? 'bg-yellow-100 text-yellow-700' : s === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {s === 'all' ? 'Tümü' : s === 'pending' ? '⏳ Bekleyen' : '✅ Onaylı'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-400 font-bold">
                                <tr>
                                    <th className="p-4">Ders</th>
                                    <th className="p-4">Dönem</th>
                                    <th className="p-4">Durum</th>
                                    <th className="p-4">Yükleyen</th>
                                    <th className="p-4">Dosya</th>
                                    <th className="p-4">İşlem</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredExams.map((exam) => (
                                    <tr key={exam.id} className={`hover:bg-slate-50/50 ${exam.status === 'pending' ? 'bg-yellow-50/50' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{exam.courseCode}</div>
                                            <div className="text-xs text-slate-500">{exam.courseName}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {exam.year} {exam.term}
                                        </td>
                                        <td className="p-4">
                                            {exam.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                                                    <Clock className="w-3 h-3" /> Bekliyor
                                                </span>
                                            ) : exam.status === 'approved' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Onaylı
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                                                    <XCircle className="w-3 h-3" /> Reddedildi
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-slate-500">
                                            {exam.uploadedByName || '-'}
                                        </td>
                                        <td className="p-4">
                                            <a href={exam.fileUrl} target="_blank" className="text-blue-600 hover:underline text-sm font-bold">
                                                İndir
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {exam.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleModerate(exam.id, 'approved')}
                                                            className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            ✅ Onayla
                                                        </button>
                                                        <button
                                                            onClick={() => handleModerate(exam.id, 'rejected')}
                                                            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                        >
                                                            ❌ Reddet
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(exam.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Sil"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredExams.length === 0 && (
                            <div className="p-8 text-center text-slate-500">Kayıt bulunamadı.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
