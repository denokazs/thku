'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Save, X, User } from 'lucide-react';
import { useConfirm } from '@/context/ConfirmContext';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [clubs, setClubs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state
    const [search, setSearch] = useState('');
    const { showConfirm, showAlert } = useConfirm();

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<{
        id: number;
        name: string;
        username: string;
        email: string;
        phone: string;
        studentId: string;
        role: string;
        clubId?: number;
        password: string;
    }>({
        id: 0,
        name: '',
        username: '',
        email: '',
        phone: '',
        studentId: '',
        role: 'user',
        clubId: undefined,
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchClubs();
    }, []);

    const fetchUsers = async () => {
        try {
            setError(null);
            const res = await fetch('/api/users', {
                credentials: 'include',
                cache: 'no-store'
            });
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || `HTTP ${res.status}`);
            }
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error: any) {
            console.error('Failed to fetch users:', error);
            setError(error.message || 'Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClubs = async () => {
        try {
            const res = await fetch('/api/clubs');
            const data = await res.json();
            setClubs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to fetch clubs:', error);
        }
    };

    const handleDelete = async (id: number) => {
        const isConfirmed = await showConfirm({
            title: 'Kullanıcı Silme Onayı',
            message: 'Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.',
            type: 'danger',
            confirmText: 'Sil',
            cancelText: 'Vazgeç'
        });

        if (!isConfirmed) return;

        try {
            // Use POST /delete to bypass cPanel restrictions on DELETE method
            const res = await fetch('/api/users/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                setUsers(users.filter(u => u.id !== id));
            } else {
                const err = await res.json();
                await showAlert(err.error || 'Silme işlemi başarısız.', 'danger');
            }
        } catch (error: any) {
            await showAlert(error.message || 'Hata oluştu.', 'danger');
        }
    };

    const handleEdit = (user: any) => {
        setFormData({ ...user, password: '' }); // Don't show password, allow reset
        setIsEditing(true);
        setShowModal(true);
    };

    const handleCreate = () => {
        setFormData({
            id: 0,
            name: '',
            username: '',
            email: '',
            phone: '',
            studentId: '',
            role: 'user',
            clubId: undefined,
            password: ''
        });
        setIsEditing(false);
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.password && formData.password.length < 8) {
            await showAlert('Şifre en az 8 karakter olmalıdır.', 'warning');
            setIsSubmitting(false);
            return;
        }

        try {
            const url = '/api/users';
            const method = isEditing ? 'PUT' : 'POST';

            // Should hash password in backend, but for now passing plain
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchUsers();
                setShowModal(false);
                await showAlert(isEditing ? 'Kullanıcı güncellendi.' : 'Kullanıcı oluşturuldu.', 'success');
            } else {
                const err = await res.json();
                await showAlert(err.error || 'İşlem başarısız.', 'danger');
            }
        } catch (error) {
            await showAlert('Hata oluştu.', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Kullanıcı Yönetimi</h1>
                <button
                    onClick={handleCreate}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-5 h-5" /> Yeni Kullanıcı
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Kullanıcı adı, isim veya e-posta ara..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium text-slate-800"
                />
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="p-4">Kullanıcı</th>
                            <th className="p-4">İletişim</th>
                            <th className="p-4">Rol</th>
                            <th className="p-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Yükleniyor...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={4} className="p-8 text-center text-red-500 font-bold">Hata: {error}</td></tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-500">Kullanıcı bulunamadı.</td></tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">{user.name || 'İsimsiz'}</div>
                                                <div className="text-xs text-slate-500">@{user.username}</div>
                                                {user.studentId && <div className="text-xs text-blue-500 font-medium">#{user.studentId}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-slate-600">{user.email}</div>
                                        <div className="text-xs text-slate-400">{user.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <div>
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.role === 'super_admin' ? 'bg-red-100 text-red-600' :
                                                user.role === 'club_admin' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                            {user.role === 'club_admin' && user.clubId && (
                                                <div className="text-xs text-slate-500 mt-1">
                                                    🏛️ {clubs.find(c => c.id === user.clubId)?.name || `Kulüp #${user.clubId}`}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(user)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>

                                            {/* Hide delete for Root Admin */}
                                            {String(user.id) !== '1' && user.username !== 'admin' && (
                                                <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-100 rounded-lg text-slate-500 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                                <h2 className="text-xl font-bold text-slate-800">{isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Ad Soyad</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Kullanıcı Adı</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.username}
                                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Öğrenci No (Opsiyonel)</label>
                                        <input
                                            type="text"
                                            value={formData.studentId}
                                            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">E-posta</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Telefon</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Rol</label>
                                        <select
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        >
                                            <option value="user">Öğrenci / Kullanıcı</option>
                                            <option value="club_admin">Kulüp Yöneticisi</option>
                                            <option value="super_admin">Süper Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Şifre {isEditing && '(Boş Bırakılabilir)'}</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={isEditing ? '••••••••' : ''}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Club Selection - Only for club_admin */}
                                {formData.role === 'club_admin' && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                        <label className="block text-sm font-bold text-orange-700 mb-2">Yönetilen Kulüp *</label>
                                        <select
                                            required
                                            value={formData.clubId || ''}
                                            onChange={e => setFormData({ ...formData, clubId: e.target.value ? parseInt(e.target.value) : undefined })}
                                            className="w-full bg-white border border-orange-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                                        >
                                            <option value="">Kulüp Seçiniz...</option>
                                            {clubs.map(club => (
                                                <option key={club.id} value={club.id}>
                                                    {club.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-orange-600 mt-2">💡 Bu kullanıcı sadece seçilen kulübü yönetebilecektir.</p>
                                    </div>
                                )}

                                <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 rounded-xl font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
