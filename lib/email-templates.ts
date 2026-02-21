export function getNewEventEmailTemplate(event: any, club: any) {
    const primaryColor = club.color || '#F97316'; // Fallback to orange-500 if no club color
    const eventImageUrl = event.image || event.coverImage || 'https://thku.com.tr/images/placeholder.jpg';
    const clubLogoUrl = club.logo || 'https://thku.com.tr/images/thk-logo.png';
    const eventDate = new Date(event.date);

    // Format date beautifully (e.g., "15 Ekim 2026, 14:30")
    const formattedDate = new Intl.DateTimeFormat('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(eventDate);

    // Escape basic HTML to prevent injection if title/desc has weird characters
    // For a real app, use a proper sanitizer, but this is a basic start
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
            /* Reset & Base Styles */
            body, p, h1, h2, h3, h4, h5, h6 { margin: 0; padding: 0; }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background-color: #f3f4f6; /* gray-100 */
                color: #1f2937; /* gray-800 */
                line-height: 1.6;
                -webkit-font-smoothing: antialiased;
            }
            img { max-width: 100%; height: auto; display: block; }
            a { text-decoration: none; }
            
            /* Layout Structure */
            .wrapper { width: 100%; background-color: #f3f4f6; padding: 40px 0; }
            .container { 
                max-width: 600px; 
                margin: 0 auto; 
                background-color: #ffffff; 
                border-radius: 12px; 
                overflow: hidden; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            }
            
            /* Header */
            .header {
                padding: 30px;
                text-align: center;
                background-color: #ffffff;
                border-bottom: 1px solid #e5e7eb; /* gray-200 */
            }
            .club-logo { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin: 0 auto 15px auto; }
            .club-name { font-size: 20px; font-weight: 700; color: ${primaryColor}; margin-bottom: 5px; }
            .header-subtitle { font-size: 14px; color: #6b7280; /* gray-500 */ }

            /* Hero Image */
            .hero-image { width: 100%; height: 240px; object-fit: cover; }

            /* Content Body */
            .content { padding: 40px 30px; }
            .event-title { font-size: 28px; font-weight: 800; color: #111827; /* gray-900 */ line-height: 1.3; margin-bottom: 20px; }
            .event-description { font-size: 16px; color: #4b5563; /* gray-600 */ margin-bottom: 30px; white-space: pre-wrap;}

            /* Details Box */
            .details-box {
                background-color: #f9fafb; /* gray-50 */
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid ${primaryColor};
            }
            .detail-row { display: flex; align-items: flex-start; margin-bottom: 12px; }
            .detail-row:last-child { margin-bottom: 0; }
            .detail-icon { font-size: 20px; margin-right: 12px; color: ${primaryColor}; }
            .detail-text { font-size: 15px; color: #374151; /* gray-700 */ font-weight: 500;}
            .detail-label { display: block; font-size: 12px; color: #9ca3af; /* gray-400 */ font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;}

            /* Action Button */
            .action-wrapper { text-align: center; margin-top: 40px; }
            .btn {
                display: inline-block;
                background-color: ${primaryColor};
                color: #ffffff;
                font-size: 16px;
                font-weight: 600;
                padding: 14px 32px;
                border-radius: 8px;
                text-decoration: none;
                transition: opacity 0.2s;
            }
            
            /* Footer */
            .footer {
                background-color: #1f2937; /* gray-800 */
                padding: 30px;
                text-align: center;
                color: #9ca3af; /* gray-400 */
                font-size: 13px;
            }
            .footer p { margin-bottom: 10px; }
            .footer a { color: #d1d5db; /* gray-300 */ text-decoration: underline; }

            /* Responsive */
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
                
                <!-- Header -->
                <div class="header">
                    <img src="${clubLogoUrl}" alt="${safeTitle} Logo" class="club-logo">
                    <h2 class="club-name">${club.name}</h2>
                    <p class="header-subtitle">yeni bir etkinlik duyurdu!</p>
                </div>

                <!-- Hero Image -->
                <img src="${eventImageUrl}" alt="${safeTitle}" class="hero-image">

                <!-- Content -->
                <div class="content">
                    <h1 class="event-title">${safeTitle}</h1>
                    
                    <div class="event-description">
                        ${safeDescription}
                    </div>

                    <!-- Details -->
                    <div class="details-box">
                        <div class="detail-row">
                            <div class="detail-icon">📅</div>
                            <div>
                                <span class="detail-label">Tarih Düzenli</span>
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

                    <!-- CTA Button -->
                    <div class="action-wrapper">
                        <!-- We assume events page URL structure -->
                        <a href="https://thku.com.tr/events/${event.id}" class="btn" style="color: #ffffff !important;">Etkinliği İncele</a>
                    </div>
                </div>

                <!-- Footer -->
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
