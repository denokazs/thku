
const http = require('http');

async function test() {
    console.log('--- Testing Auth API ---');

    // 1. Login
    console.log('\n1. Testing Login...');
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: '123' })
    });

    if (loginRes.ok) {
        console.log('✅ Login Successful');
        const data = await loginRes.json();
        console.log('User:', data.user);

        // Note: fetch in Node doesn't automatically store cookies like browser
        // For strict testing we'd need to grab Set-Cookie, but for now we just check API logic returns 200
    } else {
        console.error('❌ Login Failed', await loginRes.text());
    }

    // 2. Create User
    console.log('\n2. Testing Create User...');
    const createRes = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'testuser_' + Date.now(),
            password: '123',
            role: 'club_admin',
            clubId: 1
        })
    });

    if (createRes.ok) {
        console.log('✅ Create User Successful');
        console.log(await createRes.json());
    } else {
        console.error('❌ Create User Failed', await createRes.text());
    }

    // 3. List Users
    console.log('\n3. List Users...');
    const listRes = await fetch('http://localhost:3000/api/users');
    const users = await listRes.json();
    console.log(`✅ Found ${users.length} users`);
    console.log(users.map(u => `${u.username} (${u.role})`).join(', '));

}

test();
