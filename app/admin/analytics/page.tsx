'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Eye, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState(30);

    useEffect(() => {
        const init = async () => {
            // 1. Get User Role
            try {
                const authRes = await fetch('/api/auth/me');
                if (authRes.ok) {
                    const authData = await authRes.json();
                    const user = authData.user;

                    if (user && user.role === 'club_admin' && user.clubId) {
                        // Club Admin Scope
                        await fetchStats('club', user.clubId);
                    } else {
                        // Super Admin / Global Scope
                        await fetchStats('global');
                    }
                } else {
                    // Fallback
                    await fetchStats('global');
                }
            } catch (e) {
                await fetchStats('global');
            }
        };

        init();
    }, [dateRange]);

    const fetchStats = async (scope: 'global' | 'club' = 'global', clubId?: number) => {
        setLoading(true);
        try {
            let url = `/api/analytics/stats?days=${dateRange}&scope=${scope}`;
            if (scope === 'club' && clubId) {
                url += `&clubId=${clubId}`;
            }

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                processStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (data: any) => {
        // Process data for charts
        const viewsByDate: Record<string, number> = {};
        const pages: Record<string, number> = {};

        // Initialize last N days with 0
        for (let i = 0; i < dateRange; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            viewsByDate[dateStr] = 0;
        }

        data.views.forEach((view: any) => {
            const dateStr = view.timestamp.split('T')[0];
            if (viewsByDate[dateStr] !== undefined) {
                viewsByDate[dateStr]++;
            }

            const path = view.path;
            pages[path] = (pages[path] || 0) + 1;
        });

        // Convert to arrays for rendering
        const chartData = Object.entries(viewsByDate)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, count]) => ({ date, count }));

        const topPages = Object.entries(pages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        setStats({
            totalViews: data.totalViews,
            uniqueVisitors: data.uniqueVisitors,
            chartData,
            topPages,
            recentViews: data.views.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        });
    };

    if (loading && !stats) return <div className="p-8 text-center text-slate-500">Yükleniyor...</div>;

    const maxChartValue = Math.max(...(stats?.chartData.map((d: any) => d.count) || [0]), 10);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Site İstatistikleri</h1>
                    <p className="text-slate-500">Gerçek zamanlı trafik analizi</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200">
                    {[7, 30, 90].map(days => (
                        <button
                            key={days}
                            onClick={() => setDateRange(days)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${dateRange === days
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Son {days} Gün
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Toplam Görüntülenme</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stats?.totalViews.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Tekil Ziyaretçi</p>
                            <h3 className="text-3xl font-bold text-slate-800">{stats?.uniqueVisitors.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-full text-purple-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Ortalama Görüntülenme</p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {Math.round(stats?.totalViews / dateRange).toLocaleString()} <span className="text-sm text-slate-400 font-normal">/ gün</span>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chart area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-slate-400" />
                        Zaman Çizelgesi
                    </h3>

                    <div className="h-64 flex items-end gap-2">
                        {stats?.chartData.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col justify-end group relative">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.count / maxChartValue) * 100}%` }}
                                    className="bg-blue-600 rounded-t-sm w-full opacity-80 group-hover:opacity-100 transition-opacity min-h-[4px]"
                                />
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                    <div className="bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                        {d.date}: <strong>{d.count}</strong>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-xs text-slate-400 border-t border-slate-100 pt-2">
                        <span>{stats?.chartData[0].date}</span>
                        <span>{stats?.chartData[Math.floor(stats?.chartData.length / 2)].date}</span>
                        <span>{stats?.chartData[stats?.chartData.length - 1].date}</span>
                    </div>
                </div>

                {/* Top Pages */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-slate-400" />
                        Popüler Sayfalar
                    </h3>
                    <div className="space-y-4">
                        {stats?.topPages.map((page: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        i === 1 ? 'bg-slate-200 text-slate-700' :
                                            i === 2 ? 'bg-orange-100 text-orange-700' :
                                                'bg-slate-50 text-slate-500'
                                        }`}>
                                        {i + 1}
                                    </span>
                                    <span className="text-sm text-slate-600 truncate font-medium" title={page[0]}>
                                        {page[0]}
                                    </span>
                                </div>
                                <span className="font-bold text-slate-800 text-sm bg-slate-100 px-2 py-1 rounded">
                                    {page[1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Visitors Table - New Feature */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    Son Canlı Ziyaretçiler
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 pl-2">Zaman</th>
                                <th className="pb-3">IP Adresi</th>
                                <th className="pb-3">Konum</th>
                                <th className="pb-3">Cihaz</th>
                                <th className="pb-3">Sayfa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats?.recentViews?.slice(0, 50).map((view: any) => (
                                <tr key={view.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-3 pl-2 text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(view.timestamp).toLocaleTimeString()}
                                        <div className="text-[10px] text-slate-400">{new Date(view.timestamp).toLocaleDateString()}</div>
                                    </td>
                                    <td className="py-3 text-sm font-bold text-slate-700 font-mono">
                                        {view.ip || '-'}
                                    </td>
                                    <td className="py-3 text-sm text-slate-600">
                                        {view.geo?.city && view.geo?.country ? (
                                            <span className="flex items-center gap-1">
                                                {view.geo.city}, {view.geo.country}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="py-3 text-sm text-slate-600">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs">{view.device?.type || 'Desktop'}</span>
                                            <span className="text-[10px] text-slate-400">{view.device?.os} - {view.device?.browser}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-sm text-blue-600 font-medium truncate max-w-[200px]" title={view.path}>
                                        {view.path}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
