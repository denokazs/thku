'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Calendar, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EventsSlider from '@/components/EventsSlider';
import { CLUB_BADGES } from '@/lib/badges';

// Move logic to component since we accept data dynamically
const CLUB_CATEGORIES = [
    { value: 'all', label: 'Tümü', icon: '🎯' },
    { value: 'spor', label: 'Spor', icon: '⚽' },
    { value: 'sanat', label: 'Sanat', icon: '🎨' },
    { value: 'teknoloji', label: 'Teknoloji', icon: '💻' },
    { value: 'sosyal', label: 'Sosyal', icon: '🤝' },
    { value: 'akademik', label: 'Akademik', icon: '📚' }
];

export default function KuluplerClient({ clubs, events }: { clubs: any[], events: any[] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClubs = clubs.filter(club => {
        const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
        const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            club.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Helper logic inline
    const getClubUpcomingEventsCount = (clubId: number) => {
        const now = new Date();
        return events.filter(e => e.clubId === clubId && new Date(e.date) > now).length;
    };

    const overallUpcomingEvents = events
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    const totalMembers = clubs.reduce((sum, club) => sum + (club.memberCount || 0), 0);

    // Helper to decode HTML entities safely without DOM
    const decodeHtml = (html: string) => {
        if (!html) return '';
        return html
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#39;/g, "'");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 py-12 px-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <Link href="/" className="inline-block mb-6 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                        ← Ana Sayfaya Dön
                    </Link>

                    <div className="inline-flex items-center gap-3 glass-dark border border-red-500/30 px-6 py-3 rounded-full mb-6 shadow-lg shadow-red-500/20">
                        <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="text-red-400 font-black text-sm tracking-widest">KAMPÜS KULÜPLER</span>
                    </div>

                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-4 animate-gradient">
                        Kulüpler ve Topluluklar
                    </h1>
                    <p className="text-slate-300 text-lg font-medium max-w-2xl mx-auto">
                        Kampüsteki tüm kulüpleri keşfedin, etkinliklere katılın ve topluluğa katılın! 🎯
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-dark border border-slate-700/50 rounded-xl p-4"
                        >
                            <Users className="w-8 h-8 text-red-400 mx-auto mb-2" />
                            <div className="text-3xl font-black text-white">{clubs.length}</div>
                            <div className="text-sm text-slate-400 font-bold">Aktif Kulüp</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-dark border border-slate-700/50 rounded-xl p-4"
                        >
                            <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                            <div className="text-3xl font-black text-white">{totalMembers}+</div>
                            <div className="text-sm text-slate-400 font-bold">Toplam Üye</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-dark border border-slate-700/50 rounded-xl p-4"
                        >
                            <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                            <div className="text-3xl font-black text-white">{overallUpcomingEvents.length}</div>
                            <div className="text-sm text-slate-400 font-bold">Yaklaşan Etkinlik</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* --- NEW: Events Slider --- */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <EventsSlider events={events} />
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-10"
                >
                    {/* Search Bar */}
                    <div className="glass-dark border border-slate-700/50 rounded-2xl p-4 mb-6 shadow-xl">
                        <div className="flex items-center gap-3">
                            <Search className="w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Kulüp ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none font-medium"
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-3 justify-center">
                        {CLUB_CATEGORIES.map((category) => (
                            <button
                                key={category.value}
                                onClick={() => setSelectedCategory(category.value)}
                                className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${selectedCategory === category.value
                                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50 scale-105'
                                    : 'glass-dark border border-slate-700/50 text-slate-300 hover:text-white hover:border-red-500/50'
                                    }`}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Clubs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClubs.map((club, index) => (
                        <motion.div
                            key={club.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                        >
                            <Link href={`/kulupler/${club.slug}`}>
                                <div className="glass-dark border border-slate-700/50 rounded-2xl overflow-hidden hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 group hover:scale-105 cursor-pointer">
                                    {/* Cover Image */}
                                    <div
                                        className="h-40 bg-cover bg-center relative"
                                        style={{ backgroundImage: `url(${club.coverImage})` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                                        {/* Badges on Cover Image */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                                            {club.badges?.map((badgeId: string) => {
                                                const badge = CLUB_BADGES.find(b => b.id === badgeId);
                                                if (!badge) return null;
                                                const Icon = badge.icon;
                                                return (
                                                    <div
                                                        key={badgeId}
                                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-lg border border-white/20 ${badge.color.replace('bg-', 'bg-white/90 text-')}`}
                                                    >
                                                        <Icon className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-black uppercase tracking-wide">{badge.label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Logo */}
                                        <div className="absolute -bottom-8 left-6">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${club.logoBackground || 'from-red-600 to-orange-600'} rounded-2xl flex items-center justify-center text-4xl shadow-xl border-4 border-slate-900`}>
                                                {club.logo && (club.logo.startsWith('/') || club.logo.startsWith('http')) ? (
                                                    <Image
                                                        src={club.logo}
                                                        alt={club.name}
                                                        width={64}
                                                        height={64}
                                                        className="w-full h-full object-cover rounded-xl"
                                                        unoptimized={club.logo.startsWith('http')} // Optional: only if external domains cause issues, but we have ** config.
                                                    />
                                                ) : (
                                                    club.logo
                                                )}
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="glass-dark border border-slate-600/50 px-3 py-1 rounded-full text-xs font-black text-white uppercase">
                                                {CLUB_CATEGORIES.find(c => c.value === club.category)?.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 pt-10">
                                        <h3 className="text-2xl font-black text-white mb-2 group-hover:text-red-400 transition-colors">
                                            {club.name}
                                        </h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                            {decodeHtml(club.description)}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center gap-1.5">
                                                <Users className="w-4 h-4 text-orange-400" />
                                                <span className="text-white text-sm font-bold">{club.memberCount}</span>
                                                <span className="text-slate-500 text-xs">üye</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4 text-yellow-400" />
                                                <span className="text-white text-sm font-bold">
                                                    {getClubUpcomingEventsCount(club.id)}
                                                </span>
                                                <span className="text-slate-500 text-xs">etkinlik</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                            <span className="text-red-400 text-sm font-black group-hover:text-red-300 transition-colors">
                                                Detayları Gör
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* No Results */}
                {filteredClubs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-black text-white mb-2">Sonuç Bulunamadı</h3>
                        <p className="text-slate-400">Arama kriterlerinize uygun kulüp bulunamadı.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
