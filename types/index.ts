export interface Announcement {
    id: number;
    title: string;
    date: string;
    category: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    color?: string;
    icon?: string;
    description?: string;
    url?: string;
    startDate?: string;
    endDate?: string;
    isActive?: boolean;
    createdAt?: string;
}

export interface NewsItem {
    id: number;
    title: string;
    date: string;
    summary: string;
    content: string;
    image?: string;
    category: 'Haber' | 'Etkinlik' | 'Duyuru' | 'Başarı' | 'Akademik' | 'Kariyer' | 'Uluslararası' | 'Konferans' | 'Sektör' | 'Gezi';
    facultyId?: string;
}

export interface Confession {
    id: number;
    user: string;
    text: string;
    likes: number;
    dislikes: number;
    type: 'complaint' | 'romance' | 'panic' | 'question' | 'other';
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface Comment {
    id: number;
    confessionId: number;
    parentCommentId?: number;  // For nested replies
    user: string;
    text: string;
    likes: number;
    status: 'pending' | 'approved' | 'rejected';
    timestamp: number;
}

export interface ShuttleStop {
    name: string;
    time: string;
    status: 'past' | 'current' | 'next' | 'future';
}

export interface MenuOption {
    id: string;
    name: string;
    votes: number;
    color: string;
}

export interface DailyMenu {
    date?: string;
    soup: string;
    main: string;
    side: string;
    calorie: number;
    protein: number;
    carbs: number;
    fat: number;
}
