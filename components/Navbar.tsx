'use client';

import Link from 'next/link';
import { Search, Plane, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-transparent border-b border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <div className="w-8 h-8 bg-red-600 rounded-tl-lg rounded-br-lg flex items-center justify-center text-white">
                            <Plane className="w-5 h-5 -rotate-45" />
                        </div>
                        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter text-blue-950 uppercase">
                            THK <span className="font-light">ÜNİVERSİTESİ</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block flex-1 px-4">
                        <div className="flex items-center justify-center space-x-1 lg:space-x-3 xl:space-x-4">
                            {[
                                { label: 'Ana Sayfa', href: '/' },
                                { label: 'Akademik', href: '/academic-calendar' },
                                { label: 'Kampüs', href: '/campus' },
                                { label: 'Etkinlikler', href: '/etkinlikler' },
                                { label: 'Haberler', href: '/haberler' },
                                { label: 'Kulüpler', href: '/kulupler' },
                                { label: 'Yemekhane', href: '/yemekhane' },
                                { label: 'Forum', href: '/forum' }
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="group relative px-2 py-2 text-xs lg:text-sm font-bold tracking-wider text-blue-950 transition-colors uppercase whitespace-nowrap"
                                >
                                    <span className="relative z-10 group-hover:text-red-600 transition-colors duration-300">
                                        {item.label}
                                    </span>
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-2">
                        <button
                            className="text-blue-900 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-blue-50"
                            aria-label="Ara"
                        >
                            <Search className="w-5 h-5" aria-hidden="true" />
                        </button>

                        <Link href="/kara-kutu">
                            <button className="bg-gray-900 text-white px-5 py-2 rounded-md font-bold text-sm tracking-wider hover:bg-black transition-all hover:scale-105 shadow-lg border-b-2 border-red-600">
                                KARA KUTU
                            </button>
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    className="flex items-center gap-2 text-blue-950 font-bold text-sm bg-white/50 border border-blue-900/10 px-4 py-2 rounded-full hover:bg-white transition-all shadow-sm"
                                    aria-label="Profil menüsü"
                                    aria-expanded={showProfileMenu}
                                    aria-haspopup="true"
                                >
                                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4" aria-hidden="true" />
                                    </div>
                                    <span className="max-w-[100px] truncate">{user.username}</span>
                                </button>

                                <AnimatePresence>
                                    {showProfileMenu && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)}></div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden"
                                            >

                                                <Link
                                                    href="/profil"
                                                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-50"
                                                >
                                                    Profilim
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setShowProfileMenu(false);
                                                    }}
                                                    className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" /> Çıkış Yap
                                                </button>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link href="/giris">
                                <button className="flex items-center gap-2 text-blue-900 font-semibold text-sm border border-blue-900/30 px-4 py-2 rounded-tl-xl rounded-br-xl hover:bg-blue-900 hover:text-white transition-all">
                                    <Plane className="w-4 h-4" />
                                    <span>Öğrenci Girişi</span>
                                </button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-blue-900 p-2"
                            aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md border-b border-gray-200 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {[
                                { label: 'Ana Sayfa', href: '/' },
                                { label: 'Akademik', href: '/academic-calendar' },
                                { label: 'Kampüs', href: '/campus' },
                                { label: 'Etkinlikler', href: '/etkinlikler' },
                                { label: 'Haberler', href: '/haberler' },
                                { label: 'Kulüpler', href: '/kulupler' },
                                { label: 'Yemekhane', href: '/yemekhane' },
                                { label: 'Forum', href: '/forum' },
                                { label: 'Kara Kutu', href: '/kara-kutu' }
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-red-600 transition-colors"
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-gray-200 mt-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-3 py-2 text-gray-500 mb-2">
                                            <User className="w-5 h-5" />
                                            <span>{user.username}</span>
                                        </div>
                                        <Link
                                            href="/profil"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                                        >
                                            Profilim
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                                        >
                                            Çıkış Yap
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/giris"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full text-center bg-blue-900 text-white px-4 py-3 rounded-lg font-bold"
                                    >
                                        Öğrenci Girişi
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
