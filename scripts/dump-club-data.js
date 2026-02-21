
const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function checkClubData() {

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        const [rows] = await connection.query(
            'SELECT id, slug, name, email, phone, website, socialMedia FROM clubs WHERE slug LIKE ? OR name LIKE ?',
            ['%gdg%', '%utaa%']
        );

        fs.writeFileSync('club_data_dump.json', JSON.stringify(rows, null, 2));
        console.log('Data written to club_data_dump.json');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkClubData();
