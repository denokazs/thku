const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(process.cwd(), 'data', 'thk.db');
const NEWS_SCRAPED_FILE = path.join(process.cwd(), 'data', 'news-scraped.json');

function syncNews() {
    if (!fs.existsSync(NEWS_SCRAPED_FILE)) {
        console.log('No scraped news file found. Skipping sync.');
        return;
    }

    try {
        const scrapedNews = JSON.parse(fs.readFileSync(NEWS_SCRAPED_FILE, 'utf8'));
        if (!Array.isArray(scrapedNews) || scrapedNews.length === 0) {
            console.log('Scraped news file is empty.');
            return;
        }

        const db = new Database(DB_PATH);

        // Ensure table exists (just in case)
        db.exec(`
            CREATE TABLE IF NOT EXISTS news (
                id INTEGER PRIMARY KEY,
                title TEXT,
                date TEXT,
                category TEXT,
                summary TEXT,
                content TEXT,
                facultyId TEXT
            )
        `);

        const insert = db.prepare(`
            INSERT OR REPLACE INTO news (id, title, date, category, summary, content, facultyId)
            VALUES (@id, @title, @date, @category, @summary, @content, @facultyId)
        `);

        const insertMany = db.transaction((newsItems) => {
            for (const item of newsItems) {
                insert.run(item);
            }
        });

        insertMany(scrapedNews);
        console.log(`Successfully synced ${scrapedNews.length} news items to SQLite.`);
        db.close();

    } catch (error) {
        console.error('Failed to sync news to SQLite:', error);
        process.exit(1);
    }
}

syncNews();
