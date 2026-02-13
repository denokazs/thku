export type EventType = 'start' | 'exam' | 'registration' | 'holiday' | 'end' | 'grade';

export interface CalendarEvent {
    id: number;
    title: string;
    startDate: string; // YYYY-MM-DD
    endDate?: string;  // YYYY-MM-DD
    type: EventType;
}

export interface SemesterData {
    id: string;
    title: string;
    events: CalendarEvent[];
}

export const ACADEMIC_CALENDAR: SemesterData[] = [
    {
        id: 'fall',
        title: '1. GÜZ YARIYILI',
        events: [
            { id: 1, title: 'Muafiyet Sınavları (Hazırlık hariç)', startDate: '2025-09-15', endDate: '2025-09-17', type: 'exam' },
            { id: 2, title: 'Ders Kayıtları ve Danışman Onayları', startDate: '2025-09-15', endDate: '2025-09-19', type: 'registration' },
            { id: 3, title: 'Derslerin Başlaması', startDate: '2025-09-22', type: 'start' },
            { id: 4, title: 'Ders Ekleme ve Bırakma (Add-Drop)', startDate: '2025-09-29', endDate: '2025-10-03', type: 'registration' },
            { id: 5, title: 'Ara Sınavlar (Vizeler)', startDate: '2025-11-15', endDate: '2025-11-23', type: 'exam' },
            { id: 6, title: 'Derslerin Kesilmesi', startDate: '2026-01-02', type: 'end' },
            { id: 7, title: 'Yıl Sonu Sınavları (Finaller)', startDate: '2026-01-05', endDate: '2026-01-16', type: 'exam' },
            { id: 8, title: 'Final Notlarının Girilmesi (Son)', startDate: '2026-01-19', type: 'grade' },
            { id: 9, title: 'Bütünleme Sınavları', startDate: '2026-01-26', endDate: '2026-02-01', type: 'exam' },
            { id: 10, title: 'Bütünleme Notlarının Girilmesi (Son)', startDate: '2026-02-03', type: 'grade' },
        ]
    },
    {
        id: 'spring',
        title: '2. BAHAR YARIYILI',
        events: [
            { id: 11, title: 'Ders Kayıtları ve Danışman Onayları', startDate: '2026-02-09', endDate: '2026-02-13', type: 'registration' },
            { id: 12, title: 'Derslerin Başlaması', startDate: '2026-02-16', type: 'start' },
            { id: 13, title: 'Ders Ekleme ve Bırakma (Add-Drop)', startDate: '2026-02-23', endDate: '2026-02-27', type: 'registration' },
            { id: 14, title: 'Ara Sınavlar (Vizeler)', startDate: '2026-04-04', endDate: '2026-04-12', type: 'exam' },
            { id: 15, title: 'Derslerin Kesilmesi', startDate: '2026-05-22', type: 'end' },
            { id: 16, title: 'Yıl Sonu Sınavları (Finaller)', startDate: '2026-06-01', endDate: '2026-06-12', type: 'exam' },
            { id: 17, title: 'Final Notlarının Girilmesi (Son)', startDate: '2026-06-15', type: 'grade' },
            { id: 18, title: 'Bütünleme Sınavları', startDate: '2026-06-22', endDate: '2026-06-28', type: 'exam' },
            { id: 19, title: 'Bütünleme Notlarının Girilmesi (Son)', startDate: '2026-06-30', type: 'grade' },
        ]
    },
    {
        id: 'summer',
        title: '3. YAZ ÖĞRETİMİ VE MEZUNİYET EK SINAVLARI',
        events: [
            { id: 20, title: 'Yaz Okulu Kayıtları', startDate: '2026-07-06', endDate: '2026-07-08', type: 'registration' },
            { id: 21, title: 'Mezuniyet Tek/Üç Ders Başvuruları', startDate: '2026-07-07', endDate: '2026-07-08', type: 'registration' },
            { id: 22, title: 'Mezuniyet Tek/Üç Ders Sınavları', startDate: '2026-07-09', endDate: '2026-07-10', type: 'exam' },
            { id: 23, title: 'Yaz Okulu Derslerinin Başlaması', startDate: '2026-07-13', type: 'start' },
            { id: 24, title: 'Yaz Okulu Sınavları (Finaller)', startDate: '2026-08-31', endDate: '2026-09-04', type: 'exam' },
            { id: 25, title: 'Yaz Okulu Notlarının Girilmesi (Son)', startDate: '2026-09-07', type: 'grade' },
            { id: 26, title: 'Azami Süre Sonu 1. Ek Sınavlar', startDate: '2026-09-07', endDate: '2026-09-11', type: 'exam' },
            { id: 27, title: 'Azami Süre Sonu 2. Ek Sınavlar', startDate: '2026-09-14', endDate: '2026-09-18', type: 'exam' },
        ]
    }
];
