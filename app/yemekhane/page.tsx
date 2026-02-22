'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { MONTHLY_MENU } from '@/data/menu-data';
import type { DailyMenu, MealItem } from '@/types';

// Meal item color themes (cycles through 4 per day)
const MEAL_COLORS = [
    { border: 'border-orange-500/20', bg: 'from-orange-900/20', dot: 'bg-orange-400', label: 'text-orange-400', cal: 'text-orange-300', macro: 'text-orange-200/80' },
    { border: 'border-red-500/20', bg: 'from-red-900/20', dot: 'bg-red-400', label: 'text-red-400', cal: 'text-red-300', macro: 'text-red-200/80' },
    { border: 'border-yellow-500/20', bg: 'from-yellow-900/20', dot: 'bg-yellow-400', label: 'text-yellow-400', cal: 'text-yellow-300', macro: 'text-yellow-200/80' },
    { border: 'border-green-500/20', bg: 'from-green-900/20', dot: 'bg-green-400', label: 'text-green-400', cal: 'text-green-300', macro: 'text-green-200/80' },
];

const toAscii = (text: string) => text
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C')
    .replace(/ı/g, 'i').replace(/İ/g, 'I');

export default function YemekhanePage() {
    const [selectedMonth, setSelectedMonth] = useState('2026-02');
    const [filter, setFilter] = useState<'all' | 'vegetarian' | 'high-protein'>('all');

    const menuData: DailyMenu[] = MONTHLY_MENU[selectedMonth] || [];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont('courier');

        doc.setFontSize(20);
        doc.setTextColor(220, 38, 38);
        doc.text(toAscii('THKU Yemekhane Menusu'), 105, 20, { align: 'center' });

        doc.setFontSize(13);
        doc.setTextColor(100, 100, 100);
        doc.text(toAscii('Subat 2026 - Detayli Besin Degerleri'), 105, 30, { align: 'center' });

        const tableData: any[] = [];

        menuData.forEach((item) => {
            const date = new Date(item.date!).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' });
            item.meals!.forEach((meal: MealItem, i: number) => {
                tableData.push([
                    i === 0 ? toAscii(date) : '',
                    i === 0 ? toAscii(item.day!) : '',
                    toAscii(meal.name),
                    meal.calorie,
                    `${meal.protein}g`,
                    `${meal.carbs}g`,
                    `${meal.fat}g`,
                ]);
            });
            tableData.push(['', '', toAscii('TOPLAM:'), item.calorie, `${item.protein}g`, `${item.carbs}g`, `${item.fat}g`]);
        });

        autoTable(doc, {
            head: [[toAscii('Tarih'), toAscii('Gun'), toAscii('Yemek'), 'Kal', 'Pro', 'Karb', 'Yag']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255], fontStyle: 'bold', font: 'courier', fontSize: 8 },
            bodyStyles: { font: 'courier', fontSize: 6.5 },
            styles: { fontSize: 6.5, cellPadding: 1.5, font: 'courier' },
            columnStyles: {
                0: { cellWidth: 22, fontStyle: 'bold' },
                1: { cellWidth: 18, fontStyle: 'bold' },
                2: { cellWidth: 70 },
                3: { cellWidth: 16 },
                4: { cellWidth: 16 },
                5: { cellWidth: 16 },
                6: { cellWidth: 16 },
            },
            didParseCell: (data: any) => {
                if (data.cell.text[0] === 'TOPLAM:') {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [245, 245, 245];
                }
            }
        });

        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Sayfa ${i} / ${pageCount}`, 105, 285, { align: 'center' });
        }

        doc.save('THKU-Yemekhane-Menusu-Subat-2026.pdf');
    };

    const filteredMenu = menuData.filter(item => {
        if (filter === 'vegetarian') return item.isVegetarian;
        if (filter === 'high-protein') return item.protein >= 40;
        return true;
    });

    // Group by weeks
    const weeks: DailyMenu[][] = [];
    let currentWeek: DailyMenu[] = [];
    filteredMenu.forEach((item, index) => {
        currentWeek.push(item);
        if (item.day === 'Cuma' || index === filteredMenu.length - 1) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 py-12 px-4 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <Link href="/" className="inline-block mb-6 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                        ← Ana Sayfaya Dön
                    </Link>
                    <div className="inline-flex items-center gap-3 glass-dark border border-red-500/30 px-6 py-3 rounded-full mb-6 shadow-lg shadow-red-500/20">
                        <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="text-red-400 font-black text-sm tracking-widest">YEMEKHANE MENÜSÜ</span>
                    </div>
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-4">
                        Aylık Menü Takvimi
                    </h1>
                    <p className="text-slate-300 text-lg font-medium">Tüm ayın yemek menüsü — gerçek besin değerleriyle 🍽️</p>
                </motion.div>

                {/* Controls */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-10">

                    <div className="flex items-center gap-3 glass-dark border border-slate-700/50 rounded-2xl p-3 shadow-xl">
                        <button className="p-2 hover:bg-red-600/20 rounded-xl transition-all group">
                            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-red-400 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div className="flex items-center gap-3 px-4">
                            <Calendar className="w-5 h-5 text-red-400" />
                            <span className="text-white font-black text-lg">Şubat 2026</span>
                        </div>
                        <button className="p-2 hover:bg-red-600/20 rounded-xl transition-all group">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 glass-dark border border-slate-700/50 rounded-2xl p-2 shadow-xl">
                        <Filter className="w-5 h-5 text-slate-400 ml-2" />
                        {[
                            { key: 'all', label: 'Tümü', cls: 'from-red-600 to-orange-600 shadow-red-500/50' },
                            { key: 'vegetarian', label: '🌱 Vejetaryen', cls: 'from-green-600 to-emerald-600 shadow-green-500/50' },
                            { key: 'high-protein', label: '💪 Yüksek Protein (≥40g)', cls: 'from-orange-600 to-yellow-600 shadow-orange-500/50' },
                        ].map(({ key, label, cls }) => (
                            <button key={key} onClick={() => setFilter(key as any)}
                                className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${filter === key
                                    ? `bg-gradient-to-r ${cls} text-white shadow-lg scale-105`
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    <button onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-500/50 hover:scale-105">
                        <Download className="w-4 h-4" /> PDF İndir
                    </button>
                </motion.div>

                {/* Weekly Menu Grid */}
                <div className="space-y-10">
                    {weeks.map((week, weekIndex) => (
                        <motion.div key={weekIndex} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + weekIndex * 0.1 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-red-500/50">
                                    {weekIndex + 1}
                                </div>
                                <h2 className="text-white font-black text-2xl">{weekIndex + 1}. Hafta</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-red-500/50 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                                {week.map((dayMenu, dayIndex) => (
                                    <motion.div key={dayIndex}
                                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + weekIndex * 0.1 + dayIndex * 0.05 }}
                                        className="glass-dark border border-slate-700/50 rounded-2xl p-5 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 group hover:scale-105 relative overflow-hidden">

                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-500 rounded-2xl" />

                                        <div className="relative z-10">
                                            {/* Day Header */}
                                            <div className="mb-4 pb-3 border-b border-slate-700/50">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="text-red-400 font-black text-sm uppercase tracking-wider">{dayMenu.day}</div>
                                                    {dayMenu.isVegetarian && (
                                                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold border border-green-500/30">🌱 VEG</span>
                                                    )}
                                                </div>
                                                <div className="text-slate-500 text-xs font-mono font-bold">
                                                    {new Date(dayMenu.date!).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })}
                                                </div>
                                            </div>

                                            {/* Meals */}
                                            <div className="space-y-2.5 mb-4">
                                                {dayMenu.meals!.map((meal: MealItem, mi: number) => {
                                                    const c = MEAL_COLORS[mi % MEAL_COLORS.length];
                                                    return (
                                                        <div key={mi} className={`bg-gradient-to-r ${c.bg} to-transparent p-2.5 rounded-lg border ${c.border}`}>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                                                                    <span className={`${c.label} text-[10px] font-black uppercase truncate max-w-[100px]`}>{meal.name}</span>
                                                                </div>
                                                                <span className={`${c.cal} text-[10px] font-bold whitespace-nowrap`}>{meal.calorie} kcal</span>
                                                            </div>
                                                            <div className="flex gap-1.5 text-[10px]">
                                                                <span className="text-orange-200/70">P:{meal.protein}g</span>
                                                                <span className="text-slate-600">·</span>
                                                                <span className="text-yellow-200/70">K:{meal.carbs}g</span>
                                                                <span className="text-slate-600">·</span>
                                                                <span className="text-blue-200/70">Y:{meal.fat}g</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Total */}
                                            <div className="pt-3 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-transparent p-2.5 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-white text-[10px] font-black uppercase tracking-wider">📊 TOPLAM</span>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-orange-400" />
                                                        <span className="text-orange-400 text-sm font-black">{dayMenu.calorie}</span>
                                                        <span className="text-slate-500 text-xs font-bold">kcal</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {[
                                                        { label: 'PRO', value: `${dayMenu.protein}g`, cls: 'from-orange-900/40 to-orange-900/20 border-orange-500/30 text-orange-300' },
                                                        { label: 'KARB', value: `${dayMenu.carbs}g`, cls: 'from-yellow-900/40 to-yellow-900/20 border-yellow-500/30 text-yellow-300' },
                                                        { label: 'YAĞ', value: `${dayMenu.fat}g`, cls: 'from-blue-900/40 to-blue-900/20 border-blue-500/30 text-blue-300' },
                                                    ].map(({ label, value, cls }) => (
                                                        <div key={label} className={`bg-gradient-to-br ${cls} border px-1.5 py-1.5 rounded-lg text-[10px] font-black text-center`}>
                                                            <div className="text-[9px] opacity-70 mb-0.5">{label}</div>
                                                            {value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
