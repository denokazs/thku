
'use client';

import { useState } from 'react';

export default function DebugLoginPage() {
    const [email, setEmail] = useState('kazmacideniz@gmail.com');
    const [password, setPassword] = useState('admin123');
    const [result, setResult] = useState<any>(null);

    const testLogin = async () => {
        setResult('Testing...');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });

            const data = await res.json();
            setResult({
                status: res.status,
                ok: res.ok,
                data: data
            });
        } catch (e: any) {
            setResult({ error: e.message });
        }
    };

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Login Debugger</h1>
            <div className="space-y-4">
                <input
                    className="border p-2 block w-full"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    className="border p-2 block w-full"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    onClick={testLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Test Login
                </button>
            </div>
            <pre className="mt-8 bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    );
}
