'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, FileArchive, GraduationCap, FileText, ArrowRight } from 'lucide-react';

const communityLinks = [
    {
        title: 'Öğrenci Forumu',
        description: 'Kampüs gündemini takip et, sorularını sor ve sosyalleş.',
        icon: MessageSquare,
        href: '/forum',
        color: 'bg-orange-500',
        textColor: 'text-orange-500',
        bgLight: 'bg-orange-50',
        borderColor: 'border-orange-200'
    },
    {
        title: 'Çıkmış Sınavlar',
        description: 'Geçmiş sınav sorularına eriş ve sınavlarına hazırlan.',
        icon: FileArchive,
        href: '/cikmis-sorular',
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
        bgLight: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    {
        title: 'Hoca Değerlendirmeleri',
        description: 'Ders seçiminden önce hocalar hakkındaki yorumları incele.',
        icon: GraduationCap,
        href: '/hocalar',
        color: 'bg-purple-500',
        textColor: 'text-purple-500',
        bgLight: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    {
        title: 'Ders Notları',
        description: 'Ders notlarını paylaş veya paylaşılan notları indir.',
        icon: FileText,
        href: '/ders-notlari',
        color: 'bg-green-500',
        textColor: 'text-green-500',
        bgLight: 'bg-green-50',
        borderColor: 'border-green-200'
    }
];

export default function CommunityPromo() {
    return (
        <section className="py-20 relative overflow-hidden bg-white">
            <div className="container mx-auto px-4 relative z-10 max-w-6xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        THKÜ <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Topluluk Merkezi</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        Öğrenciler için özel olarak tasarlanmış platformda sorularını sor,
                        kaynaklara eriş ve kampüs hayatının nabzını tut.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {communityLinks.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={item.href} className={`block h-full p-6 rounded-3xl border ${item.borderColor} ${item.bgLight} hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group`}>
                                <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {item.description}
                                </p>
                                <div className={`flex items-center gap-2 font-bold text-sm ${item.textColor}`}>
                                    Keşfet <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
