'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Loader2, Star, Search } from 'lucide-react';

export default function TeachersManagerPage() {
    const [teachers, setTeachers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [search, setSearch] = useState('');

    const fetchTeachers = async () => {
        const res = await fetch('/api/teachers');
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
                setFormData({
                    name: '',
                    department: '',
                    image: ''
                });
                fetchTeachers();
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.department.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-purple-600" />
                Hoca Yönetimi
            </h1>

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
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                        <Search className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="İsim veya bölüm ara..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent outline-none flex-1"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredTeachers.map((teacher) => (
                            <div key={teacher.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 hover:border-purple-200 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl overflow-hidden border border-slate-100">
                                    {teacher.image && teacher.image.length > 5 ? (
                                        <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{teacher.image || '👨‍🏫'}</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="font-bold text-slate-800">{teacher.name}</div>
                                    <div className="text-xs text-slate-500 mb-1">{teacher.department}</div>
                                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full w-fit text-xs font-bold border border-yellow-100">
                                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                        {teacher.averageRating} ({teacher.ratingCount})
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {filteredTeachers.length === 0 && (
                        <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                            Kayıt bulunamadı.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
