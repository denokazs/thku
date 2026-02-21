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

    useEffect(() => {
        setRandomId(generateAnonymousIdentity());
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalUser = useRandom && randomId ? randomId.codeName : user;
        const finalAvatar = useRandom && randomId ? randomId.avatar : undefined;
        if (!text.trim() || !finalUser) return;

        const isOP = finalUser === confessionUser;
        addComment(confessionId, text, finalUser, parentCommentId, isOP);
        setSent(true);

        setTimeout(() => {
            onSubmitted?.();
            onCancel();
        }, 1200);
    };

    if (sent) {
        return (
            <div className="mt-3 ml-4 flex items-center gap-2 text-sm text-green-500 font-bold py-2">
                <Send className="w-4 h-4" /> Yorumunuz onay bekliyor...
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-3 ml-4 bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 space-y-3"
        >
            {/* Identity row */}
            <div className="flex items-center gap-2">
                {useRandom && randomId ? (
                    <div className="flex items-center gap-2 flex-1 bg-slate-800 border border-indigo-500/30 rounded-lg px-3 py-2">
                        <span className="text-lg">{randomId.avatar}</span>
                        <span className="text-white text-sm font-bold flex-1">{randomId.codeName}</span>
                        <button type="button" onClick={() => setRandomId(generateAnonymousIdentity())} className="text-xs text-slate-500 hover:text-white">Değiştir</button>
                    </div>
                ) : (
                    <input
                        type="text"
                        placeholder="Rumuzun"
                        className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500 outline-none"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        required={!useRandom}
                        autoFocus
                    />
                )}
                <button
                    type="button"
                    title="Rastgele kimlik kullan"
                    onClick={() => setUseRandom(!useRandom)}
                    className={`p-2 rounded-lg transition-all flex-shrink-0 ${useRandom ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                >
                    <Dna className="w-4 h-4" />
                </button>
            </div>

            {/* Text area */}
            <textarea
                placeholder={parentUser ? `@${parentUser} kişisine yanıt yaz...` : 'Yorumunu yaz...'}
                rows={2}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-sky-500 outline-none resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
            />

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
                <button type="button" onClick={onCancel} className="text-xs text-slate-500 hover:text-white flex items-center gap-1 px-2 py-1">
                    <X className="w-3 h-3" /> Vazgeç
                </button>
                <button
                    type="submit"
                    disabled={!text.trim() || (!useRandom && !user)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition-all"
                >
                    <Send className="w-3 h-3" /> Gönder
                </button>
            </div>

            <p className="text-[10px] text-slate-600 leading-relaxed">
                Yorumlar moderatör onayından sonra yayınlanır.
            </p>
        </form>
    );
}
