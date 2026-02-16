'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle } from 'lucide-react';

export default function AdminMigratePage() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/migrate');
            const data = await response.json();
            setStatus(data);
        } catch (error) {
            console.error('Failed to check migration status:', error);
        } finally {
            setLoading(false);
        }
    };

    const runMigrations = async () => {
        if (!confirm('Migration\'ı çalıştırmak istediğinizden emin misiniz?')) return;

        setLoading(true);
        setResult(null);
        try {
            const response = await fetch('/api/admin/migrate', { method: 'POST' });
            const data = await response.json();
            setResult(data);

            // Refresh status after migration
            if (data.success) {
                setTimeout(checkStatus, 1000);
            }
        } catch (error) {
            console.error('Migration failed:', error);
            setResult({ success: false, error: String(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Database Migration</h1>
                <p className="text-slate-600">Veritabanı tablolarını oluştur veya güncelle</p>
            </div>

            {/* Check Status Button */}
            <div className="mb-6">
                <button
                    onClick={checkStatus}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Migration Durumunu Kontrol Et
                </button>
            </div>

            {/* Status Display */}
            {status && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Migration Durumu
                    </h2>

                    {status.migrationsNeeded ? (
                        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-yellow-900">Migration Gerekli</p>
                                {status.missingTables && status.missingTables.length > 0 && (
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Eksik tablolar: {status.missingTables.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-green-900">Tüm Tablolar Mevcut</p>
                                <p className="text-sm text-green-700 mt-1">Migration gerekmez</p>
                            </div>
                        </div>
                    )}

                    {status.error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{status.error}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Run Migration Button */}
            {status?.migrationsNeeded && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">Migration Çalıştır</h2>
                    <p className="text-slate-600 mb-4">
                        Bu işlem eksik tabloları oluşturacak. Mevcut verilere <strong>dokunmaz</strong>.
                    </p>
                    <button
                        onClick={runMigrations}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                    >
                        <Database className="w-5 h-5" />
                        Migration\'ı Çalıştır
                    </button>
                </div>
            )}

            {/* Migration Result */}
            {result && (
                <div className={`rounded-lg shadow-sm border p-6 ${result.success
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                    <div className="flex items-start gap-3">
                        {result.success ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                        )}
                        <div>
                            <h3 className={`font-semibold mb-2 ${result.success ? 'text-green-900' : 'text-red-900'
                                }`}>
                                {result.success ? 'Migration Başarılı!' : 'Migration Başarısız'}
                            </h3>
                            <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'
                                }`}>
                                {result.message || result.error}
                            </p>
                            {result.tables && (
                                <p className="text-sm text-green-700 mt-2">
                                    Oluşturulan tablolar: {result.tables.join(', ')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Bilgi</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Migration sadece eksik tabloları oluşturur</li>
                    <li>• Mevcut verilere ASLA dokunmaz</li>
                    <li>• "CREATE TABLE IF NOT EXISTS" kullanır (güvenli)</li>
                    <li>• Railway otomatik deployment'tan sonra bir kez çalıştırın</li>
                </ul>
            </div>
        </div>
    );
}
