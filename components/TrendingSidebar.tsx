'use client';

import { trendingHashtags } from '@/data/trending';
import { Flame, Hash } from 'lucide-react';

export default function TrendingSidebar({ onOpenModal }: { onOpenModal?: () => void }) {
    return (
        <aside className="glass-dark rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/50">
                <Flame className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-white font-bold tracking-wider uppercase text-sm">Radar Trafiği</h3>
            </div>

            <ul className="space-y-4">
                {trendingHashtags.map((tag, index) => (
                    <li key={index} className="group cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-300 font-bold group-hover:text-red-400 transition-colors text-sm">{tag}</span>
                            <span className="text-xs text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                                {100 - index * 12}K
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-red-600 to-red-900 h-full rounded-full"
                                style={{ width: `${80 - index * 15}%` }}
                            ></div>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
                <button
                    onClick={onOpenModal}
                    className="w-full bg-red-600/10 border border-red-600/30 text-red-500 py-3 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition-all uppercase tracking-wide flex items-center justify-center gap-2"
                >
                    <Hash className="w-4 h-4" />
                    Yeni Konu Başlat
                </button>
            </div>
        </aside>
    );
}
