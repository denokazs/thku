import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Linkedin, Plane, Cloud, Star } from 'lucide-react';

export default function Footer() {
    // Default / Fallback Settings
    const defaultSettings = {
        brand: {
            title: "THK ÜNİVERSİTESİ - SKY PORTAL",
            description: "Türkiye'nin havacılık ve uzay bilimleri merkezi. Geleceği göklerde arayanların buluşma noktası.",
        },
        columns: [
            {
                id: "academic",
                type: "links",
                title: "Akademik",
                items: [
                    { label: "Fakülteler", url: "/faculties" },
                    { label: "Akademik Kadro", url: "/hocalar" },
                    { label: "Akademik Takvim", url: "/academic-calendar" },
                    { label: "Ders Notları", url: "/ders-notlari" },
                    { label: "Çıkmış Sorular", url: "/cikmis-sorular" }
                ]
            },
            {
                id: "campus_life",
                type: "links",
                title: "Kampüs Yaşamı",
                items: [
                    { label: "Yemekhane Menüsü", url: "/yemekhane" },
                    { label: "Kampüs / Ulaşım", url: "/campus" },
                    { label: "Öğrenci Kulüpleri", url: "/kulupler" },
                    { label: "Etkinlik Takvimi", url: "/etkinlikler" }
                ]
            },
            {
                id: "community",
                type: "links",
                title: "Topluluk",
                items: [
                    { label: "Öğrenci Forumu", url: "/forum" },
                    { label: "Kara Kutu (İtiraf)", url: "/kara-kutu" },
                    { label: "Haberler & Duyurular", url: "/haberler" },
                    { label: "Güvenlik Pol.", url: "/.well-known/security.txt" }
                ]
            },
            {
                id: "account",
                type: "links",
                title: "Hızlı Erişim",
                items: [
                    { label: "Giriş Yap", url: "/giris" },
                    { label: "Kayıt Ol", url: "/kayit" },
                    { label: "Profilim", url: "/profil" }
                ]
            },
            {
                id: "contact",
                type: "text",
                title: "İletişim",
                items: [
                    { label: "Türkkuşu Kampüsü, Etimesgut/ANKARA", url: "" },
                    { label: "444 84 58", url: "tel:+904448458" },
                    { label: "info@thk.edu.tr", url: "mailto:info@thk.edu.tr" }
                ]
            }
        ],
        socials: {
            facebook: "https://facebook.com/thkuniversitesi",
            twitter: "https://twitter.com/thkuniversitesi",
            instagram: "https://instagram.com/thkuniversitesi",
            linkedin: "https://linkedin.com/school/thkuniversitesi"
        },
        copyright: "© 2026 THK Üniversitesi - Sky Portal. Tüm Hakları Saklıdır."
    };

    const [settings, setSettings] = useState<any>(defaultSettings);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings/footer');
                if (res.ok) {
                    const data = await res.json();
                    // Update settings if data exists (removed strict column check)
                    if (data) {
                        setSettings(data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch footer settings', error);
                // Keep default settings
            }
        };
        fetchSettings();
    }, []);

    if (!settings || !mounted) return null;

    return (
        <footer className="bg-slate-900 text-white pt-24 pb-12 border-t border-slate-800 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient Mesh - Made darker and richer */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 opacity-100 shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                <div className="absolute -top-[50%] -right-[20%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-[20%] -left-[10%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl" />

                {/* Floating Elements - Increased Visibility */}
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.6, 0.9, 0.6] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-20 right-20 text-white/20"
                >
                    <Cloud className="w-48 h-48 drop-shadow-2xl" />
                </motion.div>

                <motion.div
                    animate={{ x: [0, -150, 0], y: [0, 30, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute bottom-40 left-10 text-red-500/20"
                >
                    <Cloud className="w-64 h-64 drop-shadow-2xl" />
                </motion.div>

                <motion.div
                    animate={{ x: [-100, 1200], y: [100, -300], rotate: [0, 10] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-60 -left-20 text-white/10 z-0"
                >
                    <Plane className="w-32 h-32" />
                </motion.div>

                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                        transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
                        className="absolute text-yellow-400/40"
                        style={{
                            top: `${(i * 13 + 7) % 80}%`,
                            left: `${(i * 29 + 11) % 90}%`
                        }}
                    >
                        <Star className="w-6 h-6 drop-shadow-lg" />
                    </motion.div>
                ))}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* Brand Section - Spans 3 cols */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-900/20">
                                <Plane className="w-7 h-7 -rotate-45" />
                            </div>
                            <div>
                                <span className="text-2xl font-black uppercase tracking-tight block leading-none">THK</span>
                                <span className="text-sm font-medium tracking-widest opacity-75">ÜNİVERSİTESİ</span>
                            </div>
                        </div>

                        {/* Sky Portal Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                            <Cloud className="w-3 h-3" />
                            Sky Portal
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            {settings.brand?.description}
                        </p>

                        {/* Social Media */}
                        <div className="flex gap-3 pt-2">
                            {settings.socials?.facebook && (
                                <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socials?.twitter && (
                                <a href={settings.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#1DA1F2] hover:text-white transition-all transform hover:-translate-y-1">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socials?.instagram && (
                                <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#E4405F] hover:text-white transition-all transform hover:-translate-y-1">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings.socials?.linkedin && (
                                <a href={settings.socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Dynamic Columns Section - Spans 9 cols */}
                    <div className="lg:col-span-9 grid grid-cols-2 lg:grid-cols-5 gap-8">
                        {settings.columns?.map((col: any) => (
                            <div key={col.id} className="space-y-6">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <span className="w-1 h-5 bg-red-600 rounded-full"></span>
                                    {col.title}
                                </h3>
                                <ul className="space-y-4">
                                    {col.items?.map((item: any, idx: number) => (
                                        <li key={idx}>
                                            {item.url && item.url !== '#' ? (
                                                <a href={item.url} className="text-slate-400 hover:text-white text-sm transition-colors flex items-start gap-2 group">
                                                    <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-red-500">›</span>
                                                    {item.label}
                                                </a>
                                            ) : (
                                                <span className="text-slate-400 text-sm block leading-relaxed">{item.label}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
                    <p>{settings.copyright}</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
                        <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
                        <a href="#" className="hover:text-white transition-colors">KVKK</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
