const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://thk.edu.tr/haberler/5175/bassagligi';
const dest = path.join(__dirname, 'temp_detail.html');

const agent = new https.Agent({
    rejectUnauthorized: false
});

https.get(url, { agent }, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        fs.writeFileSync(dest, data);
        console.log(`Saved to ${dest}`);
        // Print the length of the file
        console.log(`File size: ${data.length} bytes`);
    });
}).on('error', (e) => {
    console.error(e);
});
