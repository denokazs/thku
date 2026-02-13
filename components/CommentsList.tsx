'use client';

import { useState } from 'react';
import { MessageSquare, User, Heart, CornerDownRight } from 'lucide-react';
import { useStore, Comment } from '@/context/StoreContext';

interface CommentsListProps {
    confessionId: number;
    onReply?: (comment: Comment) => void;
}

export default function CommentsList({ confessionId, onReply }: CommentsListProps) {
    const { getComments, getReplies, toggleCommentLike, commentLikes } = useStore();
    const comments = getComments(confessionId);
    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});

    if (comments.length === 0) {
        return null;
    }

    const toggleReplies = (commentId: number) => {
        setExpandedReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    };

    const formatTime = (timestamp: number) => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'şimdi';
        if (minutes < 60) return `${minutes}d`;
        if (hours < 24) return `${hours}s`;
        return `${days}g`;
    };

    const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
        const replies = getReplies(comment.id);
        const isLiked = commentLikes[comment.id];

        return (
            <div className={`${isReply ? 'ml-10' : ''}`}>
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-4 py-2.5">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sky-400 font-bold text-sm">{comment.user}</span>
                                <span className="text-slate-600 text-xs">•</span>
                                <span className="text-slate-500 text-xs font-mono">
                                    {formatTime(comment.timestamp)}
                                </span>
                            </div>
                            <p className="text-slate-200 text-sm leading-relaxed break-words">
                                {comment.text}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-2 px-2">
                            <button
                                onClick={() => toggleCommentLike(comment.id)}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'
                                    }`}
                            >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>

                            <button
                                onClick={() => onReply?.(comment)}
                                className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                            >
                                Cevapla
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
