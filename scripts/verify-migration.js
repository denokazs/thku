
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function verifyMigration() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    console.log(`Connecting to ${dbConfig.host}:${dbConfig.port}...`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL successfully.');

        const tables = ['users', 'clubs', 'events', 'news', 'announcements', 'forum_posts'];

        console.log('\n--- Data Verification ---');
        for (const table of tables) {
            const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`${table}: ${rows[0].count} rows`);
        }
        console.log('-------------------------\n');

        await connection.end();
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    }
}

verifyMigration();
