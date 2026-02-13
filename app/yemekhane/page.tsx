'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Leaf, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { MONTHLY_MENU } from '@/data/menu-data';

export default function YemekhanePage() {
    const [selectedMonth, setSelectedMonth] = useState('2026-02');
    const [filter, setFilter] = useState<'all' | 'vegetarian' | 'high-protein'>('all');

    const menuData = MONTHLY_MENU[selectedMonth] || [];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Helper function to convert Turkish characters
        const toAscii = (text: string) => text
            .replace(/ş/g, 's').replace(/Ş/g, 'S')
            .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
            .replace(/ü/g, 'u').replace(/Ü/g, 'U')
            .replace(/ö/g, 'o').replace(/Ö/g, 'O')
            .replace(/ç/g, 'c').replace(/Ç/g, 'C')
            .replace(/ı/g, 'i').replace(/İ/g, 'I');

        // Use Courier for better display
        doc.setFont('courier');

        // Header
        doc.setFontSize(20);
        doc.setTextColor(220, 38, 38);
        doc.text(toAscii('THKU Yemekhane Menüsü'), 105, 20, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(toAscii('Şubat 2026 - Detayli Besin Degerleri'), 105, 30, { align: 'center' });

        // Table data - Each day gets 4 rows (soup, main, side, total)
        const tableData: any[] = [];

        menuData.forEach((item: any) => {
            const date = new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' });

            // Distribute nutrition values (estimated)
            const soupCal = Math.round(item.calorie * 0.15);
            const mainCal = Math.round(item.calorie * 0.60);
            const sideCal = item.calorie - soupCal - mainCal;

            const soupPro = Math.round(item.protein * 0.10);
            const mainPro = Math.round(item.protein * 0.70);
            const sidePro = item.protein - soupPro - mainPro;

            const soupCarb = Math.round(item.carbs * 0.10);
            const mainCarb = Math.round(item.carbs * 0.50);
            const sideCarb = item.carbs - soupCarb - mainCarb;

            const soupFat = Math.round(item.fat * 0.15);
            const mainFat = Math.round(item.fat * 0.60);
            const sideFat = item.fat - soupFat - mainFat;

            // Çorba
            tableData.push([
                toAscii(date),
                toAscii(item.day),
                '  ' + toAscii('Corba:'),
                toAscii(item.soup),
                soupCal,
                `${soupPro}g`,
                `${soupCarb}g`,
                `${soupFat}g`
            ]);

            // Ana Yemek
            tableData.push([
                '',
                '',
                '  ' + toAscii('Ana:'),
                toAscii(item.main),
                mainCal,
                `${mainPro}g`,
                `${mainCarb}g`,
                `${mainFat}g`
            ]);

            // Yan
            tableData.push([
                '',
                '',
                '  ' + toAscii('Yan:'),
                toAscii(item.side),
                sideCal,
                `${sidePro}g`,
                `${sideCarb}g`,
                `${sideFat}g`
            ]);

            // Toplam
            tableData.push([
                '',
                '',
                toAscii('TOPLAM:'),
                '',
                item.calorie,
                `${item.protein}g`,
                `${item.carbs}g`,
                `${item.fat}g`
            ]);
        });

        autoTable(doc, {
            head: [[toAscii('Tarih'), toAscii('Gun'), toAscii('Oge'), toAscii('Yemek'), 'Kal', 'Pro', 'Karb', 'Yag']],
            body: tableData,
            startY: 40,
            theme: 'grid',
            headStyles: {
                fillColor: [220, 38, 38],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                font: 'courier',
                fontSize: 8
            },
            bodyStyles: { font: 'courier', fontSize: 6.5 },
            styles: {
                fontSize: 6.5,
                cellPadding: 1.5,
                font: 'courier'
            },
            columnStyles: {
                0: { cellWidth: 20, fontStyle: 'bold' },
                1: { cellWidth: 17, fontStyle: 'bold' },
                2: { cellWidth: 15 },
                3: { cellWidth: 58 },
                4: { cellWidth: 13 },
                5: { cellWidth: 13 },
                6: { cellWidth: 13 },
                7: { cellWidth: 13 }
            },
            didParseCell: function (data: any) {
                if (data.cell.text[0] === 'TOPLAM:') {
                    data.cell.styles.fontStyle = 'bold';
                    data.cell.styles.fillColor = [245, 245, 245];
                }
            }
        });

        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(`Sayfa ${i} / ${pageCount}`, 105, 285, { align: 'center' });
        }

        doc.save('THKU-Yemekhane-Menusu-Detayli-Subat-2026.pdf');
    };

    const filteredMenu = menuData.filter(item => {
        if (filter === 'vegetarian') return item.isVegetarian;
        if (filter === 'high-protein') return item.protein >= 35;
        return true;
    });

    // Group by weeks
    const weeks: any[] = [];
    let currentWeek: any[] = [];

    filteredMenu.forEach((item, index) => {
        currentWeek.push(item);
        if (item.day === 'Cuma' || index === filteredMenu.length - 1) {
            weeks.push([...currentWeek]);
            currentWeek = [];
        }
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 py-12 px-4 relative overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <Link href="/" className="inline-block mb-6 text-slate-400 hover:text-white transition-colors text-sm font-bold">
                        ← Ana Sayfaya Dön
                    </Link>

                    <div className="inline-flex items-center gap-3 glass-dark border border-red-500/30 px-6 py-3 rounded-full mb-6 shadow-lg shadow-red-500/20">
                        <Sparkles className="w-5 h-5 text-red-400 animate-pulse" />
                        <span className="text-red-400 font-black text-sm tracking-widest">YEMEKHANE MENÜSÜ</span>
                    </div>

                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-4 animate-gradient">
                        Aylık Menü Takvimi
                    </h1>
                    <p className="text-slate-300 text-lg font-medium">Tüm ayın lezzetli yemek menüsünü keşfedin 🍽️</p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-10"
                >
                    {/* Month Selector */}
                    <div className="flex items-center gap-3 glass-dark border border-slate-700/50 rounded-2xl p-3 shadow-xl">
                        <button className="p-2 hover:bg-red-600/20 rounded-xl transition-all duration-300 group">
                            <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-red-400 group-hover:-translate-x-1 transition-all" />
                        </button>
                        <div className="flex items-center gap-3 px-4">
                            <Calendar className="w-5 h-5 text-red-400" />
                            <span className="text-white font-black text-lg">Şubat 2026</span>
                        </div>
                        <button className="p-2 hover:bg-red-600/20 rounded-xl transition-all duration-300 group">
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 glass-dark border border-slate-700/50 rounded-2xl p-2 shadow-xl">
                        <Filter className="w-5 h-5 text-slate-400 ml-2" />
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${filter === 'all'
                                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/50 scale-105'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            Tümü
                        </button>
                        <button
                            onClick={() => setFilter('vegetarian')}
                            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${filter === 'vegetarian'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50 scale-105'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            🌱 Vejetaryen
                        </button>
                        <button
                            onClick={() => setFilter('high-protein')}
                            className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all duration-300 ${filter === 'high-protein'
                                ? 'bg-gradient-to-r from-orange-600 to-yellow-600 text-white shadow-lg shadow-orange-500/50 scale-105'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            💪 Yüksek Protein
                        </button>
                    </div>

                    {/* Download Button */}
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all duration-300 shadow-lg shadow-blue-500/50 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50">
                        <Download className="w-4 h-4" />
                        PDF İndir
                    </button>
                </motion.div>

                {/* Weekly Menu Grid */}
                <div className="space-y-10">
                    {weeks.map((week, weekIndex) => (
                        <motion.div
                            key={weekIndex}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + weekIndex * 0.1 }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-red-500/50">
                                    {weekIndex + 1}
                                </div>
                                <h2 className="text-white font-black text-2xl">{weekIndex + 1}. Hafta</h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-slate-700 via-red-500/50 to-transparent"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                                {week.map((dayMenu: any, dayIndex: number) => (
                                    <motion.div
                                        key={dayIndex}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + weekIndex * 0.1 + dayIndex * 0.05 }}
                                        className="glass-dark border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 group hover:scale-105 relative overflow-hidden"
                                    >
                                        {/* Gradient Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-orange-500/0 group-hover:from-red-500/10 group-hover:to-orange-500/10 transition-all duration-500 rounded-2xl"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            {/* Day Header */}
                                            <div className="mb-4 pb-4 border-b border-slate-700/50 group-hover:border-red-500/30 transition-colors">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="text-red-400 font-black text-sm uppercase tracking-wider">{dayMenu.day}</div>
                                                    {dayMenu.isVegetarian && (
                                                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs font-bold border border-green-500/30">
                                                            🌱 VEG
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-slate-500 text-xs font-mono font-bold">
                                                    {new Date(dayMenu.date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long' })}
                                                </div>
                                            </div>

                                            {/* Menu Items with Nutrition */}
                                            <div className="space-y-3 mb-5">
                                                {/* Çorba */}
                                                <div className="group/item bg-gradient-to-r from-orange-900/20 to-transparent p-3 rounded-lg border border-orange-500/20">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                                                            <span className="text-orange-400 text-xs font-black uppercase">ÇORBA</span>
                                                        </div>
                                                        <span className="text-orange-300 text-xs font-bold">{Math.round(dayMenu.calorie * 0.15)} kcal</span>
                                                    </div>
                                                    <div className="text-white text-sm font-bold mb-2">
                                                        🍲 {dayMenu.soup}
                                                    </div>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-orange-200/80">Pro: {Math.round(dayMenu.protein * 0.10)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-yellow-200/80">Karb: {Math.round(dayMenu.carbs * 0.10)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-blue-200/80">Yağ: {Math.round(dayMenu.fat * 0.15)}g</span>
                                                    </div>
                                                </div>

                                                {/* Ana Yemek */}
                                                <div className="group/item bg-gradient-to-r from-red-900/20 to-transparent p-3 rounded-lg border border-red-500/20">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                                            <span className="text-red-400 text-xs font-black uppercase">ANA YEMEK</span>
                                                        </div>
                                                        <span className="text-red-300 text-xs font-bold">{Math.round(dayMenu.calorie * 0.60)} kcal</span>
                                                    </div>
                                                    <div className="text-white text-sm font-bold mb-2">
                                                        🍛 {dayMenu.main}
                                                    </div>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-orange-200/80">Pro: {Math.round(dayMenu.protein * 0.70)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-yellow-200/80">Karb: {Math.round(dayMenu.carbs * 0.50)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-blue-200/80">Yağ: {Math.round(dayMenu.fat * 0.60)}g</span>
                                                    </div>
                                                </div>

                                                {/* Yan */}
                                                <div className="group/item bg-gradient-to-r from-yellow-900/20 to-transparent p-3 rounded-lg border border-yellow-500/20">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                                            <span className="text-yellow-400 text-xs font-black uppercase">YANINDA</span>
                                                        </div>
                                                        <span className="text-yellow-300 text-xs font-bold">{Math.round(dayMenu.calorie * 0.25)} kcal</span>
                                                    </div>
                                                    <div className="text-white text-sm font-bold mb-2">
                                                        🥗 {dayMenu.side}
                                                    </div>
                                                    <div className="flex gap-2 text-xs">
                                                        <span className="text-orange-200/80">Pro: {Math.round(dayMenu.protein * 0.20)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-yellow-200/80">Karb: {Math.round(dayMenu.carbs * 0.40)}g</span>
                                                        <span className="text-slate-500">•</span>
                                                        <span className="text-blue-200/80">Yağ: {Math.round(dayMenu.fat * 0.25)}g</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Total Nutrition Info */}
                                            <div className="pt-4 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-transparent p-3 rounded-lg">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-white text-xs font-black uppercase tracking-wider">📊 TOPLAM DEĞER</span>
                                                    <div className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-orange-400" />
                                                        <span className="text-orange-400 text-sm font-black">{dayMenu.calorie}</span>
                                                        <span className="text-slate-500 text-xs font-bold">kcal</span>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="bg-gradient-to-br from-orange-900/40 to-orange-900/20 border border-orange-500/30 text-orange-300 px-2 py-2 rounded-lg text-xs font-black text-center group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                                                        <div className="text-xs opacity-70 mb-0.5">PRO</div>
                                                        {dayMenu.protein}g
                                                    </div>
                                                    <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-900/20 border border-yellow-500/30 text-yellow-300 px-2 py-2 rounded-lg text-xs font-black text-center group-hover:shadow-lg group-hover:shadow-yellow-500/20 transition-all">
                                                        <div className="text-xs opacity-70 mb-0.5">KARB</div>
                                                        {dayMenu.carbs}g
                                                    </div>
                                                    <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-blue-500/30 text-blue-300 px-2 py-2 rounded-lg text-xs font-black text-center group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all">
                                                        <div className="text-xs opacity-70 mb-0.5">YAĞ</div>
                                                        {dayMenu.fat}g
                                                    </div>
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
