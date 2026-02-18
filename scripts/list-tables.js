
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function listTables() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in DB:', rows.map(r => Object.values(r)[0]));
        await connection.end();
    } catch (error) {
        console.error(error);
    }
}

listTables();
