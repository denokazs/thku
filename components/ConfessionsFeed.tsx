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
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [selectedConfession, setSelectedConfession] = useState<{ id: number; text: string } | null>(null);
    const [replyToComment, setReplyToComment] = useState<{ id: number; user: string } | null>(null);

    // Filter items based on active tab
    const items = confessions.filter(c => c.status === activeTab);

    const handleVote = (id: number, type: 'up' | 'down') => {
        voteConfession(id, type);
    };

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-4">
                <button
                    onClick={() => setActiveTab('approved')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'approved'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/20'
                        : 'text-slate-500 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <CheckCircle2 className="w-4 h-4" />
                    Radar (Onaylı)
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'pending'
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/20'
                        : 'text-slate-500 hover:text-white hover:bg-slate-800'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Bekleme Hattı ({confessions.filter(c => c.status === 'pending').length})
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-500">
                        {activeTab === 'approved'
                            ? 'Henüz onaylanmış itiraf bulunmamaktadır.'
                            : 'Bekleyen itiraf yok. Temiz hava sahası!'}
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
                            className="break-inside-avoid relative glass-dark rounded-xl p-6 hover:border-red-500/30 transition-all duration-300 group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs 
                                ${item.type === 'complaint' ? 'bg-red-900/50 text-red-200' :
                                            item.type === 'romance' ? 'bg-pink-900/50 text-pink-200' :
                                                'bg-blue-900/50 text-blue-200'}`}>
                                        {item.user.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-bold text-sm tracking-wide">{item.user}</h4>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
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

                            <p className="text-slate-300 mb-6 leading-relaxed font-light">
                                {item.text}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleVote(item.id, "up")}
                                        disabled={activeTab === "pending"} // Disable voting on pending
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${activeTab === "pending"
                                            ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                                            : myVotes[item.id] === "up"
                                                ? "bg-green-600 text-white shadow-lg shadow-green-900/40 hover:bg-green-700"
                                                : "bg-slate-800/50 text-slate-400 hover:text-green-400 hover:bg-slate-800"
                                            }`}
                                    >
                                        <PlaneTakeoff className={`w-3.5 h-3.5 ${myVotes[item.id] === "up" ? "animate-pulse" : ""}`} />
                                        <span>{item.likes}</span>
                                    </button>
                                    <button
                                        onClick={() => handleVote(item.id, "down")}
                                        disabled={activeTab === "pending"}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${activeTab === "pending"
                                            ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                                            : myVotes[item.id] === "down"
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
                                            if (activeTab === "approved") {
                                                setSelectedConfession({ id: item.id, text: item.text });
                                                setCommentModalOpen(true);
                                            }
                                        }}
                                        disabled={activeTab === "pending"}
                                        className={`flex items-center gap-2 text-xs font-bold transition-colors ${activeTab === "pending"
                                            ? "text-slate-600 cursor-not-allowed"
                                            : "text-slate-400 hover:text-white cursor-pointer"
                                            }`}
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        {activeTab === "pending" ? "Onay Bekliyor" : `Telsize Gir${getComments(item.id).length > 0 ? ` (${getComments(item.id).length})` : ""}`}
                                    </button>
                                </div>
                            </div>

                            {/* Comments List */}
                            <CommentsList
                                confessionId={item.id}
                                onReply={(comment) => {
                                    setSelectedConfession({ id: item.id, text: item.text });
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
                    replyToComment={replyToComment}
                />
            )}
        </div>
    );
}
