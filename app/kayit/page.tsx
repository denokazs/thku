'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Phone, Hash, GraduationCap, X } from 'lucide-react'; // GraduationCap added
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        department: '', // Added, though not in API yet, good to have or we can assume strictly what user asked
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor!');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Şifre en az 8 karakter olmalıdır!');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/giris');
                }, 2000);
            } else {
                setError(data.error || 'Kayıt başarısız.');
            }
        } catch (err) {
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 relative overflow-hidden">

                {/* Success Overlay */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
                        >
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-200">
                                <GraduationCap className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800 mb-2">Kayıt Başarılı!</h2>
                            <p className="text-slate-500">Giriş sayfasına yönlendiriliyorsunuz...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white mb-4 -rotate-3 shadow-lg shadow-red-200">
                        <User className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Öğrenci Kaydı</h1>
                    <p className="text-slate-500 text-sm mt-2">THK Üniversitesi Topluluk Sistemine Katıl</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center flex items-center justify-center gap-2">
                            <X className="w-4 h-4" /> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Ad Soyad</label>
                            <div className="relative">
                                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Öğrenci Numarası</label>
                            <div className="relative">
                                <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="studentId"
                                    type="text"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 ml-1">Bölümünüz</label>
                        <div className="relative">
                            <GraduationCap className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                name="department"
                                type="text"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                placeholder="Örn: Bilgisayar Mühendisliği"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">E-posta</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Telefon</label>
                            <div className="relative">
                                <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Şifre</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700 ml-1">Şifre Tekrar</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-950 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-blue-900/20 pt-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
                    </button>

                    <div className="pt-4 text-center border-t border-slate-100 mt-4">
                        <p className="text-slate-500 text-sm mb-2">Zaten hesabın var mı?</p>
                        <Link href="/giris" className="text-red-600 font-bold hover:text-red-700 transition-colors">
                            Giriş Yap
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
