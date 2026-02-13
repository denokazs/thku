
// Native fetch is available in Node 18+
async function testAnalytics() {
    console.log('--- VERIFYING ANALYTICS DATES ---');

    // 1. Fetch Stats for Existing Club
    const realSlug = 'robotics';
    console.log(`Fetching stats for club: ${realSlug}`);

    // Track a view first to ensure we have fresh data
    await fetch('http://127.0.0.1:3000/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            path: `/kulupler/${realSlug}`,
            timestamp: new Date().toISOString()
        })
    });

    await new Promise(r => setTimeout(r, 1000));

    try {
        const statsRes = await fetch(`http://127.0.0.1:3000/api/analytics/stats?scope=club&days=30&slug=${realSlug}`);
        if (statsRes.ok) {
            const stats = await statsRes.json();
            console.log('Total Views:', stats.totalViews);
            console.log('Views Array Length:', stats.views?.length);

            if (stats.views && stats.views.length > 0) {
                // Check the last few views
                const recentViews = stats.views.slice(-5);
                console.log('Recent View Dates (UTC):');
                recentViews.forEach(v => {
                    console.log(` - ${v.timestamp} (DateStr: ${v.timestamp.split('T')[0]})`);
                });

                // Simulate Frontend Logic
                const today = new Date();
                const todayStr = today.toISOString().split('T')[0];
                console.log('Client "Today" (UTC):', todayStr);

                const match = stats.views.find(v => v.timestamp.split('T')[0] === todayStr);
                console.log('Match found for today?', !!match);
            } else {
                console.log('No views found in response array.');
            }

        } else {
            console.error('Fetch stats failed:', await statsRes.text());
        }
    } catch (e) {
        console.error('Stats Request Error:', e.message);
    }
}

testAnalytics();
