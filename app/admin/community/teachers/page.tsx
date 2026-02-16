'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Loader2, Star, Search, Clock, CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';

export default function TeachersManagerPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved'>('all');
    const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);

    const fetchTeachers = async () => {
        const res = await fetch('/api/teachers?all=true');
        if (res.ok) {
            setTeachers(await res.json());
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert('Hoca başarıyla eklendi!');
                setFormData({ name: '', department: '', image: '' });
                fetchTeachers();
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModerateTeacher = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/teachers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchTeachers();
            else alert('İşlem başarısız');
        } catch { alert('Hata oluştu'); }
    };

    const handleModerateRating = async (teacherId: string, ratingId: string, ratingStatus: string) => {
        try {
            const res = await fetch('/api/teachers', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: teacherId, ratingId, ratingStatus })
            });
            if (res.ok) fetchTeachers();
            else alert('İşlem başarısız');
        } catch { alert('Hata oluştu'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bu hocayı silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`/api/teachers?id=${id}`, { method: 'DELETE' });
            if (res.ok) fetchTeachers();
            else alert('Silme başarısız');
        } catch { alert('Hata oluştu'); }
    };

    const filteredTeachers = teachers.filter(t => {
        const matchSearch = (t.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (t.department?.toLowerCase() || '').includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const pendingCount = teachers.filter(t => t.status === 'pending').length;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-purple-600" />
                    Hoca Yönetimi
                </h1>
                {pendingCount > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm animate-pulse">
                        ⏳ {pendingCount} Onay Bekliyor
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-purple-500" /> Yeni Hoca Ekle
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Ad Soyad Unvan</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                placeholder="Dr. Öğr. Üyesi..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Bölüm</label>
                            <input
                                type="text"
                                required
                                value={formData.department}
                                onChange={e => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                placeholder="Bilgisayar Mühendisliği"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-500 mb-1">Fotoğraf URL (Opsiyonel)</label>
                            <input
                                type="url"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus className="w-5 h-5" />}
                            Ekle
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
                                placeholder="İsim veya bölüm ara..."
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
                                        ? s === 'pending' ? 'bg-yellow-100 text-yellow-700' : s === 'approved' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {s === 'all' ? 'Tümü' : s === 'pending' ? '⏳ Bekleyen' : '✅ Onaylı'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredTeachers.map((teacher) => (
                            <div key={teacher.id} className={`bg-white rounded-xl shadow-sm border transition-colors ${teacher.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-200'}`}>
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                                        {teacher.image && teacher.image.length > 5 ? (
                                            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{teacher.image || '👨‍🏫'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-800">{teacher.name}</div>
                                        <div className="text-xs text-slate-500">{teacher.department}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full text-xs font-bold border border-yellow-100">
                                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                                {teacher.averageRating} ({teacher.ratingCount})
                                            </span>
                                            {teacher.status === 'pending' ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3" /> Bekliyor
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3 h-3" /> Onaylı
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {teacher.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleModerateTeacher(teacher.id, 'approved')}
                                                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    ✅ Onayla
                                                </button>
                                                <button
                                                    onClick={() => handleModerateTeacher(teacher.id, 'rejected')}
                                                    className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    ❌ Reddet
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                                            className="text-slate-400 hover:text-purple-500 transition-colors p-1"
                                            title="Değerlendirmeleri Gör"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(teacher.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                            title="Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded ratings */}
                                {expandedTeacher === teacher.id && (
                                    <div className="border-t border-slate-100 p-4 space-y-2">
                                        <h4 className="text-sm font-bold text-slate-500 mb-2">Değerlendirmeler ({(teacher.ratings || []).length})</h4>
                                        {(teacher.ratings || []).length === 0 ? (
                                            <p className="text-sm text-slate-400">Henüz değerlendirme yok.</p>
                                        ) : (
                                            (teacher.ratings || []).map((r: any) => (
                                                <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <Star className="w-3 h-3 fill-yellow-500" /> {r.score}
                                                    </div>
                                                    <p className="text-sm text-slate-600 flex-1 truncate">{r.comment || '-'}</p>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.status === 'approved' ? 'bg-green-100 text-green-600' : r.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
                                                        {r.status === 'approved' ? '✅' : r.status === 'pending' ? '⏳' : '❌'}
                                                    </span>
                                                    {r.status === 'pending' && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => handleModerateRating(teacher.id, r.id, 'approved')}
                                                                className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded font-bold"
                                                            >
                                                                ✅
                                                            </button>
                                                            <button
                                                                onClick={() => handleModerateRating(teacher.id, r.id, 'rejected')}
                                                                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded font-bold"
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredTeachers.length === 0 && (
                            <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                                Kayıt bulunamadı.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
