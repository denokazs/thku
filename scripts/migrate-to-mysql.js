/**
 * SQLite to MariaDB Migration Script
 * 
 * This script migrates data from SQLite database to MariaDB
 * Run with: node scripts/migrate-to-mysql.js
 */

const Database = require('better-sqlite3');
const mysql = require('mysql2/promise');
const path = require('path');

// Database configurations
const SQLITE_PATH = path.join(__dirname, '../data/thk.db');

// MariaDB connection config (update with your cPanel credentials)
const MYSQL_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'thkucomt_user',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thkucomt_main',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function migrate() {
    console.log('🚀 Starting SQLite → MariaDB Migration...\n');

    // Connect to SQLite
    console.log('📂 Opening SQLite database...');
    const sqlite = new Database(SQLITE_PATH);

    // Connect to MySQL
    console.log('🔌 Connecting to MariaDB...');
    const mysql_conn = await mysql.createConnection(MYSQL_CONFIG);

    try {
        // Create tables in MariaDB
        console.log('\n📋 Creating tables in MariaDB...');

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                createdAt BIGINT,
                studentId VARCHAR(255),
                faculty VARCHAR(255),
                year INT,
                clubs TEXT,
                avatar VARCHAR(255)
            )
        `);

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS clubs (
                id INT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                description TEXT,
                category VARCHAR(255),
                president TEXT,
                foundedYear INT,
                memberCount INT DEFAULT 0,
                logo VARCHAR(255),
                coverImage VARCHAR(255),
                gallery TEXT,
                badges TEXT,
                socialMedia TEXT,
                features TEXT,
                benefits TEXT
            )
        `);

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS events (
                id BIGINT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                description TEXT,
                content TEXT,
                date VARCHAR(255),
                location VARCHAR(255),
                clubSlug VARCHAR(255),
                clubName VARCHAR(255),
                images TEXT,
                coverImage VARCHAR(255),
                capacity INT,
                attendees TEXT,
                schedule TEXT,
                speakers TEXT,
                faq TEXT,
                isPast BOOLEAN DEFAULT FALSE,
                isFeatured BOOLEAN DEFAULT FALSE
            )
        `);

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS announcements (
                id BIGINT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                date VARCHAR(255),
                category VARCHAR(255),
                priority VARCHAR(50) DEFAULT 'medium',
                icon VARCHAR(100),
                color VARCHAR(50),
                description TEXT,
                url TEXT,
                isActive BOOLEAN DEFAULT TRUE
            )
        `);

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS news (
                id BIGINT PRIMARY KEY,
                title VARCHAR(500) NOT NULL,
                date VARCHAR(255),
                image VARCHAR(500),
                link TEXT,
                summary TEXT,
                content TEXT,
                category VARCHAR(255),
                facultyId VARCHAR(255)
            )
        `);

        await mysql_conn.execute(`
            CREATE TABLE IF NOT EXISTS confessions (
                id BIGINT PRIMARY KEY,
                content TEXT NOT NULL,
                timestamp BIGINT,
                likes INT DEFAULT 0,
                comments TEXT
            )
        `);

        console.log('✅ Tables created successfully!\n');

        // Migrate data from each table
        const tables = ['users', 'clubs', 'events', 'announcements', 'news', 'confessions'];

        for (const table of tables) {
            console.log(`📦 Migrating ${table}...`);

            try {
                const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();

                if (rows.length === 0) {
                    console.log(`   ⚠️  No data in ${table}\n`);
                    continue;
                }

                // Get column names from first row
                const columns = Object.keys(rows[0]);
                const placeholders = columns.map(() => '?').join(', ');
                const insertQuery = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

                let successCount = 0;
                for (const row of rows) {
                    try {
                        const values = columns.map(col => {
                            const val = row[col];
                            // Convert boolean to 0/1
                            if (typeof val === 'boolean') return val ? 1 : 0;
                            return val;
                        });

                        await mysql_conn.execute(insertQuery, values);
                        successCount++;
                    } catch (err) {
                        console.error(`   ❌ Error inserting row in ${table}:`, err.message);
                    }
                }

                console.log(`   ✅ Migrated ${successCount}/${rows.length} rows from ${table}\n`);
            } catch (err) {
                console.error(`   ❌ Error migrating ${table}:`, err.message, '\n');
            }
        }

        console.log('🎉 Migration completed successfully!');
        console.log('\n⚠️  IMPORTANT: Update your .env or environment variables to use MariaDB:');
        console.log(`   DB_HOST=${MYSQL_CONFIG.host}`);
        console.log(`   DB_USER=${MYSQL_CONFIG.user}`);
        console.log(`   DB_PASS=<your-password>`);
        console.log(`   DB_NAME=${MYSQL_CONFIG.database}`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        sqlite.close();
        await mysql_conn.end();
    }
}

// Run migration
migrate()
    .then(() => {
        console.log('\n✅ All done!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ Fatal error:', err);
        process.exit(1);
    });
