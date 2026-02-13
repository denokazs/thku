import { Trophy, Star, TrendingUp, Cpu, Heart, Briefcase, Lightbulb, Globe, Zap, Award, Crown, Rocket } from 'lucide-react';

export const CLUB_BADGES = [
    {
        id: 'sponsored',
        label: 'Sponsorlu',
        description: 'Resmi sponsorlu kulüp',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        icon: Trophy
    },
    {
        id: 'rising-star',
        label: 'Yükselen Yıldız',
        description: 'Hızla büyüyen topluluk',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: TrendingUp
    },
    {
        id: 'most-active',
        label: 'En Aktif',
        description: 'Sürekli etkinlik yapan',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Zap
    },
    {
        id: 'tech-leader',
        label: 'Teknoloji Öncüsü',
        description: 'Teknoloji odaklı projeler',
        color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        icon: Cpu
    },
    {
        id: 'social-impact',
        label: 'Sosyal Etki',
        description: 'Toplumsal fayda odaklı',
        color: 'bg-pink-100 text-pink-700 border-pink-200',
        icon: Heart
    },
    {
        id: 'career-focused',
        label: 'Kariyer Odaklı',
        description: 'İş dünyasına hazırlık',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Briefcase
    },
    {
        id: 'innovative',
        label: 'Yenilikçi',
        description: 'İnovasyon ve AR-GE',
        color: 'bg-cyan-100 text-cyan-700 border-cyan-200',
        icon: Lightbulb
    },
    {
        id: 'award-winning',
        label: 'Ödüllü',
        description: 'Yarışmalarda derece almış',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        icon: Award
    },
    {
        id: 'global',
        label: 'Global',
        description: 'Uluslararası bağlantılı',
        color: 'bg-teal-100 text-teal-700 border-teal-200',
        icon: Globe
    },
    {
        id: 'campus-fav',
        label: 'Kampüsün Gözdesi',
        description: 'Öğrencilerin favorisi',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: Star
    },
    {
        id: 'elite',
        label: 'Elit Topluluk',
        description: 'Seçkin üye yapısı',
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Crown
    },
    {
        id: 'new',
        label: 'Yeni Kuruldu',
        description: 'Aramıza yeni katılan',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: Rocket
    }
];

export const getBadge = (id: string) => CLUB_BADGES.find(b => b.id === id);
