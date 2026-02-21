'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, MessageSquare, Share2, Edit3, Flame, Trophy, Clock, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import CommentsList from './CommentsList';
import InlineCommentForm from './InlineCommentForm';

const TYPE_CONFIG: Record<string, { emoji: string; label: string; ring: string }> = {
    complaint: { emoji: '😤', label: 'Şikayet', ring: 'ring-red-500/30' },
    romance: { emoji: '💘', label: 'Aşk & Meşk', ring: 'ring-pink-500/30' },
    question: { emoji: '🤔', label: 'Soru', ring: 'ring-blue-500/30' },
    other: { emoji: '🤫', label: 'İtiraf', ring: 'ring-slate-500/30' },
};

interface ConfessionsFeedProps {
    onOpenModal?: () => void;
}

export default function ConfessionsFeed({ onOpenModal }: ConfessionsFeedProps) {
    const { confessions, voteConfession, myVotes, getComments } = useStore();
    const [sortBy, setSortBy] = useState<'new' | 'hot' | 'top'>('new');
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const [activeReply, setActiveReply] = useState<{ confessionId: number; parentCommentId: number; parentUser: string } | null>(null);

    const items = [...confessions]
        .filter(c => c.status === 'approved')
        .sort((a, b) => {
            if (sortBy === 'new') return b.timestamp - a.timestamp;
            if (sortBy === 'top') return b.likes - a.likes;
            // hot
            const scoreA = a.likes / Math.max(1, (Date.now() - a.timestamp) / 3600000);
            const scoreB = b.likes / Math.max(1, (Date.now() - b.timestamp) / 3600000);
            return scoreB - scoreA;
        });

    const openReply = (confessionId: number, parentCommentId: number, parentUser: string) => {
        setActiveCommentId(null);
        setActiveReply(prev => prev?.parentCommentId === parentCommentId ? null : { confessionId, parentCommentId, parentUser });
    };

    return (
        <div>
            {/* ─── Sort bar ─── */}
            <div className="flex gap-1 mb-6 p-1 bg-white/5 border border-white/8 rounded-2xl backdrop-blur-sm">
                {([
                    { key: 'new', label: 'Yeni', icon: Clock },
                    { key: 'hot', label: 'Trend', icon: Flame },
                    { key: 'top', label: 'En İyi', icon: Trophy },
                ] as { key: 'new' | 'hot' | 'top'; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${sortBy === key
                                ? 'bg-white text-black shadow-md'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ─── Empty state ─── */}
            {items.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-3xl">
                        🤫
                    </div>
                    <p className="text-slate-400 font-semibold mb-1">Frekans sessiz.</p>
                    <p className="text-slate-600 text-sm mb-6">İlk itirafı atmak sana kalıyor.</p>
                    {onOpenModal && (
                        <button onClick={onOpenModal} className="text-sm font-bold text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors">
                            Anonim itiraf et →
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => {
                        const commentCount = getComments(item.id).length;
                        const isCommentOpen = activeCommentId === item.id;
                        const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
                        const voted = myVotes[item.id];
                        const netScore = item.likes - (item.dislikes || 0);

                        return (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.04, 0.25), duration: 0.3 }}
                                className="group relative bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.14] transition-all duration-200"
                            >
                                {/* Subtle left accent bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${netScore > 10 ? 'bg-gradient-to-b from-yellow-500 to-amber-600' :
                                        netScore > 3 ? 'bg-gradient-to-b from-green-500 to-emerald-600' :
                                            item.type === 'complaint' ? 'bg-gradient-to-b from-red-500/50 to-transparent' :
                                                item.type === 'romance' ? 'bg-gradient-to-b from-pink-500/50 to-transparent' :
                                                    'bg-gradient-to-b from-slate-600/50 to-transparent'
                                    }`} />

                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ring-2 ${cfg.ring} ${item.authorAvatar
                                                ? 'bg-slate-800'
                                                : 'bg-gradient-to-br from-slate-700 to-slate-800 text-sm font-black text-slate-300'
                                            }`}>
                                            {item.authorAvatar || item.user.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-bold text-slate-200 truncate">{item.user}</span>
                                                <span className="text-xs text-slate-600">·</span>
                                                <span className="text-xs text-slate-600 font-mono">
                                                    {new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="text-xs px-1.5 py-0.5 rounded-md bg-white/5 text-slate-500 border border-white/8">
                                                    {cfg.emoji} {cfg.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-slate-200 leading-[1.7] text-[15px] whitespace-pre-line mb-3 pl-[52px]">
                                        {item.text}
                                    </p>

                                    {/* Tags */}
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3 pl-[52px]">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action bar */}
                                    <div className="flex items-center justify-between pl-[52px]">
                                        <div className="flex items-center gap-1">
                                            {/* Upvote */}
                                            <button
                                                onClick={() => voteConfession(item.id, 'up')}
                                                className={`group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${voted === 'up'
                                                        ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/30'
                                                        : 'text-slate-500 hover:bg-white/5 hover:text-green-400'
                                                    }`}
                                            >
                                                <PlaneTakeoff className="w-3.5 h-3.5" />
                                                {item.likes}
                                            </button>

                                            {/* Downvote */}
                                            <button
                                                onClick={() => voteConfession(item.id, 'down')}
                                                className={`group/btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${voted === 'down'
                                                        ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30'
                                                        : 'text-slate-500 hover:bg-white/5 hover:text-red-400'
                                                    }`}
                                            >
                                                <PlaneLanding className="w-3.5 h-3.5" />
                                                {item.dislikes || 0}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {/* Share */}
                                            <button
                                                onClick={() => {
                                                    const t = `THKÜ İtiraf: ${item.text}\n\n${window.location.href}`;
                                                    if (navigator.share) navigator.share({ title: 'THKÜ İtiraf', text: t, url: window.location.href });
                                                    else navigator.clipboard.writeText(t);
                                                }}
                                                className="p-2 rounded-xl text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Comment toggle */}
                                            <button
                                                onClick={() => {
                                                    setActiveReply(null);
                                                    setActiveCommentId(prev => prev === item.id ? null : item.id);
                                                }}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isCommentOpen
                                                        ? 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30'
                                                        : 'text-slate-500 hover:bg-white/5 hover:text-sky-400'
                                                    }`}
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                                {isCommentOpen ? 'Kapat' : commentCount > 0 ? `${commentCount} yorum` : 'Yorum yaz'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Inline comment form */}
                                <AnimatePresence>
                                    {isCommentOpen && (
                                        <motion.div
                                            key="comment-form"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden border-t border-white/6"
                                        >
                                            <div className="px-5 py-4">
                                                <InlineCommentForm
                                                    confessionId={item.id}
                                                    confessionUser={item.user}
                                                    onCancel={() => setActiveCommentId(null)}
                                                    onSubmitted={() => setActiveCommentId(null)}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Comments — always shown inline (Instagram style) */}
                                {commentCount > 0 && (
                                    <div className="border-t border-white/6 px-5 pb-4">
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
                                    </div>
                                )}

                                {/* Hot badge */}
                                {sortBy === 'hot' && netScore > 5 && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        TREND
                                    </div>
                                )}
                            </motion.article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
