export interface Department {
    name: string;
    description: string;
}

export interface Faculty {
    id: string;
    name: string;
    url: string;
    description: string;
    departments: Department[];
}

export const FACULTIES: Faculty[] = [
    {
        id: 'air',
        name: 'Hava Ulaştırma Fakültesi',
        url: 'https://air.thk.edu.tr',
        description: 'Özellikle pilotaj eğitimi ve hava aracı bakım-onarım konularına odaklanmaktadır.',
        departments: [
            {
                name: 'Pilotaj',
                description: 'Ulusal ve uluslararası sivil havacılık otoritelerinin (SHGM, EASA, ICAO) öngördüğü standartlara göre kurgulanmış eğitim müfredatları ile üstün donanımlı pilotlar yetiştirmektir. Eğitim dili %100 İngilizcedir.'
            },
            {
                name: 'Uçak Bakım ve Onarım',
                description: 'Havacılık sektörünün ihtiyaç duyduğu nitelikli, teknik bilgi ve beceriye sahip, uçak bakım ve onarım süreçlerinde görev alacak uzman personel yetiştirmeyi hedefler.'
            }
        ]
    },
    {
        id: 'aero',
        name: 'Havacılık ve Uzay Bilimleri Fakültesi',
        url: 'https://aero.thk.edu.tr',
        description: 'Havacılık ve uzay teknolojilerinin tasarımı ve geliştirilmesi üzerine yoğunlaşan fakültedir.',
        departments: [
            {
                name: 'Uçak Mühendisliği',
                description: 'Ülkemizin havacılık geleceğini planlayacak ve gerçekleştirecek, tasarım, araştırma-geliştirme ve imalata yönelik teorik bilgi birikimi ile deneysel tecrübeye sahip mühendisler yetiştirir.'
            },
            {
                name: 'Uzay Mühendisliği',
                description: 'Uzay araçları, uydular, roket sistemleri ve yörünge mekaniği gibi alanlarda çalışacak, uzay teknolojileri konusunda yetkin mühendisler yetiştirmeyi amaçlar.'
            }
        ]
    },
    {
        id: 'eng',
        name: 'Mühendislik Fakültesi',
        url: 'https://eng.thk.edu.tr',
        description: 'Havacılık sektörüyle entegre çalışan ancak genel mühendislik disiplinlerini de kapsayan fakültedir.',
        departments: [
            {
                name: 'Bilgisayar Mühendisliği',
                description: 'Havacılık ve uzay sektörüyle iş birliği içinde, yazılım, donanım ve veri tabanı yönetimi konularında yetkin mühendisler yetiştirmektedir.'
            },
            {
                name: 'Elektrik-Elektronik Mühendisliği',
                description: 'Elektronik sistemler, haberleşme, sinyal işleme ve güç sistemleri alanlarında eğitim vererek, savunma sanayii ve havacılık sektörlerine mühendis sağlar.'
            },
            {
                name: 'Endüstri Mühendisliği',
                description: 'Sistemlerin verimliliğini artırmak, üretim ve hizmet süreçlerini optimize etmek amacıyla matematiksel modelleme ve yönetim tekniklerini kullanan mühendisler yetiştirir.'
            },
            {
                name: 'Makine Mühendisliği',
                description: 'Mekanik sistemlerin tasarımı, analizi, imalatı ve bakımı konularında eğitim verir. Havacılık yapısalları ve motor teknolojileriyle de yakından ilişkilidir.'
            },
            {
                name: 'Mekatronik Mühendisliği',
                description: 'Makine, elektronik ve yazılım mühendisliğinin kesişim noktasında, akıllı sistemler, robotik ve otomasyon teknolojileri üzerine odaklanan bir bölümdür.'
            },
            {
                name: 'Yazılım Mühendisliği',
                description: 'Yazılım geliştirme süreçleri, yazılım kalitesi, büyük veri ve yapay zeka gibi alanlarda uzmanlaşmış, sektörün ihtiyacı olan yazılımcıları yetiştirir.'
            }
        ]
    },
    {
        id: 'man',
        name: 'İşletme Fakültesi',
        url: 'https://man.thk.edu.tr',
        description: 'Havacılık yönetimi ve işletmecilik alanında uzmanlaşmış fakültedir.',
        departments: [
            {
                name: 'Havacılık Yönetimi',
                description: 'Havaalanı ve havayolu yöneticileri ile işletmecilerini yetiştirmeyi amaçlar. Dinamik havacılık sektörünün operasyonel ve yönetsel ihtiyaçlarına cevap verir.'
            },
            {
                name: 'Lojistik Yönetimi',
                description: 'Tedarik zinciri, taşımacılık, depolama ve envanter yönetimi gibi konularda eğitim vererek, özellikle hava kargo ve küresel lojistik alanında uzmanlar yetiştirir.'
            },
            {
                name: 'İşletme',
                description: 'Modern işletmecilik, finans, pazarlama ve yönetim organizasyon konularında temel ve ileri düzeyde eğitim sunar.'
            },
            {
                name: 'Yönetim Bilişim Sistemleri',
                description: 'İşletme ve bilişim teknolojilerini birleştirerek, veriye dayalı karar verme süreçlerini yönetebilen ve bilgi sistemlerini tasarlayan uzmanlar yetiştirir.'
            }
        ]
    }
];

export const OTHER_UNITS = [
    {
        name: 'İzmir Hava Ulaştırma Fakültesi',
        description: 'Aktif öğrenci alımı ve bölüm detayları genellikle Ankara merkezli fakültelerle entegre veya dönemsel olarak değişebilmektedir.'
    },
    {
        name: 'Meslek Yüksekokulları (Ankara & İzmir)',
        description: 'Uçak Teknolojisi, Sivil Havacılık Kabin Hizmetleri, Hava Lojistiği, Sivil Hava Ulaştırma İşletmeciliği, Uçuş Harekat Yöneticiliği vb. (2 yıllık ön lisans programları).'
    }
];

export const PROMO_VIDEO = "https://www.youtube.com/embed/BxQE2ibxArc";
