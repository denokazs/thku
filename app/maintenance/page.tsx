export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-4">
            <div className="max-w-md text-center space-y-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-red-500">
                    Sistem Güvenlik Modunda
                </h1>

                <p className="text-gray-400">
                    Şu anda planlı olmayan bir güvenlik taraması veya bakım çalışması yürütülmektedir.
                    Erişim geçici olarak kısıtlanmıştır.
                </p>

                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 text-sm font-mono text-gray-500">
                    <p>Status: LOCKDOWN</p>
                    <p>Code: 503_SERVICE_UNAVAILABLE</p>
                    <p>Ref: AUTH_GATE_k7</p>
                </div>
            </div>
        </div>
    );
}
