'use client';

import { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, AlertCircle, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA SOURCE --
const BUS_SCHEDULE = {
    weekday: {
        toSchool: [
            { time: "07:35", route: "Ostim > Okul" },
            { time: "16:45", route: "Ostim > Okul" },
            { time: "17:25", route: "Ümitköy > Okul" },
            { time: "18:40", route: "Ostim > Okul" },
            { time: "19:20", route: "Ümitköy > Okul" }
        ],
        fromSchool: [
            { time: "08:00", route: "Okul > Ümitköy" },
            { time: "17:10", route: "Okul > Ümitköy" },
            { time: "17:40", route: "Okul > Ostim" },
            { time: "19:05", route: "Okul > Ümitköy" },
            { time: "19:35", route: "Okul > Ostim" }
        ]
    },
    weekend: {
        // Keeping previous weekend fallback or empty if unsure, but user didn't specify. 
        // Assuming reduced service logic pertains.
        all: ["07:20", "08:00", "08:40", "12:15", "15:15", "16:45", "18:40"]
    }
};

const STOPS = [
    { name: "Ostim Metro", id: "ostim" },
    { name: "Batıkent Metro", id: "batikent" },
    { name: "Şaşmaz", id: "sasmaz" },
    { name: "THK Üniversitesi", id: "thk" },
    { name: "Ümitköy Metro", id: "umitkoy" }
];

export default function EgoTracker() {
    const [direction, setDirection] = useState<'toSchool' | 'fromSchool'>('toSchool');
    const [nextBus, setNextBus] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number } | null>(null);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);
    const [isWeekend, setIsWeekend] = useState(false);

    // --- Logic ---
    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();
            const day = now.getDay();
            const isWe = day === 0 || day === 6; // 0=Sun, 6=Sat
            setIsWeekend(isWe);

            let schedule: string[] = [];

            if (isWe) {
                schedule = BUS_SCHEDULE.weekend.all;
            } else {
                // Map complex objects to just times for countdown logic
                const targetList = direction === 'toSchool' ? BUS_SCHEDULE.weekday.toSchool : BUS_SCHEDULE.weekday.fromSchool;
                schedule = targetList.map(item => item.time);
            }

            // Find next bus
            let foundNext = null;
            for (const time of schedule) {
                const [h, m] = time.split(':').map(Number);
                const busMinutes = h * 60 + m;

                if (busMinutes > currentMinutes) {
                    foundNext = time;
                    const diff = busMinutes - currentMinutes;
                    setTimeLeft({ hours: Math.floor(diff / 60), minutes: diff % 60 });
                    break;
                }
            }

            setNextBus(foundNext);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 30000); // Update every 30s
        return () => clearInterval(interval);
    }, [direction]);


    // --- Helper for formatting countdown ---
    const getCountdownDisplay = () => {
        if (!nextBus || !timeLeft) return { text: "Bugünlük seferler bitti. Yarın görüşürüz.", color: "text-slate-500", icon: Clock };

        const { hours, minutes } = timeLeft;
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes < 10) {
            return {
                text: `KOŞ! 🚀 ${minutes} dk kaldı`,
                color: "text-red-600 animate-pulse",
                icon: AlertCircle
            };
        } else if (totalMinutes < 60) {
            return {
                text: `Kalkışa ${minutes} dk var`,
                color: "text-green-600",
                icon: Bus
            };
        } else {
            return {
                text: `Sonraki Ring: ${nextBus}`,
                color: "text-blue-900",
                icon: Clock
            };
        }
    };

    const status = getCountdownDisplay();

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-[#00205B] p-6 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 p-4">
                    <Bus className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black uppercase tracking-wider mb-1">EGO 236-2</h2>
                    <p className="text-blue-200 flex items-center gap-2 text-sm font-medium">
                        <span className="bg-red-600 px-2 py-0.5 rounded text-white text-xs">RING</span>
                        THKU Smart Tracker
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-8">

                {/* Toggle Direction */}
                <div className="bg-slate-100 p-1 rounded-xl flex font-bold text-sm">
                    <button
                        onClick={() => setDirection('toSchool')}
                        className={`flex-1 py-2 rounded-lg transition-all ${direction === 'toSchool' ? 'bg-white text-[#00205B] shadow-sm' : 'text-slate-400 hover:text-[#00205B]'}`}
                    >
                        Okula Gidiş
                    </button>
                    <button
                        onClick={() => setDirection('fromSchool')}
                        className={`flex-1 py-2 rounded-lg transition-all ${direction === 'fromSchool' ? 'bg-white text-[#00205B] shadow-sm' : 'text-slate-400 hover:text-[#00205B]'}`}
                    >
                        Okuldan Dönüş
                    </button>
                </div>

                {/* Countdown Card (Main Feature) */}
                <div className="text-center py-4">
                    <div className={`text-4xl md:text-5xl font-black mb-2 flex items-center justify-center gap-3 ${status.color}`}>
                        <status.icon className="w-10 h-10 md:w-12 md:h-12" />
                        {nextBus && timeLeft && (timeLeft?.hours * 60 + timeLeft?.minutes) < 60
                            ? timeLeft?.minutes
                            : nextBus || '--:--'}
                        {nextBus && timeLeft && (timeLeft?.hours * 60 + timeLeft?.minutes) < 60 && <span className="text-xl font-bold self-end mb-2">dk</span>}
                    </div>
                    <p className="text-slate-500 font-medium text-lg">{status.text}</p>

                    {/* Simulated Status Badge */}
                    <div className="mt-4 flex justify-center gap-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                            Hat Durumu: Normal
                        </span>
                        <a href="https://ego.gov.tr" target="_blank" className="inline-flex items-center gap-1 text-slate-400 hover:text-[#00205B] text-xs font-bold transition-colors">
                            <ExternalLink className="w-3 h-3" />
                            EGO Cep'te
                        </a>
                    </div>
                </div>

                {/* Visual Route Timeline */}
                <div className="relative pt-4 pb-8 px-4">
                    {/* Line */}
                    <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
                    <div className="flex justify-between relative z-10">
                        {STOPS.map((stop, i) => {
                            // Simple logic to highlight user's relevant stops based on direction
                            const isStart = (direction === 'toSchool' && i === 0) || (direction === 'fromSchool' && i === 3);
                            const isEnd = (direction === 'toSchool' && i === 3) || (direction === 'fromSchool' && i === 4);
                            const isActive = stop.id === 'thk' || isStart || isEnd;

                            return (
                                <div key={stop.id} className="flex flex-col items-center gap-2 group">
                                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${stop.id === 'thk'
                                        ? 'w-6 h-6 bg-[#00205B] border-[#00205B] shadow-lg scale-110'
                                        : isActive ? 'bg-white border-[#00205B]' : 'bg-slate-100 border-slate-300'
                                        }`}></div>
                                    <span className={`text-[10px] font-bold absolute -bottom-6 w-20 text-center transition-colors ${stop.id === 'thk' ? 'text-[#E31E24] scale-110' : isActive ? 'text-slate-600' : 'text-slate-300'
                                        }`}>
                                        {stop.name}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Full Schedule Accordion */}
                <div className="border-t border-slate-100 pt-4">
                    <button
                        onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                        className="w-full flex justify-between items-center text-[#00205B] font-bold text-sm hover:bg-slate-50 p-3 rounded-lg transition-colors"
                    >
                        <span>Tüm Saatleri Gör</span>
                        {isScheduleOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <AnimatePresence>
                        {isScheduleOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 text-sm mt-2 bg-slate-50 rounded-xl">
                                    <div>
                                        <h4 className="font-black text-slate-400 text-xs mb-3 uppercase tracking-wider">Hafta İçi (Okula Gidiş)</h4>
                                        <div className="space-y-2">
                                            {BUS_SCHEDULE.weekday.toSchool.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                                    <span className="font-mono text-blue-900 font-bold">{item.time}</span>
                                                    <span className="text-xs text-slate-500 font-medium">{item.route}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-black text-slate-400 text-xs mb-3 uppercase tracking-wider">Hafta İçi (Okuldan Dönüş)</h4>
                                        <div className="space-y-2">
                                            {BUS_SCHEDULE.weekday.fromSchool.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                                    <span className="font-mono text-red-600 font-bold">{item.time}</span>
                                                    <span className="text-xs text-slate-500 font-medium">{item.route}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-black text-slate-400 text-xs mb-3 uppercase tracking-wider">Hafta Sonu</h4>
                                        <div className="flex flex-wrap gap-2 content-start">
                                            {BUS_SCHEDULE.weekend.all.map(t => (
                                                <span key={t} className="bg-white px-2 py-1 rounded border border-slate-200 shadow-sm text-slate-500 font-mono">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
