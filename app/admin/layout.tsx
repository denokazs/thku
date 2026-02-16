'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, MessageSquare, FileText, LogOut, Users, Newspaper, BarChart3, ShieldAlert, FileArchive, GraduationCap, Calendar, Settings, Activity, Database } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/admin/verify');
                const data = await res.json();
                setIsAdmin(data.isAuthenticated);
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (res.ok) {
                setIsAdmin(true);
                setPassword('');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
                if (data.remaining !== undefined) {
                    setError(`${data.error}. ${data.remaining} attempts remaining.`);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Connection error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/admin/logout', { method: 'POST' });
            setIsAdmin(false);
            router.push('/admin');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-white mb-6 text-center">Yönetici Girişi</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Şifre</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none disabled:opacity-50"
                                placeholder="••••••••"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
                        >
                            {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const menuItems = [
        { label: 'Genel Bakış', icon: LayoutDashboard, href: '/admin' },
        { label: 'Haberler', icon: Newspaper, href: '/admin/news' },
        { label: 'İtiraflar', icon: MessageSquare, href: '/admin/confessions' },
        { label: 'Yorumlar', icon: MessageSquare, href: '/admin/comments' },
        { label: 'Kulüpler', icon: Users, href: '/admin/clubs' },
        { label: 'Kullanıcılar', icon: Users, href: '/admin/users' },
        { label: 'İçerik Yönetimi', icon: FileText, href: '/admin/content' },
        { label: 'İstatistikler', icon: BarChart3, href: '/admin/analytics' },
        // System & Monitoring
        { label: 'API Logları', icon: Activity, href: '/admin/logs' },
        { label: 'Database Migration', icon: Database, href: '/admin/migrate' },
        // Community Section
        { label: 'Moderasyon', icon: ShieldAlert, href: '/admin/community/moderation' },
        { label: 'Kulüp Yönetimi', icon: Users, href: '/admin/community/clubs' },
        { label: 'Etkinlik Yönetimi', icon: Calendar, href: '/admin/community/events' },
        { label: 'Çıkmış Sınavlar', icon: FileArchive, href: '/admin/community/exams' },
        { label: 'Ders Notları', icon: FileText, href: '/admin/community/notes' },
        { label: 'Hoca Yönetimi', icon: GraduationCap, href: '/admin/community/teachers' },
        { label: 'Footer Ayarları', icon: Settings, href: '/admin/settings/footer' },
        { label: 'Banner Ayarları', icon: MessageSquare, href: '/admin/settings/banner' },
        { label: 'Popup Ayarları', icon: MessageSquare, href: '/admin/settings/popup' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-wider">SKY PORTAL <span className="text-red-500 text-xs block">ADMIN PANEL</span></h2>
                </div>

                <nav className="px-4 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === item.href ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
