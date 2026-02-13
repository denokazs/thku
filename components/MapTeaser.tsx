'use client';

import Link from 'next/link';
import { Map, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapTeaser() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/campus" className="block group cursor-pointer relative rounded-3xl overflow-hidden shadow-2xl">
                    {/* Background Image with Parallax-like feel via scale */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: "url('/maps/campus-general.png')" }}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors duration-500" />

                    {/* Content */}
                    <div className="relative z-10 p-12 md:p-20 flex flex-col items-center justify-center text-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/10 backdrop-blur-md p-4 rounded-2xl mb-6 border border-white/20"
                        >
                            <Map className="w-12 h-12 text-blue-400" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                            Kampüsü Keşfedin
                        </h2>
                        <p className="text-lg text-slate-200 max-w-2xl mb-10 leading-relaxed">
                            Derslikler, laboratuvarlar ve sosyal alanların yerini interaktif harita ile kolayca bulun. Kat planları ve daha fazlası.
                        </p>

                        <div className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg group-hover:shadow-blue-500/25 group-hover:-translate-y-1">
                            <Navigation className="w-5 h-5" />
                            Haritayı Görüntüle
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    );
}
