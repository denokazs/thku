const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'thk.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);
    const users = db.prepare('SELECT id, username, name, email, role FROM users').all();

    console.log(`\nFound ${users.length} users in SQLite:`);
    users.forEach(u => {
        console.log(`- [${u.role}] ${u.username} (${u.name || 'No Name'})`);
    });

} catch (e) {
    console.error('Error:', e.message);
}
