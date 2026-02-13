'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
    ArrowLeft, Users, Calendar, MapPin, Mail, Instagram, Twitter,
    MessageCircle, Heart, Share2, X, ChevronLeft, ChevronRight,
    Clock, CheckCircle, TrendingUp, Send, Plus, Filter, MessageSquare, AlertCircle, Star
} from 'lucide-react';
import { getClubBySlug, getClubEvents, type ClubEvent } from '../clubsData';

import ConfirmModal from '@/components/ConfirmModal';

export default function ClubDetailPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user } = useAuth();

    // State Definitions - moved up to fix reference error
    const [dbClub, setDbClub] = useState<any>(null); // Club data from DB (for correct ID)
    const [clubEvents, setClubEvents] = useState<ClubEvent[]>([]);
    const [members, setMembers] = useState<any[]>([]); // Dynamic members from DB

    const staticClub = getClubBySlug(params.slug as string);
    // Prefer DB data if available, fallback to static for display
    const club = dbClub || staticClub;

    // Loading state - start true only if we don't have static data immediately
    const [isLoading, setIsLoading] = useState(!staticClub);

    // Initialize tab from URL or default to 'about'
    const initialTab = (searchParams.get('tab') as 'about' | 'events' | 'gallery' | 'members' | 'contact') || 'about';
    const [activeTab, setActiveTabState] = useState(initialTab);

    // Sync state with URL changes (e.g. back button)
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['about', 'events', 'gallery', 'members', 'contact'].includes(tab)) {
            setActiveTabState(tab as any);
        }
    }, [searchParams]);

    // Wrapper to update URL when tab changes
    const setActiveTab = (tab: typeof activeTab) => {
        setActiveTabState(tab);
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('tab', tab);
        window.history.pushState({}, '', newUrl.toString());
    };

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    // Registration and membership state
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerStatus, setRegisterStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [isJoining, setIsJoining] = useState(false);
    const [membershipStatus, setMembershipStatus] = useState<'none' | 'pending' | 'active'>('none');
    const [registerData, setRegisterData] = useState({
        name: '',
        studentId: '',
        department: '',
        email: '',
        phone: '',
        reason: ''
    });

    // Messaging State
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState({ subject: '', topic: 'Soru', content: '' });
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageStatus, setMessageStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')

    // Confirm Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'info' | 'danger' | 'success' | 'warning';
        confirmText?: string;
        showCancel?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'info',
        showCancel: true
    });

    // Analytics Tracking
    useEffect(() => {
        if (club?.slug) {
            // Check session storage to avoid duplicate counts on strict mode re-renders
            const sessionKey = `viewed_${club.slug}_${new Date().toISOString().slice(0, 10)}`;
            if (!sessionStorage.getItem(sessionKey)) {
                fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: window.location.pathname,
                        clubSlug: club.slug,
                        referrer: document.referrer
                    })
                }).catch(err => console.error('Analytics error:', err));
                sessionStorage.setItem(sessionKey, 'true');
            }
        }
    }, [club?.slug]);

    // Image navigation handlers
    const handleNextImage = () => {
        if (selectedImageIndex !== null && club?.gallery) {
            setSelectedImageIndex((prev) => (prev! + 1) % club.gallery.length);
        }
    };

    const handlePrevImage = () => {
        if (selectedImageIndex !== null && club?.gallery) {
            setSelectedImageIndex((prev) => (prev! - 1 + club.gallery.length) % club.gallery.length);
        }
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedImageIndex === null) return;

            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'ArrowLeft') handlePrevImage();
            if (e.key === 'Escape') setSelectedImageIndex(null);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImageIndex, club?.gallery]);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (selectedImageIndex !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedImageIndex]);

    // Fetch club and events from API to ensure we have correct DB ID
    useEffect(() => {
        const initData = async () => {
            // 1. Get Club from API to verify ID (Fix for static/db ID mismatch)
            try {
                const clubRes = await fetch(`/api/clubs?t=${Date.now()}`, { cache: 'no-store' });
                if (clubRes.ok) {
                    const clubs = await clubRes.json();
                    if (Array.isArray(clubs)) {
                        const found = clubs.find((c: any) => c.slug === params.slug);
                        if (found) {
                            setDbClub(found);

                            // DEBUG: Log for troubleshooting admin button
                            console.log('🔍 Club loaded:', {
                                clubId: found.id,
                                clubSlug: found.slug,
                                userRole: user?.role,
                                userClubId: user?.clubId,
                                shouldShowButton: user && (
                                    user.role === 'super_admin' ||
                                    (user.role === 'club_admin' && user.clubId === found.id)
                                )
                            });

                            // 2. Fetch Events using correct DB ID
                            const eventsRes = await fetch(`/api/events?clubId=${found.id}`, { cache: 'no-store' });
                            if (eventsRes.ok) {
                                const eventsData = await eventsRes.json();
                                setClubEvents(Array.isArray(eventsData) ? eventsData : []);
                            }

                            // 3. Fetch Members using correct DB ID (New)
                            const membersRes = await fetch(`/api/members?clubId=${found.id}`);
                            if (membersRes.ok) {
                                const membersData = await membersRes.json();
                                setMembers(Array.isArray(membersData) ? membersData : []);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch club data", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.slug) {
            // If we don't have static data, ensure we are in loading state while fetching
            // (even if re-visiting)
            const currentStatic = getClubBySlug(params.slug as string);
            if (!currentStatic) {
                setIsLoading(true);
            }
            initData();
        }
    }, [params.slug, user]);

    // Fetch messages when contact tab is active
    useEffect(() => {
        if (activeTab === 'contact' && user && club?.id) {
            fetch(`/api/messages?clubId=${club.id}&userId=${user.id || user.username}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setMessages(data);
                })
                .catch(err => console.error(err));
        }
    }, [activeTab, user, club?.id]);

    // Prefill register data from user when modal opens
    useEffect(() => {
        if (user && showRegisterModal) {
            setRegisterData(prev => ({
                ...prev,
                name: user.name || '',
                studentId: user.studentId || (user.username !== 'admin' ? user.username : ''),
                email: user.email || '',
                phone: user.phone || '',
                department: user.department || ''
            }));
        }
    }, [user, showRegisterModal]);

    // Check membership status on load
    useEffect(() => {
        if (user && club?.id) {
            fetch(`/api/members?clubId=${club.id}`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        const member = data.find((m: any) =>
                            m.studentId === (user.studentId || user.username) ||
                            m.email === user.email
                        );
                        if (member) {
                            setMembershipStatus(member.status);
                        }
                    }
                })
                .catch(err => console.error('Failed to check membership', err));
        }
    }, [user, club?.id]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-black text-white mb-4">Kulüp Bulunamadı</h2>
                    <Link href="/kulupler" className="text-red-400 hover:text-red-300 font-bold">
                        ← Kulüpler Sayfasına Dön
                    </Link>
                </div>
            </div>
        );
    }

    const upcomingEvents = clubEvents.filter(e => !e.isPast);
    const pastEvents = clubEvents.filter(e => e.isPast);

    const tabs = [
        { id: 'about', label: 'Hakkında', icon: '📖' },
        { id: 'events', label: 'Etkinlikler', icon: '🎫', count: upcomingEvents.length },
        { id: 'gallery', label: 'Galeri', icon: '📸' },
        { id: 'members', label: 'Üyeler', icon: '👥', count: members.length },
        { id: 'contact', label: 'İletişim', icon: '💬' }
    ];



    const filteredMessages = messages.filter(m => {
        if (filter === 'active') return ['sent', 'read', 'in_progress'].includes(m.status);
        if (filter === 'resolved') return ['resolved', 'replied', 'closed'].includes(m.status);
        return true;
    });



    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setSendingMessage(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clubId: club.id,
                    userId: user?.id || user?.username,
                    senderName: user?.name || user?.username,
                    subject: newMessage.subject,
                    topic: newMessage.topic,
                    content: newMessage.content
                })
            });

            if (res.ok) {
                const createdMsg = await res.json();
                setMessages([createdMsg, ...messages]);
                setNewMessage({ subject: '', topic: 'Soru', content: '' });
                setMessageStatus('success');
                setTimeout(() => setMessageStatus('idle'), 3000);
            } else {
                setMessageStatus('error');
            }
        } catch (error) {
            setMessageStatus('error');
        } finally {
            setSendingMessage(false);
        }
    };





    const handleJoin = async () => {
        if (!user) {
            setConfirmModal({
                isOpen: true,
                title: 'Giriş Yapmalısınız',
                message: 'Kulübe katılmak için giriş yapmanız gerekmektedir. Giriş sayfasına yönlendirilsin mi?',
                confirmText: 'Giriş Yap',
                type: 'info',
                onConfirm: () => router.push('/giris')
            });
            return;
        }

        // Check if user has required info for quick join
        const hasRequiredInfo = user.name && user.department && user.email;

        if (hasRequiredInfo) {
            setConfirmModal({
                isOpen: true,
                title: 'Kulübe Katıl',
                message: `"${club.name}" kulübüne şu bilgilerle katılmak istiyor musunuz?\n\nAd: ${user.name}\nBölüm: ${user.department}\nE-posta: ${user.email}`,
                confirmText: 'Evet, Katıl',
                type: 'info',
                onConfirm: async () => {
                    setIsJoining(true);
                    try {
                        const res = await fetch('/api/members', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                clubId: club.id,
                                name: user.name,
                                role: 'Uye', // Default role
                                department: user.department,
                                joinedAt: new Date().getFullYear().toString(),
                                avatar: '👤',
                                studentId: user.studentId || user.username,
                                email: user.email,
                                phone: user.phone || '',
                                reason: 'Hızlı Katılım (Site Üzerinden)',
                                status: 'pending'
                            })
                        });

                        if (res.ok) {
                            setConfirmModal({
                                isOpen: true,
                                title: 'Başvurunuz Alındı 🎉',
                                message: 'Başvurunuz başarıyla alındı! Kulüp yönetimi onayladığında üyeliğiniz kesinleşecektir.',
                                confirmText: 'Tamam',
                                type: 'success',
                                showCancel: false,
                                onConfirm: () => { }
                            });
                            setMembershipStatus('pending');
                        } else if (res.status === 409) {
                            setConfirmModal({
                                isOpen: true,
                                title: 'Zaten Başvurdunuz ⚠️',
                                message: 'Zaten bu kulübe üyesiniz veya bekleyen bir başvurunuz var.',
                                confirmText: 'Tamam',
                                showCancel: false,
                                type: 'warning',
                                onConfirm: () => { }
                            });
                            setMembershipStatus('pending');
                        } else {
                            setConfirmModal({
                                isOpen: true,
                                title: 'Hata',
                                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
                                confirmText: 'Tamam',
                                showCancel: false,
                                type: 'danger',
                                onConfirm: () => { }
                            });
                        }
                    } catch (error) {
                        console.error(error);
                        setConfirmModal({
                            isOpen: true,
                            title: 'Hata',
                            message: 'Bir beklenmedik hata oluştu.',
                            confirmText: 'Tamam',
                            showCancel: false,
                            type: 'danger',
                            onConfirm: () => { }
                        });
                    } finally {
                        setIsJoining(false);
                    }
                }
            });
        } else {
            // Missing info, open modal to fill
            setShowRegisterModal(true);
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterStatus('submitting');

        try {
            const res = await fetch('/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clubId: club.id,
                    name: registerData.name,
                    role: 'Uye',
                    department: registerData.department,
                    joinedAt: new Date().getFullYear().toString(),
                    avatar: '👤',
                    studentId: registerData.studentId,
                    email: registerData.email,
                    phone: registerData.phone,
                    reason: registerData.reason,
                    status: 'pending'
                })
            });

            if (res.ok) {
                setRegisterStatus('success');
                // Update parent status so "Join" button becomes "Pending"
                setMembershipStatus('pending');

                setTimeout(() => {
                    setShowRegisterModal(false);
                    setRegisterStatus('idle');
                    setRegisterData(prev => ({ ...prev, reason: '' }));
                }, 2000);
            } else if (res.status === 409) {
                setRegisterStatus('error');
                // Optional: You could show a specific message in the UI for this error state
                setConfirmModal({
                    isOpen: true,
                    title: 'Zaten Başvurdunuz ⚠️',
                    message: 'Zaten bu kulübe üyesiniz veya bekleyen bir başvurunuz var.',
                    confirmText: 'Tamam',
                    showCancel: false,
                    type: 'warning',
                    onConfirm: () => {
                        setShowRegisterModal(false);
                        setRegisterStatus('idle');
                    }
                });
            } else {
                setRegisterStatus('error');
            }
        } catch (error) {
            setRegisterStatus('error');
        }
    };

    const getButtonContent = () => {
        if (membershipStatus === 'pending') return { text: '⏳ Onay Bekliyor', disabled: true, style: 'bg-yellow-600/50 text-yellow-100 cursor-not-allowed' };
        if (membershipStatus === 'active') return { text: '✅ Üyesiniz', disabled: true, style: 'bg-green-600/50 text-green-100 cursor-not-allowed' };
        return { text: isJoining ? 'İşleniyor...' : '🎯 Üye Ol', disabled: isJoining, style: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-xl shadow-red-500/50 hover:scale-105' };
    };

    const btnConfig = getButtonContent();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-950 via-slate-900 to-orange-950 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative h-96 overflow-hidden">
                    {/* Cover Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${club.coverImage})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
                    </div>

                    {/* Back Button */}
                    <Link href="/kulupler">
                        <button className="absolute top-6 left-6 glass-dark border border-slate-700/50 p-3 rounded-xl hover:border-red-500/50 transition-all group">
                            <ArrowLeft className="w-5 h-5 text-white group-hover:text-red-400 transition-colors" />
                        </button>
                    </Link>

                    {/* Club Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end gap-6">
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className={`w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${club.logoBackground || 'from-red-600 to-orange-600'} rounded-3xl flex-shrink-0 flex items-center justify-center text-4xl md:text-6xl shadow-2xl border-4 border-slate-900`}
                            >
                                {club.logo && (club.logo.startsWith('/') || club.logo.startsWith('http')) ? (
                                    <img
                                        src={club.logo}
                                        alt={club.name}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                ) : (
                                    club.logo
                                )}
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1 pb-4">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block glass-dark border border-red-500/30 px-4 py-1.5 rounded-full mb-3"
                                >
                                    <span className="text-red-400 font-black text-sm uppercase tracking-wider">
                                        {club.category}
                                    </span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl md:text-5xl font-black text-white mb-3"
                                >
                                    {club.name}
                                </motion.h1>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-6 text-slate-300"
                                >
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-orange-400" />
                                        <span className="font-bold">{members.length} Üye</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-yellow-400" />
                                        <span className="font-bold">Kuruluş: {club.foundedYear}</span>
                                    </div>
                                    {club.isActive && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="font-bold text-green-400">Aktif</span>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 mb-4">
                                <motion.button
                                    onClick={handleJoin}
                                    disabled={btnConfig.disabled}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`${btnConfig.style} px-8 py-4 rounded-xl font-black text-lg transition-all duration-300 disabled:opacity-70`}
                                >
                                    {btnConfig.text}
                                </motion.button>


                                {/* Show admin panel button only to authorized users */}
                                {user && dbClub && club.slug && (
                                    (user.role === 'super_admin') ||
                                    (user.role === 'club_admin' && user.clubId === dbClub.id)
                                ) && (
                                        <Link href={`/kulupler/${club.slug}/yonetim`}>
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="glass-dark border border-slate-700/50 hover:border-red-500/50 text-slate-300 hover:text-white px-6 py-4 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105"
                                            >
                                                ⚙️ Yönetim
                                            </motion.button>
                                        </Link>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                {/* Tabs */}
                <div id="tabs-container" className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
                    <div className="overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-1.5 inline-flex gap-2 shadow-xl whitespace-nowrap min-w-full md:min-w-0 bg-slate-900/80 backdrop-blur-xl">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                    className={`px-4 md:px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/30 ring-1 ring-white/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                                            }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
                    <AnimatePresence mode="wait">
                        {activeTab === 'about' && (
                            <motion.div
                                key="about"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="glass-dark border border-slate-700/50 rounded-2xl p-8">
                                        <h2 className="text-2xl font-black text-white mb-4">Hakkımızda</h2>
                                        <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                                            {(() => {
                                                if (!club.longDescription) return '';
                                                return club.longDescription
                                                    .replace(/&amp;/g, '&')
                                                    .replace(/&lt;/g, '<')
                                                    .replace(/&gt;/g, '>')
                                                    .replace(/&quot;/g, '"')
                                                    .replace(/&#x27;/g, "'")
                                                    .replace(/&#39;/g, "'");
                                            })()}
                                        </p>
                                    </div>

                                    {club.president && (
                                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-8">
                                            <h2 className="text-2xl font-black text-white mb-4">Başkan</h2>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-3xl overflow-hidden">
                                                    {club.president.avatar && (club.president.avatar.startsWith('/') || club.president.avatar.startsWith('http')) ? (
                                                        <img src={club.president.avatar} alt={club.president.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        club.president.avatar || club.president.name?.charAt(0) || '?'
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{club.president.name}</h3>
                                                    {club.president.email && (
                                                        <a href={`mailto:${club.president.email}`} className="text-red-400 hover:text-red-300 text-sm font-medium">
                                                            {club.president.email}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar */}
                                <div className="space-y-6">
                                    {/* Meeting Info */}
                                    {club.meetingDay && (
                                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-6">
                                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                                <Clock className="w-5 h-5 text-orange-400" />
                                                Toplantılar
                                            </h3>
                                            <div className="space-y-2 text-slate-300">
                                                <p className="font-bold">{club.meetingDay}</p>
                                                {club.meetingLocation && (
                                                    <p className="text-sm flex items-start gap-2">
                                                        <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                        {club.meetingLocation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Social Media */}
                                    {club.socialMedia && (
                                        <div className="glass-dark border border-slate-700/50 rounded-2xl p-6">
                                            <h3 className="text-lg font-black text-white mb-4">İletişim</h3>
                                            <div className="space-y-3">
                                                {club.socialMedia.email && (
                                                    <a href={`mailto:${club.socialMedia.email}`} className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                                                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                                                            <Mail className="w-5 h-5 text-blue-400" />
                                                        </div>
                                                        <span className="font-medium text-sm">{club.socialMedia.email}</span>
                                                    </a>
                                                )}
                                                {club.socialMedia.instagram && (
                                                    <a href={`https://instagram.com/${club.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                                                        <div className="w-10 h-10 bg-pink-600/20 rounded-lg flex items-center justify-center group-hover:bg-pink-600/30 transition-colors">
                                                            <Instagram className="w-5 h-5 text-pink-400" />
                                                        </div>
                                                        <span className="font-medium text-sm">{club.socialMedia.instagram}</span>
                                                    </a>
                                                )}
                                                {club.socialMedia.twitter && (
                                                    <a href={`https://twitter.com/${club.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                                                        <div className="w-10 h-10 bg-blue-400/20 rounded-lg flex items-center justify-center group-hover:bg-blue-400/30 transition-colors">
                                                            <Twitter className="w-5 h-5 text-blue-300" />
                                                        </div>
                                                        <span className="font-medium text-sm">{club.socialMedia.twitter}</span>
                                                    </a>
                                                )}
                                                {club.socialMedia.discord && (
                                                    <a href={`https://${club.socialMedia.discord}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                                                        <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                                                            <MessageCircle className="w-5 h-5 text-indigo-400" />
                                                        </div>
                                                        <span className="font-medium text-sm">{club.socialMedia.discord}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'events' && (
                            <motion.div
                                key="events"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Upcoming Events */}
                                {upcomingEvents.length > 0 && (
                                    <div>
                                        <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                                            <TrendingUp className="w-8 h-8 text-green-400" />
                                            Yaklaşan Etkinlikler
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {upcomingEvents.map((event) => (
                                                <EventCard key={event.id} event={event} user={user} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Past Events */}
                                {pastEvents.length > 0 && (
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-400 mb-6">Geçmiş Etkinlikler</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {pastEvents.map((event) => (
                                                <EventCard key={event.id} event={event} isPast user={user} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {clubEvents.length === 0 && (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4">📅</div>
                                        <h3 className="text-2xl font-black text-white mb-2">Henüz Etkinlik Yok</h3>
                                        <p className="text-slate-400">Yakında etkinlikler eklenecek!</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {club.gallery && club.gallery.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {club.gallery.map((item: any, index: number) => (
                                            <motion.div
                                                key={item.id || index}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="aspect-square bg-slate-800 rounded-xl overflow-hidden cursor-pointer group relative"
                                                onClick={() => setSelectedImageIndex(index)}
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={item.caption || 'Gallery'}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                    {item.caption && (
                                                        <p className="text-white text-sm font-bold truncate">{item.caption}</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <div className="text-6xl mb-4">📸</div>
                                        <h3 className="text-2xl font-black text-white mb-2">Henüz Fotoğraf Yok</h3>
                                        <p className="text-slate-400">Etkinlik fotoğrafları burada görünecek!</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'members' && (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-12"
                            >
                                {/* Featured / Management Section */}
                                {members.filter(m => m.status !== 'pending' && (m.isFeatured || ['Baskan', 'Baskan Yrd.', 'Yonetim Kurulu'].includes(m.role))).length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                            <Star className="w-6 h-6 text-yellow-400" />
                                            Yönetim & Öne Çıkanlar
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {members
                                                .filter(m => m.status !== 'pending' && (m.isFeatured || ['Baskan', 'Baskan Yrd.', 'Yonetim Kurulu'].includes(m.role)))
                                                .map((member) => (
                                                    <div key={member.id} className="glass-dark border border-yellow-500/20 rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden group hover:border-yellow-500/40 transition-all">
                                                        <div className="absolute top-0 right-0 p-4 opacity-50"><div className="w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl"></div></div>

                                                        <div className="w-24 h-24 rounded-full border-2 border-yellow-500/30 overflow-hidden flex-shrink-0 bg-slate-800">
                                                            {member.customImage ? (
                                                                <img src={member.customImage} alt={member.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-3xl">{member.avatar}</div>
                                                            )}
                                                        </div>

                                                        <div className="relative z-10">
                                                            <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                                            <div className="text-yellow-400 font-bold text-sm mb-1">{member.customTitle || member.role}</div>
                                                            <p className="text-slate-400 text-xs">{member.department}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                )}

                                {/* All Members Section */}
                                <div>
                                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                        <Users className="w-6 h-6 text-slate-400" />
                                        Kulüp Üyeleri
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        {members
                                            .filter(m => m.status !== 'pending' && !m.isFeatured && !['Baskan', 'Baskan Yrd.', 'Yonetim Kurulu'].includes(m.role))
                                            .map((member) => (
                                                <div key={member.id} className="glass-dark border border-slate-700/50 rounded-xl p-4 text-center group hover:border-slate-600 transition-all">
                                                    <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl border border-slate-700">
                                                        {member.avatar}
                                                    </div>
                                                    <h3 className="text-white font-bold text-sm mb-1 truncate">{member.name}</h3>

                                                    {/* Role Badge */}
                                                    <div className="mb-2">
                                                        {(() => {
                                                            const customRole = club.customRoles?.find((r: any) => r.name === member.role);
                                                            if (customRole) {
                                                                return <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${customRole.color}`}>{member.role}</span>
                                                            }
                                                            return <span className="text-[10px] text-slate-500 font-medium">{member.role}</span>
                                                        })()}
                                                    </div>

                                                    <p className="text-slate-500 text-[10px] truncate">{member.department}</p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'contact' && (
                            <motion.div
                                key="contact"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                {/* New Message Form */}
                                <div className="glass-dark border border-slate-700/50 rounded-2xl p-8">
                                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                                        <Send className="w-6 h-6 text-blue-500" />
                                        Yeni Destek Talebi
                                    </h2>

                                    {!user ? (
                                        <div className="bg-slate-800/50 p-6 rounded-xl text-center">
                                            <p className="text-slate-400 mb-4">Mesaj göndermek için giriş yapmalısınız.</p>
                                            <Link href="/giris" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-colors">
                                                Giriş Yap
                                            </Link>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSendMessage} className="space-y-4">
                                            <div>
                                                <label className="block text-slate-400 text-sm font-bold mb-2">Konu Başlığı</label>
                                                <div className="flex gap-2 mb-4">
                                                    {['Soru', 'Öneri', 'Şikayet', 'İşbirliği'].map(topic => (
                                                        <button
                                                            key={topic}
                                                            type="button"
                                                            onClick={() => setNewMessage({ ...newMessage, topic })}
                                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${newMessage.topic === topic
                                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                                                }`}
                                                        >
                                                            {topic}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-slate-400 text-sm font-bold mb-2">Başlık</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={newMessage.subject}
                                                    onChange={e => setNewMessage({ ...newMessage, subject: e.target.value })}
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-colors"
                                                    placeholder="Kısaca özetleyin..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-slate-400 text-sm font-bold mb-2">Mesajınız</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={newMessage.content}
                                                    onChange={e => setNewMessage({ ...newMessage, content: e.target.value })}
                                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:border-blue-500 outline-none resize-none transition-colors"
                                                    placeholder="Detayları buraya yazın..."
                                                ></textarea>
                                            </div>

                                            {messageStatus === 'success' && (
                                                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg text-green-400 text-sm font-bold flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" /> Talebiniz oluşturuldu!
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={sendingMessage}
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-500/20 disabled:opacity-50 hover:scale-[1.02] transition-all"
                                            >
                                                {sendingMessage ? 'Gönderiliyor...' : 'Talebi Oluştur'}
                                            </button>
                                        </form>
                                    )}
                                </div>

                                {/* Message History */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-slate-400" />
                                            Geçmiş Taleplerim
                                        </h2>
                                        <div className="flex bg-slate-800/50 p-1 rounded-lg">
                                            {[{ id: 'all', label: 'Tümü' }, { id: 'active', label: 'Devam Eden' }, { id: 'resolved', label: 'Çözülen' }].map(f => (
                                                <button
                                                    key={f.id}
                                                    onClick={() => setFilter(f.id as any)}
                                                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${filter === f.id ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                                                >
                                                    {f.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {filteredMessages.length > 0 ? (
                                        filteredMessages.map((msg) => (
                                            <div key={msg.id} className="glass-dark border border-slate-700/50 rounded-xl p-5 hover:border-blue-500/30 transition-all group relative overflow-hidden">
                                                {/* Status Stripe */}
                                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${msg.status === 'resolved' || msg.status === 'replied' ? 'bg-green-500' :
                                                    msg.status === 'in_progress' ? 'bg-yellow-500' :
                                                        msg.status === 'read' ? 'bg-blue-500' :
                                                            msg.status === 'closed' ? 'bg-slate-500' :
                                                                'bg-slate-500/50'
                                                    }`}></div>

                                                <div className="flex justify-between items-start mb-3 pl-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${msg.topic === 'Şikayet' ? 'text-red-400 bg-red-400/10' :
                                                            msg.topic === 'Öneri' ? 'text-green-400 bg-green-400/10' :
                                                                'text-blue-400 bg-blue-400/10'
                                                            }`}>
                                                            {msg.topic}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(msg.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${msg.status === 'resolved' || msg.status === 'replied' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                                        msg.status === 'in_progress' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                                                            msg.status === 'read' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                                                msg.status === 'closed' ? 'bg-slate-700 border-slate-600 text-slate-400' :
                                                                    'bg-slate-700 border-slate-600 text-slate-400'
                                                        }`}>
                                                        {msg.status === 'resolved' || msg.status === 'replied' ? 'Çözüldü' :
                                                            msg.status === 'in_progress' ? 'İnceleniyor' :
                                                                msg.status === 'read' ? 'Görüldü' :
                                                                    msg.status === 'closed' ? 'Kapatıldı' : 'İletildi'}
                                                    </span>
                                                </div>

                                                <h3 className="text-white font-bold mb-2 pl-2 text-lg">{msg.subject}</h3>
                                                <div className="bg-slate-800/30 rounded-lg p-3 mb-4 ml-2">
                                                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{msg.content}</p>
                                                </div>

                                                {msg.response && (
                                                    <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20 ml-6 relative">
                                                        <div className="absolute -left-2 top-4 w-4 h-0.5 bg-green-500/20"></div>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                                            </div>
                                                            <span className="text-xs font-bold text-green-400">Yönetim Yanıtı</span>
                                                            {msg.answeredAt && <span className="text-[10px] text-slate-500 ml-auto">{new Date(msg.answeredAt).toLocaleDateString()}</span>}
                                                        </div>
                                                        <p className="text-slate-300 text-sm">{msg.response}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-slate-500 bg-slate-800/20 rounded-2xl border border-slate-800 border-dashed">
                                            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>Henüz bir talebiniz bulunmuyor.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Gallery Lightbox */}
                <AnimatePresence>
                    {selectedImageIndex !== null && club.gallery && club.gallery[selectedImageIndex] && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedImageIndex(null)}
                                className="absolute top-20 md:top-4 right-4 text-white/70 hover:text-white transition-colors z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm"
                            >
                                <X className="w-6 h-6 md:w-8 md:h-8" />
                            </button>

                            {/* Nav Buttons */}
                            <button
                                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-30 p-2 md:p-3 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm hover:scale-110 active:scale-90"
                            >
                                <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-30 p-2 md:p-3 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm hover:scale-110 active:scale-90"
                            >
                                <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
                            </button>

                            {/* Main Image */}
                            <motion.div
                                key={selectedImageIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative w-full h-full flex flex-col items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <img
                                    src={club.gallery[selectedImageIndex].url}
                                    alt="Gallery Fullscreen"
                                    className="max-w-full max-h-[70vh] md:max-h-[85vh] object-contain rounded-lg shadow-2xl"
                                />
                                {club.gallery[selectedImageIndex].caption && (
                                    <p className="text-white mt-4 text-center text-sm md:text-lg font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md max-w-[90%]">
                                        {club.gallery[selectedImageIndex].caption}
                                    </p>
                                )}
                            </motion.div>

                            {/* Navigation Dots/Counter */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs md:text-sm font-bold bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                {selectedImageIndex + 1} / {club.gallery.length}
                            </div>
                        </div>
                    )}
                </AnimatePresence>



                {/* Floating Message Bubble */}
                {user && activeTab !== 'contact' && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            setActiveTab('contact');
                            document.getElementById('tabs-container')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50 text-white border-2 border-white/20"
                    >
                        <MessageCircle className="w-8 h-8" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center font-bold border-2 border-slate-900">!</span>
                    </motion.button>
                )}

                {/* Registration Modal */}
                <AnimatePresence>
                    {showRegisterModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowRegisterModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden relative z-10 shadow-2xl"
                            >
                                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{club.name} Üyelik Formu</h2>
                                        <p className="text-slate-400 text-sm">Aramıza katılmak için formu doldur.</p>
                                    </div>
                                    <button onClick={() => setShowRegisterModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-8 max-h-[80vh] overflow-y-auto">
                                    {registerStatus === 'success' ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl animate-bounce">
                                                🎉
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Başvurunuz Alındı!</h3>
                                            <p className="text-slate-400">Üyelik başvurunuz kulüp yönetimine iletildi. En kısa sürede size dönüş yapılacaktır.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleRegisterSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-slate-400 text-sm font-bold mb-2">Ad Soyad *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={registerData.name}
                                                        onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                        placeholder="Adınız Soyadınız"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-slate-400 text-sm font-bold mb-2">Öğrenci Numarası *</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={registerData.studentId}
                                                        onChange={e => setRegisterData({ ...registerData, studentId: e.target.value })}
                                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                        placeholder="Örn: 2023..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-slate-400 text-sm font-bold mb-2">Bölüm *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={registerData.department}
                                                    onChange={e => setRegisterData({ ...registerData, department: e.target.value })}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                    placeholder="Bölümünüz"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-slate-400 text-sm font-bold mb-2">E-posta *</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={registerData.email}
                                                        onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                        placeholder="ornek@thk.edu.tr"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-slate-400 text-sm font-bold mb-2">Telefon</label>
                                                    <input
                                                        type="tel"
                                                        value={registerData.phone}
                                                        onChange={e => setRegisterData({ ...registerData, phone: e.target.value })}
                                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none transition-colors"
                                                        placeholder="05..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-slate-400 text-sm font-bold mb-2">Neden Katılmak İstiyorsunuz?</label>
                                                <textarea
                                                    rows={3}
                                                    value={registerData.reason}
                                                    onChange={e => setRegisterData({ ...registerData, reason: e.target.value })}
                                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:border-red-500 outline-none resize-none transition-colors"
                                                    placeholder="Kısaca kendinizden bahsedin..."
                                                ></textarea>
                                            </div>

                                            {registerStatus === 'error' && (
                                                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-400 text-sm font-bold flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                                                    Bir hata oluştu. Lütfen tekrar deneyin.
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={registerStatus === 'submitting'}
                                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-4 rounded-xl font-black text-lg shadow-lg shadow-red-500/20 disabled:opacity-50 hover:scale-[1.02] transition-all"
                                            >
                                                {registerStatus === 'submitting' ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Confirm Modal */}
                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                    title={confirmModal.title}
                    message={confirmModal.message}
                    onConfirm={confirmModal.onConfirm}
                    confirmText={confirmModal.confirmText}
                    type={confirmModal.type}
                    showCancel={confirmModal.showCancel}
                />
            </div>
        </div>
    );
}

// Event Card Component
function EventCard({ event, isPast = false, user }: { event: ClubEvent; isPast?: boolean; user: any }) {
    const router = useRouter();
    const params = useParams(); // Get slug for the link
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    // Safety check for event attendees
    const attendees = typeof event.attendees === 'number' ? event.attendees : 0;
    const capacity = typeof event.capacity === 'number' ? event.capacity : 0;

    const [hasJoined, setHasJoined] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [attendeesCount, setAttendeesCount] = useState(attendees);

    // Event Card Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
        type: 'info' | 'danger' | 'success' | 'warning';
        confirmText?: string;
        showCancel?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'info',
        showCancel: true
    });

    // Sync with prop changes
    useEffect(() => {
        setAttendeesCount(typeof event.attendees === 'number' ? event.attendees : 0);
    }, [event.attendees]);

    // Check if user has already joined
    useEffect(() => {
        if (user && event.id) {
            fetch(`/api/events/attend?eventId=${event.id}&userId=${user.id || user.username}`)
                .then(res => res.json())
                .then(data => {
                    if (data.hasJoined) setHasJoined(true);
                })
                .catch(err => console.error(err));
        }
    }, [user, event.id]);

    const handleJoin = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation();

        if (!user) {
            setConfirmModal({
                isOpen: true,
                title: 'Giriş Yapmalısınız',
                message: 'Etkinliğe katılmak için giriş yapmalısınız. Giriş sayfasına yönlendirilsin mi?',
                confirmText: 'Giriş Yap',
                type: 'info',
                onConfirm: () => router.push('/giris')
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/events/attend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event.id,
                    userId: user.id || user.username
                })
            });

            const data = await res.json();
            if (res.ok) {
                setHasJoined(true);
                setConfirmModal({
                    isOpen: true,
                    title: 'Katılım Başarılı 🎉',
                    message: 'Etkinliğe başarıyla kayıt oldunuz.',
                    confirmText: 'Tamam',
                    showCancel: false,
                    type: 'success',
                    onConfirm: () => { }
                });
                if (typeof data.attendees === 'number') {
                    setAttendeesCount(data.attendees);
                }
            } else {
                setConfirmModal({
                    isOpen: true,
                    title: 'Hata',
                    message: data.error || 'Katılım sırasında bir hata oluştu.',
                    confirmText: 'Tamam',
                    showCancel: false,
                    type: 'danger',
                    onConfirm: () => { }
                });
            }
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                title: 'Hata',
                message: 'Bir hata oluştu.',
                confirmText: 'Tamam',
                showCancel: false,
                type: 'danger',
                onConfirm: () => { }
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`glass-dark border rounded-2xl p-6 hover:border-red-500/50 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 group relative overflow-hidden ${isPast ? 'border-slate-700/30 opacity-75' : 'border-slate-700/50'}`}>

            {/* Clickable Overlay Link (Background for whole card) */}
            {/* Clickable Overlay Link (Background for whole card) */}
            <Link
                href={`/kulupler/${params.slug}/etkinlik/${event.id}`}
                className="absolute inset-0 z-0"
            >
                {event.coverImage ? (
                    <>
                        <img src={event.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-slate-900/80 group-hover:bg-slate-900/70 transition-colors duration-500" />
                    </>
                ) : event.images && event.images.length > 0 ? (
                    <>
                        <img src={event.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-slate-900/80 group-hover:bg-slate-900/70 transition-colors duration-500" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-slate-900" />
                )}
                <span className="sr-only">Detayları İncele</span>
            </Link>

            <div className="relative z-10 pointer-events-none">
                {/* Category Badge */}
                <div className="flex items-center justify-between mb-4">
                    <span className="bg-red-500/20 border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-xs font-black uppercase">
                        {event.category}
                    </span>
                    {isPast && (
                        <span className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                            <CheckCircle className="w-4 h-4" />
                            Tamamlandı
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-white mb-3 group-hover:text-red-400 transition-colors">
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>

                {/* Date & Location */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="font-medium">{formattedDate} • {formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin className="w-4 h-4 text-yellow-400" />
                        <span className="font-medium">{event.location}</span>
                    </div>
                </div>

                {/* Attendance */}
                <div className="mb-4">
                    <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-400">Katılım</span>
                        <span className="text-white">
                            {attendeesCount} / {capacity === -1 ? '∞' : capacity}
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${capacity === -1 ? 'bg-blue-500 w-full' : 'bg-gradient-to-r from-orange-600 to-red-600'}`}
                            style={{ width: capacity === -1 ? '100%' : `${Math.min(100, (attendeesCount / capacity) * 100)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Visible Details Link */}
                <div className="flex justify-end mb-2 pointer-events-auto">
                    <Link
                        href={`/kulupler/${params.slug}/etkinlik/${event.id}`}
                        className="text-white text-xs font-bold flex items-center gap-1 hover:text-red-400 transition-colors hover:translate-x-1 duration-300"
                    >
                        Detayları İncele <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Action Button - Needs high z-index to be clickable over everything */}
            {!isPast && (
                <div className="relative z-20 mt-4">
                    <button
                        onClick={handleJoin}
                        disabled={hasJoined || isLoading}
                        className={`w-full text-white px-4 py-3 rounded-xl font-black text-sm shadow-lg hover:scale-105 transition-all duration-300 ${hasJoined
                            ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30 cursor-default'
                            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-red-500/30'
                            }`}
                    >
                        {isLoading ? 'İşleniyor...' : (hasJoined ? '✅ Katılım Sağlandı' : '🎟️ Katıl')}
                    </button>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                confirmText={confirmModal.confirmText}
                type={confirmModal.type}
                showCancel={confirmModal.showCancel}
            />
        </div>
    );
}

