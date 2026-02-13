'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Plane, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden bg-[#00205B]">
            {/* Dynamic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-[#00205B] to-slate-900 opacity-90" />
                {/* Abstract Shapes - Hidden on mobile for performance */}
                <div className="hidden md:block absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl animate-pulse will-change-transform" />
                <div className="hidden md:block absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl will-change-transform" />

                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 relative will-change-transform"
                >
                    <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl animate-pulse"></div>
                    <Plane className="w-20 h-20 text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0, duration: 0.5 }}
                    className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-xl will-change-transform"
                >
                    SKY PORTAL
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto font-light mb-10 tracking-wide will-change-transform"
                >
                    Türk Hava Kurumu Üniversitesi'nin dijital kampüsüne hoş geldiniz.
                    <span className="block mt-2 font-medium text-white">İstikbal Göklerdedir.</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <Link href="/campus" className="group bg-white text-[#00205B] px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-50 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] flex items-center gap-2">
                        Kampüsü Keşfet
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/kara-kutu" className="px-8 py-4 rounded-full text-lg font-bold text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm">
                        Kara Kutu'ya Gir
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
            >
                <ChevronDown className="w-8 h-8" />
            </motion.div>

            {/* Decorative Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent z-20" />
        </section>
    );
}
