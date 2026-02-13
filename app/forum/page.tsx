'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Image as ImageIcon, Send, Loader2, MoreHorizontal, FileText, GraduationCap, FileArchive } from 'lucide-react';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';

export default function ForumPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [createContent, setCreateContent] = useState('');
    const [createImage, setCreateImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'info' | 'success' | 'warning' | 'danger',
        onConfirm: () => { }
    });

    // Fetch Feed
    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/forum');
            if (res.ok) {
                setPosts(await res.json());
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/giris?redirect=/forum');
            } else {
                fetchPosts();
            }
        }
    }, [user, authLoading, router]);

    const handleCreatePost = async () => {
        if (!user || !createContent.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/forum', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id.toString(),
                    authorName: user.name || user.username,
                    authorAvatar: null, // User interface doesn't have avatar
                    content: createContent,
                    image: createImage
                })
            });

            if (res.ok) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Gönderildi! 🚀',
                    message: 'Gönderiniz moderasyon onayına gönderildi. Onaylandıktan sonra yayına alınacaktır.',
                    type: 'success',
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
                });
                setCreateContent('');
                setCreateImage('');
            }
        } catch (error) {
            setConfirmModal({
                isOpen: true,
                title: 'Hata',
                message: 'Gönderi oluşturulurken bir hata oluştu.',
                type: 'danger',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLike = async (postId: string) => {
        if (!user) return;
        const userIdStr = user.id.toString();
        // Optimistic update
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                const isLiked = p.likes.includes(userIdStr);
                return {
                    ...p,
                    likes: isLiked ? p.likes.filter((id: string) => id !== userIdStr) : [...p.likes, userIdStr]
                };
            }
            return p;
        }));

        try {
            await fetch(`/api/forum/${postId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userIdStr })
            });
        } catch (error) {
            // Revert on error (could be handled better)
            fetchPosts();
        }
    };

    const handleComment = async (postId: string, text: string) => {
        if (!user || !text.trim()) return;
        try {
            const res = await fetch(`/api/forum/${postId}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id.toString(),
                    author: user.name || user.username,
                    text
                })
            });

            if (res.ok) {
                const data = await res.json();
                setPosts(prev => prev.map(p => {
                    if (p.id === postId) {
                        return { ...p, comments: [...p.comments, data.comment] };
                    }
                    return p;
                }));
            }
        } catch (error) {
            console.error('Comment error:', error);
        }
    };

    if (authLoading || (!user && loading)) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!user) return null;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8 max-w-6xl">

                {/* Main Feed */}
                <div className="flex-1 space-y-6">
                    {/* Composer */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                                {'👤'}
                            </div>
                            <div className="flex-1 space-y-3">
                                <textarea
                                    value={createContent}
                                    onChange={(e) => setCreateContent(e.target.value)}
                                    placeholder="Neler düşünüyorsun?"
                                    className="w-full bg-transparent outline-none resize-none text-slate-700 min-h-[80px]"
                                />
                                {createImage && (
                                    <div className="relative w-fit">
                                        <img src={createImage} alt="Preview" className="h-32 rounded-lg object-cover" />
                                        <button onClick={() => setCreateImage('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100">×</button>
                                    </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="image-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setCreateImage(reader.result as string);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                            type="button"
                                        >
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!createContent.trim() || isSubmitting}
                                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Paylaş
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts */}
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">Henüz gönderi yok. İlk paylaşımı sen yap!</div>
                    ) : (
                        posts.map(post => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={user.id.toString()}
                                onLike={() => handleLike(post.id)}
                                onComment={(text: string) => handleComment(post.id, text)}
                            />
                        ))
                    )}
                </div>

                {/* Sidebar Navigation */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h2 className="font-bold text-slate-800 mb-4">Topluluk Köşesi 🚀</h2>
                        <nav className="space-y-2">
                            <Link href="/cikmis-sorular" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <FileArchive className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Çıkmış Sınavlar</span>
                            </Link>

                            <Link href="/hocalar" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Hoca Değerlendirmeleri</span>
                            </Link>

                            <Link href="/ders-notlari" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-red-600 transition-colors group">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-medium">Ders Notları</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                title={confirmModal.title}
                message={confirmModal.message}
                type={confirmModal.type}
                onConfirm={confirmModal.onConfirm}
                showCancel={false}
                confirmText="Tamam"
            />
        </div>
    );
}

function PostCard({ post, currentUserId, onLike, onComment }: any) {
    const isLiked = post.likes.includes(currentUserId);
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                        {post.authorAvatar}
                    </div>
                    <div>
                        <div className="font-bold text-slate-800 text-sm">{post.authorName}</div>
                        <div className="text-xs text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <p className="text-slate-800 whitespace-pre-line mb-3">{post.content}</p>
                {post.image && (
                    <img src={post.image} alt="Post" className="w-full rounded-xl object-cover bg-slate-50 border border-slate-100" />
                )}
            </div>

            {/* Actions */}
            <div className="px-4 pb-2">
                <div className="flex gap-4">
                    <button
                        onClick={onLike}
                        className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'}`}
                    >
                        <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="font-bold text-sm">{post.likes.length}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="font-bold text-sm">{post.comments.length}</span>
                    </button>
                    <button
                        onClick={() => {
                            const shareText = `THKÜ Forum: ${post.content.slice(0, 50)}...\n\nTHKÜ Social'da görüntüle: ${window.location.href}`;
                            if (navigator.share) {
                                navigator.share({
                                    title: 'THKÜ Forum',
                                    text: shareText,
                                    url: window.location.href
                                });
                            } else {
                                navigator.clipboard.writeText(shareText);
                                alert('Bağlantı kopyalandı!');
                            }
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-green-500 transition-colors ml-auto"
                    >
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-slate-50 border-t border-slate-100"
                    >
                        <div className="p-4 space-y-4">
                            {post.comments.map((comment: any) => (
                                <div key={comment.id} className="flex gap-2 text-sm">
                                    <span className="font-bold text-slate-800">{comment.author}</span>
                                    <span className="text-slate-600">{comment.text}</span>
                                </div>
                            ))}
                            <div className="flex gap-2 pt-2">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Yorum yaz..."
                                    className="flex-1 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm outline-none focus:border-red-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onComment(commentText);
                                            setCommentText('');
                                        }
                                    }}
                                />
                                <button
                                    onClick={() => {
                                        onComment(commentText);
                                        setCommentText('');
                                    }}
                                    disabled={!commentText.trim()}
                                    className="bg-slate-200 text-slate-600 hover:bg-red-500 hover:text-white p-2 rounded-full transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
