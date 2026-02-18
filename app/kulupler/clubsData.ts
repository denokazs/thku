// Kulüpler Sistemi - Type Definitions and Mock Data

export interface Club {
    id: number;
    name: string;
    slug: string;
    category: 'spor' | 'sanat' | 'teknoloji' | 'sosyal' | 'akademik';
    description: string;
    longDescription: string;
    logo: string;
    coverImage: string;
    memberCount: number;
    foundedYear: number;
    president: {
        name: string;
        email: string;
        avatar: string;
    };
    socialMedia: {
        instagram?: string;
        twitter?: string;
        discord?: string;
        email: string;
    };
    meetingDay?: string;
    meetingLocation?: string;
    isActive: boolean;
    customRoles?: {
        id: string;
        name: string;
        color: string; // Tailwind color class or hex
        priority: number; // 0 = President, 100 = Member
    }[];
}

export interface ClubEvent {
    id: number;
    clubId: number;
    clubName: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    location: string;
    capacity: number;
    attendees: number;
    images: string[];
    coverImage?: string;
    category: string;
    isPast: boolean;
}

export const CLUB_CATEGORIES = [
    { value: 'all', label: 'Tümü', icon: '🎯' },
    { value: 'spor', label: 'Spor', icon: '⚽' },
    { value: 'sanat', label: 'Sanat', icon: '🎨' },
    { value: 'teknoloji', label: 'Teknoloji', icon: '💻' },
    { value: 'sosyal', label: 'Sosyal', icon: '🤝' },
    { value: 'akademik', label: 'Akademik', icon: '📚' }
];

export const CLUBS_DATA: Club[] = [
    {
        "id": 1771019853496,
        "name": "IES",
        "slug": "ies",
        "category": "akademik",
        "description": "IES (Industrial Engineering Society), Kasım 2018’den bu yana okulumuz bünyesinde faaliyet gösteren ilk ve tek Endüstri Mühendisliği topluluğudur.",
        "longDescription": "IES (Industrial Engineering Society), Kasım 2018’den bu yana okulumuz bünyesinde faaliyet gösteren ilk ve tek Endüstri Mühendisliği topluluğudur. Topluluk; öğrencilerin akademik, mesleki ve kişisel gelişimlerini desteklemek amacıyla seminerler, teknik eğitimler, kariyer etkinlikleri ve sektör–öğrenci buluşmaları organize etmekte; disiplinler arası etkileşimi artırarak tüm öğrencilere mühendislik bilincinin kazandırılmasını hedeflemektedir. Farklı bölümlerden gelen üyeleriyle birlikte sürekli büyüyen IES, 500’ü aşkın üyesiyle öğrencileri iş dünyasına ve profesyonel hayata hazırlamayı amaçlayan sürdürülebilir bir öğrenci organizasyonu olarak faaliyetlerini sürdürmektedir.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771019820/thku_uploads/lbx3zge0swuxjoog3faz.png",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771019945449,
        "name": "Roket Topluluğu",
        "slug": "roket",
        "category": "teknoloji",
        "description": "Roket Topluluğu, havacılık ve uzay dünyasına ilgi duyan öğrencileri bir araya getirerek ilham verici konuşmalar, sektör buluşmaları, zirveler ve sosyal etkinlikler düzenleyen bir öğrenci topluluğudur. Amacımız; öğrencilerin bu alanlardaki güncel gelişmeleri takip edebileceği, kendini geliştirebileceği ve güçlü bir çevre edinebileceği bir ortam oluşturmaktadır.",
        "longDescription": "Roket Topluluğu, havacılık ve uzay dünyasına ilgi duyan öğrencileri bir araya getirerek ilham verici konuşmalar, sektör buluşmaları, zirveler ve sosyal etkinlikler düzenleyen bir öğrenci topluluğudur. Amacımız; öğrencilerin bu alanlardaki güncel gelişmeleri takip edebileceği, kendini geliştirebileceği ve güçlü bir çevre edinebileceği bir ortam oluşturmaktadır.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020334/thku_uploads/ecprni2cqmcd6erwxpbz.png",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020014431,
        "name": "Finance Technologies Space (FinTech)",
        "slug": "fintech",
        "category": "teknoloji",
        "description": "Yapay zekâdan veri bilimine, blockchain’den siber güvenliğe; dijital ödeme sistemlerinden açık bankacılığa kadar...",
        "longDescription": "En hakiki mürşit ilimdir.”\n\nBizler, bu sözü bir alıntı değil; bir yön, bir duruş ve bir sorumluluk olarak kabul ediyoruz.\nBilimin ışığında düşünen, teknolojinin gücüyle üreten ve girişimci ruhla harekete geçen bir neslin temsilcileriyiz.\n\nAmacımız; finansal teknolojiler alanında yalnızca bilgi sahibi bireyler yetiştirmek değil, geleceğin sistemlerini tasarlayan öncü zihinler yetiştirmektir.\n\nYapay zekâdan veri bilimine, blockchain’den siber güvenliğe; dijital ödeme sistemlerinden açık bankacılığa kadar uzanan geniş bir alanda, finans ve mühendisliği birleştirerek değer üreten çözümler geliştiriyoruz.\n\nBiz; gelişmeleri takip eden değil, dönüşümü başlatan bir topluluğuz.\nHackathonlarla fikir üretir, projelerle somutlaştırır, iş birlikleriyle büyürüz.\nEtik değerleri, veri gizliliğini ve finansal sorumluluğu temel ilke kabul ederiz.\n\nHedefimiz; Türk Hava Kurumu Üniversitesi’ni ulusal ve uluslararası arenada güçlü şekilde temsil eden, yenilikçi ve sürdürülebilir projeler üreten bir merkez hâline getirmektir.\n\nÇünkü biz inanıyoruz ki;\nTürkiye’nin dijital finans geleceği, bilimi rehber edinen cesur zihinlerle inşa edilecektir.\n\nVe biz, o geleceği inşa etmeye talibiz.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771019984/thku_uploads/qsvr0rdfbeqy6bck00kw.png",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020085293,
        "name": "Cabin Crew Club",
        "slug": "ccc",
        "category": "akademik",
        "description": "Cabin Crew Club, havacılığa ilgi duyan ve sektörü yakından tanımak isteyen herkesi bir araya getiren aktif bir öğrenci topluluğudur. Kulübümüz kapsamında havalimanı gezileri, havacılık müzesi ziyaretleri ve sektör profesyonelleriyle gerçekleştirilen havacılık söyleşileri düzenleyerek üyelerimizin sektörü yerinde deneyimlemesini sağlıyoruz. Amacımız; teorik bilgiyi saha deneyimiyle desteklemek, havacılık kültürünü yaymak ve üyelerimize kariyer yolculuklarında güçlü bir vizyon kazandırmaktır.",
        "longDescription": "Cabin Crew Club, havacılığa ilgi duyan ve sektörü yakından tanımak isteyen herkesi bir araya getiren aktif bir öğrenci topluluğudur. Kulübümüz kapsamında havalimanı gezileri, havacılık müzesi ziyaretleri ve sektör profesyonelleriyle gerçekleştirilen havacılık söyleşileri düzenleyerek üyelerimizin sektörü yerinde deneyimlemesini sağlıyoruz. Amacımız; teorik bilgiyi saha deneyimiyle desteklemek, havacılık kültürünü yaymak ve üyelerimize kariyer yolculuklarında güçlü bir vizyon kazandırmaktır.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020073/thku_uploads/ax7hcrezkcmvt3gyryb4.png",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020283870,
        "name": "Uydu Teknolojileri Topluluğu (UTET)",
        "slug": "utet",
        "category": "teknoloji",
        "description": "UTET (Uydu Teknolojileri Topluluğu), Türk Hava Kurumu Üniversitesi bünyesinde faaliyet gösteren; uydu ve uzay teknolojilerine ilgi duyan öğrencileri bir araya getiren teknik bir topluluktur. Topluluk, yarışmaların yanı sıra düzenlediği teknik eğitimler, uygulamalı atölyeler ve teknik geziler ile üyelerinin mühendislik bilgisini pratiğe dönüştürmesini ve sektörel farkındalık kazanmasını hedefler.",
        "longDescription": "UTET (Uydu Teknolojileri Topluluğu), Türk Hava Kurumu Üniversitesi bünyesinde faaliyet gösteren; uydu ve uzay teknolojilerine ilgi duyan öğrencileri bir araya getiren teknik bir topluluktur. Topluluk, yarışmaların yanı sıra düzenlediği teknik eğitimler, uygulamalı atölyeler ve teknik geziler ile üyelerinin mühendislik bilgisini pratiğe dönüştürmesini ve sektörel farkındalık kazanmasını hedefler.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020275/thku_uploads/ib5h8tvmp5h5mfdgspq2.png",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020579075,
        "name": "GDG on Campus UTAA",
        "slug": "gdgc",
        "category": "teknoloji",
        "description": "GDG (Google Developer Groups - Google Geliştirici Grupları), Google teknolojileri, yazılım geliştirme, mobil, web ve bulut çözümleriyle ilgilenen geliştiricilerin bir araya geldiği, gönüllülük esasına dayalı, kâr amacı gütmeyen küresel bir topluluk ağıdır. 140'tan fazla ülkede, teknik atölyeler, seminerler ve DevFest gibi etkinlikler düzenleyerek bilgi paylaşımını ve teknik becerilerin artırılmasını sağlar.",
        "longDescription": "GDG (Google Developer Groups - Google Geliştirici Grupları), Google teknolojileri, yazılım geliştirme, mobil, web ve bulut çözümleriyle ilgilenen geliştiricilerin bir araya geldiği, gönüllülük esasına dayalı, kâr amacı gütmeyen küresel bir topluluk ağıdır. 140'tan fazla ülkede, teknik atölyeler, seminerler ve DevFest gibi etkinlikler düzenleyerek bilgi paylaşımını ve teknik becerilerin artırılmasını sağlar.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020559/thku_uploads/jesghdlybjtowoctxinz.png",
        "coverImage": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771113301/thku_uploads/gsw5tehwavvq0femtja9.png",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020746502,
        "name": "Yapay Zeka Ve Veri Bilimi Topluluğu",
        "slug": "yazveb",
        "category": "teknoloji",
        "description": "Topluluğumuzun Amacı Üniversitemizde çağımızın gerektirdiği yeni teknolojik gelişmelerden üyelerimizi haberdar etmek ve eğitim, aktivite ve büyük organizasyonlar düzenleyerek gelişmelerine katkıda bulunmaktır.",
        "longDescription": "Topluluğumuzun Amacı Üniversitemizde çağımızın gerektirdiği yeni teknolojik gelişmelerden üyelerimizi haberdar etmek ve eğitim, aktivite ve büyük organizasyonlar düzenleyerek gelişmelerine katkıda bulunmaktır.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020738/thku_uploads/c7avgwn4yzciyl99kzqc.jpg",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    },
    {
        "id": 1771020861734,
        "name": "Eco Drive Kulübü",
        "slug": "ecodrive",
        "category": "teknoloji",
        "description": "Eco Drive Topluluğu, 2024 yılından bu yana THKÜ Sağlık, Kültür ve Spor Direktörlüğü bünyesinde faaliyet gösteren; üniversitemizin hibrit ve elektrikli araçlar alanındaki ilk ve tek teknoloji topluluğudur. Başta kara araçları olmak üzere, deniz ve hava araçları için yenilikçi çözümler üretmeyi amaçlayan topluluğumuz, tüm bölümlerden öğrencileri disiplinler arası bir üretim çatısı altında buluşturmaktadır.",
        "longDescription": "Eco Drive Topluluğu, 2024 yılından bu yana THKÜ Sağlık, Kültür ve Spor Direktörlüğü bünyesinde faaliyet gösteren; üniversitemizin hibrit ve elektrikli araçlar alanındaki ilk ve tek teknoloji topluluğudur. Başta kara araçları olmak üzere, deniz ve hava araçları için yenilikçi çözümler üretmeyi amaçlayan topluluğumuz, tüm bölümlerden öğrencileri disiplinler arası bir üretim çatısı altında buluşturmaktadır. Alanında uzman isimlerle mentorluk buluşmaları, teknik geziler ve staj imkanları organize ederek üyelerini profesyonel dünyaya hazırlayan Eco Drive; geliştirdiği projelerle üniversitemizi ulusal ve uluslararası yarışmalarda temsil eden sürdürülebilir bir teknoloji organizasyonudur.",
        "logo": "https://res.cloudinary.com/dprmyu6zo/image/upload/v1771020838/thku_uploads/t2ztgccmbswm7vhbqqq8.jpg",
        "coverImage": "",
        "memberCount": 0,
        "foundedYear": 2026,
        "president": {
            "name": "Atanmadı",
            "email": "",
            "avatar": "👤"
        },
        "socialMedia": {
            "instagram": "",
            "twitter": "",
            "discord": "",
            "email": ""
        },
        "meetingDay": "Belirlenmedi",
        "meetingLocation": "Belirlenmedi",
        "isActive": true
    }
];

export const CLUB_EVENTS: ClubEvent[] = [
    {
        id: 1,
        clubId: 1,
        clubName: 'THKU Robotics Club',
        title: 'Robot Yarışması 2026',
        description: 'Üniversiteler arası robot yarışması. Line follower ve sumo robot kategorileri. Ödüller ve sertifikalar var!',
        date: '2026-03-15T10:00:00',
        endDate: '2026-03-15T18:00:00',
        location: 'Mühendislik Fakültesi Arenası',
        capacity: 200,
        attendees: 145,
        images: [],
        category: 'Yarışma',
        isPast: false
    },
    {
        id: 2,
        clubId: 1,
        clubName: 'THKU Robotics Club',
        title: 'Arduino Workshop',
        description: 'Başlangıç seviyesi Arduino programlama ve devre tasarımı eğitimi. Ücretsiz katılım.',
        date: '2026-02-20T14:00:00',
        endDate: '2026-02-20T17:00:00',
        location: 'Lab-3',
        capacity: 30,
        attendees: 28,
        images: [],
        category: 'Workshop',
        isPast: false
    },
    {
        id: 3,
        clubId: 2,
        clubName: 'Tiyatro Kulübü',
        title: 'Bahar Konseri ve Oyun Gösterisi',
        description: 'Bu yılın en büyük tiyatro gösterisi! "Kafes" oyununun galası ve müzik dinletisi.',
        date: '2026-04-10T19:30:00',
        endDate: '2026-04-10T22:00:00',
        location: 'Kültür Merkezi Ana Sahne',
        capacity: 350,
        attendees: 287,
        images: [],
        category: 'Gösteri',
        isPast: false
    },
    {
        id: 4,
        clubId: 3,
        clubName: 'Basketbol Kulübü',
        title: 'Kampüs Basketbol Turnuvası',
        description: '3x3 basketbol turnuvası. Kayıtlar açık, takım olarak başvuru yapabilirsiniz.',
        date: '2026-03-05T09:00:00',
        endDate: '2026-03-05T18:00:00',
        location: 'Spor Salonu',
        capacity: 80,
        attendees: 72,
        images: [],
        category: 'Turnuva',
        isPast: false
    },
    {
        id: 5,
        clubId: 4,
        clubName: 'IEEE Student Branch',
        title: 'Makine Öğrenmesi Workshop',
        description: 'Python ve TensorFlow ile makine öğrenmesi temelleri. Uygulamalı eğitim.',
        date: '2026-02-25T15:00:00',
        endDate: '2026-02-25T18:00:00',
        location: 'Konferans Salonu',
        capacity: 50,
        attendees: 49,
        images: [],
        category: 'Workshop',
        isPast: false
    },
    {
        id: 6,
        clubId: 5,
        clubName: 'Fotoğrafçılık Kulübü',
        title: 'Fotoğraf Sergisi: "Kampüsün Gözünden"',
        description: 'Üyelerimizin çektiği en iyi fotoğraflardan oluşan sergi. Herkese açık.',
        date: '2026-03-20T10:00:00',
        endDate: '2026-03-27T20:00:00',
        location: 'Kütüphane Sergi Alanı',
        capacity: 500,
        attendees: 234,
        images: [],
        category: 'Sergi',
        isPast: false
    },
    {
        id: 7,
        clubId: 7,
        clubName: 'Müzik Kulübü',
        title: 'Akustik Gece',
        description: 'Öğrenci gruplarımızın akustik performansları. Sıcak bir atmosferde müzik keyfi.',
        date: '2026-02-28T19:00:00',
        endDate: '2026-02-28T22:00:00',
        location: 'Kafeterya Bahçe',
        capacity: 100,
        attendees: 87,
        images: [],
        category: 'Konser',
        isPast: false
    },
    {
        id: 8,
        clubId: 8,
        clubName: 'Girişimcilik Kulübü',
        title: 'Startup Pitch Day',
        description: 'Öğrenci girişim fikirlerinin sunulacağı, jüri ve mentörlerin olacağı etkinlik. En iyi 3 fikir ödüllendirilecek.',
        date: '2026-04-05T14:00:00',
        endDate: '2026-04-05T18:00:00',
        location: 'Innovation Lab',
        capacity: 120,
        attendees: 98,
        images: [],
        category: 'Yarışma',
        isPast: false
    }
];

// Helper Functions
export const getClubBySlug = (slug: string): Club | undefined => {
    return CLUBS_DATA.find(club => club.slug === slug);
};

export const getClubEvents = (clubId: number): ClubEvent[] => {
    return CLUB_EVENTS.filter(event => event.clubId === clubId);
};

export const getUpcomingEvents = (limit?: number): ClubEvent[] => {
    const now = new Date();
    const upcoming = CLUB_EVENTS
        .filter(event => new Date(event.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return limit ? upcoming.slice(0, limit) : upcoming;
};

export const getClubsByCategory = (category: string): Club[] => {
    if (category === 'all') return CLUBS_DATA;
    return CLUBS_DATA.filter(club => club.category === category);
};
