'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FACULTIES, OTHER_UNITS, PROMO_VIDEO, Faculty } from '@/data/faculties';
import { ChevronRight, Globe, Layers, Youtube } from 'lucide-react';
import Link from 'next/link';

export default function FacultiesSection() {
    const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 skew-x-12 translate-x-1/4"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Akademik Birimler</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-blue-950 mb-6">Fakülteler ve Bölümler</h3>
                    <p className="max-w-2xl mx-auto text-lg text-slate-600">
                        Türkiye'nin ilk ve tek havacılık ve uzay bilimleri ihtisas üniversitesinde geleceğin teknolojisini şekillendirin.
                    </p>
                </div>

                {/* Faculties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {FACULTIES.map((faculty) => (
                        <motion.div
                            key={faculty.id}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col items-start h-full group"
                        >
                            <div className="bg-blue-600 text-white p-3 rounded-xl mb-4 group-hover:bg-[#00205B] transition-colors">
                                <Layers className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-800">{faculty.name}</h4>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">{faculty.description}</p>

                            <Link
                                href={`/faculties/${faculty.id}`}
                                className="w-full py-3 rounded-lg bg-slate-50 text-blue-900 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Bölümleri İncele
                                <ChevronRight className="w-4 h-4" />
                            </Link>


                        </motion.div>
                    ))}
                </div>

                {/* Other Units & Video Two-Column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Other Units */}
                    <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-blue-950 flex items-center gap-3">
                            <span className="w-8 h-1 bg-red-600 rounded-full inline-block"></span>
                            Diğer Akademik Birimler
                        </h4>

                        <div className="space-y-4">
                            {OTHER_UNITS.map((unit, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border-l-4 border-blue-900 shadow-md">
                                    <h5 className="font-bold text-lg text-slate-800 mb-2">{unit.name}</h5>
                                    <p className="text-slate-600 text-sm leading-relaxed">{unit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Embed */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
                            <iframe
                                className="w-full h-full"
                                src={PROMO_VIDEO}
                                title="THK Üniversitesi Tanıtım"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                            <Youtube className="w-5 h-5 text-red-600" />
                            THK Üniversitesi Tanıtım Filmi
                        </div>
                    </div>
                </div>

            </div>

            {/* Department Details Modal */}
            <AnimatePresence>
                {selectedFaculty && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFaculty(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl relative z-10 flex flex-col"
                        >
                            <div className="p-6 md:p-8 bg-[#00205B] text-white flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedFaculty.name}</h3>
                                    <p className="text-blue-200 text-sm mt-1">Bölümler ve Programlar</p>
                                </div>
                                <button
                                    onClick={() => setSelectedFaculty(null)}
                                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar bg-slate-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedFaculty.departments.map((dept, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="text-lg font-bold text-[#00205B] mb-3">{dept.name}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">{dept.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
