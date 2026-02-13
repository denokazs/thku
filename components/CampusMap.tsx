'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Building2, Landmark, GraduationCap, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

const MAPS = [
    {
        id: 'general',
        title: 'Genel Kampüs Haritası',
        icon: Map,
        src: '/maps/campus-general.png',
        description: 'Kampüs genel yerleşim planı ve binalar.'
    },
    {
        id: 'faculty-main',
        title: 'Fakülteler Binası (İç Plan)',
        icon: GraduationCap,
        src: '/maps/faculty-main.png',
        description: 'Mühendislik ve İşletme Fakülteleri derslik planı.'
    },
    {
        id: 'faculty-annex',
        title: 'Ek Fakülte Binası',
        icon: Building2,
        src: '/maps/faculty-annex.png',
        description: 'Ek bina zemin ve birinci kat planları.'
    },
    {
        id: 'admin',
        title: 'İdari Bina Derslikleri',
        icon: Landmark,
        src: '/maps/admin-building.jpg',
        description: 'İdari bina içindeki derslik ve ofis planları.'
    }
];

export default function CampusMap() {
    const [activeMapId, setActiveMapId] = useState('general');
    const [isZoomed, setIsZoomed] = useState(false);

    const activeMap = MAPS.find(m => m.id === activeMapId) || MAPS[0];

    return (
        <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-800 flex flex-col min-h-[800px]">

            {/* Header / Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Kampüs Rehberi</h2>
                    <p className="text-slate-400 text-sm">Kat planları ve yerleşim haritaları</p>
                </div>

                <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    {MAPS.map((map) => (
                        <button
                            key={map.id}
                            onClick={() => { setActiveMapId(map.id); setIsZoomed(false); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 ${activeMapId === map.id
                                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <map.icon className="w-4 h-4" />
                            {map.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Viewer Area */}
            <div className="flex-1 relative bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 group shadow-inner flex flex-col">

                {/* Blur backdrop for fill */}
                <div
                    className="absolute inset-0 opacity-20 blur-3xl scale-110"
                    style={{ backgroundImage: `url(${activeMap.src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />

                {/* Map Image Container */}
                <div className={`
                    relative flex-1 overflow-auto flex items-center justify-center p-4 transition-all duration-300
                    ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
                `}
                    onClick={() => setIsZoomed(!isZoomed)}
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeMap.src}
                            src={activeMap.src}
                            alt={activeMap.title}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: isZoomed ? 1.5 : 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className={`
                                max-w-full max-h-full object-contain shadow-2xl rounded-lg
                                ${isZoomed ? 'max-w-none max-h-none' : ''}
                            `}
                        />
                    </AnimatePresence>

                    {/* Hint overlay */}
                    {!isZoomed && (
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <Maximize2 className="w-3 h-3" />
                            Büyütmek için tıkla
                        </div>
                    )}
                </div>

                {/* Info Footer */}
                <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <activeMap.icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">{activeMap.title}</h3>
                            <p className="text-slate-500 text-xs">{activeMap.description}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700"
                    >
                        {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
