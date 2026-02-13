'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useConfirm } from '@/context/ConfirmContext';
import Link from 'next/link';
import {
    ArrowLeft, Calendar, MapPin, Image as ImageIcon, Plus, Save,
    CheckCircle, AlertCircle, X, Users, Settings, LogOut,
    LayoutDashboard, Trash2, Edit2, Camera, Mail, TrendingUp as TrendingUpIcon,
    ChevronRight, Upload, Loader2, MessageSquare, Send, Filter, Lock, History, BarChart3, FileDown
} from 'lucide-react';

// --- CLOUDINARY UPLOAD HELPER (Direct Client-Side) ---
const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
        // 1. Get Signature & Config
        const timestamp = Math.round((new Date).getTime() / 1000);
        const signRes = await fetch('/api/upload/sign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                paramsToSign: {
                    timestamp,
                    folder: 'thku_uploads',
                }
            })
        });

        if (!signRes.ok) throw new Error('Yükleme imzası alınamadı');

        const { signature, cloudName, apiKey } = await signRes.json();
        if (!cloudName || !apiKey) throw new Error('Cloudinary yapılandırması eksik');

        // 2. Upload directly to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        formData.append('folder', 'thku_uploads');

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.error?.message || 'Yükleme başarısız');
        }

        const data = await uploadRes.json();
        return data.secure_url;
    } catch (error) {
        console.error('Upload Helper Error:', error);
        throw error;
    }
};

const ClubSettingsTab = ({ club, setClub, showNotification }: { club: any, setClub: (c: any) => void, showNotification: (m: string, t?: 'success' | 'error') => void }) => {
    const [formData, setFormData] = useState(club);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/clubs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const updatedClub = await res.json();
                setClub(updatedClub);
                showNotification('Kulüp ayarları kaydedildi!');
            } else {
                showNotification('Hata oluştu!', 'error');
            }
        } catch (error) {
            showNotification('Bağlantı hatası!', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-dark border border-slate-700/50 rounded-2xl p-8 max-w-3xl">
            <h2 className="text-2xl font-black text-white mb-6">Kulüp Ayarları</h2>
            <form onSubmit={handleSave} className="space-y-6">
                {/* Branding Section */}
                <div className="space-y-6 pb-6 border-b border-slate-700/50 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4">Marka & Görseller</h3>

                    {/* Logo & Gradient */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-2">Kulüp Logosu</label>
                            <div className="flex items-center gap-4">
                                <div className={`w-24 h-24 rounded-2xl border-4 border-slate-700 overflow-hidden flex items-center justify-center text-4xl shadow-xl bg-gradient-to-br ${formData.logoBackground || 'from-red-600 to-orange-600'}`}>
                                    {formData.logo && (formData.logo.startsWith('/') || formData.logo.startsWith('http')) ? (
                                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        formData.logo || '✨'
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex gap-2">
                                        <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> Resim Yükle
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    if (!e.target.files?.[0]) return;
                                                    setIsSubmitting(true);
                                                    try {
                                                        const file = e.target.files[0];
                                                        // Direct Upload
                                                        const url = await uploadToCloudinary(file);
                                                        setFormData((prev: any) => ({ ...prev, logo: url }));
                                                    } catch (err) {
                                                        showNotification('Logo yüklenemedi!', 'error');
                                                    } finally {
                                                        setIsSubmitting(false);
                                                    }
                                                }}
                                            />
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="veya Emoji"
                                            className="w-24 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500 text-center"
                                            value={formData.logo && !formData.logo.startsWith('/') && !formData.logo.startsWith('http') ? formData.logo : ''}
                                            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Önerilen: 500x500px (Kare) <br />
                                        Format: PNG, JPG veya Emoji
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-2">Logo Arka Planı</label>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { bg: 'from-red-600 to-orange-600', label: 'Kırmızı' },
                                    { bg: 'from-blue-600 to-cyan-600', label: 'Mavi' },
                                    { bg: 'from-purple-600 to-pink-600', label: 'Mor' },
                                    { bg: 'from-emerald-600 to-green-600', label: 'Yeşil' },
                                    { bg: 'from-yellow-500 to-orange-500', label: 'Sarı' },
                                    { bg: 'from-slate-800 to-slate-900', label: 'Koyu' },
                                    { bg: 'from-indigo-600 to-violet-600', label: 'İndigo' },
                                    { bg: 'from-rose-600 to-pink-600', label: 'Gül' },
                                    { bg: 'from-fuchsia-600 to-purple-600', label: 'Fuşya' },
                                    { bg: 'from-cyan-600 to-blue-600', label: 'Turkuaz' },
                                    { bg: 'from-white to-slate-200', label: 'Beyaz' },
                                ].map((color) => (
                                    <button
                                        key={color.bg}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, logoBackground: color.bg })}
                                        className={`w-full aspect-square rounded-lg bg-gradient-to-br ${color.bg} ${formData.logoBackground === color.bg ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'}`}
                                        title={color.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">
                            Kapak Fotoğrafı <span className="text-xs font-normal text-slate-500 ml-2">(Önerilen: 1200x400px)</span>
                        </label>
                        <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-slate-700 bg-slate-800">
                            <img
                                src={formData.coverImage || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop'}
                                alt="Cover"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <label className="cursor-pointer bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm font-bold transition-all flex items-center gap-2">
                                    <Camera className="w-5 h-5" /> Kapak Fotoğrafını Değiştir
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (!e.target.files?.[0]) return;
                                            setIsSubmitting(true);
                                            try {
                                                const file = e.target.files[0];
                                                const url = await uploadToCloudinary(file);
                                                setFormData((prev: any) => ({ ...prev, coverImage: url }));
                                            } catch (err) {
                                                showNotification('Kapak fotoğrafı yüklenemedi!', 'error');
                                            } finally {
                                                setIsSubmitting(false);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Kulüp Adı</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Kategori</label>
                        <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none uppercase" />
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Kısa Açıklama</label>
                    <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                </div>

                <div>
                    <label className="block text-slate-400 text-sm font-bold mb-2">Detaylı Açıklama</label>
                    <textarea value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none resize-none"></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Toplantı Günü</label>
                        <input type="text" value={formData.meetingDay} onChange={e => setFormData({ ...formData, meetingDay: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm font-bold mb-2">Toplantı Yeri</label>
                        <input type="text" value={formData.meetingLocation} onChange={e => setFormData({ ...formData, meetingLocation: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                    </div>
                </div>

                {/* President Information Section */}
                <div className="pt-6 border-t border-slate-700/50">
                    <h3 className="text-lg font-bold text-white mb-4">Başkan Bilgileri</h3>
                    <div className="space-y-4">
                        {/* President Avatar Upload */}
                        <div>
                            <label className="block text-slate-400 text-sm font-bold mb-2">Başkan Fotoğrafı</label>
                            <div className="flex items-center gap-4">
                                {/* Avatar Preview */}
                                <div className="w-20 h-20 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-800 flex items-center justify-center">
                                    {formData.president?.avatar && (formData.president.avatar.startsWith('/') || formData.president.avatar.startsWith('http')) ? (
                                        <img src={formData.president.avatar} alt="President" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-3xl">{formData.president?.avatar || '👤'}</div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1">
                                    {isSubmitting ? (
                                        <div className="text-slate-400 text-sm">Yükleniyor...</div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors w-fit">
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm font-bold">Fotoğraf Yükle</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={isSubmitting}
                                                    onChange={async (e) => {
                                                        if (!e.target.files?.[0]) return;
                                                        setIsSubmitting(true);
                                                        try {
                                                            const file = e.target.files[0];
                                                            const url = await uploadToCloudinary(file);

                                                            setFormData((p: any) => ({
                                                                ...p,
                                                                president: {
                                                                    ...p.president,
                                                                    avatar: url
                                                                }
                                                            }));
                                                            showNotification('Fotoğraf yüklendi!');
                                                        } catch (err) {
                                                            showNotification('Yükleme başarısız!', 'error');
                                                        } finally {
                                                            setIsSubmitting(false);
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <p className="text-xs text-slate-500">Önerilen: 500x500px (Kare)</p>
                                        </div>
                                    )}
                                    {formData.president?.avatar && (formData.president.avatar.startsWith('/') || formData.president.avatar.startsWith('http')) && (
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                president: { ...formData.president, avatar: '👤' }
                                            })}
                                            className="ml-2 text-red-400 hover:text-red-300 text-sm font-bold"
                                        >
                                            Kaldır
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* President Name and Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Başkan Adı</label>
                                <input
                                    type="text"
                                    value={formData.president?.name || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        president: { ...formData.president, name: e.target.value }
                                    })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
                                    placeholder="Örn: Ahmet Yılmaz"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-sm font-bold mb-2">Başkan E-posta</label>
                                <input
                                    type="email"
                                    value={formData.president?.email || ''}
                                    onChange={e => setFormData({
                                        ...formData,
                                        president: { ...formData.president, email: e.target.value }
                                    })}
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none"
                                    placeholder="baskan@thku.edu.tr"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-700/50 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50">
                        <Save className="w-4 h-4" /> {isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

const StatisticsTab = ({ club }: { club: any }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(30);

    useEffect(() => {
        fetchStats();
    }, [dateRange]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/analytics/stats?scope=club&days=${dateRange}&slug=${club.slug}`);
            if (res.ok) {
                const data = await res.json();
                processStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (data: any) => {
        const viewsByDate: Record<string, number> = {};
        for (let i = 0; i < dateRange; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            viewsByDate[dateStr] = 0;
        }

        data.views.forEach((view: any) => {
            const dateStr = view.timestamp.split('T')[0];
            if (viewsByDate[dateStr] !== undefined) {
                viewsByDate[dateStr]++;
            }
        });

        const chartData = Object.entries(viewsByDate)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));

        setStats({
            totalViews: data.totalViews,
            uniqueVisitors: data.uniqueVisitors,
            chartData,
            memberStats: data.memberStats,
            eventStats: data.eventStats
        });
    };

    if (loading && !stats) return <div className="text-white text-center py-12">Yükleniyor...</div>;

    const maxChartValue = Math.max(...(stats?.chartData.map((d: any) => d.count) || [0]), 5);
    const maxMemberCount = stats?.memberStats?.growth.length > 0 ? Math.max(...stats.memberStats.growth.map((g: any) => g.count)) : 10;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Genel İstatistikler</h2>
                <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
                    {[7, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setDateRange(days)}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-colors ${dateRange === days
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            Son {days} Gün
                        </button>
                    ))}
                </div>
            </div>

            {/* View Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <div className="text-slate-400 text-sm font-bold mb-2">Toplam Görüntülenme</div>
                    <div className="text-3xl font-black text-white">{stats?.totalViews.toLocaleString()}</div>
                </div>
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <div className="text-slate-400 text-sm font-bold mb-2">Tekil Ziyaretçi</div>
                    <div className="text-3xl font-black text-white">{stats?.uniqueVisitors.toLocaleString()}</div>
                </div>
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <div className="text-slate-400 text-sm font-bold mb-2">Toplam Üye</div>
                    <div className="text-3xl font-black text-white">{stats?.memberStats?.totalMembers.toLocaleString()}</div>
                </div>
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <div className="text-slate-400 text-sm font-bold mb-2">Ort. Etkinlik Katılımı</div>
                    <div className="text-3xl font-black text-white">{stats?.eventStats?.avgAttendees.toLocaleString()}</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* View Chart */}
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                        Görüntülenme Grafiği
                    </h3>
                    <div className="h-64 flex items-end gap-2">
                        {stats?.chartData.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.count / maxChartValue) * 100}%` }}
                                    className="bg-gradient-to-t from-red-600 to-orange-500 rounded-t-sm w-full opacity-80 group-hover:opacity-100 transition-opacity min-h-[4px]"
                                />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-white text-slate-900 text-xs py-1 px-2 rounded font-bold whitespace-nowrap">
                                        {d.date}: {d.count}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-[10px] text-slate-500 border-t border-slate-800 pt-2 font-mono">
                        <span>{stats?.chartData[0].date}</span>
                        <span>{stats?.chartData[stats?.chartData.length - 1].date}</span>
                    </div>
                </div>

                {/* Member Growth Chart */}
                <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-slate-400" />
                        Üye Gelişimi (Kümülatif)
                    </h3>
                    <div className="h-64 flex items-end gap-2">
                        {stats?.memberStats?.growth.length > 0 ? (
                            stats?.memberStats?.growth.map((d: any, i: number) => (
                                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.count / maxMemberCount) * 100}%` }}
                                        className="bg-blue-600 rounded-t-sm w-full opacity-60 group-hover:opacity-100 transition-opacity min-h-[4px]"
                                    />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="bg-white text-slate-900 text-xs py-1 px-2 rounded font-bold whitespace-nowrap">
                                            {d.date}: {d.count} Üye
                                        </div>
                                    </div>
                                    <div className="text-[10px] text-slate-600 mt-2 text-center rotate-[-45deg] origin-top-left invisible group-hover:visible absolute top-full left-1/2">
                                        {d.date}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">Yeterli veri yok</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Event Analysis */}
            <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    Son Etkinlik Analizi
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 text-left">Etkinlik</th>
                                <th className="pb-3 text-right">Tarih</th>
                                <th className="pb-3 text-right">Katılımcı Sayısı</th>
                                <th className="pb-3 text-right">Etki Oranı</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {stats?.eventStats?.recentEvents.map((event: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                                    <td className="py-3 font-bold text-white">{event.title}</td>
                                    <td className="py-3 text-right text-slate-400 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                                    <td className="py-3 text-right text-white font-mono">{event.attendees}</td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500"
                                                    style={{ width: `${Math.min((event.attendees / (stats?.memberStats?.totalMembers || 1)) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-green-400 font-bold">
                                                {Math.round((event.attendees / (stats?.memberStats?.totalMembers || 1)) * 100)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!stats?.eventStats?.recentEvents || stats?.eventStats?.recentEvents.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-500">Henüz etkinlik verisi yok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default function ClubAdminPage() {
    const params = useParams();
    const router = useRouter();
    const { showConfirm, showAlert } = useConfirm();

    // --- STATE MANAGEMENT ---
    const { user, isLoading: authLoading, logout } = useAuth();

    const [club, setClub] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [gallery, setGallery] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial load - Fetch Real Data
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.push('/giris');
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Fetch Clubs
                const clubsRes = await fetch(`/api/clubs?t=${Date.now()}`, { cache: 'no-store' });
                if (!clubsRes.ok) throw new Error('Failed to fetch clubs');
                const clubs = await clubsRes.json();

                if (!Array.isArray(clubs)) return;

                const foundClub = clubs.find((c: any) => c.slug === params.slug);

                if (foundClub) {
                    // ENHANCED AUTHORIZATION CHECKS
                    // 1. Super Admin - Can access any club
                    if (user.role === 'super_admin') {
                        // All access granted
                    }
                    // 2. Club Admin - Must be assigned to THIS specific club
                    else if (user.role === 'club_admin') {
                        if (!user.clubId || user.clubId !== foundClub.id) {
                            showNotification('Bu kulübü yönetme yetkiniz yok!', 'error');
                            setTimeout(() => router.push('/kulupler'), 2000);
                            return;
                        }
                    }
                    // 3. Regular Users and Members - No admin access
                    else {
                        showNotification('Bu sayfaya erişim yetkiniz yok!', 'error');
                        setTimeout(() => router.push('/kulupler'), 2000);
                        return;
                    }

                    setClub(foundClub);

                    // Fetch Events
                    const eventsRes = await fetch(`/api/events?clubId=${foundClub.id}`, { cache: 'no-store' });
                    const eventsData = await eventsRes.json();
                    setEvents(Array.isArray(eventsData) ? eventsData : []);

                    // Fetch Members
                    const membersRes = await fetch(`/api/members?clubId=${foundClub.id}`, { cache: 'no-store' });
                    const membersData = await membersRes.json();
                    setMembers(Array.isArray(membersData) ? membersData : []);

                    // Set Gallery
                    if (foundClub.gallery) {
                        setGallery(foundClub.gallery);
                    }

                    // Fetch Messages
                    const msgsRes = await fetch(`/api/messages?clubId=${foundClub.id}`, { cache: 'no-store' });
                    const msgsData = await msgsRes.json();
                    if (Array.isArray(msgsData)) setMessages(msgsData);
                } else {
                    router.push('/kulupler');
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        if (params.slug) fetchData();
    }, [params.slug, router, user, authLoading]);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    if (authLoading || !club) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // --- SUB-COMPONENTS ---

    const DashboardTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm font-bold mb-2">Toplam Üye</div>
                <div className="text-3xl font-black text-white">{members.length}</div>
                <div className="text-green-400 text-xs font-bold mt-2 flex items-center gap-1">
                    <TrendingUpIcon className="w-3 h-3" /> +{members.filter(m => m.joinedAt && String(m.joinedAt).includes(new Date().getFullYear().toString())).length} bu yıl
                </div>
            </div>
            <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm font-bold mb-2">Aktif Etkinlik</div>
                <div className="text-3xl font-black text-white">{events.length}</div>
            </div>
            <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm font-bold mb-2">Galeri Medyası</div>
                <div className="text-3xl font-black text-white">{gallery.length}</div>
            </div>
            <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl">
                <div className="text-slate-400 text-sm font-bold mb-2">Okunmamış Mesaj</div>
                <div className="text-3xl font-black text-white">{messages.filter(m => m.status === 'sent').length}</div>
            </div>
        </div>
    );



    const downloadExcel = (data: any[], fileName: string) => {
        if (!data || !data.length) {
            showNotification('Dışa aktarılacak veri bulunamadı.', 'error');
            return;
        }

        const headers = Object.keys(data[0]);

        // Create HTML Table structure
        let tableContent = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <!--[if gte mso 9]>
                <xml>
                    <x:ExcelWorkbook>
                        <x:ExcelWorksheets>
                            <x:ExcelWorksheet>
                                <x:Name>Sheet1</x:Name>
                                <x:WorksheetOptions>
                                    <x:DisplayGridlines/>
                                </x:WorksheetOptions>
                            </x:ExcelWorksheet>
                        </x:ExcelWorksheets>
                    </x:ExcelWorkbook>
                </xml>
                <![endif]-->
                <style>
                    td { mso-number-format:"\\@"; } /* Force text format to prevent scientific notation */
                </style>
            </head>
            <body>
                <table>
                    <thead>
                        <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `<tr>${headers.map(h => `<td>${row[h] !== undefined ? row[h] : ''}</td>`).join('')}</tr>`).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const MembersTab = () => {
        const [showModal, setShowModal] = useState(false);
        const [isEditing, setIsEditing] = useState(false);
        const [viewMode, setViewMode] = useState<string>('members');
        const [isUploading, setIsUploading] = useState(false); // For image upload status // New Toggle

        // Fixed State Definition
        const [formData, setFormData] = useState<{
            id: number;
            name: string;
            role: string;
            department: string;
            studentId: string;
            email: string;
            phone: string;
            joinedAt: string;
            avatar: string;
            isFeatured: boolean;
            customTitle: string;
            customImage: string;
        }>({
            id: 0,
            name: '',
            role: 'Uye',
            department: '',
            studentId: '',
            email: '',
            phone: '',
            joinedAt: new Date().getFullYear().toString(),
            avatar: '👤',
            isFeatured: false,
            customTitle: '',
            customImage: ''
        });

        const pendingMembers = members.filter(m => m.status === 'pending');
        const activeMembers = members.filter(m => m.status !== 'pending');

        const handleDeleteMember = async (id: number) => {
            const isConfirmed = await showConfirm({
                title: 'Üye Silme Onayı',
                message: 'Bu üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
                type: 'danger',
                confirmText: 'Üyeyi Sil',
                cancelText: 'Vazgeç'
            });

            if (isConfirmed) {
                const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setMembers(members.filter(m => m.id !== id));
                    showNotification('Üye silindi.');
                } else {
                    showNotification('Silme başarısız.', 'error');
                }
            }
        };

        const handleApproveMember = async (member: any) => {
            const res = await fetch('/api/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: member.id, status: 'active', role: 'Uye' })
            });

            if (res.ok) {
                const updated = await res.json();
                setMembers(members.map(m => m.id === member.id ? updated : m));
                showNotification('Üyelik onaylandı!');
            } else {
                showNotification('Onay işlemi başarısız.', 'error');
            }
        };

        const resetForm = () => {
            setFormData({
                id: 0,
                name: '',
                role: 'Uye',
                department: '',
                studentId: '',
                email: '',
                phone: '',
                joinedAt: new Date().getFullYear().toString(),
                avatar: '👤',
                isFeatured: false,
                customTitle: '',
                customImage: ''
            });
        };

        const openAddModal = () => {
            resetForm();
            setIsEditing(false);
            setShowModal(true);
        };

        const openEditModal = (member: any) => {
            setFormData({
                ...member,
                isFeatured: member.isFeatured || false,
                customTitle: member.customTitle || '',
                customImage: member.customImage || ''
            });
            setIsEditing(true);
            setShowModal(true);
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
                const url = isEditing ? '/api/members' : '/api/members';
                const method = isEditing ? 'PUT' : 'POST';
                const payload = isEditing ? formData : { ...formData, clubId: club.id, status: 'active' };

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const result = await res.json();
                    if (isEditing) {
                        setMembers(members.map(m => m.id === result.id ? result : m));
                        showNotification('Üye güncellendi.');
                    } else {
                        setMembers([...members, result]);
                        showNotification('Üye eklendi.');
                    }
                    setShowModal(false);
                } else {
                    showNotification('İşlem başarısız.', 'error');
                }
            } catch (error) {
                showNotification('Hata oluştu.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleExportMembers = () => {
            const dataToExport = members.map(m => ({
                'Ad Soyad': m.name,
                'E-posta': m.email,
                'Telefon': m.phone || '-',
                'Öğrenci No': m.studentId || '-',
                'Bölüm': m.department || '-',
                'Rol': m.role === 'club_admin' ? 'Yönetici' : 'Üye',
                'Katılım Tarihi': m.joinedAt
            }));
            downloadExcel(dataToExport, `${club.slug}-uyeler-${new Date().toISOString().split('T')[0]}.xls`);
        };

        // --- ROLES MANAGEMENT SUB-COMPONENT ---
        const RolesManagement = () => {
            const [newRole, setNewRole] = useState({ name: '', color: 'bg-slate-700', priority: 10 });

            const handleAddRole = async (e: React.FormEvent) => {
                e.preventDefault();
                const roleId = newRole.name.toLowerCase().replace(/\s+/g, '_');
                const roleToAdd = { id: roleId, ...newRole };

                const updatedRoles = [...(club.customRoles || []), roleToAdd];
                const updatedClub = { ...club, customRoles: updatedRoles };

                try {
                    await fetch('/api/clubs', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedClub)
                    });
                    setClub(updatedClub);
                    showNotification('Yeni rol eklendi!');
                    setNewRole({ name: '', color: 'bg-slate-700', priority: 10 });
                } catch (err) {
                    showNotification('Rol eklenemedi.', 'error');
                }
            };

            const handleDeleteRole = async (roleId: string) => {
                const isConfirmed = await showConfirm({
                    title: 'Rol Silme Onayı',
                    message: 'Bu rolü silmek istediğinize emin misiniz?',
                    type: 'danger'
                });

                if (!isConfirmed) return;

                const updatedRoles = club.customRoles.filter((r: any) => r.id !== roleId);
                const updatedClub = { ...club, customRoles: updatedRoles };

                try {
                    await fetch('/api/clubs', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedClub)
                    });
                    setClub(updatedClub);
                    showNotification('Rol silindi.');
                } catch (err) {
                    showNotification('İşlem başarısız.', 'error');
                }
            };

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={() => setViewMode('members')} className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Geri
                        </button>
                        <h2 className="text-xl font-bold text-white">Rol Yönetimi</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Create Role Form */}
                        <div className="glass-dark border border-slate-700/50 p-6 rounded-2xl h-fit">
                            <h3 className="text-lg font-bold text-white mb-4">Yeni Rol Oluştur</h3>
                            <form onSubmit={handleAddRole} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-xs font-bold mb-1">Rol Adı</label>
                                    <input type="text" required value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value })} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2 text-white" placeholder="Örn: Sosyal Medya Ekibi" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold mb-1">Renk</label>
                                        <select value={newRole.color} onChange={e => setNewRole({ ...newRole, color: e.target.value })} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2 text-white">
                                            <option value="bg-slate-700">Gri</option>
                                            <option value="bg-red-500/20 text-red-400 border-red-500/30 border">Kırmızı</option>
                                            <option value="bg-blue-500/20 text-blue-400 border-blue-500/30 border">Mavi</option>
                                            <option value="bg-green-500/20 text-green-400 border-green-500/30 border">Yeşil</option>
                                            <option value="bg-purple-500/20 text-purple-400 border-purple-500/30 border">Mor</option>
                                            <option value="bg-orange-500/20 text-orange-400 border-orange-500/30 border">Turuncu</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-xs font-bold mb-1">Öncelik (1-100)</label>
                                        <input type="number" min="1" max="100" value={newRole.priority} onChange={e => setNewRole({ ...newRole, priority: parseInt(e.target.value) })} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2 text-white" />
                                        <p className="text-[10px] text-slate-500 mt-1">Düşük sayı = Yüksek öncelik (1 en yüksek)</p>
                                    </div>
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors">Oluştur</button>
                            </form>
                        </div>

                        {/* Roles List */}
                        <div className="space-y-3">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center">
                                <span className="font-bold text-white">Standart Roller</span>
                                <span className="text-xs text-slate-500">(Silinemez)</span>
                            </div>
                            {['Baskan', 'Yonetim Kurulu', 'Uye'].map(r => (
                                <div key={r} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-slate-400 text-sm flex justify-between">
                                    <span>{r}</span>
                                    <Lock className="w-3 h-3 opacity-50" />
                                </div>
                            ))}

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex justify-between items-center mt-6">
                                <span className="font-bold text-white">Özel Roller</span>
                            </div>
                            {club.customRoles && club.customRoles.map((r: any) => (
                                <div key={r.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 text-white text-sm flex justify-between items-center group hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${r.color && r.color.includes('bg-') ? r.color.split(' ')[0] : 'bg-slate-500'}`}></div>
                                        <span>{r.name}</span>
                                        <span className="text-xs text-slate-500">Öncelik: {r.priority}</span>
                                    </div>
                                    <button onClick={() => handleDeleteRole(r.id)} className="text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            {(!club.customRoles || club.customRoles.length === 0) && (
                                <p className="text-center text-slate-500 text-sm py-4">Henüz özel rol eklenmemiş.</p>
                            )}
                        </div>
                    </div >
                </div >
            );
        };

        if (viewMode === 'roles') return <RolesManagement />;

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="bg-slate-900/50 p-1 rounded-xl flex gap-1 border border-slate-700/50">
                        <button onClick={() => setViewMode('members')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'members' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            Üyeler
                        </button>
                        <button onClick={() => setViewMode('roles')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'roles' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                            Roller & Yetkiler
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportMembers}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                        >
                            <FileDown className="w-5 h-5" /> Excel'e Aktar
                        </button>
                        <button onClick={openAddModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20">
                            <Plus className="w-5 h-5" /> Yeni Üye Ekle
                        </button>
                    </div>
                </div>

                {/* Pending Approvals */}
                {pendingMembers.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            Onay Bekleyenler ({pendingMembers.length})
                        </h2>
                        <div className="glass-dark border border-red-500/30 rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-red-500/10 text-red-300 text-xs uppercase font-bold">
                                    <tr>
                                        <th className="p-4">Aday Bilgisi</th>
                                        <th className="p-4">Başvuru Nedeni</th>
                                        <th className="p-4 text-right">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-500/20">
                                    {pendingMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-red-500/5 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg">{member.avatar}</div>
                                                    <div>
                                                        <div className="text-white font-bold text-sm">{member.name}</div>
                                                        <div className="text-slate-500 text-xs">{member.department}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-slate-300 text-sm max-w-md truncate">{member.reason || 'Belirtilmemiş'}</p>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleApproveMember(member)} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold transition-colors">Onayla</button>
                                                    <button onClick={() => handleDeleteMember(member.id)} className="p-2 bg-slate-800 rounded-lg text-red-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Active Members */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">Aktif Üye Listesi ({activeMembers.length})</h2>
                </div>

                <div className="glass-dark border border-slate-700/50 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800/50 text-slate-400 text-xs uppercase font-bold">
                            <tr>
                                <th className="p-4">Üye Bilgisi</th>
                                <th className="p-4">Rol</th>
                                <th className="p-4">Bölüm</th>
                                <th className="p-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            <AnimatePresence>
                                {activeMembers.map((member) => (
                                    <motion.tr key={member.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg overflow-hidden relative">
                                                    {member.isFeatured && member.customImage ? (
                                                        <img src={member.customImage} alt="Avatar" className="w-full h-full object-cover" />
                                                    ) : member.avatar}
                                                    {member.isFeatured && (
                                                        <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full shadow-lg ring-2 ring-slate-900" title="Vitrin Üyesi"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold text-sm flex items-center gap-1">
                                                        {member.name}
                                                        {member.customTitle && <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-300 font-normal">{member.customTitle}</span>}
                                                    </div>
                                                    <div className="text-slate-500 text-xs">Katılım: {member.joinedAt}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${member.role === 'Baskan' ? 'bg-red-500/20 text-red-400' :
                                                member.role === 'Yonetim Kurulu' ? 'bg-orange-500/20 text-orange-400' :
                                                    member.role === 'Uye' ? 'bg-slate-700/50 text-slate-300' :
                                                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">{member.department}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEditModal(member)} className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => handleDeleteMember(member.id)} className="p-2 bg-slate-800 rounded-lg text-red-400 hover:text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg relative z-10 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                                <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Üye Düzenle' : 'Yeni Üye Ekle'}</h2>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text" placeholder="Ad Soyad" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-white" />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 font-bold mb-1 block">Rol</label>
                                            <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-white">
                                                <option value="Uye">Üye</option>
                                                <option value="Yonetim Kurulu">Yönetim Kurulu</option>
                                                <option value="Baskan">Başkan</option>
                                                {/* Custom Roles */}
                                                {club.customRoles && club.customRoles.map((role: any) => (
                                                    <option key={role.id} value={role.name}>{role.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 font-bold mb-1 block">Bölüm</label>
                                            <input type="text" placeholder="Bölüm" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-white" />
                                        </div>
                                    </div>

                                    <input type="email" placeholder="E-posta" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-white" />

                                    {/* Advanced Settings */}
                                    <div className="border-t border-slate-700 pt-4 mt-4">
                                        <h3 className="text-sm font-bold text-slate-400 mb-3">Gelişmiş Ayarlar</h3>

                                        <div className="flex items-center gap-2 mb-4">
                                            <input
                                                type="checkbox"
                                                id="isFeatured"
                                                checked={formData.isFeatured}
                                                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-red-600 focus:ring-red-500"
                                            />
                                            <label htmlFor="isFeatured" className="text-white text-sm font-bold cursor-pointer">Vitrin Üyesi (Öne Çıkar)</label>
                                        </div>

                                        {formData.isFeatured && (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                                <div>
                                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Özel Ünvan</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Örn: Sosyal Medya Yöneticisi"
                                                        value={formData.customTitle || ''}
                                                        onChange={e => setFormData({ ...formData, customTitle: e.target.value })}
                                                        className="w-full bg-slate-800 border-slate-700 rounded-xl p-3 text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400 font-bold mb-1 block">Özel Fotoğraf</label>
                                                    <div className="space-y-3">
                                                        {/* Image Preview */}
                                                        {formData.customImage && (
                                                            <div className="relative group w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-700">
                                                                <img src={formData.customImage} alt="Preview" className="w-full h-full object-cover" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setFormData({ ...formData, customImage: '' })}
                                                                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold"
                                                                >
                                                                    <Trash2 className="w-6 h-6 text-red-400" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Upload Input */}
                                                        {!formData.customImage && (
                                                            <div className="w-full">
                                                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                        {isUploading ? (
                                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                                                                        ) : (
                                                                            <>
                                                                                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                                                <p className="text-sm text-slate-400 font-bold mb-1">Fotoğraf Yükle</p>
                                                                                <p className="text-xs text-slate-500">Önerilen: 500x500px (Kare) • Max 5MB</p>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                    <input
                                                                        type="file"
                                                                        className="hidden"
                                                                        accept="image/*"
                                                                        disabled={isUploading}
                                                                        onChange={async (e) => {
                                                                            if (!e.target.files?.[0]) return;
                                                                            setIsUploading(true);
                                                                            try {
                                                                                const file = e.target.files[0];
                                                                                const url = await uploadToCloudinary(file);
                                                                                setFormData({ ...formData, customImage: url });
                                                                            } catch (err) {
                                                                                showNotification('Yükleme başarısız!', 'error');
                                                                            } finally {
                                                                                setIsUploading(false);
                                                                            }
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">İptal</button>
                                        <button type="submit" disabled={isSubmitting} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold">{isSubmitting ? '...' : 'Kaydet'}</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    const EventsTab = () => {
        const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list');
        const [editId, setEditId] = useState<number | null>(null);
        const [eventData, setEventData] = useState<{
            title: string; category: string; description: string; date: string; time: string; location: string; capacity: number | string; images: string[];
            coverImage: string; schedule: any[]; speakers: any[]; faq: any[]; requirements: string; registrationLink: string;
        }>({
            title: '', category: 'Workshop', description: '', date: '', time: '', location: '', capacity: '', images: [],
            coverImage: '', schedule: [], speakers: [], faq: [], requirements: '', registrationLink: ''
        });
        const [isUnlimited, setIsUnlimited] = useState(false);
        const [uploadingImage, setUploadingImage] = useState(false);
        const [showAttendees, setShowAttendees] = useState(false);
        const [attendees, setAttendees] = useState<any[]>([]);
        const [selectedEvent, setSelectedEvent] = useState<any>(null);

        const handleViewAttendees = async (event: any) => {
            setSelectedEvent(event);
            setShowAttendees(true);
            setAttendees([]);
            try {
                const res = await fetch(`/api/events/attendees?eventId=${event.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setAttendees(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                showNotification('Katılımcılar yüklenemedi', 'error');
            }
        };

        const resetForm = () => {
            setEventData({
                title: '', category: 'Workshop', description: '', date: '', time: '', location: '', capacity: '', images: [],
                coverImage: '', schedule: [], speakers: [], faq: [], requirements: '', registrationLink: ''
            });
            setIsUnlimited(false);
            setEditId(null);
        };

        const handleEdit = (event: any) => {
            setEventData({
                ...event,
                images: event.images || [],
                schedule: event.schedule || [],
                speakers: event.speakers || [],
                faq: event.faq || [],
                requirements: event.requirements || '',
                coverImage: event.coverImage || '',
                registrationLink: event.registrationLink || ''
            });
            setIsUnlimited(event.capacity == -1);
            setEditId(event.id);
            setMode('edit');
        };

        const handleDelete = async (id: number) => {
            const isConfirmed = await showConfirm({
                title: 'Etkinlik Silme Onayı',
                message: 'Bu etkinliği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
                type: 'danger'
            });

            if (isConfirmed) {
                const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
                if (res.ok) {
                    setEvents(events.filter(e => e.id !== id));
                    showNotification('Etkinlik silindi.');
                } else {
                    showNotification('Silme başarısız.', 'error');
                }
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setIsSubmitting(true);
            try {
                if (mode === 'create') {
                    const newEventPayload = { ...eventData, clubId: club.id, clubName: club.name, attendees: 0, images: [], isPast: false };
                    const res = await fetch('/api/events', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newEventPayload)
                    });
                    if (res.ok) {
                        const created = await res.json();
                        setEvents([created, ...events]);
                        showNotification('Etkinlik başarıyla oluşturuldu!');
                        setMode('list');
                        resetForm();
                    }
                } else {
                    const updatePayload = { ...eventData, id: editId };
                    const res = await fetch('/api/events', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatePayload)
                    });
                    if (res.ok) {
                        const updated = await res.json();
                        setEvents(events.map(e => e.id === editId ? updated : e));
                        showNotification('Etkinlik güncellendi!');
                        setMode('list');
                        resetForm();
                    }
                }
            } catch (err) {
                showNotification('İşlem başarısız.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        };

        if (mode === 'create' || mode === 'edit') {
            return (
                <div className="glass-dark border border-slate-700/50 rounded-2xl p-8 max-w-4xl">
                    <button onClick={() => { setMode('list'); resetForm(); }} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 font-bold transition-colors"><ArrowLeft className="w-4 h-4" /> Etkinlik Listesine Dön</button>
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">{mode === 'create' ? 'Yeni Etkinlik' : 'Etkinlik Düzenle'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">Temel Bilgiler</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Başlık" required value={eventData.title} onChange={e => setEventData({ ...eventData, title: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                                <select value={eventData.category} onChange={e => setEventData({ ...eventData, category: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none">
                                    <option value="Workshop">Workshop</option>
                                    <option value="Seminer">Seminer</option>
                                    <option value="Konferans">Konferans</option>
                                    <option value="Eğlence">Eğlence</option>
                                    <option value="Teknik Gezi">Teknik Gezi</option>
                                    <option value="Yarışma">Yarışma</option>
                                </select>
                            </div>
                            <textarea placeholder="Açıklama" required rows={4} value={eventData.description} onChange={e => setEventData({ ...eventData, description: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="date" required value={eventData.date.split('T')[0]} onChange={e => setEventData({ ...eventData, date: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                                <input type="time" required value={eventData.time} onChange={e => setEventData({ ...eventData, time: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                            </div>
                            <input type="text" placeholder="Konum" required value={eventData.location} onChange={e => setEventData({ ...eventData, location: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-300">Kontenjan</label>
                                <div className="flex items-stretch gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            placeholder="Kontenjan sayısı"
                                            disabled={isUnlimited}
                                            value={isUnlimited ? '' : (eventData.capacity || '')}
                                            onChange={e => {
                                                const val = parseInt(e.target.value);
                                                setEventData({ ...eventData, capacity: isNaN(val) ? 0 : val });
                                            }}
                                            className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-red-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        />
                                        {isUnlimited && (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold bg-slate-900/80 rounded-xl border border-slate-700 backdrop-blur-sm shadow-inner">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">∞</span> Sınırsız
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsUnlimited(!isUnlimited);
                                            setEventData({ ...eventData, capacity: !isUnlimited ? -1 : '' });
                                        }}
                                        className={`px-6 py-3 rounded-xl border font-bold text-sm whitespace-nowrap transition-all active:scale-95 flex items-center gap-2 ${isUnlimited
                                            ? 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/20'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
                                            }`}
                                    >
                                        {isUnlimited ? <CheckCircle className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-current" />}
                                        Sınırsız
                                    </button>
                                </div>
                            </div>

                        </div>


                        {/* Cover Image */}
                        <div className="space-y-4 pt-4 border-t border-slate-700/50">
                            <h3 className="text-lg font-bold text-slate-300">Kapak Fotoğrafı <span className="text-xs font-normal text-slate-500 ml-2">(Önerilen: 1920x1080px)</span></h3>
                            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                                <div className="relative group aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700 max-w-md mx-auto md:mx-0 shadow-xl">
                                    {eventData.coverImage ? (
                                        <img src={eventData.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-bold flex-col gap-3 bg-slate-800/30">
                                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                                                <Upload className="w-6 h-6 opacity-50" />
                                            </div>
                                            <span>Kapak Fotoğrafı Yok</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                                        <label className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl cursor-pointer font-bold flex items-center gap-2 transform transition-transform hover:scale-105 shadow-lg shadow-blue-600/20">
                                            <Upload className="w-4 h-4" /> Fotoğraf Yükle
                                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                if (e.target.files?.[0]) {
                                                    try {
                                                        const url = await uploadToCloudinary(e.target.files[0]);
                                                        if (url) {
                                                            setEventData({ ...eventData, coverImage: url });
                                                        }
                                                    } catch (err) {
                                                        showNotification('Kapak fotoğrafı yüklenemedi', 'error');
                                                    }
                                                }
                                            }} />
                                        </label>
                                        <div className="flex items-center gap-2 w-3/4">
                                            <input
                                                type="text"
                                                placeholder="veya görsel URL'si"
                                                value={eventData.coverImage || ''}
                                                onChange={e => setEventData({ ...eventData, coverImage: e.target.value })}
                                                className="flex-1 bg-slate-900/90 border border-slate-600 text-white text-xs px-3 py-2 rounded-lg outline-none focus:border-blue-500 placeholder:text-slate-500"
                                            />
                                            {eventData.coverImage && (
                                                <button type="button" onClick={() => setEventData({ ...eventData, coverImage: '' })} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-3 text-center md:text-left">Bu fotoğraf etkinlik detay sayfasında en üstte büyük olarak görünecektir.</p>
                            </div>
                        </div >

                        {/* Event Images */}
                        < div className="space-y-4" >
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <h3 className="text-lg font-bold text-slate-300">Etkinlik Görselleri</h3>
                                <button type="button" onClick={() => setEventData({ ...eventData, images: [...(eventData.images || []), ''] })} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">+ Ekle</button>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {(eventData.images || []).map((img: string, idx: number) => (
                                    <div key={idx} className="relative group aspect-video bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
                                        {img ? <img src={img} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600 text-sm font-bold">Resim Yok</div>}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <label className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded cursor-pointer font-bold flex items-center gap-2">
                                                <Upload className="w-3 h-3" /> Yükle
                                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                    if (e.target.files?.[0]) {
                                                        try {
                                                            const url = await uploadToCloudinary(e.target.files[0]);
                                                            if (url) {
                                                                const newImages = [...eventData.images];
                                                                newImages[idx] = url;
                                                                setEventData({ ...eventData, images: newImages });
                                                            }
                                                        } catch (err) {
                                                            showNotification('Görsel yüklenemedi', 'error');
                                                        }
                                                    }
                                                }} />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="veya URL yapıştır"
                                                value={img}
                                                onChange={e => {
                                                    const newImages = [...eventData.images];
                                                    newImages[idx] = e.target.value;
                                                    setEventData({ ...eventData, images: newImages });
                                                }}
                                                className="bg-slate-800/80 border border-slate-600 text-white text-[10px] w-3/4 px-2 py-1 rounded outline-none"
                                            />
                                            <button type="button" onClick={() => {
                                                const newImages = eventData.images.filter((_, i) => i !== idx);
                                                setEventData({ ...eventData, images: newImages });
                                            }} className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                ))}
                                {(!eventData.images || eventData.images.length === 0) && (
                                    <div onClick={() => setEventData({ ...eventData, images: [''] })} className="aspect-video bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:border-slate-500 hover:text-slate-400 cursor-pointer transition-colors">
                                        <Upload className="w-6 h-6 mb-2" />
                                        <span className="text-xs font-bold">+ Görsel Ekle</span>
                                    </div>
                                )}
                            </div>
                        </div >

                        {/* Requirements */}
                        < div className="space-y-4" >
                            <h3 className="text-lg font-bold text-slate-300 border-b border-slate-700 pb-2">Katılım Şartları / Gereksinimler</h3>
                            <textarea placeholder="Örn: Laptop getirilmesi zorunludur.&#10;Temel Python bilgisi gereklidir." rows={3} value={eventData.requirements || ''} onChange={e => setEventData({ ...eventData, requirements: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none" />
                        </div >

                        {/* Schedule */}
                        < div className="space-y-4" >
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <h3 className="text-lg font-bold text-slate-300">Akış / Program</h3>
                                <button type="button" onClick={() => setEventData({ ...eventData, schedule: [...(eventData.schedule || []), { time: '', title: '' }] })} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">+ Ekle</button>
                            </div>
                            <div className="space-y-2">
                                {eventData.schedule && eventData.schedule.map((item: any, idx: number) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input type="time" value={item.time} onChange={e => {
                                            const newSchedule = [...eventData.schedule];
                                            newSchedule[idx].time = e.target.value;
                                            setEventData({ ...eventData, schedule: newSchedule });
                                        }} className="bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white w-32" />
                                        <input type="text" placeholder="Etkinlik Adı" value={item.title} onChange={e => {
                                            const newSchedule = [...eventData.schedule];
                                            newSchedule[idx].title = e.target.value;
                                            setEventData({ ...eventData, schedule: newSchedule });
                                        }} className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white" />
                                        <button type="button" onClick={() => {
                                            const newSchedule = eventData.schedule.filter((_: any, i: number) => i !== idx);
                                            setEventData({ ...eventData, schedule: newSchedule });
                                        }} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {(!eventData.schedule || eventData.schedule.length === 0) && <p className="text-slate-500 text-sm">Akış bilgisi eklenmemiş.</p>}
                            </div>
                        </div >

                        {/* Speakers */}
                        < div className="space-y-4" >
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <h3 className="text-lg font-bold text-slate-300">Konuşmacılar</h3>
                                <button type="button" onClick={() => setEventData({ ...eventData, speakers: [...(eventData.speakers || []), { name: '', title: '', company: '', image: '' }] })} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">+ Ekle</button>
                            </div>
                            <div className="space-y-4">
                                {eventData.speakers && eventData.speakers.map((speaker: any, idx: number) => (
                                    <div key={idx} className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 flex gap-4 items-start">
                                        <div className="relative w-20 h-20 bg-slate-900 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700 group">
                                            {speaker.image ? <img src={speaker.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🎤</div>}
                                            <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Upload className="w-6 h-6 text-white" />
                                                <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                                    if (e.target.files?.[0]) {
                                                        try {
                                                            const url = await uploadToCloudinary(e.target.files[0]);
                                                            if (url) {
                                                                const newSpeakers = [...eventData.speakers];
                                                                newSpeakers[idx].image = url;
                                                                setEventData({ ...eventData, speakers: newSpeakers });
                                                            }
                                                        } catch (err) {
                                                            showNotification('Konuşmacı fotoğrafı yüklenemedi', 'error');
                                                        }
                                                    }
                                                }} />
                                            </label>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input type="text" placeholder="Ad Soyad" value={speaker.name} onChange={e => {
                                                const newSpeakers = [...eventData.speakers];
                                                newSpeakers[idx].name = e.target.value;
                                                setEventData({ ...eventData, speakers: newSpeakers });
                                            }} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                                            <div className="grid grid-cols-2 gap-2">
                                                <input type="text" placeholder="Ünvan (Örn: Sr. Engineer)" value={speaker.title} onChange={e => {
                                                    const newSpeakers = [...eventData.speakers];
                                                    newSpeakers[idx].title = e.target.value;
                                                    setEventData({ ...eventData, speakers: newSpeakers });
                                                }} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                                                <input type="text" placeholder="Şirket / Kurum" value={speaker.company} onChange={e => {
                                                    const newSpeakers = [...eventData.speakers];
                                                    newSpeakers[idx].company = e.target.value;
                                                    setEventData({ ...eventData, speakers: newSpeakers });
                                                }} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => {
                                            const newSpeakers = eventData.speakers.filter((_: any, i: number) => i !== idx);
                                            setEventData({ ...eventData, speakers: newSpeakers });
                                        }} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {(!eventData.speakers || eventData.speakers.length === 0) && <p className="text-slate-500 text-sm">Konuşmacı eklenmemiş.</p>}
                            </div>
                        </div >

                        {/* FAQ */}
                        < div className="space-y-4" >
                            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                <h3 className="text-lg font-bold text-slate-300">Sıkça Sorulan Sorular</h3>
                                <button type="button" onClick={() => setEventData({ ...eventData, faq: [...(eventData.faq || []), { question: '', answer: '' }] })} className="text-xs bg-slate-800 text-white px-3 py-1 rounded hover:bg-slate-700">+ Ekle</button>
                            </div>
                            <div className="space-y-4">
                                {eventData.faq && eventData.faq.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-slate-800/20 p-4 rounded-xl border border-slate-700/30 flex gap-4 items-start">
                                        <div className="flex-1 space-y-2">
                                            <input type="text" placeholder="Soru" value={item.question} onChange={e => {
                                                const newFaq = [...eventData.faq];
                                                newFaq[idx].question = e.target.value;
                                                setEventData({ ...eventData, faq: newFaq });
                                            }} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white font-bold text-sm" />
                                            <textarea placeholder="Cevap" rows={2} value={item.answer} onChange={e => {
                                                const newFaq = [...eventData.faq];
                                                newFaq[idx].answer = e.target.value;
                                                setEventData({ ...eventData, faq: newFaq });
                                            }} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-sm" />
                                        </div>
                                        <button type="button" onClick={() => {
                                            const newFaq = eventData.faq.filter((_: any, i: number) => i !== idx);
                                            setEventData({ ...eventData, faq: newFaq });
                                        }} className="text-red-400 hover:text-red-300 p-2"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {(!eventData.faq || eventData.faq.length === 0) && <p className="text-slate-500 text-sm">SSS eklenmemiş.</p>}
                            </div>
                        </div >

                        <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-red-600/20">{isSubmitting ? '...' : (mode === 'create' ? 'Etkinliği Oluştur' : 'Değişiklikleri Kaydet')}</button>
                    </form >
                </div >
            );
        }

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">Etkinlikler ({events.length})</h2>
                    <button onClick={() => { resetForm(); setMode('create'); }} className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold flex gap-2 items-center"><Plus className="w-4 h-4" /> Etkinlik Ekle</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="glass-dark border border-slate-700 rounded-xl p-6 relative">
                            <h3 className="text-xl font-bold text-white">{event.title}</h3>
                            <p className="text-slate-400 text-sm mb-4">{event.date?.split('T')[0]} - {event.location}</p>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(event)} className="p-2 bg-slate-800 rounded-lg text-slate-300"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleViewAttendees(event)} className="p-2 bg-slate-800 rounded-lg text-blue-400"><Users className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(event.id)} className="p-2 bg-slate-800 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Attendees Modal */}
                <AnimatePresence>
                    {showAttendees && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAttendees(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                            >
                                <div className="flex justify-between items-center mb-6 p-6 border-b border-slate-800 bg-slate-900/50">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users className="w-6 h-6 text-red-500" />
                                        Katılımcı Listesi
                                        <span className="text-sm font-normal text-slate-400 ml-2">({attendees.length} Kişi)</span>
                                    </h3>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const dataToExport = attendees.map(a => ({
                                                    'Ad Soyad': a.name,
                                                    'E-posta': a.email,
                                                    'Telefon': a.phone || '-',
                                                    'Öğrenci No': a.studentId || '-',
                                                    'Kayıt Tarihi': a.registeredAt ? new Date(a.registeredAt).toLocaleDateString('tr-TR') : '-'
                                                }));
                                                downloadExcel(dataToExport, `${selectedEvent?.title.replace(/\s+/g, '-').toLowerCase()}-katilimcilar.xls`);
                                            }}
                                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                        >
                                            <FileDown className="w-4 h-4" /> Listeyi İndir
                                        </button>
                                        <button onClick={() => setShowAttendees(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-auto p-6">
                                    {attendees.length > 0 ? (
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                                                    <th className="py-3">Ad Soyad</th>
                                                    <th className="py-3">Öğrenci No</th>
                                                    <th className="py-3">Telefon</th>
                                                    <th className="py-3">E-posta</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-800">
                                                {attendees.map((person, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                                        <td className="py-3 text-white font-bold">{person.name}</td>
                                                        <td className="py-3 text-slate-300 text-sm">{person.studentId || '-'}</td>
                                                        <td className="py-3 text-slate-300 text-sm">{person.phone || '-'}</td>
                                                        <td className="py-3 text-slate-300 text-sm">{person.email || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-12 text-slate-500">
                                            Henüz katılımcı yok.
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 border-t border-slate-800 bg-slate-900/50 text-right text-xs text-slate-500">
                                    Toplam {attendees.length} katılımcı
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    const GalleryTab = () => {
        const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!e.target.files || e.target.files.length === 0) return;

            const files = Array.from(e.target.files);
            setIsSubmitting(true);

            try {
                const uploadedPhotos = [];
                const timestamp = Date.now();

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                        // Direct Cloudinary Upload
                        const url = await uploadToCloudinary(file);

                        // Use timestamp + index for unique ID
                        uploadedPhotos.push({
                            id: timestamp + i,
                            url,
                            caption: file.name
                        });
                        console.log(`✅ Uploaded: ${file.name} -> ${url}`);

                        // Small delay between uploads to prevent rate limiting
                        if (i < files.length - 1) {
                            await new Promise(resolve => setTimeout(resolve, 200));
                        }
                    } catch (uploadErr) {
                        console.error('❌ Upload exception for', file.name, uploadErr);
                        showNotification(`${file.name} yüklenirken hata oluştu.`, 'error');
                    }
                }

                if (uploadedPhotos.length > 0) {
                    // Update local state first
                    const newGallery = [...(gallery || []), ...uploadedPhotos];
                    setGallery(newGallery);

                    // Update club state to keep in sync
                    const updatedClub = { ...club, gallery: newGallery };
                    setClub(updatedClub);

                    // Save to database
                    const saveRes = await fetch('/api/clubs', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedClub)
                    });

                    if (saveRes.ok) {
                        showNotification(`✅ ${uploadedPhotos.length} fotoğraf başarıyla eklendi!`);
                    } else {
                        const saveError = await saveRes.json();
                        console.error('❌ Save failed:', saveError);
                        showNotification('Fotoğraflar yüklendi ama kaydedilemedi!', 'error');

                        // Rollback on save failure
                        setGallery(gallery);
                        setClub(club);
                    }
                } else {
                    showNotification('Hiçbir fotoğraf yüklenemedi.', 'error');
                }
            } catch (err) {
                console.error('❌ Gallery upload error:', err);
                showNotification('Beklenmeyen hata oluştu.', 'error');
            } finally {
                setIsSubmitting(false);
                // Reset input
                e.target.value = '';
            }
        };

        const handleDelete = async (id: number) => {
            const isConfirmed = await showConfirm({
                title: 'Üye Silme Onayı',
                message: 'Bu üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
                type: 'danger',
                confirmText: 'Üyeyi Sil',
                cancelText: 'Vazgeç'
            });

            if (isConfirmed) {
                const newGallery = gallery.filter(g => g.id !== id);
                setGallery(newGallery);
                const updatedClub = { ...club, gallery: newGallery };
                await fetch('/api/clubs', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedClub)
                });
                showNotification('Fotoğraf silindi.');
            }
        };

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white">Galeri Yönetimi ({gallery.length})</h2>
                    <div className="flex flex-col items-end gap-1">
                        <label className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-colors">
                            {isSubmitting ? 'Yükleniyor...' : <><Upload className="w-4 h-4" /> Fotoğraf Yükle</>}
                            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileUpload} disabled={isSubmitting} />
                        </label>
                        <span className="text-xs text-slate-500">Önerilen: 1920x1080px (Yatay)</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((item: any) => (
                        <div key={item.id} className="aspect-square bg-slate-800 rounded-xl relative group overflow-hidden">
                            <img src={item.url} alt="Gallery" className="w-full h-full object-cover" />
                            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Advanced Messages Tab
    const MessagesTab = () => {
        const [filter, setFilter] = useState<'all' | 'unread' | 'in_progress' | 'resolved'>('all');
        const [selectedMsg, setSelectedMsg] = useState<any>(null);
        const [replyText, setReplyText] = useState('');
        const [internalNote, setInternalNote] = useState('');
        const [showNoteInput, setShowNoteInput] = useState(false);
        const [userHistory, setUserHistory] = useState<any[]>([]);

        const filteredMessages = messages.filter(m => {
            if (filter === 'unread') return m.status === 'sent' || m.status === 'read';
            if (filter === 'in_progress') return m.status === 'in_progress';
            if (filter === 'resolved') return m.status === 'resolved' || m.status === 'replied'; // Handle legacy 'replied'
            return true;
        });

        // Fetch User History when a message is selected
        useEffect(() => {
            if (selectedMsg?.userId) {
                const history = messages.filter(m => m.userId === selectedMsg.userId && m.id !== selectedMsg.id);
                setUserHistory(history);
            }
        }, [selectedMsg, messages]);

        const updateMessage = async (updates: any) => {
            setIsSubmitting(true);
            try {
                const res = await fetch('/api/messages', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedMsg.id, ...updates })
                });

                if (res.ok) {
                    const updatedData = await res.json();
                    setMessages(messages.map(m => m.id === selectedMsg.id ? updatedData : m));
                    setSelectedMsg(updatedData); // Update selected view
                    showNotification('Güncellendi');
                }
            } catch (err) {
                showNotification('Hata oluştu', 'error');
            } finally {
                setIsSubmitting(false);
            }
        };

        const handleReply = async (e: React.FormEvent) => {
            e.preventDefault();
            await updateMessage({ response: replyText });
            setReplyText('');
        };

        const handleAddNote = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!internalNote.trim()) return;
            await updateMessage({ newNote: internalNote });
            setInternalNote('');
            setShowNoteInput(false);
        };

        const openMessage = async (msg: any) => {
            setSelectedMsg(msg);
            setReplyText('');
            // Mark as read if it's new
            if (msg.status === 'sent') {
                try {
                    await fetch('/api/messages', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: msg.id, read: true })
                    });
                    const updatedMsg = { ...msg, status: 'read', readAt: new Date().toISOString() };
                    setMessages(messages.map(m => m.id === msg.id ? updatedMsg : m));
                    setSelectedMsg(updatedMsg);
                } catch (err) { console.error(err); }
            }
        };

        // Quick Replies
        const quickReplies = ["Teşekkürler, ilgileniyoruz.", "Talebiniz alınmıştır, en kısa sürede dönüş yapacağız.", "Konu hakkında toplantıya bekliyoruz.", "Maalesef bu isteğinizi gerçekleştiremiyoruz."];

        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                {/* Message List (Left Sidebar) */}
                <div className="lg:col-span-3 glass-dark border border-slate-700/50 rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 space-y-3">
                        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                            {[{ id: 'all', label: 'Tümü' }, { id: 'unread', label: 'Bekleyen' }].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id as any)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${filter === f.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2 bg-slate-800/50 p-1 rounded-lg">
                            {[{ id: 'in_progress', label: 'İncelenen' }, { id: 'resolved', label: 'Çözülen' }].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id as any)}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${filter === f.id ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredMessages.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 text-sm">Mesaj bulunamadı.</div>
                        ) : (
                            filteredMessages.map(msg => (
                                <div
                                    key={msg.id}
                                    onClick={() => openMessage(msg)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden group ${selectedMsg?.id === msg.id ? 'bg-slate-800 border-red-500/50' : 'hover:bg-slate-800/50 border-transparent'} ${msg.status === 'sent' ? 'bg-slate-800/20' : ''}`}
                                >
                                    {/* Priority Indicator */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.priority === 'high' ? 'bg-red-500' :
                                        msg.priority === 'low' ? 'bg-blue-500' : 'bg-transparent'
                                        }`}></div>

                                    <div className="flex justify-between items-start mb-1 pl-2">
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${msg.topic === 'Şikayet' ? 'text-red-400 bg-red-400/10' :
                                            msg.topic === 'Öneri' ? 'text-green-400 bg-green-400/10' :
                                                'text-blue-400 bg-blue-400/10'
                                            }`}>{msg.topic}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className={`font-bold text-sm mb-1 pl-2 ${msg.status === 'sent' ? 'text-white' : 'text-slate-300'}`}>{msg.subject}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 pl-2">{msg.senderName}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Message Detail & Reply */}
                {/* Message Detail (Center) */}
                <div className="lg:col-span-6 glass-dark border border-slate-700/50 rounded-2xl p-6 flex flex-col relative overflow-hidden">
                    {selectedMsg ? (
                        <>
                            <div className="border-b border-slate-700/50 pb-4 mb-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl font-black text-white">{selectedMsg.subject}</span>
                                            {selectedMsg.priority === 'high' && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-bold animate-pulse">Acil</span>}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Users className="w-4 h-4" /> {selectedMsg.senderName}
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            {new Date(selectedMsg.createdAt).toLocaleString()}
                                        </div>
                                    </div>

                                    {/* Metadata Controls */}
                                    <div className="flex gap-2">
                                        <select
                                            value={selectedMsg.priority || 'medium'}
                                            onChange={(e) => updateMessage({ priority: e.target.value })}
                                            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 outline-none focus:border-red-500 font-bold"
                                        >
                                            <option value="low">Düşük Öncelik</option>
                                            <option value="medium">Normal</option>
                                            <option value="high">Yüksek Öncelik</option>
                                        </select>

                                        <select
                                            value={selectedMsg.status}
                                            onChange={(e) => updateMessage({ status: e.target.value })}
                                            className={`bg-slate-800 border border-slate-700 text-xs text-white rounded-lg p-2 outline-none font-bold ${selectedMsg.status === 'sent' ? 'text-red-400 border-red-500' :
                                                selectedMsg.status === 'in_progress' ? 'text-yellow-400 border-yellow-500' :
                                                    'text-green-400 border-green-500'
                                                }`}
                                        >
                                            <option value="sent">Bekliyor</option>
                                            <option value="read">Okundu</option>
                                            <option value="in_progress">İnceleniyor</option>
                                            <option value="resolved">Çözüldü</option>
                                            <option value="closed">Kapatıldı</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto mb-6 pr-2">
                                {/* Message Content */}
                                <div className="bg-slate-800/30 p-4 rounded-xl mb-6">
                                    <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">{selectedMsg.content}</p>
                                </div>

                                {/* Internal Notes Section */}
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Gizli Notlar (Sadece Yöneticiler)
                                        </h4>
                                        <button onClick={() => setShowNoteInput(!showNoteInput)} className="text-xs text-blue-400 hover:text-blue-300 font-bold">+ Not Ekle</button>
                                    </div>

                                    {showNoteInput && (
                                        <form onSubmit={handleAddNote} className="mb-4 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/20">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="Gizli notunuzu yazın..."
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-white mb-2"
                                                value={internalNote}
                                                onChange={e => setInternalNote(e.target.value)}
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button type="button" onClick={() => setShowNoteInput(false)} className="text-xs text-slate-500">İptal</button>
                                                <button type="submit" className="text-xs bg-yellow-600 text-white px-3 py-1 rounded font-bold hover:bg-yellow-500">Ekle</button>
                                            </div>
                                        </form>
                                    )}

                                    <div className="space-y-2">
                                        {selectedMsg.internalNotes?.map((note: any, idx: number) => (
                                            <div key={idx} className="bg-yellow-500/10 border border-yellow-500/10 p-3 rounded-lg flex gap-3">
                                                <div className="w-1 bg-yellow-500 rounded-full h-full"></div>
                                                <div>
                                                    <p className="text-slate-300 text-xs italic">{note.note}</p>
                                                    <div className="text-[10px] text-slate-500 mt-1">{new Date(note.date).toLocaleString()} - {note.admin}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Admin Response */}
                                {selectedMsg.response && (
                                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-xl ml-8">
                                        <div className="flex items-center gap-2 mb-2 text-green-400 text-sm font-bold">
                                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center"><CheckCircle className="w-3 h-3" /></div>
                                            Yanıtınız
                                            <span className="text-slate-500 text-xs font-normal ml-auto">{new Date(selectedMsg.answeredAt).toLocaleString()}</span>
                                        </div>
                                        <p className="text-slate-300 text-sm">{selectedMsg.response}</p>
                                    </div>
                                )}
                            </div>

                            {/* Reply Area */}
                            {!selectedMsg.response && (
                                <div className="mt-auto bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-thin">
                                        {quickReplies.map((qr, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setReplyText(qr)}
                                                className="whitespace-nowrap px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 rounded-full text-xs text-slate-300 transition-colors"
                                            >
                                                {qr}
                                            </button>
                                        ))}
                                    </div>
                                    <form onSubmit={handleReply}>
                                        <textarea
                                            required
                                            rows={3}
                                            value={replyText}
                                            onChange={e => setReplyText(e.target.value)}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-red-500 outline-none resize-none mb-3"
                                            placeholder="Kullanıcıya yanıt yazın..."
                                        ></textarea>
                                        <div className="flex justify-between items-center">
                                            <div className="text-xs text-slate-500">Yanıtlandığında durum "Çözüldü" olarak güncellenir.</div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 text-sm"
                                            >
                                                {isSubmitting ? '...' : <><Send className="w-3 h-3" /> Yanıtla & Çöz</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-bold">Bir mesaj seçin</p>
                            <p className="text-sm">Detayları görmek ve yanıtlamak için soldan bir mesaja tıklayın.</p>
                        </div>
                    )}
                </div>

                {/* Right Sidebar: User History & Info */}
                <div className="lg:col-span-3 space-y-6">
                    {selectedMsg ? (
                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-6 h-full flex flex-col">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <History className="w-5 h-5 text-slate-400" />
                                Kullanıcı Geçmişi
                            </h3>

                            <div className="flex items-center gap-3 mb-6 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {selectedMsg.senderName.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">{selectedMsg.senderName}</div>
                                    <div className="text-slate-500 text-xs">Üye</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                {userHistory.length > 0 ? (
                                    userHistory.map(hMsg => (
                                        <div key={hMsg.id} onClick={() => openMessage(hMsg)} className="p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/80 cursor-pointer border border-transparent hover:border-slate-600 transition-all group">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[10px] text-slate-500">{new Date(hMsg.createdAt).toLocaleDateString()}</span>
                                                <span className={`text-[10px] px-1.5 rounded ${hMsg.status === 'resolved' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                                                    {hMsg.status === 'resolved' ? 'Çözüldü' : 'Bekliyor'}
                                                </span>
                                            </div>
                                            <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-red-400 transition-colors">{hMsg.subject}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-slate-500 text-xs py-4">Bu kullanıcının başka mesajı yok.</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-6 h-full flex items-center justify-center text-slate-500 text-center text-sm">
                            Kullanıcı detaylarını görmek için bir mesaj seçin.
                        </div>
                    )}
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Notification */}
            <AnimatePresence>
                {notification && (
                    <motion.div initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 20, x: '-50%' }} exit={{ opacity: 0 }} className={`fixed top-0 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold border ${notification.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-red-500/20 border-red-500/50 text-red-400'}`}>
                        {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${club.logoBackground || 'from-red-600 to-orange-600'} flex items-center justify-center text-2xl shadow-lg overflow-hidden`}>
                            {club.logo && (club.logo.startsWith('/') || club.logo.startsWith('http')) ? (
                                <img src={club.logo} alt={club.name} className="w-full h-full object-cover" />
                            ) : (
                                club.logo
                            )}
                        </div>
                        <div>
                            <div className="font-black text-sm tracking-wide">{club.name}</div>
                            <div className="text-xs text-red-500 font-bold uppercase tracking-wider">Admin Paneli</div>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[{ id: 'dashboard', label: 'Genel Bakış', icon: LayoutDashboard }, { id: 'statistics', label: 'İstatistikler', icon: BarChart3 }, { id: 'messages', label: 'Mesajlar', icon: MessageSquare }, { id: 'events', label: 'Etkinlikler', icon: Calendar }, { id: 'members', label: 'Üyeler', icon: Users }, { id: 'gallery', label: 'Galeri', icon: Camera }, { id: 'settings', label: 'Ayarlar', icon: Settings }].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === item.id ? 'bg-red-600 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                            <item.icon className="w-5 h-5" /> {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <Link href={`/kulupler/${club.slug}`}><button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mb-2"><ArrowLeft className="w-5 h-5" /> Kulüp Sayfasına Dön</button></Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 transition-colors text-left"><LogOut className="w-5 h-5" /> Çıkış Yap</button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-64 bg-slate-950 min-h-screen">
                <div className="p-8 max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white mb-1">
                                {activeTab === 'dashboard' && 'Genel Bakış'}
                                {activeTab === 'statistics' && 'İstatistikler'}
                                {activeTab === 'messages' && 'Mesaj Kutusu'}
                                {activeTab === 'events' && 'Etkinlik Yönetimi'}
                                {activeTab === 'members' && 'Üye Listesi'}
                                {activeTab === 'gallery' && 'Galeri Yönetimi'}
                                {activeTab === 'settings' && 'Kulüp Ayarları'}
                            </h1>
                            <p className="text-slate-400 text-sm">Hoş geldin, {club.president?.name || 'Yönetici'}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold text-slate-300">Sistem Çevrimiçi</span>
                        </div>
                    </div>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                            {activeTab === 'dashboard' && <DashboardTab />}
                            {activeTab === 'statistics' && <StatisticsTab club={club} />}
                            {activeTab === 'messages' && <MessagesTab />}
                            {activeTab === 'events' && <EventsTab />}
                            {activeTab === 'members' && <MembersTab />}
                            {activeTab === 'gallery' && <GalleryTab />}
                            {activeTab === 'settings' && <ClubSettingsTab club={club} setClub={setClub} showNotification={showNotification} />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
