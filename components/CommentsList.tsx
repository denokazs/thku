'use client';

import { useState } from 'react';
import { MessageSquare, User, Heart, CornerDownRight } from 'lucide-react';
import { useStore, Comment } from '@/context/StoreContext';

interface CommentsListProps {
    confessionId: number;
    confessionUser?: string;
    activeReplyId?: number | null;
    onReply?: (comment: Comment) => void;
    renderReplyForm?: (comment: Comment) => React.ReactNode;
}

export default function CommentsList({ confessionId, confessionUser, activeReplyId, onReply, renderReplyForm }: CommentsListProps) {
    const { getComments, getReplies, toggleCommentLike, commentLikes } = useStore();
    const comments = getComments(confessionId);
    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

    if (comments.length === 0) return null;

    const toggleReplies = (commentId: number) =>
        setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));

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
            <div className={`${isReply ? 'ml-10' : ''}`}>
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className={`border rounded-2xl px-4 py-2.5 ${isOP ? 'bg-red-900/10 border-red-500/30' : 'bg-slate-800/40 border-slate-700/50'}`}>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`font-bold text-sm ${isOP ? 'text-red-400' : 'text-sky-400'}`}>
                                    {comment.user}
                                </span>
                                {isOP && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                                        👑 İtiraf Sahibi
                                    </span>
                                )}
                                <span className="text-slate-600 text-xs">•</span>
                                <span className="text-slate-500 text-xs font-mono">{formatTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-slate-200 text-sm leading-relaxed break-words">{comment.text}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-2 px-2">
                            <button
                                onClick={() => toggleCommentLike(comment.id)}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'}`}
                            >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>

                            <button
                                onClick={() => onReply?.(comment)}
                                className={`text-xs font-bold transition-colors ${isActiveReply ? 'text-sky-400' : 'text-slate-500 hover:text-white'}`}
                            >
                                {isActiveReply ? 'Kapat' : 'Cevapla'}
                            </button>

                            {replies.length > 0 && (
                                <button
                                    onClick={() => toggleReplies(comment.id)}
                                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-sky-400 transition-colors"
                                >
                                    <CornerDownRight className="w-3 h-3" />
                                    {expandedReplies[comment.id] ? 'Gizle' : `${replies.length} cevap`}
                                </button>
                            )}
                        </div>

                        {/* Inline reply form rendered here */}
                        {renderReplyForm?.(comment)}

                        {/* Nested Replies */}
                        {expandedReplies[comment.id] && replies.length > 0 && (
                            <div className="mt-3 space-y-3">
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
        <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length} Yorum</span>
            </div>
            <div className="space-y-4">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </div>
        </div>
    );
}
