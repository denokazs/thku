'use client';

import { Bus, MapPin, Clock } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function ShuttleTracker() {
    const { shuttleStops: stops } = useStore();

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <Bus className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-blue-900">Ring Takip</h3>
                        <p className="text-sm text-gray-500">Sıhhiye - Türkkuşu Hattı</p>
                    </div>
                </div>
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs animate-pulse">
                    YOLDA
                </span>
            </div>

            <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gray-100 rounded-full"></div>

                {/* Progress Line */}
                <div className="absolute left-[27px] top-4 h-[40%] w-1 bg-blue-600 rounded-full"></div>

                {stops.map((stop, index) => (
                    <div key={index} className="relative flex items-center gap-6 group">
                        {/* Dot/Icon */}
                        <div className={`
                z-10 w-6 h-6 rounded-full border-4 flex-shrink-0 transition-all duration-500
                ${stop.status === 'past' ? 'bg-blue-600 border-blue-600' :
                                stop.status === 'current' ? 'bg-white border-blue-600 scale-125 shadow-lg shadow-blue-500/30' :
                                    'bg-white border-gray-300'}
            `}>
                            {stop.status === 'current' && (
                                <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-ping"></div>
                            )}
                        </div>

                        <div className={`flex-1 p-4 rounded-xl transition-colors ${stop.status === 'current' ? 'bg-blue-50 border border-blue-100' : ''}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold ${stop.status === 'future' ? 'text-gray-400' : 'text-gray-800'}`}>
                                    {stop.name}
                                </span>
                                <span className={`text-xs font-mono font-bold ${stop.status === 'current' ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {stop.time}
                                </span>
                            </div>
                            {stop.status === 'current' && (
                                <p className="text-xs text-blue-600 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Otobüs burada (Tahmini kalkış: 2 dk)
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
