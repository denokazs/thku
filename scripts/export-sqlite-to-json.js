
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/thk.db');
const EXPORT_PATH = path.join(__dirname, '../data/db-export.json');

const TABLES = [
    'users', 'clubs', 'events', 'announcements', 'news', 'confessions',
    'comments', 'messages', 'forum_posts', 'members', 'shuttle_stops', 'cafeteria_menu', 'settings'
];

function exportData() {
    console.log('📂 Opening SQLite database...');
    if (!fs.existsSync(DB_PATH)) {
        console.error(`❌ Database file not found at ${DB_PATH}`);
        process.exit(1);
    }

    const db = new Database(DB_PATH);
    const data = {};

    for (const table of TABLES) {
        try {
            console.log(`📦 Exporting table: ${table}`);
            const rows = db.prepare(`SELECT * FROM ${table}`).all();
            data[table] = rows;
            console.log(`   ✅ ${rows.length} rows exported.`);
        } catch (err) {
            console.warn(`   ⚠️ Could not export table ${table}: ${err.message}`);
            data[table] = [];
        }
    }

    console.log(`💾 Writing to ${EXPORT_PATH}...`);
    fs.writeFileSync(EXPORT_PATH, JSON.stringify(data, null, 2));
    console.log('🎉 Export completed!');
}

exportData();
