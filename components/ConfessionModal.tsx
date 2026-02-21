'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertTriangle, Heart, HelpCircle, MessageCircle, Dna, Hash } from 'lucide-react';
import { useStore, Confession } from '@/context/StoreContext';
import { generateAnonymousIdentity, CONFESSION_TAGS } from '@/lib/anonymousUtils';

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

    // New Features State
    const [useRandomIdentity, setUseRandomIdentity] = useState(false);
    const [randomIdentity, setRandomIdentity] = useState<{ codeName: string, avatar: string } | null>(null);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && !randomIdentity) {
            setRandomIdentity(generateAnonymousIdentity());
        }
    }, [isOpen]);

    const handleGenerateNewIdentity = () => {
        setRandomIdentity(generateAnonymousIdentity());
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            if (selectedTags.length < 3) {
                setSelectedTags([...selectedTags, tag]);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let finalUser = user;
        let finalAvatar = undefined;

        if (useRandomIdentity && randomIdentity) {
            finalUser = randomIdentity.codeName;
            finalAvatar = randomIdentity.avatar;
        }

        if (!text || !finalUser) return;

        addConfession(text, finalUser, type, {
            tags: selectedTags,
            authorAvatar: finalAvatar,
            authorCodeName: useRandomIdentity ? finalUser : undefined
        });

        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setText('');
            setUser('');
            setSelectedTags([]);
            setUseRandomIdentity(false);
            setRandomIdentity(generateAnonymousIdentity()); // reset for next time
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
                        className="relative bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
                    >
                        {/* Background Decorations */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

                        {!submitted ? (
                            <>
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Send className="w-5 h-5 text-red-500" /> İtiraf Gönder
                                    </h2>
                                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    {/* Kimlik Seçimi */}
                                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="block text-sm font-bold text-slate-300">Kimlik</label>
                                            <button
                                                type="button"
                                                onClick={() => setUseRandomIdentity(!useRandomIdentity)}
                                                className={`text-xs px-3 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 ${useRandomIdentity ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                                            >
                                                <Dna className="w-3.5 h-3.5" />
                                                {useRandomIdentity ? 'Rastgele Avatar Devrede' : 'Rastgele Avatar Kullan'}
                                            </button>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            {useRandomIdentity && randomIdentity ? (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-indigo-500/20"
                                                >
                                                    <div className="w-12 h-12 flex items-center justify-center bg-indigo-500/20 rounded-full text-2xl border border-indigo-500/30">
                                                        {randomIdentity.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-0.5">Gizli Kimliğin</p>
                                                        <p className="text-white font-bold">{randomIdentity.codeName}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateNewIdentity}
                                                        className="text-xs text-slate-400 hover:text-white p-2"
                                                        title="Yeni Karakter Üret"
                                                    >
                                                        Değiştir
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="Rumuz / Callsign (Örn: THK_Kaptanı)"
                                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                        value={user}
                                                        onChange={(e) => setUser(e.target.value)}
                                                        required={!useRandomIdentity}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Kategori Seçimi */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Türü Nedir?</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {types.map((t) => (
                                                <button
                                                    key={t.value}
                                                    type="button"
                                                    onClick={() => setType(t.value)}
                                                    className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${type === t.value
                                                        ? 'bg-slate-800 border-red-500 text-white shadow-lg shadow-red-900/20'
                                                        : 'bg-slate-800/50 border-transparent text-slate-400 hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-full text-white ${t.color}`}>
                                                        <t.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium">{t.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Etiket Seçimi */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center justify-between">
                                            <span>Etiketler <span className="text-xs font-normal text-slate-500">(En fazla 3)</span></span>
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {CONFESSION_TAGS.map(tag => {
                                                const isSelected = selectedTags.includes(tag);
                                                const isDisabled = !isSelected && selectedTags.length >= 3;
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        disabled={isDisabled}
                                                        onClick={() => toggleTag(tag)}
                                                        className={`text-xs px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${isSelected
                                                                ? 'bg-red-500/20 border-red-500/50 text-red-400'
                                                                : isDisabled
                                                                    ? 'bg-slate-800/30 border-slate-800/50 text-slate-600 cursor-not-allowed'
                                                                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                            }`}
                                                    >
                                                        <Hash className="w-3 h-3" />
                                                        {tag}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Mesaj */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-300 mb-2">Mesajın</label>
                                        <textarea
                                            placeholder="İçini dök... Kimse senin kim olduğunu bilmeyecek."
                                            rows={4}
                                            className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 text-white focus:border-red-500 outline-none transition-colors resize-none placeholder-slate-600"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Bildiri */}
                                    <div className="bg-orange-900/10 border border-orange-900/30 p-4 rounded-xl flex gap-3 text-xs text-orange-200/80 leading-relaxed">
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-orange-500/80" />
                                        <p>Gönderilen itiraflar moderatör onayından geçtikten sonra yayınlanır. Lütfen kurallara, saygıya ve genel ahlaka uygun davrandığınızdan emin olun.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 active:scale-95"
                                    >
                                        <Send className="w-5 h-5" />
                                        Gönder Gelsin
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="py-16 text-center relative z-10 flex flex-col items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20"
                                >
                                    <Send className="w-10 h-10 ml-2" />
                                </motion.div>
                                <h3 className="text-3xl font-bold text-white mb-3">Gönderildi!</h3>
                                <p className="text-slate-400 text-lg">Mesajın radarımıza takıldı. Onaylandıktan sonra yayına alınacak.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
