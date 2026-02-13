
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function checkClubs() {
    console.log('Connecting to DB...', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        db: process.env.DB_NAME
    });

    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query("SELECT id, name, description FROM clubs WHERE name LIKE '%GDG%'");
        console.log('--- GDG CLUBS ---');
        rows.forEach(club => {
            console.log(`ID: ${club.id}, Name: ${club.name}`);
            console.log(`Description Raw: ${club.description}`);
        });
    } catch (error) {
        console.error('FULL ERROR:', error);
        if (error.code) console.error('Error Code:', error.code);
        if (error.errno) console.error('Error Errno:', error.errno);
        if (error.sqlMessage) console.error('SQL Message:', error.sqlMessage);
    } finally {
        if (connection) await connection.end();
    }
}

checkClubs();
