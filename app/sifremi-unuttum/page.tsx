'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Bağlantı hatası. Lütfen tekrar deneyin.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 relative overflow-hidden">

                <Link href="/giris" className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                <div className="flex flex-col items-center mb-8 pt-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Şifremi Unuttum</h1>
                    <p className="text-slate-500 text-sm mt-2 text-center px-4">
                        Hesabınıza kayıtlı e-posta adresinizi girin, size sıfırlama bağlantısı gönderelim.
                    </p>
                </div>

                {status === 'success' ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6"
                    >
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">E-posta Gönderildi!</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Lütfen gelen kutunuzu (ve spam klasörünü) kontrol edin.
                        </p>
                        <Link href="/giris" className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                            Giriş Ekranına Dön
                        </Link>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center">
                                {message}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">E-posta Adresi</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
                                    placeholder="ornek@thk.edu.tr"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? (
                                'Gönderiliyor...'
                            ) : (
                                <>
                                    <Send className="w-4 h-4" /> Bağlantı Gönder
                                </>
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
