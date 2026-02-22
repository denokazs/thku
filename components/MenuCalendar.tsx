'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { MONTHLY_MENU } from '@/data/menu-data';

export default function MenuCalendar() {
    // Tüm ayların menüsünü tek düz liste halinde birleştir (son aydan eski aya doğru sıralı)
    const allMenus = useMemo(() => {
        return Object.values(MONTHLY_MENU)
            .flat()
            .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    }, []);

    // Bugünün tarihini bul; bulamazsan en yakın geçmiş günü başlangıç yap
    const initialIndex = useMemo(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const exact = allMenus.findIndex(m => m.date === todayStr);
        if (exact !== -1) return exact;
        // En yakın geçmiş günü bul
        let best = 0;
        for (let i = 0; i < allMenus.length; i++) {
            if ((allMenus[i].date || '') <= todayStr) best = i;
        }
        return best;
    }, [allMenus]);

    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const currentMenu = allMenus[currentIndex];

    const handleNext = () => { if (currentIndex < allMenus.length - 1) setCurrentIndex(p => p + 1); };
    const handlePrev = () => { if (currentIndex > 0) setCurrentIndex(p => p - 1); };

    if (!currentMenu) {
        return <div className="p-8 text-center text-slate-500">Menü verisi bulunamadı.</div>;
    }

    const isHighCalorie = currentMenu.calorie > 850;
    const healthColor = isHighCalorie ? 'text-orange-500' : 'text-green-500';
    const meals = currentMenu.meals || [];

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
                    <h3 className="text-xl font-bold">
                        {new Date(currentMenu.date!).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                </div>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === allMenus.length - 1}
                    className="p-2 rounded-full hover:bg-white/10 disabled:opacity-30 transition-colors"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Main highlight — yemeğin en yüksek kalorili öğesi */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 mb-1">GÜNÜN MENÜSÜ</h4>
                                <div className="text-2xl font-black text-blue-950 leading-tight">
                                    {meals.length > 1 ? meals[1].name : meals[0]?.name || '—'}
                                </div>
                            </div>
                            <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-slate-50 border-2 ${isHighCalorie ? 'border-orange-100' : 'border-green-100'}`}>
                                <Flame className={`w-6 h-6 ${healthColor} mb-1`} />
                                <span className={`text-sm font-bold ${healthColor}`}>{currentMenu.calorie}</span>
                                <span className="text-[10px] text-slate-400">kcal</span>
                            </div>
                        </div>

                        {/* Menu Items List */}
                        <div className="space-y-3">
                            {meals.map((meal, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 hover:shadow-md hover:bg-white transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-slate-700 text-sm group-hover:text-blue-900 transition-colors">{meal.name}</h5>
                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                {meal.protein > 0 && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[10px] font-bold text-orange-700">
                                                        <div className="w-1 h-1 rounded-full bg-orange-500" />
                                                        PROT: {meal.protein}g
                                                    </div>
                                                )}
                                                {meal.carbs > 0 && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-700">
                                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                        KARB: {meal.carbs}g
                                                    </div>
                                                )}
                                                {meal.fat > 0 && (
                                                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-50 border border-yellow-100 text-[10px] font-bold text-yellow-700">
                                                        <div className="w-1 h-1 rounded-full bg-yellow-500" />
                                                        YAĞ: {meal.fat}g
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right pl-4 border-l border-slate-100 ml-2 shrink-0">
                                        <span className="block text-lg font-black text-slate-700 group-hover:text-blue-600 transition-colors">
                                            {meal.calorie}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">kcal</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Toplam besinler */}
                        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3 flex-wrap">
                            <span className="bg-orange-50 border border-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-bold">🥩 {currentMenu.protein}g Pro</span>
                            <span className="bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold">🍞 {currentMenu.carbs}g Karb</span>
                            <span className="bg-yellow-50 border border-yellow-100 text-yellow-700 px-2.5 py-1 rounded-lg text-xs font-bold">💧 {currentMenu.fat}g Yağ</span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>Düşük Kalori</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Yüksek Enerji</span>
                    </div>
                    <div className="ml-auto">THK Üniversitesi SKS</div>
                </div>
            </div>
        </div>
    );
}
