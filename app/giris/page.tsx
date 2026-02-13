'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plane, Lock, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = await login(identifier, password);

        if (success) {
            router.push('/kulupler');
        } else {
            setError('Giriş bilgileri hatalı veya kullanıcı bulunamadı.');
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white mb-4 rotate-3 shadow-lg shadow-red-200">
                        <GraduationCap className="w-8 h-8 -rotate-12" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Giriş Yap</h1>
                    <p className="text-slate-500 text-sm mt-2">Öğrenci veya Yönetici Girişi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Öğrenci No / E-posta</label>
                        <div className="relative">
                            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="identifier"
                                autoComplete="username"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                placeholder="Örn: 2023... veya mail@thku.edu.tr"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Şifre</label>
                        <div className="relative">
                            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link
                            href="/sifremi-unuttum"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Şifremi Unuttum?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-950 text-white py-3.5 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-blue-900/20 pt-3"
                    >
                        Giriş Yap
                    </button>

                    <div className="pt-4 text-center border-t border-slate-100 mt-4">
                        <p className="text-slate-500 text-sm mb-2">Hesabın yok mu?</p>
                        <Link href="/kayit" className="text-red-600 font-bold hover:text-red-700 transition-colors">
                            Hemen Kayıt Ol
                        </Link>
                    </div>

                    <div className="text-center">
                        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
