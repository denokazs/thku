const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'thk.db');
const db = new Database(DB_PATH);

// Create news table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY,
        title TEXT,
        date TEXT,
        category TEXT,
        summary TEXT,
        content TEXT,
        facultyId TEXT
    )
`);

console.log('✅ News table created/verified successfully!');

// Check if table exists and show structure
const tableInfo = db.prepare('PRAGMA table_info(news)').all();
console.log('\nTable structure:');
tableInfo.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

// Check existing news count
const count = db.prepare('SELECT COUNT(*) as count FROM news').get();
console.log(`\nExisting news count: ${count.count}`);

db.close();
