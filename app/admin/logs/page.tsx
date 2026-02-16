'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Download, Trash2, MapPin, Clock, User, Globe, Activity } from 'lucide-react';

interface ApiLog {
    id: number;
    timestamp: number;
    method: string;
    endpoint: string;
    userId?: string;
    username?: string;
    ipAddress: string;
    userAgent?: string;
    country?: string;
    city?: string;
    region?: string;
    statusCode?: number;
    responseTime?: number;
    requestBody?: string;
    responseError?: string;
    gpsLatitude?: number;
    gpsLongitude?: number;
    gpsAccuracy?: number;
    gpsAddress?: string;
    gpsStreet?: string;
    gpsCity?: string;
    gpsPostalCode?: string;
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<ApiLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        userId: '',
        ip: '',
        endpoint: '',
        method: '',
        startDate: '',
        endDate: '',
    });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v)),
            });

            const response = await fetch(`/api/admin/logs?${params}`);
            const data = await response.json();

            if (response.ok) {
                setLogs(data.logs);
                setTotalPages(data.pagination.totalPages);
            } else {
                console.error('Failed to fetch logs:', data.error);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    const handleSearch = () => {
        setPage(1);
        fetchLogs();
    };

    const handleClearOldLogs = async () => {
        if (!confirm('30 günden eski logları silmek istediğinizden emin misiniz?')) return;

        const cutoffTime = Date.now() - (30 * 24 * 60 * 60 * 1000); // 30 days ago
        try {
            const response = await fetch(`/api/admin/logs?olderThan=${cutoffTime}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (response.ok) {
                alert(`${data.deletedCount} log silindi.`);
                fetchLogs();
            }
        } catch (error) {
            console.error('Error deleting logs:', error);
        }
    };

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Method', 'Endpoint', 'User', 'IP', 'Country', 'City', 'Status', 'Response Time'];
        const rows = logs.map(log => [
            new Date(log.timestamp).toISOString(),
            log.method,
            log.endpoint,
            log.username || log.userId || '-',
            log.ipAddress,
            log.country || '-',
            log.city || '-',
            log.statusCode || '-',
            log.responseTime ? `${log.responseTime}ms` : '-',
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-logs-${Date.now()}.csv`;
        a.click();
    };

    const getStatusColor = (status?: number) => {
        if (!status) return 'text-slate-500';
        if (status >= 200 && status < 300) return 'text-green-500';
        if (status >= 400 && status < 500) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            GET: 'bg-blue-500',
            POST: 'bg-green-500',
            PUT: 'bg-yellow-500',
            DELETE: 'bg-red-500',
        };
        return colors[method] || 'bg-slate-500';
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">API Logları</h1>
                <p className="text-slate-600">Tüm API isteklerinin detaylı kaydı</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Kullanıcı ID"
                        value={filters.userId}
                        onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="IP Adresi"
                        value={filters.ip}
                        onChange={(e) => setFilters({ ...filters, ip: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Endpoint (/api/...)"
                        value={filters.endpoint}
                        onChange={(e) => setFilters({ ...filters, endpoint: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                        value={filters.method}
                        onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Tüm Metodlar</option>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSearch}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Search className="w-4 h-4" />
                        Ara
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        <Download className="w-4 h-4" />
                        CSV İndir
                    </button>
                    <button
                        onClick={handleClearOldLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ml-auto"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eski Logları Temizle
                    </button>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-600">Yükleniyor...</div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center text-slate-600">Log bulunamadı</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Zaman</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Method</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Endpoint</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Kullanıcı</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Konum (IP / GPS)</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">Süre</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-sm text-slate-900">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                {new Date(log.timestamp).toLocaleString('tr-TR')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-medium text-white rounded ${getMethodColor(log.method)}`}>
                                                {log.method}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-mono text-slate-700">{log.endpoint}</td>
                                        <td className="px-4 py-3 text-sm text-slate-900">
                                            {log.username || log.userId ? (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    {log.username || log.userId}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-900">
                                            <div className="space-y-2">
                                                {/* GPS Location (Priority) */}
                                                {log.gpsLatitude ? (
                                                    <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                                        <div className="flex items-center gap-1 text-blue-800 font-medium text-xs mb-1">
                                                            <MapPin className="w-3 h-3" />
                                                            GPS Konumu (±{Math.round(log.gpsAccuracy || 0)}m)
                                                        </div>
                                                        <div className="text-xs text-slate-700 mb-1" title={log.gpsAddress}>
                                                            {log.gpsStreet || log.gpsAddress || 'Bilinmeyen Adres'}
                                                        </div>
                                                        <a
                                                            href={`https://www.google.com/maps?q=${log.gpsLatitude},${log.gpsLongitude}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            Haritada Gör ↗
                                                        </a>
                                                    </div>
                                                ) : (
                                                    /* IP Location (Fallback) */
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4 text-slate-400" />
                                                            <code className="text-xs">{log.ipAddress}</code>
                                                        </div>
                                                        {(log.city || log.country) && (
                                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                                <MapPin className="w-3 h-3" />
                                                                {[log.city, log.region, log.country].filter(Boolean).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className={`px-4 py-3 text-sm font-medium ${getStatusColor(log.statusCode)}`}>
                                            {log.statusCode || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-900">
                                            {log.responseTime ? (
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-slate-400" />
                                                    {log.responseTime}ms
                                                </div>
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            Önceki
                        </button>
                        <span className="text-sm text-slate-600">
                            Sayfa {page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            Sonraki
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
