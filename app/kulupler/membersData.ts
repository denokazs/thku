
// Mock Members Data
export interface ClubMember {
    id: number;
    clubId: number;
    name: string;
    role: string;
    department: string;
    avatar: string; // Default avatar (initials or profile pic)
    joinedAt: string;
    email?: string;
    phone?: string;
    studentId?: string;
    isFeatured?: boolean;
    customImage?: string; // For featured display (larger/different photo)
    customTitle?: string; // Optional subtitle (e.g. "Social Media Manager")
    order?: number; // For sorting
}

export const CLUB_MEMBERS: ClubMember[] = [
    {
        id: 1,
        clubId: 1,
        name: 'Ahmet Yılmaz',
        role: 'Baskan',
        department: 'Bilgisayar Mühendisliği',
        avatar: '👨‍💻',
        joinedAt: '2022'
    },
    {
        id: 2,
        clubId: 1,
        name: 'Selin Kaya',
        role: 'Baskan Yrd.',
        department: 'Elektrik-Elektronik Müh.',
        avatar: '👩‍🔧',
        joinedAt: '2023'
    },
    {
        id: 3,
        clubId: 1,
        name: 'Mehmet Demir',
        role: 'Yonetim Kurulu',
        department: 'Makine Mühendisliği',
        avatar: '👨‍🔧',
        joinedAt: '2023'
    },
    {
        id: 4,
        clubId: 1,
        name: 'Ayşe Çelik',
        role: 'Uye',
        department: 'Yazılım Mühendisliği',
        avatar: '👩‍💻',
        joinedAt: '2024'
    },
    {
        id: 5,
        clubId: 1,
        name: 'Can Vural',
        role: 'Uye',
        department: 'Havacılık ve Uzay Müh.',
        avatar: '👨‍🚀',
        joinedAt: '2024'
    },
    {
        id: 6,
        clubId: 2,
        name: 'Elif Demir',
        role: 'Baskan',
        department: 'Hava Trafik Kontrol',
        avatar: '👩‍🎨',
        joinedAt: '2022'
    }
    // Add more members as needed logic can be generic
];

export const getClubMembers = (clubId: number): ClubMember[] => {
    // Generate some fake members if not enough
    const baseMembers = CLUB_MEMBERS.filter(m => m.clubId === clubId);
    if (baseMembers.length < 5) {
        return [
            ...baseMembers,
            { id: 99, clubId, name: 'Zeynep Yılmaz', role: 'Yonetim Kurulu', department: 'Endüstri Müh.', avatar: '👩‍💼', joinedAt: '2023' },
            { id: 100, clubId, name: 'Ali Yıldız', role: 'Uye', department: 'Pilotaj', avatar: '👨‍✈️', joinedAt: '2024' },
            { id: 101, clubId, name: 'Cemre Kara', role: 'Uye', department: 'Isletme', avatar: '👩‍🏫', joinedAt: '2024' }
        ];
    }
    return baseMembers;
};
