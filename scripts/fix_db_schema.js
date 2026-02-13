so what do
    const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// DB Config
const dbConfig = {
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME,
    checkExpirationInterval: 900 // Avoid idle connection issues
};

async function fixSchema() {
    console.log('🔌 Connecting to database...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected!');

        // 1. Fix ID columns for Date.now() timestamps (BIGINT)
        console.log('🛠️  Migrating ID columns to BIGINT...');

        // Members table
        try {
            await connection.query('ALTER TABLE members MODIFY id BIGINT NOT NULL AUTO_INCREMENT');
            console.log('   - members.id -> BIGINT: OK');
        } catch (e) {
            console.log('   - members.id: ' + e.message);
        }

        // --- NEW: Add missing columns to members table ---
        const missingCols = [
            { name: 'reason', type: 'TEXT DEFAULT NULL' },
            { name: 'department', type: 'VARCHAR(255) DEFAULT NULL' },
            { name: 'avatar', type: 'VARCHAR(255) DEFAULT NULL' }
        ];

        for (const col of missingCols) {
            try {
                // Check if column exists
                const [cols] = await connection.query(`SHOW COLUMNS FROM members LIKE '${col.name}'`);
                if (cols.length === 0) {
                    await connection.query(`ALTER TABLE members ADD COLUMN ${col.name} ${col.type}`);
                    console.log(`   - members.${col.name} added: OK`);
                } else {
                    console.log(`   - members.${col.name} exists: OK`);
                }
            } catch (e) {
                console.log(`   - members.${col.name}: ` + e.message);
            }
        }

        // Clubs table (Note: this might break foreign keys if any exist, but we checked schema and none enforced)
        try {
            await connection.query('ALTER TABLE clubs MODIFY id BIGINT NOT NULL AUTO_INCREMENT');
            console.log('   - clubs.id -> BIGINT: OK');
        } catch (e) {
            console.log('   - clubs.id: ' + e.message);
        }

        // Announcements table
        try {
            await connection.query('ALTER TABLE announcements MODIFY id BIGINT NOT NULL AUTO_INCREMENT');
            console.log('   - announcements.id -> BIGINT: OK');
        } catch (e) {
            console.log('   - announcements.id: ' + e.message);
        }

        // --- NEW: Fix foreign keys (clubId) in other tables ---
        const tablesWithClubId = ['users', 'members', 'events', 'messages'];
        for (const table of tablesWithClubId) {
            try {
                // Check if column exists first? Or just try modify (if it fails, it fails)
                // MODIFY allows changing type.
                await connection.query(`ALTER TABLE ${table} MODIFY clubId BIGINT DEFAULT NULL`);
                console.log(`   - ${table}.clubId -> BIGINT: OK`);
            } catch (e) {
                console.log(`   - ${table}.clubId: ` + e.message);
            }
        }

        // 2. Fix joinDate column name to match frontend (joinedAt)
        console.log('🛠️  Renaming members.joinDate to joinedAt...');
        try {
            // Check if column exists first to avoid error
            const [cols] = await connection.query("SHOW COLUMNS FROM members LIKE 'joinDate'");
            if (cols.length > 0) {
                await connection.query('ALTER TABLE members CHANGE joinDate joinedAt varchar(50) DEFAULT NULL');
                console.log('   - members.joinDate -> members.joinedAt: OK');
            } else {
                console.log('   - members.joinDate not found (already renamed?)');
            }
        } catch (e) {
            console.log('   - Rename column error: ' + e.message);
        }

        // 3. Create club_admins table for future multi-club support
        console.log('🛠️  Creating club_admins table...');
        const createClubAdminsSQL = `
             CREATE TABLE IF NOT EXISTS \`club_admins\` (
               \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
               \`userId\` varchar(255) NOT NULL,
               \`clubId\` bigint(20) NOT NULL,
               PRIMARY KEY (\`id\`)
             ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
         `;
        await connection.query(createClubAdminsSQL);
        console.log('   - club_admins table: OK');

        console.log('✨ Schema fix completed successfully!');

    } catch (error) {
        console.error('❌ Fatal Error:', error);
    } finally {
        if (connection) await connection.end();
    }
}

fixSchema();
