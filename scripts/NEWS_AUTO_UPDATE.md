# THK News Auto-Update System

This system automatically checks for new news articles from `thk.edu.tr` every 24 hours and updates the database.

## Components

### 1. `scrape-thk-full.js`
Main scraper that fetches all news articles (concurrent processing with 20 parallel connections).

### 2. `auto-update-news.js`
Detection script that:
- Fetches the news listing page
- Compares with existing news IDs
- Runs full scraper if new items are found
- Re-seeds the database

### 3. `news-scheduler.js`
Cron service that runs `auto-update-news.js` every 24 hours at midnight (Turkish timezone).

## Usage

### One-Time Manual Update
```bash
node scripts/auto-update-news.js
```

### Start Auto-Update Service (runs every 24 hours)
```bash
cd scripts
npm start
```

The service will:
- Run an initial check on startup
- Check for new news every day at midnight (00:00)
- Automatically scrape and update the database when new items are found

### Stop the Service
Press `Ctrl+C` in the terminal where the service is running.

## Running as a Background Service

### Windows (using pm2)
```bash
npm install -g pm2
pm2 start scripts/news-scheduler.js --name thk-news-updater
pm2 save
pm2 startup
```

### Linux/Mac (using systemd or screen)
```bash
# Using screen
screen -S thk-news
cd scripts && npm start
# Press Ctrl+A then D to detach

# To reattach
screen -r thk-news
```

## Monitoring

Check the console output when the service runs. It will show:
- Number of new items found (if any)
- Scraping progress
- Database update status

## Configuration

Edit `news-scheduler.js` to change the schedule:
```javascript
// Current: Every day at midnight
cron.schedule('0 0 * * *', ...)

// Every 12 hours at noon and midnight
cron.schedule('0 0,12 * * *', ...)

// Every 6 hours
cron.schedule('0 */6 * * *', ...)
```

## Notes

- The scraper processes all 516 available news items on each run
- Successfully scraped items are incrementally saved to prevent data loss
- Images are automatically downloaded to `/public/images/news/`
- Timezone is set to Europe/Istanbul by default
