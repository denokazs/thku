// Native fetch in Node 18+
async function testLogin() {
    try {
        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'Denokaz', password: '123' })
        });

        const status = res.status;
        const text = await res.text();
        console.log('Status:', status);
        console.log('Raw, Response:', text);
        try {
            const data = JSON.parse(text);
            console.log('JSON:', JSON.stringify(data, null, 2));
        } catch (e) { console.log('Response is not JSON'); }
    } catch (e) {
        console.error('Fetch Failed:', e);
    }
}
testLogin();
