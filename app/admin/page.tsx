'use client';

import { useStore } from '@/context/StoreContext';
import { MessageSquare, Bell, Bus } from 'lucide-react';

export default function AdminPage() {
    const { confessions, announcements } = useStore();

    const pendingCount = confessions.filter(c => c.status === 'pending').length;
    const approvedCount = confessions.filter(c => c.status === 'approved').length;

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Genel Bakış</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Bekleyen İtiraflar</p>
                            <h3 className="text-2xl font-bold text-slate-800">{pendingCount}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        Toplam {approvedCount} onaylı itiraf yayında.
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Aktif Duyurular</p>
                            <h3 className="text-2xl font-bold text-slate-800">{announcements.length}</h3>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        Son güncelleme: Bugün
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <Bus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Sistem Durumu</p>
                            <h3 className="text-xl font-bold text-slate-800">Normal</h3>
                        </div>
                    </div>
                    <div className="text-xs text-slate-400">
                        Tüm servisler çalışıyor.
                    </div>
                </div>
            </div>
        </div>
    );
}
