'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
    Announcement,
    NewsItem,
    Confession,
    ShuttleStop,
    MenuOption,
    DailyMenu,
    Comment
} from '@/types';
import { THK_SUBAT_MENU } from '@/data/menu';
import { MONTHLY_MENU } from '@/data/menu-data';
import { FACULTY_NEWS } from '@/data/faculty-news';
import {
    getConfessionsAction,
    addConfessionAction,
    updateConfessionStatusAction,
    updateConfessionVotesAction
} from '@/app/actions/confessions';
import {
    getCommentsAction,
    addCommentAction,
    updateCommentStatusAction,
    toggleCommentLikeAction
} from '@/app/actions/comments';
import { useConfessions, useComments } from '@/lib/hooks';

// Re-export types for backwards compatibility
export type { Announcement, NewsItem, Confession, ShuttleStop, MenuOption, DailyMenu, Comment } from '@/types';

interface StoreContextType {
    announcements: Announcement[];
    allNews: NewsItem[];
    confessions: Confession[];
    comments: Comment[];
    commentLikes: Record<number, boolean>;
    shuttleStops: ShuttleStop[];
    menuOptions: MenuOption[];
    dailyMenu: DailyMenu;
    isAdmin: boolean;
    loginAdmin: () => void;
    logoutAdmin: () => void;
    addConfession: (text: string, user: string, type: Confession['type']) => void;
    updateConfessionStatus: (id: number, status: Confession['status']) => void;
    addComment: (confessionId: number, text: string, user: string, parentCommentId?: number) => void;
    updateCommentStatus: (id: number, status: Comment['status']) => void;
    getComments: (confessionId: number) => Comment[];
    toggleCommentLike: (commentId: number) => void;
    getReplies: (commentId: number) => Comment[];
    addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
    deleteAnnouncement: (id: number) => void;
    addNews: (news: Omit<NewsItem, 'id'>) => void;
    deleteNews: (id: number) => void;
    updateNews: (id: number, news: Partial<NewsItem>) => void;
    addShuttleStop: (stop: ShuttleStop) => void;
    deleteShuttleStop: (index: number) => void;
    updateShuttleStop: (index: number, stop: ShuttleStop) => void;
    updateDailyMenu: (menu: DailyMenu) => void;
    voteMenuOption: (id: string) => void;
    voteConfession: (id: number, type: 'up' | 'down') => void;
    myVotes: Record<number, 'up' | 'down'>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [myVotes, setMyVotes] = useState<Record<number, 'up' | 'down'>>({});

    const [announcements, setAnnouncements] = useState<Announcement[]>([
        {
            id: 1,
            title: 'Hava Ulaştırma Fakültesi 2025-2026 Akademik Yılı Açılış Töreni',
            date: '22 Eylül 2025',
            category: 'Akademik'
        },
        {
            id: 2,
            title: 'Yeni Nesil İHA Teknolojileri Semineri ve Workshop Etkinliği',
            date: '15 Ekim 2025',
            category: 'Etkinlik'
        },
    ]);

    const parseTurkishDate = (dateStr: string) => {
        const months: Record<string, number> = {
            'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
            'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
        };
        const parts = dateStr.split(' ');
        if (parts.length < 3) return 0;
        const day = parseInt(parts[0]);
        const month = months[parts[1]] || 0;
        const year = parseInt(parts[2]);
        return new Date(year, month, day).getTime();
    };

    const [allNews, setAllNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                if (res.ok) {
                    const data = await res.json();
                    setAllNews(data.sort((a: NewsItem, b: NewsItem) => parseTurkishDate(b.date) - parseTurkishDate(a.date)));
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
            }
        };
        fetchNews();
    }, []);

    const { confessions, mutate: mutateConfessions } = useConfessions();
    const { comments, mutate: mutateComments } = useComments();
    const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});

    const [shuttleStops, setShuttleStops] = useState<ShuttleStop[]>([
        { name: 'Sıhhiye', time: '14:30', status: 'past' },
        { name: 'Bahçelievler', time: '14:45', status: 'current' },
        { name: 'Aşti', time: '14:55', status: 'next' },
        { name: 'Türkkuşu Kampüsü', time: '15:15', status: 'future' },
    ]);

    const [menuOptions, setMenuOptions] = useState<MenuOption[]>([
        { id: 'A', name: 'Pizza & Kola', votes: 65, color: 'bg-red-500' },
        { id: 'B', name: 'Pide & Ayran', votes: 35, color: 'bg-orange-500' },
    ]);

    const [dailyMenu, setDailyMenu] = useState<DailyMenu>({
        date: '',
        soup: 'Mercimek Çorba',
        main: 'Orman Kebabı',
        side: 'Mevsim Salata',
        calorie: 850,
        protein: 25,
        carbs: 45,
        fat: 20
    });

    // Load data and set Daily Menu based on date
    useEffect(() => {
        // ... previous LocalStorage loaders ...
        try {
            const savedAnnouncements = localStorage.getItem('thk_announcements');
            if (savedAnnouncements) {
                const parsed = JSON.parse(savedAnnouncements);
                if (Array.isArray(parsed)) setAnnouncements(parsed);
            }
        } catch (e) {
            console.error("Failed to parse thk_announcements", e);
        }

        try {
            const savedShuttle = localStorage.getItem('thk_shuttles');
            if (savedShuttle) {
                const parsed = JSON.parse(savedShuttle);
                if (Array.isArray(parsed)) setShuttleStops(parsed);
            }
        } catch (e) {
            console.error("Failed to parse thk_shuttles", e);
        }

        try {
            const savedVotes = localStorage.getItem('thk_user_votes');
            if (savedVotes) {
                const parsed = JSON.parse(savedVotes);
                if (parsed && typeof parsed === 'object') setMyVotes(parsed);
            }
        } catch (e) {
            console.error("Failed to parse thk_user_votes", e);
        }

        // DAILY MENU SYNC Logic
        // Prioritize finding today's menu from the official data source
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const monthStr = dateStr.slice(0, 7); // YYYY-MM

        // Check if we have data for this month in our shared source
        // We need to import MONTHLY_MENU locally inside the effect or at top level
        // Since we can't import inside, we assume it's imported at top level
        const currentMonthData = MONTHLY_MENU[monthStr];

        let foundMenu = null;
        if (currentMonthData) {
            foundMenu = currentMonthData.find((m: any) => m.date === dateStr);
        }

        if (foundMenu) {
            // If we found a menu for TODAY, use it!
            setDailyMenu(foundMenu);
        } else {
            // Fallback to localStorage if no specific menu for today found (e.g. weekend)
            // or keep default
            try {
                const savedMenu = localStorage.getItem('thk_daily_menu_v2');
                if (savedMenu) {
                    const parsed = JSON.parse(savedMenu);
                    if (parsed && typeof parsed === 'object') setDailyMenu(parsed);
                }
            } catch (e) {
                console.error("Failed to parse thk_daily_menu_v2", e);
            }
        }
    }, []);



    // Shuttle status updates
    useEffect(() => {
        const updateStatuses = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            setShuttleStops(prevStops => {
                let nextAssigned = false;

                return prevStops.map(stop => {
                    const [h, m] = stop.time.split(':').map(Number);
                    const stopMinutes = h * 60 + m;
                    const diff = stopMinutes - currentMinutes;

                    let status: ShuttleStop['status'] = 'future';

                    if (diff < -2) {
                        status = 'past';
                    } else if (diff >= -2 && diff <= 2) {
                        status = 'current';
                    } else {
                        if (!nextAssigned) {
                            status = 'next';
                            nextAssigned = true;
                        } else {
                            status = 'future';
                        }
                    }

                    return { ...stop, status };
                });
            });
        };

        updateStatuses();
        const interval = setInterval(updateStatuses, 60000);
        return () => clearInterval(interval);
    }, []);

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('thk_announcements', JSON.stringify(announcements));
    }, [announcements]);

    useEffect(() => {
        localStorage.setItem('thk_daily_menu_v2', JSON.stringify(dailyMenu));
    }, [dailyMenu]);

    useEffect(() => {
        localStorage.setItem('thk_shuttles', JSON.stringify(shuttleStops));
    }, [shuttleStops]);

    useEffect(() => {
        localStorage.setItem('thk_user_votes', JSON.stringify(myVotes));
    }, [myVotes]);

    const loginAdmin = useCallback(() => setIsAdmin(true), []);
    const logoutAdmin = useCallback(() => setIsAdmin(false), []);

    const addConfession = useCallback(async (text: string, user: string, type: Confession['type']) => {
        const tempId = Date.now();
        const optimisticConfession: Confession = {
            id: tempId,
            text,
            user,
            type,
            likes: 0,
            dislikes: 0,
            status: 'pending',
            timestamp: Date.now(),
        };

        try {
            // Optimistic update
            await mutateConfessions(
                async () => {
                    await addConfessionAction(text, user, type);
                    // Let SWR revalidate automatically after this
                    return undefined;
                },
                {
                    optimisticData: (current) => [optimisticConfession, ...(current || [])],
                    rollbackOnError: true,
                    revalidate: true
                }
            );
        } catch (error) {
            console.error("Failed to add confession:", error);
        }
    }, [mutateConfessions]);

    const updateConfessionStatus = useCallback(async (id: number, status: Confession['status']) => {
        mutateConfessions(prev => (prev || []).map(c => c.id === id ? { ...c, status } : c), false);
        await updateConfessionStatusAction(id, status);
        mutateConfessions(); // Revalidate to ensure consistency
    }, [mutateConfessions]);

    const addComment = useCallback(async (confessionId: number, text: string, user: string, parentCommentId?: number) => {
        const tempId = Date.now();
        const optimisticComment: Comment = {
            id: tempId,
            confessionId,
            parentCommentId,
            text,
            user,
            likes: 0,
            status: 'pending',
            timestamp: Date.now(),
        };

        try {
            await mutateComments(
                async () => {
                    await addCommentAction(confessionId, text, user, parentCommentId);
                    return undefined;
                },
                {
                    optimisticData: (current) => [optimisticComment, ...(current || [])],
                    rollbackOnError: true,
                    revalidate: true
                }
            );
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    }, [mutateComments]);

    const updateCommentStatus = useCallback(async (id: number, status: Comment['status']) => {
        mutateComments(prev => (prev || []).map(c => c.id === id ? { ...c, status } : c), false);
        await updateCommentStatusAction(id, status);
        mutateComments();
    }, [mutateComments]);

    const getComments = useCallback((confessionId: number): Comment[] => {
        return comments.filter(c => c.confessionId === confessionId && c.status === 'approved' && !c.parentCommentId);
    }, [comments]);

    const getReplies = useCallback((commentId: number): Comment[] => {
        return comments.filter(c => c.parentCommentId === commentId && c.status === 'approved');
    }, [comments]);


    // Use refs to access latest state in callbacks without triggering re-renders of the callbacks
    const myVotesRef = React.useRef(myVotes);
    const commentLikesRef = React.useRef(commentLikes);
    const commentsRef = React.useRef(comments);
    const confessionsRef = React.useRef(confessions);

    useEffect(() => { myVotesRef.current = myVotes; }, [myVotes]);
    useEffect(() => { commentLikesRef.current = commentLikes; }, [commentLikes]);
    useEffect(() => { commentsRef.current = comments; }, [comments]);
    useEffect(() => { confessionsRef.current = confessions; }, [confessions]);

    const toggleCommentLike = useCallback(async (commentId: number) => {
        const prevLikes = commentLikesRef.current;
        const isLiked = prevLikes[commentId];
        const increment = isLiked ? -1 : 1;

        // Optimistic UI Update
        mutateComments(prevComments => (prevComments || []).map(c =>
            c.id === commentId ? { ...c, likes: Math.max(0, c.likes + increment) } : c
        ), false);

        setCommentLikes(prev => {
            const newLikes = { ...prev };
            if (isLiked) delete newLikes[commentId];
            else newLikes[commentId] = true;
            return newLikes;
        });

        // Side effect outside updater
        toggleCommentLikeAction(commentId, increment);
    }, [mutateComments]);

    const voteConfession = useCallback(async (id: number, type: 'up' | 'down') => {
        const prevVotes = myVotesRef.current;
        const currentVote = prevVotes[id];
        let likeDelta = 0;
        let dislikeDelta = 0;

        let newVoteState = { ...prevVotes };

        if (currentVote === type) {
            // Remove vote
            if (type === 'up') likeDelta = -1;
            else dislikeDelta = -1;

            const { [id]: _, ...rest } = newVoteState;
            newVoteState = rest;
        } else if (currentVote) {
            // Switch vote
            if (currentVote === 'up') {
                likeDelta = -1;
                dislikeDelta = 1;
            } else {
                dislikeDelta = -1;
                likeDelta = 1;
            }
            newVoteState[id] = type;
        } else {
            // New vote
            if (type === 'up') likeDelta = 1;
            else dislikeDelta = 1;
            newVoteState[id] = type;
        }

        // Apply Optimistic Updates
        mutateConfessions(prev => (prev || []).map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    likes: Math.max(0, (c.likes || 0) + likeDelta),
                    dislikes: Math.max(0, (c.dislikes || 0) + dislikeDelta)
                };
            }
            return c;
        }), false);

        setMyVotes(newVoteState);

        // Side effect
        updateConfessionVotesAction(id, likeDelta, dislikeDelta);
    }, [mutateConfessions]);

    const addAnnouncement = useCallback((announcement: Omit<Announcement, 'id'>) => {
        const newAnnouncement = { ...announcement, id: Date.now() };
        setAnnouncements(prev => [newAnnouncement, ...prev]);
    }, []);

    const deleteAnnouncement = useCallback((id: number) => {
        setAnnouncements(prev => prev.filter(c => c.id !== id));
    }, []);

    const addNews = useCallback((news: Omit<NewsItem, 'id'>) => {
        const newItem: NewsItem = { ...news, id: Date.now() };
        setAllNews(prev => [newItem, ...prev]);
    }, []);

    const deleteNews = useCallback((id: number) => {
        setAllNews(prev => prev.filter(n => n.id !== id));
    }, []);

    const updateNews = useCallback((id: number, news: Partial<NewsItem>) => {
        setAllNews(prev => prev.map(n => n.id === id ? { ...n, ...news } : n));
    }, []);

    const addShuttleStop = useCallback((stop: ShuttleStop) => {
        setShuttleStops(prev => [...prev, stop]);
    }, []);

    const deleteShuttleStop = useCallback((index: number) => {
        setShuttleStops(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateShuttleStop = useCallback((index: number, stop: ShuttleStop) => {
        const newStops = [...shuttleStops];
        newStops[index] = stop;
        setShuttleStops(newStops);
    }, [shuttleStops]); // shuttleStops dependency needed because we copy it? Actually functional update is better.

    // Correction for updateShuttleStop to remove dependency
    const updateShuttleStopOptimized = useCallback((index: number, stop: ShuttleStop) => {
        setShuttleStops(prev => {
            const newStops = [...prev];
            newStops[index] = stop;
            return newStops;
        });
    }, []);


    const updateDailyMenu = useCallback((menu: DailyMenu) => {
        setDailyMenu(menu);
    }, []);

    const voteMenuOption = useCallback((id: string) => {
        setMenuOptions(prev => prev.map(opt =>
            opt.id === id ? { ...opt, votes: opt.votes + 1 } : opt
        ));
    }, []);

    const value = useMemo<StoreContextType>(() => ({
        announcements,
        allNews,
        confessions,
        comments,
        commentLikes,
        shuttleStops,
        menuOptions,
        dailyMenu,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        addConfession,
        updateConfessionStatus,
        addComment,
        updateCommentStatus,
        getComments,
        toggleCommentLike,
        getReplies,
        addAnnouncement,
        deleteAnnouncement,
        addNews,
        deleteNews,
        updateNews,
        addShuttleStop,
        deleteShuttleStop,
        updateShuttleStop: updateShuttleStopOptimized,
        updateDailyMenu,
        voteMenuOption,
        voteConfession,
        myVotes
    }), [
        announcements,
        allNews,
        confessions,
        comments,
        commentLikes,
        shuttleStops,
        menuOptions,
        dailyMenu,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        addConfession,
        updateConfessionStatus,
        addComment,
        updateCommentStatus,
        getComments,
        toggleCommentLike,
        getReplies,
        addAnnouncement,
        deleteAnnouncement,
        addNews,
        deleteNews,
        updateNews,
        addShuttleStop,
        deleteShuttleStop,
        updateShuttleStopOptimized,
        updateDailyMenu,
        voteMenuOption,
        voteConfession,
        myVotes
    ]);

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore must be used within a StoreProvider');
    }
    return context;
}
