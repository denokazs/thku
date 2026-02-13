const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'temp_scrape.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// Regex patterns
const itemRegex = /<div class="haberler-page-item">([\s\S]*?)<div class="haberler-page-date">[\s\S]*?<\/div>\s*<\/div>/g;
const titleRegex = /<h5>(.*?)<\/h5>/;
const dateRegex = /<div class="date">(.*?)<\/div>/;
const imageRegex = /<img src="([^"]+)"/;
const linkRegex = /<a href="([^"]+)">Oku<\/a>/;

const newsItems = [];
let match;

console.log("Starting regex extraction...");

while ((match = itemRegex.exec(html)) !== null) {
    const block = match[0];

    // Extract Title
    const titleMatch = titleRegex.exec(block);
    const title = titleMatch ? titleMatch[1].trim() : 'No Title';

    // Extract Date
    const dateMatch = dateRegex.exec(block);
    const date = dateMatch ? dateMatch[1].trim() : 'No Date';

    // Extract Image
    const imageMatch = imageRegex.exec(block);
    const imageUrl = imageMatch ? imageMatch[1] : 'No Image';

    // Extract Link
    const linkMatch = linkRegex.exec(block);
    const link = linkMatch ? linkMatch[1] : 'No Link';

    newsItems.push({
        title,
        date,
        imageUrl,
        link
    });
}

console.log(`Found ${newsItems.length} news items.`);
if (newsItems.length > 0) {
    console.log("First item:", newsItems[0]);
    console.log("Last item:", newsItems[newsItems.length - 1]);
} else {
    console.log("No items found. Check regex.");
}
