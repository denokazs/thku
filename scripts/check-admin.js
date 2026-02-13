
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function checkAdmin() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    console.log(`Connecting to database...`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully.');

        const email = 'kazmacideniz@gmail.com';
        const password = 'admin123';

        // Check if user exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log(`User found: ${rows[0].email} (Role: ${rows[0].role})`);
            const isMatch = await bcrypt.compare(password, rows[0].password);
            console.log(`Password match for 'admin123': ${isMatch}`);
        } else {
            console.log('User NOT found in database.');
        }

        await connection.end();
    } catch (error) {
        console.error('Check failed:', error);
    }
}

checkAdmin();
