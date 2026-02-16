'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, Phone, Hash, GraduationCap, Building2, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { TurnstileWidget } from '@/components/TurnstileWidget';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        studentId: '',
        department: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        turnstileToken: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const departments = [
        "Bilgisayar Mühendisliği",
        "Elektronik ve Haberleşme Mühendisliği",
        "Makine Mühendisliği",
        "Havacılık ve Uzay Mühendisliği",
        "Endüstri Mühendisliği",
        "İşletme",
        "Pilotaj",
        "Diğer"
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTurnstileVerify = (token: string) => {
        setFormData(prev => ({ ...prev, turnstileToken: token }));
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

        if (!formData.turnstileToken) {
            setError('Lütfen doğrulamayı tamamlayın.');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Kayıt başarısız.');
                setIsLoading(false);
                return;
            }

            setSuccess(true);

            // Auto login after register
            const loginRes = await login(formData.studentId, formData.password);

            if (loginRes.success) {
                setTimeout(() => {
                    router.push('/kulupler');
                }, 1000);
            } else {
                setTimeout(() => {
                    router.push('/giris');
                }, 1000);
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Bir hata oluştu. Lütfen tekrar deneyin.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex items-center justify-center p-4">
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
                            <p className="text-slate-500">Giriş yapılıyor...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Aramıza Katıl</h1>
                    <p className="text-slate-500 mt-2">THKÜ Topluluklarına erişmek için hesap oluşturun</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium text-center flex items-center justify-center gap-2">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sol Kolon */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Ad Soyad</label>
                                <div className="relative">
                                    <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                        placeholder="Ad Soyad"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Öğrenci Numarası</label>
                                <div className="relative">
                                    <Hash className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                        placeholder="202..."
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Bölüm</label>
                                <div className="relative">
                                    <Building2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800 appearance-none"
                                        required
                                    >
                                        <option value="">Bölüm Seçiniz</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sağ Kolon */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">E-posta</label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                        placeholder="ornek@thku.edu.tr"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Telefon</label>
                                <div className="relative">
                                    <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                        placeholder="05..."
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Şifre</label>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                            placeholder="••••••"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1 ml-1">Şifre (Tekrar)</label>
                                    <div className="relative">
                                        <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                                            placeholder="••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <TurnstileWidget onVerify={handleTurnstileVerify} />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-950 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-xl shadow-blue-900/20 text-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
