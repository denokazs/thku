
const { readDb } = require('./lib/db');

async function checkDuplicate() {
    const db = await readDb();
    const attendance = db.attendance || [];

    console.log('--- Current Attendance (First 5) ---');
    console.log(attendance.slice(0, 5));

    const testEventId = 1739578688463; // Example ID from previous context if available, or just check types
    // Actually, let's just check the types in the DB

    if (attendance.length > 0) {
        const first = attendance[0];
        console.log('\n--- Type Analysis ---');
        console.log(`EventID Type: ${typeof first.eventId}, Value: ${first.eventId}`);
        console.log(`UserID Type: ${typeof first.userId}, Value: ${first.userId}`);

        const searchId = String(first.eventId);
        const searchUser = String(first.userId);

        console.log(`\nStrict Check (eventId === "${searchId}"):`, first.eventId === searchId);
        console.log(`Loose Check (eventId == "${searchId}"):`, first.eventId == searchId);
    } else {
        console.log('No attendance records found to analyze.');
    }
}

checkDuplicate();
