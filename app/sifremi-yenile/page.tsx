'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, CheckCircle, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Geçersiz bağlantı.');
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setStatus('loading');
        setMessage('');

        if (formData.password !== formData.confirmPassword) {
            setStatus('error');
            setMessage('Şifreler eşleşmiyor.');
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/giris');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Bağlantı hatası.');
        }
    };

    if (!token) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Geçersiz Bağlantı</h2>
                <p className="text-slate-600 mb-6">Şifre sıfırlama bağlantısı geçersiz veya eksik.</p>
                <Link href="/giris" className="text-blue-600 font-bold hover:underline">Giriş sayfasına dön</Link>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">

            {status === 'success' ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                >
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-green-200 shadow-lg">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Şifreniz Yenilendi!</h2>
                    <p className="text-slate-600 mb-6">Artık yeni şifrenizle giriş yapabilirsiniz.</p>
                    <p className="text-sm text-slate-400">Yönlendiriliyorsunuz...</p>
                </motion.div>
            ) : (
                <>
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white mb-4 -rotate-3 shadow-lg shadow-blue-200">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">Yeni Şifre</h1>
                        <p className="text-slate-500 text-sm mt-2">Lütfen hesabınız için yeni bir şifre belirleyin.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center flex items-center justify-center gap-2">
                                <X className="w-4 h-4" /> {message}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Yeni Şifre</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={status === 'loading'}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Yeni Şifre (Tekrar)</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={status === 'loading'}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Yükleniyor...</p>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
