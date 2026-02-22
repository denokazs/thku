'use client';

import { useState } from 'react';
import { Plus, Lock, Radio, Shield, Eye, TrendingUp, Hash, MessageSquare, Users } from 'lucide-react';
import ConfessionsFeed from '@/components/ConfessionsFeed';
import ConfessionModal from '@/components/ConfessionModal';
import { useStore } from '@/context/StoreContext';

export default function KaraKutuPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { confessions, comments } = useStore();
    const approvedCount = confessions.filter(c => c.status === 'approved').length;
    const totalComments = comments.filter(c => c.status === 'approved').length;
    const todayConfessions = confessions.filter(c => {
        const dayAgo = Date.now() - 86400000;
        return c.status === 'approved' && c.timestamp > dayAgo;
    }).length;

    return (
        <div className="min-h-screen text-slate-200 relative overflow-x-hidden"
            style={{
                backgroundColor: '#080810',
                backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
            }}
        >
            {/* Ambient glows — stronger */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/3 w-[700px] h-[500px] bg-red-600/15 rounded-full blur-[130px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-indigo-600/12 rounded-full blur-[110px]" />
                <div className="absolute top-2/3 left-0 w-[400px] h-[350px] bg-rose-700/10 rounded-full blur-[90px]" />
                <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-violet-700/8 rounded-full blur-[80px]" />
                {/* Vignette edges */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,#080810_100%)]" />
            </div>

            {/* ───── HERO ───── */}
            <header className="relative z-10 pt-16 pb-10 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <Radio className="w-3 h-3" />
                        FREKANS AÇIK · {approvedCount} İTİRAF YAYINDA
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-none">
                        KARA<span className="text-red-500">.</span>KUTU
                    </h1>

                    <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto mb-8">
                        Kimliksiz anlat. Anonim dinle.<br />
                        Kokpitte söylenenler burada kalır.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group inline-flex items-center gap-3 bg-white text-black font-bold text-sm px-6 py-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg shadow-black/30"
                    >
                        <Lock className="w-4 h-4" />
                        Anonim İtiraf Et
                        <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                </div>
            </header>

            {/* ───── MAIN LAYOUT ───── */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[220px,1fr,200px] gap-6 items-start">

                    {/* ── Left panel ── */}
                    <aside className="hidden lg:flex flex-col gap-3 sticky top-24">
                        {/* Stats */}
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-3">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">Canlı İstatistik</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white">{approvedCount}</p>
                                    <p className="text-[11px] text-slate-600">Toplam itiraf</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white">{todayConfessions}</p>
                                    <p className="text-[11px] text-slate-600">Son 24 saat</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-sky-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-black text-white">{totalComments}</p>
                                    <p className="text-[11px] text-slate-600">Toplam yorum</p>
                                </div>
                            </div>
                        </div>

                        {/* Post button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-bold text-sm py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Yeni İtiraf
                        </button>
                    </aside>

                    {/* ── Feed ── */}
                    <main>
                        <ConfessionsFeed onOpenModal={() => setIsModalOpen(true)} />
                    </main>

                    {/* ── Right panel ── */}
                    <aside className="hidden lg:flex flex-col gap-3 sticky top-24">
                        {/* Rules */}
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-3.5 h-3.5 text-amber-400" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Kural Seti</p>
                            </div>
                            <ul className="space-y-2 text-[12px] text-slate-300 leading-relaxed">
                                {[
                                    'Gerçek isim yazma',
                                    'Hakaret etme',
                                    'Herkese saygılı ol',
                                    'Moderatör onayı şart',
                                ].map((rule, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <span className="text-slate-500 font-mono text-[10px] mt-0.5">0{i + 1}</span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Anonymity note */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Anonimlik</p>
                            </div>
                            <p className="text-[12px] text-slate-300 leading-relaxed">
                                IP adreslerin veya gerçek kimliğin hiçbir şekilde saklanmaz.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Hash className="w-3.5 h-3.5 text-slate-400" />
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Popüler</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {['aşk', 'hoca', 'sınav', 'yurt', 'kafeterya', 'burs', 'staj'].map(tag => (
                                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/8 hover:text-white transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* FAB mobile */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-500 hover:bg-red-400 rounded-full shadow-2xl shadow-red-900/50 flex items-center justify-center transition-all hover:scale-110 z-50 active:scale-95"
            >
                <Plus className="w-6 h-6 text-white" />
            </button>

            <ConfessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
