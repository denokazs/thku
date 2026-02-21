'use client';

import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Check, X, Clock, MessageSquare, ChevronDown, ChevronUp, CornerDownRight } from 'lucide-react';

export default function AdminConfessionsPage() {
    const { confessions, comments, updateConfessionStatus, updateCommentStatus } = useStore();
    const [expandedConfessions, setExpandedConfessions] = useState<Record<number, boolean>>({});

    const sortedConfessions = [...confessions].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return b.timestamp - a.timestamp;
    });

    const getCommentsFor = (confessionId: number) =>
        comments.filter(c => c.confessionId === confessionId).sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return a.timestamp - b.timestamp;
        });

    const toggleExpand = (id: number) =>
        setExpandedConfessions(prev => ({ ...prev, [id]: !prev[id] }));

    const totalPendingComments = comments.filter(c => c.status === 'pending').length;
    const totalPendingConfessions = confessions.filter(c => c.status === 'pending').length;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">İtiraf & Yorum Moderasyonu</h1>
                    <p className="text-slate-500 text-sm mt-1">İtirafları ve yorumlarını tek ekrandan yönet</p>
                </div>
                <div className="flex gap-3">
                    {totalPendingConfessions > 0 && (
                        <span className="bg-red-100 text-red-700 text-sm font-bold px-3 py-1 rounded-full">
                            {totalPendingConfessions} itiraf bekliyor
                        </span>
                    )}
                    {totalPendingComments > 0 && (
                        <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                            {totalPendingComments} yorum bekliyor
                        </span>
                    )}
                </div>
            </div>

            {/* Confessions list */}
            <div className="space-y-4">
                {sortedConfessions.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">İtiraf Bulunamadı</h3>
                        <p className="text-slate-500">Henüz hiçbir itiraf gönderilmemiş.</p>
                    </div>
                ) : (
                    sortedConfessions.map((confession) => {
                        const confComments = getCommentsFor(confession.id);
                        const pendingCommentCount = confComments.filter(c => c.status === 'pending').length;
                        const isExpanded = expandedConfessions[confession.id];

                        return (
                            <div
                                key={confession.id}
                                className={`bg-white rounded-xl shadow-sm border-l-4 overflow-hidden ${confession.status === 'pending' ? 'border-l-orange-500'
                                        : confession.status === 'approved' ? 'border-l-green-500'
                                            : 'border-l-red-500 opacity-60'
                                    }`}
                            >
                                {/* Confession row */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 mr-4">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-bold text-slate-700 text-lg">
                                                    {confession.authorAvatar && <span className="mr-1">{confession.authorAvatar}</span>}
                                                    {confession.user}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${confession.status === 'pending' ? 'bg-orange-100 text-orange-700'
                                                        : confession.status === 'approved' ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {confession.status === 'pending' ? 'Bekliyor' : confession.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                                </span>
                                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(confession.timestamp).toLocaleString('tr-TR')}
                                                </span>
                                                {confession.tags && confession.tags.length > 0 && confession.tags.map(t => (
                                                    <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">#{t}</span>
                                                ))}
                                            </div>
                                            <p className="text-slate-600 leading-relaxed">{confession.text}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {confession.status === 'pending' && (
                                                <div className="flex gap-2">
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
                                                </div>
                                            )}
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

                                    {/* Comments toggle */}
                                    {confComments.length > 0 && (
                                        <button
                                            onClick={() => toggleExpand(confession.id)}
                                            className="mt-4 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
                                        >
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            <MessageSquare className="w-4 h-4" />
                                            {confComments.length} yorum
                                            {pendingCommentCount > 0 && (
                                                <span className="ml-1 bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                                    {pendingCommentCount} bekliyor
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* Comments panel */}
                                {isExpanded && confComments.length > 0 && (
                                    <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
                                        {confComments.map(comment => (
                                            <div
                                                key={comment.id}
                                                className={`bg-white rounded-lg p-4 border-l-4 ${comment.status === 'pending' ? 'border-l-orange-400'
                                                        : comment.status === 'approved' ? 'border-l-green-400'
                                                            : 'border-l-red-300 opacity-50'
                                                    }`}
                                            >
                                                {comment.parentCommentId && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-1.5 font-bold">
                                                        <CornerDownRight className="w-3 h-3" /> Yanıt
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 mr-3">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <span className="font-bold text-slate-700 text-sm">{comment.user}</span>
                                                            {comment.isOP && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">
                                                                    👑 İtiraf Sahibi
                                                                </span>
                                                            )}
                                                            <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${comment.status === 'pending' ? 'bg-orange-100 text-orange-700'
                                                                    : comment.status === 'approved' ? 'bg-green-100 text-green-700'
                                                                        : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {comment.status === 'pending' ? 'Bekliyor' : comment.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                                            </span>
                                                            <span className="text-xs text-slate-400 font-mono">{new Date(comment.timestamp).toLocaleString('tr-TR')}</span>
                                                        </div>
                                                        <p className="text-slate-600 text-sm">{comment.text}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                                        {comment.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => updateCommentStatus(comment.id, 'approved')} className="bg-green-100 text-green-700 p-1.5 rounded-lg hover:bg-green-600 hover:text-white transition-colors" title="Onayla">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button onClick={() => updateCommentStatus(comment.id, 'rejected')} className="bg-red-100 text-red-700 p-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-colors" title="Reddet">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )}
                                                        {comment.status !== 'pending' && (
                                                            <button onClick={() => updateCommentStatus(comment.id, 'pending')} className="text-xs text-slate-400 hover:underline">
                                                                Değiştir
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
