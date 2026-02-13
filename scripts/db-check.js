
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkDb() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    console.log('--- DB CONNECTION TEST ---');
    console.log(`Host: ${dbConfig.host}`);
    console.log(`User: ${dbConfig.user}`);
    console.log(`DB: ${dbConfig.database}`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Connected successfully!');

        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Query Result:', rows[0].result);

        const [users] = await connection.execute('SELECT id, email, role FROM users WHERE email = ?', ['kazmacideniz@gmail.com']);
        console.log('Admin User Check:', users.length > 0 ? users[0] : 'NOT FOUND');

        await connection.end();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
    }
}

checkDb();
