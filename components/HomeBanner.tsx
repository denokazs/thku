'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

const STORAGE_KEY = 'thku_banner_dismissed';

export default function HomeBanner() {
    const [settings, setSettings] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/banner');
            if (res.ok) {
                const data = await res.json();
                console.log('Banner settings:', data);
                setSettings(data);

                // Check if should show based on localStorage
                if (data.enabled) {
                    const shouldShow = checkShouldShow(data.reappearHours);
                    console.log('Should show banner:', shouldShow);
                    setVisible(shouldShow);
                }
            }
        } catch (error) {
            console.error('Failed to fetch banner settings:', error);
        }
    };

    const checkShouldShow = (reappearHours: number): boolean => {
        if (typeof window === 'undefined') return false;

        const dismissedTime = localStorage.getItem(STORAGE_KEY);
        if (!dismissedTime) return true;

        const dismissed = new Date(dismissedTime).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - dismissed) / (1000 * 60 * 60);

        return hoursPassed >= reappearHours;
    };

    const handleDismiss = () => {
        localStorage.setItem(STORAGE_KEY, new Date().toISOString());
        setVisible(false);
    };

    // Don't render until mounted (client-side only)
    if (!mounted || !visible || !settings) return null;

    const animationVariants = {
        slide: {
            initial: { y: settings.position === 'top' ? -100 : 100, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            exit: { y: settings.position === 'top' ? -100 : 100, opacity: 0 }
        },
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 }
        },
        none: {
            initial: {},
            animate: {},
            exit: {}
        }
    };

    const currentAnimation = animationVariants[settings.animation as keyof typeof animationVariants] || animationVariants.slide;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={currentAnimation.initial}
                    animate={currentAnimation.animate}
                    exit={currentAnimation.exit}
                    transition={{ duration: 0.3 }}
                    className="w-full fixed top-20 left-0 right-0 z-40 shadow-lg overflow-hidden"
                >
                    {settings.imageUrl ? (
                        // Full-width image banner mode
                        <div className="relative w-full h-20 sm:h-24 md:h-32">
                            {settings.imageLink ? (
                                <a
                                    href={settings.imageLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full h-full relative"
                                >
                                    <Image
                                        src={settings.imageUrl}
                                        alt={settings.title || settings.description || "THK Üniversitesi Duyurusu"}
                                        fill
                                        priority
                                        sizes="100vw"
                                        className="object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                    />
                                </a>
                            ) : (
                                <Image
                                    src={settings.imageUrl}
                                    alt="Banner"
                                    fill
                                    priority
                                    sizes="100vw"
                                    className="object-cover"
                                />
                            )}

                            {/* Dismiss button overlay */}
                            {settings.dismissible && (
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full transition-colors flex-shrink-0 backdrop-blur-sm"
                                    aria-label="Kapat"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>
                    ) : (
                        // Text mode banner (when no image)
                        <div
                            style={{
                                backgroundColor: settings.backgroundColor,
                                color: settings.textColor
                            }}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                                <div className="flex items-center justify-between gap-4">
                                    {/* Left: Icon + Content */}
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {settings.icon && (
                                            <span className="text-2xl flex-shrink-0">{settings.icon}</span>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            {settings.title && (
                                                <div className="font-bold text-sm sm:text-base truncate">
                                                    {settings.title}
                                                </div>
                                            )}
                                            {settings.description && (
                                                <div
                                                    className="text-xs sm:text-sm opacity-90 mt-0.5 line-clamp-1"
                                                    dangerouslySetInnerHTML={{ __html: settings.description }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {/* Right: CTA + Close */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {settings.ctaText && settings.ctaUrl && (
                                            <a
                                                href={settings.ctaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    backgroundColor: settings.buttonColor,
                                                    color: settings.buttonTextColor
                                                }}
                                                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold text-xs sm:text-sm whitespace-nowrap hover:opacity-90 transition-opacity"
                                            >
                                                {settings.ctaText}
                                            </a>
                                        )}
                                        {settings.dismissible && (
                                            <button
                                                onClick={handleDismiss}
                                                className="p-1.5 opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
                                                aria-label="Kapat"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
