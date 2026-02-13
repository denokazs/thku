const https = require('https');
const fs = require('fs');
const path = require('path');
const he = require('he');

const LISTING_FILE = path.join(__dirname, 'temp_scrape.html');
const OUTPUT_FILE = path.join(__dirname, '../data/news-scraped.json');
const IMAGE_DIR = path.join(__dirname, '../public/images/news');
const CONCURRENCY_LIMIT = 20;

if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

const getWithTimeout = (url, timeout = 10000) => {
    return new Promise((resolve, reject) => {
        if (!url.startsWith('http')) {
            if (url.startsWith('/')) url = 'https://thk.edu.tr' + url;
            else url = 'https://thk.edu.tr/' + url;
        }

        const req = https.get(url, { rejectUnauthorized: false }, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
                return;
            }
            resolve(res);
        });

        req.on('error', (err) => reject(err));
        req.setTimeout(timeout, () => {
            req.destroy();
            reject(new Error(`Timeout fetching ${url}`));
        });
    });
};

const downloadImage = (url, localPath) => {
    return getWithTimeout(url)
        .then(res => {
            return new Promise((resolve, reject) => {
                const file = fs.createWriteStream(localPath);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
                file.on('error', (err) => {
                    fs.unlink(localPath, () => { });
                    reject(err);
                });
            });
        });
};

const fetchDetailPage = (url) => {
    return getWithTimeout(url)
        .then(res => {
            return new Promise((resolve, reject) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve(data));
                res.on('error', err => reject(err));
            });
        });
};

const LISTING_ITEM_REGEX = /<div class="haberler-page-item">([\s\S]*?)<div class="haberler-page-date">[\s\S]*?<a href="([^"]+)">Oku<\/a>/g;
const TITLE_REGEX = /<h5>(.*?)<\/h5>/;
const DATE_REGEX = /<div class="date">(.*?)<\/div>/;
const LISTING_IMG_REGEX = /<img src="([^"]+)"/;
const DETAIL_CONTENT_BLOCK_REGEX = /<div class="content-title">\s*<h3>(.*?)<\/h3>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="col-12 col-md-5/;
const DETAIL_DATE_REGEX = /<div class="date-inner">[\s\S]*?<h6>\s*(.*?)\s*<\/h6>/;

// Shared state
let scrapedData = [];
let processedCount = 0;
let totalCount = 0;

async function processItem(item) {
    try {
        const detailHtml = await fetchDetailPage(item.link);
        let content = '';
        const contentMatch = detailHtml.match(DETAIL_CONTENT_BLOCK_REGEX);
        if (contentMatch) {
            content = contentMatch[2].trim();
        }

        const detailDateMatch = detailHtml.match(DETAIL_DATE_REGEX);
        const finalDate = detailDateMatch ? detailDateMatch[1].trim() : item.date;

        const idMatch = item.link.match(/\/haberler\/(\d+)\//);
        const id = idMatch ? parseInt(idMatch[1]) : Date.now() + Math.floor(Math.random() * 1000);

        const newsImgDir = path.join(IMAGE_DIR, id.toString());
        if (!fs.existsSync(newsImgDir)) {
            fs.mkdirSync(newsImgDir, { recursive: true });
        }

        let mainImageLocalPath = '';
        if (item.listingImage) {
            const ext = path.extname(item.listingImage).split('?')[0] || '.jpg';
            const mainImgName = `main${ext}`;
            const localPath = path.join(newsImgDir, mainImgName);
            try {
                await downloadImage(item.listingImage, localPath);
                mainImageLocalPath = `/images/news/${id}/${mainImgName}`;
            } catch (e) { }
        }

        const imgTagRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
        let imgTagMatch;
        let newContent = content;
        const contentImages = [];
        while ((imgTagMatch = imgTagRegex.exec(content)) !== null) {
            contentImages.push(imgTagMatch[1]);
        }

        for (let j = 0; j < contentImages.length; j++) {
            const rawUrl = contentImages[j];
            const ext = path.extname(rawUrl).split('?')[0] || '.jpg';
            const contentImgName = `content-${j}${ext}`;
            const localPath = path.join(newsImgDir, contentImgName);
            try {
                await downloadImage(rawUrl, localPath);
                const newUrl = `/images/news/${id}/${contentImgName}`;
                newContent = newContent.replace(rawUrl, newUrl);
            } catch (e) { }
        }

        scrapedData.push({
            id: id,
            facultyId: 1,
            title: he.decode(item.title),
            date: finalDate,
            summary: he.decode(newContent.replace(/<[^>]+>/g, '')).substring(0, 150) + '...',
            content: he.decode(newContent),
            image: mainImageLocalPath,
            category: 'Genel'
        });

    } catch (err) {
        // console.error(`  Error processing ${item.link}:`, err.message);
    }
    processedCount++;
    if (processedCount % 10 === 0) {
        console.log(`Progress: ${processedCount}/${totalCount}`);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2));
    }
}

async function scrape() {
    console.log('Starting concurrent scrape...');

    if (!fs.existsSync(LISTING_FILE)) {
        console.error('Listing file not found.');
        return;
    }

    const listingHtml = fs.readFileSync(LISTING_FILE, 'utf8');
    const newsItems = [];
    let match;

    while ((match = LISTING_ITEM_REGEX.exec(listingHtml)) !== null) {
        const block = match[1];
        const link = match[2];
        const titleMatch = block.match(TITLE_REGEX);
        const dateMatch = block.match(DATE_REGEX);
        const imgMatch = block.match(LISTING_IMG_REGEX);

        if (titleMatch && link) {
            newsItems.push({
                title: titleMatch[1].trim(),
                date: dateMatch ? dateMatch[1].trim() : '',
                listingImage: imgMatch ? imgMatch[1] : null,
                link: link.replace(/&amp;/g, '&')
            });
        }
    }
    totalCount = newsItems.length;
    console.log(`Found ${totalCount} items. Processing with concurrency ${CONCURRENCY_LIMIT}...`);

    // Process chunked
    let index = 0;
    while (index < newsItems.length) {
        const batch = newsItems.slice(index, index + CONCURRENCY_LIMIT);
        await Promise.all(batch.map(item => processItem(item)));
        index += CONCURRENCY_LIMIT;
    }

    // Final save
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(scrapedData, null, 2));
    console.log('Done! Saved to ' + OUTPUT_FILE);
}

scrape();
