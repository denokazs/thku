'use client';

import { useStore } from '@/context/StoreContext';
import { Check, X, Clock, MessageSquare, CornerDownRight } from 'lucide-react';

export default function CommentsAdminPage() {
    const { comments, updateCommentStatus, confessions } = useStore();

    // Sort: pending first, then newest
    const sortedComments = [...comments].sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return b.timestamp - a.timestamp;
    });

    const getConfession = (confessionId: number) =>
        confessions.find(c => c.id === confessionId);

    const pendingCount = comments.filter(c => c.status === 'pending').length;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Yorum Moderasyonu</h1>
                {pendingCount > 0 && (
                    <span className="bg-orange-100 text-orange-700 text-sm font-bold px-3 py-1 rounded-full">
                        {pendingCount} bekliyor
                    </span>
                )}
            </div>

            <div className="space-y-4">
                {sortedComments.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-slate-300 mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Yorum Bulunamadı</h3>
                        <p className="text-slate-500">Henüz hiçbir yorum gönderilmemiş.</p>
                    </div>
                ) : (
                    sortedComments.map((comment) => {
                        const confession = getConfession(comment.confessionId);
                        return (
                            <div
                                key={comment.id}
                                className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${comment.status === 'pending'
                                        ? 'border-l-orange-500'
                                        : comment.status === 'approved'
                                            ? 'border-l-green-500'
                                            : 'border-l-red-500 opacity-60'
                                    }`}
                            >
                                {/* Confession context */}
                                {confession && (
                                    <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs mb-1">
                                            <MessageSquare className="w-3 h-3" /> İTİRAF
                                        </div>
                                        <p className="text-slate-500 italic">
                                            "{confession.text.slice(0, 120)}{confession.text.length > 120 ? '…' : ''}"
                                            <span className="not-italic font-bold text-slate-400 ml-1">— {confession.user}</span>
                                        </p>
                                    </div>
                                )}

                                {/* Reply indicator */}
                                {comment.parentCommentId && (
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-bold">
                                        <CornerDownRight className="w-3 h-3" /> Yanıt
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <div className="flex-1 mr-4">
                                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                            <span className="font-bold text-slate-700">{comment.user}</span>
                                            {comment.isOP && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600 border border-red-200">
                                                    👑 İtiraf Sahibi
                                                </span>
                                            )}
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${comment.status === 'pending' ? 'bg-orange-100 text-orange-700'
                                                    : comment.status === 'approved' ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                {comment.status === 'pending' ? 'Bekliyor' : comment.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(comment.timestamp).toLocaleString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed">{comment.text}</p>
                                    </div>

                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {comment.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateCommentStatus(comment.id, 'approved')}
                                                    className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                                                    title="Onayla"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateCommentStatus(comment.id, 'rejected')}
                                                    className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                                    title="Reddet"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </>
                                        )}
                                        {comment.status !== 'pending' && (
                                            <button
                                                onClick={() => updateCommentStatus(comment.id, 'pending')}
                                                className="text-xs text-slate-400 hover:underline"
                                            >
                                                Kararı Değiştir
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
