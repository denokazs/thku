const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');


const NEWS_SCRAPED_PATH = path.join(__dirname, '../data/news-scraped.json');

// Helper to get existing news IDs
function getExistingNewsIds() {
    if (!fs.existsSync(NEWS_SCRAPED_PATH)) {
        return new Set();
    }
    const data = JSON.parse(fs.readFileSync(NEWS_SCRAPED_PATH, 'utf8'));
    return new Set(data.map(item => item.id));
}

// Fetch the listing page to detect new items
function fetchNewItems() {
    return new Promise((resolve, reject) => {
        const url = 'https://thk.edu.tr/haberler';
        const req = https.get(url, { rejectUnauthorized: false }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function checkForNewNews() {
    console.log(`[${new Date().toISOString()}] Checking for new news...`);

    try {
        const existingIds = getExistingNewsIds();
        const listingHtml = await fetchNewItems();

        // Extract news IDs from listing
        const ITEM_REGEX = /\/haberler\/(\d+)\//g;
        const foundIds = new Set();
        let match;

        while ((match = ITEM_REGEX.exec(listingHtml)) !== null) {
            foundIds.add(parseInt(match[1]));
        }

        // Find new IDs
        const newIds = [...foundIds].filter(id => !existingIds.has(id));

        if (newIds.length > 0) {
            console.log(`Found ${newIds.length} new news items!`);
            console.log('Running full scraper to update...');

            // Run the scraper
            execSync('node scripts/scrape-thk-full.js', {
                cwd: path.join(__dirname, '..'),
                stdio: 'inherit'
            });

            // Sync to SQLite
            execSync('node scripts/sync-news.js', {
                cwd: path.join(__dirname, '..'),
                stdio: 'inherit'
            });

            console.log('News update complete!');
        } else {
            console.log('No new news items found.');
        }
    } catch (error) {
        console.error('Error checking for new news:', error.message);
    }
}

// Run immediately
checkForNewNews();
