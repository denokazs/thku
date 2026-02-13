'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import ConfessionsFeed from '@/components/ConfessionsFeed';
import TrendingSidebar from '@/components/TrendingSidebar';
import ConfessionModal from '@/components/ConfessionModal';

export default function KaraKutuPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 relative">
            {/* Page Header */}
            <div className="relative overflow-hidden bg-slate-950 border-b border-slate-800 pt-10 pb-20">
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
                <div className="absolute -left-20 top-20 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-red-500 font-bold tracking-[0.3em] uppercase mb-4 text-sm animate-pulse">Kritik İrtifa // 30.000 FT</h1>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 glitch-effect">
                        KARA <span className="text-slate-700">KUTU</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-slate-400 font-mono text-sm leading-relaxed">
                        Bu frekansta herkes anonim. Kokpitte konuşulanlar burada kalır.
                        <br />
                        <span className="text-red-500/80">#Dikkat:</span> Radar aktif.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-[1fr,320px] gap-8">
                    <ConfessionsFeed />
                    <TrendingSidebar onOpenModal={() => setIsModalOpen(true)} />
                </div>
            </div>

            {/* Floating Submit Button (Mobile) */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="lg:hidden fixed bottom-8 right-8 w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl shadow-red-900/50 flex items-center justify-center transition-all hover:scale-110 z-50"
            >
                <Plus className="w-6 h-6 text-white" />
            </button>

            {/* Confession Modal */}
            <ConfessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
