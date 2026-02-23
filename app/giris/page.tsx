'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Lock, User, GraduationCap } from 'lucide-react';
import Link from 'next/link';

// import { TurnstileWidget } from '@/components/TurnstileWidget';

export default function GirisYap() {
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        turnstileToken: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = await login(formData.username, formData.password, formData.turnstileToken);

        if (result.success) {
            router.push('/kulupler');
        } else {
            setError(result.message || 'Giriş yapılamadı.');
        }
        setLoading(false);
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
                                name="username"
                                autoComplete="username"
                                value={formData.username}
                                onChange={handleInputChange}
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
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center text-sm text-slate-600 cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                            Beni hatırla
                        </label>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Şifremi unuttum?
                        </a>
                    </div>

                    {/* <TurnstileWidget
                        onVerify={(token) => setFormData({ ...formData, turnstileToken: token })}
                    /> */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
