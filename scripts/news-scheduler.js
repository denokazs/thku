const cron = require('node-cron');
const { execSync } = require('child_process');
const path = require('path');

console.log('THK News Auto-Update Service Started');
console.log('Checking for new news every 24 hours at midnight...');
console.log('Press Ctrl+C to stop the service');

// Schedule task to run every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
    console.log('\n=== Scheduled News Update ===');
    console.log(`Time: ${new Date().toLocaleString()}`);

    try {
        execSync('node scripts/auto-update-news.js', {
            cwd: __dirname,
            stdio: 'inherit'
        });
    } catch (error) {
        console.error('Error running auto-update:', error.message);
    }
}, {
    timezone: "Europe/Istanbul"
});

// Optional: Run immediately on startup
console.log('\nRunning initial check...');
try {
    execSync('node scripts/auto-update-news.js', {
        cwd: __dirname,
        stdio: 'inherit'
    });
} catch (error) {
    console.error('Error running initial check:', error.message);
}

console.log('\n✓ Service is running. Next check: midnight (00:00)');

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\nShutting down news auto-update service...');
    process.exit(0);
});
