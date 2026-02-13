
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuration
const JSON_PATH = path.join(__dirname, '../data/db-export.json');
const DB_CONFIG = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thkucomt_main',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

async function importData() {
    console.log('🚀 Starting JSON → MariaDB Import...');

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`❌ JSON export file not found at ${JSON_PATH}`);
        process.exit(1);
    }

    console.log('📂 Reading JSON file...');
    const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
    const data = JSON.parse(rawData);

    console.log('🔌 Connecting to MariaDB...');
    const conn = await mysql.createConnection(DB_CONFIG);

    try {
        for (const tableName of Object.keys(data)) {
            const rows = data[tableName];
            if (!Array.isArray(rows) || rows.length === 0) {
                console.log(`⚠️  Skipping ${tableName} (empty or invalid)`);
                continue;
            }

            console.log(`📦 Importing ${tableName} (${rows.length} rows)...`);

            // Get columns from database to match
            const [columns] = await conn.query(`SHOW COLUMNS FROM ${tableName}`);
            const dbCols = columns.map(c => c.Field);

            // Construct INSERT statement
            const placeholders = dbCols.map(() => '?').join(', ');
            const sql = `INSERT INTO ${tableName} (${dbCols.join(', ')}) VALUES (${placeholders})`;

            let successCount = 0;
            for (const row of rows) {
                try {
                    const values = dbCols.map(col => {
                        let val = row[col];
                        if (typeof val === 'object' && val !== null) {
                            val = JSON.stringify(val);
                        }
                        if (typeof val === 'boolean') {
                            val = val ? 1 : 0;
                        }
                        return val;
                    });

                    await conn.execute(sql, values);
                    successCount++;
                } catch (err) {
                    console.error(`   ❌ Failed to insert row into ${tableName}: ${err.message}`);
                }
            }
            console.log(`   ✅ Imported ${successCount}/${rows.length} rows into ${tableName}`);
        }

        console.log('\n🎉 Import completed successfully!');

    } catch (err) {
        console.error('❌ Import failed:', err);
    } finally {
        await conn.end();
    }
}

importData();
