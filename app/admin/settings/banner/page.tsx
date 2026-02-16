'use client';

import { useState, useEffect } from 'react';
import { Monitor, Save, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BannerSettings() {
    const [settings, setSettings] = useState({
        enabled: false,
        title: "",
        description: "",
        ctaText: "",
        ctaUrl: "",
        icon: "📢",
        imageUrl: "",
        imageLink: "",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        buttonColor: "#1e40af",
        buttonTextColor: "#ffffff",
        position: "top",
        dismissible: true,
        reappearHours: 24,
        animation: "slide"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/banner');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch banner settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings/banner', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            const data = await res.json();

            if (res.ok) {
                alert('Banner ayarları kaydedildi!');
            } else {
                alert(`Kaydetme başarısız: ${data.error || 'Bilinmeyen hata'}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Kaydetme başarısız oldu.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, WebP)');
            return;
        }

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('Dosya boyutu 5MB\'den küçük olmalıdır');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setSettings({ ...settings, imageUrl: data.url });
            } else {
                alert('Resim yüklenemedi');
            }
        } catch (error) {
            alert('Resim yüklenirken hata oluştu');
        } finally {
            setUploading(false);
        }
    };

    const ColorPicker = ({ label, value, onChange }: any) => (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">{label}</label>
            <div className="flex gap-3 items-center">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-10 rounded cursor-pointer border-2 border-slate-200"
                />
                <div
                    style={{ backgroundColor: value }}
                    className="w-10 h-10 rounded border-2 border-slate-200"
                />
                <span className="text-sm font-mono text-slate-600">{value}</span>
            </div>
        </div>
    );

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <Monitor className="w-8 h-8 text-blue-600" />
                        Banner Ayarları
                    </h1>
                    <p className="text-slate-500 mt-1">Ana sayfada gösterilen banner'ı özelleştirin</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Önizlemeyi Kapat' : 'Önizleme'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Settings */}
                <div className="space-y-6">
                    {/* Enable/Disable Toggle */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800">Banner Durumu</h3>
                                <p className="text-sm text-slate-500">Banner'ı aktif veya pasif yapın</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.enabled ? 'translate-x-8' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 mb-4">İçerik</h3>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">İkon (Emoji)</label>
                            <input
                                type="text"
                                value={settings.icon}
                                onChange={(e) => setSettings({ ...settings, icon: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                placeholder="📢"
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Resim/GIF</label>
                            <div className="space-y-3">
                                {/* Upload button */}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="banner-image-upload"
                                    />
                                    <label
                                        htmlFor="banner-image-upload"
                                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors disabled:opacity-50"
                                    >
                                        {uploading ? 'Yükleniyor...' : '📤 Resim Yükle'}
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF, WebP (maks 5MB)</p>
                                </div>
                                {/* Or URL input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">veya URL girin:</label>
                                    <input
                                        type="url"
                                        value={settings.imageUrl}
                                        onChange={(e) => setSettings({ ...settings, imageUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                        placeholder="https://example.com/image.gif"
                                    />
                                </div>
                                {/* Image preview */}
                                {settings.imageUrl && (
                                    <div className="flex items-center gap-2">
                                        <img src={settings.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                                        <button
                                            onClick={() => setSettings({ ...settings, imageUrl: '' })}
                                            className="text-xs text-red-600 hover:text-red-700"
                                        >
                                            Kaldır
                                        </button>
                                    </div>
                                )}
                                {/* Image link */}
                                {settings.imageUrl && (
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 mb-1">Resme tıklanınca gidilecek link (opsiyonel):</label>
                                        <input
                                            type="url"
                                            value={settings.imageLink}
                                            onChange={(e) => setSettings({ ...settings, imageLink: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                placeholder="Önemli Duyuru!"
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama</label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                placeholder="Banner açıklaması..."
                                rows={3}
                                maxLength={200}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">CTA Butonu Metni</label>
                                <input
                                    type="text"
                                    value={settings.ctaText}
                                    onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    placeholder="Detaylar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">CTA URL</label>
                                <input
                                    type="url"
                                    value={settings.ctaUrl}
                                    onChange={(e) => setSettings({ ...settings, ctaUrl: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Design Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 mb-4">Tasarım</h3>
                        <ColorPicker
                            label="Arkaplan Rengi"
                            value={settings.backgroundColor}
                            onChange={(val: string) => setSettings({ ...settings, backgroundColor: val })}
                        />
                        <ColorPicker
                            label="Yazı Rengi"
                            value={settings.textColor}
                            onChange={(val: string) => setSettings({ ...settings, textColor: val })}
                        />
                        <ColorPicker
                            label="Buton Rengi"
                            value={settings.buttonColor}
                            onChange={(val: string) => setSettings({ ...settings, buttonColor: val })}
                        />
                        <ColorPicker
                            label="Buton Yazı Rengi"
                            value={settings.buttonTextColor}
                            onChange={(val: string) => setSettings({ ...settings, buttonTextColor: val })}
                        />

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Pozisyon</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={settings.position === 'top'}
                                        onChange={() => setSettings({ ...settings, position: 'top' })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Üst</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        checked={settings.position === 'bottom'}
                                        onChange={() => setSettings({ ...settings, position: 'bottom' })}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium">Alt</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Animasyon</label>
                            <select
                                value={settings.animation}
                                onChange={(e) => setSettings({ ...settings, animation: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            >
                                <option value="slide">Kayma</option>
                                <option value="fade">Solma</option>
                                <option value="none">Animasyonsuz</option>
                            </select>
                        </div>
                    </div>

                    {/* Behavior Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 mb-4">Davranış</h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-800">Kapatılabilir</p>
                                <p className="text-sm text-slate-500">Kullanıcılar kapatabilir mi?</p>
                            </div>
                            <button
                                onClick={() => setSettings({ ...settings, dismissible: !settings.dismissible })}
                                className={`relative w-14 h-7 rounded-full transition-colors ${settings.dismissible ? 'bg-green-500' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.dismissible ? 'translate-x-8' : 'translate-x-1'}`} />
                            </button>
                        </div>
                        {settings.dismissible && (
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Tekrar Gösterim Süresi (saat)</label>
                                <input
                                    type="number"
                                    value={settings.reappearHours}
                                    onChange={(e) => setSettings({ ...settings, reappearHours: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                    min="1"
                                />
                                <p className="text-xs text-slate-500 mt-1">Banner kapatıldıktan sonra kaç saat sonra tekrar gösterilsin?</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Live Preview */}
                {showPreview && (
                    <div className="sticky top-8">
                        <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4">Canlı Önizleme</h3>
                            <div className="bg-white rounded-xl overflow-hidden shadow-lg relative">
                                {settings.enabled ? (
                                    settings.imageUrl ? (
                                        // Image Banner Preview
                                        <div className="relative w-full h-32 group">
                                            <img
                                                src={settings.imageUrl}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            {settings.dismissible && (
                                                <button className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full">
                                                    <X className="w-4 h-4 text-white" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        // Text Banner Preview
                                        <motion.div
                                            initial={{ opacity: 0, y: settings.animation === 'slide' ? -20 : 0 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                backgroundColor: settings.backgroundColor,
                                                color: settings.textColor
                                            }}
                                            className="p-4 flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                {settings.icon && <span className="text-2xl">{settings.icon}</span>}
                                                <div className="flex-1">
                                                    {settings.title && <div className="font-bold">{settings.title}</div>}
                                                    {settings.description && <div className="text-sm opacity-90 mt-0.5">{settings.description}</div>}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {settings.ctaText && settings.ctaUrl && (
                                                    <button
                                                        style={{
                                                            backgroundColor: settings.buttonColor,
                                                            color: settings.buttonTextColor
                                                        }}
                                                        className="px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap"
                                                    >
                                                        {settings.ctaText}
                                                    </button>
                                                )}
                                                {settings.dismissible && (
                                                    <button className="p-1 opacity-70 hover:opacity-100">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        Banner devre dışı
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
