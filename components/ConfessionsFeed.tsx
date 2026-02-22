'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, Share2, Edit3, Flame, Trophy, Clock, Sparkles, MessageSquare, Instagram } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import CommentsList from './CommentsList';
import InlineCommentForm from './InlineCommentForm';
import { toJpeg } from 'html-to-image';
import StoryTemplate from './StoryTemplate';

const TYPE_CONFIG: Record<string, {
    emoji: string; label: string;
    cardBg: string; cardBorder: string; cardAccent: string;
    avatarGradient: string; badgeCls: string;
}> = {
    complaint: {
        emoji: '😤', label: 'Şikayet',
        cardBg: 'bg-gradient-to-br from-red-950/40 to-slate-900/60',
        cardBorder: 'border-red-500/20 hover:border-red-500/40',
        cardAccent: 'from-red-500 to-orange-500',
        avatarGradient: 'from-red-500 to-orange-600',
        badgeCls: 'bg-red-500/15 text-red-300 border-red-500/20',
    },
    romance: {
        emoji: '💘', label: 'Aşk & Meşk',
        cardBg: 'bg-gradient-to-br from-pink-950/40 to-slate-900/60',
        cardBorder: 'border-pink-500/20 hover:border-pink-500/40',
        cardAccent: 'from-pink-500 to-rose-500',
        avatarGradient: 'from-pink-500 to-rose-600',
        badgeCls: 'bg-pink-500/15 text-pink-300 border-pink-500/20',
    },
    question: {
        emoji: '🤔', label: 'Soru',
        cardBg: 'bg-gradient-to-br from-blue-950/40 to-slate-900/60',
        cardBorder: 'border-blue-500/20 hover:border-blue-500/40',
        cardAccent: 'from-blue-400 to-cyan-500',
        avatarGradient: 'from-blue-500 to-cyan-500',
        badgeCls: 'bg-blue-500/15 text-blue-300 border-blue-500/20',
    },
    other: {
        emoji: '🤫', label: 'İtiraf',
        cardBg: 'bg-gradient-to-br from-violet-950/40 to-slate-900/60',
        cardBorder: 'border-violet-500/20 hover:border-violet-500/40',
        cardAccent: 'from-violet-500 to-indigo-500',
        avatarGradient: 'from-violet-500 to-indigo-600',
        badgeCls: 'bg-violet-500/15 text-violet-300 border-violet-500/20',
    },
};

const SORT_CONFIG = [
    { key: 'new', label: 'Yeni', icon: Clock, active: 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' },
    { key: 'hot', label: 'Trend', icon: Flame, active: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' },
    { key: 'top', label: 'En İyi', icon: Trophy, active: 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' },
] as const;

interface ConfessionsFeedProps {
    onOpenModal?: () => void;
}

export default function ConfessionsFeed({ onOpenModal }: ConfessionsFeedProps) {
    const { confessions, voteConfession, myVotes, getComments } = useStore();
    const [sortBy, setSortBy] = useState<'new' | 'hot' | 'top'>('new');
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const [activeReply, setActiveReply] = useState<{ confessionId: number; parentCommentId: number; parentUser: string } | null>(null);
    const [sharingId, setSharingId] = useState<number | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleShareStory = async (item: any, cfg: any) => {
        try {
            setIsGenerating(true);
            setSharingId(item.id);

            // Wait a bit longer for complex layouts/images to fully parse
            await new Promise(resolve => setTimeout(resolve, 300));
            const node = document.getElementById('story-template-container');
            if (!node) throw new Error('Template node missing');

            const dataUrl = await toJpeg(node, {
                quality: 0.90,
                width: 1080,
                height: 1920,
                cacheBust: true,
                skipFonts: false
            });

            const req = await fetch(dataUrl);
            const blob = await req.blob();
            const file = new File([blob], `kara-kutu-${item.id}.jpeg`, { type: 'image/jpeg' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'THKÜ Kara Kutu',
                    text: 'Sky Portal üzerinden bir itiraf...'
                });
            } else {
                // Fallback download if web share API isn't supported for images
                const link = document.createElement('a');
                link.download = `kara-kutu-${item.id}.jpeg`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('Error generating image', error);
            alert('Görsel oluşturulurken bir hata oluştu!');
        } finally {
            setSharingId(null);
            setIsGenerating(false);
        }
    };

    const items = [...confessions]
        .filter(c => c.status === 'approved')
        .sort((a, b) => {
            if (sortBy === 'new') return b.timestamp - a.timestamp;
            if (sortBy === 'top') return b.likes - a.likes;
            const sA = a.likes / Math.max(1, (Date.now() - a.timestamp) / 3600000);
            const sB = b.likes / Math.max(1, (Date.now() - b.timestamp) / 3600000);
            return sB - sA;
        });

    const openReply = (confessionId: number, parentCommentId: number, parentUser: string) => {
        setActiveCommentId(null);
        setActiveReply(prev => prev?.parentCommentId === parentCommentId ? null : { confessionId, parentCommentId, parentUser });
    };

    return (
        <div>
            {/* Hidden container for rendering the image template */}
            {sharingId && (
                <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none z-[-1]">
                    <div id="story-template-container">
                        <StoryTemplate
                            confession={items.find(i => i.id === sharingId)}
                            typeConfig={TYPE_CONFIG[items.find(i => i.id === sharingId)?.type || 'other']}
                        />
                    </div>
                </div>
            )}

            {/* ─── Sort bar ─── */}
            <div className="flex gap-1.5 mb-6 p-1.5 bg-white/[0.04] border border-white/[0.08] rounded-2xl">
                {SORT_CONFIG.map(({ key, label, icon: Icon, active }) => (
                    <button
                        key={key}
                        onClick={() => setSortBy(key)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-sm font-bold transition-all duration-200 ${sortBy === key ? active : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>

            {/* ─── Empty state ─── */}
            {items.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/20 flex items-center justify-center text-3xl">
                        🤫
                    </div>
                    <div>
                        <p className="text-slate-300 font-semibold mb-1">Frekans sessiz.</p>
                        <p className="text-slate-600 text-sm mb-4">İlk itirafı atmak sana kalıyor.</p>
                        {onOpenModal && (
                            <button onClick={onOpenModal} className="text-sm font-bold text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors">
                                Anonim itiraf et →
                            </button>
                        )}
                    </div>
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
                                className={`group relative border rounded-2xl overflow-hidden transition-all duration-200 ${cfg.cardBg} ${cfg.cardBorder}`}
                            >
                                {/* Top accent gradient line */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cfg.cardAccent} opacity-60`} />

                                <div className="p-5 pt-4">
                                    {/* Header */}
                                    <div className="flex items-start gap-3 mb-3">
                                        {/* Colorful avatar */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${cfg.avatarGradient} shadow-lg text-white text-sm font-black`}>
                                            {item.authorAvatar || item.user.charAt(0).toUpperCase()}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-bold text-white truncate">{item.user}</span>
                                                <span className="text-xs text-slate-600">·</span>
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {new Date(item.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${cfg.badgeCls}`}>
                                                    {cfg.emoji} {cfg.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Hot badge */}
                                        {netScore > 5 && (
                                            <div className="flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                <Sparkles className="w-2.5 h-2.5" />
                                                TREND
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <p className="text-slate-100 leading-[1.75] text-[15px] whitespace-pre-line mb-3 pl-[52px]">
                                        {item.text}
                                    </p>

                                    {/* Tags */}
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-3 pl-[52px]">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action bar */}
                                    <div className="flex items-center justify-between pl-[52px]">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => voteConfession(item.id, 'up')}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${voted === 'up'
                                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                                                    : 'text-slate-500 hover:bg-emerald-500/15 hover:text-emerald-400'
                                                    }`}
                                            >
                                                <PlaneTakeoff className="w-3.5 h-3.5" /> {item.likes}
                                            </button>
                                            <button
                                                onClick={() => voteConfession(item.id, 'down')}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${voted === 'down'
                                                    ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                                                    : 'text-slate-500 hover:bg-red-500/15 hover:text-red-400'
                                                    }`}
                                            >
                                                <PlaneLanding className="w-3.5 h-3.5" /> {item.dislikes || 0}
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => {
                                                    const t = `THKÜ İtiraf: ${item.text}\n\n${window.location.href}`;
                                                    if (navigator.share) navigator.share({ title: 'THKÜ İtiraf', text: t, url: window.location.href });
                                                    else navigator.clipboard.writeText(t);
                                                }}
                                                className="p-2 rounded-xl text-slate-600 hover:text-sky-400 hover:bg-sky-500/10 transition-all"
                                                title="Bağlantıyı Paylaş"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleShareStory(item, cfg)}
                                                disabled={isGenerating && sharingId === item.id}
                                                className="p-2 rounded-xl text-slate-600 hover:text-pink-400 hover:bg-pink-500/10 transition-all disabled:opacity-50"
                                                title="Story Olarak Paylaş (Görsel İndir)"
                                            >
                                                <Instagram className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setActiveReply(null);
                                                    setActiveCommentId(prev => prev === item.id ? null : item.id);
                                                }}
                                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${isCommentOpen
                                                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                                                    : 'text-slate-500 hover:bg-sky-500/15 hover:text-sky-400'
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
                                            key="form"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden border-t border-white/8"
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

                                {/* Comments */}
                                {commentCount > 0 && (
                                    <div className="border-t border-white/[0.06] px-5 pb-4">
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
                            </motion.article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
