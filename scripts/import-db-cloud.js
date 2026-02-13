
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function importDatabase() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true
    };

    console.log(`Connecting to ${dbConfig.host}:${dbConfig.port} as ${dbConfig.user}...`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully.');

        const sqlPath = path.join(__dirname, '..', 'thkucomt_main.sql');
        if (!fs.existsSync(sqlPath)) {
            console.error('SQL dump file not found at:', sqlPath);
            process.exit(1);
        }

        console.log('Reading SQL dump...');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Executing SQL dump (this might take a moment)...');
        await connection.query(sql);

        console.log('Import completed successfully!');
        await connection.end();
    } catch (error) {
        console.error('Import failed:', error.message);
        fs.writeFileSync('import_error.txt', error.stack || error.message);
        process.exit(1);
    }
}

importDatabase();
