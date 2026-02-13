
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

async function fixEncoding() {
    console.log('Connecting to DB...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Fixing encoding issues...');

        // Fix single quotes
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&amp;#x27;', \"'\")");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&#x27;', \"'\")");

        // Fix double quotes
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&amp;quot;', '\"')");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&quot;', '\"')");

        // Fix other common entities
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&amp;amp;', '&')");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&amp;lt;', '<')");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&lt;', '<')");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&amp;gt;', '>')");
        await connection.query("UPDATE clubs SET description = REPLACE(description, '&gt;', '>')");

        // --- Fix longDescription (Detail Page) ---
        console.log('Fixing longDescription...');
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&amp;#x27;', \"'\")");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&#x27;', \"'\")");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&amp;quot;', '\"')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&quot;', '\"')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&amp;amp;', '&')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&amp;lt;', '<')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&lt;', '<')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&amp;gt;', '>')");
        await connection.query("UPDATE clubs SET longDescription = REPLACE(longDescription, '&gt;', '>')");

        console.log('✅ Encoding fixed successfully!');
    } catch (error) {
        console.error('Error fixing encoding:', error);
    } finally {
        await connection.end();
    }
}

fixEncoding();
