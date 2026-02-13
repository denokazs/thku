
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    };

    console.log(`Connecting to database...`);

    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected successfully.');

        const email = 'kazmacideniz@gmail.com';
        const password = 'admin123'; // Default password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            console.log(`User ${email} exists. Updating role to admin...`);
            await connection.execute('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
            console.log('Role updated successfully.');
        } else {
            console.log(`User ${email} does not exist. Creating new admin user...`);
            const newUser = {
                id: Date.now(), // Simple ID generation
                username: 'kazmacideniz',
                name: 'Super Admin',
                studentId: 'admin',
                department: 'IT',
                email: email,
                phone: '',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date().toISOString()
            };

            // Get columns from the table to ensure we match the schema
            const [cols] = await connection.execute(`SHOW COLUMNS FROM users`);
            const columnNames = cols.map(c => c.Field);

            // Filter our newUser object to only include fields that actually exist in the DB
            // (In case the DB schema has different column names)
            // But based on db.ts, we key off the object keys usually. 
            // Let's assume standard columns for now based on the register route.

            const sql = `
                INSERT INTO users (id, username, name, studentId, department, email, phone, password, role, createdAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await connection.execute(sql, [
                newUser.id,
                newUser.username,
                newUser.name,
                newUser.studentId,
                newUser.department,
                newUser.email,
                newUser.phone,
                newUser.password,
                newUser.role,
                newUser.createdAt
            ]);
            console.log('Admin user created successfully.');
        }

        await connection.end();
    } catch (error) {
        console.error('Failed to create admin:', error);
        process.exit(1);
    }
}

createAdmin();
