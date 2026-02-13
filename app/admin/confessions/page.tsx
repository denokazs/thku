'use client';

import { useStore } from '@/context/StoreContext';
import { Check, X, Clock } from 'lucide-react';

export default function AdminConfessionsPage() {
    const { confessions, updateConfessionStatus } = useStore();

    // Sort: Pending first, then by timestamp (newest first)
    const sortedConfessions = [...confessions].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return b.timestamp - a.timestamp; // Newest first
    });

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">İtiraf Moderasyonu</h1>

            <div className="space-y-4">
                {sortedConfessions.map((confession) => (
                    <div
                        key={confession.id}
                        className={`bg-white p-6 rounded-xl shadow-sm border-l-4 overflow-hidden relative ${confession.status === 'pending' ? 'border-l-orange-500' :
                                confession.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500 opacity-60'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="mb-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-slate-700">{confession.user}</span>
                                    <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${confession.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                            confession.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {confession.status === 'pending' ? 'Bekliyor' : confession.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(confession.timestamp).toLocaleString('tr-TR')}
                                    </span>
                                </div>
                                <p className="text-slate-600">{confession.text}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                {confession.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => updateConfessionStatus(confession.id, 'approved')}
                                            className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                                            title="Onayla"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => updateConfessionStatus(confession.id, 'rejected')}
                                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                            title="Reddet"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </>
                                )}

                                {/* Allow reverting decision */}
                                {confession.status !== 'pending' && (
                                    <button
                                        onClick={() => updateConfessionStatus(confession.id, 'pending')}
                                        className="text-xs text-slate-400 hover:underline"
                                    >
                                        Kararı Değiştir
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
