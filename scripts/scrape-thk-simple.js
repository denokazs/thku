
const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://thk.edu.tr/haberler';

const options = {
    rejectUnauthorized: false,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Finished fetching data. Length:', data.length);
        // Save to file for inspection
        fs.writeFileSync(path.join(__dirname, 'temp_scrape.html'), data);
        console.log('Saved to scripts/temp_scrape.html');

        // Basic Regex parsing to test feasibility
        // Looking for common news patterns, e.g., <div class="news-item"> or similar
        // Just printing first 500 chars to verify it's HTML
        console.log('Preview:', data.substring(0, 500));
    });

}).on('error', (err) => {
    console.error('Error fetching page:', err.message);
});
