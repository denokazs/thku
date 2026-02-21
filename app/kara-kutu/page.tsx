'use client';

import { useState } from 'react';
import { Plus, Lock, Radio } from 'lucide-react';
import ConfessionsFeed from '@/components/ConfessionsFeed';
import ConfessionModal from '@/components/ConfessionModal';
import { useStore } from '@/context/StoreContext';

export default function KaraKutuPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { confessions } = useStore();
    const approvedCount = confessions.filter(c => c.status === 'approved').length;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-slate-200 relative overflow-x-hidden">

            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-rose-600/4 rounded-full blur-[80px]" />
            </div>

            {/* ───── HERO ───── */}
            <header className="relative z-10 pt-16 pb-12 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Status pill */}
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <Radio className="w-3 h-3" />
                        FREKANS AÇIK · {approvedCount} İTİRAF YAYINDA
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 leading-none">
                        KARA<span className="text-red-500">.</span>KUTU
                    </h1>

                    <p className="text-slate-500 text-base leading-relaxed max-w-md mx-auto mb-8">
                        Kimliksiz anlat. Anonim dinle. <br />
                        Kokpitte söylenenler burada kalır.
                    </p>

                    {/* CTA button */}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group inline-flex items-center gap-3 bg-white text-black font-bold text-sm px-6 py-3 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200 shadow-lg shadow-black/30"
                    >
                        <Lock className="w-4 h-4" />
                        Anonim İtiraf Et
                        <span className="opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                    </button>
                </div>
            </header>

            {/* ───── FEED ───── */}
            <main className="relative z-10 max-w-2xl mx-auto px-4 pb-24">
                <ConfessionsFeed onOpenModal={() => setIsModalOpen(true)} />
            </main>

            {/* Floating action button (mobile) */}
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
