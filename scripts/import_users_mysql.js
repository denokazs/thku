
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
let env = {};
try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim();
                env[key] = value;
            }
        });
        console.log('Loaded .env.local');
    }
} catch (e) {
    console.log('Could not load .env.local:', e.message);
}

const DB_HOST = env.DB_HOST || 'localhost';
const DB_USER = env.DB_USER || 'root';
const DB_PASS = env.DB_PASS || '';
const DB_NAME = env.DB_NAME || 'thk_db';

async function importUsers() {
    // 1. Connect without Database to Create it
    console.log('Connecting to MySQL Server...', DB_HOST);
    let connection;
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS
        });
        console.log('Connected to MySQL Server.');

        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`Database ${DB_NAME} ensured.`);
        await connection.end();

        // 2. Connect to Database and Import
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        });
        console.log(`Connected to database ${DB_NAME}.`);

        // Create table if not exists (minimal schema for users)
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR(255) PRIMARY KEY,
                username VARCHAR(255),
                password VARCHAR(255),
                name VARCHAR(255),
                role VARCHAR(255),
                clubId INT,
                email VARCHAR(255),
                phone VARCHAR(255),
                studentId VARCHAR(255),
                department VARCHAR(255),
                createdAt VARCHAR(255)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `;
        await connection.query(createTableSql);

        // Add columns if they don't exist
        try {
            await connection.query('ALTER TABLE users ADD COLUMN resetToken VARCHAR(255) DEFAULT NULL');
            console.log('Added resetToken column');
        } catch (e) {
            if (!e.message.includes('Duplicate column')) console.log('resetToken column check:', e.message);
        }

        try {
            await connection.query('ALTER TABLE users ADD COLUMN resetTokenExpire BIGINT(20) DEFAULT NULL');
            console.log('Added resetTokenExpire column');
        } catch (e) {
            if (!e.message.includes('Duplicate column')) console.log('resetTokenExpire column check:', e.message);
        }

        // Clear existing users
        await connection.query('TRUNCATE TABLE users');
        console.log('Cleared existing users');

        // Insert provided users
        const sql = `
            INSERT INTO users (id, username, password, name, role, clubId, email, phone, studentId, department, createdAt) 
            VALUES 
            ('1', 'admin', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'super_admin', NULL, NULL, NULL, NULL, NULL, NULL),
            ('1770405154516', 'deniz', '$2b$10$aYdAAlEG2CZKRrFkZsmyNOw3tDsi3CVHhuZYuXkRVt8jnSyegfpFq', 'Deniz Kazmacı', 'super_admin', NULL, 'kazmacideniz@gmail.com', '05382533330', '250445013', NULL, '2026-02-06T19:12:34.516Z'),
            ('1770408827052', 'ies', '$2b$10$8NT2OR0xJcWtfmnh4gZRWuRdYoXtFySJQIfBBRfdqYDsDRu5JZgQW', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
            ('2', 'robotics', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 1, NULL, NULL, NULL, NULL, NULL),
            ('3', 'siber', '$2a$10$EpRnTzVlqHNP0.fUbXUwSO9Vmms/DEjfgrZffZTPwry90w0wWjM.y', NULL, 'club_admin', 2, NULL, NULL, 38, NULL, NULL),
            ('denosbir', 'denosbir', '$2b$10$OvoR6r5xV0PkGnhFyAYmEukeRsYblUaISQnyeXIq3Ea8wZ6vm4hcm', 'deniz kazmacı', 'club_admin', 1, 'denosbir@gmail.com', '05382533330', '', NULL, NULL),
            ('verify-1770742182216', 'verify_user_1770742182216', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:42.216Z'),
            ('verify-1770742199144', 'verify_user_1770742199144', NULL, 'Verification User', 'student', NULL, NULL, NULL, NULL, NULL, '2026-02-10T16:49:59.144Z')
        `;

        await connection.query(sql);
        console.log('Successfully imported production users into local MySQL.');

    } catch (error) {
        console.error('Import failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

importUsers();
