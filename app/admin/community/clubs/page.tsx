'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Search, Shield, Trophy, Star, TrendingUp, Zap,
    Cpu, Heart, Briefcase, Lightbulb, Globe, Award, Crown, Rocket,
    ArrowUp, ArrowDown, Save, Check
} from 'lucide-react';
import { CLUB_BADGES } from '@/lib/badges';

const CLUB_CATEGORIES = [
    { value: 'spor', label: 'Spor', icon: '⚽' },
    { value: 'sanat', label: 'Sanat', icon: '🎨' },
    { value: 'teknoloji', label: 'Teknoloji', icon: '💻' },
    { value: 'sosyal', label: 'Sosyal', icon: '🤝' },
    { value: 'akademik', label: 'Akademik', icon: '📚' }
];

interface Club {
    id: number;
    name: string;
    slug: string;
    category: string;
    logo?: string;
    president?: { name: string };
    displayOrder?: number;
    badges?: string[];
    isActive: boolean;
}

export default function AdminClubsPage() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingClub, setEditingClub] = useState<Club | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch clubs
    useEffect(() => {
        fetchClubs();
    }, []);

    const fetchClubs = async () => {
        try {
            const res = await fetch(`/api/clubs?includeStats=true&t=${Date.now()}`, {
                cache: 'no-store',
                headers: { 'Pragma': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                setClubs(data);
            }
        } catch (error) {
            console.error('Failed to fetch clubs', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateClub = async (clubId: number, data: Partial<Club>) => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/clubs', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: clubId, ...data })
            });

            if (res.ok) {
                const updatedClub = await res.json();
                setClubs(prev => prev.map(c => c.id === clubId ? updatedClub : c));
                setEditingClub(null);
            }
        } catch (error) {
            console.error('Update failed', error);
        } finally {
            setIsSaving(false);
        }
    };

    const toggleBadge = (badgeId: string) => {
        if (!editingClub) return;
        const currentBadges = editingClub.badges || [];
        const newBadges = currentBadges.includes(badgeId)
            ? currentBadges.filter(b => b !== badgeId)
            : [...currentBadges, badgeId];

        setEditingClub({ ...editingClub, badges: newBadges });
    };

    const filteredClubs = clubs
        .filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const orderA = a.displayOrder ?? 9999;
            const orderB = b.displayOrder ?? 9999;
            // console.log(`Sorting: ${a.name} (${orderA}) vs ${b.name} (${orderB})`);
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Kulüp Yönetimi</h1>
                    <p className="text-slate-500">Sıralama ve rozet yönetimi</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Kulüp ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-slate-600 w-24">Sıra</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Kulüp</th>
                            <th className="p-4 text-sm font-semibold text-slate-600">Rozetler</th>
                            <th className="p-4 text-sm font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredClubs.map((club) => (
                            <tr key={club.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded inline-block">
                                        #{club.displayOrder || 9999}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg overflow-hidden relative shrink-0">
                                            {(club.logo?.startsWith('http') || club.logo?.startsWith('/')) ? (
                                                <img
                                                    src={club.logo}
                                                    alt={club.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                club.logo || '🏛️'
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{club.name}</div>
                                            <div className="text-xs text-slate-500">{club.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {club.badges?.map(badgeId => {
                                            const badge = CLUB_BADGES.find(b => b.id === badgeId);
                                            if (!badge) return null;
                                            const Icon = badge.icon;
                                            return (
                                                <span key={badgeId} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${badge.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {badge.label}
                                                </span>
                                            );
                                        })}
                                        {(!club.badges || club.badges.length === 0) && (
                                            <span className="text-slate-400 text-xs italic">Rozet yok</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => setEditingClub(club)}
                                        className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Düzenle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingClub && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                        onClick={() => setEditingClub(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingClub.name} Düzenleniyor
                                </h2>
                                <button onClick={() => setEditingClub(null)} className="text-slate-400 hover:text-slate-600">
                                    X
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Kategori
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {CLUB_CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.value}
                                                onClick={() => setEditingClub({ ...editingClub, category: cat.value })}
                                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${editingClub.category === cat.value
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                    }`}
                                            >
                                                <span>{cat.icon}</span>
                                                {cat.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Görüntülenme Sırası (Küçük numara = Üst sıra)
                                    </label>
                                    <input
                                        type="number"
                                        value={editingClub.displayOrder ?? ''}
                                        placeholder="9999"
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setEditingClub({
                                                ...editingClub,
                                                displayOrder: val === '' ? undefined : parseInt(val)
                                            });
                                        }}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Badges */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">
                                        Rozetler ve Etiketler
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {CLUB_BADGES.map((badge) => {
                                            const isSelected = editingClub.badges?.includes(badge.id);
                                            const Icon = badge.icon;
                                            return (
                                                <button
                                                    key={badge.id}
                                                    onClick={() => toggleBadge(badge.id)}
                                                    className={`
                                                        relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                                                        ${isSelected
                                                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
                                                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                        }
                                                    `}
                                                >
                                                    <div className={`
                                                        w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                                        ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}
                                                    `}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                                                            {badge.label}
                                                        </div>
                                                        <div className="text-[10px] text-slate-500 line-clamp-1">
                                                            {badge.description}
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <Check className="w-3 h-3 text-blue-600" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 sticky bottom-0">
                                <button
                                    onClick={() => setEditingClub(null)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={async () => {
                                        await handleUpdateClub(editingClub.id, {
                                            displayOrder: editingClub.displayOrder,
                                            badges: editingClub.badges,
                                            category: editingClub.category
                                        });
                                        await fetchClubs(); // Force refresh from server to ensure sort is correct
                                    }}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
