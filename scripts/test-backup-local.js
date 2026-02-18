
const http = require('http');

const options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/api/admin/backup',
    method: 'GET',
    headers: {
        // Mock a super admin cookie if possible, but middleware might block. 
        // Actually, the route checks cookies().get('auth_session').
        // We can't easily mock that without a real session token.
        // So this script might just get 401, which confirms the server is up at least.
    }
};

const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response Body:', data);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();
