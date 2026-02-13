const fs = require('fs');
const path = require('path');

const ANALYTICS_PATH = path.join(process.cwd(), 'data', 'analytics.json');

const MOCK_VIEWS = [];
const SESSIONS = ['user1', 'user2', 'user3', 'user4', 'user5'];

// Generate 50 views for 'robotics' (Club ID 1 in new DB)
// Paths: /kulupler/robotics, /kulupler/robotics/etkinlik/1
for (let i = 0; i < 50; i++) {
    const isRobotics = Math.random() > 0.3;
    const session = SESSIONS[Math.floor(Math.random() * SESSIONS.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Last 30 days

    MOCK_VIEWS.push({
        id: crypto.randomUUID(),
        path: isRobotics ? '/kulupler/robotics' : '/',
        clubSlug: isRobotics ? 'robotics' : null,
        timestamp: date.toISOString(),
        sessionId: session,
        ip: '127.0.0.1',
        device: { type: 'Desktop', browser: 'Chrome', os: 'Windows' },
        geo: { country: 'TR', city: 'Ankara' }
    });
}

function seed() {
    try {
        console.log('Seeding Analytics...');
        const data = { pageViews: MOCK_VIEWS };
        fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2));
        console.log(`✅ Seeded ${MOCK_VIEWS.length} views.`);
    } catch (e) {
        console.error('Seed Failed:', e);
    }
}

seed();
