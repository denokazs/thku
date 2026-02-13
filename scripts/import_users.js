
const Database = require('better-sqlite3');
const db = new Database('db.sqlite');

try {
    // 1. Add columns if they don't exist
    try {
        db.prepare('ALTER TABLE users ADD COLUMN resetToken TEXT').run();
        console.log('Added resetToken column');
    } catch (e) {
        if (!e.message.includes('duplicate column')) console.log('resetToken column check:', e.message);
    }

    try {
        db.prepare('ALTER TABLE users ADD COLUMN resetTokenExpire INTEGER').run();
        console.log('Added resetTokenExpire column');
    } catch (e) {
        if (!e.message.includes('duplicate column')) console.log('resetTokenExpire column check:', e.message);
    }

    // 2. Clear existing users
    db.prepare('DELETE FROM users').run();
    console.log('Cleared existing users');

    // 3. Insert provided users
    const match = db.prepare(`
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
    `);

    match.run();
    console.log('Successfully imported production users.');

} catch (error) {
    console.error('Migration failed:', error);
}

db.close();
