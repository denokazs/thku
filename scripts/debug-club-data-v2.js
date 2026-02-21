
const mysql = require('mysql2/promise');
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
        console.log('Searching for clubs with "gdg" or "utaa"...');
        const [rows] = await connection.query(
            'SELECT id, slug, name, socialMedia FROM clubs WHERE slug LIKE ? OR name LIKE ?',
            ['%gdg%', '%utaa%']
        );

        if (rows.length === 0) {
            console.log('No matching clubs found.');
        } else {
            rows.forEach(club => {
                console.log(`Club: ${club.name} (${club.slug})`);
                console.log(`SocialMedia Raw: '${club.socialMedia}'`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await connection.end();
    }
}

checkClubData();
