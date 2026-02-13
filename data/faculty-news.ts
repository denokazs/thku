export interface FacultyNewsItem {
    id: number;
    title: string;
    date: string;
    summary: string;
    content?: string; // Full content for expanded view
    image?: string;
    category: 'Haber' | 'Etkinlik' | 'Duyuru' | 'Başarı' | 'Akademik' | 'Kariyer' | 'Uluslararası' | 'Konferans' | 'Sektör' | 'Gezi';
}

export const FACULTY_NEWS: Record<string, FacultyNewsItem[]> = {
    'air': [ // Hava Ulaştırma Fakültesi
        {
            id: 101,
            title: 'Pilotaj Bölümündeki Uluslararası Öğrencilerimiz için Apolet Takma Töreni Düzenlendi',
            date: '20 Mayıs 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=800&q=80', // Classic Plane (Apolet Töreni fallback)
            summary: 'Pilotaj bölümünde eğitim gören uluslararası öğrencilerimiz, düzenlenen törenle ilk apoletlerini takmanın gururunu yaşadılar.',
            content: 'Türk Hava Kurumu Üniversitesi Hava Ulaştırma Fakültesi Pilotaj Bölümü’nde eğitim gören uluslararası öğrencilerimiz için Türkkuşu Yerleşkesi’nde apolet takma töreni düzenlendi. Rektörümüz, fakülte dekanımız ve öğretim üyelerimizin katılımıyla gerçekleşen törende, zorlu pilotaj eğitiminin ilk aşamasını başarıyla tamamlayan öğrencilere bröveleri ve apoletleri takdim edildi. Törende konuşan Rektörümüz, THK Üniversitesi’nin uluslararası alandaki yetkinliğine vurgu yaparak, mezun pilotların dünya semalarında üniversitemizi temsil edeceğini belirtti.'
        },
        {
            id: 102,
            title: 'Öğrencilerimiz Gökyüzü Yolculuğuna İlk Adımı Attı!',
            date: '15 Mayıs 2024',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=800&q=80', // Cockpit (First Step)
            summary: 'Bu yıl eğitime başlayan öğrencilerimiz, Türkkuşu Kampüsü\'nde gerçekleştirilen ilk uçuş deneyimleriyle gökyüzüyle buluştu.',
            content: '2023-2024 Akademik Yılı’nda aramıza katılan genç pilot adaylarımız, teorik eğitimlerini tamamlamalarının ardından ilk uçuş deneyimlerini yaşamak üzere piste çıktılar. Üniversitemizin filosunda bulunan eğitim uçaklarıyla gerçekleşen ilk uçuşlarda öğrencilerimizin heyecanı gözlerinden okunuyordu. Uçuş öncesi brifing alan ve eğitmen pilotlar eşliğinde kokpite geçen öğrencilerimiz, havacılık kariyerlerinin en unutulmaz anlarından birini yaşadılar.'
        },
        {
            id: 103,
            title: 'Türkiye\'nin İlk Astronotu Alper Gezeravcı Üniversitemizde',
            date: '12 Nisan 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Earth Space (Alper Gezeravcı)
            summary: 'Türkiye\'nin ilk uzay yolcusu Alper Gezeravcı, öğrencilerimizle bir araya gelerek uzay misyonu hakkındaki deneyimlerini paylaştı.',
            content: 'Türkiye’nin insanlı ilk uzay misyonunu başarıyla tamamlayan Alper Gezeravcı, THK Üniversitesi öğrencileriyle buluştu. Konferans salonunda gerçekleşen etkinlikte Gezeravcı, Uluslararası Uzay İstasyonu\'nda (ISS) geçirdiği 14 günü, gerçekleştirdiği bilimsel deneyleri ve uzay yolculuğunun zorluklarını anlattı. Özellikle Havacılık ve Uzay Bilimleri Fakültesi öğrencilerinin sorularını yanıtlayan Gezeravcı, gençlere "Hayallerinizin sınırı gökyüzü değil, uzay olsun" mesajını verdi.'
        },
        {
            id: 104,
            title: 'SHGM Türkiye Havacılık Sektörü Gelecek Tasarımı Arama Konferansı',
            date: '25 Mart 2024',
            category: 'Haber',
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80', // People meeting/conference
            summary: 'Sivil Havacılık Genel Müdürlüğü tarafından düzenlenen konferansta havacılık sektörünün geleceği ve yeni stratejiler tartışıldı.',
            content: 'Sivil Havacılık Genel Müdürlüğü (SHGM) koordinasyonunda düzenlenen "Türkiye Havacılık Sektörü Gelecek Tasarımı Arama Konferansı"na üniversitemizden geniş bir katılım sağlandı. Akademisyenlerimiz ve sektör temsilcilerinin bir araya geldiği çalıştayda, sürdürülebilir havacılık, dijitalleşme ve nitelikli personel yetiştirme konuları masaya yatırıldı. Üniversitemiz, sektöre yön verecek stratejilerin belirlenmesinde aktif rol oynadı.'
        },
        {
            id: 105,
            title: 'Psikolojik Destek Birimi Tanıtımı ve Kapsayıcı İletişim Semineri',
            date: '10 Mart 2024',
            category: 'Duyuru',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80', // Reliable Seminar Group
            summary: 'Öğrencilerimize yönelik psikolojik destek hizmetlerinin tanıtıldığı ve etkili iletişim tekniklerinin anlatıldığı seminer yoğun ilgi gördü.',
            content: 'Öğrenci Dekanlığı bünyesinde faaliyet gösteren Psikolojik Danışma ve Rehberlik Birimi, öğrencilerimize sunulan hizmetleri tanıtmak amacıyla bir seminer düzenledi. Seminerde ayrıca "Kapsayıcı İletişim" konusunda uzman konuklar tarafından sunumlar yapıldı. Öğrencilerin akademik ve sosyal yaşamlarında karşılaşabilecekleri zorluklarla baş etme yöntemlerinin konuşulduğu etkinlikte, kampüs içerisindeki destek mekanizmalarına nasıl ulaşılacağı hakkında detaylı bilgiler verildi.'
        }
    ],
    'aero': [ // Havacılık ve Uzay Bilimleri Fakültesi
        {
            id: 201,
            title: 'Numesys Ansys Etkinliği Gerçekleştirildi',
            date: '15 Ekim 2025',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&w=800&q=80', // Tech/Computer Lab
            summary: 'Mühendislik simülasyonları alanında lider firmalardan Numesys ile ANSYS yazılımları üzerine kapsamlı bir workshop düzenlendi.',
            content: 'Numesys ve ANSYS işbirliğiyle düzenlenen etkinlikte, mühendislik simülasyonlarının geleceği konuşuldu. Ele alınan başlıca konular: Buckle/Buckling Analysis (Burkulma Analizi), Fatigue Analysis (Yorulma Analizi), Fracture Mechanics (Kırılma Mekaniği), Modal Analysis (Titreşim Modları Analizi), Harmonic Analysis, Explicit Dynamics, Autodyn (Patlama Analizleri) ve Composite Workflow.'
        },
        {
            id: 202,
            title: 'Bitirme Tasarım Projesi Toplantısı Gerçekleştirildi',
            date: '10 Ekim 2025',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', // People working on project
            summary: 'Havacılık ve Uzay Bilimleri Fakültesi Bitirme Tasarım Projesi Tanıtım Toplantısı, akademik kadro ve öğrencilerin katılımıyla yapıldı.',
            content: '10 Ekim 2025 Cuma günü saat 12:40\'ta, 118 Amfi\'de Prof. Dr. Ünver KAYNAK ve Arş. Gör. Şeydanur AKGÜN koordinasyonunda gerçekleştirilen toplantıda şu projeler tanıtıldı: TJ90 Mini Turbojet Motoru, Mini Turbofan Motoru, Tarımsal Amaçlı İHA, Yangın Söndürme İHA\'sı, Kargo İHA\'sı, Muharebe İHA\'sı, Lift + Cruise İHA\'sı ve Yakıt Hücreli İHA Tasarımı.'
        },
        {
            id: 203,
            title: 'En İyi Editör Ödülü!',
            date: '02 Eylül 2025',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80', // Award
            summary: 'Prof. Dr. İsmail GÜLTEPE, "Pure and Applied Geophysics (PAAG)" dergisinden Üstün Editörlük Sertifikası ödülünü aldı.',
            content: 'Fakültemiz Uçak Mühendisliği Bölümü öğretim üyelerinden Prof. Dr. İsmail GÜLTEPE Atmosfer ve Okyanus Bilimleri alanında editörlüğünü yapmış olduğu ve Springer Nature yayın evine ait olan "Pure and Applied Geophysics (PAAG)" adlı dergiden "Certificate of Editorial Excellence" (Üstün Editörlük Sertifikası) ödülünü alarak 2024 yılının en iyi editörü seçilmiştir.'
        },
        {
            id: 226,
            title: '2024-2025 Akademik Yılı Mezunları Ödül Töreni',
            date: '02 Eylül 2025',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', // Graduation
            summary: '2024-2025 Akademik Yılı mezuniyet töreninde dereceye giren öğrencilerimize ödülleri takdim edildi.',
            content: 'Fakültemiz 2024-2025 Akademik Yılı mezuniyet töreni büyük bir coşkuyla gerçekleştirildi. Fakülte ve bölüm bazında dereceye giren öğrencilerimize başarı belgeleri ve ödülleri, Rektörümüz ve Dekanımız tarafından takdim edildi. Mezun olan tüm öğrencilerimize meslek hayatlarında başarılar dileriz.'
        },
        {
            id: 204,
            title: 'Eskişehir Panel Etkinliği',
            date: '25 Ağustos 2025',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80', // Panel/Conference
            summary: 'Fakültemiz öğretim üyeleri ve öğrencilerinin katılımıyla Eskişehir\'de havacılık paneli düzenlendi.',
            content: '-Panel Etkinliği- kapsamında Eskişehir\'de düzenlenen organizasyonda havacılık sektörünün önde gelen isimleri ve akademisyenlerimiz bir araya gelerek sektörün geleceğini tartıştılar.'
        },
        {
            id: 225,
            title: '13. Ulusal Uçak, Havacılık ve Uzay Mühendisliği Kurultayı',
            date: '20 Mayıs 2025',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=800&q=80', // Conference fixed
            summary: 'Eskişehir\'de düzenlenen kurultayda üniversitemiz akademisyenleri ve öğrencileri bildirilerini sundular.',
            content: 'TMMOB Makina Mühendisleri Odası tarafından düzenlenen 13. Ulusal Uçak, Havacılık ve Uzay Mühendisliği Kurultayı Eskişehir\'de gerçekleştirildi. Fakültemiz öğretim üyeleri ve öğrencilerinin yoğun katılım gösterdiği kurultayda, havacılık sektörünün geleceği, yerli üretim teknolojileri ve uzay misyonları üzerine önemli bildiriler sunuldu.'
        },
        {
            id: 223,
            title: 'Plan-S Firmasına Yapılan Teknik Ziyaret',
            date: '05 Mayıs 2025',
            category: 'Kariyer',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Space/Satellite
            summary: 'Öğrencilerimiz, uydu ve uzay teknolojileri alanında çalışan Plan-S firmasını ziyaret ederek çalışmaları yerinde inceledi.',
            content: 'Fakültemiz öğrencileri, Türkiye\'nin önde gelen uydu ve uzay teknolojileri firmalarından Plan-S\'e teknik gezi düzenledi. Nesnelerin İnterneti (IoT) ve yer gözlem uyduları üzerine yapılan çalışmalar hakkında bilgi alan öğrencilerimiz, şirketin Ar-Ge laboratuvarlarını ve temiz odalarını gezme fırsatı buldular.'
        },
        {
            id: 2249,
            title: 'THK Teknik A.Ş. Ziyareti',
            date: '20 Nisan 2025',
            category: 'Kariyer',
            image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80', // Aircraft Workshop (Forced)
            summary: 'Öğrencilerimiz THK Teknik A.Ş. hangarlarını ziyaret ederek uçak bakım ve onarım süreçlerini gözlemlediler.',
            content: 'Uçak Mühendisliği bölümü öğrencileri, THK Teknik A.Ş. tesislerine düzenlenen teknik gezide uçak bakım, onarım ve revizyon (MRO) süreçlerini yakından inceledi. Mühendislerden uçak sistemleri ve hangardaki operasyonlar hakkında detaylı bilgi alan öğrencilerimiz, teorik bilgilerini pratik uygulamalarla pekiştirme şansı yakaladılar.'
        },
        {
            id: 205,
            title: 'Öğretim Üyemizden Meslek Tanıtımı Semineri',
            date: '28 Şubat 2025',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80', // Seminar
            summary: 'Dr. Öğr. Üyesi Ali Uğur SAZAKLIOĞLU, lise öğrencilerine Havacılık ve Uzay Mühendisliği mesleğini tanıttı.',
            content: 'Fakültemiz öğretim üyelerinden Dr. Öğr. Üyesi Ali Uğur SAZAKLIOĞLU, 28 Şubat 2025 günü Nesibe Aydın Okulları Yıldızlar Kampüsünde gerçekleşen "BENİM GELECEĞİM, BENİM KARİYERİM" isimli organizasyona katılmış ve öğrencilere Havacılık ve Uzay Mühendisliği mesleği hakkında bir meslek tanıtımı semineri vermiştir.'
        },
        {
            id: 206,
            title: 'Erasmus+ Öğrencilerinden Akademik Yolculuk',
            date: '15 Şubat 2025',
            category: 'Uluslararası',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', // International Students
            summary: 'İspanya Universidad de Vigo\'dan gelen Erasmus öğrencileri fakültemizde eğitime başladı.',
            content: 'Bu dönem, Türk Hava Kurumu Üniversitesi (THKU) Havacılık ve Uzay Bilimleri Fakültesi, İspanya’nın Universidad de Vigo üniversitesinden gelen Manuel Pose Fuentes ve Gabriel Rodríguez Valverde isimli iki parlak Erasmus+ öğrencisini ağırlıyor. Öğrenciler, havacılık ve uzay mühendisliği alanındaki bilgi birikimlerini geliştirmek amacıyla değişim programı kapsamında THKÜ\'ye katıldılar.'
        },
        {
            id: 207,
            title: 'Öğrencilerimize Bowling Etkinliği!',
            date: '08 Aralık 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', // Happy Students (Bowling fallback)
            summary: 'Başarılı öğrencilerimiz dekanımız ve hocalarımızla birlikte bowling etkinliğinde stres attı.',
            content: '8 Aralık 2024 Pazar günü Havacılık ve Uzay Bilimleri Fakültesi Dekanımız Prof. Dr. Nevsan ŞENGİL not ortalaması 3.5 üzerinde olan Uçak-Uzay Mühendisliği öğrencilerimiz ile ve Araştırma Görevlimiz Şeydanur AKGÜN eşliğinde bowling etkinliği düzenlemişlerdir. Öğrencilerimizin başarılarını kutlamak amacıyla düzenlenen etkinlikte keyifli anlar yaşandı.'
        },
        {
            id: 208,
            title: 'Fakültemiz Tanıtım Faaliyetleri',
            date: '01 Aralık 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80', // University Promo/Students
            summary: 'Dr. Ali Ruhşen Çete, Kahramankazan Mustafa Hakan Güvençer Fen Lisesi\'nde fakültemizi tanıttı.',
            content: 'Fakültemiz öğretim üyesi Dr. Ali Ruhşen Çete, Kahramankazan Mustafa Hakan Güvençer Fen Lisesi\'ne konuk olarak üniversitemiz ve fakültemiz hakkında detaylı bir tanıtım faaliyeti gerçekleştirmiş, öğrencilerin sorularını yanıtlamıştır.'
        },
        {
            id: 210,
            title: 'PADSAT\'24 Sempozyumu',
            date: '02 Temmuz 2024',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=800&q=80', // Satellite/Space Tech
            summary: 'İHA ve Küçük Uydular için Faydalı Yükler Yıllık Sempozyumu (PADSAT\'24) üniversitemizde düzenlendi.',
            content: 'Türk Hava Kurumu Üniversitesi Havacılık ve Uzay Bilimleri Fakültesi tarafından bu yıl ilki düzenlenen PADSAT\'24, akademi ve sanayiyi bir araya getirerek havacılık ve uzay bilimleri alanında faydalı yükler üzerine yenilikçi çözümleri ve gelişmeleri tartışmak amacıyla 1-2 Temmuz 2024 tarihlerinde kampüsümüzde gerçekleştirildi.'
        },
        {
            id: 211,
            title: 'Uluslararası Kadın Mühendisler Günü Söyleşisi',
            date: '23 Haziran 2024',
            category: 'Kariyer',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', // Women Engineer
            summary: 'Arkadia Space şirketi, mezunumuz Büşra Kahraman ile özel bir söyleşi gerçekleştirdi.',
            content: 'Uluslararası Kadın Mühendisler Günü kapsamında, Arkadia Space şirketi fakültemiz mezunlarından Büşra Kahraman ile mühendislik kariyeri ve sektördeki deneyimleri üzerine ilham verici bir söyleşi gerçekleştirdi.'
        },
        {
            id: 209,
            title: 'Öğrencilerimize Mezuniyet Hediyesi (2024)',
            date: '15 Haziran 2024',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', // Graduation
            summary: '2023-2024 Bahar Dönemi mezunu dereceye giren öğrencilerimize dekanımız tarafından hediyeleri takdim edildi.',
            content: 'Fakültemiz Uzay Mühendisliği Yüksek Şeref öğrencilerimizden Celal Gündüz üniversite ikincisi ve fakülte birincisi, Abdulkadir Ulusoy fakülte ikincisi ve Ezgi Kahraman fakülte üçüncüsü olmuşlardır. Göstermiş oldukları üstün başarılarından dolayı öğrencilerimize Dekanımız Prof. Dr. Nevsan ŞENGİL ve bölüm başkanlarımız tarafından hediye takdimi yapılmıştır.'
        },
        {
            id: 212,
            title: 'Fakültemiz FİGES Expo\'da!',
            date: '04 Haziran 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80', // Expo/Meeting (Figes)
            summary: 'Ankara\'da düzenlenen FİGES Expo toplantısına fakültemiz personeli katılım sağladı.',
            content: '4 Haziran 2024 tarihinde Ankara\'da düzenlenen FİGES Expo toplantısına Fakültemiz akademik ve idari personeli ile katılım sağlanarak, sektördeki son gelişmeler ve çözüm ortaklıkları üzerine görüşmeler yapıldı.'
        },
        {
            id: 213,
            title: 'Ulusal Ay Projesi 2. Bilimsel Ekip Toplantısı',
            date: '31 Ocak 2024',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&w=800&q=80', // Telescope/Moon (Ay Projesi)
            summary: 'Türkiye\'nin Ay Görevi kapsamında düzenlenen kritik toplantıya üniversitemiz ev sahipliği yaptı.',
            content: 'Türkiye Uzay Ajansı (TUA) ve TÜBİTAK-UZAY tarafından düzenlenen "Türkiye’nin Ay Görevi’nin 2. Bilimsel Çalışma Ekibi Toplantısı", uluslararası katılımla üniversitemizde gerçekleştirildi. AYAP-1 uydusundaki Ay gözlem kameraları ve bilimsel ölçüm cihazları üzerine oturumlar düzenlendi. Toplantıya İsveç ve Belçika\'dan da bilim insanları katıldı.'
        },
        {
            id: 214,
            title: '2023-2024 Güz Dönemi LIFT UP Projeleri',
            date: '15 Ocak 2024',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80', // Engineering Work
            summary: 'Öğrencilerimizin TAI LIFT-UP programına kabul edilen bitirme projeleri açıklandı.',
            content: 'Uçak ve Uzay Mühendisliği öğrencilerimizin TAI LIFT-UP programına kabul edilen projeleri arasında "Süpersonik İnlet Tasarım", "3 ve 6 Eksenli Kuvvet Sensörleri Geliştirilmesi" ve "Çok Eksenli Pitot Tüpü Geliştirilmesi" gibi ileri teknoloji konuları yer alıyor. Danışman hocalarımız Prof. Dr. Haluk AKSEL ve Doç. Dr. Ali Ruhşen ÇETE liderliğinde yürütülecek projelere birçok öğrencimiz destek verecek.'
        },
        {
            id: 215,
            title: 'TÜRKSAT Yakın Yörünge ve Küp Uydu Çalıştayı',
            date: '19 Ekim 2023',
            category: 'Konferans',
            image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80', // Satellite
            summary: 'Öğretim üyelerimiz TÜRKSAT tarafından düzenlenen çalıştayda sunumlar gerçekleştirdi.',
            content: 'ATO Congresium\'da düzenlenen TÜRKSAT Yakın Yörünge ve Küp Uydu Çalıştayına fakültemizden geniş bir akademik heyet katıldı. Prof. Dr. Tahsin Çağrı ŞİŞMAN, "Yakın Yörünge Uydularının İşletilmesi ve Yer İstasyonları" konulu oturumda bir sunum yaparak üniversitemizi temsil etti.'
        },
        {
            id: 216,
            title: 'LIFT UP Sanayii Odaklı Proje Ödül Töreni (2023)',
            date: '10 Ekim 2023',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80', // Award Ceremony
            summary: 'TUSAŞ LIFT UP programında birinci olan öğrencilerimiz ödüllerini rektörümüzden aldı.',
            content: 'TUSAŞ 2022-2023 sezonu LIFT UP Sanayii Odaklı Proje konferansında birinci olan öğrencilerimiz Doğa SELÇUK ve Furkan BEYAZIT ile danışmanları Dr. Ceyhun TOLA için üniversitemizde ödül töreni düzenlendi.'
        },
        {
            id: 2179,
            title: 'Öğrencilerimize Mezuniyet Hediyesi (2023)',
            date: '16 Haziran 2023',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80', // New Graduation Group (Forced)
            summary: '2022-2023 dönem birincisi Hasan MUTLU ve dereceye giren öğrencilerimiz ödüllendirildi.',
            content: '2022-2023 Bahar Dönemi\'nde mezun olan öğrencilerimizden Hasan MUTLU üniversite birincisi olarak büyük bir başarıya imza attı. Dereceye giren öğrencilerimize Dekanımız Prof. Dr. Nevsan ŞENGİL tarafından hediyeleri takdim edildi.'
        },
        {
            id: 218,
            title: 'Öğretim Üyemiz Mükemmeliyet Ödülü Aldı',
            date: '10 Haziran 2023',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1579389083395-4507e98b5e67?auto=format&fit=crop&w=800&q=80', // Excellence/Award
            summary: 'Öğretim üyemiz akademik çalışmalarıyla mükemmeliyet ödülüne layık görüldü.',
            content: 'Fakültemiz öğretim üyesi, yürüttüğü uluslararası projeler ve yüksek etkili yayınlarıyla Mükemmeliyet Ödülü\'ne layık görülmüştür. Ödül töreninde üniversitemizin araştırma vizyonuna katkıları vurgulandı.'
        },
        {
            id: 219,
            title: 'Türk Uzay Görevi Bilimsel Çalışma Takımı Toplantısı-I',
            date: '15 Mayıs 2023',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80', // Space Meeting
            summary: 'Türk Uzay Görevi kapsamındaki ilk bilimsel çalışma takımı toplantısı gerçekleştirildi.',
            content: 'Türkiye\'nin uzay misyonu hedefleri doğrultusunda oluşturulan bilimsel çalışma takımlarının ilk toplantısı yapıldı. Toplantıda Ay görevi, bilimsel yükler ve veri analizi süreçleri üzerine yol haritası belirlendi.'
        },
        {
            id: 220,
            title: 'RAST2023 Konferansı Sunumları',
            date: '10 Mayıs 2023',
            category: 'Konferans',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80', // Conference Presentation
            summary: 'Öğrencilerimiz uluslararası RAST2023 konferansında sözlü sunumlarını gerçekleştirdiler.',
            content: 'Uluslararası Uzay Teknolojileri Konferansı (RAST2023) kapsamında öğrencilerimiz, geliştirdikleri uydu alt sistemleri ve yörünge mekaniği üzerine hazırladıkları bildirileri sözlü olarak sundular.'
        },
        {
            id: 221,
            title: 'Prof. Dr. İsmail Gültepe Hakemlik Ödülü',
            date: '15 Nisan 2023',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80', // Review/Writing
            summary: 'Prof. Dr. İsmail Gültepe, uluslararası dergilerdeki katkılarından dolayı hakemlik ödülü aldı.',
            content: 'Öğretim üyemiz Prof. Dr. İsmail Gültepe, atmosfer bilimleri alanındaki saygın dergilerde yaptığı titiz hakemlik değerlendirmeleri ve editöryal katkıları nedeniyle ödüle layık görülmüştür.'
        },
        {
            id: 222,
            title: 'TÜBİTAK 1001 Araştırma Desteği',
            date: '10 Nisan 2023',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80', // Research Lab
            summary: 'Doç. Dr. Mecit Yaman\'ın projesi TÜBİTAK 1001 kapsamında desteklenmeye hak kazandı.',
            content: 'Fakültemiz öğretim üyesi Doç. Dr. Mecit Yaman tarafından sunulan araştırma projesi, TÜBİTAK Bilimsel ve Teknolojik Araştırma Projelerini Destekleme Programı (1001) kapsamında kabul edilmiştir. Proje, havacılık malzemeleri üzerine yenilikçi çalışmalar içermektedir.'
        }
    ],
    'eng': [ // Mühendislik
        {
            id: 301,
            title: 'Mühendislik Fakültesi 2024-2025 Mezunları Ödül Töreni',
            date: '10 Haziran 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80', // Reliable Graduation
            summary: 'Dereceye giren mühendislik öğrencilerimiz başarı belgelerini ve ödüllerini rektörümüzün elinden aldılar.',
            content: 'Mühendislik Fakültesi\'nin 2024-2025 Akademik Yılı mezuniyet töreni büyük bir coşkuyla kutlandı. Fakülte birincisi, ikincisi ve üçüncüsü olan öğrencilerimize plaketleri ve başarı belgeleri takdim edildi. Törende konuşan Dekanımız, mühendislik etiğine ve yaşam boyu öğrenmenin önemine dikkat çekerek, yeni mezun mühendislerimize kariyer yolculuklarında başarılar diledi.'
        },
        {
            id: 302,
            title: '13. Ulusal Uçak, Havacılık ve Uzay Mühendisliği Kurultayı',
            date: '20 Mayıs 2024',
            category: 'Akademik',
            image: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?auto=format&fit=crop&w=800&q=80', // People in seats / conference
            summary: 'Eskişehir\'de düzenlenen kurultayda üniversitemiz akademisyenleri ve öğrencileri bildirilerini sundular.',
            content: 'TMMOB Makina Mühendisleri Odası tarafından iki yılda bir düzenlenen Ulusal Uçak, Havacılık ve Uzay Mühendisliği Kurultayı\'nın 13.\'sü Eskişehir\'de gerçekleştirildi. Üniversitemizden geniş bir heyetle katılım sağlanan kurultayda, akademisyenlerimiz "Yeşil Havacılık", "Kompozit Malzemeler" ve "İnsansız Hava Araçları" oturumlarında bilimsel bildirilerini sundular ve sektördeki son gelişmeleri değerlendirdiler.'
        },
        {
            id: 303,
            title: 'Öğretim Üyemizden Meslek Tanıtımı Semineri',
            date: '15 Nisan 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', // Lecturer
            summary: 'Lise öğrencilerine yönelik düzenlenen etkinlikte mühendislik mesleğinin geleceği ve kariyer fırsatları anlatıldı.',
            content: 'Üniversite tercih dönemindeki lise öğrencilerine yönelik düzenlenen "Geleceğin Mühendisleri" seminer dizisi kapsamında, Bilgisayar Mühendisliği Bölüm Başkanı\'mız bir seminer verdi. Yapay zeka, siber güvenlik ve yazılım mühendisliği alanlarındaki kariyer fırsatlarının anlatıldığı seminerde, öğrenciler laboratuvarlarımızı gezme ve projeleri yerinde inceleme fırsatı buldular.'
        },
        {
            id: 304,
            title: 'Yapay Zeka Destekli İHA Sürüsü Projesi TÜBİTAK Desteği Aldı',
            date: '10 Mart 2024',
            category: 'Başarı',
            image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80', // Reliable Drone 2
            summary: 'Bilgisayar Mühendisliği öğrencilerimizin geliştirdiği otonom sürü İHA projesi, TÜBİTAK 2209 programı kapsamında desteklenmeye değer görüldü.',
            content: 'Bilgisayar ve Yazılım Mühendisliği öğrencilerinin ortaklaşa yürüttüğü "Afet Bölgelerinde Arama Kurtarma Amaçlı Otonom Sürü İHA Sistemleri" projesi, TÜBİTAK tarafından desteklendi. Proje kapsamında geliştirilecek algoritmalar sayesinde İHA\'lar, GPS olmayan ortamlarda bile 서로leriyle haberleşerek koordineli bir şekilde arama kurtarma faaliyeti yürütebilecek.'
        }
    ],
    'man': [ // İşletme
        {
            id: 401,
            title: 'Havacılık Yönetimi Sektör Buluşmaları',
            date: '12 Mayıs 2024',
            category: 'Kariyer',
            image: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=800&q=80', // Meeting room
            summary: 'THY ve Pegasus yöneticilerinin katılımıyla havacılık sektöründeki son gelişmeler ve istihdam olanakları konuşuldu.',
            content: 'İşletme Fakültesi Havacılık Yönetimi Bölümü tarafından organize edilen "Sektör Buluşmaları" etkinliğinin bu ayki konukları Türk Hava Yolları ve Pegasus Hava Yolları\'nın üst düzey yöneticileri oldu. Havacılık sektörünün pandemi sonrası toparlanma süreci ve yeni istihdam politikalarının konuşulduğu panelde, öğrencilerimiz staj ve iş başvurusu süreçleri hakkında birinci ağızdan bilgi alma şansı yakaladılar.'
        },
        {
            id: 402,
            title: 'Üniversitemizde Erasmus+ Öğrencilerinden Akademik Yolculuk',
            date: '05 Nisan 2024',
            category: 'Uluslararası',
            image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=800&q=80', // Students group
            summary: 'Yurt dışından gelen misafir öğrenciler, işletme fakültesinde düzenlenen oryantasyon programına katıldılar.',
            content: 'Erasmus+ değişim programı kapsamında Avrupa\'nın çeşitli üniversitelerinden gelen misafir öğrencilerimiz için İşletme Fakültesi\'nde bir "Hoş Geldin" etkinliği ve oryantasyon programı düzenlendi. Kültürel etkileşimin ve akademik iş birliğinin artırılmasının hedeflendiği programda, yabancı öğrencilerimize üniversitemiz, kampüs olanakları ve Ankara hakkında detaylı bilgilendirmeler yapıldı.'
        },
        {
            id: 403,
            title: 'Lojistik Yönetimi Zirvesi 2024',
            date: '20 Mart 2024',
            category: 'Etkinlik',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', // Generic logistics / transport
            summary: 'Küresel tedarik zinciri krizleri ve çözüm önerilerinin tartışıldığı zirveye sektörün önde gelen lojistik firmaları katıldı.',
            content: 'Havacılık ve Lojistik Yönetimi öğrencilerinin kulüp etkinliği olarak düzenlediği zirvede, son dönemde yaşanan küresel tedarik zinciri aksamaları ve hava kargonun artan önemi konuşuldu. DHL, UPS ve Turkish Cargo temsilcilerinin sunum yaptığı etkinlikte, öğrencilerimiz staj başvuru formlarını doğrudan İK yetkililerine iletme fırsatı buldu.'
        }
    ]
};
