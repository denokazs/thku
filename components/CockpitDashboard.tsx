'use client';

import { motion } from 'framer-motion';
import { Leaf, Bus, Bell, Clock, AlertCircle, UsersRound } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { MONTHLY_MENU } from '@/data/menu-data';
import type { DailyMenu } from '@/types';

// Data derived from EgoTracker for consistency
const BUS_SCHEDULE = {
    weekday: {
        toSchool: ["07:35", "16:45", "17:25", "18:40", "19:20"],
        fromSchool: ["08:00", "17:10", "17:40", "19:05", "19:35"]
    },
    weekend: ["07:20", "08:00", "08:40", "12:15", "15:15", "16:45", "18:40"]
};


export default function CockpitDashboard() {
    const { announcements } = useStore();

    // Bugünün menüsünü MONTHLY_MENU'dan bul
    const todayMenu = useMemo((): DailyMenu | null => {
        const today = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const monthKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}`;
        const dateKey = `${monthKey}-${pad(today.getDate())}`;
        const monthData = MONTHLY_MENU[monthKey] || [];
        // Bugünkü tarihi bul, yoksa en yakın geçmiş günü döndür
        const exact = monthData.find(m => m.date === dateKey);
        if (exact) return exact;
        // Hafta sonu veya veri yoksa en son eklenen günü göster
        const sorted = [...monthData].sort((a, b) => b.date!.localeCompare(a.date!));
        return sorted[0] || null;
    }, []);

    const [toSchool, setToSchool] = useState<{ next: string | null, timeLeft: number | null }>({ next: null, timeLeft: null });
    const [fromSchool, setFromSchool] = useState<{ next: string | null, timeLeft: number | null }>({ next: null, timeLeft: null });

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const day = now.getDay();
            const isWeekend = day === 0 || day === 6;

            const calcNext = (schedule: string[]) => {
                let found = null;
                let left = null;
                for (const time of schedule) {
                    const [h, m] = time.split(':').map(Number);
                    const busMinutes = h * 60 + m;
                    if (busMinutes > currentMinutes) {
                        found = time;
                        left = busMinutes - currentMinutes;
                        break;
                    }
                }
                return { next: found, timeLeft: left };
            };

            if (isWeekend) {
                const result = calcNext(BUS_SCHEDULE.weekend);
                setToSchool(result);
                setFromSchool(result);
            } else {
                setToSchool(calcNext(BUS_SCHEDULE.weekday.toSchool));
                setFromSchool(calcNext(BUS_SCHEDULE.weekday.fromSchool));
            }
        };
        update();
        const interval = setInterval(update, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative z-20 -mt-24 pb-20 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Card 1: Yemekhane */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="glass bg-white/60 backdrop-blur-xl p-6 rounded-tl-3xl rounded-br-3xl shadow-2xl border-l-[6px] border-l-red-600 hover:-translate-y-2 transition-transform duration-300"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-red-100 p-3 rounded-xl text-red-600">
                            <Leaf className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {todayMenu?.day?.toUpperCase() || 'BUGÜN'}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 mb-3">Yemekhane Menüsü</h3>

                    {todayMenu?.meals && todayMenu.meals.length > 0 ? (
                        <div className="space-y-1.5">
                            {todayMenu.meals.map((meal, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <p className="text-gray-700 font-medium text-sm truncate flex-1">{meal.name}</p>
                                    <span className="text-xs text-gray-400 font-mono ml-2 whitespace-nowrap">{meal.calorie} kcal</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm italic">Bugün menü verisi yok</p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm font-semibold text-gray-600 mb-2">
                            <span>Toplam: {todayMenu?.calorie || '—'} kcal</span>
                        </div>
                        <div className="flex gap-2 text-xs">
                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-bold">
                                🥩 {todayMenu?.protein || 0}g Pro
                            </span>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md font-bold">
                                🍞 {todayMenu?.carbs || 0}g Karb
                            </span>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-bold">
                                💧 {todayMenu?.fat || 0}g Yağ
                            </span>
                        </div>
                    </div>

                    <Link href="/yemekhane">
                        <div className="mt-4 pt-4 border-t border-gray-200 group/menu cursor-pointer">
                            <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 p-3 rounded-xl transition-all duration-300 group-hover/menu:scale-105">
                                <span className="text-red-700 font-bold text-sm flex items-center gap-2">
                                    📅 TÜM AY MENÜSÜ
                                </span>
                                <span className="text-red-600 group-hover/menu:translate-x-1 transition-transform text-lg">→</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>


                {/* Card 2: Ring */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="glass bg-white/60 backdrop-blur-xl p-6 rounded-tl-3xl rounded-br-3xl shadow-2xl border-l-[6px] border-l-blue-600 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden"
                >
                    {/* Background Animation for urgency */}
                    {(toSchool.timeLeft !== null && toSchool.timeLeft < 10) || (fromSchool.timeLeft !== null && fromSchool.timeLeft < 10) ? (
                        <div className="absolute inset-0 bg-red-100/30 animate-pulse pointer-events-none"></div>
                    ) : null}

                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                            <Bus className="w-6 h-6" />
                        </div>

                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">
                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                            CANLI
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-blue-950 mb-4">EGO 236-2</h3>

                    <div className="space-y-4 relative z-10">
                        {/* To School */}
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <div>
                                <p className="text-xs text-blue-400 font-bold tracking-wider mb-1">OKULA GİDİŞ</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-sm font-bold text-gray-700">{toSchool.next || 'Bitti'}</span>
                                </div>
                            </div>
                            {toSchool.next && toSchool.timeLeft !== null && (
                                <div className="text-right">
                                    <span className={`text-2xl font-black ${toSchool.timeLeft < 10 ? 'text-red-600' : 'text-blue-900'}`}>
                                        {toSchool.timeLeft} <span className="text-xs font-bold text-gray-500">dk</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* From School */}
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-xs text-red-400 font-bold tracking-wider mb-1">OKULDAN DÖNÜŞ</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span className="text-sm font-bold text-gray-700">{fromSchool.next || 'Bitti'}</span>
                                </div>
                            </div>
                            {fromSchool.next && fromSchool.timeLeft !== null && (
                                <div className="text-right">
                                    <span className={`text-2xl font-black ${fromSchool.timeLeft < 10 ? 'text-red-600' : 'text-blue-900'}`}>
                                        {fromSchool.timeLeft} <span className="text-xs font-bold text-gray-500">dk</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <Link href="/campus" className="block text-center text-blue-600 text-xs font-bold hover:underline">Tüm Saatler &rarr;</Link>
                        </div>
                    </div>
                </motion.div>

                {/* Card 3: Duyurular */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="glass bg-white/60 backdrop-blur-xl p-6 rounded-tl-3xl rounded-br-3xl shadow-2xl border-l-[6px] border-l-amber-500 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-amber-100 p-3 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Bell className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-blue-900">SON DAKİKA</span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 mb-2">Duyurular</h3>
                    <ul className="space-y-3">
                        {announcements.slice(0, 2).map((announcement) => (
                            <li key={announcement.id} className="pb-2 border-b border-gray-100 last:border-0">
                                <div className="text-sm font-semibold text-gray-800 line-clamp-1" dangerouslySetInnerHTML={{ __html: announcement.title }} />
                                <span className="text-xs text-gray-500 block mt-1">{announcement.date} • {announcement.category}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto pt-2 text-right">
                        <Link href="#" className="text-sm text-blue-900 font-bold group-hover:translate-x-1 inline-block transition-transform">Tümünü Gör &rarr;</Link>
                    </div>
                </motion.div>

                {/* Card 4: Kulüpler */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="glass bg-white/60 backdrop-blur-xl p-6 rounded-tl-3xl rounded-br-3xl shadow-2xl border-l-[6px] border-l-purple-600 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <UsersRound className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-blue-900 bg-purple-100 px-2 py-1 rounded">AKTİF</span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-950 mb-2">Kulüpler</h3>
                    <p className="text-gray-700 font-medium mb-4">
                        Kampüsteki kulüpleri keşfet, etkinliklere katıl!
                    </p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-2xl">🤖</span>
                            <span className="text-gray-700 font-medium">Robotics Club</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-2xl">🎭</span>
                            <span className="text-gray-700 font-medium">Tiyatro Kulübü</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-2xl">🏀</span>
                            <span className="text-gray-700 font-medium">Basketbol Kulübü</span>
                        </div>
                    </div>

                    {/* Creative Navigation Button */}
                    <Link href="/kulupler">
                        <div className="mt-4 pt-4 border-t border-gray-200 group/club cursor-pointer">
                            <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 p-3 rounded-xl transition-all duration-300 group-hover/club:scale-105">
                                <span className="text-purple-700 font-bold text-sm flex items-center gap-2">
                                    🎯 TÜM KULÜPLER
                                </span>
                                <span className="text-purple-600 group-hover/club:translate-x-1 transition-transform text-lg">→</span>
                            </div>
                        </div>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}
