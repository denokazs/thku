
// lib/db.ts is TS. We can't require it directly in Node if not compiled.
// Instead, let's use fetch against the running server.

async function testAnalytics() {
    console.log('--- TESTING ANALYTICS API ---');

    // 1. GLOBAL STATS
    try {
        console.log('\n[1] Fetching GLOBAL Stats...');
        const res = await fetch('http://127.0.0.1:3000/api/analytics/stats?scope=global&days=30');
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Global Fetch Error:', e.message);
    }

    // 2. CLUB STATS (ID: 1 -> Robotics)
    try {
        console.log('\n[2] Fetching CLUB Stats (ID: 1)...');
        const res = await fetch('http://127.0.0.1:3000/api/analytics/stats?scope=club&clubId=1&days=30');
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Club Fetch Error:', e.message);
    }
}

testAnalytics();
