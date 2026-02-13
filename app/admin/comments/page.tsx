'use client';

import { useStore } from '@/context/StoreContext';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommentsAdminPage() {
    const { comments, updateCommentStatus, confessions } = useStore();
    const pendingComments = comments.filter(c => c.status === 'pending');

    const handleApprove = (id: number) => {
        updateCommentStatus(id, 'approved');
    };

    const handleReject = (id: number) => {
        updateCommentStatus(id, 'rejected');
    };

    const getConfessionById = (confessionId: number) => {
        return confessions.find(c => c.id === confessionId);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Yorum Moderasyonu</h1>
                        <p className="text-slate-400 mt-1">
                            {pendingComments.length} yorum onay bekliyor
                        </p>
                    </div>
                </div>

                {/* Pending Comments */}
                {pendingComments.length === 0 ? (
                    <div className="text-center py-20 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
                        <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-500">Bekleyen yorum yok!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {pendingComments.map((comment, index) => {
                            const confession = getConfessionById(comment.confessionId);
                            return (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
                                >
                                    {/* Confession Context */}
                                    <div className="mb-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-2">
                                            <MessageSquare className="w-3 h-3" />
                                            İTİRAF:
                                        </div>
                                        <p className="text-slate-500 text-sm italic">
                                            "{confession?.text.slice(0, 150)}{(confession?.text.length || 0) > 150 ? '...' : ''}"
                                        </p>
                                    </div>

                                    {/* Comment Details */}
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sky-400 font-bold">{comment.user}</span>
                                            <span className="text-slate-600">•</span>
                                            <span className="text-slate-500 text-sm font-mono">
                                                {new Date(comment.timestamp).toLocaleString('tr-TR')}
                                            </span>
                                        </div>
                                        <p className="text-white text-lg leading-relaxed">
                                            {comment.text}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(comment.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Onayla
                                        </button>
                                        <button
                                            onClick={() => handleReject(comment.id)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold text-sm"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reddet
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
