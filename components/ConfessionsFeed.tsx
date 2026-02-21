'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, MessageSquare, MoreHorizontal, Clock, CheckCircle2, Share2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import dynamic from 'next/dynamic';
import CommentsList from './CommentsList';

const CommentModal = dynamic(() => import('./CommentModal'), {
    loading: () => null,
    ssr: false
});

export default function ConfessionsFeed() {
    const { confessions, voteConfession, myVotes, getComments } = useStore();
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedConfession, setSelectedConfession] = useState<{ id: number; text: string; user: string } | null>(null);
    const [replyToComment, setReplyToComment] = useState<{ id: number; user: string } | null>(null);
    const [sortBy, setSortBy] = useState<'new' | 'hot' | 'top'>('new');

    // Filter and Sort Logic
    const items = [...confessions]
        .filter(c => c.status === 'approved')
        .sort((a, b) => {
            if (sortBy === 'new') {
                return b.timestamp - a.timestamp;
            } else if (sortBy === 'top') {
                // Top: Absolute highest likes
                return b.likes - a.likes;
            } else if (sortBy === 'hot') {
                // Hot: High likes recently (simple trending algorithm)
                const aHotScore = a.likes / (Math.max(1, (Date.now() - a.timestamp) / 3600000));
                const bHotScore = b.likes / (Math.max(1, (Date.now() - b.timestamp) / 3600000));
                return bHotScore - aHotScore;
            }
            return 0;
        });

    const handleVote = (id: number, type: 'up' | 'down') => {
        voteConfession(id, type);
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            {confessions.filter(c => c.status === 'approved').length > 0 && (
                <div className="flex items-center gap-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setSortBy('new')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'new' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Clock className="w-4 h-4" /> En Yeniler
                    </button>
                    <button
                        onClick={() => setSortBy('hot')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'hot' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <PlaneTakeoff className="w-4 h-4" /> Trendler (Hot)
                    </button>
                    <button
                        onClick={() => setSortBy('top')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'top' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-slate-400 hover:text-white'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Efsaneler (Top)
                    </button>
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-500">
                        Henüz onaylanmış itiraf bulunmamaktadır.
                    </p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="break-inside-avoid relative glass-dark rounded-xl p-6 hover:border-red-500/30 transition-all duration-300 group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {item.authorAvatar ? (
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-xl shadow-inner">
                                                {item.authorAvatar}
                                            </div>
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner
                                                ${item.type === 'complaint' ? 'bg-red-900/50 text-red-200 border border-red-800' :
                                                    item.type === 'romance' ? 'bg-pink-900/50 text-pink-200 border border-pink-800' :
                                                        'bg-blue-900/50 text-blue-200 border border-blue-800'}`}>
                                                {item.user.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-slate-200 font-bold text-sm tracking-wide">{item.user}</h4>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                                                <span>FL-{100 + item.id % 900}</span>
                                                <span>•</span>
                                                <span>{new Date(item.timestamp).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-slate-600 hover:text-white transition-colors">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <p className="text-slate-300 mb-4 leading-relaxed font-light whitespace-pre-line">
                                    {item.text}
                                </p>

                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleVote(item.id, "up")}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${myVotes[item.id] === "up"
                                            ? "bg-green-600 text-white shadow-lg shadow-green-900/40 hover:bg-green-700"
                                            : "bg-slate-800/50 text-slate-400 hover:text-green-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        <PlaneTakeoff className={`w-3.5 h-3.5 ${myVotes[item.id] === "up" ? "animate-pulse" : ""}`} />
                                        <span>{item.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => handleVote(item.id, "down")}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${myVotes[item.id] === "down"
                                            ? "bg-red-600 text-white shadow-lg shadow-red-900/40 hover:bg-red-700"
                                            : "bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        <PlaneLanding className={`w-3.5 h-3.5 ${myVotes[item.id] === "down" ? "animate-bounce" : ""}`} />
                                        <span>{item.dislikes || 0}</span>
                                    </button>
                                </div>


                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            const shareText = `THKÜ İtiraf: ${item.text}\n\nTHKÜ Social'da görüntüle: ${window.location.href}`;
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: 'THKÜ İtiraf',
                                                    text: shareText,
                                                    url: window.location.href
                                                });
                                            } else {
                                                navigator.clipboard.writeText(shareText);
                                                alert('Bağlantı kopyalandı!');
                                            }
                                        }}
                                        className="text-slate-500 hover:text-blue-400 transition-colors"
                                        title="Paylaş"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedConfession({ id: item.id, text: item.text, user: item.user });
                                            setCommentModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 text-xs font-bold transition-colors text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Telsize Gir{getComments(item.id).length > 0 ? ` (${getComments(item.id).length})` : ""}
                                    </button>
                                </div>
                            </div>

                            {/* Comments List */}
                            <CommentsList
                                confessionId={item.id}
                                onReply={(comment) => {
                                    setSelectedConfession({ id: item.id, text: item.text, user: item.user });
                                    setReplyToComment({ id: comment.id, user: comment.user });
                                    setCommentModalOpen(true);
                                }}
                            />

                            {/* Decorative Neon Border on Hover */}
                            <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-red-500/20 transition-all duration-500"></div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Comment Modal */}
            {selectedConfession && (
                <CommentModal
                    isOpen={commentModalOpen}
                    onClose={() => {
                        setCommentModalOpen(false);
                        setSelectedConfession(null);
                        setReplyToComment(null);
                    }}
                    confessionId={selectedConfession.id}
                    confessionText={selectedConfession.text}
                    confessionUser={selectedConfession.user}
                    replyToComment={replyToComment}
                />
            )}
        </div>
    );
}
