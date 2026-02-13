'use client';

import { motion } from 'framer-motion';
import { Lock, Zap, MousePointer2 } from 'lucide-react';
import Image from 'next/image';

const features = [
    {
        id: 1,
        title: "Kritik İrtifa: Kara Kutu",
        desc: "Kampüsün dijital günlüğü. Anonim, sansürsüz (ama edepli), ve tamamen şeffaf. Radarımızda sadece doğrular var.",
        icon: Lock,
        color: "text-red-600",
        bg: "bg-red-50",
        delay: 0.1
    },
    {
        id: 2,
        title: "EGO Smart Tracker",
        desc: "Durakta üşümeye son. 236-2 hattını canlı takip et, servisin nerede olduğunu gör. 10 dakika kala kırmızı alarma geç ve koş!",
        icon: Zap,
        color: "text-blue-600",
        bg: "bg-blue-50",
        delay: 0.2
    },
    {
        id: 3,
        title: "Dijital Kokpit",
        desc: "Yemekhane menüsünden akademik takvime kadar her şey tek ekranda. Öğrenci işleri sırası beklemeden bilgiye ulaş.",
        icon: MousePointer2,
        color: "text-amber-500",
        bg: "bg-amber-50",
        delay: 0.3
    }
];

export default function FeaturesSection() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block bg-blue-100 text-blue-700 text-sm font-bold px-4 py-2 rounded-full mb-4"
                    >
                        SKY PORTAL HAKKINDA
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-blue-950 mb-6 leading-tight"
                    >
                        Geleceğin Kampüs Deneyimi <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">Bugünden Hazır.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-lg text-slate-600"
                    >
                        THK Üniversitesi öğrencileri için tasarlandı. Modern, hızlı ve tamamen kullanıcı odaklı. İhtiyacın olan her şey, parmaklarının ucunda.
                    </motion.p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {features.map((f) => (
                        <motion.div
                            key={f.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: f.delay }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-blue-950 mb-3">{f.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Showcasing / Preview Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-[#00205B] rounded-3xl p-8 md:p-16 overflow-hidden text-center"
                >
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold text-white mb-6">Tüm Platformlarda, Her An Yanında</h3>
                        <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
                            İster derste, ister yolda, ister yemekhanede. Sky Portal mobil uyumlu tasarımıyla her cihaza mükemmel uyum sağlar.
                        </p>

                        {/* Fake Browser/Mobile Mockup */}
                        <div className="flex justify-center items-end gap-6 h-64 overflow-hidden">
                            {/* Phone 1 */}
                            <div className="w-32 bg-slate-900 rounded-t-3xl border-4 border-slate-700 border-b-0 h-full shadow-2xl skew-y-3 transform translate-y-4 opacity-50"></div>

                            {/* Main Phone */}
                            <div className="w-64 bg-slate-950 rounded-t-3xl border-[6px] border-slate-800 border-b-0 h-full shadow-2xl relative z-10">
                                <div className="w-1/3 h-4 bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl"></div>
                                <div className="h-full bg-slate-100 rounded-t-2xl mt-2 overflow-hidden relative">
                                    {/* Simple UI Mockup */}
                                    <div className="h-14 bg-red-600"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                                        <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                                        <div className="h-24 bg-white rounded-xl shadow-sm"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Phone 3 */}
                            <div className="w-32 bg-slate-900 rounded-t-3xl border-4 border-slate-700 border-b-0 h-full shadow-2xl -skew-y-3 transform translate-y-4 opacity-50"></div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
