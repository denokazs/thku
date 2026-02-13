'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle, Save, X, Search, Shield, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminClubsPage() {
    // State
    const [clubs, setClubs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'clubs' | 'users'>('clubs');
    const [isLoading, setIsLoading] = useState(true);

    // Club Form State
    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [clubFormData, setClubFormData] = useState({ name: '', slug: '', category: '', description: '', logo: '' });
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    // User Form State
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userFormData, setUserFormData] = useState({ username: '', password: '', role: 'club_admin', clubId: '' });

    // Notification State
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [clubsRes, usersRes] = await Promise.all([
                fetch('/api/clubs'),
                fetch('/api/users')
            ]);

            if (clubsRes.ok) setClubs(await clubsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
        } catch (error) {
            console.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    // Logo Upload Handler
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showNotification('Lütfen bir resim dosyası seçin.', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showNotification('Resim boyutu 2MB\'den küçük olmalıdır.', 'error');
            return;
        }

        setIsUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const { url } = await res.json();
                setClubFormData({ ...clubFormData, logo: url });
                showNotification('Logo yüklendi!');
            } else {
                showNotification('Yükleme başarısız.', 'error');
            }
        } catch (error) {
            showNotification('Hata oluştu.', 'error');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    // --- CLUB HANDLERS ---
    const handleCreateClub = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Simplified create - real app would need more fields
            const newClub = {
                ...clubFormData,
                // Default placeholders
                longDescription: clubFormData.description,
                president: { name: 'Atanmadı', email: '', avatar: '👤' },
                socialMedia: {},
                meetingDay: 'Belirlenmedi',
                meetingLocation: 'Belirlenmedi',
                isActive: true,
                gallery: [],
                memberCount: 0,
                foundedYear: new Date().getFullYear()
            };

            const res = await fetch('/api/clubs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClub)
            });

            if (res.ok) {
                const created = await res.json();
                setClubs([...clubs, created]);
                showNotification('Yeni kulüp oluşturuldu.');
                setIsClubModalOpen(false);
                setClubFormData({ name: '', slug: '', category: '', description: '', logo: '' });
            } else {
                const err = await res.json();
                const errorMessage = err.details
                    ? err.details.map((e: any) => e.message).join(', ')
                    : (err.error || 'Kulüp oluşturulamadı.');
                showNotification(errorMessage, 'error');
            }
        } catch (error) {
            showNotification('Hata oluştu.', 'error');
        }
    };

    const handleDeleteClub = async (id: number) => {
        if (!confirm('Bu kulübü ve bağlı tüm içerikleri silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/clubs?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setClubs(clubs.filter(c => c.id !== id));
                showNotification('Kulüp silindi.');
            } else {
                showNotification('Silinirken hata oluştu.', 'error');
            }
        } catch (error) {
            showNotification('Hata oluştu.', 'error');
        }
    };

    // --- USER HANDLERS ---
    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...userFormData,
                clubId: userFormData.role === 'club_admin' ? Number(userFormData.clubId) : undefined
            };

            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const created = await res.json();
                setUsers([...users, created]);
                showNotification('Kullanıcı oluşturuldu.');
                setIsUserModalOpen(false);
                setUserFormData({ username: '', password: '', role: 'club_admin', clubId: '' });
            } else {
                const err = await res.json();
                showNotification(err.error || 'Oluşturulamadı.', 'error');
            }
        } catch (error) {
            showNotification('Hata oluştu.', 'error');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
                showNotification('Kullanıcı silindi.');
            } else {
                const err = await res.json();
                showNotification(err.error || 'Silinemedi.', 'error');
            }
        } catch (error) {
            showNotification('Hata oluştu.', 'error');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Kulüp & Hesap Yönetimi</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('clubs')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'clubs' ? 'bg-blue-950 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                    >
                        Kulüpler
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'users' ? 'bg-blue-950 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
                    >
                        Kullanıcılar
                    </button>
                </div>
            </div>

            {/* Notification */}
            {notification && (
                <div className={`p-4 rounded-xl flex items-center gap-3 font-bold border ${notification.type === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                    {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {notification.message}
                </div>
            )}

            {/* Content Active Tab */}
            {activeTab === 'clubs' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-700">Tüm Kulüpler ({clubs.length})</h2>
                        <button
                            onClick={() => setIsClubModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Yeni Kulüp
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Logo</th>
                                    <th className="p-4">Kulüp Adı</th>
                                    <th className="p-4">ID / Slug</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {clubs.map(club => (
                                    <tr key={club.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            {club.logo?.startsWith('/') || club.logo?.startsWith('http') ? (
                                                <img src={club.logo} alt={club.name} className="w-10 h-10 object-cover rounded-lg" />
                                            ) : (
                                                <span className="text-2xl">{club.logo}</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-slate-800">{club.name}</td>
                                        <td className="p-4 text-slate-500 text-xs font-mono">{club.id} / <span className="p-1 bg-slate-100 rounded">{club.slug}</span></td>
                                        <td className="p-4"><span className="text-xs uppercase font-bold text-slate-500">{club.category}</span></td>
                                        <td className="p-4 text-right flex justify-end gap-2">
                                            {/* Could add Edit here, but edit is done via club admin panel mostly */}
                                            <button
                                                onClick={() => handleDeleteClub(club.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {clubs.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400">Henüz kulüp bulunmuyor.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-700">Sistem Kullanıcıları ({users.length})</h2>
                        <button
                            onClick={() => setIsUserModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Yeni Kullanıcı
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Kullanıcı Adı</th>
                                    <th className="p-4">Rol</th>
                                    <th className="p-4">İlişkili Kulüp</th>
                                    <th className="p-4 text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map(user => {
                                    const linkedClub = user.clubId ? clubs.find(c => c.id === user.clubId) : null;
                                    return (
                                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-slate-400" />
                                                {user.username}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'super_admin' ? 'bg-purple-100 text-purple-600' :
                                                    user.role === 'club_admin' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {user.role === 'super_admin' ? 'Süper Admin' :
                                                        user.role === 'club_admin' ? 'Kulüp Yöneticisi' :
                                                            'Öğrenci'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {linkedClub ? (
                                                    <span className="flex items-center gap-2">
                                                        <span>{linkedClub.logo}</span>
                                                        <span className="text-slate-600 font-medium">{linkedClub.name}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                {user.role !== 'super_admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* CREATE CLUB MODAL */}
            {isClubModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Yeni Kulüp Ekle</h2>
                            <button onClick={() => setIsClubModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateClub} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Kulüp Adı</label>
                                <input type="text" required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500" value={clubFormData.name} onChange={e => setClubFormData({ ...clubFormData, name: e.target.value })} placeholder="Örn: Havacılık Kulübü" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Slug (URL)</label>
                                    <input type="text" required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500" value={clubFormData.slug} onChange={e => setClubFormData({ ...clubFormData, slug: e.target.value })} placeholder="ornek-kulup" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Logo</label>
                                    <div className="space-y-2">
                                        {/* Image preview or emoji display */}
                                        {clubFormData.logo && (
                                            <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                                                {clubFormData.logo.startsWith('/') || clubFormData.logo.startsWith('http') ? (
                                                    <div className="relative">
                                                        <img
                                                            src={clubFormData.logo}
                                                            alt="Logo"
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setClubFormData({ ...clubFormData, logo: '' })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <span className="text-6xl">{clubFormData.logo}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setClubFormData({ ...clubFormData, logo: '' })}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Upload or emoji input */}
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500"
                                                value={clubFormData.logo.startsWith('/') || clubFormData.logo.startsWith('http') ? '' : clubFormData.logo}
                                                onChange={e => setClubFormData({ ...clubFormData, logo: e.target.value })}
                                                placeholder="✈️ Emoji girin veya resim yükleyin"
                                                disabled={isUploadingLogo || (clubFormData.logo.startsWith('/') || clubFormData.logo.startsWith('http'))}
                                            />
                                            <label className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                    disabled={isUploadingLogo}
                                                />
                                                <div className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors flex items-center justify-center">
                                                    {isUploadingLogo ? (
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    ) : (
                                                        <Upload className="w-5 h-5" />
                                                    )}
                                                </div>
                                            </label>
                                        </div>
                                        <p className="text-xs text-slate-500">💡 Emoji veya resim (maks. 2MB)</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Kategori</label>
                                <input type="text" required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500" value={clubFormData.category} onChange={e => setClubFormData({ ...clubFormData, category: e.target.value })} placeholder="Teknoloji, Sanat, Spor..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Kısa Açıklama</label>
                                <textarea required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 resize-none" rows={3} value={clubFormData.description} onChange={e => setClubFormData({ ...clubFormData, description: e.target.value })} placeholder="Kulüp hakkında kısa bir açıklama..." />
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors">Oluştur</button>
                        </form>
                    </div>
                </div>
            )}

            {/* CREATE USER MODAL */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Yeni Kullanıcı Ekle</h2>
                            <button onClick={() => setIsUserModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Kullanıcı Adı</label>
                                <input type="text" required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" value={userFormData.username} onChange={e => setUserFormData({ ...userFormData, username: e.target.value })} placeholder="kullanici_adi" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Şifre</label>
                                <input type="text" required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" value={userFormData.password} onChange={e => setUserFormData({ ...userFormData, password: e.target.value })} placeholder="Şifre" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                                <select className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" value={userFormData.role} onChange={e => setUserFormData({ ...userFormData, role: e.target.value })}>
                                    <option value="user">Öğrenci / Üye</option>
                                    <option value="club_admin">Kulüp Yöneticisi</option>
                                    <option value="super_admin">Süper Admin</option>
                                </select>
                            </div>
                            {userFormData.role === 'club_admin' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Hangi Kulübü Yönetecek?</label>
                                    <select required className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500" value={userFormData.clubId} onChange={e => setUserFormData({ ...userFormData, clubId: e.target.value })}>
                                        <option value="">Seçiniz...</option>
                                        {clubs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Oluştur</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
