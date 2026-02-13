'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    confessionId: number;
    confessionText: string;
    replyToComment?: { id: number; user: string } | null;
}

export default function CommentModal({ isOpen, onClose, confessionId, confessionText, replyToComment }: CommentModalProps) {
    const { addComment } = useStore();
    const [text, setText] = useState('');
    const [user, setUser] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const initializedRef = useRef(false);

    // Auto-fill @mention when replying - only once when modal opens
    useEffect(() => {
        if (isOpen && !initializedRef.current) {
            if (replyToComment) {
                setText(`@${replyToComment.user} `);
            }
            initializedRef.current = true;
        } else if (!isOpen) {
            initializedRef.current = false;
        }
    }, [isOpen, replyToComment?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || !user) return;

        addComment(confessionId, text, user, replyToComment?.id);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setText('');
            setUser('');
            onClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relativew-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-10 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-sky-900/30 to-blue-900/30 p-6 border-b border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-6 h-6 text-sky-400" />
                                    <h2 className="text-2xl font-bold text-white">
                                        {replyToComment ? `@${replyToComment.user} yanıtla` : 'Telsize Gir'}
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-slate-400 mt-2 text-sm font-mono italic">
                                "{confessionText.slice(0, 100)}{confessionText.length > 100 ? '...' : ''}"
                            </p>
                        </div>

                        {submitted ? (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-20 text-center"
                            >
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Send className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Yorumunuz Alındı!</h3>
                                <p className="text-slate-400">Admin onayından sonra görünecektir.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* User Field */}
                                <div>
                                    <label className="block text-slate-300 mb-2 font-bold text-sm tracking-wide">
                                        ÇAĞRI İŞARETİ (Takma Ad)
                                    </label>
                                    <input
                                        type="text"
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}
                                        placeholder="Örn: TR-Pilot"
                                        maxLength={30}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                                        required
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-slate-300 mb-2 font-bold text-sm tracking-wide">
                                        YORUM
                                    </label>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Yorumunuzu buraya yazın..."
                                        rows={6}
                                        maxLength={500}
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                                        required
                                    />
                                    <div className="text-right text-slate-500 text-xs mt-1 font-mono">
                                        {text.length}/500
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!text || !user}
                                    className="w-full bg-gradient-to-r from-sky-600 to-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:from-sky-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-900/20"
                                >
                                    <Send className="w-5 h-5" />
                                    YORUM GÖNDER
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
