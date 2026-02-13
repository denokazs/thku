'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame, Leaf, ArrowRight } from 'lucide-react';
import { THK_SUBAT_MENU } from '@/data/menu';

export default function MenuCalendar() {
    // Find index of today in the menu array to start there
    const todayStr = new Date().toISOString().split('T')[0];
    const initialIndex = THK_SUBAT_MENU.findIndex(m => m.date === todayStr);

    // Default to 0 if not found (or maybe the nearest future date?)
    const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

    const currentMenu = THK_SUBAT_MENU[currentIndex];

    const handleNext = () => {
        if (currentIndex < THK_SUBAT_MENU.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    if (!currentMenu) {
        return <div className="p-8 text-center text-slate-500">Menü verisi bulunamadı.</div>;
    }

    // Calculate percentages/stats for visual flair
    const isHighCalorie = currentMenu.total_calories > 850;
    const healthColor = isHighCalorie ? 'text-orange-500' : 'text-green-500';

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header with Date Navigation */}
            <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{currentMenu.day}</p>
                    <h3 className="text-xl font-bold">{new Date(currentMenu.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === THK_SUBAT_MENU.length - 1}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="p-8">
                {/* Main Course Highlight */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 mb-1">GÜNÜN MENÜSÜ</h4>
                                <div className="text-3xl font-black text-blue-950">{currentMenu.items[1].name}</div> {/* Usually main dish is 2nd */}
                            </div>
                            <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 border-2 ${isHighCalorie ? 'border-orange-100' : 'border-green-100'}`}>
                                <Flame className={`w-6 h-6 ${healthColor} mb-1`} />
                                <span className={`text-sm font-bold ${healthColor}`}>{currentMenu.total_calories}</span>
                                <span className="text-[10px] text-slate-400">kcal</span>
                            </div>
                        </div>

                        {/* Menu Items List */}
                        <div className="space-y-4">
                            {currentMenu.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:shadow-md hover:bg-white transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-700 text-lg group-hover:text-blue-900 transition-colors">{item.name}</h5>

                                            {/* Macros Grid */}
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {item.p && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 border border-orange-100 text-[10px] font-bold text-orange-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                        PROT: {item.p}g
                                                    </div>
                                                )}
                                                {item.c && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        KARB: {item.c}g
                                                    </div>
                                                )}
                                                {item.f && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-50 border border-yellow-100 text-[10px] font-bold text-yellow-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                        YAĞ: {item.f}g
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right pl-4 border-l border-slate-100 ml-4">
                                        <span className="block text-xl font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {item.cal}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer / Legend */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Düşük Kalori</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span>Yüksek Enerji</span>
                    </div>
                    <div className="ml-auto">
                        THK Üniversitesi SKS Daire Bşk.
                    </div>
                </div>
            </div>
        </div>
    );
}
