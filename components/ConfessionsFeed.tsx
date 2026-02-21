'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, MessageSquare, MoreHorizontal, Clock, CheckCircle2, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import CommentsList from './CommentsList';
import InlineCommentForm from './InlineCommentForm';

export default function ConfessionsFeed() {
    const { confessions, voteConfession, myVotes, getComments } = useStore();
    const [sortBy, setSortBy] = useState<'new' | 'hot' | 'top'>('new');
    // null = closed, number = confessionId whose form is open
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    // for inline replies: { confessionId, parentCommentId, parentUser }
    const [activeReply, setActiveReply] = useState<{ confessionId: number; parentCommentId: number; parentUser: string } | null>(null);
    // expanded comments list per confession
    const [expandedComments, setExpandedComments] = useState<Record<number, boolean>>({});

    const items = [...confessions]
        .filter(c => c.status === 'approved')
        .sort((a, b) => {
            if (sortBy === 'new') return b.timestamp - a.timestamp;
            if (sortBy === 'top') return b.likes - a.likes;
            if (sortBy === 'hot') {
                const scoreA = a.likes / Math.max(1, (Date.now() - a.timestamp) / 3600000);
                const scoreB = b.likes / Math.max(1, (Date.now() - b.timestamp) / 3600000);
                return scoreB - scoreA;
            }
            return 0;
        });

    const handleVote = (id: number, type: 'up' | 'down') => voteConfession(id, type);

    const toggleComments = (id: number) =>
        setExpandedComments(prev => ({ ...prev, [id]: !prev[id] }));

    const openCommentForm = (confessionId: number) => {
        setActiveReply(null);
        setActiveCommentId(prev => prev === confessionId ? null : confessionId);
    };

    const openReply = (confessionId: number, parentCommentId: number, parentUser: string) => {
        setActiveCommentId(null);
        setActiveReply(prev =>
            prev?.parentCommentId === parentCommentId ? null
                : { confessionId, parentCommentId, parentUser }
        );
        // Auto-expand comments so the user can see where they're replying
        setExpandedComments(prev => ({ ...prev, [confessionId]: true }));
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            {items.length > 0 && (
                <div className="flex items-center gap-2 mb-6 bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 overflow-x-auto custom-scrollbar">
                    <button onClick={() => setSortBy('new')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'new' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'}`}>
                        <Clock className="w-4 h-4" /> En Yeniler
                    </button>
                    <button onClick={() => setSortBy('hot')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'hot' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-white'}`}>
                        <PlaneTakeoff className="w-4 h-4" /> Trendler (Hot)
                    </button>
                    <button onClick={() => setSortBy('top')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${sortBy === 'top' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'text-slate-400 hover:text-white'}`}>
                        <CheckCircle2 className="w-4 h-4" /> Efsaneler (Top)
                    </button>
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-500">Henüz onaylanmış itiraf bulunmamaktadır.</p>
                </div>
            ) : (
                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                    {items.map((item, index) => {
                        const commentCount = getComments(item.id).length;
                        const isCommentOpen = activeCommentId === item.id;
                        const commentsExpanded = expandedComments[item.id];

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="break-inside-avoid relative glass-dark rounded-xl p-6 hover:border-red-500/30 transition-all duration-300 group"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        {item.authorAvatar ? (
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-xl shadow-inner">
                                                {item.authorAvatar}
                                            </div>
                                        ) : (
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner ${item.type === 'complaint' ? 'bg-red-900/50 text-red-200 border border-red-800' :
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

                                {/* Text */}
                                <p className="text-slate-300 mb-4 leading-relaxed font-light whitespace-pre-line">{item.text}</p>

                                {/* Tags */}
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions bar */}
                                <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                                    {/* Votes */}
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => handleVote(item.id, 'up')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${myVotes[item.id] === 'up' ? 'bg-green-600 text-white shadow-lg shadow-green-900/40 hover:bg-green-700' : 'bg-slate-800/50 text-slate-400 hover:text-green-400 hover:bg-slate-800'}`}>
                                            <PlaneTakeoff className={`w-3.5 h-3.5 ${myVotes[item.id] === 'up' ? 'animate-pulse' : ''}`} />
                                            <span>{item.likes}</span>
                                        </button>
                                        <button onClick={() => handleVote(item.id, 'down')} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${myVotes[item.id] === 'down' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 hover:bg-red-700' : 'bg-slate-800/50 text-slate-400 hover:text-red-400 hover:bg-slate-800'}`}>
                                            <PlaneLanding className={`w-3.5 h-3.5 ${myVotes[item.id] === 'down' ? 'animate-bounce' : ''}`} />
                                            <span>{item.dislikes || 0}</span>
                                        </button>
                                    </div>

                                    {/* Right actions */}
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                const t = `THKÜ İtiraf: ${item.text}\n\nTHKÜ Social'da görüntüle: ${window.location.href}`;
                                                if (navigator.share) navigator.share({ title: 'THKÜ İtiraf', text: t, url: window.location.href });
                                                else { navigator.clipboard.writeText(t); alert('Bağlantı kopyalandı!'); }
                                            }}
                                            className="text-slate-500 hover:text-blue-400 transition-colors" title="Paylaş"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => openCommentForm(item.id)}
                                            className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isCommentOpen ? 'text-sky-400' : 'text-slate-400 hover:text-white'}`}
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            {isCommentOpen ? 'Kapat' : `Yorum Yap${commentCount > 0 ? ` (${commentCount})` : ''}`}
                                        </button>

                                        {commentCount > 0 && (
                                            <button
                                                onClick={() => toggleComments(item.id)}
                                                className={`flex items-center gap-1 text-xs font-bold transition-colors ${commentsExpanded ? 'text-slate-300' : 'text-slate-500 hover:text-white'}`}
                                            >
                                                {commentsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                {commentsExpanded ? 'Gizle' : 'Görüntüle'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Inline comment form */}
                                <AnimatePresence>
                                    {isCommentOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <InlineCommentForm
                                                confessionId={item.id}
                                                confessionUser={item.user}
                                                onCancel={() => setActiveCommentId(null)}
                                                onSubmitted={() => {
                                                    setActiveCommentId(null);
                                                    setExpandedComments(prev => ({ ...prev, [item.id]: true }));
                                                }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Comments list */}
                                <AnimatePresence>
                                    {commentsExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <CommentsList
                                                confessionId={item.id}
                                                confessionUser={item.user}
                                                activeReplyId={activeReply?.parentCommentId ?? null}
                                                onReply={(comment) => openReply(item.id, comment.id, comment.user)}
                                                renderReplyForm={(comment) =>
                                                    activeReply?.parentCommentId === comment.id ? (
                                                        <InlineCommentForm
                                                            confessionId={item.id}
                                                            confessionUser={item.user}
                                                            parentCommentId={comment.id}
                                                            parentUser={comment.user}
                                                            onCancel={() => setActiveReply(null)}
                                                            onSubmitted={() => setActiveReply(null)}
                                                        />
                                                    ) : null
                                                }
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Inline reply form (if targeting a comment in a collapsed list) */}
                                <AnimatePresence>
                                    {activeReply?.confessionId === item.id && !commentsExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            <InlineCommentForm
                                                confessionId={item.id}
                                                confessionUser={item.user}
                                                parentCommentId={activeReply.parentCommentId}
                                                parentUser={activeReply.parentUser}
                                                onCancel={() => setActiveReply(null)}
                                                onSubmitted={() => setActiveReply(null)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Hover border decoration */}
                                <div className="absolute inset-0 rounded-xl pointer-events-none border border-transparent group-hover:border-red-500/20 transition-all duration-500" />
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
