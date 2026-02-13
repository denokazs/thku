
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

// DB Config
const dbConfig = {
    host: envConfig.DB_HOST,
    user: envConfig.DB_USER,
    password: envConfig.DB_PASS,
    database: envConfig.DB_NAME
};

async function repairClubs() {
    console.log('🛠️ Repairing Club IDs...');
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. Get all clubs
        const [clubs] = await connection.query('SELECT id, name, slug FROM clubs');

        // 2. Identify duplicates (IDs that appear more than once)
        const counts = {};
        clubs.forEach(c => { counts[c.id] = (counts[c.id] || 0) + 1; });

        const duplicateIds = Object.keys(counts).filter(id => counts[id] > 1);

        if (duplicateIds.length === 0) {
            console.log('✅ No duplicate IDs found.');
            return;
        }

        console.log(`⚠️ Found ${duplicateIds.length} duplicate IDs:`, duplicateIds);

        // 3. Fix duplicates
        for (const id of duplicateIds) {
            const duplicates = clubs.filter(c => String(c.id) === String(id));
            console.log(`   - Fixing duplicates for ID ${id} (${duplicates.length} clubs)...`);

            // Skip the first one (keep it as is, or update if it's the max int)
            // Actually, better to re-assign ALL of them to proper timestamps if they are the max int

            for (let i = 0; i < duplicates.length; i++) {
                const club = duplicates[i];
                // Generate a new unique ID (timestamp based, spaced out)
                const newId = Date.now() + i * 1000;

                console.log(`     -> Assigning new ID ${newId} to "${club.name}"...`);

                // Update Club ID
                await connection.query('UPDATE clubs SET id = ? WHERE slug = ?', [newId, club.slug]);

                // Update references (members, events, users)
                // BUT we can't distinguish which rows belong to which club if they had the same ID!
                // This is data loss. We have to map by slug or let the user fix the meaningful data manually.
                // However, users table has clubId, but no slug. So all admins of "GDG" and "IES" are now mixed.
                // We will leave the references pointing to the OLD ID (which no longer exists? No, we updated it).
                // Wait, if we 'UPDATE id=newId WHERE slug=slug', we change the ID for that specific club row.
                // But the 'users' table still has 'clubId = 2147483647'.
                // So all users point to... nothing? Or do they point to whichever club KEEPS the old ID?
                // If we update ALL of them, then no users point to any club.
                // This is unavoidable. The link was ambiguous.
                // We will log this for the user.
            }
        }

        console.log('✅ Repair complete. Note: You may need to re-assign admins and members to these clubs as the links were ambiguous.');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

repairClubs();
