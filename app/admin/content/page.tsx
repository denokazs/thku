'use client';

import { useStore } from '@/context/StoreContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Newspaper, Calendar, Utensils, Save, Edit2, X, Megaphone, Bell, AlertCircle, Info, GraduationCap, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_CONFIG = {
    low: { label: 'Düşük', color: '#3B82F6', bgColor: 'bg-blue-500' },
    medium: { label: 'Orta', color: '#F59E0B', bgColor: 'bg-yellow-500' },
    high: { label: 'Yüksek', color: '#F97316', bgColor: 'bg-orange-500' },
    urgent: { label: 'Acil', color: '#EF4444', bgColor: 'bg-red-500' }
};

const ICON_OPTIONS = [
    { value: 'megaphone', label: 'Megafon', Icon: Megaphone },
    { value: 'bell', label: 'Zil', Icon: Bell },
    { value: 'alert', label: 'Uyarı', Icon: AlertCircle },
    { value: 'info', label: 'Bilgi', Icon: Info },
    { value: 'calendar', label: 'Takvim', Icon: Calendar },
    { value: 'graduation', label: 'Akademik', Icon: GraduationCap }
];

export default function AdminContentPage() {
    const {
        announcements, addAnnouncement, deleteAnnouncement,
        shuttleStops, addShuttleStop, deleteShuttleStop, updateShuttleStop
    } = useStore();

    // Announcement State
    const [isAddingAnnouncement, setIsAddingAnnouncement] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        category: '',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        color: '#3B82F6',
        icon: 'bell',
        description: '',
        url: '',
        isActive: true
    });
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterActive, setFilterActive] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Shuttle State
    const [newStopName, setNewStopName] = useState('');
    const [newStopTime, setNewStopTime] = useState('');

    // --- DINING MENU STATE ---
    const [menus, setMenus] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [menuForm, setMenuForm] = useState({
        soup: '',
        main: '',
        side: '',
        extra: '',
        calories: 0
    });
    const [loadingMenu, setLoadingMenu] = useState(false);

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (!Array.isArray(json)) {
                    alert('Hata: JSON dosyası bir liste (array) olmalıdır.');
                    return;
                }

                if (!confirm(`${json.length} adet menü yüklenecek. Onaylıyor musunuz?`)) return;

                const res = await fetch('/api/dining/bulk', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(json)
                });

                if (res.ok) {
                    alert('Başarıyla yüklendi!');
                    fetchMenus();
                } else {
                    alert('Yükleme başarısız.');
                }
            } catch (err) {
                alert('JSON formatı hatalı.');
            }
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        const res = await fetch('/api/dining');
        if (res.ok) {
            setMenus(await res.json());
        }
    };

    // When date changes, verify if we have a menu for that date to edit
    useEffect(() => {
        const existing = menus.find(m => m.date === selectedDate);
        if (existing) {
            setMenuForm({
                soup: existing.soup,
                main: existing.main,
                side: existing.side,
                extra: existing.extra || '',
                calories: existing.calories
            });
        } else {
            setMenuForm({ soup: '', main: '', side: '', extra: '', calories: 0 });
        }
    }, [selectedDate, menus]);

    const handleSaveMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingMenu(true);
        try {
            const payload = { ...menuForm, date: selectedDate };
            const res = await fetch('/api/dining', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert('Menü kaydedildi!');
                fetchMenus(); // Refresh list
            } else {
                alert('Kaydedilemedi.');
            }
        } catch (error) {
            alert('Hata oluştu.');
        } finally {
            setLoadingMenu(false);
        }
    };

    const handleDeleteMenu = async (id: number) => {
        if (!confirm('Bu menüyü silmek istediğinize emin misiniz?')) return;
        await fetch(`/api/dining?id=${id}`, { method: 'DELETE' });
        fetchMenus();
    };

    // --- ANNOUNCEMENT HANDLERS ---
    const handleSubmitAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcementForm.title || !announcementForm.category) return;
        const date = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        addAnnouncement({
            ...announcementForm,
            date,
            createdAt: new Date().toISOString()
        });
        resetAnnouncementForm();
    };

    const resetAnnouncementForm = () => {
        setAnnouncementForm({
            title: '',
            category: '',
            priority: 'medium',
            color: '#3B82F6',
            icon: 'bell',
            description: '',
            url: '',
            isActive: true
        });
        setIsAddingAnnouncement(false);
        setEditingId(null);
    };

    const handleAddStop = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStopName || !newStopTime) return;
        addShuttleStop({ name: newStopName, time: newStopTime, status: 'future' });
        setNewStopName('');
        setNewStopTime('');
    };

    // Filter announcements
    const filteredAnnouncements = announcements.filter(announcement => {
        const matchesCategory = filterCategory === 'all' || announcement.category === filterCategory;
        const matchesPriority = filterPriority === 'all' || announcement.priority === filterPriority;
        const matchesActive = filterActive === 'all' || (filterActive === 'active' ? announcement.isActive !== false : announcement.isActive === false);
        const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPriority && matchesActive && matchesSearch;
    });

    const getIconComponent = (iconName: string) => {
        const iconOption = ICON_OPTIONS.find(opt => opt.value === iconName);
        return iconOption ? iconOption.Icon : Bell;
    };

    return (
        <div className="pb-20">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800">İçerik Yönetimi</h1>
                <Link href="/admin/news" className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-900 transition-colors">
                    <Newspaper className="w-4 h-4" />
                    Haberler Panelini Aç
                </Link>
            </div>

            {/* --- ANNOUNCEMENTS --- */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <Megaphone className="w-6 h-6 text-blue-600" />
                            <h2 className="text-lg font-bold text-slate-700">Duyurular</h2>
                        </div>
                        <button
                            onClick={() => setIsAddingAnnouncement(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Yeni Duyuru
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tüm Kategoriler</option>
                            <option value="Akademik">Akademik</option>
                            <option value="Etkinlik">Etkinlik</option>
                            <option value="Duyuru">Duyuru</option>
                        </select>
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tüm Öncelikler</option>
                            <option value="urgent">Acil</option>
                            <option value="high">Yüksek</option>
                            <option value="medium">Orta</option>
                            <option value="low">Düşük</option>
                        </select>
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Pasif</option>
                        </select>
                    </div>
                </div>

                {/* Announcements Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAnnouncements.map((announcement) => {
                            const IconComponent = getIconComponent(announcement.icon || 'bell');
                            const priorityConfig = PRIORITY_CONFIG[announcement.priority || 'medium'];

                            return (
                                <motion.div
                                    key={announcement.id}
                                    layout
                                    className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:shadow-md transition-all group relative"
                                >
                                    {/* Priority Badge */}
                                    <div className={`absolute top-2 right-2 ${priorityConfig.bgColor} text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase`}>
                                        {priorityConfig.label}
                                    </div>

                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="p-2 rounded-lg bg-white border border-slate-200" style={{ color: announcement.color || '#3B82F6' }}>
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{announcement.title}</h3>
                                            <p className="text-xs text-slate-500">{announcement.date}</p>
                                        </div>
                                    </div>

                                    {announcement.description && (
                                        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{announcement.description}</p>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
                                            {announcement.category}
                                        </span>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 text-slate-400 hover:text-red-600 transition-colors">
                                                <Trash2 onClick={() => deleteAnnouncement(announcement.id)} className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Active Indicator */}
                                    <div className={`absolute bottom-2 left-2 w-2 h-2 rounded-full ${announcement.isActive !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredAnnouncements.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Duyuru bulunamadı</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Announcement Modal */}
            <AnimatePresence>
                {isAddingAnnouncement && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => resetAnnouncementForm()}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800">Yeni Duyuru Ekle</h2>
                                <button onClick={() => resetAnnouncementForm()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitAnnouncement} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Başlık *</label>
                                        <input
                                            required
                                            type="text"
                                            value={announcementForm.title}
                                            onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Duyuru başlığı"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Kategori *</label>
                                        <input
                                            required
                                            type="text"
                                            value={announcementForm.category}
                                            onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Örn: Akademik"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Öncelik</label>
                                        <select
                                            value={announcementForm.priority}
                                            onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value as any })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="low">Düşük</option>
                                            <option value="medium">Orta</option>
                                            <option value="high">Yüksek</option>
                                            <option value="urgent">Acil</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">İkon</label>
                                        <select
                                            value={announcementForm.icon}
                                            onChange={(e) => setAnnouncementForm({ ...announcementForm, icon: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {ICON_OPTIONS.map(opt => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Açıklama (Opsiyonel)</label>
                                    <textarea
                                        value={announcementForm.description}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Kısa açıklama..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">URL (Opsiyonel)</label>
                                    <input
                                        type="url"
                                        value={announcementForm.url}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={announcementForm.isActive}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Duyuru aktif</label>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                                    Duyuru Ekle
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- DINING MANAGER --- (unchanged) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <Utensils className="w-6 h-6 text-orange-500" />
                        <h2 className="text-lg font-bold text-slate-700">Yemekhane Yönetimi</h2>
                    </div>
                    <div>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleBulkUpload}
                            id="bulk-upload"
                            className="hidden"
                        />
                        <label
                            htmlFor="bulk-upload"
                            className="text-xs font-bold text-slate-500 hover:text-orange-600 bg-slate-100 px-3 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2"
                        >
                            <Calendar className="w-3 h-3" />
                            Toplu JSON Yükle
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-slate-400 mb-1">Tarih Seçin</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="bg-transparent font-bold text-slate-700 outline-none w-full"
                                />
                            </div>
                        </div>

                        <form onSubmit={handleSaveMenu} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Çorba</label>
                                <input type="text" required value={menuForm.soup} onChange={(e) => setMenuForm({ ...menuForm, soup: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500" placeholder="Örn: Mercimek" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Ana Yemek</label>
                                <input type="text" required value={menuForm.main} onChange={(e) => setMenuForm({ ...menuForm, main: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500" placeholder="Örn: Orman Kebabı" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Yan Lezzet</label>
                                <input type="text" required value={menuForm.side} onChange={(e) => setMenuForm({ ...menuForm, side: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500" placeholder="Örn: Pirinç Pilavı" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1">Ekstra / Tatlı</label>
                                <input type="text" value={menuForm.extra} onChange={(e) => setMenuForm({ ...menuForm, extra: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500" placeholder="Örn: Cacık" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 mb-1">Toplam Kalori</label>
                                <input type="number" required value={menuForm.calories} onChange={(e) => setMenuForm({ ...menuForm, calories: parseInt(e.target.value) || 0 })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-orange-500" placeholder="850" />
                            </div>
                            <div className="md:col-span-2 pt-2">
                                <button type="submit" disabled={loadingMenu} className="w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {loadingMenu ? 'Kaydediliyor...' : 'Menüyü Kaydet'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Upcoming List */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 h-fit max-h-[500px] overflow-y-auto">
                        <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wider">Planlanmış Menüler</h3>
                        <div className="space-y-3">
                            {menus.map((menu) => (
                                <div key={menu.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">{menu.date}</div>
                                        <button onClick={() => handleDeleteMenu(menu.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="text-sm font-bold text-slate-800">{menu.main}</div>
                                    <div className="text-xs text-slate-500 mt-1">{menu.soup}, {menu.side}</div>
                                </div>
                            ))}
                            {menus.length === 0 && <div className="text-center text-slate-400 text-sm py-4">Henüz menü eklenmemiş.</div>}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SHUTTLE EDITOR --- (unchanged) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <h2 className="text-lg font-bold text-slate-700 mb-6 pb-2 border-b border-slate-100">Ring Servisi Durakları</h2>
                <form onSubmit={handleAddStop} className="flex gap-4 mb-6">
                    <input type="text" placeholder="Durak Adı" value={newStopName} onChange={(e) => setNewStopName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" />
                    <input type="time" value={newStopTime} onChange={(e) => setNewStopTime(e.target.value)} className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2" />
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Ekle</button>
                </form>

                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Saat</th>
                            <th className="px-4 py-3">Durak</th>
                            <th className="px-4 py-3">Durum</th>
                            <th className="px-4 py-3 rounded-r-lg text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shuttleStops.map((stop, index) => (
                            <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                                <td className="px-4 py-3 font-mono font-bold text-blue-600">{stop.time}</td>
                                <td className="px-4 py-3 font-medium text-slate-700">{stop.name}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={stop.status}
                                        onChange={(e) => updateShuttleStop(index, { ...stop, status: e.target.value as any })}
                                        className="bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                                    >
                                        <option value="past">Geçti</option>
                                        <option value="current">Burada</option>
                                        <option value="next">Sıradaki</option>
                                        <option value="future">Gelecek</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button onClick={() => deleteShuttleStop(index)} className="text-slate-400 hover:text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
