'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'success' | 'warning';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Evet',
    cancelText = 'İptal',
    showCancel = true,
    type = 'info'
}: ConfirmModalProps & { showCancel?: boolean }) {

    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertCircle className="w-6 h-6 text-red-400" />;
            case 'success': return <CheckCircle className="w-6 h-6 text-green-400" />;
            case 'warning': return <AlertCircle className="w-6 h-6 text-orange-400" />;
            default: return <Info className="w-6 h-6 text-blue-400" />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'danger': return 'from-red-600 to-orange-600 shadow-red-500/20';
            case 'success': return 'from-green-600 to-emerald-600 shadow-green-500/20';
            case 'warning': return 'from-orange-600 to-yellow-600 shadow-orange-500/20';
            default: return 'from-blue-600 to-indigo-600 shadow-blue-500/20';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-10 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`p-3 rounded-full bg-slate-800 border border-slate-700`}>
                                    {getIcon()}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        {message}
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex gap-3 mt-6">
                                {showCancel && (
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                                    >
                                        {cancelText}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-white shadow-lg bg-gradient-to-r ${getColors()} hover:scale-[1.02] transition-transform`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
