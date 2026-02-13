'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, MessageSquare, GraduationCap, FileText, Loader2, FileArchive, Trash2 } from 'lucide-react';

interface PendingItem {
    id: string;
    type: 'post' | 'rating' | 'note' | 'teacher' | 'exam';
    // Common
    createdAt: string;
    // Post
    authorName?: string;
    authorAvatar?: string;
    content?: string;
    image?: string;
    // Rating
    teacherName?: string;
    teacherId?: string;
    score?: number;
    comment?: string;
    userId?: string;
    // Note
    title?: string;
    course?: string;
    fileUrl?: string;
    uploadedByName?: string;
    // TeacherCandidate
    name?: string;
    department?: string;
    addedBy?: string;
    // Exam
    courseCode?: string;
    courseName?: string;
    year?: string;
    term?: string;
}

export default function ModerationPage() {
    const [activeTab, setActiveTab] = useState<'posts' | 'ratings' | 'notes' | 'teachers' | 'exams'>('posts');
    const [items, setItems] = useState<{ posts: PendingItem[], ratings: PendingItem[], notes: PendingItem[], teachers: PendingItem[], exams: PendingItem[] }>({
        posts: [],
        ratings: [],
        notes: [],
        teachers: [],
        exams: []
    });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null); // ID of item being processed

    const [viewMode, setViewMode] = useState<'pending' | 'approved'>('pending');

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/moderation?status=${viewMode}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch moderation queue', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [viewMode]);

    const handleAction = async (item: PendingItem, action: 'approve' | 'reject' | 'delete') => {
        setActionLoading(item.id);
        try {
            const res = await fetch('/api/admin/moderation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: item.type,
                    id: item.id,
                    action,
                    teacherId: item.teacherId // Needed for ratings
                })
            });

            if (res.ok) {
                // Optimistic update
                setItems(prev => ({
                    ...prev,
                    [activeTab]: prev[activeTab].filter(i => i.id !== item.id)
                }));
            }
        } catch (error) {
            console.error('Action failed', error);
            alert('Action failed');
        } finally {
            setActionLoading(null);
        }
    };

    const getActiveItems = () => items[activeTab];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Topluluk Moderasyonu</h1>
                    <p className="text-slate-500">Kullanıcı içeriklerini yönetin.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('pending')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'pending' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Onay Bekleyenler
                    </button>
                    <button
                        onClick={() => setViewMode('approved')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'approved' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Yayındaki İçerikler
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'posts' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <MessageSquare className="w-4 h-4" /> Forum
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{items.posts.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('ratings')}
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'ratings' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <GraduationCap className="w-4 h-4" /> Değerlendirmeler
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{items.ratings.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'notes' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <FileText className="w-4 h-4" /> Notlar
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{items.notes.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('teachers')}
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'teachers' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <GraduationCap className="w-4 h-4" /> Hocalar
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{items.teachers.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('exams')}
                    className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'exams' ? 'bg-red-50 text-red-600 border-b-2 border-red-500' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <FileArchive className="w-4 h-4" /> Sınavlar
                    <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">{items.exams.length}</span>
                </button>
            </div>

            {/* Content List */}
            {loading ? (
                <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
            ) : getActiveItems().length === 0 ? (
                <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
                    <CheckCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-800">
                        {viewMode === 'pending' ? 'Bekleyen İşlem Yok' : 'İçerik Bulunamadı'}
                    </h3>
                    <p className="text-slate-500">
                        {viewMode === 'pending' ? 'Harika! Tüm moderasyon işlemleri tamamlandı.' : 'Bu kategoride onaylanmış içerik yok.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    <AnimatePresence>
                        {getActiveItems().map(item => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6"
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono uppercase">
                                        <span>ID: {item.id.slice(0, 8)}</span>
                                        <span>•</span>
                                        <span>{new Date(item.createdAt).toLocaleString('tr-TR')}</span>
                                        {viewMode === 'approved' && <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">YAYINDA</span>}
                                    </div>

                                    {/* Different Content based on Type */}
                                    {activeTab === 'posts' && (
                                        <>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                                                    {item.authorAvatar || '👤'}
                                                </div>
                                                <span className="font-bold text-slate-800">{item.authorName || 'Anonim'}</span>
                                            </div>
                                            <p className="text-slate-700 whitespace-pre-line">{item.content}</p>
                                            {item.image && (
                                                <img src={item.image} alt="Post" className="max-h-64 rounded-lg object-contain bg-slate-50 border border-slate-100 mt-2" />
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'ratings' && (
                                        <>
                                            <div className="font-bold text-lg text-slate-800">
                                                {item.teacherName} <span className="text-slate-400 text-sm font-normal">(Hoca)</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-lg">
                                                <span>Rating: {item.score}/5</span>
                                            </div>
                                            <p className="bg-slate-50 p-3 rounded-lg text-slate-600 italic border border-slate-100">
                                                "{item.comment}"
                                            </p>
                                        </>
                                    )}

                                    {activeTab === 'notes' && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{item.course}</span>
                                                <h3 className="font-bold text-lg text-slate-800">{item.title}</h3>
                                            </div>
                                            <div className="text-sm text-slate-500">Yükleyen: {item.uploadedByName}</div>
                                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1">
                                                <FileText className="w-4 h-4" /> Dosyayı Görüntüle
                                            </a>
                                        </>
                                    )}

                                    {activeTab === 'teachers' && (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                                                    {item.image && item.image.length > 5 ? (
                                                        <img src={item.image} className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <span>👨‍🏫</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                                                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">{item.department}</span>
                                                </div>
                                            </div>
                                            {item.addedBy && (
                                                <div className="text-xs text-slate-400 mt-2">Öneren ID: {item.addedBy}</div>
                                            )}
                                        </>
                                    )}

                                    {activeTab === 'exams' && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{item.courseCode}</span>
                                                <h3 className="font-bold text-lg text-slate-800">{item.year} {item.term} Sınavı</h3>
                                            </div>
                                            <div className="text-sm text-slate-500">Ders Adı: {item.courseName || '-'}</div>
                                            <div className="text-sm text-slate-400">Yükleyen: {item.uploadedByName} ({item.addedBy})</div>
                                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1">
                                                <FileArchive className="w-4 h-4" /> Sınav Dosyasını İncele
                                            </a>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                                    {viewMode === 'pending' ? (
                                        <>
                                            <button
                                                onClick={() => handleAction(item, 'approve')}
                                                disabled={actionLoading === item.id}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105 disabled:opacity-50"
                                            >
                                                {actionLoading === item.id ? <Loader2 className="animate-spin w-4 h-4" /> : <CheckCircle className="w-5 h-5" />}
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleAction(item, 'reject')}
                                                disabled={actionLoading === item.id}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-105 disabled:opacity-50"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                Reddet
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                if (confirm('Bu içeriği kalıcı olarak silmek istediğinize emin misiniz?')) {
                                                    handleAction(item, 'delete');
                                                }
                                            }}
                                            disabled={actionLoading === item.id}
                                            className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white px-4 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === item.id ? <Loader2 className="animate-spin w-4 h-4" /> : <Trash2 className="w-5 h-5" />}
                                            Sil
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
