
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
    console.log('Checking "clubs" table schema...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        const [columns] = await connection.query('SHOW COLUMNS FROM clubs');
        const columnNames = columns.map(c => c.Field);

        console.log('Existing columns:', columnNames.join(', '));

        const requiredFields = ['email', 'phone', 'website', 'socialMedia'];
        const missingFields = requiredFields.filter(field => !columnNames.includes(field));

        if (missingFields.length > 0) {
            console.log('❌ Missing columns:', missingFields.join(', '));
            console.log('db_missing_columns=' + JSON.stringify(missingFields));
        } else {
            console.log('✅ All required columns exist.');
        }

    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await connection.end();
    }
}

checkSchema();
