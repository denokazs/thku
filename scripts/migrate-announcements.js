const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'data', 'thk.db');
const db = new Database(DB_PATH);

try {
    // Add new columns one by one
    const columns = [
        { name: 'priority', type: 'TEXT', default: "'medium'" },
        { name: 'color', type: 'TEXT', default: "'#3B82F6'" },
        { name: 'icon', type: 'TEXT', default: "'bell'" },
        { name: 'description', type: 'TEXT', default: 'NULL' },
        { name: 'url', type: 'TEXT', default: 'NULL' },
        { name: 'startDate', type: 'TEXT', default: 'NULL' },
        { name: 'endDate', type: 'TEXT', default: 'NULL' },
        { name: 'isActive', type: 'INTEGER', default: '1' },
        { name: 'createdAt', type: 'TEXT', default: 'NULL' }
    ];

    columns.forEach(col => {
        try {
            db.exec(`ALTER TABLE announcements ADD COLUMN ${col.name} ${col.type} DEFAULT ${col.default}`);
            console.log(`✅ Added column: ${col.name}`);
        } catch (e) {
            if (e.message.includes('duplicate column')) {
                console.log(`⏭️  Column already exists: ${col.name}`);
            } else {
                throw e;
            }
        }
    });

    console.log('\n✅ Announcements table migration completed!');

    // Show table structure
    const tableInfo = db.prepare('PRAGMA table_info(announcements)').all();
    console.log('\nCurrent table structure:');
    tableInfo.forEach(col => console.log(`  ${col.name}: ${col.type}`));

} catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
} finally {
    db.close();
}
