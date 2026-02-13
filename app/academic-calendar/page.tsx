'use client';

import AcademicCalendar from '@/components/AcademicCalendar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


export default function AcademicCalendarPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link href="/campus" className="inline-flex items-center text-slate-500 hover:text-blue-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kampüs Sayfasına Dön
                </Link>

                <div className="text-center mb-12">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-2 block">2025 - 2026 EĞİTİM ÖĞRETİM YILI</span>
                    <h1 className="text-4xl md:text-5xl font-black text-blue-950 mb-4">Akademik Takvim</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Vize, final, ve bütünleme haftalarını takip et. Ders kayıt ve ekle-sil tarihlerini kaçırma.
                    </p>
                </div>

                <AcademicCalendar />
            </div>

        </main>
    );
}
