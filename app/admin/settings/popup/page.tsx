'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Save, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupSettings() {
    const [settings, setSettings] = useState({
        enabled: false,
        title: "",
        description: "",
        ctaText: "",
        ctaUrl: "",
        imageUrl: "",
        imageLink: "",
        icon: "🎉",
        backgroundColor: "#ffffff",
        textColor: "#1e293b",
        buttonColor: "#3b82f6",
        buttonTextColor: "#ffffff",
        overlayDarkness: 0.7,
        size: "medium",
        delaySeconds: 5,
        reappearHours: 48,
        animation: "scale"
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
            const res = await fetch('/api/settings/popup');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch popup settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings/popup', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Popup ayarları kaydedildi!');
            }
        } catch (error) {
            alert('Kaydetme başarısız oldu.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Lütfen geçerli bir resim dosyası seçin (JPG, PNG, GIF, WebP)');
            return;
        }

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

    const sizeClasses = {
        small: "max-w-md",
        medium: "max-w-xl",
        large: "max-w-3xl"
    };

    if (loading) return <div className="p-8">Yükleniyor...</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                        Popup Ayarları
                    </h1>
                    <p className="text-slate-500 mt-1">Ziyaretçilere gösterilecek popup'ı özelleştirin</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-2 transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        Önizleme
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
                                <h3 className="font-bold text-slate-800">Popup Durumu</h3>
                                <p className="text-sm text-slate-500">Popup'ı aktif veya pasif yapın</p>
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
                                placeholder="🎉"
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                            <input
                                type="text"
                                value={settings.title}
                                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                placeholder="Hoş Geldiniz!"
                                maxLength={100}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama</label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                placeholder="Popup açıklaması..."
                                rows={4}
                                maxLength={300}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Görsel (Opsiyonel)</label>
                            <div className="space-y-3">
                                {/* Upload button */}
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="popup-image-upload"
                                    />
                                    <label
                                        htmlFor="popup-image-upload"
                                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
                                    >
                                        {uploading ? 'Yükleniyor...' : '📤 Resim Yükle'}
                                    </label>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG, GIF, WebP (maks 5MB) • Önerilen: 800x600px veya kare</p>
                                </div>
                                {/* Or URL input */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">veya URL girin:</label>
                                    <input
                                        type="url"
                                        value={settings.imageUrl}
                                        onChange={(e) => setSettings({ ...settings, imageUrl: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                {/* Image preview */}
                                {settings.imageUrl && (
                                    <div className="flex items-center gap-2">
                                        <img src={settings.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
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
                                            value={settings.imageLink || ''}
                                            onChange={(e) => setSettings({ ...settings, imageLink: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {!settings.imageUrl && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">CTA Butonu Metni</label>
                                    <input
                                        type="text"
                                        value={settings.ctaText}
                                        onChange={(e) => setSettings({ ...settings, ctaText: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                        placeholder="Başla"
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
                        )}
                    </div>

                    {/* Design Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 mb-4">Tasarım</h3>
                        <ColorPicker
                            label="Arkaplan Rengi"
                            value={settings.backgroundColor}
                            onChange={(val: string) => setSettings({ ...settings, backgroundColor: val })}
                        />
                        {!settings.imageUrl && (
                            <>
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
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Overlay Koyuluğu</label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.overlayDarkness}
                                onChange={(e) => setSettings({ ...settings, overlayDarkness: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Açık</span>
                                <span>{Math.round(settings.overlayDarkness * 100)}%</span>
                                <span>Koyu</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-3">Boyut</label>
                            <div className="flex gap-4">
                                {['small', 'medium', 'large'].map((size) => (
                                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            checked={settings.size === size}
                                            onChange={() => setSettings({ ...settings, size })}
                                            className="w-4 h-4"
                                        />
                                        <span className="text-sm font-medium capitalize">{size === 'small' ? 'Küçük' : size === 'medium' ? 'Orta' : 'Büyük'}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Animasyon</label>
                            <select
                                value={settings.animation}
                                onChange={(e) => setSettings({ ...settings, animation: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                            >
                                <option value="scale">Büyüme</option>
                                <option value="fade">Solma</option>
                                <option value="slide">Kayma</option>
                            </select>
                        </div>
                    </div>

                    {/* Timing Section */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
                        <h3 className="font-bold text-slate-800 mb-4">Zamanlama</h3>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Gecikme Süresi (saniye)</label>
                            <input
                                type="number"
                                value={settings.delaySeconds}
                                onChange={(e) => setSettings({ ...settings, delaySeconds: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                min="0"
                            />
                            <p className="text-xs text-slate-500 mt-1">Sayfa açıldıktan kaç saniye sonra popup gösterilsin?</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tekrar Gösterim Süresi (saat)</label>
                            <input
                                type="number"
                                value={settings.reappearHours}
                                onChange={(e) => setSettings({ ...settings, reappearHours: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                                min="1"
                            />
                            <p className="text-xs text-slate-500 mt-1">Popup kapatıldıktan sonra kaç saat sonra tekrar gösterilsin?</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Placeholder */}
                <div className="lg:sticky lg:top-8 h-fit">
                    <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4">Bilgi</h3>
                        <div className="space-y-3 text-sm text-slate-600">
                            <p>✅ Popup ana sayfada otomatik gösterilecektir</p>
                            <p>⏱️ Belirlediğiniz süre sonunda açılır</p>
                            <p>🔄 Kapatıldıktan sonra tekrar gösterim süresi sonunda yeniden görünür</p>
                            <p>💾 Kapatma durumu tarayıcıda saklanır</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && settings.enabled && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPreview(false)}
                            style={{ backgroundColor: `rgba(0, 0, 0, ${settings.overlayDarkness})` }}
                            className="absolute inset-0"
                        />
                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: settings.animation === 'scale' ? 0.95 : 1,
                                y: settings.animation === 'slide' ? 20 : 0
                            }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{
                                opacity: 0,
                                scale: settings.animation === 'scale' ? 0.95 : 1,
                                y: settings.animation === 'slide' ? 20 : 0
                            }}
                            style={{
                                backgroundColor: settings.backgroundColor,
                                color: settings.textColor
                            }}
                            className={`relative ${sizeClasses[settings.size as keyof typeof sizeClasses]} w-full rounded-2xl shadow-2xl overflow-hidden z-10`}
                        >
                            {settings.imageUrl ? (
                                // Image Mode Preview
                                <div className="relative">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm z-20"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                    <img
                                        src={settings.imageUrl}
                                        alt="Popup Preview"
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ) : (
                                // Text Mode Preview
                                <div className="p-6">
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="absolute top-4 right-4 p-1 opacity-50 hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    <div className="text-center space-y-4">
                                        {settings.icon && <div className="text-5xl">{settings.icon}</div>}
                                        {settings.title && <h2 className="text-2xl font-bold">{settings.title}</h2>}
                                        {settings.description && <p className="text-lg opacity-80">{settings.description}</p>}
                                        {settings.ctaText && settings.ctaUrl && (
                                            <button
                                                style={{
                                                    backgroundColor: settings.buttonColor,
                                                    color: settings.buttonTextColor
                                                }}
                                                className="px-6 py-3 rounded-xl font-bold"
                                            >
                                                {settings.ctaText}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
