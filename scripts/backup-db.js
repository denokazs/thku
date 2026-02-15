/**
 * Database Backup Script
 * Connects to MySQL production database and exports all data as SQL + JSON
 * Run: node scripts/backup-db.js
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thk_db',
};

async function backup() {
    console.log('🔄 Connecting to database...');
    const conn = await mysql.createConnection(dbConfig);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupDir = path.join(__dirname, '..', 'backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const sqlFile = path.join(backupDir, `backup_${timestamp}.sql`);
    const jsonFile = path.join(backupDir, `backup_${timestamp}.json`);

    const tables = [
        'users', 'clubs', 'events', 'news', 'confessions', 'comments',
        'messages', 'forum_posts', 'announcements', 'members', 'attendance',
        'shuttle_stops', 'cafeteria_menu', 'settings', 'club_admins'
    ];

    let sqlOutput = `-- THKU Database Backup\n-- Generated: ${new Date().toISOString()}\n\nSET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\nSTART TRANSACTION;\nSET time_zone = "+03:00";\n\n`;
    const jsonOutput = {};

    for (const table of tables) {
        try {
            // Get CREATE TABLE statement
            const [createResult] = await conn.query(`SHOW CREATE TABLE \`${table}\``);
            if (createResult.length > 0) {
                sqlOutput += `-- --------------------------------------------------------\n`;
                sqlOutput += `-- Table: ${table}\n`;
                sqlOutput += `-- --------------------------------------------------------\n\n`;
                sqlOutput += `DROP TABLE IF EXISTS \`${table}\`;\n`;
                sqlOutput += createResult[0]['Create Table'] + ';\n\n';
            }

            // Get data
            const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
            jsonOutput[table] = rows;
            console.log(`  ✅ ${table}: ${rows.length} rows`);

            if (rows.length > 0) {
                // Generate INSERT statements
                const columns = Object.keys(rows[0]);
                const escapedCols = columns.map(c => `\`${c}\``).join(', ');

                for (const row of rows) {
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'number') return val;
                        if (typeof val === 'boolean') return val ? 1 : 0;
                        // Escape string
                        return `'${String(val).replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`;
                    }).join(', ');
                    sqlOutput += `INSERT INTO \`${table}\` (${escapedCols}) VALUES (${values});\n`;
                }
                sqlOutput += '\n';
            }
        } catch (err) {
            console.log(`  ⚠️ ${table}: ${err.message}`);
        }
    }

    sqlOutput += 'COMMIT;\n';

    fs.writeFileSync(sqlFile, sqlOutput, 'utf8');
    fs.writeFileSync(jsonFile, JSON.stringify(jsonOutput, null, 2), 'utf8');

    console.log(`\n✅ Backup complete!`);
    console.log(`  SQL: ${sqlFile}`);
    console.log(`  JSON: ${jsonFile}`);

    await conn.end();
}

backup().catch(err => {
    console.error('❌ Backup failed:', err.message);
    process.exit(1);
});
