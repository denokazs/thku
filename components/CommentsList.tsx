'use client';

import { useState } from 'react';
import { MessageSquare, User, Heart, ChevronDown, CornerDownRight } from 'lucide-react';
import { useStore, Comment } from '@/context/StoreContext';

const PREVIEW_COUNT = 3;

interface CommentsListProps {
    confessionId: number;
    confessionUser?: string;
    activeReplyId?: number | null;
    onReply?: (comment: Comment) => void;
    renderReplyForm?: (comment: Comment) => React.ReactNode;
}

export default function CommentsList({ confessionId, confessionUser, activeReplyId, onReply, renderReplyForm }: CommentsListProps) {
    const { getComments, getReplies, toggleCommentLike, commentLikes } = useStore();
    const allComments = getComments(confessionId);
    const [showAll, setShowAll] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

    if (allComments.length === 0) return null;

    const visibleComments = showAll ? allComments : allComments.slice(0, PREVIEW_COUNT);
    const hiddenCount = allComments.length - PREVIEW_COUNT;

    const formatTime = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1) return 'şimdi';
        if (m < 60) return `${m}d`;
        if (h < 24) return `${h}s`;
        return `${d}g`;
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
        const replies = getReplies(comment.id);
        const isLiked = commentLikes[comment.id];
        const isOP = comment.isOP || (confessionUser && comment.user === confessionUser);
        const isActiveReply = activeReplyId === comment.id;

        return (
            <div className={isReply ? 'ml-9' : ''}>
                <div className="flex gap-2.5">
                    {/* Small avatar */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${isOP ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-sky-500 to-blue-600'}`}>
                        {comment.user.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                        {/* Bubble */}
                        <div className={`inline-block max-w-full px-3.5 py-2 rounded-2xl rounded-tl-sm text-sm ${isOP ? 'bg-red-500/15 border border-red-500/20' : 'bg-slate-800/70 border border-slate-700/40'}`}>
                            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                <span className={`font-bold text-xs ${isOP ? 'text-red-400' : 'text-sky-400'}`}>{comment.user}</span>
                                {isOP && (
                                    <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-red-500/20 text-red-400">👑 OP</span>
                                )}
                                {isReply && (
                                    <span className="text-[9px] text-slate-600"><CornerDownRight className="w-2.5 h-2.5 inline" /></span>
                                )}
                            </div>
                            <p className="text-slate-200 leading-relaxed break-words">{comment.text}</p>
                        </div>

                        {/* Meta actions */}
                        <div className="flex items-center gap-3 mt-1.5 px-1">
                            <span className="text-slate-600 text-[11px] font-mono">{formatTime(comment.timestamp)}</span>
                            <button
                                onClick={() => toggleCommentLike(comment.id)}
                                className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${isLiked ? 'text-red-400' : 'text-slate-500 hover:text-red-400'}`}
                            >
                                <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                                {comment.likes > 0 && comment.likes}
                            </button>
                            <button
                                onClick={() => onReply?.(comment)}
                                className={`text-[11px] font-bold transition-colors ${isActiveReply ? 'text-sky-400' : 'text-slate-500 hover:text-sky-400'}`}
                            >
                                {isActiveReply ? 'kapat' : 'cevapla'}
                            </button>
                            {replies.length > 0 && (
                                <button
                                    onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
                                    className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors"
                                >
                                    {expandedReplies[comment.id] ? '▲ gizle' : `▼ ${replies.length} cevap`}
                                </button>
                            )}
                        </div>

                        {/* Inline reply form */}
                        {renderReplyForm?.(comment)}

                        {/* Nested replies */}
                        {expandedReplies[comment.id] && replies.length > 0 && (
                            <div className="mt-2 space-y-3">
                                {replies.map(reply => (
                                    <CommentItem key={reply.id} comment={reply} isReply />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mt-4 space-y-3 border-t border-slate-700/40 pt-4">
            {visibleComments.map(comment => (
                <CommentItem key={comment.id} comment={comment} />
            ))}

            {/* Instagram-style "view more" */}
            {!showAll && hiddenCount > 0 && (
                <button
                    onClick={() => setShowAll(true)}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-sky-400 text-xs font-bold transition-colors pl-9"
                >
                    <ChevronDown className="w-3.5 h-3.5" />
                    {hiddenCount} yorumu daha gör
                </button>
            )}

            {showAll && allComments.length > PREVIEW_COUNT && (
                <button onClick={() => setShowAll(false)} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-400 text-xs transition-colors pl-9">
                    ▲ daralt
                </button>
            )}
        </div>
    );
}
