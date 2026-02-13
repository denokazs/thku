const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'thk.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);
    const clubs = db.prepare('SELECT id, name, slug, coverImage FROM clubs').all();

    console.log('--- CLUBS DUMP ---');
    clubs.forEach(c => {
        console.log(`ID: ${c.id}, Slug: ${c.slug}, Name: ${c.name}`);
        console.log(`   Image: ${c.coverImage}`);
    });

    // Check for duplicates
    const slugs = clubs.map(c => c.slug);
    const duplicates = slugs.filter((item, index) => slugs.indexOf(item) !== index);

    if (duplicates.length > 0) {
        console.log('\n!!! DUPLICATES DETECTED !!!');
        console.log(duplicates);
    } else {
        console.log('\nNo duplicate slugs found.');
    }

} catch (e) {
    console.error('Error:', e.message);
}
