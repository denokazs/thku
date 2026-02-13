'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertTriangle, Heart, HelpCircle, MessageCircle } from 'lucide-react';
import { useStore, Confession } from '@/context/StoreContext';

interface ConfessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConfessionModal({ isOpen, onClose }: ConfessionModalProps) {
    const { addConfession } = useStore();
    const [text, setText] = useState('');
    const [user, setUser] = useState('');
    const [type, setType] = useState<Confession['type']>('other');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text || !user) return;

        addConfession(text, user, type);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setText('');
            setUser('');
            onClose();
        }, 2000);
    };

    const types: { value: Confession['type']; label: string; icon: any; color: string }[] = [
        { value: 'complaint', label: 'Şikayet', icon: AlertTriangle, color: 'bg-red-500' },
        { value: 'romance', label: 'İtiraf/Aşk', icon: Heart, color: 'bg-pink-500' },
        { value: 'question', label: 'Soru', icon: HelpCircle, color: 'bg-blue-500' },
        { value: 'other', label: 'Diğer', icon: MessageCircle, color: 'bg-slate-500' },
    ];

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
                        className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Background Decorations */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl"></div>

                        {!submitted ? (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-xl font-bold text-white">İtiraf Gönder</h2>
                                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Rumuz / Callsign</label>
                                        <input
                                            type="text"
                                            placeholder="Örn: Anonim_Pilot"
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                            value={user}
                                            onChange={(e) => setUser(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Kategori</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {types.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    onClick={() => setType(t.value)}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${type === t.value
                                                        ? 'bg-slate-800 border-red-500 text-white'
                                                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className={`p-1 rounded-full text-white text-xs ${t.color}`}>
                                                        <t.icon className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-sm font-medium">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Mesajın</label>
                                        <textarea
                                            placeholder="İçini dök..."
                                            rows={4}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors resize-none"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="bg-orange-900/20 border border-orange-900/50 p-3 rounded-lg flex gap-3 text-xs text-orange-200">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        <p>Gönderilen itiraflar moderatör onayından geçtikten sonra yayınlanır. Lütfen kurallara uyun.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                                    >
                                        <Send className="w-4 h-4" />
                                        kuleye Gönder
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="py-12 text-center relative z-10">
                                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Gönderildi!</h3>
                                <p className="text-slate-400">Mesajın kuleye ulaştı. Onaylandıktan sonra yayına alınacak.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
