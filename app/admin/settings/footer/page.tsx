'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, Layout, Type, Link as LinkIcon, Facebook, Twitter, Instagram, Linkedin, Globe } from 'lucide-react';

interface FooterItem {
    label: string;
    url: string;
}

interface FooterColumn {
    id: string;
    type: 'links' | 'text';
    title: string;
    items: FooterItem[];
}

interface FooterSettings {
    brand: {
        title: string;
        description: string;
    };
    columns: FooterColumn[];
    socials: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
    };
    copyright: string;
}

export default function FooterSettingsPage() {
    const [settings, setSettings] = useState<FooterSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/footer');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Failed to fetch settings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        try {
            await fetch('/api/settings/footer', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            // Optional: Show success notification
        } catch (error) {
            console.error('Failed to save settings', error);
        } finally {
            setIsSaving(false);
        }
    };

    const addColumn = () => {
        if (!settings) return;
        const newCol: FooterColumn = {
            id: `col-${Date.now()}`,
            type: 'links',
            title: 'Yeni Sütun',
            items: []
        };
        setSettings({ ...settings, columns: [...settings.columns, newCol] });
    };

    const removeColumn = (index: number) => {
        if (!settings) return;
        const newCols = [...settings.columns];
        newCols.splice(index, 1);
        setSettings({ ...settings, columns: newCols });
    };

    const updateColumn = (index: number, updates: Partial<FooterColumn>) => {
        if (!settings) return;
        const newCols = [...settings.columns];
        newCols[index] = { ...newCols[index], ...updates };
        setSettings({ ...settings, columns: newCols });
    };

    const addItemToColumn = (colIndex: number) => {
        if (!settings) return;
        const newCols = [...settings.columns];
        newCols[colIndex].items.push({ label: 'Yeni Link', url: '#' });
        setSettings({ ...settings, columns: newCols });
    };

    const removeItemFromColumn = (colIndex: number, itemIndex: number) => {
        if (!settings) return;
        const newCols = [...settings.columns];
        newCols[colIndex].items.splice(itemIndex, 1);
        setSettings({ ...settings, columns: newCols });
    };

    const updateItemInColumn = (colIndex: number, itemIndex: number, updates: Partial<FooterItem>) => {
        if (!settings) return;
        const newCols = [...settings.columns];
        newCols[colIndex].items[itemIndex] = { ...newCols[colIndex].items[itemIndex], ...updates };
        setSettings({ ...settings, columns: newCols });
    };

    if (isLoading || !settings) return <div>Yükleniyor...</div>;

    return (
        <div className="space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Footer Düzenle</h1>
                    <p className="text-slate-500">Site alt bölümünü özelleştirin</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {/* Brand Info */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Marka Bilgileri
                </h2>
                <div className="grid gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                        <input
                            type="text"
                            value={settings.brand.title}
                            onChange={(e) => setSettings({ ...settings, brand: { ...settings.brand, title: e.target.value } })}
                            className="w-full px-4 py-2 border rounded-xl"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                        <textarea
                            value={settings.brand.description}
                            onChange={(e) => setSettings({ ...settings, brand: { ...settings.brand, description: e.target.value } })}
                            className="w-full px-4 py-2 border rounded-xl h-24"
                        />
                    </div>
                </div>
            </section>

            {/* Columns */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-blue-600" />
                        Sütunlar ({settings.columns.length})
                    </h2>
                    <button onClick={addColumn} className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                        <Plus className="w-4 h-4" /> Sütun Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {settings.columns.map((col, colIndex) => (
                        <motion.div
                            key={col.id}
                            layout
                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group"
                        >
                            <button
                                onClick={() => removeColumn(colIndex)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={col.title}
                                        onChange={(e) => updateColumn(colIndex, { title: e.target.value })}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tip</label>
                                    <select
                                        value={col.type}
                                        onChange={(e) => updateColumn(colIndex, { type: e.target.value as 'links' | 'text' })}
                                        className="w-full px-3 py-1.5 border rounded-lg text-sm"
                                    >
                                        <option value="links">Link Listesi</option>
                                        <option value="text">Düz Metin / İletişim</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {col.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex gap-2 items-start group/item">
                                        <div className="flex-1 space-y-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover/item:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                                <Type className="w-3 h-3 text-slate-400" />
                                                <input
                                                    placeholder="Görünen Metin (Örn: Hakkımızda)"
                                                    value={item.label}
                                                    onChange={(e) => updateItemInColumn(colIndex, itemIndex, { label: e.target.value })}
                                                    className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-slate-300"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
                                                <LinkIcon className="w-3 h-3 text-slate-400" />
                                                <input
                                                    placeholder="URL / Link (Boş bırakılabilir)"
                                                    value={item.url}
                                                    onChange={(e) => updateItemInColumn(colIndex, itemIndex, { url: e.target.value })}
                                                    className="flex-1 bg-transparent text-xs font-mono text-slate-500 focus:outline-none placeholder:text-slate-300"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItemFromColumn(colIndex, itemIndex)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                            title="Öğeyi Sil"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addItemToColumn(colIndex)}
                                    className="w-full py-2 border-2 border-dashed border-slate-100 rounded-lg text-slate-400 hover:border-slate-300 hover:text-slate-600 text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Öğe Ekle
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Socials */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Sosyal Medya Linkleri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Facebook className="w-5 h-5 text-blue-600" />
                        <input
                            placeholder="Facebook URL"
                            value={settings.socials.facebook}
                            onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, facebook: e.target.value } })}
                            className="flex-1 px-4 py-2 border rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Twitter className="w-5 h-5 text-sky-500" />
                        <input
                            placeholder="Twitter URL"
                            value={settings.socials.twitter}
                            onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, twitter: e.target.value } })}
                            className="flex-1 px-4 py-2 border rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Instagram className="w-5 h-5 text-pink-600" />
                        <input
                            placeholder="Instagram URL"
                            value={settings.socials.instagram}
                            onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, instagram: e.target.value } })}
                            className="flex-1 px-4 py-2 border rounded-xl"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Linkedin className="w-5 h-5 text-blue-800" />
                        <input
                            placeholder="LinkedIn URL"
                            value={settings.socials.linkedin}
                            onChange={(e) => setSettings({ ...settings, socials: { ...settings.socials, linkedin: e.target.value } })}
                            className="flex-1 px-4 py-2 border rounded-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Copyright */}
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    Copyright Metni
                </h2>
                <input
                    type="text"
                    value={settings.copyright}
                    onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl font-mono text-sm"
                />
            </section>
        </div>
    );
}
