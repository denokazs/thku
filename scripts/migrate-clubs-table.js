
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function migrate() {
    console.log('Migrating "clubs" table...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        // Add phone column
        try {
            await connection.query('ALTER TABLE clubs ADD COLUMN phone VARCHAR(20) NULL AFTER email');
            console.log('✅ Added "phone" column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ "phone" column already exists.');
            else console.error('Error adding phone:', e.message);
        }

        // Add website column
        try {
            await connection.query('ALTER TABLE clubs ADD COLUMN website VARCHAR(255) NULL AFTER phone');
            console.log('✅ Added "website" column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ "website" column already exists.');
            else console.error('Error adding website:', e.message);
        }

        // Add socialMedia column if not exists (check schema said it might be there but let's be safe)
        try {
            await connection.query('ALTER TABLE clubs ADD COLUMN socialMedia TEXT NULL AFTER website');
            console.log('✅ Added "socialMedia" column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ "socialMedia" column already exists.');
            else console.error('Error adding socialMedia:', e.message);
        }

        // Add email column if not (check schema said it might be there)
        try {
            await connection.query('ALTER TABLE clubs ADD COLUMN email VARCHAR(255) NULL AFTER name');
            console.log('✅ Added "email" column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️ "email" column already exists.');
            else console.error('Error adding email:', e.message);
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
    }
}

migrate();
