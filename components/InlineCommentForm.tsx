'use client';

import { useState, useEffect } from 'react';
import { Send, X, Dna } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { generateAnonymousIdentity } from '@/lib/anonymousUtils';

interface InlineCommentFormProps {
    confessionId: number;
    confessionUser: string;
    parentCommentId?: number;
    parentUser?: string;
    onCancel: () => void;
    onSubmitted?: () => void;
}

export default function InlineCommentForm({
    confessionId,
    confessionUser,
    parentCommentId,
    parentUser,
    onCancel,
    onSubmitted
}: InlineCommentFormProps) {
    const { addComment } = useStore();
    const [text, setText] = useState(parentUser ? `@${parentUser} ` : '');
    const [user, setUser] = useState('');
    const [useRandom, setUseRandom] = useState(false);
    const [randomId, setRandomId] = useState<{ codeName: string; avatar: string } | null>(null);
    const [sent, setSent] = useState(false);

    useEffect(() => { setRandomId(generateAnonymousIdentity()); }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalUser = useRandom && randomId ? randomId.codeName : user;
        if (!text.trim() || !finalUser) return;
        addComment(confessionId, text, finalUser, parentCommentId, finalUser === confessionUser);
        setSent(true);
        setTimeout(() => { onSubmitted?.(); onCancel(); }, 1200);
    };

    if (sent) {
        return (
            <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold py-2 px-1">
                <Send className="w-3.5 h-3.5" /> Gönderildi, onay bekleniyor...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-2.5 pt-3">
            {/* Identity */}
            <div className="flex items-center gap-2">
                {useRandom && randomId ? (
                    <div className="flex items-center gap-2 flex-1 bg-white/5 border border-indigo-500/25 rounded-xl px-3 py-2">
                        <span className="text-base">{randomId.avatar}</span>
                        <span className="text-sm font-bold text-white flex-1 truncate">{randomId.codeName}</span>
                        <button type="button" onClick={() => setRandomId(generateAnonymousIdentity())} className="text-[11px] text-slate-500 hover:text-slate-300 font-medium transition-colors">
                            değiştir
                        </button>
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder="Rumuzun..."
                        autoFocus
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500/50 outline-none transition-colors"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required={!useRandom}
                    />
                )}
                <button
                    type="button"
                    title={useRandom ? 'Normal kimlik' : 'Rastgele kimlik'}
                    onClick={() => setUseRandom(!useRandom)}
                    className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${useRandom ? 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30' : 'bg-white/5 text-slate-500 hover:text-white border border-white/8'}`}
                >
                    <Dna className="w-4 h-4" />
                </button>
            </div>

            {/* Textarea */}
            <textarea
                placeholder={parentUser ? `@${parentUser} 'e yanıt yaz...` : 'Ne düşünüyorsun?'}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500/50 outline-none resize-none transition-colors"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />

            {/* Actions */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-700">Moderatör onayından sonra yayınlanır.</p>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={onCancel} className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg">
                        <X className="w-3 h-3" />
                    </button>
                    <button
                        type="submit"
                        disabled={!text.trim() || (!useRandom && !user)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-slate-600 text-white text-xs font-bold rounded-xl transition-all"
                    >
                        <Send className="w-3 h-3" /> Gönder
                    </button>
                </div>
            </div>
        </form>
    );
}
