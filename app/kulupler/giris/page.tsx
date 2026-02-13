'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CLUBS_DATA } from '../clubsData';

export default function ClubLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API check
        await new Promise(resolve => setTimeout(resolve, 1000));

        const club = CLUBS_DATA.find(c => c.slug === username.toLowerCase());

        if (club && password === '1234') { // Simple mock auth
            router.push(`/kulupler/${club.slug}/yonetim`);
        } else {
            setError('Kullanıcı adı veya şifre hatalı. (Demo: robotics / 1234)');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Link href="/kulupler" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Kulüplere Dön
                </Link>

                <div className="glass-dark border border-slate-700/50 rounded-3xl p-8 shadow-2xl backdrop-blur-xl bg-slate-900/50">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg shadow-red-500/20">
                            🔐
                        </div>
                        <h1 className="text-2xl font-black text-white mb-2">Kulüp Yönetici Girişi</h1>
                        <p className="text-slate-400 text-sm">Kulüp yönetim paneline erişmek için giriş yapın</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl text-center font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Kullanıcı Adı</label>
                            <div className="relative">
                                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="örn: robotics"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Şifre</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-600 focus:border-red-500 focus:outline-none transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black py-4 rounded-xl shadow-lg shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            Şifrenizi mi unuttunuz? <a href="#" className="text-red-400 hover:text-red-300 transition-colors">Yönetimle iletişime geçin</a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
