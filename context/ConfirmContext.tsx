'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import ConfirmModal, { ConfirmType } from '@/components/ui/ConfirmModal';

interface ConfirmOptions {
    title?: string;
    message: string; // Required
    type?: ConfirmType;
    confirmText?: string;
    cancelText?: string;
}

interface ConfirmContextType {
    showConfirm: (options: string | ConfirmOptions) => Promise<boolean>;
    showAlert: (message: string, type?: ConfirmType, title?: string) => Promise<void>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions>({ message: '' });
    const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => { });
    const [isAlert, setIsAlert] = useState(false);

    const showConfirm = (opts: string | ConfirmOptions): Promise<boolean> => {
        const finalOptions = typeof opts === 'string' ? { message: opts } : opts;

        setOptions({
            title: 'Onay Gerekli',
            type: 'warning',
            confirmText: 'Evet',
            cancelText: 'Hayır',
            ...finalOptions
        });
        setIsAlert(false);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const showAlert = (message: string, type: ConfirmType = 'info', title?: string): Promise<void> => {
        setOptions({
            title: title || (type === 'danger' ? 'Hata' : type === 'success' ? 'Başarılı' : 'Bilgi'),
            message,
            type,
            confirmText: 'Tamam',
        });
        setIsAlert(true);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolvePromise(() => () => resolve()); // Alerts just resolve when closed
        });
    };

    const handleConfirm = () => {
        setIsOpen(false);
        resolvePromise(true);
    };

    const handleCancel = () => {
        setIsOpen(false);
        resolvePromise(false);
    };

    return (
        <ConfirmContext.Provider value={{ showConfirm, showAlert }}>
            {children}
            <ConfirmModal
                isOpen={isOpen}
                title={options.title || ''}
                message={options.message}
                type={options.type || 'info'}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                isAlert={isAlert}
            />
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context;
}
