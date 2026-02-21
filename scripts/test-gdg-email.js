require('dotenv').config({ path: '.env.local' });
if (!process.env.SMTP_HOST) require('dotenv').config({ path: '.env' });

const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'thk_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false }
});

function getNewEventEmailTemplate(event, club) {
    const primaryColor = club.color || '#F97316';
    const eventImageUrl = event.image || event.coverImage || 'https://thku.com.tr/images/placeholder.jpg';
    const clubLogoUrl = club.logo || 'https://thku.com.tr/images/thk-logo.png';
    const eventDate = new Date(event.date);

    const formattedDate = new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(eventDate);

    const safeTitle = event.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeDescription = (event.description || '').replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeLocation = (event.location || 'Belirtilmedi').replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yeni Etkinlik: ${safeTitle}</title>
        <style>
            body, p, h1, h2 { margin: 0; padding: 0; }
            body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f3f4f6; color: #1f2937; line-height: 1.6; }
            img { max-width: 100%; height: auto; display: block; }
            a { text-decoration: none; }
            .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
            .header { padding: 30px; text-align: center; border-bottom: 1px solid #e5e7eb; }
            .club-logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px auto; }
            .club-name { font-size: 20px; font-weight: 700; color: ${primaryColor}; margin-bottom: 5px; }
            .header-subtitle { font-size: 14px; color: #6b7280; }
            .hero-image { width: 100%; height: 240px; object-fit: cover; }
            .content { padding: 40px 30px; }
            .event-title { font-size: 28px; font-weight: 800; color: #111827; line-height: 1.3; margin-bottom: 20px; }
            .event-description { font-size: 16px; color: #4b5563; margin-bottom: 30px; white-space: pre-wrap;}
            .details-box { background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid ${primaryColor}; }
            .detail-row { display: flex; align-items: flex-start; margin-bottom: 12px; }
            .detail-icon { font-size: 20px; margin-right: 12px; color: ${primaryColor}; }
            .detail-text { font-size: 15px; color: #374151; font-weight: 500;}
            .detail-label { display: block; font-size: 12px; color: #9ca3af; font-weight: 600; text-transform: uppercase; margin-bottom: 2px;}
            .action-wrapper { text-align: center; margin-top: 40px; }
            .btn { display: inline-block; background-color: ${primaryColor}; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 8px; }
            .footer { background-color: #1f2937; padding: 30px; text-align: center; color: #9ca3af; font-size: 13px; }
            .footer p { margin-bottom: 10px; }
            @media screen and (max-width: 600px) {
                .container { width: 100%; border-radius: 0; }
                .wrapper { padding: 0; }
                .content { padding: 30px 20px; }
                .hero-image { height: 200px; }
                .event-title { font-size: 24px; }
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <img src="${clubLogoUrl}" alt="${safeTitle} Logo" class="club-logo">
                    <h2 class="club-name">${club.name}</h2>
                    <p class="header-subtitle">yeni bir etkinlik duyurdu!</p>
                </div>
                <img src="${eventImageUrl}" alt="${safeTitle}" class="hero-image">
                <div class="content">
                    <h1 class="event-title">${safeTitle}</h1>
                    <div class="event-description">${safeDescription}</div>
                    <div class="details-box">
                        <div class="detail-row">
                            <div class="detail-icon">📅</div>
                            <div>
                                <span class="detail-label">Tarih</span>
                                <span class="detail-text">${formattedDate}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-icon">📍</div>
                            <div>
                                <span class="detail-label">Konum</span>
                                <span class="detail-text">${safeLocation}</span>
                            </div>
                        </div>
                    </div>
                    <div class="action-wrapper">
                        <a href="https://thku.com.tr/events/${event.id}" class="btn" style="color: #ffffff !important;">Etkinliği İncele</a>
                    </div>
                </div>
                <div class="footer">
                    <p>Bu e-posta, <strong>${club.name}</strong> üyesi olduğunuz için size gönderilmiştir.</p>
                    <p>THK Üniversitesi Topluluk Yönetim Sistemi</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

async function run() {
    console.log("Connecting to MySQL Database...");
    const db = await mysql.createPool(dbConfig);

    console.log("Looking for GDG Club...");
    const [clubs] = await db.query("SELECT * FROM clubs WHERE name LIKE '%GDG%' OR name LIKE '%Google Developer%'");

    if (clubs.length === 0) {
        console.error("GDG Club not found in DB.");
        process.exit(1);
    }
    const targetClub = clubs[0];
    console.log(`Found Club: ${targetClub.name} (ID: ${targetClub.id})`);

    const [allMembers] = await db.query("SELECT * FROM members WHERE clubId = ?", [targetClub.id]);
    require('fs').writeFileSync('debug_members.json', JSON.stringify(allMembers, null, 2));
    console.log("Wrote raw JSON to debug_members.json");

    const [approvedMembers] = await db.query("SELECT * FROM members WHERE clubId = ? AND status = 'approved'", [targetClub.id]);
    const emails = approvedMembers.map(m => m.email).filter(Boolean);

    console.log(`Found ${emails.length} APPROVED members.`);
    if (emails.length > 0) {
        console.log("Target Emails:", emails);
    } else {
        console.log("No valid emails found to send to. This is why the mail didn't fire in production!");
    }

    process.exit(0);
}

run();
