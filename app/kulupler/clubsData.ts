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
        id: 1,
        name: 'THKU Robotics Club',
        slug: 'robotics',
        category: 'teknoloji',
        description: 'Robotik ve yapay zeka alanında projeler geliştiren teknoloji kulübü',
        longDescription: 'THKU Robotics Club, kampüsün en aktif teknoloji kulüplerinden biri olarak robotik, yapay zeka ve otomasyon sistemleri üzerine çalışmalar yürütmektedir. Üyelerimiz Arduino, Raspberry Pi ve ROS gibi platformlar kullanarak çeşitli projeler geliştirmektedir.',
        logo: '🤖',
        coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop',
        memberCount: 45,
        foundedYear: 2020,
        president: {
            name: 'Ahmet Yılmaz',
            email: 'ahmet.yilmaz@thku.edu.tr',
            avatar: '👨‍💻'
        },
        socialMedia: {
            instagram: '@thku_robotics',
            discord: 'discord.gg/thkurobotics',
            email: 'robotics@thku.edu.tr'
        },
        meetingDay: 'Çarşamba 17:00',
        meetingLocation: 'Mühendislik Fakültesi Lab-3',
        isActive: true
    },
    {
        id: 2,
        name: 'Tiyatro Kulübü',
        slug: 'tiyatro',
        category: 'sanat',
        description: 'Sahne sanatları ve tiyatro gösterileri düzenleyen sanat kulübü',
        longDescription: 'Kampüsün kalbi olan Tiyatro Kulübümüz, her yıl onlarca gösteriye imza atmaktadır. Oyunculuk workshopları, doğaçlama çalışmaları ve profesyonel sahne deneyimleri sunuyoruz.',
        logo: '🎭',
        coverImage: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&h=400&fit=crop',
        memberCount: 38,
        foundedYear: 2018,
        president: {
            name: 'Elif Demir',
            email: 'elif.demir@thku.edu.tr',
            avatar: '👩‍🎨'
        },
        socialMedia: {
            instagram: '@thku_tiyatro',
            twitter: '@thkutiyatro',
            email: 'tiyatro@thku.edu.tr'
        },
        meetingDay: 'Salı & Perşembe 18:00',
        meetingLocation: 'Kültür Merkezi Sahne',
        isActive: true
    },
    {
        id: 3,
        name: 'Basketbol Kulübü',
        slug: 'basketbol',
        category: 'spor',
        description: 'Kampüs basketbol turnuvaları ve antrenmanları düzenleyen spor kulübü',
        longDescription: 'THKU Basketbol Kulübü olarak hem üniversite içi hem de üniversiteler arası turnuvalarda başarıyla temsil ediyoruz. Haftada 3 gün düzenli antrenmanlarımız var.',
        logo: '🏀',
        coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&h=400&fit=crop',
        memberCount: 52,
        foundedYear: 2017,
        president: {
            name: 'Can Öztürk',
            email: 'can.ozturk@thku.edu.tr',
            avatar: '🏃‍♂️'
        },
        socialMedia: {
            instagram: '@thku_basketbol',
            email: 'basketbol@thku.edu.tr'
        },
        meetingDay: 'Pazartesi, Çarşamba, Cuma 17:30',
        meetingLocation: 'Spor Salonu',
        isActive: true
    },
    {
        id: 4,
        name: 'IEEE Student Branch',
        slug: 'ieee',
        category: 'akademik',
        description: 'Elektrik-elektronik mühendisliği ve teknoloji odaklı akademik kulüp',
        longDescription: 'IEEE THKU Student Branch, dünya çapında tanınan IEEE organizasyonunun kampüs temsilciliğidir. Teknik workshoplar, konferanslar ve proje yarışmaları düzenliyoruz.',
        logo: '⚡',
        coverImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=400&fit=crop',
        memberCount: 67,
        foundedYear: 2019,
        president: {
            name: 'Zeynep Kaya',
            email: 'zeynep.kaya@thku.edu.tr',
            avatar: '👩‍🔬'
        },
        socialMedia: {
            instagram: '@ieee_thku',
            twitter: '@ieeethku',
            email: 'ieee@thku.edu.tr'
        },
        meetingDay: 'Perşembe 16:00',
        meetingLocation: 'Mühendislik Fakültesi Konferans Salonu',
        isActive: true
    },
    {
        id: 5,
        name: 'Fotoğrafçılık Kulübü',
        slug: 'fotograf',
        category: 'sanat',
        description: 'Fotoğraf sanatı ve görsel hikaye anlatıcılığı üzerine çalışan kulüp',
        longDescription: 'Objektifimizden yansıyan dünya! Fotoğraf tekniklerini öğrenip, kampüs ve şehir fotoğraf gezileri düzenliyoruz. Yıl sonunda büyük bir sergi açıyoruz.',
        logo: '📸',
        coverImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&h=400&fit=crop',
        memberCount: 31,
        foundedYear: 2021,
        president: {
            name: 'Mert Arslan',
            email: 'mert.arslan@thku.edu.tr',
            avatar: '📷'
        },
        socialMedia: {
            instagram: '@thku_foto',
            email: 'fotograf@thku.edu.tr'
        },
        meetingDay: 'Cumartesi 14:00',
        meetingLocation: 'Kütüphane 2. Kat Toplantı Odası',
        isActive: true
    },
    {
        id: 6,
        name: 'Satranç Kulübü',
        slug: 'satranc',
        category: 'sosyal',
        description: 'Strateji ve mantık oyunları seven öğrencilerin buluşma noktası',
        longDescription: 'Her hafta turnuvalar düzenliyor, satranç eğitimleri veriyoruz. Üniversiteler arası satranç şampiyonasında 3 kez şampiyon olduk!',
        logo: '♟️',
        coverImage: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&h=400&fit=crop',
        memberCount: 28,
        foundedYear: 2019,
        president: {
            name: 'Deniz Şahin',
            email: 'deniz.sahin@thku.edu.tr',
            avatar: '👤'
        },
        socialMedia: {
            instagram: '@thku_satranc',
            email: 'satranc@thku.edu.tr'
        },
        meetingDay: 'Salı & Cuma 18:00',
        meetingLocation: 'Öğrenci Kulübü Lounge',
        isActive: true
    },
    {
        id: 7,
        name: 'Müzik Kulübü',
        slug: 'muzik',
        category: 'sanat',
        description: 'Enstrüman çalışmaları ve konserler düzenleyen müzik topluluğu',
        longDescription: 'Gitar, piyano, davul ve vokal çalışmaları yapıyor, kampüs konserlerimizle müzikseverlerle buluşuyoruz. Her dönem en az 2 konser veriyoruz.',
        logo: '🎸',
        coverImage: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=1200&h=400&fit=crop',
        memberCount: 41,
        foundedYear: 2018,
        president: {
            name: 'Ayşe Yıldız',
            email: 'ayse.yildiz@thku.edu.tr',
            avatar: '🎤'
        },
        socialMedia: {
            instagram: '@thku_muzik',
            email: 'muzik@thku.edu.tr'
        },
        meetingDay: 'Çarşamba 19:00',
        meetingLocation: 'Kültür Merkezi Müzik Stüdyosu',
        isActive: true
    },
    {
        id: 8,
        name: 'Girişimcilik Kulübü',
        slug: 'girisimcilik',
        category: 'akademik',
        description: 'Startup fikirleri geliştiren ve iş dünyasına hazırlanan kulüp',
        longDescription: 'İş fikirleri geliştirme, pitch eğitimleri, mentörlük programları ve startup yarışmaları düzenliyoruz. Alumni networkümüz ile sektör deneyimi kazanma fırsatı sunuyoruz.',
        logo: '💡',
        coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=400&fit=crop',
        memberCount: 55,
        foundedYear: 2020,
        president: {
            name: 'Burak Çelik',
            email: 'burak.celik@thku.edu.tr',
            avatar: '💼'
        },
        socialMedia: {
            instagram: '@thku_startup',
            twitter: '@thkustartup',
            email: 'girisimcilik@thku.edu.tr'
        },
        meetingDay: 'Perşembe 17:00',
        meetingLocation: 'İşletme Fakültesi Innovation Lab',
        isActive: true
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
