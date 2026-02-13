'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const STORAGE_KEY = 'thku_popup_dismissed';

export default function HomePopup() {
    const [settings, setSettings] = useState<any>(null);
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings/popup');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);

                if (data.enabled) {
                    const shouldShow = checkShouldShow(data.reappearHours, data.delaySeconds);
                    if (shouldShow) {
                        setTimeout(() => {
                            setVisible(true);
                        }, (data.delaySeconds || 0) * 1000);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch popup settings:', error);
        }
    };

    const checkShouldShow = (reappearHours: number, delaySeconds: number): boolean => {
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

    if (!mounted || !visible || !settings) return null;

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl'
    };

    const animationVariants = {
        fade: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 }
        },
        slideUp: {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 50 }
        },
        slideDown: {
            initial: { opacity: 0, y: -50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -50 }
        },
        none: {
            initial: {},
            animate: {},
            exit: {}
        }
    };

    const currentAnimation = animationVariants[settings.animation as keyof typeof animationVariants] || animationVariants.fade;

    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleDismiss}
                        style={{ backgroundColor: `rgba(0, 0, 0, ${settings.overlayDarkness})` }}
                        className="absolute inset-0"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={currentAnimation.initial}
                        animate={currentAnimation.animate}
                        exit={currentAnimation.exit}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`relative ${sizeClasses[settings.size as keyof typeof sizeClasses]} w-full rounded-2xl shadow-2xl overflow-hidden z-10`}
                    >
                        {settings.imageUrl ? (
                            // Full-width image mode
                            <div className="relative">
                                {settings.imageLink ? (
                                    <a
                                        href={settings.imageLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full"
                                    >
                                        <img
                                            src={settings.imageUrl}
                                            alt={settings.title || settings.description || "THK Üniversitesi Bildirimi"}
                                            className="w-full h-auto object-cover hover:opacity-95 transition-opacity cursor-pointer"
                                        />
                                    </a>
                                ) : (
                                    <img
                                        src={settings.imageUrl}
                                        alt="Popup"
                                        className="w-full h-auto object-cover"
                                    />
                                )}

                                {/* Close button overlay */}
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors backdrop-blur-sm"
                                    aria-label="Kapat"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        ) : (
                            // Text mode (when no image)
                            <div
                                style={{
                                    backgroundColor: settings.backgroundColor,
                                    color: settings.textColor
                                }}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleDismiss}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
                                    aria-label="Kapat"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Content */}
                                <div className="p-6 sm:p-8">
                                    {/* Text Content */}
                                    <div className="text-center space-y-4">
                                        {settings.icon && (
                                            <div className="text-5xl sm:text-6xl">
                                                {settings.icon}
                                            </div>
                                        )}
                                        {settings.title && (
                                            <h2 className="text-2xl sm:text-3xl font-bold">
                                                {settings.title}
                                            </h2>
                                        )}
                                        {settings.description && (
                                            <p className="text-base sm:text-lg opacity-90">
                                                {settings.description}
                                            </p>
                                        )}

                                        {/* CTA Button */}
                                        {settings.ctaText && settings.ctaUrl && (
                                            <div className="pt-4">
                                                <a
                                                    href={settings.ctaUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{
                                                        backgroundColor: settings.buttonColor,
                                                        color: settings.buttonTextColor
                                                    }}
                                                    className="inline-block px-6 py-3 rounded-lg font-bold text-base sm:text-lg hover:opacity-90 transition-opacity"
                                                >
                                                    {settings.ctaText}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
