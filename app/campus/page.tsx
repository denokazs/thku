import EgoTracker from '@/components/EgoTracker';
import MenuCalendar from '@/components/MenuCalendar';
import CampusMap from '@/components/CampusMap';
import Link from 'next/link';

export default function CampusPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-blue-950 mb-4">Kampüs Hayatı</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Türkkuşu Kampüsü'ndeki günlük yaşamınızı kolaylaştıracak araçlar ve bilgilendirmeler.
                    </p>
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div>
                        <EgoTracker />
                    </div>
                    <div>
                        <MenuCalendar />

                        {/* Extra utility placeholder */}
                        <Link href="/academic-calendar" className="mt-8 bg-blue-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative group cursor-pointer block hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Akademik Takvim</h3>
                            <p className="text-blue-200 mb-6">Vize ve final haftalarını kaçırma.</p>
                            <span className="inline-block bg-white text-blue-900 px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-50 transition-colors">Görüntüle</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-16">
                    <CampusMap />
                </div>
            </div>
        </div>
    );
}
