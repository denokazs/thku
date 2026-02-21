'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, MessageSquare, Clock, CheckCircle2, Share2, Edit3, Flame, Trophy } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import CommentsList from './CommentsList';
import InlineCommentForm from './InlineCommentForm';

const TYPE_CONFIG: Record<string, { label: string; color: string; badge: string }> = {
    complaint: { label: 'Şikayet', color: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
    romance: { label: 'Aşk & Meşk', color: 'text-pink-400', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
    other: { label: 'İtiraf', color: 'text-sky-400', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
};

export default function ConfessionsFeed() {
    const { confessions, voteConfession, myVotes, getComments } = useStore();
    const [sortBy, setSortBy] = useState<'new' | 'hot' | 'top'>('new');
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const [activeReply, setActiveReply] = useState<{ confessionId: number; parentCommentId: number; parentUser: string } | null>(null);

    const items = [...confessions]
        .filter(c => c.status === 'approved')
        .sort((a, b) => {
            if (sortBy === 'new') return b.timestamp - a.timestamp;
            if (sortBy === 'top') return b.likes - a.likes;
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
            {/* Sort Tabs */}
            {items.length > 0 && (
                <div className="flex gap-1 mb-6 p-1 bg-slate-800/60 rounded-xl border border-slate-700/50">
                    {[
                        { key: 'new', label: 'En Yeni', icon: Clock },
                        { key: 'hot', label: 'Trend', icon: Flame },
                        { key: 'top', label: 'En İyi', icon: Trophy },
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => setSortBy(key as 'new' | 'hot' | 'top')}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-bold transition-all ${sortBy === key
                                ? 'bg-slate-700 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center mb-5">
                        <MessageSquare className="w-9 h-9 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-medium">Henüz itiraf yok.</p>
                    <p className="text-slate-600 text-sm mt-1">İlk cesur adımı sen at.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, index) => {
                        const commentCount = getComments(item.id).length;
                        const isCommentOpen = activeCommentId === item.id;
                        const cfg = TYPE_CONFIG[item.type] ?? TYPE_CONFIG.other;
                        const voted = myVotes[item.id];

                        return (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/60 transition-all duration-200"
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between px-5 pt-4 pb-3">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${item.authorAvatar ? 'bg-slate-700/60 border border-slate-600/50' : 'bg-gradient-to-br from-slate-600 to-slate-700 border border-slate-600/50 text-sm font-bold text-slate-300'
                                            }`}>
                                            {item.authorAvatar || item.user.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-slate-200">{item.user}</span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${cfg.badge}`}>{cfg.label}</span>
                                            </div>
                                            <span className="text-xs text-slate-600 font-mono">
                                                {new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                {' · '}FL-{100 + item.id % 900}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confession text */}
                                <div className="px-5 pb-3">
                                    <p className="text-slate-200 leading-relaxed whitespace-pre-line text-[15px]">{item.text}</p>
                                </div>

                                {/* Tags */}
                                {item.tags && item.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                                        {item.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Action bar */}
                                <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-700/30">
                                    {/* Vote buttons */}
                                    <div className="flex items-center gap-0.5">
                                        <button
                                            onClick={() => voteConfession(item.id, 'up')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${voted === 'up'
                                                ? 'bg-green-500/15 text-green-400'
                                                : 'text-slate-500 hover:text-green-400 hover:bg-green-500/10'
                                                }`}
                                        >
                                            <PlaneTakeoff className="w-3.5 h-3.5" />
                                            {item.likes}
                                        </button>
                                        <button
                                            onClick={() => voteConfession(item.id, 'down')}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${voted === 'down'
                                                ? 'bg-red-500/15 text-red-400'
                                                : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
                                                }`}
                                        >
                                            <PlaneLanding className="w-3.5 h-3.5" />
                                            {item.dislikes || 0}
                                        </button>
                                    </div>

                                    {/* Right actions */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                const t = `THKÜ İtiraf: ${item.text}\n\nTHKÜ Social: ${window.location.href}`;
                                                if (navigator.share) navigator.share({ title: 'THKÜ İtiraf', text: t, url: window.location.href });
                                                else { navigator.clipboard.writeText(t); }
                                            }}
                                            className="p-2 text-slate-600 hover:text-blue-400 transition-colors rounded-lg hover:bg-blue-500/10"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveReply(null);
                                                setActiveCommentId(prev => prev === item.id ? null : item.id);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCommentOpen
                                                ? 'bg-sky-500/15 text-sky-400'
                                                : 'text-slate-500 hover:text-sky-400 hover:bg-sky-500/10'
                                                }`}
                                        >
                                            <Edit3 className="w-3.5 h-3.5" />
                                            {isCommentOpen ? 'Kapat' : 'Yorum yaz'}
                                        </button>
                                    </div>
                                </div>

                                {/* Inline comment form */}
                                <AnimatePresence>
                                    {isCommentOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden border-t border-slate-700/30 px-5 pb-4"
                                        >
                                            <InlineCommentForm
                                                confessionId={item.id}
                                                confessionUser={item.user}
                                                onCancel={() => setActiveCommentId(null)}
                                                onSubmitted={() => setActiveCommentId(null)}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Comments list — always visible, Instagram style */}
                                <div className="px-5 pb-4">
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
                            </motion.article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
