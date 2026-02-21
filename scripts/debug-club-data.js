
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function checkClubData() {
    const searchSlug = 'google-developer-groups-on-campus-utaa'; // Trying to guess the slug, or I'll search broadly

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        console.log('Searching for clubs...');
        // Search for clubs with 'gdg' or 'google' or 'utaa' in slug or name to find the right one
        const [rows] = await connection.query(
            'SELECT id, slug, name, email, phone, website, socialMedia FROM clubs WHERE slug LIKE ? OR name LIKE ?',
            ['%gdg%', '%google%']
        );

        if (rows.length === 0) {
            console.log('No matching clubs found via search.');
            // Dump all slugs to help Identify
            const [allClubs] = await connection.query('SELECT slug FROM clubs');
            console.log('Available slugs:', allClubs.map(c => c.slug).join(', '));
        } else {
            rows.forEach(club => {
                console.log('------------------------------------------------');
                console.log(`Club: ${club.name} (${club.slug})`);
                console.log(`Email: ${club.email}`);
                console.log(`Phone: ${club.phone}`);
                console.log(`Website: ${club.website}`);
                console.log(`SocialMedia (Raw):`, club.socialMedia);
                console.log(`SocialMedia (Type):`, typeof club.socialMedia);
            });
        }

    } catch (error) {
        console.error('Error fetching club data:', error);
    } finally {
        await connection.end();
    }
}

checkClubData();
