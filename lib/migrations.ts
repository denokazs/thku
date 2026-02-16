// Automatic Database Migration System
// Safely creates required tables if they don't exist

import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thk_db',
    multipleStatements: true, // Required for migrations
};

/**
 * Run database migrations
 * SAFE: Uses "CREATE TABLE IF NOT EXISTS" - won't touch existing data
 */
export async function runMigrations() {
    // Only run migrations for MySQL (Railway)
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';

    if (!useMysql) {
        console.log('[Migrations] Skipping (not using MySQL)');
        return { success: true, message: 'Skipped (SQLite mode)' };
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('[Migrations] Connected to database');

        // Migration: Create api_logs table
        const apiLogsTableSQL = `
            CREATE TABLE IF NOT EXISTS \`api_logs\` (
              \`id\` BIGINT NOT NULL AUTO_INCREMENT,
              \`timestamp\` BIGINT NOT NULL,
              \`method\` VARCHAR(10) NOT NULL,
              \`endpoint\` VARCHAR(500) NOT NULL,
              \`userId\` VARCHAR(255) DEFAULT NULL,
              \`username\` VARCHAR(255) DEFAULT NULL,
              \`ipAddress\` VARCHAR(45) NOT NULL,
              \`userAgent\` TEXT DEFAULT NULL,
              \`country\` VARCHAR(100) DEFAULT NULL,
              \`city\` VARCHAR(100) DEFAULT NULL,
              \`region\` VARCHAR(100) DEFAULT NULL,
              \`statusCode\` INT DEFAULT NULL,
              \`responseTime\` INT DEFAULT NULL,
              \`requestBody\` TEXT DEFAULT NULL,
              \`responseError\` TEXT DEFAULT NULL,
              \`gpsLatitude\` DECIMAL(10, 8) DEFAULT NULL,
              \`gpsLongitude\` DECIMAL(11, 8) DEFAULT NULL,
              \`gpsAccuracy\` FLOAT DEFAULT NULL,
              \`gpsAddress\` TEXT DEFAULT NULL,
              \`gpsStreet\` VARCHAR(255) DEFAULT NULL,
              \`gpsCity\` VARCHAR(100) DEFAULT NULL,
              \`gpsPostalCode\` VARCHAR(20) DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              INDEX \`idx_timestamp\` (\`timestamp\`),
              INDEX \`idx_userId\` (\`userId\`),
              INDEX \`idx_endpoint\` (\`endpoint\`(255)),
              INDEX \`idx_ipAddress\` (\`ipAddress\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;

        await connection.execute(apiLogsTableSQL);
        console.log('[Migrations] ✅ api_logs table ready');

        return {
            success: true,
            message: 'Migrations completed successfully',
            tables: ['api_logs']
        };
    } catch (error) {
        console.error('[Migrations] Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : String(error)
        };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

/**
 * Check if migrations are needed
 */
export async function checkMigrations() {
    const useMysql = process.env.NODE_ENV === 'production' || process.env.DB_TYPE === 'mysql';
    if (!useMysql) return { needed: false };

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // Check if api_logs table exists
        const [rows]: any = await connection.execute(
            `SELECT COUNT(*) as count FROM information_schema.tables 
             WHERE table_schema = ? AND table_name = 'api_logs'`,
            [dbConfig.database]
        );

        const apiLogsExists = rows[0]?.count > 0;

        return {
            needed: !apiLogsExists,
            missing: apiLogsExists ? [] : ['api_logs']
        };
    } catch (error) {
        console.error('[Migrations] Check error:', error);
        return { needed: true, error: String(error) };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}
