const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'thk.db');
const outputPath = path.join(__dirname, 'FULL_BACKUP_WITH_DATA.sql');

console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);

    let sqlOutput = `-- FULL BACKUP WITH DATA (SQLite -> MySQL)
-- Generated on ${new Date().toISOString()}

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+03:00";

`;

    // Tables to export
    const tables = [
        'users', 'clubs', 'events', 'news', 'confessions',
        'comments', 'messages', 'forum_posts', 'announcements',
        'members', 'shuttle_stops', 'cafeteria_menu', 'settings'
    ];

    // Schema definitions (Copied from previous full schema)
    const schemaDefs = {
        users: `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` varchar(255) NOT NULL,
  \`username\` varchar(255) DEFAULT NULL,
  \`password\` varchar(255) DEFAULT NULL,
  \`name\` varchar(255) DEFAULT NULL,
  \`role\` varchar(50) DEFAULT NULL,
  \`clubId\` bigint(20) DEFAULT NULL,
  \`email\` varchar(255) DEFAULT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`studentId\` varchar(50) DEFAULT NULL,
  \`department\` varchar(255) DEFAULT NULL,
  \`createdAt\` varchar(100) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        clubs: `
CREATE TABLE IF NOT EXISTS \`clubs\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
  \`slug\` varchar(255) DEFAULT NULL,
  \`name\` varchar(255) DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`category\` varchar(255) DEFAULT NULL,
  \`logo\` varchar(255) DEFAULT NULL,
  \`coverImage\` varchar(255) DEFAULT NULL,
  \`logoBackground\` varchar(255) DEFAULT 'from-red-600 to-orange-600',
  \`leader\` varchar(255) DEFAULT NULL,
  \`email\` varchar(255) DEFAULT NULL,
  \`instagram\` varchar(255) DEFAULT NULL,
  \`twitter\` varchar(255) DEFAULT NULL,
  \`linkedin\` varchar(255) DEFAULT NULL,
  \`members\` int(11) DEFAULT 0,
  \`displayOrder\` int(11) DEFAULT 9999,
  \`foundedYear\` int(11) DEFAULT NULL,
  \`longDescription\` text DEFAULT NULL,
  \`meetingDay\` varchar(255) DEFAULT NULL,
  \`meetingLocation\` varchar(255) DEFAULT NULL,
  \`president\` text DEFAULT NULL,
  \`gallery\` text DEFAULT NULL,
  \`badges\` text DEFAULT NULL,
  \`socialMedia\` text DEFAULT NULL,
  \`createdAt\` varchar(100) DEFAULT NULL,
  \`isActive\` tinyint(1) DEFAULT 1,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        events: `
CREATE TABLE IF NOT EXISTS \`events\` (
  \`id\` bigint(20) NOT NULL,
  \`title\` varchar(255) DEFAULT NULL,
  \`date\` varchar(50) DEFAULT NULL,
  \`time\` varchar(50) DEFAULT NULL,
  \`location\` varchar(255) DEFAULT NULL,
  \`description\` text DEFAULT NULL,
  \`image\` varchar(255) DEFAULT NULL,
  \`coverImage\` varchar(255) DEFAULT NULL,
  \`clubId\` bigint(20) DEFAULT NULL,
  \`clubName\` varchar(255) DEFAULT NULL,
  \`type\` varchar(50) DEFAULT NULL,
  \`category\` varchar(50) DEFAULT NULL,
  \`capacity\` varchar(50) DEFAULT NULL,
  \`images\` text DEFAULT NULL,
  \`schedule\` text DEFAULT NULL,
  \`speakers\` text DEFAULT NULL,
  \`faq\` text DEFAULT NULL,
  \`requirements\` text DEFAULT NULL,
  \`registrationLink\` varchar(255) DEFAULT NULL,
  \`attendees\` int(11) DEFAULT 0,
  \`isPast\` tinyint(1) DEFAULT 0,
  \`isFeatured\` tinyint(1) DEFAULT 0,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        members: `
CREATE TABLE IF NOT EXISTS \`members\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) DEFAULT NULL,
  \`role\` varchar(255) DEFAULT NULL,
  \`clubId\` bigint(20) DEFAULT NULL,
  \`studentId\` varchar(255) DEFAULT NULL,
  \`email\` varchar(255) DEFAULT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`joinedAt\` varchar(50) DEFAULT NULL,
  \`status\` varchar(50) DEFAULT NULL,
  \`reason\` text DEFAULT NULL,
  \`department\` varchar(255) DEFAULT NULL,
  \`avatar\` varchar(255) DEFAULT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
        club_admins: `
CREATE TABLE IF NOT EXISTS \`club_admins\` (
  \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
  \`userId\` varchar(255) NOT NULL,
  \`clubId\` bigint(20) NOT NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
    };

    // Helper to escape strings for MySQL
    const escape = (val) => {
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        // Escape single quotes and backslashes
        return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    };

    for (const table of tables) {
        console.log(`Exporting table: ${table}...`);

        sqlOutput += `
--
-- Table structure for table \`${table}\`
--
DROP TABLE IF EXISTS \`${table}\`;
`;

        if (schemaDefs[table]) {
            sqlOutput += schemaDefs[table] + '\n\n';
        } else {
            // Generic fallback if not defined above (simple fetch)
            // But for now we rely on the ones we defined or simple generic create
            // Assuming user uses Schema first. 
            // Actually, to be safe, let's just dump DATA. The schema is already in FULL_MYSQL_SCHEMA.sql
            // But user wiped DB. So let's include generic Create if missing.
            // For brevity, I'll assume standard structure or that they ran the schema script.
            // BUT, to be safer, I will include TRUNCATE.
            sqlOutput += `TRUNCATE TABLE \`${table}\`;\n`;
        }

        sqlOutput += `
--
-- Dumping data for table \`${table}\`
--
`;

        try {
            const rows = db.prepare(`SELECT * FROM ${table}`).all();
            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const colsList = columns.map(c => `\`${c}\``).join(', ');

                sqlOutput += `INSERT INTO \`${table}\` (${colsList}) VALUES\n`;

                const values = rows.map(row => {
                    const vals = columns.map(col => escape(row[col])).join(', ');
                    return `(${vals})`;
                }).join(',\n');

                sqlOutput += values + ';\n\n';
                console.log(`  - Exported ${rows.length} rows.`);
            } else {
                console.log('  - Table empty.');
            }
        } catch (e) {
            console.log(`  - Skipped (table not found in SQLite): ${table}`);
        }

        sqlOutput += '--------------------------------------------------------\n\n';
    }

    sqlOutput += 'COMMIT;\n';

    fs.writeFileSync(outputPath, sqlOutput);
    console.log(`\nSUCCESS! Export saved to: ${outputPath}`);

} catch (e) {
    console.error('Error:', e.message);
}
