'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

export type ConfirmType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: ConfirmType;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isAlert?: boolean; // If true, only show confirm button (act as alert)
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    type = 'warning',
    confirmText = 'Onayla',
    cancelText = 'İptal',
    onConfirm,
    onCancel,
    isAlert = false
}: ConfirmModalProps) {

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertTriangle className="w-12 h-12 text-red-500" />;
            case 'warning': return <AlertTriangle className="w-12 h-12 text-orange-500" />;
            case 'success': return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'info': default: return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
            case 'warning': return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500';
            case 'success': return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
            case 'info': default: return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onCancel}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative z-10 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="mb-4 p-3 rounded-full bg-slate-100 dark:bg-slate-800">
                            {getIcon()}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            {title}
                        </h3>

                        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-3 w-full">
                            {!isAlert && (
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className={`flex-1 px-4 py-3 rounded-xl text-white font-bold shadow-lg shadow-current/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${getButtonColor()}`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
